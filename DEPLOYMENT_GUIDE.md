# Deployment Guide

This guide covers deploying both the backend (FastAPI) and frontend (Docusaurus) to production.

---

## Prerequisites

Before deploying, ensure you have:
1. **OpenAI API Key** - Get from [platform.openai.com](https://platform.openai.com/api-keys)
2. **Qdrant Cloud Account** - Get free tier at [cloud.qdrant.io](https://cloud.qdrant.io)
3. Accounts on deployment platforms (Railway/Render for backend, Vercel for frontend)

---

## Backend Deployment

### Option 1: Railway (Recommended)

Railway auto-detects Python projects and uses the existing `railway.json` config.

#### Steps:
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Railway will detect the backend folder - set the root directory to `/backend`
5. Add environment variables in Settings → Variables:

```
OPENAI_API_KEY=sk-your-key-here
QDRANT_URL=https://your-cluster.cloud.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key
JWT_SECRET_KEY=generate-a-secure-random-string
DATABASE_URL=sqlite:///./app.db
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

6. Railway will automatically:
   - Install dependencies from `requirements.txt`
   - Run `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Provide a public URL like `https://your-app.railway.app`

7. Note down your backend URL for frontend deployment

#### Health Check Verification:
```bash
curl https://your-app.railway.app/api/health
# Expected: {"status":"OK"}
```

---

### Option 2: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: physical-ai-backend
   - **Root Directory**: backend
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as Railway above)
6. Click "Create Web Service"

---

### Option 3: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Create `Dockerfile` in backend/:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

4. Deploy:
```bash
cd backend
fly launch
fly secrets set OPENAI_API_KEY=sk-your-key
fly secrets set QDRANT_URL=https://your-cluster.cloud.qdrant.io
fly secrets set QDRANT_API_KEY=your-key
fly secrets set JWT_SECRET_KEY=your-secret
fly deploy
```

---

## Frontend Deployment

### Vercel (Recommended)

Vercel has first-class Docusaurus support.

#### Steps:
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" → Import this repository
3. Configure:
   - **Framework Preset**: Docusaurus
   - **Root Directory**: `.` (root of repo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add environment variable:
   ```
   BACKEND_URL=https://your-backend.railway.app/api
   ```
5. Click "Deploy"

#### Important: Update docusaurus.config.ts
After getting your Vercel URL, update `docusaurus.config.ts`:
```typescript
url: 'https://your-project.vercel.app',
```

---

### GitHub Pages (Alternative)

1. Update `docusaurus.config.ts`:
```typescript
url: 'https://hamzashakoor119.github.io',
baseUrl: '/Physical-AI-Humanoid-Robotics-Book-By-CodeWithHamza/',
```

2. Add GitHub Actions workflow `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
        env:
          BACKEND_URL: https://your-backend.railway.app/api
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

3. Enable GitHub Pages in repo Settings → Pages → Source: "gh-pages branch"

---

## Post-Deployment Checklist

### Backend Verification
- [ ] Health endpoint works: `curl https://your-backend-url/api/health`
- [ ] RAG query works: Test via curl or Swagger UI at `/docs`
- [ ] CORS allows your frontend domain

### Frontend Verification
- [ ] Site loads at your Vercel/GitHub Pages URL
- [ ] ChatWidget appears in bottom-right corner
- [ ] Asking a question returns an AI response
- [ ] Strict selection mode works:
  1. Select text on any page
  2. Toggle "Strict" checkbox in chat
  3. Ask a question
  4. Response should ONLY use selected text

### CORS Configuration
Update `ALLOWED_ORIGINS` on your backend with your deployed frontend URL:
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://custom-domain.com
```

---

## Environment Variables Reference

### Backend (Required for Production)

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-abc123...` |
| `QDRANT_URL` | Qdrant cloud URL | `https://abc-123.cloud.qdrant.io` |
| `QDRANT_API_KEY` | Qdrant API key | `abc123xyz...` |
| `JWT_SECRET_KEY` | Random 32+ char string | Use `python -c "import secrets; print(secrets.token_hex(32))"` |
| `DATABASE_URL` | Database connection | `sqlite:///./app.db` or Postgres URL |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs | `https://your-app.vercel.app` |
| `PORT` | Auto-set by platform | Don't set manually |

### Frontend (Build-time)

| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_URL` | Full backend API URL | `https://your-backend.railway.app/api` |

---

## Troubleshooting

### Backend Issues

**"OpenAI API key not configured"**
- Ensure `OPENAI_API_KEY` is set in environment variables
- Verify the key is valid at platform.openai.com

**"Error connecting to Qdrant"**
- Check `QDRANT_URL` is correct
- Verify `QDRANT_API_KEY` if using cloud
- Ensure collection "textbook_content" exists (run `/api/embeddings/process-textbook` once)

**CORS errors**
- Add your frontend URL to `ALLOWED_ORIGINS`
- Redeploy backend after updating

### Frontend Issues

**ChatWidget not connecting**
- Check browser console for errors
- Verify `BACKEND_URL` environment variable is set
- Ensure backend is running and accessible

**"Failed to fetch" errors**
- Backend might be down - check health endpoint
- CORS might be blocking - update `ALLOWED_ORIGINS`

---

## Final Verification Checklist for Demo/Judges

- [ ] Backend health endpoint returns `{"status":"OK"}`
- [ ] Frontend loads without errors
- [ ] ChatWidget opens when clicking chat icon
- [ ] General question returns AI-generated answer from textbook
- [ ] Selecting text and asking question works
- [ ] Strict mode answers ONLY from selected text
- [ ] Language toggle (EN/UR) works
- [ ] API documentation accessible at `/docs`

---

## Quick Commands Reference

```bash
# Test backend health
curl https://your-backend-url/api/health

# Test RAG query
curl -X POST https://your-backend-url/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is Physical AI?"}'

# Index textbook content (run once after deployment)
curl -X POST https://your-backend-url/api/embeddings/process-textbook

# Generate JWT secret
python -c "import secrets; print(secrets.token_hex(32))"
```
