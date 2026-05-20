"""
model.py - Machine Learning Module

This module handles:
1. TF-IDF vectorization of text
2. Cosine similarity computation between resume and JD
3. ATS (Applicant Tracking System) score calculation
4. Skill importance ranking using TF-IDF weights
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from resume_parser import extract_sections


def calculate_similarity(resume_text, jd_text):
    """
    Calculate cosine similarity between resume and job description
    using TF-IDF vectorization.
    
    How it works:
    1. TF-IDF converts text into numerical vectors based on word importance
    2. Cosine similarity measures the angle between these vectors
    3. Score ranges from 0 (no match) to 1 (perfect match)
    
    Args:
        resume_text (str): Preprocessed resume text
        jd_text (str): Preprocessed job description text
    
    Returns:
        float: Similarity score between 0 and 1
    """
    # Handle empty inputs
    if not resume_text.strip() or not jd_text.strip():
        return 0.0
    
    # Create TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        max_features=5000,     # Limit vocabulary size
        stop_words='english',  # Remove English stop words
        ngram_range=(1, 2)     # Use unigrams and bigrams
    )
    
    # Fit and transform both texts
    tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
    
    # Calculate cosine similarity
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    
    return round(float(similarity[0][0]), 4)


def calculate_ats_score(resume_text, jd_skills, resume_skills):
    """
    Calculate an ATS (Applicant Tracking System) compatibility score.
    
    Scoring criteria (out of 100):
    - Keyword Match (40 points): How many JD skills are in the resume
    - Section Presence (30 points): Resume has proper sections
    - Resume Length (15 points): Optimal length (300-1500 words)
    - Skill Coverage (15 points): Ratio of matched skills
    
    Args:
        resume_text (str): Raw resume text
        jd_skills (list): Skills extracted from job description
        resume_skills (list): Skills extracted from resume
    
    Returns:
        dict: ATS score breakdown with total and individual scores
    """
    scores = {}
    
    # --- 1. Keyword Match Score (40 points) ---
    if jd_skills:
        matched = len(set(resume_skills) & set(jd_skills))
        keyword_ratio = matched / len(jd_skills)
        scores['keyword_match'] = round(keyword_ratio * 40, 1)
    else:
        scores['keyword_match'] = 0
    
    # --- 2. Section Presence Score (30 points) ---
    sections = extract_sections(resume_text)
    important_sections = ['education', 'experience', 'skills', 'projects', 'summary', 'contact']
    section_count = sum(1 for s in important_sections if sections.get(s, False))
    scores['section_score'] = round((section_count / len(important_sections)) * 30, 1)
    
    # --- 3. Resume Length Score (15 points) ---
    word_count = len(resume_text.split())
    if 300 <= word_count <= 1500:
        scores['length_score'] = 15.0  # Optimal length
    elif 150 <= word_count < 300 or 1500 < word_count <= 2500:
        scores['length_score'] = 10.0  # Acceptable
    elif 50 <= word_count < 150:
        scores['length_score'] = 5.0   # Too short
    else:
        scores['length_score'] = 2.0   # Way too short or too long
    
    # --- 4. Skill Coverage Score (15 points) ---
    if resume_skills:
        coverage = min(len(resume_skills) / 8, 1.0)  # 8+ skills is full marks
        scores['skill_coverage'] = round(coverage * 15, 1)
    else:
        scores['skill_coverage'] = 0
    
    # Calculate total score
    scores['total'] = round(
        scores['keyword_match'] + 
        scores['section_score'] + 
        scores['length_score'] + 
        scores['skill_coverage'],
        1
    )
    
    # Provide a rating
    total = scores['total']
    if total >= 80:
        scores['rating'] = 'Excellent'
    elif total >= 60:
        scores['rating'] = 'Good'
    elif total >= 40:
        scores['rating'] = 'Average'
    else:
        scores['rating'] = 'Needs Improvement'
    
    # Details for display
    scores['sections_found'] = [s for s, found in sections.items() if found]
    scores['word_count'] = word_count
    
    return scores


def rank_skill_importance(skills_list, jd_text):
    """
    Rank skills by their importance in the job description using TF-IDF weights.
    
    Skills are categorized as:
    - High: Top 33% by TF-IDF weight
    - Medium: Middle 33%
    - Low: Bottom 33%
    
    Args:
        skills_list (list): List of skills to rank
        jd_text (str): Job description text
    
    Returns:
        dict: Dictionary with keys 'High', 'Medium', 'Low' containing skill lists
    """
    if not skills_list or not jd_text.strip():
        return {'High': [], 'Medium': [], 'Low': []}
    
    # Create TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        vocabulary=skills_list,  # Only look at these terms
        stop_words='english'
    )
    
    try:
        # Fit on the JD text
        tfidf_matrix = vectorizer.fit_transform([jd_text])
        feature_names = vectorizer.get_feature_names_out()
        tfidf_scores = tfidf_matrix.toarray()[0]
        
        # Create skill-score pairs
        skill_scores = list(zip(feature_names, tfidf_scores))
        
        # Sort by score (highest first)
        skill_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Categorize into priority levels
        ranked = {'High': [], 'Medium': [], 'Low': []}
        total = len(skill_scores)
        
        for i, (skill, score) in enumerate(skill_scores):
            if i < total / 3:
                ranked['High'].append(skill)
            elif i < 2 * total / 3:
                ranked['Medium'].append(skill)
            else:
                ranked['Low'].append(skill)
        
        return ranked
    
    except Exception:
        # If TF-IDF fails, distribute evenly
        third = max(1, len(skills_list) // 3)
        return {
            'High': skills_list[:third],
            'Medium': skills_list[third:2*third],
            'Low': skills_list[2*third:]
        }
