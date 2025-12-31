---
id: 001
title: Constitution Creation for Physical AI Robotics Textbook
stage: constitution
date: 2025-12-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: LAPTOP LAB
command: /sp.constitution
labels: ["constitution", "initialization", "project-setup", "governance", "principles"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - N/A (constitution document - no tests)
---

## Prompt

```text
title: "AI-Native Physical AI & Humanoid Robotics Textbook Project"
version: "1.0.0"

overview:
  description: >
    This constitution defines all rules, roles, workflows, constraints, and deliverables
    required to build a complete AI-native textbook for the Physical AI & Humanoid Robotics
    course. The project uses Claude Code + Spec-Kit Plus, Docusaurus, GitHub Pages,
    OpenAI Agents/ChatKit, FastAPI backend, Neon Serverless Postgres, Qdrant Cloud,
    BetterAuth authentication, user personalization, Urdu translation, and reusable
    intelligence via subagents and skills.

purpose:
  - Build a complete multi-chapter technical book aligned with the official Physical AI &
    Humanoid Robotics curriculum.
  - Automate book building using Claude Code subagents, skills, and reusable intelligence.
  - Implement a fully functional RAG system integrated into the book.
  - Implement authentication, user background capture, personalization, Urdu translation,
    and interactive intelligent features.
  - Deploy a production-grade AI-native learning platform.

requirements:
  book:
    - Use Docusaurus for full book creation.
    - All chapters must follow course outline fully.
    - Each chapter must include: theory, diagrams, ROS 2 code, Isaac Sim steps, Gazebo steps,
      VLA examples, glossary terms, and review questions.
    - Book must deploy on GitHub Pages or Vercel.

  backend:
    - RAG backend using FastAPI.
    - Embeddings using OpenAI.
    - Vector search using Qdrant Cloud.
    - User database using Neon Serverless Postgres.
    - Auth implemented using BetterAuth.
    - Must support: User signup, login, background questionnaire.

  rag-features:
    - Global Chatbot (floating widget in book).
    - RAG queries limited to book content.
    - Selection-based RAG: When user selects text → ask question on that text only.
    - Hybrid search: metadata + semantic.

  personalization:
    - Button at top of every chapter: "Personalize Chapter".
    - Uses user background (expertise, hardware, experience) from BetterAuth DB.
    - Personalized rewrite must be accurate, shorter/longer, simpler/more advanced based on profile.

  translation:
    - Button at top of every chapter: "Translate to Urdu".
    - Urdu translation must be idiomatic, technical terms intact.

  bonus-ai:
    - Use Claude Code Subagents.
    - Use Skills for: Urdu translation, personalization, chunking, glossary building, summarizing.
    - Automated content QA subagent.
    - Automated deployment helper subagent.

goals:
  - Achieve full marks on all hackathon scoring categories.
  - Produce a professional-quality AI-native textbook.
  - Build a high-performance RAG system tailored for robotics content.
  - Provide the best learning experience with dynamic AI augmentation.

principles:
  - Accuracy first: No hallucinated robotics/physics/LLM content.
  - Structure first: All chapters follow fixed hierarchy.
  - AI-native design: Everything should be interactive, personalized, and assistive.
  - Reusability: All logic modular, skill-based, reusable.
  - Deployment-ready: Code generated must be production-grade.

roles:
  author_agent:
    description: Writes high-quality textbook content.
    responsibilities:
      - Produce chapters, diagrams, examples.
      - Follow outline fully.
      - Generate ROS2/Gazebo/Isaac/VLA code blocks.
      - Produce glossaries and review questions.

  editor_agent:
    description: Improves clarity and correctness.
    responsibilities:
      - Fixes technical issues.
      - Enforces formatting, tone, pedagogy.
      - Ensures chapter dependencies are aligned.

  code_agent:
    description: Writes all Docusaurus, React, Tailwind, API, and deployment files.
    responsibilities:
      - Build custom components (ChatWidget, UrduButton, PersonalizeButton).
      - Create FastAPI backend project.
      - Create APIs for RAG, Auth, Personalization, Translation.

  rag_agent:
    description: Architect and build full RAG system.
    responsibilities:
      - Chunk docs, embed text, push to Qdrant.
      - Build hybrid search.
      - Implement selection-based RAG endpoint.
      - Ensure grounding to only book content.

  deployment_agent:
    description: Handles CI/CD, deploy scripts and environment fixes.

  qa_agent:
    description: Automated quality enforcement.
    responsibilities:
      - Validation of: links, diagrams, formatting, RAG indexing.
      - Unit checking of ROS2 code blocks.

subagents:
  summarizer_skill:
    purpose: Create summaries for chunks and chapters.
  glossary_skill:
    purpose: Generate glossary items for each chapter.
  translator_skill:
    purpose: High-quality Urdu translation.
  personalization_skill:
    purpose: Rewrite content based on user background.
  chunking_skill:
    purpose: Smart chunk splitting optimized for robotics technical docs.
  code_linter_skill:
    purpose: Linting of generated code (ROS2, Python, React).
  citation_checker_skill:
    purpose: Ensure accuracy of robotics technical claims.
  consistency_skill:
    purpose: Keeps terminology consistent across chapters.

constraints:
  technical:
    - ROS2 content must match Humble or Iron.
    - Gazebo: Use Fortress or Garden version.
    - Isaac Sim: Must match official NVIDIA docs.
    - VLA: Must use OpenAI/ChatGPT/Whisper workflows.
  content:
    - No hallucinated APIs.
    - No fictional robotics platforms.
    - Must reflect real industry practices.
  code:
    - Must be buildable and deployable without fixes.
  RAG:
    - Must restrict answers to book content only.
  Auth:
    - Must store user background accurately.

workflow:
  - author_agent → draft chapters
  - editor_agent → refine structure
  - glossary_skill → glossary generation
  - code_agent → insert into Docusaurus
  - chunking_skill → split docs for RAG
  - rag_agent → embed + store in Qdrant
  - qa_agent → validate
  - deployment_agent → push to GitHub Pages + backend deploy

deliverables:
  - Complete Docusaurus book
  - All chapters, glossaries, diagrams, code blocks
  - Backend FastAPI server
  - Qdrant + Neon integration
  - Fully working RAG chatbot
  - Urdu translation button
  - Personalization button
  - Auth integration with BetterAuth
  - GitHub repo (public)
  - Live deployed site
  - Final 90-second demo script

success-criteria:
  - All hackathon scoring categories fulfilled
  - Zero missing features
  - Fully functional live deployment
  - Clean, professional, accurate content
  - Smooth AI-native experience for learners
```

## Response snapshot

Created comprehensive project constitution (version 1.0.0) for AI-Native Physical AI & Humanoid Robotics Textbook Project.

**Constitution Structure**:
- **7 Core Principles**: Accuracy First, Structure First, AI-Native Design, Reusability and Modularity, Deployment-Ready Code, RAG Grounding and Hybrid Search, Authentication and Personalization
- **Technical Requirements**: Complete technology stack specification (Docusaurus, React, FastAPI, OpenAI, Qdrant, Neon, BetterAuth), performance targets (p95 latencies, concurrent user support), and constraints
- **Development Workflow**: 5-phase workflow (Planning, Content Creation, Interactive Features, Backend Setup, QA & Testing, Deployment)
- **Agent Roles**: Detailed responsibilities for 6 specialized agents (author, editor, code, RAG, deployment, QA)
- **Subagents (Skills)**: 8 reusable skills with clear inputs/outputs (summarizer, glossary, translator, personalizer, chunker, linter, citation_checker, consistency_checker)
- **Deliverables**: Complete list of 7 major deliverable categories
- **Governance**: Amendment procedure, versioning policy (semantic), compliance review, conflict resolution

**Key Decisions**:
- All ROS 2 content MUST match Humble or Iron distributions
- RAG responses strictly grounded to book content (no hallucination)
- Hybrid search combining semantic similarity + metadata filtering
- Three-tier personalization (beginner/intermediate/advanced)
- Urdu translation preserves technical terms
- All code must be deployment-ready without manual fixes

**Sync Impact Report** (prepended to constitution):
- Initial version: 1.0.0
- All templates reviewed and compatible
- No follow-up TODOs (all placeholders filled)

## Outcome

- ✅ Impact: Complete project constitution established, providing governance framework for entire AI-native textbook project
- 🧪 Tests: N/A (governance document)
- 📁 Files: `.specify/memory/constitution.md` (456 lines)
- 🔁 Next prompts: `/sp.specify` to create first feature specification, or begin with specific agent task (e.g., "Create chapter 1 outline")
- 🧠 Reflection: Constitution successfully captures complex multi-agent, multi-skill architecture with clear separation of concerns. All 7 principles are measurable and enforceable. Technical requirements specify exact versions and constraints to prevent hallucination. Ready for implementation phase.

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution creation completed successfully with all placeholders filled
- Graders run and results (PASS/FAIL): Template validation PASS, placeholder resolution PASS, governance completeness PASS
- Prompt variant (if applicable): N/A (initial constitution)
- Next experiment (smallest change to try): Test constitution enforcement by creating first feature spec with `/sp.specify` and validating against constitution principles
