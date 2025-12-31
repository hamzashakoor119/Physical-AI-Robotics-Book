# Physical AI & Humanoid Robotics Textbook

A comprehensive, interactive textbook for learning Physical AI and Humanoid Robotics, featuring an AI-powered RAG chatbot assistant.

## Features

### Textbook Content (9 Chapters)
1. **Introduction to Physical AI** - Foundational concepts, embodiment theory, perception-action loops
2. **Sensors** - LiDAR, cameras, IMUs, depth sensors, sensor fusion
3. **Actuators** - Motors, servos, hydraulics, soft actuators, kinematics
4. **Control Systems** - PID control, state-space, MPC, stability analysis
5. **ROS2 Fundamentals** - Nodes, topics, services, actions, navigation
6. **Digital Twin & Simulation** - Gazebo, physics simulation, sim-to-real
7. **NVIDIA Isaac** - Isaac Sim, Omniverse, synthetic data, domain randomization
8. **VLA Robotics** - Vision-Language-Action models, foundation models for robotics
9. **Capstone: Humanoid Robot** - Complete humanoid robot project

### RAG Chatbot System
- **Global RAG**: Ask questions about any chapter content
- **Selection RAG**: Select text and ask context-specific questions
- **Personalization**: Responses tailored to your background and expertise level
- **Urdu Translation**: Full translation support for Urdu speakers
- **Content Ingestion**: Automatic processing of textbook content into vector database

### Tech Stack

#### Frontend
- **Docusaurus 3.x** - Documentation framework
- **React** - Interactive components
- **TypeScript** - Type safety

#### Backend
- **FastAPI** - Python async API framework
- **Qdrant** - Vector database for RAG
- **Neon PostgreSQL** - User data and authentication
- **OpenAI** - LLM for response generation
- **Sentence-Transformers** - Local embeddings

#### Authentication
- JWT-based authentication
- bcrypt password hashing
- Secure HTTP-only cookies

## Quick Start

### Frontend (Docusaurus)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Backend (FastAPI)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables (create .env file)
cp .env.example .env
# Edit .env with your API keys

# Run server
uvicorn main:app --reload
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Qdrant Vector Database
QDRANT_URL=your-qdrant-url
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_COLLECTION_NAME=physical_ai_book

# PostgreSQL (Neon)
DATABASE_URL=postgresql://user:password@host/database

# JWT Authentication
JWT_SECRET=your-secure-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Content Ingestion

To populate the Qdrant vector database with textbook content:

```bash
cd backend
python -m app.scripts.ingest_docs
```

This will process all markdown files in the `docs/` directory and create vector embeddings for RAG functionality.

## API Endpoints

### Chat
- `POST /api/chat` - Global RAG chat
- `POST /api/chat/selection` - Selection-based RAG chat
- `POST /api/chat/authenticated` - Authenticated chat with history

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user

### Personalization
- `GET /api/personalisation/profile` - Get user profile
- `PUT /api/personalisation/profile` - Update profile
- `POST /api/personalisation/background` - Set background questions

### Translation
- `POST /api/translation/urdu` - Translate text to Urdu
- `GET /api/translation/cache` - Get cached translations

### Agents & Skills
- `GET /api/agents` - List available agents
- `POST /api/agents/{agent_id}/execute` - Execute agent task
- `GET /api/skills` - List available skills
- `POST /api/skills/{skill_id}/run` - Run a skill

## Project Structure

```
GIAIC-Q4-Hackathon/
├── docs/                    # Textbook chapters (9 chapters)
├── src/
│   ├── components/
│   │   ├── ChatWidget/      # RAG chatbot component
│   │   └── HomepageFeatures/
│   ├── css/
│   ├── pages/
│   └── theme/
│       └── Root.tsx         # Theme wrapper with ChatWidget
├── backend/
│   ├── app/
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── auth.py          # Authentication
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Database setup
│   │   └── models.py        # Pydantic models
│   ├── main.py              # FastAPI entry point
│   └── requirements.txt
├── history/
│   ├── adr/                 # Architecture Decision Records
│   └── prompts/             # Prompt History Records
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD workflow
├── docusaurus.config.ts
├── sidebars.ts
├── vercel.json
└── package.json
```

## Deployment

### GitHub Pages (Frontend)
The frontend automatically deploys to GitHub Pages on push to main branch via GitHub Actions.

### Vercel (Full Stack)
1. Connect your GitHub repository to Vercel
2. Set project name: `Physical-AI-Humanoid-Robotics-Book-By-CodeWithHamza`
3. Add environment variables in Vercel dashboard
4. Deploy!

## Architecture Decision Records

See `history/adr/` for architectural decisions:
- ADR-001: RAG Architecture
- ADR-002: Authentication Strategy
- ADR-003: Frontend Architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details.

## Credits

Built for GIAIC Q4 Hackathon by CodeWithHamza.

---

**Live Demo**: [Physical AI & Humanoid Robotics Book](https://codewithhamza.github.io/GIAIC-Q4-Hackathon/)
