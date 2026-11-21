"""
Career Path Trajectory & Role Transition Engine
Computes multi-hop role transitions, skill gap deltas, transition difficulty,
and estimated ramp-up timelines in weeks.
"""

from typing import Dict, List, Set


# Canonical skill sets per role
ROLE_PROFILES = {
    "Junior Developer": {
        "level": 1,
        "skills": {"python", "git", "sql", "html", "css", "javascript"},
    },
    "Backend Engineer": {
        "level": 2,
        "skills": {"python", "fastapi", "docker", "postgresql", "redis", "rest_api", "git", "ci_cd"},
    },
    "Full Stack Engineer": {
        "level": 2,
        "skills": {"python", "javascript", "react", "typescript", "nodejs", "postgresql", "docker", "git"},
    },
    "Senior Backend Engineer": {
        "level": 3,
        "skills": {"python", "fastapi", "docker", "kubernetes", "postgresql", "redis", "system_design", "microservices", "kafka", "ci_cd"},
    },
    "Staff / Principal Architect": {
        "level": 4,
        "skills": {"system_design", "distributed_systems", "kubernetes", "cloud_architecture", "microservices", "kafka", "security", "mentorship"},
    },
    "Data Scientist / ML Engineer": {
        "level": 2,
        "skills": {"python", "numpy", "pandas", "scikit_learn", "pytorch", "sql", "data_visualization", "git"},
    }
}


class CareerTrajectoryEngine:
    @classmethod
    def analyze_transition(
        cls, current_skills: List[str], target_role: str
    ) -> Dict:
        """
        Calculates gap, readiness percentage, and estimated ramp-up time to target role.
        """
        if target_role not in ROLE_PROFILES:
            return {
                "target_role": target_role,
                "error": f"Unknown target role '{target_role}'",
                "readiness_score": 0.0,
                "missing_skills": [],
                "acquired_skills": []
            }

        target_info = ROLE_PROFILES[target_role]
        required_skills = target_info["skills"]
        normalized_current = {s.lower().strip().replace(" ", "_").replace("-", "_") for s in current_skills}

        acquired = required_skills.intersection(normalized_current)
        missing = required_skills - acquired

        readiness_pct = round((len(acquired) / len(required_skills)) * 100, 1) if required_skills else 100.0

        # Estimate ramp-up: 2.5 weeks per missing technical skill
        estimated_weeks = len(missing) * 2.5

        if readiness_pct >= 85:
            difficulty = "Low"
        elif readiness_pct >= 60:
            difficulty = "Moderate"
        elif readiness_pct >= 35:
            difficulty = "Challenging"
        else:
            difficulty = "Steep Transition"

        return {
            "target_role": target_role,
            "target_level": target_info["level"],
            "readiness_score": readiness_pct,
            "difficulty": difficulty,
            "acquired_skills": sorted(list(acquired)),
            "missing_skills": sorted(list(missing)),
            "missing_count": len(missing),
            "estimated_ramp_up_weeks": round(estimated_weeks, 1)
        }

    @classmethod
    def recommend_next_best_roles(
        cls, current_skills: List[str], top_n: int = 3
    ) -> List[Dict]:
        """
        Ranks all catalog roles by highest readiness score.
        """
        results = [
            cls.analyze_transition(current_skills, role)
            for role in ROLE_PROFILES.keys()
        ]
        results.sort(key=lambda r: r["readiness_score"], reverse=True)
        return results[:top_n]
