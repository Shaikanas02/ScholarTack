# ScholarTrack — Smart Student Scholarship Intelligence, Deadlines & Statutory Proof

> **ScholarTrack turns complex student profiles, academic records, and proof documents into an evidence-backed, rule-by-rule scholarship eligibility assessment, deadline tracker, and institutional PDF report.**

**Core Thesis:**
> ### *"Gemini extracts. Evidence proves. Rules decide. ScholarTrack secures the scholarship."*

> **Live Demo** - " https://haqdaar-promptwars-techverse-neqx.onrender.com "

[![Backend Tests](https://img.shields.io/badge/Backend%20Tests-36%2F36%20Passing-emerald?style=flat-square&logo=pytest)](#-automated-testing)
[![Architecture](https://img.shields.io/badge/Architecture-Dual--Layer%20Airgap-blue?style=flat-square)](#-architecture--dual-layer-airgap)
[![Statutory Schemes](https://img.shields.io/badge/Scholarship%20Packs-22%20Verified%20Schemes-teal?style=flat-square)](#-statutory-scholarship-schemes-22-packs)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Tailwind%20v4-indigo?style=flat-square)](#-system-components)
[![License](https://img.shields.io/badge/License-Apache%202.0-slate?style=flat-square)](LICENSE)

---

## 🎯 Project Overview & Academic Submission

| Item | Details |
| :--- | :--- |
| **Project Name** | **ScholarTrack (ScholarTack)** |
| **Domain** | **Higher Education, Civic Technology & Statutory Student Welfare** |
| **Core Architecture** | **FastAPI (Python 3.11) + React 19 (TypeScript, Vite, Tailwind CSS v4)** |
| **AI Integration** | **Google Gemini Multimodal API** (`gemini-2.5-flash` / `gemini-3.8-flash`) with **100% deterministic offline demo mode** |
| **Decision Engine** | **Deterministic Python rule engine** (< 15ms execution, zero hallucination) |
| **Statutory Scheme Packs** | **22 fully verified schemes** (National, State SSP Karnataka, AICTE, UGC, Central Sector) |
| **Backend Test Suite** | **36 / 36 automated tests passing (100%)** via `pytest` |
| **Institutional PDF Engine** | **ReportLab A4 multi-section student report generation** with verification badges |

---

## 1. Problem Statement

Every academic year, thousands of eligible students in India miss out on government and statutory scholarships worth crores of rupees due to:

1. **Complex Eligibility Criteria:** Policies enforce intricate mathematical thresholds (`family_income <= 250000`, `academic_marks >= 75%`, `social_category in ['SC', 'ST', 'OBC']`, `domicile_state == 'Karnataka'`).
2. **Scattered Portals & Deadlines:** Schemes are spread across the National Scholarship Portal (NSP), State Scholarship Portal (SSP Karnataka), AICTE portal, and UGC platforms with disparate deadlines and documentation rules.
3. **Document Uncertainty:** Students struggle with knowing whether their income certificates, caste certificates, admission receipts, and marksheets satisfy statutory audit standards.
4. **The Hallucination Danger of Generative LLMs:** An AI model asked directly *"Is this student eligible?"* will frequently hallucinate policies, invent eligibility cut-offs, or assume unverified claims to be true.

---

## 2. The ScholarTrack Solution

ScholarTrack solves this by strictly enforcing a **Dual-Layer Airgap** that separates untrusted multimodal AI extraction from deterministic statutory rule evaluation:

```text
  [Student Profile & Input]
  Student Academic Bio / Story (Voice or Text)
  + Uploaded Document Photos (Marksheet, Bonafide, Income Cert, Caste Cert)
                       │
                       ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 1. AI Layer (Gemini 2.5 Flash Multimodal)               │
 │    • Extracts structured facts as untrusted data        │
 │    • Extracts verbatim evidence quotes & confidence     │
 │    • Detects unreadable / low-quality documents         │
 │    • Seamless fallback to offline deterministic mode    │
 └─────────────────────────┬───────────────────────────────┘
                           │
                           ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 2. Verification Layer (Pydantic v2 Fact Pipeline)       │
 │    • Tags Provenance: DOCUMENT_PROVEN vs SELF_DECLARED  │
 │    • Detects conflicts (e.g. story ₹1.8L vs doc ₹2.1L)  │
 │    • Interactive human-in-the-loop conflict resolution  │
 └─────────────────────────┬───────────────────────────────┘
                           │
                           ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 3. Decision Layer (Deterministic Rule Engine)           │
 │    • Pure Python rule evaluator (< 15ms execution)      │
 │    • 22 verified statutory scheme packs (JSON)          │
 │    • Strict verdicts: ELIGIBLE, INCOMPLETE, NOT_ELIGIBLE│
 └─────────────────────────┬───────────────────────────────┘
                           │
                           ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 4. Action & Reporting Layer                             │
 │    • Personalized scholarship match ranking & score     │
 │    • Active deadline tracker & status management        │
 │    • Document readiness checklist & audit ledger        │
 │    • 1-Click Institutional A4 PDF Report Generation     │
 └─────────────────────────────────────────────────────────┘
```

---

## 3. Key Capabilities & Features

- **Scholarship Directory & Scheme Catalog:** Browse 22 verified schemes with category filters (Technical, Merit, SC/ST, Girls, Disabilities, General).
- **Personalized Eligibility Checker:** Real-time eligibility evaluation comparing student attributes against statutory requirements with criteria-by-criteria explanations.
- **Student Profile Management:**
  - **4 Authentic Demo Profiles** for Ghousia College of Engineering (Shaik Mohammed Anas, Shiyaz Abdul Azeez, Saqib Khan, Mohammed Rumaiz).
  - **Add New Student Form:** Completely clean registration form allowing any college, USN, course, category, and academic attributes.
  - **Recently Used Students Roster:** Quick profile switcher with persistent local storage.
- **Application Tracker:** Monitor tracked scholarship applications across stages (`Draft`, `Preparing Documents`, `Submitted`, `College Verified`, `Approved / Disbursed`).
- **Notification & Deadline Alerts:** Real-time deadline proximity badges and compliance alerts (e.g. NPCI Aadhaar bank seeding).
- **Institutional PDF Report:** Generates formal A4 report cards containing candidate attributes, eligible schemes, document readiness, and institutional verification stamps.
- **Zero-Dependency High-Fidelity Offline Mode:** Works seamlessly without an API key for evaluations, testing, and offline presentations.

---

## 4. Statutory Scholarship Schemes (22 Packs)

| # | Scheme ID | Scheme Title | Authority | Benefit |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `aicte_pragati_ug` | AICTE Pragati Scholarship for Girls | AICTE | ₹50,000 / year |
| 2 | `aicte_saksham` | AICTE Saksham Scholarship (Specially-Abled) | AICTE | ₹50,000 / year |
| 3 | `aicte_swanath` | AICTE Swanath Scholarship Scheme | AICTE | ₹50,000 / year |
| 4 | `nsp_ug_merit` | PM-USP Central Sector Scheme of Scholarship (NSP UG) | Ministry of Education | ₹12,000 / year |
| 5 | `ssp_post_matric_ug` | SSP Post-Matric Scholarship (State Scholarship Portal) | Govt. of Karnataka | Tuition + Maintenance |
| 6 | `inspire_she` | INSPIRE Scholarship for Higher Education (SHE) | DST, Govt. of India | ₹80,000 / year |
| 7 | `post_matric_sc` | Post-Matric Scholarship for SC Students | MoSJE | 100% Tuition + Stipend |
| 8 | `post_matric_st` | Centrally Sponsored Post-Matric for ST Students | MoTA | 100% Tuition + Stipend |
| 9 | `post_matric_disabilities` | Post-Matric Scholarship for Students with Disabilities | DEPwD | Full Fee + Maintenance |
| 10 | `top_class_sc` | Central Sector Scholarship of Top Class Education for SC | MoSJE | Full Tuition + Living |
| 11 | `top_class_pwd` | Top Class Education for Students with Disabilities | DEPwD | Tuition + Computer Allowance |
| 12 | `pm_yasasvi_top_class` | PM YASASVI Top Class College Education for OBC/EBC | MoSJE | Up to ₹2,00,000 / year |
| 13 | `begum_hazrat_mahal` | Begum Hazrat Mahal National Scholarship for Girls | MAEF / MoMA | ₹6,000 / year |
| 14 | `ugc_ishan_uday` | UGC Ishan Uday Special Scholarship for NER | UGC | ₹5,400–₹7,800 / month |
| 15 | `ugc_single_girl_child` | PG Indira Gandhi Scholarship for Single Girl Child | UGC | ₹36,200 / year |
| 16 | `ugc_pg_studies` | National Scholarship for Post Graduate Studies | UGC | ₹15,000 / month |
| 17 | `national_fellowship_st` | National Fellowship & Scholarship for ST Students | MoTA | Full M.Phil/Ph.D Support |
| 18 | `pm_kisan` | PM-KISAN (Income Support for Rural Families) | MoA&FW | ₹6,000 / year |
| 19 | `pmay_gramin` | PMAY-G (Pradhan Mantri Awaas Yojana - Gramin) | MoRD | ₹1,20,000 grant |
| 20 | `ayushman_bharat` | Ayushman Bharat PM-JAY (Health Protection) | NHA | ₹5,00,000 / year cover |
| 21 | `pm_ujjwala` | PMUY 2.0 (Clean Energy LPG Connection) | MoPNG | Subsidized LPG |
| 22 | `ignoaps` | Indira Gandhi National Old Age Pension Scheme | MoRD | Monthly Pension |

---

## 5. System Architecture & Dual-Layer Airgap

```
  ┌─────────────────────────────────────────────────────────┐
  │                    FastAPI Gateway                      │
  │  ├── GET  /healthz             (Health check)          │
  │  ├── GET  /api/scholarships    (22 scheme catalog)     │
  │  ├── POST /api/scholarships/recommend (Match engine)   │
  │  ├── POST /api/analyze         (Multimodal extraction) │
  │  ├── POST /api/student/report-pdf (A4 ReportLab PDF)   │
  │  └── GET  /*                   (Production UI static)  │
  └───────────────────────────┬─────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
  ┌───────────────────────┐       ┌───────────────────────┐
  │  Extraction Layer     │       │  Deterministic Engine │
  │  - Gemini Multimodal  │       │  - Zero network calls │
  │  - Strict JSON schema │       │  - Pure Python rules  │
  │  - Offline fallback   │       │  - Conflict ledger    │
  └───────────────────────┘       └───────────────────────┘
```

- **Zero Hardcoded Secrets:** Configuration is read dynamically from environment variables via `backend/config.py`.
- **Ephemeral Processing:** Uploaded files and photos are processed in memory and never written to permanent disk.
- **Magic Byte Validation:** File uploads are strictly checked for valid binary headers (`image/jpeg`, `image/png`, `application/pdf`).

---

## 6. How to Run on Windows (College Submission & Evaluator Guide)

### Prerequisites
- **Python 3.10 or 3.11** installed with `pip` added to PATH ([python.org](https://www.python.org/))
- **Node.js 18+ & npm** ([nodejs.org](https://nodejs.org/)) *(only required for Option B / frontend development)*

---

### Option A: Quick Single-Server Mode (Recommended for Evaluators)

Because the React production bundle is pre-compiled into `frontend/dist`, you can run the **entire application (both frontend and backend) using just Python**:

```cmd
# 1. Open Command Prompt or PowerShell in project folder
python -m venv .venv
.\.venv\Scripts\activate

# 2. Install backend requirements
pip install -r requirements.txt

# 3. Start the unified server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** in your web browser.  
The FastAPI process serves the full interactive React application, the 22 scheme packs, and all REST endpoints.

---

### Option B: Full Development Mode (Two Terminals)

**Terminal 1 — Backend:**
```cmd
.\.venv\Scripts\activate
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```cmd
cd frontend
npm install
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 7. Automated Testing

Run the automated backend test suite using `pytest`:

```cmd
.\.venv\Scripts\pytest tests
```

**Result: 36 / 36 tests passing (100% pass rate)**

```text
tests\integration\test_api.py .....                                      [ 13%]
tests\integration\test_scholarships_api.py ......                        [ 30%]
tests\security\test_security.py ...                                      [ 38%]
tests\unit\test_engine.py .........                                      [ 63%]
tests\unit\test_gemini_integration.py .....                              [ 77%]
tests\unit\test_merge.py ...                                             [ 86%]
tests\unit\test_pdf.py ..                                                [ 91%]
tests\unit\test_schemas.py ...                                           [100%]
======================= 36 passed, 2 warnings in 1.40s =======================
```

To build the frontend production assets:
```cmd
cd frontend
npm run build
```

---

## 8. Technology Stack

- **Backend:** FastAPI, Python 3.11, Pydantic v2, ReportLab, Uvicorn, Pytest
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti
- **AI & Document Intelligence:** Google Gemini API (`google-genai` SDK) with deterministic offline fallback
- **Containerization:** Docker multi-stage build, Google Cloud Run ready


