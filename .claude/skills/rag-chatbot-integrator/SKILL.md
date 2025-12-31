# RAG Chatbot Integrator

## Auto-Generated
- **Created**: 2025-12-27
- **Updated**: 2025-12-30
- **Created By**: Master Skill Factory
- **Project**: Physical AI Textbook Hackathon
- **Reuse Count**: 5

## Purpose
Build and integrate a Retrieval-Augmented Generation (RAG) chatbot that answers questions ONLY from the Physical AI textbook content, with support for text selection mode and streaming responses.

## Trigger Conditions
- When implementing RAG chatbot features
- User mentions "chatbot", "RAG", "Q&A", "chat widget"
- When building textbook query functionality
- When implementing selection-based queries

## Project Files Reference
```
backend/app/routes/rag.py          # Main RAG endpoints (672 lines)
backend/app/utils/embeddings.py    # Sentence Transformers
backend/app/utils/qdrant_client.py # Vector database client
backend/app/utils/intent_detector.py # Intent classification
backend/app/utils/conversation_manager.py # Session management
src/components/ChatWidget/index.tsx # Frontend chat widget
```

## Core Capabilities

### 1. Textbook-Only Responses
- Answer questions ONLY from book content
- Refuse out-of-scope questions politely
- Cite specific chapters/sections

### 2. Selection-Based Mode
- User selects text on page
- Questions answered from selection ONLY
- Strict mode: no external knowledge

### 3. Streaming Responses
- Server-Sent Events (SSE)
- Real-time token streaming
- Better UX for long responses

### 4. Multi-language Support
- English responses by default
- Urdu translation on request
- Preserve technical terms

## API Endpoints

### POST /api/rag/chat (Streaming)
```python
@router.post("/chat")
async def chat_stream(request: RAGQuery):
    """Stream chat response via SSE"""
    return StreamingResponse(
        generate_response_stream(request),
        media_type="text/event-stream"
    )
```

### POST /api/rag/query (Standard)
```python
@router.post("/query")
async def query_textbook(request: RAGQuery):
    """Standard RAG query with sources"""
    # 1. Generate query embedding
    embedding = generate_embedding(request.query)

    # 2. Search Qdrant for relevant chunks
    results = qdrant_client.search(embedding, limit=5)

    # 3. Build context from results
    context = build_context(results)

    # 4. Generate response via OpenAI
    response = generate_response(request.query, context)

    return RAGResponse(
        answer=response,
        sources=[r.metadata for r in results]
    )
```

### POST /api/rag/selection-query
```python
@router.post("/selection-query")
async def answer_from_selection(request: TextSelection):
    """Answer based on selected text only"""
    # Use ONLY the selected text as context
    response = generate_response(
        query=request.query,
        context=request.selected_text,
        strict_mode=True
    )
    return {"answer": response}
```

## Code Templates

### Embedding Generation
```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embedding(text: str) -> list[float]:
    """Generate embedding for text"""
    return model.encode(text).tolist()
```

### Qdrant Search
```python
from qdrant_client import QdrantClient

async def search_similar(
    query_embedding: list[float],
    collection: str = "textbook_chunks",
    limit: int = 5
) -> list[dict]:
    """Search for similar content in Qdrant"""
    results = client.search(
        collection_name=collection,
        query_vector=query_embedding,
        limit=limit
    )
    return [
        {
            "content": hit.payload["content"],
            "chapter": hit.payload["chapter"],
            "section": hit.payload["section"],
            "score": hit.score
        }
        for hit in results
    ]
```

### OpenAI Response Generation
```python
from openai import OpenAI

client = OpenAI()

SYSTEM_PROMPT = """You are an AI tutor for the Physical AI & Humanoid Robotics textbook.
Answer questions ONLY using the provided context from the textbook.
If the context doesn't contain relevant information, say "I don't have information about that in the textbook."
Always cite the chapter/section when possible."""

async def generate_response(
    query: str,
    context: str,
    language: str = "en"
) -> str:
    """Generate response using OpenAI"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
        ],
        temperature=0.7,
        max_tokens=1000
    )
    return response.choices[0].message.content
```

### Streaming Response
```python
async def generate_stream(query: str, context: str):
    """Generate streaming response"""
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
        ],
        stream=True
    )

    for chunk in stream:
        if chunk.choices[0].delta.content:
            yield f"data: {chunk.choices[0].delta.content}\n\n"

    yield "data: [DONE]\n\n"
```

## Frontend Integration

### ChatWidget Component (src/components/ChatWidget/index.tsx)
```tsx
const handleSendMessage = async (message: string) => {
  // For streaming
  const eventSource = new EventSource(
    `${BACKEND_URL}/api/rag/chat?query=${encodeURIComponent(message)}&session_id=${sessionId}`
  );

  eventSource.onmessage = (event) => {
    if (event.data === '[DONE]') {
      eventSource.close();
      return;
    }
    setMessages(prev => [...prev, { role: 'assistant', content: event.data }]);
  };
};
```

### Selection Detection
```tsx
useEffect(() => {
  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
      setShowSelectionButton(true);
    }
  };

  document.addEventListener('mouseup', handleSelection);
  return () => document.removeEventListener('mouseup', handleSelection);
}, []);
```

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| No relevant content | Query outside textbook scope | Return "I don't have info about that" |
| Qdrant connection failed | Network/config issue | Check QDRANT_URL in .env |
| OpenAI rate limit | Too many requests | Implement retry with backoff |
| Empty embedding | Invalid text | Validate input before embedding |

## Environment Variables
```env
# Required for RAG
OPENAI_API_KEY=sk-...
QDRANT_URL=https://xxx.qdrant.io
QDRANT_API_KEY=...
QDRANT_COLLECTION=textbook_chunks
```

## Testing Checklist
- [ ] Query returns relevant textbook content
- [ ] Out-of-scope queries are handled gracefully
- [ ] Selection mode works correctly
- [ ] Streaming responses work
- [ ] Sources/citations are included
- [ ] Session management works
- [ ] Urdu translation integration works

---

## Version
- **Version**: 2.0.0
- **Category**: RAG/AI Skills
- **Integration**: Backend (FastAPI) + Frontend (React)
