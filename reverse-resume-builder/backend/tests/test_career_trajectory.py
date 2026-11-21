import unittest
from career_trajectory import CareerTrajectoryEngine, ROLE_PROFILES


class TestCareerTrajectoryEngine(unittest.TestCase):
    def test_transition_with_partial_skills(self):
        user_skills = ["python", "fastapi", "docker", "git"]
        res = CareerTrajectoryEngine.analyze_transition(user_skills, "Backend Engineer")

        self.assertEqual(res["target_role"], "Backend Engineer")
        self.assertIn("fastapi", res["acquired_skills"])
        self.assertIn("postgresql", res["missing_skills"])
        self.assertIn("redis", res["missing_skills"])
        self.assertTrue(res["readiness_score"] > 0)
        self.assertEqual(res["difficulty"], "Challenging")
        self.assertTrue(res["estimated_ramp_up_weeks"] > 0)

    def test_transition_with_full_skills(self):
        junior_skills = list(ROLE_PROFILES["Junior Developer"]["skills"])
        res = CareerTrajectoryEngine.analyze_transition(junior_skills, "Junior Developer")

        self.assertEqual(res["readiness_score"], 100.0)
        self.assertEqual(res["difficulty"], "Low")
        self.assertEqual(len(res["missing_skills"]), 0)
        self.assertEqual(res["estimated_ramp_up_weeks"], 0.0)

    def test_recommend_next_best_roles_ranking(self):
        skills = ["python", "pandas", "numpy", "sql", "git"]
        recommendations = CareerTrajectoryEngine.recommend_next_best_roles(skills, top_n=2)

        self.assertEqual(len(recommendations), 2)
        # Data Scientist / ML Engineer should be top ranked
        self.assertEqual(recommendations[0]["target_role"], "Data Scientist / ML Engineer")
        self.assertGreater(recommendations[0]["readiness_score"], recommendations[1]["readiness_score"])

    def test_unknown_role_handling(self):
        res = CareerTrajectoryEngine.analyze_transition(["python"], "Quantum Astronaut")
        self.assertIn("error", res)
        self.assertEqual(res["readiness_score"], 0.0)


if __name__ == "__main__":
    unittest.main()
