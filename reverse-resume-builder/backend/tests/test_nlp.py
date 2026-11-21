import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from resume_parser import preprocess_text, extract_sections
from skill_extractor import extract_skills, load_skill_database
from recommendation import generate_learning_path, suggest_projects


class TestNLPAndResumeParser(unittest.TestCase):
    def test_preprocess_text_normalizes_case_and_tokens(self):
        sample = "Experienced Senior Software Engineer with strong Python and Docker skills!"
        cleaned = preprocess_text(sample)
        self.assertIsInstance(cleaned, str)
        self.assertIn("python", cleaned)
        self.assertIn("docker", cleaned)
        self.assertNotIn("!", cleaned)

    def test_extract_sections_identifies_all_key_headings(self):
        resume = """
        Lakshya Nigam
        Contact: lakshya@example.com | GitHub | LinkedIn
        Professional Summary:
        Passionate Software Engineer skilled in distributed systems and AI.
        Technical Skills:
        Python, JavaScript, React, Docker, SQL, Git.
        Work Experience:
        Software Engineer Intern at YugaYatra.
        Academic Education:
        B.Tech in Computer Science Engineering at SRMIST.
        Projects:
        Built CodeSync real-time editor and SmartHireAI.
        Certifications:
        AWS Certified Cloud Practitioner.
        """
        sections = extract_sections(resume)
        self.assertTrue(sections['contact'])
        self.assertTrue(sections['summary'])
        self.assertTrue(sections['skills'])
        self.assertTrue(sections['experience'])
        self.assertTrue(sections['education'])
        self.assertTrue(sections['projects'])
        self.assertTrue(sections['certifications'])

    def test_extract_skills_matches_known_database(self):
        skills_db = load_skill_database()
        text = "I build backend APIs with Python and FastAPI, frontend with React, and containerize with Docker."
        extracted = extract_skills(text, skills_db)

        self.assertIn("python", extracted)
        self.assertIn("react", extracted)
        self.assertIn("docker", extracted)

    def test_recommendation_learning_path_returns_actionable_steps(self):
        missing = ["react", "docker"]
        paths = generate_learning_path(missing)

        skill_names = [p['skill'] for p in paths]
        self.assertIn("react", skill_names)
        self.assertIn("docker", skill_names)

        react_path = next(p for p in paths if p['skill'] == 'react')
        self.assertIn("resources", react_path)
        self.assertIn("steps", react_path)
        self.assertTrue(len(react_path["steps"]) > 0)

    def test_recommendation_suggest_projects(self):
        missing = ["python", "react"]
        projects = suggest_projects(missing)
        self.assertIsInstance(projects, list)
        self.assertTrue(len(projects) > 0)


if __name__ == "__main__":
    unittest.main()
