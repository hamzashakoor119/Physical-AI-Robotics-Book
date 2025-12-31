#!/usr/bin/env python3
"""
Script to populate the Qdrant vector database with textbook content.
This should be run once to index all the textbook chapters.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

from app.utils.qdrant_client import get_qdrant_client
from app.utils.textbook_processor import index_textbook_content

def main():
    print("Starting textbook content indexing process...")

    # Initialize Qdrant client
    client = get_qdrant_client()

    # Index textbook content from the docs directory
    # The path is relative to where the script is run from (backend directory)
    index_textbook_content(client, docs_path="../docs")

    print("Indexing completed successfully!")

if __name__ == "__main__":
    main()