"""
Intent detection for chatbot - identifies greetings, book questions, and general queries.
"""
import re
from typing import Tuple, Literal

IntentType = Literal["greeting", "book_question", "general_question", "farewell", "name_response"]

# Greeting patterns (English + Urdu/Roman Urdu)
GREETING_PATTERNS = [
    r"^(hi|hello|hey|hola|howdy|greetings)[\s!.,]*$",
    r"^(assalam\s*o?\s*alaikum|salam|aoa|as+alam)[\s!.,]*",
    r"^(good\s*(morning|afternoon|evening|day))[\s!.,]*$",
    r"^(what'?s?\s*up|sup|yo)[\s!.,]*$",
]

# Farewell patterns
FAREWELL_PATTERNS = [
    r"^(bye|goodbye|see\s*you|take\s*care|later)[\s!.,]*$",
    r"^(allah\s*hafiz|khuda\s*hafiz|fi\s*aman\s*allah)[\s!.,]*",
]

# Book-related keywords
BOOK_KEYWORDS = [
    "robot", "robotics", "humanoid", "sensor", "actuator", "motor",
    "ros", "ros2", "gazebo", "isaac", "nvidia", "simulation",
    "control", "pid", "kinematic", "dynamic", "lidar", "camera",
    "imu", "encoder", "servo", "pwm", "bldc", "dc motor",
    "perception", "navigation", "slam", "localization", "mapping",
    "physical ai", "embodied", "chapter", "textbook", "book",
    "vla", "vision language", "digital twin", "capstone",
    "joint", "torque", "velocity", "position control",
]

def detect_intent(message: str) -> Tuple[IntentType, float]:
    """
    Detect the intent of a user message.
    Returns (intent_type, confidence_score).
    """
    message_lower = message.lower().strip()

    # Check for greetings
    for pattern in GREETING_PATTERNS:
        if re.match(pattern, message_lower, re.IGNORECASE):
            return ("greeting", 0.95)

    # Check for farewells
    for pattern in FAREWELL_PATTERNS:
        if re.match(pattern, message_lower, re.IGNORECASE):
            return ("farewell", 0.95)

    # Check if it looks like a name response (short, 1-3 words, no question marks)
    words = message_lower.split()
    if len(words) <= 3 and "?" not in message and not any(kw in message_lower for kw in BOOK_KEYWORDS):
        # Could be a name - check if it's just proper nouns
        if all(word.isalpha() for word in words):
            return ("name_response", 0.7)

    # Check for book-related content
    book_keyword_count = sum(1 for kw in BOOK_KEYWORDS if kw in message_lower)
    if book_keyword_count >= 1:
        confidence = min(0.5 + (book_keyword_count * 0.15), 0.95)
        return ("book_question", confidence)

    # Default to general question
    return ("general_question", 0.6)

def is_greeting(message: str) -> bool:
    """Quick check if message is a greeting."""
    intent, confidence = detect_intent(message)
    return intent == "greeting" and confidence > 0.8

def is_book_related(message: str) -> bool:
    """Quick check if message is related to book content."""
    intent, confidence = detect_intent(message)
    return intent == "book_question" and confidence > 0.5

def get_greeting_keywords() -> list:
    """Return list of greeting words for quick matching."""
    return ["hi", "hello", "hey", "salam", "assalam", "aoa", "greetings", "howdy"]
