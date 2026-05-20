"""
resume_parser.py - Resume Parsing Module

This module handles:
1. Extracting text from PDF files using PyPDF2
2. Preprocessing text using NLTK (tokenization, stopword removal)
"""

import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from PyPDF2 import PdfReader
import io

# Download required NLTK data (runs only once)
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('punkt_tab', quiet=True)


def extract_text_from_pdf(file):
    """
    Extract raw text content from a PDF file.
    
    Args:
        file: A file-like object (e.g., from Flask's request.files)
    
    Returns:
        str: Extracted text from all pages of the PDF
    """
    try:
        # Read the PDF file
        reader = PdfReader(io.BytesIO(file.read()))
        text = ""
        
        # Extract text from each page
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        
        return text.strip()
    
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""


def preprocess_text(text):
    """
    Clean and preprocess text for NLP analysis.
    
    Steps:
    1. Convert to lowercase
    2. Remove special characters (keep letters, numbers, spaces)
    3. Tokenize into words
    4. Remove stopwords
    5. Rejoin into clean text
    
    Args:
        text (str): Raw text to preprocess
    
    Returns:
        str: Preprocessed clean text
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+', '', text)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove special characters but keep letters, numbers, and some symbols
    text = re.sub(r'[^a-z0-9\s/#+.]', ' ', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words and len(word) > 1]
    
    # Rejoin tokens
    clean_text = ' '.join(tokens)
    
    return clean_text


def extract_sections(text):
    """
    Detect common resume sections for ATS scoring.
    
    Args:
        text (str): Raw resume text
    
    Returns:
        dict: Dictionary with section names as keys and True/False as values
    """
    text_lower = text.lower()
    
    sections = {
        'education': False,
        'experience': False,
        'skills': False,
        'projects': False,
        'certifications': False,
        'summary': False,
        'achievements': False,
        'contact': False
    }
    
    # Keywords that indicate each section
    section_keywords = {
        'education': ['education', 'academic', 'university', 'college', 'degree', 'b.tech', 'b.e', 'btech', 'm.tech'],
        'experience': ['experience', 'work history', 'employment', 'internship', 'work experience'],
        'skills': ['skills', 'technical skills', 'technologies', 'proficiency', 'competencies'],
        'projects': ['projects', 'project work', 'personal projects', 'academic projects'],
        'certifications': ['certifications', 'certificates', 'certified', 'certification'],
        'summary': ['summary', 'objective', 'about me', 'profile', 'professional summary'],
        'achievements': ['achievements', 'awards', 'honors', 'accomplishments'],
        'contact': ['email', 'phone', 'contact', 'linkedin', 'github']
    }
    
    for section, keywords in section_keywords.items():
        for keyword in keywords:
            if keyword in text_lower:
                sections[section] = True
                break
    
    return sections
