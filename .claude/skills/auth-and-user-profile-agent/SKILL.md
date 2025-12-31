# Auth & User Profile Agent

## Auto-Generated
- **Created**: 2025-12-27
- **Updated**: 2025-12-30
- **Created By**: Master Skill Factory
- **Project**: Physical AI Textbook Hackathon
- **Reuse Count**: 2

## Purpose
Manage user authentication and learner profiles to support content personalization. Captures user background (software/hardware experience, robotics knowledge) during signup to enable personalized learning experiences.

## Trigger Conditions
- When implementing authentication features
- User mentions "auth", "login", "signup", "Better Auth", "user profile"
- When building user background capture
- When implementing JWT token handling

## Project Files Reference
```
backend/app/routes/auth.py        # Authentication endpoints (185 lines)
backend/app/models/user.py        # User model with background fields
backend/app/database.py           # SQLAlchemy database config
src/theme/Root.tsx                # Frontend auth context (if needed)
```

## Hackathon Requirement
> "Implement Signup and Signin using https://www.better-auth.com/
> At signup you will ask questions from the user about their software and hardware background."

## User Background Schema

```python
# backend/app/models/user.py
from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Background fields for personalization
    software_experience = Column(String, default="beginner")  # none, beginner, intermediate, advanced
    hardware_experience = Column(String, default="none")       # none, basic_kit, simulation, full_lab
    robotics_knowledge = Column(String, default="none")        # none, basic, intermediate, advanced

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
```

## API Endpoints

### POST /api/auth/signup
```python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    # Background questions
    software_experience: str = "beginner"
    hardware_experience: str = "none"
    robotics_knowledge: str = "none"

class SignupResponse(BaseModel):
    id: str
    email: str
    token: str
    message: str

@router.post("/signup", response_model=SignupResponse)
async def signup(request: SignupRequest, db: Session = Depends(get_session)):
    """Register new user with background information"""

    # Check if user exists
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed = pwd_context.hash(request.password)

    # Create user
    user = User(
        email=request.email,
        hashed_password=hashed,
        software_experience=request.software_experience,
        hardware_experience=request.hardware_experience,
        robotics_knowledge=request.robotics_knowledge
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate JWT token
    token = create_access_token(user_id=str(user.id), email=user.email)

    return SignupResponse(
        id=str(user.id),
        email=user.email,
        token=token,
        message="User created successfully"
    )
```

### POST /api/auth/login
```python
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    id: str
    email: str
    token: str
    user_background: dict

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_session)):
    """Login user and return token with profile"""

    user = db.query(User).filter(User.email == request.email).first()
    if not user or not pwd_context.verify(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user_id=str(user.id), email=user.email)

    return LoginResponse(
        id=str(user.id),
        email=user.email,
        token=token,
        user_background={
            "software_experience": user.software_experience,
            "hardware_experience": user.hardware_experience,
            "robotics_knowledge": user.robotics_knowledge
        }
    )
```

### GET /api/auth/profile
```python
@router.get("/profile")
async def get_profile(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get current user profile"""
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user.id),
        "email": user.email,
        "software_experience": user.software_experience,
        "hardware_experience": user.hardware_experience,
        "robotics_knowledge": user.robotics_knowledge,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }
```

### PUT /api/auth/profile
```python
class UpdateProfileRequest(BaseModel):
    software_experience: str = None
    hardware_experience: str = None
    robotics_knowledge: str = None

@router.put("/profile")
async def update_profile(
    request: UpdateProfileRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Update user background profile"""
    user = db.query(User).filter(User.id == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if request.software_experience:
        user.software_experience = request.software_experience
    if request.hardware_experience:
        user.hardware_experience = request.hardware_experience
    if request.robotics_knowledge:
        user.robotics_knowledge = request.robotics_knowledge

    db.commit()
    return {"message": "Profile updated successfully"}
```

## JWT Token Handling

```python
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

def create_access_token(user_id: str, email: str) -> str:
    """Create JWT access token"""
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> dict:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

## Frontend Signup Form

```tsx
// Example signup form with background questions
import React, { useState } from 'react';

interface SignupFormData {
  email: string;
  password: string;
  software_experience: string;
  hardware_experience: string;
  robotics_knowledge: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    software_experience: 'beginner',
    hardware_experience: 'none',
    robotics_knowledge: 'none'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    // Store token and redirect
    localStorage.setItem('token', data.token);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />

      <h3>Tell us about your background</h3>

      <label>Software Experience:</label>
      <select
        value={formData.software_experience}
        onChange={(e) => setFormData({...formData, software_experience: e.target.value})}
      >
        <option value="none">No programming experience</option>
        <option value="beginner">Beginner (basic Python/JavaScript)</option>
        <option value="intermediate">Intermediate (built projects)</option>
        <option value="advanced">Advanced (professional developer)</option>
      </select>

      <label>Hardware Experience:</label>
      <select
        value={formData.hardware_experience}
        onChange={(e) => setFormData({...formData, hardware_experience: e.target.value})}
      >
        <option value="none">No hardware access</option>
        <option value="simulation">Simulation only (Gazebo, Isaac Sim)</option>
        <option value="basic_kit">Basic kit (Arduino, Raspberry Pi)</option>
        <option value="full_lab">Full lab (Jetson, RealSense, robots)</option>
      </select>

      <label>Robotics Knowledge:</label>
      <select
        value={formData.robotics_knowledge}
        onChange={(e) => setFormData({...formData, robotics_knowledge: e.target.value})}
      >
        <option value="none">New to robotics</option>
        <option value="basic">Basic (know what ROS is)</option>
        <option value="intermediate">Intermediate (used ROS before)</option>
        <option value="advanced">Advanced (professional roboticist)</option>
      </select>

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

## Environment Variables
```env
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
DATABASE_URL=postgresql://user:pass@host/db
```

## Safety Rules
- Never store plain text passwords
- Always hash passwords with bcrypt
- Use HTTPS in production
- Set appropriate token expiry
- Validate all inputs
- No sensitive data in JWT payload (use only user_id)

## Testing Checklist
- [ ] Signup creates user with background info
- [ ] Login returns token and profile
- [ ] Token validation works
- [ ] Profile endpoint returns background
- [ ] Profile update works
- [ ] Invalid credentials rejected
- [ ] Duplicate email rejected

## Integration with Personalization

User background is used by:
1. **Content Personalization Agent** - Adapts chapter content
2. **RAG Chatbot** - Adjusts response complexity
3. **Progress Tracking** - Recommends next steps

```python
# Example: Using user background in personalization
async def personalize_for_user(user_id: str, content: str, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    return await generate_personalized_content(
        content=content,
        expertise_level=user.software_experience,
        hardware_access=user.hardware_experience
    )
```

---

## Version
- **Version**: 2.0.0
- **Category**: Backend Skills
- **Integration**: Backend (FastAPI) + Frontend (React)
