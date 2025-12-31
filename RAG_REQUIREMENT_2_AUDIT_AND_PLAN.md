# RAG REQUIREMENT 2 - AUDIT AND IMPLEMENTATION PLAN

Generated: 2024-12-16

---

## A) Current RAG Status

### What EXISTS (Fully Implemented)

| Component | File Path | Status |
|-----------|-----------|--------|
| FastAPI Backend | `backend/app/main.py` | Working |
| Health Check | `backend/app/routes/health.py` | Working |
| RAG Query Endpoint | `backend/app/routes/rag.py` | Working |
| Selection Query Endpoint | `backend/app/routes/rag.py` | Working |
| Translation Endpoint | `backend/app/routes/rag.py` | Working |
| Embeddings Utility | `backend/app/utils/embeddings.py` | Working |
| Qdrant Client | `backend/app/utils/qdrant_client.py` | Working (with mock fallback) |
| Textbook Processor | `backend/app/utils/textbook_processor.py` | Working |
| User Authentication | `backend/app/routes/auth.py` | Working |
| Database Setup | `backend/app/database.py` | Working (SQLite) |
| User Model | `backend/app/models/user.py` | Working |
| ChatWidget Component | `src/components/ChatWidget/index.tsx` | Working |
| ChatWidget Styles | `src/components/ChatWidget/styles.module.css` | Working |

### What WORKS

1. **RAG Pipeline Core:**
   - `POST /api/rag/query` - Accepts question + user background, returns AI-generated answer
   - `POST /api/rag/selection-query` - Accepts selected text + question, returns contextual answer
   - Embeddings generated via `sentence-transformers` (all-MiniLM-L6-v2)
   - Qdrant vector search with top-k retrieval
   - OpenAI GPT response generation with context injection

2. **Chat UI:**
   - Floating chat bubble (bottom-right)
   - Text selection detection on page
   - User background profile (software/hardware/robotics experience)
   - Language toggle (English/Urdu)
   - Loading states, error handling, dark mode support

3. **Authentication:**
   - JWT token-based auth
   - User registration with profile data
   - Password hashing with bcrypt

### What is INCOMPLETE / STUB / MOCK

| Issue | Location | Current State |
|-------|----------|---------------|
| Process Textbook Endpoint | `backend/app/routes/rag.py:198` | Returns `"not_implemented_yet"` |
| OpenAI API Key | `backend/.env` | Empty - APIs fail gracefully |
| Qdrant Connection | `backend/app/utils/qdrant_client.py` | Falls back to MockQdrantClient |
| Database | `backend/app/database.py` | Uses SQLite instead of Neon Postgres |
| Textbook Indexed | Qdrant collection | **NOT POPULATED** - No vectors exist |
| Backend URL | `src/components/ChatWidget/index.tsx` | Hardcoded to `/api` (localhost only) |

---

## B) Missing Components

### Critical Missing (Blockers)

1. **Textbook NOT Indexed in Qdrant**
   - The textbook processor exists but was never executed
   - Qdrant collection is empty - no vectors to search
   - `populate_db.py` script exists but needs API keys to run

2. **OpenAI API Key NOT Configured**
   - `.env` file has `OPENAI_API_KEY=` (empty)
   - RAG answers will fallback to context-only responses
   - Translation will be skipped

3. **Qdrant Cloud NOT Connected**
   - Currently falls back to MockQdrantClient
   - Need `QDRANT_URL` and `QDRANT_API_KEY` for cloud instance

4. **Neon Postgres NOT Connected**
   - Currently uses SQLite (`./app.db`)
   - Need `DATABASE_URL` for Neon Serverless Postgres

5. **`/api/embeddings/process-textbook` Endpoint is STUB**
   - Returns placeholder message
   - Should call `index_textbook_content()` from textbook_processor

### Non-Critical Missing (Enhancements)

| Component | Impact | Priority |
|-----------|--------|----------|
| Chat History Persistence | No conversation memory | Medium |
| Conversation Sessions | Each chat starts fresh | Low |
| Docker/Containerization | Manual deployment only | Medium |
| CI/CD Pipeline | No automated deployments | Low |
| `.env.example` | No template for required vars | High |
| Production Backend URL | ChatWidget uses localhost | High |

---

## C) What You Need From User

### REQUIRED (Cannot proceed without these)

1. **OpenAI API Key**
   ```
   OPENAI_API_KEY=sk-...
   ```
   - Required for: RAG answer generation, Urdu translation
   - Get from: https://platform.openai.com/api-keys

2. **Qdrant Cloud Credentials**
   ```
   QDRANT_URL=https://xxx.qdrant.io:6333
   QDRANT_API_KEY=...
   ```
   - Required for: Vector storage and semantic search
   - Get from: https://cloud.qdrant.io (Free tier available)

3. **Neon Postgres Connection String**
   ```
   DATABASE_URL=postgres://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
   ```
   - Required for: User data, (future) chat history
   - Get from: https://neon.tech (Free tier available)

4. **Deployed Backend URL**
   - Where will backend be deployed? (Render/Railway/Fly.io/etc.)
   - Example: `https://my-rag-backend.onrender.com`
   - Required for: ChatWidget to connect in production

### DECISIONS NEEDED

1. **Chat History Persistence**
   - Should conversations be saved to database?
   - If yes, I'll create a `chat_messages` table

2. **Selected-Text-Only Mode Behavior**
   - Current: Still uses Qdrant search with selected text as context
   - Requirement says: Answer ONLY from selected text (no Qdrant)
   - Should I implement strict mode that bypasses vector search?

3. **Docusaurus Integration**
   - ChatWidget component exists but needs to be added to Docusaurus
   - Should it appear on all pages or specific chapters?

---

## D) Step-by-Step Implementation Plan

### Step 1: Configure Environment Variables

**Files to edit:** `backend/.env`

```env
# OpenAI
OPENAI_API_KEY=<user-provided>

# Qdrant Cloud
QDRANT_URL=<user-provided>
QDRANT_API_KEY=<user-provided>

# Neon Postgres
DATABASE_URL=<user-provided>

# JWT (generate secure key)
JWT_SECRET_KEY=<generate-secure-random-string>
```

**Verification:** Backend starts without errors

---

### Step 2: Connect to Qdrant Cloud

**Files to edit:** `backend/app/utils/qdrant_client.py`

**Changes:**
- Update client initialization to use `QDRANT_URL` and `QDRANT_API_KEY`
- Remove mock fallback for production

**Function:** `get_qdrant_client()` at line 12

---

### Step 3: Index Textbook Content

**Files to edit:** `backend/app/routes/rag.py`

**Changes:**
- Implement `POST /api/embeddings/process-textbook` endpoint
- Call `index_textbook_content()` from `textbook_processor.py`
- Add progress reporting

**OR** Run manually:
```bash
cd backend
python populate_db.py
```

**Verification:**
```bash
curl -X POST http://localhost:8000/api/embeddings/process-textbook
# Should return: {"message": "Indexed X chunks", "status": "success"}
```

---

### Step 4: Implement Strict Selected-Text Mode

**Files to edit:** `backend/app/routes/rag.py`

**New endpoint:** `POST /api/rag/answer-from-selection`

**Logic:**
```python
@router.post("/rag/answer-from-selection")
async def answer_from_selection_only(selection: TextSelection):
    # DO NOT query Qdrant
    # Answer ONLY from selection.selected_text
    # If answer not found, say explicitly
```

**Frontend update:** `src/components/ChatWidget/index.tsx`
- Add toggle for "Strict mode" vs "Enhanced mode"
- Strict mode calls `/rag/answer-from-selection`

---

### Step 5: Connect to Neon Postgres

**Files to edit:** `backend/app/database.py`

**Changes:**
- Verify `DATABASE_URL` format works with Neon
- Test connection on startup
- Run Alembic migrations

**Commands:**
```bash
cd backend
alembic upgrade head
```

---

### Step 6: Add ChatWidget to Docusaurus

**Files to edit:** `src/theme/Root.tsx` (create if not exists)

**Changes:**
```tsx
import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget';

export default function Root({children}) {
  return (
    <>
      {children}
      <ChatWidget apiEndpoint="https://your-backend.com/api" />
    </>
  );
}
```

**Also update:** `docusaurus.config.js` to allow the custom theme wrapper

---

### Step 7: Update ChatWidget for Production

**Files to edit:** `src/components/ChatWidget/index.tsx`

**Changes:**
- Update default `apiEndpoint` to deployed backend URL
- Or use environment variable: `process.env.REACT_APP_API_URL`

---

### Step 8: Create `.env.example`

**Files to create:** `backend/.env.example`

```env
# Required: OpenAI API Key for RAG responses
OPENAI_API_KEY=

# Required: Qdrant Cloud for vector storage
QDRANT_URL=
QDRANT_API_KEY=

# Required: Neon Postgres for user data
DATABASE_URL=

# JWT Configuration
JWT_SECRET_KEY=change-this-to-secure-random-string
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

### Step 9: Deploy Backend

**Option A: Render.com**
1. Create Web Service
2. Connect GitHub repo
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env`

**Option B: Railway.app**
1. Create new project from GitHub
2. Add environment variables
3. Railway auto-detects FastAPI

---

### Step 10: Verify Full Integration

1. Deploy backend
2. Update ChatWidget with backend URL
3. Build and deploy Docusaurus
4. Test RAG queries
5. Test selected-text mode

---

## E) Verification Checklist

### Backend Health
```bash
curl https://your-backend.com/api/health
# Expected: {"status":"OK"}
```

### Qdrant Connected
```bash
curl -X POST https://your-backend.com/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"question":"What is Physical AI?"}'
# Expected: JSON with answer, context, sources
```

### Textbook Indexed
```bash
# After running indexing
curl -X POST https://your-backend.com/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"question":"Explain humanoid robotics"}'
# Expected: Answer referencing book chapters
```

### Selected Text Mode
```bash
curl -X POST https://your-backend.com/api/rag/selection-query \
  -H "Content-Type: application/json" \
  -d '{"selected_text":"Physical AI integrates AI with physical systems","question":"What does this mean?"}'
# Expected: Answer based on selected text context
```

### Authentication
```bash
# Register
curl -X POST https://your-backend.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
# Expected: {"access_token":"...","token_type":"bearer"}

# Login
curl -X POST https://your-backend.com/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test123"
# Expected: {"access_token":"...","token_type":"bearer"}
```

### Chat Widget in Browser
1. Open deployed Docusaurus site
2. Click chat bubble (bottom-right)
3. Type a question about the book
4. Verify answer appears with sources
5. Select text on page, verify selection appears in chat
6. Ask question about selected text

---

## Summary

| Requirement | Status | Action Needed |
|-------------|--------|---------------|
| FastAPI Backend | DONE | - |
| RAG Query (Full Book) | READY | Index textbook |
| RAG Query (Selection) | READY | Index textbook |
| Strict Selection Mode | PARTIAL | Implement strict endpoint |
| Qdrant Cloud | CODE READY | Add credentials |
| Neon Postgres | CODE READY | Add credentials |
| OpenAI Integration | CODE READY | Add API key |
| ChatWidget | DONE | Add to Docusaurus theme |
| Deployment | NOT STARTED | Deploy to Render/Railway |

**Estimated completion once credentials provided: 1-2 hours**
