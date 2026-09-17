# Haqdaar (हक़दार) — System Architecture

> **"Gemini extracts. Evidence proves. Rules decide. Haqdaar guides the action."**

Haqdaar is a verification-first civic benefits bridge that transforms a citizen's unstructured life narrative and phone photos of paper documents into a verified, explainable proof ledger and pre-filled benefit applications.

---

## 1. High-Level Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CITIZEN BROWSER                                │
│                                                                             │
│  [Natural Language / Voice]            [Document Photos (1–8 files)]        │
└───────────────────────┬──────────────────────────────────────┬──────────────┘
                        │                                      │
                        │ Multipart POST /api/analyze          │
                        ▼                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD RUN (Single Container)                      │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ FastAPI Gateway                                                       │  │
│  │ ├── /healthz (< 50ms, zero deps)                                      │  │
│  │ ├── /api/schemes                                                      │  │
│  │ ├── /api/analyze                                                      │  │
│  │ └── /api/application/{id}/pdf                                         │  │
│  └──────────────────┬────────────────────────────────────────────────────┘  │
│                     │                                                       │
│                     ▼                                                       │
│  ┌─────────────────────────────────────────┐                                │
│  │ 1. Security & Upload Validator          │                                │
│  │    - MIME & magic bytes verification    │                                │
│  │    - 8 MB/file, 25 MB max total         │                                │
│  │    - Prompt injection neutralization    │                                │
│  └──────────────────┬──────────────────────┘                                │
│                     │                                                       │
│                     ▼                                                       │
│  ┌─────────────────────────────────────────┐      ┌──────────────────────┐  │
│  │ 2. Multimodal Extraction Layer          │─────▶│ Google Gemini API    │  │
│  │    - Batched document understanding     │◀─────│ (gemini-2.5-flash)   │  │
│  │    - Strict Pydantic v2 JSON schema     │      └──────────────────────┘  │
│  │    - Untrusted data boundary enforcement│                                │
│  └──────────────────┬──────────────────────┘                                │
│                     │                                                       │
│                     ▼                                                       │
│  ┌─────────────────────────────────────────┐                                │
│  │ 3. Deterministic Merge & Conflict Layer │                                │
│  │    - Provenance Precedence:             │                                │
│  │      DOCUMENT_PROVEN > SELF_DECLARED    │                                │
│  │    - Explicit Conflict Item preservation│                                │
│  │    - Deterministic Python arithmetic    │                                │
│  └──────────────────┬──────────────────────┘                                │
│                     │                                                       │
│                     ▼                                                       │
│  ┌─────────────────────────────────────────┐      ┌──────────────────────┐  │
│  │ 4. Pure Python Deterministic Engine     │◀─────│ Versioned Scheme     │  │
│  │    - Zero network / zero model calls    │      │ Packs (JSON)         │  │
│  │    - Predicate operators (gt, lte, eq)  │      │ - PM-KISAN           │  │
│  │    - Staleness review window validation │      │ - PM-JAY (Ayushman)  │  │
│  │    - Execution < 10ms                   │      │ - IGNOAPS Pension    │  │
│  └──────────────────┬──────────────────────┘      │ - Post-Matric SC     │  │
│                     │                             └──────────────────────┘  │
│                     ▼                                                       │
│  ┌─────────────────────────────────────────┐                                │
│  │ 5. Criterion Proof Ledger Generator     │                                │
│  │    - Criteria: PASS, FAIL, MISSING_PROOF│                                │
│  │    - Scheme Verdict: ELIGIBLE/INCOMPLETE│                                │
│  │    - Proving document & clause citations│                                │
│  └──────────────────┬──────────────────────┘                                │
│                     │                                                       │
│                     ▼                                                       │
│  ┌─────────────────────────────────────────┐                                │
│  │ 6. Output & Action Engine               │                                │
│  │    - Pre-filled ReportLab PDF generator │                                │
│  │    - Printable 1-page summary ledger    │                                │
│  │    - Official portal & office routing   │                                │
│  └─────────────────────────────────────────┘                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Separation of Responsibilities

The central technical differentiator of Haqdaar is strict separation of concerns:

| Layer | Component | Role | What It MUST NOT Do |
| :--- | :--- | :--- | :--- |
| **Extraction** | Google Gemini 2.5 Flash | Multimodal OCR, natural language entity extraction, document classification | Decide legal eligibility, invent thresholds, override rules |
| **Evidence & Merge** | Python Merge Layer | Assign provenance tags, detect conflicts between statement and document | Silently guess between conflicting values |
| **Decision** | Python Rule Engine | Evaluate predicates against versioned statutory criteria | Make network or LLM calls; hallucinate |
| **Action** | ReportLab + Routing | Pre-fill application PDF and show physical CSC / digital portal routes | Claim to submit without real integration |

---

## 3. Provenance Lifecycle

Every fact in Haqdaar receives an explicit provenance state:

```text
       [Citizen Narrative]              [Document Images]
               │                                │
               ▼                                ▼
       [SELF_DECLARED]                 [Confidence Score]
               │                         ├── >= 0.75 ──▶ [DOCUMENT_PROVEN]
               │                         └── < 0.75  ──▶ [NEEDS_CONFIRMATION / UNKNOWN]
               │                                │
               └───────────────┬────────────────┘
                               ▼
                    [Conflict Detection]
                     ├── Matches ───▶ Use DOCUMENT_PROVEN
                     └── Differs ───▶ Surface ConflictItem to User for explicit resolution
```

---

## 4. Load-Bearing Google Services

1. **Google Gemini API (`google-genai` SDK)**:
   - Multimodal document classification across land records, caste certificates, income slips, and marksheets.
   - Zero-shot natural language understanding of messy rural/urban household narratives.
   - Structured JSON response schema enforcement via Pydantic v2 models.
2. **Google Cloud Run**:
   - Stateless, containerized deployment hosting both the FastAPI backend and Vite React SPA.
   - Built with multi-stage Dockerfile; auto-scales from zero to handle burst traffic.
3. **Google Secret Manager**:
   - Manages production `GEMINI_API_KEY` with zero secrets committed to source control.

---

## 5. Security & Privacy Guarantees

- **Untrusted Data Isolation**: Document OCR text is strictly isolated as data inside prompt wrappers, preventing prompt injection instructions from overriding application logic.
- **Server-Side Validation**: Enforces magic bytes verification, single-file limit of 8 MB, total upload limit of 25 MB, and maximum 8 images.
- **Data Minimization**: Source images are processed in-memory and discarded; personal document photos are never persisted to disk.
