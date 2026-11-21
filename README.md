# SmartHireAI — AI-Powered Resume & Skill Gap Analysis Platform 📄🤖

[![Python CI](https://github.com/LAKSHYA-NIGAM/AI-Powered-Resume-For-Skill-Gap-Analysis/actions/workflows/ci.yml/badge.svg)](https://github.com/LAKSHYA-NIGAM/AI-Powered-Resume-For-Skill-Gap-Analysis/actions/workflows/ci.yml)
[![Python Version](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12-blue.svg)](https://www.python.org/)
[![Frontend](https://img.shields.io/badge/frontend-React%2018%20%2B%20Vite-61DAFB.svg)](https://react.dev/)
[![ML Engine](https://img.shields.io/badge/ML-scikit--learn-orange.svg)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

SmartHireAI is a full-stack, machine learning-driven career intelligence platform that parses candidate resumes, extracts technical skills using Natural Language Processing (NLP), evaluates Applicant Tracking System (ATS) compatibility, computes job description match percentage via TF-IDF cosine similarity, and synthesizes personalized skill gap roadmaps with actionable learning resources.

---

## 🎯 Problem Statement

Over 75% of resumes submitted online are filtered out by automated Applicant Tracking Systems (ATS) before reaching a human recruiter due to:
- Missing critical industry keywords and exact role-specific skill taxonomies.
- Formatting, missing structural sections (Experience, Projects, Education), and suboptimal document length.
- Opaque rejection feedback leaving candidates unaware of their exact skill deficiencies.

SmartHireAI provides transparency by computing instant algorithmic ATS compatibility and generating structured learning recommendations to bridge the identified skill gaps.

---

## 🏗️ System Architecture & Data Flow

```
   ┌─────────────────────────────────────────────────────────┐
   │                   React 18 UI (Vite)                    │
   │  [ PDF Ingestion ]    [ Role Selector ]    [ Dashboard ]│
   └───────────────────────────┬─────────────────────────────┘
                               │ HTTP POST /analyze
                               ▼
   ┌─────────────────────────────────────────────────────────┐
   │                   Flask REST Backend                    │
   │                                                         │
   │  1. Document Parsing (PyPDF2 / Tokenization)            │
   │  2. NLP Preprocessing (NLTK Stopword Removal & Stems)   │
   │  3. Skill Extraction (Matching against Skills Taxonomy) │
   │  4. ML Analysis (TF-IDF Vectorizer + Cosine Similarity) │
   │  5. 4-Tier ATS Scoring (Keywords, Sections, Length)     │
   │  6. Recommendation Engine (Curated Steps & Projects)    │
   └───────────────────────────┬─────────────────────────────┘
                               │ JSON Response
                               ▼
   ┌─────────────────────────────────────────────────────────┐
   │                  Analytics Output                       │
   │  • Match Percentage & ATS Score Breakdown (0-100%)       │
   │  • Categorized Skills: Matched vs. Missing vs. Extra    │
   │  • Personalized Step-by-Step Learning Roadmaps          │
   │  • Concrete Portfolio Project Suggestions               │
   └─────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

1. **Dual PDF & Text Ingestion:** Extracts text from multi-page PDF resumes or raw text inputs without layout loss.
2. **Dynamic Skill Database:** Maps extracted terms against a structured dataset covering 300+ programming languages, frameworks, cloud tools, databases, and DevOps practices.
3. **TF-IDF & Cosine Similarity Engine:** Measures semantic alignment between resume content and job descriptions using scikit-learn unigram/bigram vector spaces.
4. **4-Tier ATS Scoring Breakdown:**
   - **Keyword Match (40 pts):** Proportion of target job description requirements satisfied.
   - **Section Presence (30 pts):** Automated detection of Contact, Summary, Education, Experience, Skills, and Projects.
   - **Document Length (15 pts):** Optimal word-count window (300–1500 words).
   - **Skill Density (15 pts):** Depth and breadth of verified technical competencies.
5. **Actionable Learning Roadmaps:** Generates step-by-step milestones, estimated completion timeframes, and direct course links for every identified missing skill.
6. **Portfolio Project Recommendations:** Suggests hands-on applications to build to demonstrate newly acquired skills.

---

## 🔌 API Reference

### 1. Health & Database Check
`GET /health`
Returns service status, loaded skill taxonomy size, and role count.

### 2. Full Resume Analysis
`POST /analyze`
- **Body (`multipart/form-data` or `form-urlencoded`):**
  - `resume_file`: PDF file (optional if `resume_text` provided)
  - `resume_text`: Plain text resume
  - `jd_text`: Job description text (required)
- **Response:**
  - `ats_score`: Total score and component breakdown
  - `similarity_score`: Cosine similarity float ($0.0 - 1.0$)
  - `matching_skills`: Array of verified overlapping skills
  - `missing_skills`: Array of missing requirements
  - `learning_paths`: Step-by-step roadmaps for missing competencies
  - `project_suggestions`: Tailored project ideas

### 3. List Target Roles
`GET /roles`
Returns all predefined industry roles available in the skill database.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ (for React frontend)

### 1. Backend Setup
```bash
git clone https://github.com/LAKSHYA-NIGAM/AI-Powered-Resume-For-Skill-Gap-Analysis.git
cd AI-Powered-Resume-For-Skill-Gap-Analysis/reverse-resume-builder/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Launch Flask server
python app.py
```
Backend runs at `http://localhost:5000`.

### 2. Frontend Setup (React)
```bash
cd ../../reverse-resume-builder-react
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 🧪 Automated Testing

The backend includes comprehensive unit tests verifying NLP text preprocessing, section extraction, TF-IDF cosine similarity, and ATS score calculations:

```bash
cd reverse-resume-builder/backend
python -m unittest discover tests
```

### Test Suite Highlights
- ✅ **Preprocessing:** Token normalization, punctuation stripping, case folding.
- ✅ **Section Detection:** Verifies regex extraction of Contact, Summary, Skills, Experience, Education, Projects, and Certifications.
- ✅ **TF-IDF Vectorizer:** Cosine similarity calculation on identical, disjoint, and empty text vectors.
- ✅ **ATS Compatibility:** 4-tier weighting algorithm validation across word-count bounds and keyword match thresholds.

---

## 📄 License
This project is licensed under the MIT License.
