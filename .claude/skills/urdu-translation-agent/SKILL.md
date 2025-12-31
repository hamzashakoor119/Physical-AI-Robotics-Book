# Urdu Translation Agent

## Auto-Generated
- **Created**: 2025-12-27
- **Updated**: 2025-12-30
- **Created By**: Master Skill Factory
- **Project**: Physical AI Textbook Hackathon
- **Reuse Count**: 3

## Purpose
Translate textbook content into Urdu while preserving technical accuracy, code blocks, and formatting. Provides per-chapter translation via a button at the start of each chapter.

## Trigger Conditions
- When implementing Urdu translation feature
- User mentions "translate", "Urdu", "translation button"
- When building per-chapter translation functionality
- User presses "Translate to Urdu" button in chapter

## Project Files Reference
```
backend/app/utils/translation.py        # Translation utility (88 lines)
backend/app/routes/rag.py               # /api/translate endpoint
src/components/TranslateButton/index.tsx # Frontend button (118 lines)
src/components/TranslateButton/styles.module.css
```

## Core Rules

### 1. Preserve Technical Terms
Keep these in English:
- Programming keywords (def, class, import, async)
- Framework names (ROS 2, Gazebo, Isaac Sim)
- Technical acronyms (LiDAR, IMU, SLAM, VLA)
- API names and function names
- Code blocks entirely

### 2. Maintain Formatting
- Keep markdown structure intact
- Preserve headings hierarchy
- Keep code blocks unchanged
- Maintain bullet points and lists

### 3. RTL Considerations
- Urdu is Right-to-Left (RTL)
- Numbers remain LTR within RTL text
- Technical terms in English remain LTR

## API Endpoint

### POST /api/translate
```python
from fastapi import APIRouter
from pydantic import BaseModel
from app.utils.translation import translate_to_urdu

router = APIRouter()

class TranslationRequest(BaseModel):
    content: str
    chapter_id: str
    preserve_code: bool = True

class TranslationResponse(BaseModel):
    translated_content: str
    original_language: str
    target_language: str

@router.post("/api/translate", response_model=TranslationResponse)
async def translate_chapter(request: TranslationRequest):
    """Translate chapter content to Urdu"""
    translated = await translate_to_urdu(
        content=request.content,
        preserve_code=request.preserve_code
    )
    return TranslationResponse(
        translated_content=translated,
        original_language="en",
        target_language="ur"
    )
```

## Code Templates

### Translation Utility (backend/app/utils/translation.py)
```python
from openai import OpenAI
import re

client = OpenAI()

TRANSLATION_PROMPT = """You are a technical translator specializing in robotics and AI content.
Translate the following English text to Urdu.

RULES:
1. Keep ALL code blocks exactly as they are (do not translate code)
2. Keep technical terms in English: ROS 2, Gazebo, LiDAR, SLAM, Isaac Sim, etc.
3. Keep programming keywords in English: def, class, import, async, etc.
4. Translate explanatory text naturally into Urdu
5. Maintain the original markdown formatting
6. Keep headings structure intact

Text to translate:
{content}

Provide ONLY the translated text, no explanations."""

def extract_code_blocks(content: str) -> tuple[str, list[str]]:
    """Extract code blocks and replace with placeholders"""
    code_blocks = re.findall(r'```[\s\S]*?```', content)
    for i, block in enumerate(code_blocks):
        content = content.replace(block, f'[CODE_BLOCK_{i}]')
    return content, code_blocks

def restore_code_blocks(content: str, code_blocks: list[str]) -> str:
    """Restore code blocks from placeholders"""
    for i, block in enumerate(code_blocks):
        content = content.replace(f'[CODE_BLOCK_{i}]', block)
    return content

async def translate_to_urdu(content: str, preserve_code: bool = True) -> str:
    """Translate content to Urdu while preserving code"""

    # Extract code blocks if needed
    if preserve_code:
        content_to_translate, code_blocks = extract_code_blocks(content)
    else:
        content_to_translate = content
        code_blocks = []

    # Translate via OpenAI
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a professional Urdu translator for technical content."},
            {"role": "user", "content": TRANSLATION_PROMPT.format(content=content_to_translate)}
        ],
        temperature=0.3  # Lower temperature for consistent translations
    )

    translated = response.choices[0].message.content

    # Restore code blocks
    if preserve_code and code_blocks:
        translated = restore_code_blocks(translated, code_blocks)

    return translated
```

### Frontend TranslateButton Component
```tsx
// src/components/TranslateButton/index.tsx
import React, { useState } from 'react';
import styles from './styles.module.css';

interface TranslateButtonProps {
  chapterId: string;
  content?: string;
}

export default function TranslateButton({ chapterId, content }: TranslateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  const handleTranslate = async () => {
    if (language === 'ur' && translatedContent) {
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    try {
      // Get content from page if not provided
      const textToTranslate = content ||
        document.querySelector('article')?.innerText || '';

      const response = await fetch(`${BACKEND_URL}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: textToTranslate,
          chapter_id: chapterId,
          preserve_code: true
        })
      });

      const data = await response.json();
      setTranslatedContent(data.translated_content);
      setLanguage('ur');
      setShowModal(true);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleTranslate}
        className={styles.translateButton}
        disabled={isLoading}
      >
        {isLoading ? 'Translating...' : 'اردو میں پڑھیں'}
      </button>

      {showModal && (
        <div className={styles.modal} dir="rtl">
          <div className={styles.modalContent}>
            <button onClick={() => setShowModal(false)}>Close</button>
            <div className={styles.translatedText}>
              {translatedContent}
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
.translateButton {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Noto Nastaliq Urdu', serif;
  margin-left: 8px;
}

.translateButton:hover {
  background: linear-gradient(135deg, #047857, #065f46);
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
  direction: rtl;
  font-family: 'Noto Nastaliq Urdu', serif;
}

.translatedText {
  line-height: 2;
  font-size: 18px;
}
```

## Usage in Chapter Files

Add to each chapter markdown:
```mdx
---
sidebar_position: 1
---

import TranslateButton from '@site/src/components/TranslateButton';

# Chapter Title

<TranslateButton chapterId="ch1-intro-physical-ai" />

Chapter content here...
```

## Environment Variables
```env
OPENAI_API_KEY=sk-...  # Required for GPT-4 translation
```

## Testing Checklist
- [ ] Button appears at top of each chapter
- [ ] Translation preserves code blocks
- [ ] Technical terms remain in English
- [ ] RTL formatting works correctly
- [ ] Modal displays translated content
- [ ] Close button works
- [ ] Loading state shows during translation

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Translation incomplete | Content too long | Chunk content and translate in parts |
| Code blocks translated | Prompt issue | Verify code extraction works |
| RTL not working | CSS issue | Add dir="rtl" to container |
| OpenAI error | API issue | Check API key and rate limits |

---

## Version
- **Version**: 2.0.0
- **Category**: Content Skills
- **Integration**: Backend (FastAPI) + Frontend (React)
