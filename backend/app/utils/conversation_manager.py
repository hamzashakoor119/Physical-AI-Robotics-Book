"""
Conversation manager for maintaining chat state, greeting flow, and name collection.
"""
from typing import Dict, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import uuid

@dataclass
class ConversationState:
    """State for a single conversation."""
    session_id: str
    user_name: Optional[str] = None
    greeted: bool = False
    asked_name: bool = False
    asked_help_type: bool = False
    message_count: int = 0
    created_at: datetime = field(default_factory=datetime.now)
    last_activity: datetime = field(default_factory=datetime.now)

# In-memory conversation store (simple approach - could use Redis for production)
_conversations: Dict[str, ConversationState] = {}

# Session timeout (30 minutes)
SESSION_TIMEOUT = timedelta(minutes=30)

def get_or_create_session(session_id: Optional[str] = None) -> ConversationState:
    """Get existing session or create a new one."""
    # Clean up expired sessions
    _cleanup_expired_sessions()

    if session_id and session_id in _conversations:
        session = _conversations[session_id]
        session.last_activity = datetime.now()
        return session

    # Create new session
    new_id = session_id or str(uuid.uuid4())
    session = ConversationState(session_id=new_id)
    _conversations[new_id] = session
    return session

def update_session(session_id: str, **updates) -> Optional[ConversationState]:
    """Update session with new values."""
    if session_id in _conversations:
        session = _conversations[session_id]
        for key, value in updates.items():
            if hasattr(session, key):
                setattr(session, key, value)
        session.last_activity = datetime.now()
        session.message_count += 1
        return session
    return None

def get_session(session_id: str) -> Optional[ConversationState]:
    """Get session by ID."""
    return _conversations.get(session_id)

def _cleanup_expired_sessions() -> None:
    """Remove expired sessions to free memory."""
    now = datetime.now()
    expired = [
        sid for sid, session in _conversations.items()
        if now - session.last_activity > SESSION_TIMEOUT
    ]
    for sid in expired:
        del _conversations[sid]

def generate_greeting_response(session: ConversationState, user_message: str) -> str:
    """Generate appropriate greeting response based on conversation state."""

    # First greeting - introduce and ask name
    if not session.greeted:
        session.greeted = True
        session.asked_name = True

        # Detect if greeting is in Urdu
        urdu_greetings = ["assalam", "salam", "aoa"]
        is_urdu = any(g in user_message.lower() for g in urdu_greetings)

        if is_urdu:
            return (
                "Walaikum Assalam! Welcome! I'm the Physical AI & Humanoid Robotics Book Assistant, "
                "built by CodeWithHamza. I'm here to help you learn about robotics, sensors, actuators, "
                "ROS2, and much more from the textbook.\n\n"
                "Could you please tell me your name?"
            )
        else:
            return (
                "Hello! Welcome! I'm the Physical AI & Humanoid Robotics Book Assistant, "
                "built by CodeWithHamza. I'm here to help you learn about robotics, sensors, actuators, "
                "ROS2, and everything covered in the textbook.\n\n"
                "Could you please tell me your name?"
            )

    # Already greeted but don't have name yet
    if session.asked_name and not session.user_name:
        return "Nice to meet you! Could you please tell me your name so I can assist you better?"

    # Have name, returning user
    if session.user_name:
        return f"Welcome back, {session.user_name}! How can I help you today?"

    return "Hello! How can I help you today?"

def generate_name_response(session: ConversationState, name: str) -> str:
    """Generate response after user provides their name."""
    session.user_name = name.strip().title()
    session.asked_name = False
    session.asked_help_type = True

    return (
        f"Nice to meet you, {session.user_name}! How can I help you today?\n\n"
        "You can:\n"
        "- Ask questions about the Physical AI & Humanoid Robotics textbook\n"
        "- Select text from any chapter and ask me to explain it\n"
        "- Ask general questions about robotics topics\n\n"
        "What would you like to know?"
    )

def generate_farewell_response(session: ConversationState) -> str:
    """Generate farewell response."""
    if session.user_name:
        return f"Goodbye, {session.user_name}! It was great helping you. Feel free to come back anytime!"
    return "Goodbye! Feel free to come back anytime you have questions about robotics!"

def format_response_with_name(session: ConversationState, response: str) -> str:
    """Optionally personalize response with user's name."""
    # Only personalize occasionally to avoid being annoying
    if session.user_name and session.message_count % 5 == 0:
        return f"{session.user_name}, {response[0].lower()}{response[1:]}"
    return response
