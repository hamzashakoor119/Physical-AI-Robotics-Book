from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class UserBackground(BaseModel):
    software_experience: Optional[str] = None
    hardware_experience: Optional[str] = None
    robotics_knowledge: Optional[str] = None
    preferred_language: Optional[str] = "en"  # Default to English

class RAGQuery(BaseModel):
    question: str
    user_background: Optional[UserBackground] = None
    top_k: Optional[int] = 5
    context_window: Optional[int] = 500  # Number of tokens for context

class TextSelection(BaseModel):
    selected_text: str
    question: str
    user_background: Optional[UserBackground] = None
    top_k: Optional[int] = 3

class RAGResponse(BaseModel):
    question: str
    answer: str
    context: List[str]
    sources: List[str]
    user_background: Optional[UserBackground] = None

class VectorDocument(BaseModel):
    id: str
    content: str
    metadata: dict
    embedding: Optional[List[float]] = None

class DocumentChunk(BaseModel):
    text: str
    chunk_id: str
    source_file: str
    page_number: Optional[int] = None
    section_title: Optional[str] = None
    chapter: Optional[str] = None
    metadata: dict = {}