<!--
SYNC IMPACT REPORT
Version Change: Initial → 1.0.0 → 1.0.1 (Hackathon I Alignment)
Constitution Type: New constitution creation for AI-Native Physical AI & Humanoid Robotics Textbook Project
Modified Principles: N/A (initial creation)
Added Sections:
  - Core Principles (7 principles defined)
  - Technical Requirements
  - Development Workflow
  - Agent Roles & Responsibilities
  - Governance
  - Hackathon I Context (v1.0.1)
Templates Status:
  ✅ plan-template.md - Reviewed, compatible with constitution principles
  ✅ spec-template.md - Reviewed, compatible with user story requirements
  ✅ tasks-template.md - Reviewed, compatible with task-based workflow
Follow-up TODOs: None - all placeholders filled
Constitution Status: ✅ INITIALIZED AND LOCKED (v1.0.1) - No further automatic updates
-->

# AI-Native Physical AI & Humanoid Robotics Textbook Project Constitution

## Hackathon I Context

**Project Purpose**: This constitution governs the development of a comprehensive AI-native textbook for teaching Physical AI & Humanoid Robotics, created for GIAIC Hackathon I.

**Core Deliverables**:
1. AI/Spec-Driven Book Creation using Docusaurus, Claude Code, and Spec-Kit Plus
2. Integrated RAG Chatbot with selection-based querying capability
3. Reusable intelligence via Claude Code Subagents and Agent Skills
4. User authentication, personalization, and Urdu translation features
5. Deployment to GitHub Pages or Vercel with full documentation

**Course Coverage**: The textbook covers Physical AI systems bridging digital intelligence and physical embodiment through ROS 2, Gazebo, Unity, NVIDIA Isaac, and Vision-Language-Action (VLA) integration.

---

# AI-Native Physical AI & Humanoid Robotics Textbook Project Constitution

## Core Principles

### I. Accuracy First

**MUST enforce strict technical correctness in all robotics, physics, and AI content.**

- No hallucinated robotics APIs, fictional platforms, or invented technical concepts
- All ROS 2 content MUST match official Humble or Iron distributions
- Gazebo content MUST match Fortress or Garden versions
- Isaac Sim content MUST align with official NVIDIA documentation
- VLA workflows MUST use verified OpenAI/ChatGPT/Whisper implementations
- Technical claims require verification against official documentation or industry standards

**Rationale**: Learners depend on accurate information. Incorrect robotics code or physics concepts can lead to broken implementations, wasted time, and loss of trust in the learning platform.

### II. Structure First

**MUST follow fixed hierarchical structure for all book chapters.**

Each chapter MUST include:
- Theoretical foundation with clear explanations
- Visual diagrams illustrating key concepts
- ROS 2 code examples (tested and verified)
- Isaac Sim simulation steps (validated against NVIDIA docs)
- Gazebo simulation steps (validated against official releases)
- VLA (Vision-Language-Action) examples where applicable
- Glossary terms defining key vocabulary
- Review questions for comprehension assessment

**Rationale**: Consistent structure ensures predictable learning progression, enables reusable skills for content generation, and guarantees comprehensive coverage of each topic.

### III. AI-Native Design

**MUST make every component interactive, personalized, and assistive.**

- Global RAG chatbot accessible from any page (floating widget)
- Selection-based RAG: users can highlight text and ask questions scoped to that selection
- Personalization engine using user background (expertise level, hardware access, prior experience)
- Urdu translation with idiomatic phrasing while preserving technical terms
- Dynamic content adaptation based on user profile
- All AI features MUST be grounded to book content (no external hallucination)

**Rationale**: AI-native design transforms static textbooks into adaptive learning companions, meeting learners where they are and providing just-in-time assistance.

### IV. Reusability and Modularity

**MUST design all logic as modular, skill-based, and reusable components.**

- Use Claude Code Subagents for specialized tasks (author, editor, code, RAG, deployment, QA)
- Implement Skills for: Urdu translation, personalization, chunking, glossary building, summarization, code linting, citation checking, consistency enforcement
- All skills MUST be independently testable and composable
- Avoid monolithic implementations; prefer small, focused, single-purpose modules
- Document skill inputs, outputs, and dependencies explicitly

**Rationale**: Modular design enables rapid iteration, parallel development, automated quality assurance, and reuse across chapters and future projects.

### V. Deployment-Ready Code

**MUST generate production-grade code that builds and deploys without manual fixes.**

- All generated code MUST be syntactically correct and runnable
- Docusaurus configuration MUST be valid and complete
- FastAPI backend MUST include proper error handling, logging, and validation
- Frontend components MUST be tested for basic rendering and interaction
- Environment configuration MUST use secure practices (environment variables, no hardcoded secrets)
- Database schemas MUST be properly versioned with migrations
- CI/CD scripts MUST be functional and tested

**Rationale**: Deployment-ready code eliminates friction between development and production, ensures professional quality, and respects the user's time.

### VI. RAG Grounding and Hybrid Search

**MUST restrict all RAG responses to book content only, using hybrid search.**

- Embeddings generated using OpenAI models, stored in Qdrant Cloud
- Hybrid search combining semantic similarity + metadata filtering (chapter, section, topic tags)
- Selection-based RAG MUST scope context to highlighted text only
- Global chatbot MUST surface source references (chapter, section) for all answers
- No external web search or general knowledge injection beyond book scope
- User queries resulting in no matches MUST return explicit "not found in book" messages

**Rationale**: Grounding ensures trustworthy answers, prevents hallucinations, and keeps learners focused on course material. Hybrid search improves precision and recall for technical queries.

### VII. Authentication and Personalization

**MUST implement secure authentication with user background capture for personalization.**

- Authentication using BetterAuth with Neon Serverless Postgres for user storage
- User signup MUST capture: expertise level, hardware access, prior robotics experience, learning goals
- Personalization engine MUST adapt chapter content based on user profile:
  - Beginner → simpler language, more scaffolding, hardware alternatives
  - Intermediate → standard content with optional deep dives
  - Advanced → concise explanations, focus on nuances and edge cases
- User data MUST be stored securely (hashed passwords, encrypted sensitive fields)
- Personalization MUST maintain technical accuracy (no oversimplification that introduces errors)

**Rationale**: Personalization respects diverse learner backgrounds, reduces cognitive load for beginners, and accelerates learning for advanced users.

---

## Technical Requirements

### Technology Stack

**Frontend**:
- Docusaurus (latest stable version) for book site generation
- React for custom interactive components (ChatWidget, PersonalizeButton, UrduButton)
- Tailwind CSS for styling
- Deployment: GitHub Pages or Vercel

**Backend**:
- FastAPI (Python 3.11+) for RAG and personalization APIs
- OpenAI API and ChatKit SDKs for embeddings, translation, and conversational capabilities
- Qdrant Cloud for vector search
- Neon Serverless Postgres for user and metadata storage
- BetterAuth for authentication

**AI Infrastructure**:
- Claude Code with Spec-Kit Plus for automated book building
- OpenAI Agents and ChatKit integration for RAG chatbot functionality
- Subagents for specialized tasks (author_agent, editor_agent, code_agent, rag_agent, deployment_agent, qa_agent)
- Skills for reusable intelligence (summarizer, glossary, translator, personalizer, chunker, linter, citation_checker, consistency_checker)

### Performance and Scale Targets

- **RAG Latency**: p95 < 2 seconds for chatbot responses
- **Personalization Latency**: p95 < 3 seconds for chapter rewrite
- **Translation Latency**: p95 < 3 seconds for Urdu translation
- **Concurrent Users**: Support 100+ simultaneous learners without degradation
- **Vector Search**: Sub-200ms retrieval from Qdrant for typical queries
- **Book Size**: Support 10-20 chapters with 50-100 pages each without performance issues

### Constraints

- **No fictional content**: All robotics platforms, APIs, and workflows MUST be real and verifiable
- **No security vulnerabilities**: Follow OWASP Top 10 guidelines; no SQL injection, XSS, CSRF, or hardcoded secrets
- **Idempotent operations**: Personalization and translation MUST be repeatable without side effects
- **Offline content**: Base book content MUST be accessible without backend (static site); AI features require connection
- **Accessibility**: WCAG 2.1 AA compliance for Docusaurus site (semantic HTML, keyboard navigation, screen reader support)

---

## Development Workflow

### Phase 0: Planning and Architecture
1. Define course outline and chapter structure
2. Research existing robotics curricula and best practices
3. Design data models for user profiles, chapters, glossary, RAG chunks
4. Define API contracts for RAG, personalization, translation, authentication
5. Create Prompt History Records (PHRs) for all planning decisions
6. Document Architectural Decision Records (ADRs) for significant choices

### Phase 1: Content Creation (Chapter-by-Chapter)
1. **author_agent** drafts chapter content (theory, diagrams, code, examples)
2. **editor_agent** refines structure, clarity, and technical accuracy
3. **glossary_skill** generates glossary terms
4. **code_agent** integrates content into Docusaurus with proper formatting
5. **qa_agent** validates links, diagrams, code syntax, and formatting
6. **chunking_skill** splits chapter into semantic chunks for RAG indexing
7. **rag_agent** generates embeddings and stores in Qdrant with metadata

### Phase 2: Interactive Features Implementation
1. **code_agent** builds ChatWidget (global RAG chatbot)
2. **code_agent** builds PersonalizeButton and integration with FastAPI
3. **code_agent** builds UrduButton and integration with translation API
4. **rag_agent** implements selection-based RAG endpoint
5. **code_agent** implements authentication flows (signup, login, profile management)
6. **qa_agent** validates all interactive features end-to-end

### Phase 3: Backend and Database Setup
1. **code_agent** scaffolds FastAPI project structure
2. **code_agent** implements RAG endpoints (global chat, selection-based)
3. **code_agent** implements personalization endpoint
4. **code_agent** implements translation endpoint
5. **code_agent** integrates BetterAuth with Neon Postgres
6. **deployment_agent** configures environment variables and secrets management
7. **qa_agent** validates API contracts and error handling

### Phase 4: Quality Assurance and Testing
1. **qa_agent** runs automated validation (links, diagrams, formatting, RAG indexing)
2. **code_linter_skill** lints all ROS 2, Python, and React code
3. **citation_checker_skill** verifies technical claims against official docs
4. **consistency_skill** ensures terminology consistency across chapters
5. Manual review of sample chapters for pedagogical quality
6. User acceptance testing with sample learners (beginner, intermediate, advanced)

### Phase 5: Deployment and Documentation
1. **deployment_agent** prepares GitHub repo (public, clean commit history)
2. **deployment_agent** deploys Docusaurus site to GitHub Pages/Vercel
3. **deployment_agent** deploys FastAPI backend (Render, Railway, or AWS Lambda)
4. **deployment_agent** configures Qdrant Cloud and Neon Postgres production instances
5. Create final demo script (90 seconds) showcasing key features
6. Generate project documentation (setup guide, API reference, architecture overview)

### Continuous Improvement
- Collect user feedback on chatbot accuracy, personalization quality, and translation fluency
- Iterate on skills (translator, personalizer, chunker) based on real-world usage
- Expand glossary and review questions based on learner gaps
- Add new chapters as curriculum evolves

---

## Agent Roles & Responsibilities

### author_agent
**Purpose**: Generate high-quality technical content aligned with curriculum.

**Responsibilities**:
- Draft chapter sections with clear theoretical explanations
- Create accurate ROS 2 code examples (tested against Humble/Iron)
- Document Isaac Sim and Gazebo simulation steps
- Integrate VLA workflows where applicable
- Generate review questions for comprehension assessment
- Follow chapter structure template rigidly

**Success Criteria**: Content is technically accurate, pedagogically sound, and complete (all required sections present).

### editor_agent
**Purpose**: Refine content for clarity, correctness, and consistency.

**Responsibilities**:
- Fix technical inaccuracies (code errors, API mismatches, physics mistakes)
- Enforce consistent terminology across chapters
- Improve readability (simplify complex sentences, add transitions, clarify jargon)
- Ensure chapter dependencies are properly sequenced (later chapters build on earlier ones)
- Validate diagrams match textual descriptions

**Success Criteria**: Content is clear, error-free, and pedagogically coherent.

### code_agent
**Purpose**: Implement all Docusaurus, React, Tailwind, FastAPI, and deployment code.

**Responsibilities**:
- Build custom React components (ChatWidget, PersonalizeButton, UrduButton)
- Integrate components into Docusaurus theme
- Scaffold and implement FastAPI backend (RAG, personalization, translation, auth endpoints)
- Write database migrations and schema definitions
- Configure CI/CD scripts and deployment automation
- Implement error handling, logging, and validation throughout

**Success Criteria**: All code is production-ready, builds successfully, and deploys without manual intervention.

### rag_agent
**Purpose**: Architect and implement the full RAG system.

**Responsibilities**:
- Design chunking strategy optimized for robotics technical content (respect code blocks, preserve context)
- Generate embeddings using OpenAI API
- Store embeddings and metadata in Qdrant Cloud with proper indexing
- Implement hybrid search (semantic + metadata filtering by chapter, section, topic)
- Build selection-based RAG endpoint that scopes context to highlighted text
- Ensure all responses include source references (chapter, section)
- Prevent hallucinations by grounding responses strictly to retrieved chunks

**Success Criteria**: RAG system returns accurate, grounded answers with <2s p95 latency and clear source attribution.

### deployment_agent
**Purpose**: Handle CI/CD, deployment scripts, and environment configuration.

**Responsibilities**:
- Set up GitHub Actions or equivalent CI/CD pipeline
- Deploy Docusaurus site to GitHub Pages or Vercel
- Deploy FastAPI backend to cloud provider (Render, Railway, AWS Lambda, etc.)
- Configure environment variables and secrets securely (no hardcoded credentials)
- Set up Qdrant Cloud and Neon Postgres production instances
- Monitor deployment health and rollback if issues detected

**Success Criteria**: Fully automated deployment pipeline with zero-downtime releases.

### qa_agent
**Purpose**: Automated quality enforcement across all artifacts.

**Responsibilities**:
- Validate links (no broken internal or external links)
- Verify diagrams are present and properly referenced
- Check code syntax (ROS 2, Python, React) using linters
- Ensure RAG indexing completeness (all chapters chunked and embedded)
- Run smoke tests on interactive features (chatbot, personalization, translation)
- Generate quality reports highlighting issues with severity levels

**Success Criteria**: Zero critical issues in production; all content passes automated validation gates.

---

## Subagents (Skills)

### summarizer_skill
**Purpose**: Generate concise summaries for chunks and chapters.
**Input**: Full chapter text or chunk text.
**Output**: 2-3 sentence summary capturing key concepts.
**Usage**: Metadata enrichment for RAG, chapter overviews for navigation.

### glossary_skill
**Purpose**: Extract and define key terms from chapter content.
**Input**: Chapter text.
**Output**: List of terms with concise, accurate definitions.
**Usage**: Automated glossary generation for each chapter.

### translator_skill
**Purpose**: High-quality Urdu translation with technical term preservation.
**Input**: English chapter text.
**Output**: Idiomatic Urdu translation with English technical terms intact (e.g., "ROS 2 node" remains "ROS 2 node").
**Usage**: Urdu translation button on chapters.

### personalization_skill
**Purpose**: Rewrite content based on user background (expertise, hardware, experience).
**Input**: Original chapter text + user profile (beginner/intermediate/advanced, hardware access, learning goals).
**Output**: Adapted chapter text (simpler/more advanced, shorter/longer, with/without hardware alternatives).
**Usage**: Personalize Chapter button on chapters.

### chunking_skill
**Purpose**: Smart chunk splitting optimized for robotics technical docs.
**Input**: Full chapter text.
**Output**: List of semantically coherent chunks (preserve code blocks, respect section boundaries, maintain context).
**Usage**: RAG preprocessing before embedding.

### code_linter_skill
**Purpose**: Lint generated code (ROS 2, Python, React).
**Input**: Code snippet + language type.
**Output**: Lint results (errors, warnings, style issues).
**Usage**: QA validation of code examples.

### citation_checker_skill
**Purpose**: Verify technical claims against official documentation.
**Input**: Technical claim + platform (ROS 2, Gazebo, Isaac Sim, OpenAI).
**Output**: Validation result (verified, flagged, or unverifiable).
**Usage**: QA validation of content accuracy.

### consistency_skill
**Purpose**: Ensure terminology consistency across chapters.
**Input**: Full book text corpus.
**Output**: Report of inconsistent term usage (e.g., "robot arm" vs. "robotic arm" vs. "manipulator").
**Usage**: Editor agent refinement and final QA pass.

---

## Deliverables

1. **Complete Docusaurus Book**:
   - All chapters (10-20 chapters covering full Physical AI & Humanoid Robotics curriculum)
   - Glossaries (one per chapter)
   - Diagrams (embedded in chapters)
   - Code blocks (ROS 2, Python, YAML, launch files)
   - Review questions (one set per chapter)

2. **Backend FastAPI Server**:
   - RAG endpoints (global chat, selection-based)
   - Personalization endpoint
   - Translation endpoint
   - Authentication endpoints (signup, login, profile)
   - Health check and monitoring endpoints

3. **Database Integrations**:
   - Qdrant Cloud (vector embeddings + metadata)
   - Neon Serverless Postgres (users, profiles, session management)

4. **Interactive Features**:
   - Global RAG chatbot (floating widget)
   - Selection-based RAG (highlight text → ask question)
   - Personalize Chapter button (dynamic content adaptation)
   - Translate to Urdu button (idiomatic translation)
   - User authentication flows (signup, login, profile management)

5. **Public GitHub Repository**:
   - Clean commit history
   - README with setup instructions
   - Documentation (architecture, API reference, deployment guide)
   - CI/CD configuration

6. **Live Deployed Site**:
   - Docusaurus site on GitHub Pages or Vercel
   - FastAPI backend on cloud provider
   - Qdrant and Neon production instances configured

7. **Demo Script**:
   - 90-second video script showcasing key features:
     - Navigation through chapters
     - Global chatbot query
     - Selection-based RAG
     - Personalization demo (beginner vs. advanced)
     - Urdu translation demo

---

## Governance

### Amendment Procedure

**MUST require documented approval and migration plan for all constitution amendments.**

1. Propose amendment with rationale (why change is needed, what it solves)
2. Identify impact on existing principles, templates, and workflows
3. Draft migration plan (what needs updating, in what order)
4. Review with stakeholders (project lead, key contributors)
5. Approve and assign version bump (MAJOR, MINOR, or PATCH)
6. Update constitution document with Sync Impact Report prepended
7. Propagate changes to dependent templates (plan, spec, tasks, commands)
8. Create PHR documenting the amendment process
9. Create ADR if amendment involves architecturally significant decision

### Versioning Policy

**Constitution follows semantic versioning (MAJOR.MINOR.PATCH):**

- **MAJOR**: Backward-incompatible changes (principle removal, redefinition that breaks workflows)
- **MINOR**: Backward-compatible additions (new principle, new section, expanded guidance)
- **PATCH**: Clarifications, typo fixes, wording improvements (no semantic change)

### Compliance Review

**All PRs, features, and releases MUST verify compliance with constitution principles.**

- Author agent MUST follow accuracy and structure principles
- Editor agent MUST enforce consistency and clarity standards
- Code agent MUST generate deployment-ready code
- RAG agent MUST ensure grounding and hybrid search
- QA agent MUST validate all quality gates before release
- Complexity MUST be justified (see plan-template.md Complexity Tracking section)

### Conflict Resolution

**Constitution supersedes all other practices, guides, and templates.**

- If contradiction exists between constitution and template, constitution wins
- If contradiction exists between constitution and code comment, constitution wins
- If contradiction exists between constitution and runtime guidance, constitution wins
- Ambiguities MUST be resolved via clarification question to user or project lead

### Runtime Development Guidance

For day-to-day development practices beyond constitutional principles, consult:
- `.specify/memory/constitution.md` (this file) for governance and principles
- `CLAUDE.md` for agent-specific execution rules (PHR creation, ADR suggestions, human-as-tool strategy)
- Template files for specific artifact structures (plan, spec, tasks)

---

## Constitution Initialization Lock

**Status**: ✅ **INITIALIZED AND LOCKED**

**Version**: 1.0.1 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-27

**Lock Notice**: This constitution has been automatically aligned with Hackathon I requirements and is now locked. Future amendments require explicit user request and must follow the Amendment Procedure defined in the Governance section.

**Changes in v1.0.1**:
- Added Hackathon I Context section documenting project purpose and core deliverables
- Enhanced Technical Requirements with explicit ChatKit SDK and OpenAI Agents integration
- Applied initialization lock to prevent further automatic modifications

**Amendment Policy**: This constitution SHALL NOT be updated automatically. Any future changes require:
1. Explicit user request in a future prompt
2. Documented rationale and impact analysis
3. Formal amendment procedure following Governance section guidelines
4. Version bump according to semantic versioning policy
