# Skill: Backend Error Resolver

**Purpose**: Automatically diagnose and resolve FastAPI backend errors, installation issues, and dependency problems for the Physical AI Book project.

## Trigger Conditions

Invoke this skill when:
- `ModuleNotFoundError: No module named 'fastapi'` or similar import errors
- `uvicorn app.main:app` fails to start
- Virtual environment issues (venv creation, activation, package installation)
- Database connection errors (PostgreSQL, Qdrant)
- OpenAI/Qdrant service unavailability
- User mentions "backend error", "python not found", "pip install failing"
- Package installation hangs or fails

## Project Context

**Backend Stack**:
- FastAPI 0.115.0 with Uvicorn 0.32.0
- PostgreSQL (Neon) or SQLite
- Qdrant Vector DB (sentence-transformers)
- OpenAI API
- SQLAlchemy 2.0.35 with Alembic
- Python 3.12+

**Key Dependencies**: torch, fastapi, uvicorn, qdrant-client, openai, python-dotenv, pydantic, sentence-transformers, transformers, psycopg2-binary, python-jose, passlib[bcrypt]

## Common Errors & Solutions

### 1. Virtual Environment Issues

#### Error: "ModuleNotFoundError: No module named 'fastapi'"

**Root Cause**: Packages installed in system Python or wrong venv, venv not activated, or venv was recreated (wiping packages)

**Diagnosis Commands**:
```bash
# Check if venv is active
echo $VIRTUAL_ENV

# Check which python is being used
which python3
python3 --version

# Check if fastapi is installed
python3 -m pip list | grep fastapi

# Check venv directory exists
ls -la .venv/
```

**Solutions (in order)**:

```bash
# Step 1: Ensure venv exists
cd physical-ai-book-main/backend
python3 -m venv .venv

# Step 2: Activate venv
source .venv/bin/activate  # Linux/Mac/WSL
# or
.venv\Scripts\activate     # Windows

# Step 3: Install dependencies in venv
python3 -m pip install -r requirements.txt

# Step 4: Verify installation
python3 -m pip list | grep fastapi

# Step 5: Run server using venv's python
python3 -m uvicorn app.main:app --reload --port 8000
```

**CRITICAL**: Never use `uvicorn` command directly without `python -m uvicorn` to ensure the venv's python is used.

#### Error: "command not found: python"

**Solution**:
```bash
# Use python3 explicitly
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --port 8000
```

#### Error: "Error running uvicorn: Python version mismatch"

**Solution**:
```bash
# Delete venv and recreate
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
```

### 2. Package Installation Errors

#### Error: "ERROR: Could not find a version that satisfies the requirement torch>=2.0.0"

**Cause**: PyTorch CPU version not specified in requirements.txt

**Solution** (requirements.txt already has this):
```bash
# The requirements.txt has: --extra-index-url https://download.pytorch.org/whl/cpu
# This installs CPU-only PyTorch (lighter, no CUDA needed)
pip install -r requirements.txt
```

#### Error: Installation hangs or is very slow

**Cause**: Large packages (PyTorch ~200MB, transformers, sentence-transformers)

**Solution**:
```bash
# Use pip with timeout and verbose output
python3 -m pip install --verbose -r requirements.txt --timeout 600

# Or install packages one by one to identify which one fails
python3 -m pip install torch==2.9.1+cpu --index-url https://download.pytorch.org/whl/cpu
python3 -m pip install fastapi==0.115.0
# ... continue with other packages
```

#### Error: "ERROR: Failed building wheel for [package]"

**Solution**:
```bash
# Update pip first
python3 -m pip install --upgrade pip setuptools wheel

# Then install requirements
python3 -m pip install -r requirements.txt
```

### 3. Database Connection Errors

#### Error: "sqlalchemy.exc.OperationalError: could not connect to server"

**Diagnosis**:
```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test connection manually
python3 -c "from app.database import engine; print('DB Connected')"
```

**Solutions**:

For SQLite (default/dev):
```bash
# DATABASE_URL should be: sqlite:///./app.db
# No additional setup needed
```

For PostgreSQL (Neon):
```bash
# DATABASE_URL format:
# postgresql://user:password@host:port/database?sslmode=require

# Ensure .env file exists in backend/ directory
cd physical-ai-book-main/backend
cp .env.example .env

# Edit .env with your Neon credentials
nano .env
```

#### Error: "psycopg2.OperationalError: connection refused"

**Solution**:
```bash
# Check if PostgreSQL is running (for local dev)
sudo service postgresql status
sudo service postgresql start

# Or use SQLite for development
# In .env: DATABASE_URL=sqlite:///./app.db
```

### 4. External Service Errors (OpenAI, Qdrant)

#### Error: "openai.APIError: No API key provided"

**Diagnosis**:
```bash
# Check for API key
cat .env | grep OPENAI_API_KEY

# Check environment variable
echo $OPENAI_API_KEY
```

**Solution**:
```bash
# Add to .env file
OPENAI_API_KEY=sk-xxx...
OPENAI_BASE_URL=https://api.openai.com/v1
```

#### Error: "qdrant_client.http.exceptions.UnexpectedResponse: Qdrant service unavailable"

**Solution**:
```bash
# Check Qdrant URL in .env
QDRANT_URL=http://localhost:6333

# If Qdrant is not running, the app falls back to MockQdrantClient
# This allows the app to run without Qdrant (limited functionality)

# To run Qdrant locally with Docker:
docker run -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant
```

### 5. CORS and Frontend Connection Errors

#### Error: "Access blocked by CORS policy"

**Diagnosis**:
```bash
# Check CORS configuration in app/main.py
# Default: allows http://localhost:3000 and http://localhost:3001
```

**Solution**:
```bash
# In .env, if frontend runs on different port:
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000
```

### 6. Import and Module Errors

#### Error: "ImportError: cannot import name 'X' from 'Y'"

**Diagnosis**:
```bash
# Check file structure
ls -la app/

# Check circular imports
python3 -c "import app.main"  # See full traceback
```

**Solution**:
```bash
# Clear Python cache
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.pyc" -delete 2>/dev/null

# Restart uvicorn
```

#### Error: "AttributeError: module 'fastapi' has no attribute 'X'"

**Solution**:
```bash
# Check FastAPI version
python3 -m pip show fastapi | grep Version

# If version mismatch, install correct version
python3 -m pip install fastapi==0.115.0
```

### 7. Runtime Errors

#### Error: "RuntimeError: Event loop is closed"

**Solution**:
```bash
# This can happen with uvicorn reload
# Restart server without --reload temporarily
python3 -m uvicorn app.main:app --port 8000
```

#### Error: "KeyboardInterrupt" or server doesn't respond

**Solution**:
```bash
# Kill any existing uvicorn processes
pkill -f uvicorn

# Or kill by port
lsof -ti:8000 | xargs kill -9

# Then restart
python3 -m uvicorn app.main:app --reload --port 8000
```

## Setup Checklist

Use this checklist for fresh backend setup:

```bash
# 1. Navigate to backend directory
cd physical-ai-book-main/backend

# 2. Create virtual environment (if not exists)
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

# 3. Activate venv
source .venv/bin/activate

# 4. Verify venv is active (should show path to .venv/bin/python)
which python3

# 5. Upgrade pip
python3 -m pip install --upgrade pip setuptools wheel

# 6. Install dependencies
python3 -m pip install -r requirements.txt

# 7. Verify key packages installed
python3 -m pip list | grep -E "fastapi|uvicorn|openai|qdrant|torch|transformers"

# 8. Create .env from example (if not exists)
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file - please edit with your credentials"
fi

# 9. Initialize database (if using SQLite)
python3 init_database.py

# 10. Test import
python3 -c "from app.main import app; print('Backend OK!')"

# 11. Start server
python3 -m uvicorn app.main:app --reload --port 8000
```

## Debugging Workflow

When backend error occurs, follow this flow:

```
Error Detected
├── Is it a ModuleNotFoundError?
│   └── → Check venv is activated, install missing package
│
├── Is it a Connection Error?
│   ├── Database → Check DATABASE_URL in .env
│   ├── OpenAI → Check OPENAI_API_KEY
│   └── Qdrant → Check QDRANT_URL (fallback to MockQdrantClient)
│
├── Is it a Server Start Error?
│   ├── Check uvicorn is using venv's python
│   ├── Verify FastAPI is installed
│   └── Check app/main.py for syntax errors
│
├── Is it an Installation Error?
│   ├── Update pip
│   ├── Check package versions
│   └── Try installing packages individually
│
└── Is it a Runtime Error?
    ├── Check logs in console
    ├── Clear cache (__pycache__)
    └── Restart server
```

## Environment Variables Reference

Create/update `.env` file in `backend/` directory:

```env
# Database (use SQLite for dev, PostgreSQL for prod)
DATABASE_URL=sqlite:///./app.db
# DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# OpenAI API (required for AI responses)
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1

# Qdrant Vector DB (optional - falls back to mock if missing)
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# JWT Authentication
JWT_SECRET_KEY=your-secret-key-min-32-characters
# Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"

# Application Settings
DEBUG=True
LOG_LEVEL=INFO
```

## Health Check Endpoints

Test these after server starts:

```bash
# Health check
curl http://localhost:8000/api/health

# Check OpenAI connection (if configured)
curl -X POST http://localhost:8000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'

# Check documentation
curl http://localhost:8000/docs
```

## Common Fixes Script

Create `backend/scripts/fix-backend.sh`:

```bash
#!/bin/bash
echo "=== Backend Fix Script ==="

cd "$(dirname "$0")/.."

# Kill existing processes
echo "Killing existing uvicorn processes..."
pkill -f uvicorn 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Clear cache
echo "Clearing Python cache..."
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true

# Recreate venv if requested
if [ "$1" == "--reinstall" ]; then
    echo "Recreating virtual environment..."
    rm -rf .venv
    python3 -m venv .venv
fi

# Activate venv
source .venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
python3 -m pip install --upgrade pip setuptools wheel --quiet

# Install dependencies
echo "Installing dependencies..."
python3 -m pip install -r requirements.txt --quiet

# Verify installation
echo "Verifying key packages..."
python3 -m pip list | grep -E "fastapi|uvicorn|openai|torch" || exit 1

# Test import
echo "Testing imports..."
python3 -c "from app.main import app; print('Backend OK!')"

echo "=== Backend Fix Complete ==="
echo "Start server with: python3 -m uvicorn app.main:app --reload --port 8000"
```

Usage:
```bash
chmod +x backend/scripts/fix-backend.sh
# Quick fix
./backend/scripts/fix-backend.sh
# Full reinstall
./backend/scripts/fix-backend.sh --reinstall
```

## Quick Reference

| Error | Quick Fix |
|-------|-----------|
| `ModuleNotFoundError` | `source .venv/bin/activate && pip install -r requirements.txt` |
| `command not found: python` | Use `python3` instead of `python` |
| Server not using venv | Use `python3 -m uvicorn` not `uvicorn` |
| DB connection failed | Check `.env` for `DATABASE_URL` |
| OpenAI API error | Check `OPENAI_API_KEY` in `.env` |
| Import error | Clear cache: `rm -rf **/__pycache__` |
| Installation slow | PyTorch is ~200MB, be patient |
| venv recreated | Reinstall: `pip install -r requirements.txt` |

## Proactive Tips

1. **Always activate venv** before running any python commands
2. **Use `python3 -m uvicorn`** never just `uvicorn`
3. **Keep `.env` file** separate from `.env.example`
4. **Use SQLite for development** (simpler, no DB server needed)
5. **Check `.env.example`** for all required environment variables
6. **Monitor terminal** for real-time error messages
7. **Use API docs** at `http://localhost:8000/docs` to test endpoints
8. **Restart server** after code changes (auto-reload should handle this)
9. **Clear cache** if seeing import errors after code changes
10. **Check logs** in uvicorn terminal output for detailed errors
