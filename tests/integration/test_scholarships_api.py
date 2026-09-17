from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_get_scholarships():
    res = client.get('/api/scholarships')
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 4
    for s in data:
        assert 'id' in s
        assert 'name' in s
        assert 'category' in s
        assert 'deadline' in s

def test_get_scholarships_filtered():
    res = client.get('/api/scholarships?category=Girls')
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    assert any('Girls' in s['category'] for s in data)

def test_get_scholarship_updates():
    res = client.get('/api/scholarships/updates')
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 3
    assert all('title' in u and 'urgency' in u for u in data)

def test_get_student_notifications():
    res = client.get('/api/scholarships/notifications')
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 3
    assert any(n['type'] == 'deadline' for n in data)

def test_recommend_scholarships():
    profile = {
        'name': 'Pooja Kumari',
        'gender': 'female',
        'academic_percentage': 78.0,
        'annual_family_income': 140000.0,
        'is_post_matric_student': True,
        'social_category': 'SC',
        'is_availing_other_scholarship': False,
        'aadhaar_present': True,
        'bank_account_present': True,
    }
    res = client.post('/api/scholarships/recommend', json=profile)
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 4
    # Post-Matric SC should be high match for SC student
    sc_match = next((r for r in data if r['scheme_id'] == 'post_matric_sc'), None)
    assert sc_match is not None
    assert sc_match['match_score'] >= 80

def test_generate_student_report_pdf():
    payload = {
        'student': {
            'applicant_name': 'Ananya Sharma',
            'applicant_age': 18,
            'gender': 'female',
            'course_name': 'B.Tech Computer Science',
            'annual_family_income': 220000.0,
            'academic_percentage': 85.0,
            'domicile_state': 'Karnataka',
            'aadhaar_present': True,
            'bank_account_present': True,
        },
        'eligible_scholarships': [
            {
                'scheme_name': 'AICTE Pragati Scholarship for Girls',
                'authority': 'AICTE',
                'award_amount': '₹50,000 / year',
                'deadline': '2026-09-30',
                'match_score': 100,
            }
        ],
        'tracked_applications': [],
        'document_checklist': [],
    }
    res = client.post('/api/student/report-pdf', json=payload)
    assert res.status_code == 200
    assert res.headers['content-type'] == 'application/pdf'
    assert len(res.content) > 1000

