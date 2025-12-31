#!/usr/bin/env python3
"""
Database Initialization Script for Neon Postgres
Hackathon I - Physical AI & Humanoid Robotics Book

This script:
1. Creates all tables in Neon Postgres
2. Verifies database connection
3. Creates initial test user (optional)

Usage:
    python init_database.py
"""

import os
import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.database import engine, Base, SessionLocal
from app.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def init_db():
    """Initialize database tables"""
    print("=" * 60)
    print("DATABASE INITIALIZATION")
    print("=" * 60)

    # Get DATABASE_URL from environment
    db_url = os.getenv("DATABASE_URL", "Not set")

    if "sqlite" in db_url:
        print("⚠️  WARNING: Using SQLite (local development)")
        print("   For Hackathon submission, use Neon Postgres!")
    elif "postgres" in db_url or "postgresql" in db_url:
        # Mask password in URL for display
        safe_url = db_url.split('@')[1] if '@' in db_url else db_url
        print(f"✅ Connected to Postgres: {safe_url}")
    else:
        print(f"❓ Unknown database: {db_url}")

    print("\nCreating tables...")

    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")

        # List created tables
        print("\nTables in database:")
        from sqlalchemy import inspect
        inspector = inspect(engine)
        for table_name in inspector.get_table_names():
            print(f"  - {table_name}")

        # Test database connection
        db = SessionLocal()
        try:
            # Count users
            user_count = db.query(User).count()
            print(f"\n✅ Database connection verified!")
            print(f"   Current users: {user_count}")

            # Optional: Create test user if none exist
            if user_count == 0:
                create_test = input("\nNo users found. Create test user? (y/n): ")
                if create_test.lower() == 'y':
                    create_test_user(db)
        finally:
            db.close()

        print("\n" + "=" * 60)
        print("✅ DATABASE READY!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Start backend: uvicorn app.main:app --reload")
        print("2. Test health endpoint: http://localhost:8000/api/health")
        print("3. Run content ingestion (if needed)")

    except Exception as e:
        print(f"\n❌ Error initializing database: {e}")
        print("\nTroubleshooting:")
        print("1. Check DATABASE_URL in backend/.env")
        print("2. Verify Neon Postgres is accessible")
        print("3. Check psycopg2-binary is installed: pip install -r requirements.txt")
        sys.exit(1)


def create_test_user(db):
    """Create a test user for development"""
    print("\nCreating test user...")

    email = input("Email (default: test@example.com): ").strip() or "test@example.com"
    password = input("Password (default: test123): ").strip() or "test123"

    # Hash password
    hashed_password = pwd_context.hash(password)

    # Create user
    test_user = User(
        email=email,
        hashed_password=hashed_password,
        software_experience="intermediate",
        hardware_experience="simulation_only",
        robotics_knowledge="beginner"
    )

    db.add(test_user)
    db.commit()
    db.refresh(test_user)

    print(f"✅ Test user created!")
    print(f"   Email: {email}")
    print(f"   Password: {password}")
    print(f"   User ID: {test_user.id}")


if __name__ == "__main__":
    # Check if .env file exists
    env_file = Path(__file__).parent / ".env"
    if not env_file.exists():
        print("❌ ERROR: backend/.env file not found!")
        print("\nCreate it by:")
        print("1. Copy .env.example to .env")
        print("2. Add your Neon Postgres connection string")
        print("3. Add OpenAI and Qdrant credentials")
        sys.exit(1)

    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv(env_file)

    init_db()
