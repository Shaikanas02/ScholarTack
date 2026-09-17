from typing import Any


def evaluate_operator(op: str, actual_value: Any, expected_value: Any) -> bool:
    """Pure Python deterministic predicate evaluation.
    Zero network calls. Zero LLM calls.
    """
    if actual_value is None:
        return False

    op = op.lower()

    if op == "eq":
        if isinstance(expected_value, str) and isinstance(actual_value, str):
            return actual_value.strip().lower() == expected_value.strip().lower()
        return actual_value == expected_value

    elif op == "neq":
        if isinstance(expected_value, str) and isinstance(actual_value, str):
            return actual_value.strip().lower() != expected_value.strip().lower()
        return actual_value != expected_value

    elif op == "gt":
        try:
            return float(actual_value) > float(expected_value)
        except (ValueError, TypeError):
            return False

    elif op == "gte":
        try:
            return float(actual_value) >= float(expected_value)
        except (ValueError, TypeError):
            return False

    elif op == "lt":
        try:
            return float(actual_value) < float(expected_value)
        except (ValueError, TypeError):
            return False

    elif op == "lte":
        try:
            return float(actual_value) <= float(expected_value)
        except (ValueError, TypeError):
            return False

    elif op == "in":
        if isinstance(expected_value, list):
            actual_str = str(actual_value).strip().lower()
            return any(str(item).strip().lower() == actual_str for item in expected_value)
        return False

    elif op == "not_in":
        if isinstance(expected_value, list):
            actual_str = str(actual_value).strip().lower()
            return not any(str(item).strip().lower() == actual_str for item in expected_value)
        return True

    elif op == "between":
        # expected_value is [min, max]
        if isinstance(expected_value, list) and len(expected_value) == 2:
            try:
                val = float(actual_value)
                return float(expected_value[0]) <= val <= float(expected_value[1])
            except (ValueError, TypeError):
                return False
        return False

    elif op == "exists":
        if expected_value is True:
            return actual_value is not None
        elif expected_value is False:
            return actual_value is None
        return bool(actual_value)

    return False
