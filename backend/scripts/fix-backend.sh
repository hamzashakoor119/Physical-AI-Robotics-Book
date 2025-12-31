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
