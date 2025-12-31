# Content Personalization Agent

## Auto-Generated
- **Created**: 2025-12-27
- **Updated**: 2025-12-30
- **Created By**: Master Skill Factory
- **Project**: Physical AI Textbook Hackathon
- **Reuse Count**: 4

## Purpose
Adapt textbook content to learner skill levels and backgrounds. Provides per-chapter personalization via a button, using user's profile (software experience, hardware experience, robotics knowledge) to customize content complexity.

## Trigger Conditions
- When implementing content personalization feature
- User mentions "personalize", "adapt content", "skill level"
- When building per-chapter personalization button
- User presses "Personalize Content" button in chapter

## Project Files Reference
```
backend/app/routes/rag.py                    # /api/personalisation/personalize-chapter endpoint
src/components/PersonalizeButton/index.tsx   # Frontend button (144 lines)
src/components/PersonalizeButton/styles.module.css
backend/app/models/vector_schema.py          # UserBackground model
```

## Personalization Levels

### Beginner Level
- Simple language, avoid jargon
- More analogies and real-world examples
- Step-by-step explanations
- Additional context for prerequisites
- Code comments are detailed

### Intermediate Level
- Standard technical language
- Balanced examples and theory
- Some assumed knowledge
- Focus on practical application
- Code comments on complex parts only

### Advanced Level
- Technical/academic language
- Mathematical formulations
- Research paper references
- Performance optimizations
- Minimal code comments

## User Background Factors

Captured during signup (via Better Auth):
```python
class UserBackground(BaseModel):
    software_experience: str  # "none", "beginner", "intermediate", "advanced"
    hardware_experience: str  # "none", "basic_kit", "simulation", "full_lab"
    robotics_knowledge: str   # "none", "basic", "intermediate", "advanced"
```

## API Endpoint

### POST /api/personalisation/personalize-chapter
```python
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class PersonalizationRequest(BaseModel):
    chapter_content: str
    chapter_id: str
    expertise_level: str  # "beginner", "intermediate", "advanced"
    hardware_access: str  # "none", "simulation", "basic_kit", "full_lab"
    user_id: Optional[str] = None

class PersonalizationResponse(BaseModel):
    personalized_content: str
    adaptations_made: list[str]
    original_level: str
    target_level: str

@router.post("/api/personalisation/personalize-chapter")
async def personalize_chapter(request: PersonalizationRequest):
    """Personalize chapter content based on user profile"""

    # Build personalization prompt
    prompt = build_personalization_prompt(
        content=request.chapter_content,
        expertise=request.expertise_level,
        hardware=request.hardware_access
    )

    # Generate personalized content
    personalized = await generate_personalized_content(prompt)

    return PersonalizationResponse(
        personalized_content=personalized,
        adaptations_made=get_adaptations(request.expertise_level),
        original_level="intermediate",
        target_level=request.expertise_level
    )
```

## Code Templates

### Personalization Utility
```python
from openai import OpenAI

client = OpenAI()

PERSONALIZATION_PROMPTS = {
    "beginner": """Adapt this technical content for a BEGINNER learner:
- Use simple language, avoid jargon
- Add analogies and real-world examples
- Explain prerequisites briefly
- Add helpful tips and warnings
- Keep code examples but add detailed comments

Original content:
{content}

Provide the adapted content:""",

    "intermediate": """Adapt this content for an INTERMEDIATE learner:
- Use standard technical language
- Balance theory with practical examples
- Assume basic programming knowledge
- Focus on hands-on application
- Add code examples with moderate comments

Original content:
{content}

Provide the adapted content:""",

    "advanced": """Adapt this content for an ADVANCED learner:
- Use precise technical/academic language
- Include mathematical formulations where relevant
- Reference research papers or advanced resources
- Focus on optimization and edge cases
- Minimal comments, focus on architecture

Original content:
{content}

Provide the adapted content:"""
}

HARDWARE_CONTEXT = {
    "none": "Note: This learner has NO access to hardware. Focus on conceptual understanding and simulation-based examples.",
    "simulation": "Note: This learner can only use SIMULATION environments (Gazebo, Isaac Sim). Provide simulation-specific instructions.",
    "basic_kit": "Note: This learner has a BASIC KIT (Raspberry Pi/Arduino level). Provide examples suitable for limited hardware.",
    "full_lab": "Note: This learner has FULL LAB ACCESS (Jetson, RealSense, robots). Provide comprehensive hardware examples."
}

async def generate_personalized_content(
    content: str,
    expertise_level: str,
    hardware_access: str
) -> str:
    """Generate personalized content based on user profile"""

    prompt = PERSONALIZATION_PROMPTS.get(expertise_level, PERSONALIZATION_PROMPTS["intermediate"])
    hardware_note = HARDWARE_CONTEXT.get(hardware_access, "")

    full_prompt = f"{hardware_note}\n\n{prompt.format(content=content)}"

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert educator adapting technical content for different skill levels."},
            {"role": "user", "content": full_prompt}
        ],
        temperature=0.7,
        max_tokens=4000
    )

    return response.choices[0].message.content
```

### Frontend PersonalizeButton Component
```tsx
// src/components/PersonalizeButton/index.tsx
import React, { useState } from 'react';
import styles from './styles.module.css';

interface PersonalizeButtonProps {
  chapterId: string;
  content?: string;
}

export default function PersonalizeButton({ chapterId, content }: PersonalizeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [expertiseLevel, setExpertiseLevel] = useState<string>('intermediate');
  const [hardwareAccess, setHardwareAccess] = useState<string>('simulation');

  const handlePersonalize = async () => {
    setIsLoading(true);
    setShowOptions(false);

    try {
      const textToPersonalize = content ||
        document.querySelector('article')?.innerText || '';

      const response = await fetch(`${BACKEND_URL}/api/personalisation/personalize-chapter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter_content: textToPersonalize,
          chapter_id: chapterId,
          expertise_level: expertiseLevel,
          hardware_access: hardwareAccess
        })
      });

      const data = await response.json();
      setPersonalizedContent(data.personalized_content);
      setShowModal(true);
    } catch (error) {
      console.error('Personalization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className={styles.personalizeButton}
        disabled={isLoading}
      >
        {isLoading ? 'Personalizing...' : 'Personalize Content'}
      </button>

      {showOptions && (
        <div className={styles.optionsPanel}>
          <div className={styles.option}>
            <label>Expertise Level:</label>
            <select
              value={expertiseLevel}
              onChange={(e) => setExpertiseLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className={styles.option}>
            <label>Hardware Access:</label>
            <select
              value={hardwareAccess}
              onChange={(e) => setHardwareAccess(e.target.value)}
            >
              <option value="none">No Hardware</option>
              <option value="simulation">Simulation Only</option>
              <option value="basic_kit">Basic Kit</option>
              <option value="full_lab">Full Lab</option>
            </select>
          </div>

          <button onClick={handlePersonalize} className={styles.applyButton}>
            Apply Personalization
          </button>
        </div>
      )}

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Personalized Content</h3>
              <span className={styles.badge}>{expertiseLevel}</span>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
            <div className={styles.personalizedText}>
              {personalizedContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

### Styles (styles.module.css)
```css
.personalizeButton {
  background: linear-gradient(135deg, #7c3aed, #5b21b6);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.personalizeButton:hover {
  background: linear-gradient(135deg, #5b21b6, #4c1d95);
}

.optionsPanel {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.option {
  margin-bottom: 12px;
}

.option label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.option select {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.applyButton {
  width: 100%;
  background: #7c3aed;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modalContent {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.badge {
  background: #7c3aed;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  text-transform: uppercase;
}
```

## Usage in Chapter Files

Add to each chapter markdown:
```mdx
---
sidebar_position: 1
---

import PersonalizeButton from '@site/src/components/PersonalizeButton';
import TranslateButton from '@site/src/components/TranslateButton';

# Chapter Title

<PersonalizeButton chapterId="ch1-intro-physical-ai" />
<TranslateButton chapterId="ch1-intro-physical-ai" />

Chapter content here...
```

## Safety Rules
- Do NOT change factual correctness
- Do NOT remove important safety warnings
- Do NOT simplify to the point of inaccuracy
- Always maintain the core learning objectives

## Testing Checklist
- [ ] Button appears at top of each chapter
- [ ] Options panel shows correctly
- [ ] Beginner adaptation simplifies content
- [ ] Advanced adaptation adds depth
- [ ] Hardware context is considered
- [ ] Modal displays personalized content
- [ ] Original facts are preserved

---

## Version
- **Version**: 2.0.0
- **Category**: Content Skills
- **Integration**: Backend (FastAPI) + Frontend (React)
