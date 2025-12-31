import os
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Lazy initialization of OpenAI client
_openai_client: Optional[any] = None


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

def translate_to_urdu(text: str) -> str:
    """
    Translate English text to Urdu using OpenAI
    """
    try:
        client = get_openai_client()
        if client is None:
            print("Warning: OPENAI_API_KEY not set, translation skipped")
            return text
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # You can change this to gpt-4 if preferred
            messages=[
                {"role": "system", "content": "You are a professional translator. Translate the given text from English to Urdu. Preserve the technical terminology and meaning. Respond only with the translated text in Urdu script."},
                {"role": "user", "content": f"Translate the following text to Urdu:\n\n{text}"}
            ],
            max_tokens=1000,
            temperature=0.3  # Lower temperature for more consistent translations
        )

        return response.choices[0].message.content
    except Exception as e:
        print(f"Error translating to Urdu: {str(e)}")
        return text  # Return original text if translation fails

def translate_batch_to_urdu(texts: List[str]) -> List[str]:
    """
    Translate a batch of English texts to Urdu
    """
    translated_texts = []
    for text in texts:
        translated_text = translate_to_urdu(text)
        translated_texts.append(translated_text)
    return translated_texts

def translate_response_with_context(answer: str, context: List[str], sources: List[str]) -> Dict[str, Any]:
    """
    Translate a RAG response to Urdu while preserving structure
    """
    try:
        # Translate the main answer
        urdu_answer = translate_to_urdu(answer)

        # Translate context if available
        urdu_context = [translate_to_urdu(ctx) for ctx in context] if context else []

        # Translate sources if available
        urdu_sources = [translate_to_urdu(src) for src in sources] if sources else []

        return {
            "urdu_answer": urdu_answer,
            "urdu_context": urdu_context,
            "urdu_sources": urdu_sources
        }
    except Exception as e:
        print(f"Error in translating response with context: {str(e)}")
        return {
            "urdu_answer": answer,
            "urdu_context": context,
            "urdu_sources": sources
        }

# Example usage
if __name__ == "__main__":
    sample_text = "Physical AI is the integration of artificial intelligence with physical systems."
    urdu_text = translate_to_urdu(sample_text)
    print(f"English: {sample_text}")
    print(f"Urdu: {urdu_text}")