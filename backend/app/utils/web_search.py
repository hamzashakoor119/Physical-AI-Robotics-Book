"""
Optional web search module for supplementing book answers with current information.
Only activates if WEB_SEARCH_API_KEY environment variable is set.
"""
import os
import httpx
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class SearchResult:
    """A single search result."""
    title: str
    url: str
    snippet: str

def is_web_search_available() -> bool:
    """Check if web search is configured."""
    return bool(os.getenv("WEB_SEARCH_API_KEY"))

def get_search_provider() -> str:
    """Get configured search provider."""
    return os.getenv("WEB_SEARCH_PROVIDER", "tavily").lower()

async def search_web(query: str, num_results: int = 3) -> List[SearchResult]:
    """
    Perform web search using configured provider.
    Returns empty list if not configured or on error.
    """
    api_key = os.getenv("WEB_SEARCH_API_KEY")
    if not api_key:
        return []

    provider = get_search_provider()

    try:
        if provider == "tavily":
            return await _search_tavily(query, api_key, num_results)
        elif provider == "serpapi":
            return await _search_serpapi(query, api_key, num_results)
        else:
            print(f"Unknown search provider: {provider}")
            return []
    except Exception as e:
        print(f"Web search error: {e}")
        return []

async def _search_tavily(query: str, api_key: str, num_results: int) -> List[SearchResult]:
    """Search using Tavily API."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            "https://api.tavily.com/search",
            json={
                "api_key": api_key,
                "query": query,
                "search_depth": "basic",
                "max_results": num_results
            }
        )
        response.raise_for_status()
        data = response.json()

        results = []
        for item in data.get("results", [])[:num_results]:
            results.append(SearchResult(
                title=item.get("title", ""),
                url=item.get("url", ""),
                snippet=item.get("content", "")[:300]
            ))
        return results

async def _search_serpapi(query: str, api_key: str, num_results: int) -> List[SearchResult]:
    """Search using SerpAPI."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            "https://serpapi.com/search",
            params={
                "api_key": api_key,
                "q": query,
                "num": num_results
            }
        )
        response.raise_for_status()
        data = response.json()

        results = []
        for item in data.get("organic_results", [])[:num_results]:
            results.append(SearchResult(
                title=item.get("title", ""),
                url=item.get("link", ""),
                snippet=item.get("snippet", "")[:300]
            ))
        return results

def format_search_results(results: List[SearchResult]) -> str:
    """Format search results for inclusion in response."""
    if not results:
        return ""

    formatted = "\n\n---\n**Latest from the web:**\n"
    for i, result in enumerate(results, 1):
        formatted += f"{i}. [{result.title}]({result.url})\n   {result.snippet}\n"
    return formatted

def generate_knowledge_note(has_web_search: bool) -> str:
    """Generate note about knowledge source."""
    if has_web_search:
        return "\n\n*Note: The above includes recent information from web search.*"
    else:
        return "\n\n*Note: This includes general knowledge as of my training. For the latest updates, please verify from official sources.*"
