import os
import re
import uuid
from typing import List, Dict, Any
from app.utils.embeddings import get_embeddings
from app.utils.qdrant_client import upsert_vectors
from qdrant_client import QdrantClient
import markdown
from pathlib import Path

def extract_textbook_content(docs_path: str = None) -> List[Dict[str, Any]]:
    """
    Extract content from textbook markdown files in the docs directory
    """
    content_chunks = []

    # Default path: from backend/ to ../docs
    if docs_path is None:
        # Get the project root (parent of backend)
        backend_dir = Path(__file__).resolve().parent.parent.parent
        docs_path = backend_dir.parent / "docs"

    docs_dir = Path(docs_path)

    # Find all markdown files in the docs directory
    for md_file in docs_dir.glob("*.md"):
        if md_file.name.startswith("ch"):  # Only process chapter files
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()

                # Convert markdown to plain text
                plain_text = markdown.markdown(content)
                # Remove HTML tags
                plain_text = re.sub('<[^<]+?>', '', plain_text)

                # Split content into chunks (e.g., by paragraphs or sections)
                chunks = split_content_into_chunks(plain_text, max_chunk_size=500)

                for i, chunk in enumerate(chunks):
                    if chunk.strip():  # Skip empty chunks
                        # Generate a deterministic UUID based on file and chunk index
                        chunk_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{md_file.stem}_chunk_{i}"))
                        content_chunks.append({
                            "id": chunk_id,
                            "content": chunk,
                            "source_file": str(md_file.name),
                            "chapter": md_file.stem,
                            "metadata": {
                                "source_file": str(md_file.name),
                                "chapter": md_file.stem,
                                "chunk_index": i,
                                "chunk_key": f"{md_file.stem}_chunk_{i}"
                            }
                        })

    return content_chunks

def split_content_into_chunks(content: str, max_chunk_size: int = 500) -> List[str]:
    """
    Split content into overlapping chunks
    """
    paragraphs = content.split('\n\n')
    chunks = []
    current_chunk = ""

    for paragraph in paragraphs:
        # If adding this paragraph would exceed the chunk size
        if len(current_chunk) + len(paragraph) > max_chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            # Start a new chunk with overlap
            current_chunk = current_chunk[-100:] + paragraph  # 100 char overlap
        else:
            current_chunk += "\n\n" + paragraph

    # Add the last chunk if it has content
    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks

def index_textbook_content(client: QdrantClient, docs_path: str = None) -> int:
    """
    Process textbook content and index it in Qdrant.
    Returns the number of chunks indexed.
    """
    print("Starting textbook content indexing...")

    # Extract content from textbook files
    content_chunks = extract_textbook_content(docs_path)
    print(f"Extracted {len(content_chunks)} content chunks from textbook")

    if not content_chunks:
        print("No content found to index")
        return 0

    # Prepare data for vectorization
    texts = [chunk["content"] for chunk in content_chunks]
    ids = [chunk["id"] for chunk in content_chunks]

    # Include content in payloads so RAG can retrieve it
    payloads = []
    for chunk in content_chunks:
        payload = chunk["metadata"].copy()
        payload["content"] = chunk["content"]  # Add content to payload
        payload["source"] = f"Chapter: {chunk['chapter']}"
        payloads.append(payload)

    # Generate embeddings
    print("Generating embeddings...")
    embeddings = get_embeddings(texts)
    print(f"Generated {len(embeddings)} embeddings")

    # Upsert to Qdrant
    print("Upserting vectors to Qdrant...")
    upsert_vectors(
        client=client,
        collection_name="textbook_content",
        vectors=embeddings,
        payloads=payloads,
        ids=ids
    )

    print("Textbook content indexing completed!")
    return len(content_chunks)

if __name__ == "__main__":
    from app.utils.qdrant_client import get_qdrant_client

    # Initialize Qdrant client
    client = get_qdrant_client()

    # Index textbook content
    index_textbook_content(client)