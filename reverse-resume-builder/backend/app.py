"""
app.py - Flask Application (Main Entry Point)

This is the main Flask server that:
1. Serves the frontend UI
2. Handles the /analyze API endpoint
3. Orchestrates resume parsing, skill extraction, ML analysis, and recommendations
"""

import os
import sys
from flask import Flask, request, jsonify, send_from_directory

# Import our custom modules
from resume_parser import extract_text_from_pdf, preprocess_text
from skill_extractor import (
    extract_skills, load_skill_database, categorize_skills, 
    get_all_roles, get_role_skills
)
from model import calculate_similarity, calculate_ats_score, rank_skill_importance
from recommendation import generate_learning_path, suggest_projects, generate_resume_tips


# ============================================================
# Flask App Configuration
# ============================================================

app = Flask(__name__)

# Configure upload settings
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload size

# Path to frontend directory
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend')

# Load skill database once at startup
SKILLS_DB = load_skill_database()


# ============================================================
# Routes
# ============================================================

@app.route('/')
def index():
    """Serve the main frontend HTML page."""
    return send_from_directory(FRONTEND_DIR, 'index.html')


@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS) from the frontend directory."""
    return send_from_directory(FRONTEND_DIR, filename)


@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Main analysis endpoint.
    
    Accepts:
        - resume_file: PDF file upload (optional)
        - resume_text: Plain text resume (optional, used if no file)
        - jd_text: Job description text (required)
    
    Returns:
        JSON with complete analysis results
    """
    try:
        # ---- Step 1: Get Input Data ----
        jd_text = request.form.get('jd_text', '').strip()
        resume_text = request.form.get('resume_text', '').strip()
        
        # Check if a PDF file was uploaded
        if 'resume_file' in request.files:
            file = request.files['resume_file']
            if file and file.filename and file.filename.lower().endswith('.pdf'):
                resume_text = extract_text_from_pdf(file)
        
        # Validate inputs
        if not jd_text:
            return jsonify({'error': 'Please provide a job description.'}), 400
        if not resume_text:
            return jsonify({'error': 'Please provide a resume (PDF upload or text).'}), 400
        
        # ---- Step 2: Preprocess Text ----
        processed_resume = preprocess_text(resume_text)
        processed_jd = preprocess_text(jd_text)
        
        # ---- Step 3: Extract Skills ----
        resume_skills = extract_skills(processed_resume, SKILLS_DB)
        jd_skills = extract_skills(processed_jd, SKILLS_DB)
        
        # Also check raw text for better extraction
        resume_skills_raw = extract_skills(resume_text.lower(), SKILLS_DB)
        jd_skills_raw = extract_skills(jd_text.lower(), SKILLS_DB)
        
        # Merge results (preprocessed + raw text extraction)
        resume_skills = list(set(resume_skills + resume_skills_raw))
        jd_skills = list(set(jd_skills + jd_skills_raw))
        
        # ---- Step 4: Skill Gap Analysis ----
        matching_skills = sorted(set(resume_skills) & set(jd_skills))
        missing_skills = sorted(set(jd_skills) - set(resume_skills))
        extra_skills = sorted(set(resume_skills) - set(jd_skills))
        
        # ---- Step 5: Calculate Skill Match Percentage ----
        if jd_skills:
            match_percentage = round((len(matching_skills) / len(jd_skills)) * 100, 1)
        else:
            match_percentage = 0
        
        # ---- Step 6: ML Similarity Score ----
        similarity_score = calculate_similarity(processed_resume, processed_jd)
        
        # ---- Step 7: ATS Score ----
        ats_score = calculate_ats_score(resume_text, jd_skills, resume_skills)
        
        # ---- Step 8: Skill Importance Ranking ----
        all_jd_skills = matching_skills + missing_skills
        skill_ranking = rank_skill_importance(all_jd_skills, jd_text)
        
        # ---- Step 9: Categorize Skills ----
        matching_categorized = categorize_skills(matching_skills, SKILLS_DB)
        missing_categorized = categorize_skills(missing_skills, SKILLS_DB)
        
        # ---- Step 10: Generate Recommendations ----
        learning_path = generate_learning_path(missing_skills)
        project_suggestions = suggest_projects(missing_skills)
        resume_tips = generate_resume_tips(resume_text, missing_skills, ats_score)
        
        # ---- Step 11: Build Response ----
        response = {
            'success': True,
            
            # Skill analysis
            'matching_skills': matching_skills,
            'missing_skills': missing_skills,
            'extra_skills': extra_skills,
            'match_percentage': match_percentage,
            
            # Categorized skills
            'matching_categorized': matching_categorized,
            'missing_categorized': missing_categorized,
            
            # ML scores
            'similarity_score': round(similarity_score * 100, 1),
            
            # ATS score
            'ats_score': ats_score,
            
            # Skill priority ranking
            'skill_ranking': skill_ranking,
            
            # Recommendations
            'learning_path': learning_path,
            'project_suggestions': project_suggestions,
            'resume_tips': resume_tips,
            
            # Summary stats
            'stats': {
                'total_jd_skills': len(jd_skills),
                'total_resume_skills': len(resume_skills),
                'matching_count': len(matching_skills),
                'missing_count': len(missing_skills),
                'extra_count': len(extra_skills)
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error during analysis: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'An error occurred during analysis: {str(e)}'}), 500


@app.route('/roles', methods=['GET'])
def get_roles():
    """Get list of available job roles for multi-role comparison."""
    try:
        roles = get_all_roles()
        return jsonify({'roles': roles})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/role-skills', methods=['GET'])
def get_role_skill_details():
    """Get skills for a specific role with priorities."""
    try:
        role = request.args.get('role', '')
        if not role:
            return jsonify({'error': 'Role parameter required'}), 400
        
        skills = get_role_skills(role)
        return jsonify({'role': role, 'skills': skills})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================
# Run the Application
# ============================================================

if __name__ == '__main__':
    print("=" * 60)
    print("  AI-Powered Reverse Resume Builder")
    print("  Skill Gap Analysis System")
    print("=" * 60)
    print(f"\n  Server running at: http://localhost:5000")
    print(f"  Frontend served from: {FRONTEND_DIR}")
    print("\n  Press Ctrl+C to stop the server\n")
    
    app.run(debug=True, port=5000)
