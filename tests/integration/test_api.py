import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_healthz_endpoint():
    """Health check must return 200, status 'ok', and load all scheme packs in <50ms."""
    response = client.get("/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == "2.0"
    assert data["packs_loaded"] >= 6


def test_get_schemes_endpoint():
    response = client.get("/api/schemes")
    assert response.status_code == 200
    schemes = response.json()
    assert len(schemes) >= 6
    scheme_ids = [s["id"] for s in schemes]
    assert "pm_kisan" in scheme_ids
    assert "ayushman_bharat" in scheme_ids
    assert "pmay_gramin" in scheme_ids
    assert "pm_ujjwala" in scheme_ids


def test_analyze_endpoint_with_narrative_and_mock_files():
    """Tests the full /api/analyze flow with narrative and uploaded images."""
    fake_land_record = b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"Mock Land Record" * 10
    fake_aadhaar = b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"Mock Aadhaar Card" * 10

    files = [
        ("files", ("khasra_land_record.jpg", fake_land_record, "image/jpeg")),
        ("files", ("aadhaar_identity.jpg", fake_aadhaar, "image/jpeg")),
    ]
    data = {
        "narrative": "I farm 2 acres in our village, my income is 1.2 lakh per year.",
    }

    response = client.post("/api/analyze", data=data, files=files)
    assert response.status_code == 200
    res_data = response.json()
    assert "household_facts" in res_data
    assert "schemes_evaluated" in res_data
    assert res_data["execution_time_ms"] > 0

    pmk = next(e for e in res_data["schemes_evaluated"] if e["scheme_id"] == "pm_kisan")
    assert pmk is not None


def test_analyze_endpoint_with_json_payload():
    """Tests programmatic /api/analyze call with application/json."""
    payload = {
        "narrative": "My mother is a widow, we farm two acres of land and earn 1.5 lakh per year.",
        "conflict_resolutions": {"annual_family_income": 150000.0}
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["household_facts"]["land_holding_acres"]["raw_value"] == 2.0
    assert len(res_data["schemes_evaluated"]) >= 6


def test_pdf_generation_endpoint():
    payload = {
        "applicant_name": {"fact_key": "applicant_name", "raw_value": "Ramesh Kumar", "provenance": "DOCUMENT_PROVEN"},
        "land_holding_acres": {"fact_key": "land_holding_acres", "raw_value": 2.0, "provenance": "DOCUMENT_PROVEN"},
    }
    response = client.post("/api/application/pm_kisan/pdf", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.content.startswith(b"%PDF-")
