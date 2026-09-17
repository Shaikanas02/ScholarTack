"""Centralized configuration for ScholarTack backend.

Centralizes Gemini model selection, API key retrieval, and environment settings.
Model name can be changed dynamically via the GEMINI_MODEL environment variable.
"""

import logging
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("scholartack.config")

# Google Gemini API Settings
# Read from GEMINI_API_KEY env var - NEVER hardcode
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()

# Centralized Model Name (default: gemini-2.5-flash for fast, reliable multimodal extraction)
# Other supported models: gemini-3.8-flash, gemini-3.6-flash, gemini-2.5-pro
GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()

# Environment and Server Settings
ENV: str = os.getenv("ENV", "development").strip()
PORT: int = int(os.getenv("PORT", "8000"))

# Validation Settings
CONFIDENCE_THRESHOLD_PROVEN: float = 0.75  # Facts with confidence >= 0.75 from docs are DOCUMENT_PROVEN


def get_gemini_client():
    """Initializes and returns the official Google GenAI client if GEMINI_API_KEY is present.
    Returns None if GEMINI_API_KEY is not configured or if initialization fails.
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_key_here":
        return None
    try:
        from google import genai
        return genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        logger.warning(f"Failed to initialize Google GenAI client: {e}")
        return None


def is_gemini_available() -> bool:
    """Returns True if a valid Gemini API key is configured."""
    return bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_key_here")
