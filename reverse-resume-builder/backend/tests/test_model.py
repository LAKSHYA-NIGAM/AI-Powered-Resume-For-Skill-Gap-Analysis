import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from model import calculate_similarity, calculate_ats_score, rank_skill_importance


class TestMLModelAndScoring(unittest.TestCase):
    def test_calculate_similarity_identical_texts(self):
        text = "Software engineer building scalable backend systems using Python, FastAPI, and PostgreSQL."
        score = calculate_similarity(text, text)
        self.assertAlmostEqual(score, 1.0, places=2)

    def test_calculate_similarity_disjoint_texts(self):
        text_a = "Cooking delicious Italian pasta with garlic and parmesan cheese."
        text_b = "Kubernetes cluster orchestration with Terraform on AWS cloud."
        score = calculate_similarity(text_a, text_b)
        self.assertEqual(score, 0.0)

    def test_calculate_similarity_empty_inputs(self):
        self.assertEqual(calculate_similarity("", "some text"), 0.0)
        self.assertEqual(calculate_similarity("some text", ""), 0.0)
        self.assertEqual(calculate_similarity("", ""), 0.0)

    def test_calculate_ats_score_breakdown(self):
        resume_text = """
        Lakshya Nigam - Software Engineer
        Contact: lakshya@example.com | LinkedIn | GitHub
        Summary: Full stack developer passionate about building scalable web applications.
        Skills: Python, JavaScript, React, Docker, SQL, Git, Linux, Java.
        Experience: Software Engineer Intern working with Python APIs and relational databases.
        Education: B.Tech Computer Science Engineering at SRMIST.
        Projects: Real-time collaborative code editor and AI resume skill gap analyzer.
        """
        # Expand word count to comfortably reach optimal ATS range (400 words)
        full_resume = resume_text + (" Relevant software engineering experience with continuous integration. " * 50)

        jd_skills = ['python', 'react', 'docker', 'sql']
        resume_skills = ['python', 'react', 'docker', 'sql', 'git', 'linux']

        result = calculate_ats_score(full_resume, jd_skills, resume_skills)

        self.assertIn('total', result)
        self.assertIn('keyword_match', result)
        self.assertIn('section_score', result)
        self.assertIn('length_score', result)
        self.assertIn('skill_coverage', result)

        self.assertEqual(result['keyword_match'], 40.0, "All JD skills matched, so keyword score should be 40.0")
        self.assertEqual(result['length_score'], 15.0, "Word count within 300-1500 words earns full 15 points")
        self.assertGreaterEqual(result['total'], 85.0)

    def test_rank_skill_importance(self):
        jd_text = "Looking for a Python backend engineer with deep experience in Python, FastAPI, and some Docker."
        missing_skills = ['docker', 'fastapi', 'kubernetes']
        ranked = rank_skill_importance(missing_skills, jd_text)

        self.assertIsInstance(ranked, dict)
        self.assertIn('High', ranked)
        self.assertIn('Medium', ranked)
        self.assertIn('Low', ranked)


if __name__ == "__main__":
    unittest.main()
