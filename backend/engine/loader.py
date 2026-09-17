import json
import os
from datetime import date, datetime
from pathlib import Path
from typing import Dict, List

from backend.models.scheme import SchemePack


def is_scheme_stale(last_verified_str: str, review_window_days: int) -> bool:
    """Returns True if the scheme's verification date is older than review_window_days."""
    try:
        verified_date = datetime.strptime(last_verified_str, "%Y-%m-%d").date()
        today = date.today()
        delta = (today - verified_date).days
        return delta > review_window_days
    except Exception:
        return False


def load_scheme_packs(schemepacks_dir: Path | None = None) -> Dict[str, SchemePack]:
    """Loads and validates all scheme pack JSON files from directory.
    Fails loudly at startup if any pack has invalid schema.
    """
    if schemepacks_dir is None:
        schemepacks_dir = Path(__file__).resolve().parent.parent / "schemepacks"

    packs: Dict[str, SchemePack] = {}
    if not schemepacks_dir.exists():
        raise RuntimeError(f"Schemepacks directory not found at: {schemepacks_dir}")

    for file_path in schemepacks_dir.glob("*.json"):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            pack = SchemePack.model_validate(data)
            packs[pack.scheme_id] = pack
        except Exception as e:
            raise RuntimeError(f"Failed to load or validate scheme pack at {file_path}: {e}") from e

    return packs
