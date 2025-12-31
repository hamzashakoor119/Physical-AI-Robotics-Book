from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, AsyncGenerator
from app.utils.qdrant_client import get_qdrant_client
from app.utils.embeddings import get_embeddings
from app.utils.translation import translate_response_with_context, translate_to_urdu
from app.utils.cache import get_cached_response, cache_response
from app.utils.intent_detector import detect_intent, is_greeting, is_book_related
from app.utils.conversation_manager import (
    get_or_create_session, update_session,
    generate_greeting_response, generate_name_response,
    generate_farewell_response, format_response_with_name
)
from app.utils.web_search import (
    is_web_search_available, search_web,
    format_search_results, generate_knowledge_note
)
from app.models.vector_schema import RAGQuery, RAGResponse, TextSelection, UserBackground
import os
import json
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Lazy OpenAI client initialization (singleton)
_openai_client = None


def get_openai_client():
    """Get or initialize OpenAI client lazily."""
    global _openai_client
    if _openai_client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return None
        from openai import OpenAI
        _openai_client = OpenAI(api_key=api_key)
    return _openai_client


def generate_response_with_openai(
    context_texts: List[str],
    question: str,
    user_background: Optional[dict] = None,
    stream: bool = False
):
    """
    Generate a response using OpenAI based on the retrieved context.
    Supports both streaming and non-streaming modes.
    """
    if not context_texts:
        return "I couldn't find any relevant information in the textbook to answer your question."

    # Build the context string (limit to top 3 for speed)
    context_str = "\n\n".join(context_texts[:3])

    # Create a prompt that includes user background if available
    if user_background:
        background_str = f"User background: Software experience: {user_background.get('software_experience', 'N/A')}, Hardware experience: {user_background.get('hardware_experience', 'N/A')}, Robotics knowledge: {user_background.get('robotics_knowledge', 'N/A')}. "
        background_str += "Please tailor your response to match the user's experience level.\n\n"
    else:
        background_str = ""

    # Build the full prompt
    prompt = f"""{background_str}Context information from the textbook:
    {context_str}

    Please answer the following question based on the context provided: {question}

    If the context doesn't contain enough information to answer the question, please say so and provide any related information that might be helpful."""

    try:
        client = get_openai_client()
        if client is None:
            return f"OpenAI API key not configured. Based on the textbook content: {context_str[:500]}..."

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI assistant for a Physical AI and Humanoid Robotics textbook. Provide accurate, helpful answers based on the textbook content. Be concise but informative. Use a friendly, conversational tone."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7,
            stream=stream
        )

        if stream:
            return response  # Return the stream object
        else:
            return response.choices[0].message.content

    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
        return f"Based on the textbook content, here's information related to your question: '{question}'. [Note: OpenAI API call failed, showing context instead] Context: {context_str[:500]}..."


def generate_general_response(question: str, user_background: Optional[dict] = None) -> str:
    """Generate response for non-book questions using general knowledge."""
    try:
        client = get_openai_client()
        if client is None:
            return "I apologize, but I can't process this request right now. The AI service is not configured."

        background_note = ""
        if user_background:
            background_note = f"The user has {user_background.get('robotics_knowledge', 'basic')} robotics knowledge."

        prompt = f"""{background_note}

The user asked: {question}

This question is not directly from the Physical AI & Humanoid Robotics textbook.
Please provide a helpful answer from your general knowledge.
Be clear, friendly, and concise.
If the topic is related to robotics or AI, try to connect it to concepts from the field."""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant. When answering questions outside the textbook scope, be helpful but note that you're using general knowledge, not the textbook content."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )

        answer = response.choices[0].message.content
        return f"This question is outside the textbook content, but I'm happy to help!\n\n{answer}"

    except Exception as e:
        print(f"Error in general response: {e}")
        return "I apologize, but I couldn't process your question. Please try again."


class ChatRequest(BaseModel):
    """Enhanced chat request with session support."""
    message: str
    session_id: Optional[str] = None
    user_background: Optional[UserBackground] = None
    top_k: int = 3  # Reduced default for speed


class ChatResponse(BaseModel):
    """Enhanced chat response."""
    message: str
    session_id: str
    intent: str
    sources: List[str] = []
    has_web_context: bool = False


class TranslationRequest(BaseModel):
    text: str
    target_language: str = "ur"


class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    target_language: str


@router.post("/rag/chat", response_model=ChatResponse)
async def smart_chat(request: ChatRequest):
    """
    Smart chat endpoint with greeting detection, intent classification,
    and appropriate response routing.
    """
    try:
        # Get or create session
        session = get_or_create_session(request.session_id)
        message = request.message.strip()
        language = request.user_background.preferred_language if request.user_background else "en"

        # Check cache first
        cached = get_cached_response(message, language)
        if cached:
            return ChatResponse(
                message=cached,
                session_id=session.session_id,
                intent="cached",
                sources=[]
            )

        # Detect intent
        intent, confidence = detect_intent(message)

        # Handle based on intent
        if intent == "greeting":
            response_text = generate_greeting_response(session, message)
            update_session(session.session_id, greeted=True, asked_name=True)

        elif intent == "farewell":
            response_text = generate_farewell_response(session)

        elif intent == "name_response" and session.asked_name and not session.user_name:
            response_text = generate_name_response(session, message)
            update_session(session.session_id, user_name=message.strip().title())

        elif intent == "book_question" or is_book_related(message):
            # Use RAG for book questions
            response_text = await _handle_book_question(
                message, request.user_background, request.top_k
            )
            update_session(session.session_id)

        else:
            # General question - try to help anyway
            response_text = generate_general_response(
                message,
                request.user_background.dict() if request.user_background else None
            )

            # Add web search if available
            if is_web_search_available():
                search_results = await search_web(message, num_results=3)
                if search_results:
                    response_text += format_search_results(search_results)
            else:
                response_text += generate_knowledge_note(False)

            update_session(session.session_id)

        # Translate if needed
        if language == "ur":
            response_text = translate_to_urdu(response_text)

        # Personalize with name occasionally
        response_text = format_response_with_name(session, response_text)

        # Cache the response
        cache_response(message, response_text, language)

        return ChatResponse(
            message=response_text,
            session_id=session.session_id,
            intent=intent,
            sources=[],
            has_web_context=is_web_search_available()
        )

    except Exception as e:
        print(f"Error in smart_chat: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


async def _handle_book_question(
    question: str,
    user_background: Optional[UserBackground],
    top_k: int = 3
) -> str:
    """Handle a book-related question with RAG."""
    try:
        # Get Qdrant client (singleton)
        qdrant_client = get_qdrant_client()

        # Generate embedding for the query
        query_embedding = get_embeddings([question])[0]

        # Search in Qdrant vector database (limited for speed)
        search_results = qdrant_client.search(
            collection_name="textbook_content",
            query_vector=query_embedding,
            limit=top_k,
            with_payload=True
        )

        # Extract relevant content
        context_texts = []
        for result in search_results:
            if result.payload:
                content = result.payload.get("content", "")
                if content:
                    context_texts.append(content)

        # Generate response using OpenAI
        response_text = generate_response_with_openai(
            context_texts,
            question,
            user_background.dict() if user_background else None
        )

        # Add updated knowledge note
        if is_web_search_available():
            search_results = await search_web(f"{question} robotics 2024", num_results=2)
            if search_results:
                response_text += "\n\n**Latest updates:**"
                response_text += format_search_results(search_results)
        else:
            response_text += generate_knowledge_note(False)

        return response_text

    except Exception as e:
        print(f"Error in book question handler: {e}")
        return f"I encountered an error searching the textbook. Please try again. Error: {str(e)}"


@router.post("/rag/chat/stream")
async def smart_chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint using Server-Sent Events (SSE).
    Returns tokens progressively for a faster perceived response.
    """

    async def generate_stream() -> AsyncGenerator[str, None]:
        try:
            session = get_or_create_session(request.session_id)
            message = request.message.strip()

            # Send session ID first
            yield f"data: {json.dumps({'type': 'session', 'session_id': session.session_id})}\n\n"

            # Detect intent
            intent, confidence = detect_intent(message)
            yield f"data: {json.dumps({'type': 'intent', 'intent': intent})}\n\n"

            # Handle greetings and farewells immediately (no streaming needed)
            if intent == "greeting":
                response = generate_greeting_response(session, message)
                update_session(session.session_id, greeted=True, asked_name=True)
                yield f"data: {json.dumps({'type': 'content', 'content': response})}\n\n"
                yield f"data: {json.dumps({'type': 'done'})}\n\n"
                return

            if intent == "farewell":
                response = generate_farewell_response(session)
                yield f"data: {json.dumps({'type': 'content', 'content': response})}\n\n"
                yield f"data: {json.dumps({'type': 'done'})}\n\n"
                return

            if intent == "name_response" and session.asked_name and not session.user_name:
                response = generate_name_response(session, message)
                update_session(session.session_id, user_name=message.strip().title())
                yield f"data: {json.dumps({'type': 'content', 'content': response})}\n\n"
                yield f"data: {json.dumps({'type': 'done'})}\n\n"
                return

            # For book/general questions, stream the OpenAI response
            client = get_openai_client()
            if client is None:
                yield f"data: {json.dumps({'type': 'content', 'content': 'OpenAI API not configured.'})}\n\n"
                yield f"data: {json.dumps({'type': 'done'})}\n\n"
                return

            # Get context for book questions
            context_str = ""
            if intent == "book_question" or is_book_related(message):
                qdrant_client = get_qdrant_client()
                query_embedding = get_embeddings([message])[0]
                search_results = qdrant_client.search(
                    collection_name="textbook_content",
                    query_vector=query_embedding,
                    limit=3,
                    with_payload=True
                )
                context_texts = [r.payload.get("content", "") for r in search_results if r.payload]
                context_str = "\n\n".join(context_texts[:3])

                system_msg = "You are an AI assistant for a Physical AI and Humanoid Robotics textbook. Provide accurate, helpful answers based on the textbook content. Be concise but informative."
                user_msg = f"Context from textbook:\n{context_str}\n\nQuestion: {message}"
            else:
                system_msg = "You are a helpful AI assistant. Answer questions clearly and concisely."
                user_msg = message

            # Stream response from OpenAI
            stream = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": user_msg}
                ],
                max_tokens=500,
                temperature=0.7,
                stream=True
            )

            full_response = ""
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield f"data: {json.dumps({'type': 'token', 'content': content})}\n\n"
                    await asyncio.sleep(0.01)  # Small delay for smooth streaming

            # Cache the full response
            cache_response(message, full_response, "en")
            update_session(session.session_id)

            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as e:
            print(f"Streaming error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


# Keep existing endpoints for backward compatibility
@router.post("/rag/query", response_model=RAGResponse)
async def rag_query(query: RAGQuery):
    """
    Process a RAG query and return a response based on textbook content.
    (Legacy endpoint - kept for backward compatibility)
    """
    try:
        # Check cache first
        language = query.user_background.preferred_language if query.user_background else "en"
        cached = get_cached_response(query.question, language)
        if cached:
            return RAGResponse(
                question=query.question,
                answer=cached,
                context=[],
                sources=["cached"],
                user_background=query.user_background
            )

        # Get Qdrant client (singleton)
        qdrant_client = get_qdrant_client()

        # Generate embedding for the query
        query_embedding = get_embeddings([query.question])[0]

        # Search in Qdrant vector database
        search_results = qdrant_client.search(
            collection_name="textbook_content",
            query_vector=query_embedding,
            limit=query.top_k or 3,  # Reduced default for speed
            with_payload=True
        )

        # Extract relevant content
        context_texts = []
        sources = []
        for result in search_results:
            if result.payload:
                content = result.payload.get("content", "")
                if content:
                    context_texts.append(content)
                    source_info = result.payload.get("source", "")
                    if source_info:
                        sources.append(source_info)

        # Generate response using OpenAI
        response_text = generate_response_with_openai(
            context_texts,
            query.question,
            query.user_background.dict() if query.user_background else None
        )

        # If user prefers Urdu, translate the response
        if query.user_background and query.user_background.preferred_language == "ur":
            translation_result = translate_response_with_context(response_text, context_texts, sources)
            response_text = translation_result["urdu_answer"]
            context_texts = translation_result["urdu_context"]
            sources = translation_result["urdu_sources"]

        # Cache the response
        cache_response(query.question, response_text, language)

        return RAGResponse(
            question=query.question,
            answer=response_text,
            context=context_texts,
            sources=sources,
            user_background=query.user_background
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing RAG query: {str(e)}")


@router.post("/rag/selection-query", response_model=RAGResponse)
async def selection_query(selection: TextSelection):
    """
    Process a query about selected text and return a response.
    """
    try:
        # Get Qdrant client (singleton)
        qdrant_client = get_qdrant_client()

        # Generate embedding for the selected text combined with the question
        query_embedding = get_embeddings([selection.selected_text + " " + selection.question])[0]

        # Search in Qdrant vector database for related content
        search_results = qdrant_client.search(
            collection_name="textbook_content",
            query_vector=query_embedding,
            limit=selection.top_k or 3,
            with_payload=True
        )

        # Extract relevant content
        context_texts = []
        sources = []
        for result in search_results:
            if result.payload:
                content = result.payload.get("content", "")
                if content:
                    context_texts.append(content)
                    source_info = result.payload.get("source", "")
                    if source_info:
                        sources.append(source_info)

        # Generate response using OpenAI
        full_question = f"Regarding '{selection.selected_text[:100]}...', {selection.question}"
        response_text = generate_response_with_openai(
            context_texts,
            full_question,
            selection.user_background.dict() if selection.user_background else None
        )

        # If user prefers Urdu, translate the response
        if selection.user_background and selection.user_background.preferred_language == "ur":
            translation_result = translate_response_with_context(response_text, context_texts, sources)
            response_text = translation_result["urdu_answer"]
            context_texts = translation_result["urdu_context"]
            sources = translation_result["urdu_sources"]

        return RAGResponse(
            question=selection.question,
            answer=response_text,
            context=context_texts,
            sources=sources,
            user_background=selection.user_background
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing selection query: {str(e)}")


@router.post("/translate", response_model=TranslationResponse)
async def translate_text(translation_request: TranslationRequest):
    """
    Translate text to the specified language (currently Urdu support).
    """
    try:
        if translation_request.target_language.lower() == "ur":
            translated_text = translate_to_urdu(translation_request.text)
        else:
            translated_text = translation_request.text

        return TranslationResponse(
            original_text=translation_request.text,
            translated_text=translated_text,
            target_language=translation_request.target_language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error translating text: {str(e)}")


def generate_response_from_selection_only(selected_text: str, question: str, user_background: Optional[dict] = None) -> str:
    """
    Generate a response using ONLY the selected text (strict mode - no Qdrant search).
    """
    if not selected_text or not selected_text.strip():
        return "No text was selected. Please select some text from the page to ask a question about it."

    if user_background:
        background_str = f"User background: Software experience: {user_background.get('software_experience', 'N/A')}, Hardware experience: {user_background.get('hardware_experience', 'N/A')}, Robotics knowledge: {user_background.get('robotics_knowledge', 'N/A')}. "
        background_str += "Please tailor your response to match the user's experience level.\n\n"
    else:
        background_str = ""

    prompt = f"""{background_str}The user has selected the following text from a Physical AI and Humanoid Robotics textbook:

---
{selected_text}
---

Question: {question}

IMPORTANT INSTRUCTIONS:
1. Answer ONLY based on the selected text above.
2. Do NOT use any external knowledge or information not present in the selected text.
3. If the selected text does not contain enough information to answer the question, explicitly say: "The selected text does not contain enough information to answer this question."
4. Be concise and accurate."""

    try:
        client = get_openai_client()
        if client is None:
            return f"[OpenAI not configured] Based on your selected text: '{selected_text[:300]}...' - Please review the text above for information about: {question}"

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI assistant helping users understand specific text they have selected from a Physical AI and Humanoid Robotics textbook. You must ONLY use information from the selected text. Never add external knowledge."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.3
        )

        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling OpenAI API for selection: {str(e)}")
        return f"[API Error] Here is the selected text you asked about: '{selected_text[:500]}...' Your question was: {question}"


class StrictSelectionQuery(BaseModel):
    """Request model for strict selection-only queries (no Qdrant search)."""
    selected_text: str
    question: str
    user_background: Optional[UserBackground] = None


@router.post("/rag/answer-from-selection")
async def answer_from_selection_only(query: StrictSelectionQuery):
    """
    Answer a question using ONLY the selected text (STRICT MODE).
    """
    try:
        response_text = generate_response_from_selection_only(
            query.selected_text,
            query.question,
            query.user_background.dict() if query.user_background else None
        )

        if query.user_background and query.user_background.preferred_language == "ur":
            translated = translate_to_urdu(response_text)
            response_text = translated

        return {
            "question": query.question,
            "answer": response_text,
            "selected_text": query.selected_text[:200] + "..." if len(query.selected_text) > 200 else query.selected_text,
            "mode": "strict_selection",
            "sources": ["User-selected text"],
            "user_background": query.user_background
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing strict selection query: {str(e)}")


@router.post("/embeddings/process-textbook")
async def process_textbook_content():
    """
    Endpoint to process and embed textbook content into vector database.
    """
    try:
        from app.utils.textbook_processor import index_textbook_content

        qdrant_client = get_qdrant_client()
        chunks_indexed = index_textbook_content(qdrant_client)

        if chunks_indexed == 0:
            return {
                "message": "No textbook content found to index",
                "status": "warning",
                "chunks_indexed": 0
            }

        return {
            "message": f"Successfully indexed {chunks_indexed} chunks from textbook",
            "status": "success",
            "chunks_indexed": chunks_indexed
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing textbook content: {str(e)}")


class PersonalizationRequest(BaseModel):
    chapter_id: str
    content: str
    user_profile: dict


@router.post("/personalization/personalize-chapter")
async def personalize_chapter(request: PersonalizationRequest):
    """
    Personalize chapter content based on user background and expertise.
    """
    try:
        client = get_openai_client()
        if client is None:
            # Fallback: Return simple personalization without AI
            expertise_level = request.user_profile.get("expertise_level", "intermediate")
            hardware_access = request.user_profile.get("hardware_access", "simulation_only")

            # Simple rule-based personalization
            expertise_notes = {
                "beginner": "This chapter is designed for beginners. Focus on understanding core concepts before moving to implementation details.",
                "intermediate": "This chapter assumes intermediate knowledge. You can skip basic explanations and focus on implementation patterns.",
                "advanced": "This chapter covers advanced topics suitable for readers with prior robotics experience."
            }

            hardware_notes = {
                "none": "No physical hardware required - you can follow along with simulations.",
                "simulation_only": "Simulation tools like Gazebo or NVIDIA Isaac recommended for hands-on practice.",
                "basic_kit": "Basic robotics kit needed for practical exercises in this chapter.",
                "full_lab": "Full robotics lab required - this chapter includes hands-on hardware experiments."
            }

            return {
                "status": "success",
                "chapter_id": request.chapter_id,
                "user_profile": request.user_profile,
                "personalized_content": f"""
# Personalized for {expertise_level} learners

{expertise_notes.get(expertise_level, '')}

# Hardware Requirements

{hardware_notes.get(hardware_access, '')}

---

## Chapter Summary

{request.content[:500]}...

*(Note: Full content displayed above. This summary provides guidance for your learning level.)*
""",
                "message": f"Content personalized for {expertise_level} level with {hardware_access} setup (OpenAI not configured)"
            }

        # Extract user profile
        expertise_level = request.user_profile.get("expertise_level", "intermediate")
        hardware_access = request.user_profile.get("hardware_access", "simulation_only")
        robotics_experience = request.user_profile.get("robotics_experience", "beginner")

        # Build personalization prompt
        prompt = f"""You are a robotics and AI educator specializing in Physical AI and Humanoid Robotics.

User Background:
- Expertise Level: {expertise_level} (beginner, intermediate, advanced)
- Hardware Access: {hardware_access} (none, simulation_only, basic_kit, full_lab)
- Robotics Experience: {robotics_experience}

Task:
Personalize the following chapter content to match the user's background:
- Adjust technical depth based on expertise level
- Provide practical examples appropriate for hardware access
- Use analogies and explanations matching experience level
- Keep technical terms intact but explain them simply for beginners
- For advanced users: mention implementation details and edge cases

Chapter Content:
{request.content}

Provide personalized content in a clear, structured format suitable for a textbook chapter."""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a robotics educator who tailors content to learners' backgrounds."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.7
        )

        personalized_content = response.choices[0].message.content

        return {
            "status": "success",
            "chapter_id": request.chapter_id,
            "user_profile": request.user_profile,
            "personalized_content": personalized_content,
            "message": f"Content personalized for {expertise_level} level user"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error personalizing content: {str(e)}")
