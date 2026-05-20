# 🎯 AI-Powered Reverse Resume Builder for Skill Gap Analysis

An intelligent web application that analyzes your resume against job descriptions using **NLP** and **Machine Learning** to identify skill gaps and provide actionable recommendations.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Skill Extraction** | NLP-based skill matching from resume & JD |
| **Skill Gap Analysis** | Identifies matching ✔ and missing ❌ skills |
| **ML Similarity Score** | TF-IDF + Cosine Similarity comparison |
| **ATS Score** | Resume compatibility score (keyword match, sections, length) |
| **Skill Priority Ranking** | High / Medium / Low importance classification |
| **Learning Path** | Step-by-step resources for each missing skill |
| **Project Suggestions** | Recommended projects to build for missing skills |
| **Resume Tips** | Actionable improvement suggestions |

---

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python, Flask
- **ML/NLP**: scikit-learn (TF-IDF, Cosine Similarity), NLTK (tokenization, stopwords)
- **Libraries**: pandas, PyPDF2

---

## 📁 Project Structure

```
reverse-resume-builder/
├── backend/
│   ├── app.py              # Flask server (main entry point)
│   ├── resume_parser.py    # PDF text extraction & NLP preprocessing
│   ├── skill_extractor.py  # Skill matching against master list
│   ├── model.py            # TF-IDF similarity & ATS scoring
│   └── recommendation.py   # Learning paths & project suggestions
│
├── frontend/
│   ├── index.html          # Main UI page
│   ├── style.css           # Dark theme styles
│   └── script.js           # API integration & result rendering
│
├── data/
│   ├── skills.csv          # Master skill database (100+ skills)
│   └── job_roles.csv       # Job roles with prioritized skills
│
└── README.md
```

---

## 🚀 How to Run

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Clone / Navigate to the project

```bash
cd reverse-resume-builder
```

### Step 2: Install dependencies

```bash
pip install flask nltk scikit-learn pandas PyPDF2
```

### Step 3: Run the application

```bash
cd backend
python app.py
```

### Step 4: Open in browser

Visit: **http://localhost:5000**

---

## 📖 How to Use

1. **Paste your resume** text (or upload a PDF)
2. **Paste the job description** you're targeting
3. Click **"Analyze Skill Gap"**
4. View your results:
   - Skill match percentage
   - ML similarity score
   - ATS compatibility score
   - Matching & missing skills
   - Priority-ranked skills
   - Learning roadmap
   - Project recommendations
   - Resume improvement tips

---

## 🔬 How It Works

### NLP Pipeline
1. Text extracted from PDF using **PyPDF2**
2. Text is lowercased, tokenized, and stopwords removed using **NLTK**
3. Skills are matched against a master database of 100+ skills

### ML Analysis
1. **TF-IDF Vectorizer** converts resume & JD into numerical vectors
2. **Cosine Similarity** measures how closely the resume matches the JD
3. **ATS Score** is computed from keyword presence, section detection, and resume length

---

## 📊 Sample Output

- **Matching Skills**: ✔ python, ✔ javascript, ✔ sql, ✔ git
- **Missing Skills**: ✘ docker, ✘ kubernetes, ✘ aws
- **Skill Match**: 65%
- **ATS Score**: 72/100 (Good)
- **Priority**: Docker (High), AWS (Medium), Kubernetes (Low)

---

## 👨‍💻 Built For

B.Tech CSE students — demonstrates practical NLP + ML usage for solving real-world job search problems.

---

## 📜 License

This project is open source and available for academic use.
