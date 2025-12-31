"""
LRU Cache for RAG queries to reduce latency on repeated questions.
"""
from functools import lru_cache
from typing import Optional, Tuple
import hashlib
import time

# In-memory cache for query responses
_query_cache = {}
_cache_ttl = 300  # 5 minutes TTL

def _make_cache_key(question: str, language: str = "en") -> str:
    """Generate a cache key from question and language."""
    normalized = question.lower().strip()
    return hashlib.md5(f"{normalized}:{language}".encode()).hexdigest()

def get_cached_response(question: str, language: str = "en") -> Optional[str]:
    """Get cached response if available and not expired."""
    key = _make_cache_key(question, language)
    if key in _query_cache:
        cached_time, response = _query_cache[key]
        if time.time() - cached_time < _cache_ttl:
            return response
        else:
            # Expired, remove from cache
            del _query_cache[key]
    return None

def cache_response(question: str, response: str, language: str = "en") -> None:
    """Cache a response for future use."""
    key = _make_cache_key(question, language)
    _query_cache[key] = (time.time(), response)

    # Limit cache size to prevent memory issues
    if len(_query_cache) > 100:
        # Remove oldest entries
        sorted_keys = sorted(_query_cache.keys(), key=lambda k: _query_cache[k][0])
        for old_key in sorted_keys[:20]:
            del _query_cache[old_key]

def clear_cache() -> None:
    """Clear all cached responses."""
    _query_cache.clear()
