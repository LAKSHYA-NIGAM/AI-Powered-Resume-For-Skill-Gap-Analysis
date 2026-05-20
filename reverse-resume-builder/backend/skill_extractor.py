"""
skill_extractor.py - Skill Extraction Module

This module handles:
1. Loading the master skill list from CSV
2. Extracting skills from text by matching against the master list
3. Categorizing extracted skills
"""

import os
import pandas as pd


# Path to the data directory
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')


def load_skill_database():
    """
    Load the master skill list from skills.csv.
    
    Returns:
        pd.DataFrame: DataFrame with columns ['skill', 'category']
    """
    skills_path = os.path.join(DATA_DIR, 'skills.csv')
    skills_df = pd.read_csv(skills_path)
    return skills_df


def load_job_roles():
    """
    Load job roles and their required skills from job_roles.csv.
    
    Returns:
        pd.DataFrame: DataFrame with columns ['role', 'skill', 'priority']
    """
    roles_path = os.path.join(DATA_DIR, 'job_roles.csv')
    roles_df = pd.read_csv(roles_path)
    return roles_df


def extract_skills(text, skills_df=None):
    """
    Extract skills from text by matching against the master skill list.
    
    Uses substring matching to find skills mentioned in the text.
    Handles multi-word skills (e.g., "machine learning", "react native").
    
    Args:
        text (str): Preprocessed text to extract skills from
        skills_df (pd.DataFrame): Optional skill database. Loads default if None.
    
    Returns:
        list: List of matched skill names (lowercase)
    """
    if skills_df is None:
        skills_df = load_skill_database()
    
    text_lower = text.lower()
    found_skills = []
    
    for _, row in skills_df.iterrows():
        skill = row['skill'].lower().strip()
        
        # Check if the skill appears in the text
        # Use word boundary-aware matching for short skills
        if len(skill) <= 2:
            # For very short skills (C, R), require exact word match
            words = text_lower.split()
            if skill in words:
                found_skills.append(skill)
        else:
            # For longer skills, check substring presence
            if skill in text_lower:
                found_skills.append(skill)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_skills = []
    for s in found_skills:
        if s not in seen:
            seen.add(s)
            unique_skills.append(s)
    
    return unique_skills


def get_skill_category(skill, skills_df=None):
    """
    Get the category of a given skill.
    
    Args:
        skill (str): Skill name to look up
        skills_df (pd.DataFrame): Optional skill database
    
    Returns:
        str: Category name or 'Other' if not found
    """
    if skills_df is None:
        skills_df = load_skill_database()
    
    result = skills_df[skills_df['skill'].str.lower() == skill.lower()]
    
    if not result.empty:
        return result.iloc[0]['category']
    return 'Other'


def categorize_skills(skills_list, skills_df=None):
    """
    Group a list of skills by their categories.
    
    Args:
        skills_list (list): List of skill names
        skills_df (pd.DataFrame): Optional skill database
    
    Returns:
        dict: Dictionary with category names as keys, lists of skills as values
    """
    if skills_df is None:
        skills_df = load_skill_database()
    
    categorized = {}
    
    for skill in skills_list:
        category = get_skill_category(skill, skills_df)
        if category not in categorized:
            categorized[category] = []
        categorized[category].append(skill)
    
    return categorized


def get_role_skills(role_name):
    """
    Get the required skills for a specific job role with priorities.
    
    Args:
        role_name (str): Name of the job role
    
    Returns:
        dict: Dictionary with keys 'High', 'Medium', 'Low' containing skill lists
    """
    roles_df = load_job_roles()
    
    # Filter for the given role (case-insensitive)
    role_data = roles_df[roles_df['role'].str.lower() == role_name.lower()]
    
    prioritized = {'High': [], 'Medium': [], 'Low': []}
    
    for _, row in role_data.iterrows():
        priority = row['priority']
        if priority in prioritized:
            prioritized[priority].append(row['skill'].lower())
    
    return prioritized


def get_all_roles():
    """
    Get a list of all available job roles.
    
    Returns:
        list: List of unique role names
    """
    roles_df = load_job_roles()
    return sorted(roles_df['role'].unique().tolist())
