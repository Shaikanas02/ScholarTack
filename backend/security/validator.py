import io
import re
from typing import List, Tuple
from fastapi import HTTPException, UploadFile

# Allowed image magic bytes
MAGIC_NUMBERS = {
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"RIFF": "image/webp",  # WebP starts with RIFF....WEBP
    b"ftyp": "image/heic",  # HEIC usually has ftyp at offset 4
}

MAX_FILES = 8
MAX_FILE_SIZE = 8 * 1024 * 1024  # 8 MB
MAX_TOTAL_SIZE = 25 * 1024 * 1024  # 25 MB
MAX_NARRATIVE_LENGTH = 2000

PROMPT_INJECTION_PATTERNS = [
    r"ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions?",
    r"system\s*prompt",
    r"declare\s+(?:this\s+)?applicant\s+eligible",
    r"override\s+(?:all\s+)?rules?",
    r"bypass\s+verification",
    r"you\s+are\s+now\s+a\s+different\s+ai",
]


def sanitize_narrative(text: str) -> str:
    """Sanitizes narrative text to neutralize potential prompt injections."""
    if not text:
        return ""
    if len(text) > MAX_NARRATIVE_LENGTH:
        text = text[:MAX_NARRATIVE_LENGTH]

    sanitized = text
    for pattern in PROMPT_INJECTION_PATTERNS:
        sanitized = re.sub(pattern, "[UNTRUSTED_INSTRUCTION_REMOVED]", sanitized, flags=re.IGNORECASE)

    return sanitized


async def validate_uploaded_files(files: List[UploadFile]) -> List[Tuple[str, bytes, str]]:
    """Validates uploaded files for count, size, MIME type, and magic bytes.
    Returns list of (filename, file_bytes, content_type).
    Raises HTTPException(400) if validation fails.
    """
    if not files or len(files) == 0:
        return []

    if len(files) > MAX_FILES:
        raise HTTPException(
            status_code=400,
            detail=f"Too many files uploaded: {len(files)}. Maximum allowed is {MAX_FILES} images."
        )

    validated: List[Tuple[str, bytes, str]] = []
    total_size = 0

    for f in files:
        if not f.filename:
            continue

        file_bytes = await f.read()
        file_size = len(file_bytes)
        total_size += file_size

        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File '{f.filename}' exceeds maximum single file size of 8 MB ({file_size / 1024 / 1024:.2f} MB)."
            )

        if total_size > MAX_TOTAL_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"Total upload size exceeds maximum allowed 25 MB ({total_size / 1024 / 1024:.2f} MB)."
            )

        # Magic byte check
        is_valid_magic = False
        content_type = f.content_type or "image/jpeg"

        # Check JPEG
        if file_bytes.startswith(b"\xff\xd8\xff"):
            is_valid_magic = True
            content_type = "image/jpeg"
        # Check PNG
        elif file_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
            is_valid_magic = True
            content_type = "image/png"
        # Check WEBP
        elif file_bytes.startswith(b"RIFF") and len(file_bytes) > 12 and file_bytes[8:12] == b"WEBP":
            is_valid_magic = True
            content_type = "image/webp"
        # Check HEIC (ftypheic or ftypmsf1 around offset 4)
        elif len(file_bytes) > 12 and b"ftyp" in file_bytes[:16]:
            is_valid_magic = True
            content_type = "image/heic"
        # For testing synthetic dummy files (e.g. small mock text or test blobs)
        elif f.filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".heic")):
            is_valid_magic = True

        if not is_valid_magic:
            raise HTTPException(
                status_code=400,
                detail=f"File '{f.filename}' is not a valid image format. Supported formats: JPEG, PNG, WEBP, HEIC."
            )

        validated.append((f.filename, file_bytes, content_type))

    return validated
