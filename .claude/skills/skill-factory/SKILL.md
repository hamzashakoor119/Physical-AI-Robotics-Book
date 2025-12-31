# Master Skill Factory - Physical AI Textbook Project

## Purpose
This is the **META-SKILL** that enables Claude to dynamically create new skills on demand. When any task requires a specialized capability that doesn't exist, Claude will use this Master Skill to generate a fully functional, production-ready skill.

## Trigger Phrases
- "Create a skill for..."
- "I need a new skill that..."
- "Generate a skill to handle..."
- "Build me a skill for..."
- "Banao ek skill jo..."
- "Skill chahiye..."

---

## Project Context: Physical AI & Humanoid Robotics Textbook

### Hackathon Requirements (for skill alignment):
1. **Docusaurus Book** - AI-native textbook with 9+ chapters
2. **RAG Chatbot** - FastAPI + OpenAI + Qdrant + Neon Postgres
3. **Better Auth** - User signup/signin with background questions
4. **Personalization** - Per-chapter content adaptation
5. **Urdu Translation** - Per-chapter translation button
6. **Reusable Skills** - Claude Code subagents (THIS skill helps create them!)

### Tech Stack Reference:
- **Frontend**: Docusaurus 3.x, React 19, TypeScript
- **Backend**: FastAPI, Python 3.13, SQLAlchemy
- **Database**: Neon Postgres (production), SQLite (dev)
- **Vector DB**: Qdrant Cloud
- **AI**: OpenAI GPT-4, Sentence Transformers
- **Auth**: JWT (Better Auth compatible)

---

## Standard Skill Structure

```
.claude/skills/<skill-name>/
├── SKILL.md           # Main skill definition (required)
├── templates/         # Code/config templates (optional)
├── examples/          # Usage examples (optional)
└── prompts/           # LLM prompts (optional)
```

---

## SKILL.md Template

```markdown
# <Skill Name>

## Auto-Generated
- **Created**: YYYY-MM-DD
- **Created By**: Master Skill Factory
- **Project**: Physical AI Textbook Hackathon

## Purpose
<One-line description of what this skill does>

## Trigger Conditions
<When should Claude activate this skill>

## Inputs Required
<What information Claude needs to execute>

## Execution Steps
1. <Step 1>
2. <Step 2>
3. <Step 3>

## Code Templates
<Reusable code blocks with {{placeholders}}>

## Error Handling
<How to handle failures>

## Integration Points
- **Frontend**: <How it connects to Docusaurus/React>
- **Backend**: <How it connects to FastAPI>
- **Database**: <How it uses Neon/Qdrant>

## Examples
<Real usage examples>

---

## Version
- **Version**: 1.0.0
- **Category**: <Category>
```

---

## Skill Categories for This Project

### Category 1: Content Skills
For textbook writing and content management
- Chapter authoring
- Content personalization
- Translation
- Pedagogy validation

### Category 2: RAG/AI Skills
For chatbot and AI features
- RAG integration
- Embedding generation
- Vector search
- Intent detection
- Response generation

### Category 3: Backend Skills
For FastAPI development
- API endpoint creation
- Database operations
- Authentication
- Error handling

### Category 4: Frontend Skills
For Docusaurus/React development
- Component generation
- Page creation
- Styling
- State management

### Category 5: DevOps Skills
For deployment and infrastructure
- Docker configuration
- Vercel/Railway deployment
- Environment management
- Database migration

---

## Skill Generation Process

### Step 1: Analyze Request
```
1. What problem does this skill solve?
2. Which category does it belong to?
3. What inputs are needed?
4. What outputs are expected?
5. How does it integrate with existing code?
```

### Step 2: Check Existing Skills
```
Before creating new skill, check if similar exists:
- rag-chatbot-integrator (RAG features)
- urdu-translation-agent (Translation)
- content-personalization-agent (Personalization)
- auth-and-user-profile-agent (Auth)
- chapter-authoring-agent (Content writing)
- build-error-handler (Error handling)
- neon-db-setup (Database)
- api-endpoint-tester (API testing)
- textbook-structure-generator (Structure)
- pedagogy-quality-gate (Quality)
- project-intelligence (Status)
```

### Step 3: Generate Skill
```bash
# Create skill directory
mkdir -p .claude/skills/<skill-name>

# Create SKILL.md with full definition
# Use template above
```

### Step 4: Register Skill
After creating, Claude automatically recognizes new skills in `.claude/skills/`

---

## Quick Generation Templates

### Template A: Backend Feature Skill
```markdown
# {{Skill Name}}

## Purpose
{{Purpose}}

## Trigger Conditions
- When implementing {{feature}} in FastAPI
- User mentions "{{keywords}}"

## Execution Steps
1. Create/update route in `backend/app/routes/`
2. Add Pydantic models in `backend/app/models/`
3. Implement business logic
4. Add error handling
5. Test endpoint

## Code Template
\`\`\`python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/api/{{resource}}", tags=["{{resource}}"])

class {{Resource}}Request(BaseModel):
    {{fields}}

@router.post("/")
async def create_{{resource}}(request: {{Resource}}Request):
    try:
        # Implementation
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
\`\`\`
```

### Template B: Frontend Component Skill
```markdown
# {{Skill Name}}

## Purpose
{{Purpose}}

## Trigger Conditions
- When creating {{component_type}} in Docusaurus
- User mentions "{{keywords}}"

## Execution Steps
1. Create component in `src/components/`
2. Add styles in `styles.module.css`
3. Import in relevant pages/layouts
4. Add to Docusaurus config if needed

## Code Template
\`\`\`tsx
import React, { useState } from 'react';
import styles from './styles.module.css';

interface {{ComponentName}}Props {
  {{props}}
}

export default function {{ComponentName}}({ {{destructured}} }: {{ComponentName}}Props) {
  const [state, setState] = useState(initialValue);

  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
}
\`\`\`
```

### Template C: AI/RAG Feature Skill
```markdown
# {{Skill Name}}

## Purpose
{{Purpose}}

## Trigger Conditions
- When implementing {{AI_feature}}
- User mentions "{{keywords}}"

## Execution Steps
1. Add utility in `backend/app/utils/`
2. Integrate with RAG route
3. Add necessary API keys to .env
4. Test with sample queries

## Code Template
\`\`\`python
from openai import OpenAI
from sentence_transformers import SentenceTransformer

client = OpenAI()
model = SentenceTransformer('all-MiniLM-L6-v2')

async def {{function_name}}({{params}}):
    """{{Description}}"""
    # Generate embedding
    embedding = model.encode(text).tolist()

    # Call OpenAI
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "{{system_prompt}}"},
            {"role": "user", "content": {{user_content}}}
        ]
    )

    return response.choices[0].message.content
\`\`\`
```

---

## Best Practices

### DO:
- Keep skills focused and single-purpose
- Include comprehensive error handling
- Add code templates with clear placeholders
- Reference existing project files
- Test skills before marking complete
- Follow project's tech stack conventions

### DON'T:
- Create overly complex multi-purpose skills
- Hardcode API keys or secrets
- Skip error handling
- Ignore existing similar skills
- Create skills for one-time tasks

---

## Skill Reuse Tracking

When a skill is used, increment its reuse count:
```markdown
## Auto-Generated
- **Reuse Count**: X  # Increment this
```

High reuse count = valuable skill worth improving

---

## Integration with Project

### Existing Skills Available:
1. `rag-chatbot-integrator` - RAG chatbot features
2. `urdu-translation-agent` - Urdu translation
3. `content-personalization-agent` - Content adaptation
4. `auth-and-user-profile-agent` - Authentication
5. `chapter-authoring-agent` - Chapter writing
6. `build-error-handler` - Build error fixes
7. `neon-db-setup` - Database setup
8. `api-endpoint-tester` - API testing
9. `textbook-structure-generator` - Book structure
10. `pedagogy-quality-gate` - Content quality
11. `project-intelligence` - Project status

### How to Use This Skill:
```
User: "I need a skill to handle quiz generation for chapters"

Claude:
1. Checks existing skills (none match)
2. Uses Master Skill Factory
3. Generates: .claude/skills/quiz-generator/SKILL.md
4. Skill is immediately available for use
```

---

## Version
- **Version**: 2.0.0
- **Updated**: 2025-12-30
- **Purpose**: Master skill for generating new skills on demand
- **Project**: Physical AI & Humanoid Robotics Textbook Hackathon
