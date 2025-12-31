import os
from typing import List
from sentence_transformers import SentenceTransformer
import numpy as np
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for a list of texts using sentence transformers
    """
    try:
        embeddings = model.encode(texts)
        # Convert to list of lists for JSON serialization
        return [embedding.tolist() for embedding in embeddings]
    except Exception as e:
        print(f"Error generating embeddings: {str(e)}")
        # Return mock embeddings in case of error
        return [[0.0] * 384 for _ in range(len(texts))]

def get_embedding(text: str) -> List[float]:
    """
    Generate embedding for a single text
    """
    return get_embeddings([text])[0]

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """
    Calculate cosine similarity between two vectors
    """
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

# Example usage:
if __name__ == "__main__":
    sample_texts = [
        "What is Physical AI?",
        "Explain humanoid robotics",
        "How do sensors work in robotics?"
    ]

    embeddings = get_embeddings(sample_texts)
    print(f"Generated {len(embeddings)} embeddings of dimension {len(embeddings[0])}")