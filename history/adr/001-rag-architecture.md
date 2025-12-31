# ADR-001: RAG Architecture for Physical AI Textbook Chatbot

## Status
Accepted

## Date
2024-12-10

## Context
We need to implement a chatbot system for the Physical AI & Humanoid Robotics textbook that can answer questions about the content. The system should support:
- Global RAG queries across the entire textbook
- Selection-based RAG for context-specific questions
- Personalized responses based on user background
- Multi-language support (English and Urdu)

## Decision
We chose to implement a **Retrieval-Augmented Generation (RAG)** architecture using:

### Vector Database: Qdrant
- **Rationale**: Qdrant provides excellent performance for similarity search, supports filtering, and has a generous free tier
- **Alternative Considered**: Pinecone (more expensive), ChromaDB (less scalable)

### Embedding Model: Sentence-Transformers (all-MiniLM-L6-v2)
- **Rationale**: Good balance of quality and speed, runs locally without API costs
- **Alternative Considered**: OpenAI Ada (higher cost), BERT (slower)

### LLM: OpenAI GPT-4/GPT-3.5-turbo
- **Rationale**: Best quality responses, flexible API, well-documented
- **Alternative Considered**: Claude (similar quality), Local LLM (lower quality)

### Backend Framework: FastAPI
- **Rationale**: Async support, automatic OpenAPI docs, Python ecosystem compatibility
- **Alternative Considered**: Flask (less async support), Express.js (different ecosystem)

## Consequences

### Positive
- High-quality responses grounded in textbook content
- Scalable architecture that can handle concurrent users
- Selection-based RAG provides contextual answers
- Local embeddings reduce operational costs

### Negative
- Dependency on OpenAI API for completions (cost per request)
- Initial embedding pipeline required for content ingestion
- Vector database requires maintenance and monitoring

### Risks
- OpenAI rate limits may affect high-traffic scenarios
- Embedding model changes may require re-indexing

## Implementation Notes
- Use chunk size of 500 tokens with 50 token overlap
- Store chapter metadata with each vector for filtering
- Implement caching for translation responses
