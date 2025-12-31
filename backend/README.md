# Physical AI Humanoid Robotics Book - Backend API

This backend provides the API for the Physical AI Humanoid Robotics Book project, including RAG (Retrieval-Augmented Generation) functionality, authentication, and content management.

## Features

- **RAG API**: Query textbook content using semantic search
- **Selection-based Queries**: Ask questions about selected text
- **User Personalization**: Background-based response customization
- **Content Management**: Textbook content processing and indexing

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs with Python
- **Qdrant**: Vector database for semantic search
- **Sentence Transformers**: For generating text embeddings
- **OpenAI API**: For response generation
- **PostgreSQL (Neon)**: User data and authentication storage
- **Better Auth**: Authentication system

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

## Environment Variables

Create a `.env` file with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key_if_using_cloud
DATABASE_URL=postgresql://user:password@localhost/dbname
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/rag/query` - General RAG query
- `POST /api/rag/selection-query` - Query about selected text
- `POST /api/embeddings/process-textbook` - Process textbook content

## Running with Docker (Optional)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

## Deployment

The backend is designed to be deployed alongside the Docusaurus frontend. The frontend will make requests to the backend API for RAG functionality.