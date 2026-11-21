import unittest
from ats_validator import ATSComplianceValidator


class TestATSComplianceValidator(unittest.TestCase):
    def test_strong_resume_scoring(self):
        sample_resume = """
        John Doe - Software Engineer
        Contact: john@example.com | 555-1234 | linkedin.com/in/johndoe | github.com/johndoe
        
        Experience:
        Senior Backend Engineer at TechCorp
        - Engineered high-throughput microservices reducing latency by 45%.
        - Architected Redis caching layer scaling throughput to 5000 QPS.
        - Deployed automated CI/CD pipelines saving 10 hours weekly.
        
        Education:
        B.S. in Computer Science, University of Technology
        
        Skills:
        Python, FastAPI, Docker, Kubernetes, PostgreSQL, Redis
        
        Projects:
        - Open Source Distributed Rate Limiter
        """
        result = ATSComplianceValidator.evaluate_resume(sample_resume)

        self.assertGreaterEqual(result["ats_score"], 85)
        self.assertEqual(len(result["missing_sections"]), 0)
        self.assertIn("engineered", result["unique_action_verbs"])
        self.assertIn("architected", result["unique_action_verbs"])
        self.assertGreaterEqual(result["quantified_metrics_count"], 2)

    def test_weak_resume_scoring_and_recommendations(self):
        sparse_resume = "Just some text without any headers or quantified bullet points."
        result = ATSComplianceValidator.evaluate_resume(sparse_resume)

        self.assertLess(result["ats_score"], 40)
        self.assertGreater(len(result["missing_sections"]), 3)
        self.assertGreater(len(result["recommendations"]), 2)

    def test_empty_resume_handling(self):
        result = ATSComplianceValidator.evaluate_resume("")
        self.assertEqual(result["ats_score"], 0)
        self.assertEqual(len(result["sections_found"]), 0)
        self.assertIn("empty", result["recommendations"][0].lower())


if __name__ == "__main__":
    unittest.main()
