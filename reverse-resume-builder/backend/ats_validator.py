"""
ATS Structural Compliance & Formatting Validator
Evaluates resume text for core section headers, action verbs, metric quantification,
and parseability anti-patterns.
"""

import re
from typing import Dict, List, Set


ACTION_VERBS = {
    "architected", "built", "spearheaded", "engineered", "designed", "deployed",
    "implemented", "optimized", "reduced", "increased", "accelerated", "scaled",
    "automated", "integrated", "refactored", "migrated", "mentored", "orchestrated"
}

SECTION_PATTERNS = {
    "contact": r"\b(email|phone|linkedin|github|contact)\b",
    "experience": r"\b(experience|employment|work history|professional experience)\b",
    "education": r"\b(education|academic|degree|university|college)\b",
    "skills": r"\b(skills|technical skills|technologies|proficiencies)\b",
    "projects": r"\b(projects|personal projects|open source)\b"
}


class ATSComplianceValidator:
    @classmethod
    def evaluate_resume(cls, text: str) -> Dict:
        if not text or not text.strip():
            return {
                "ats_score": 0,
                "sections_found": [],
                "missing_sections": list(SECTION_PATTERNS.keys()),
                "action_verb_count": 0,
                "quantified_metrics_count": 0,
                "recommendations": ["Resume text is empty. Provide plain text or extracted PDF content."]
            }

        text_lower = text.lower()
        recommendations = []
        sections_found = []
        missing_sections = []

        # 1. Check sections
        for section, pattern in SECTION_PATTERNS.items():
            if re.search(pattern, text_lower):
                sections_found.append(section)
            else:
                missing_sections.append(section)
                recommendations.append(f"Add a distinct '{section.capitalize()}' section header to boost ATS parser accuracy.")

        # 2. Count action verbs
        words = re.findall(r"\b[a-zA-Z]+\b", text_lower)
        matched_verbs = [w for w in words if w in ACTION_VERBS]
        action_verb_count = len(matched_verbs)
        if action_verb_count < 3:
            recommendations.append("Incorporate strong action verbs (e.g. engineered, optimized, spearheaded) to describe accomplishments.")

        # 3. Detect quantified metrics (e.g., 25%, $10k, 500ms, 10x)
        metric_pattern = r"(\b\d+(\.\d+)?%|\$\d+[kKmM]?|\b\d+x\b|\b\d+\+?\s*(users|clients|ms|seconds|minutes|hours|qps|rps)\b)"
        metrics_found = re.findall(metric_pattern, text_lower)
        quantified_metrics_count = len(metrics_found)
        if quantified_metrics_count < 2:
            recommendations.append("Quantify project impact with measurable numbers, percentages, or performance benchmarks.")

        # 4. Calculate ATS score (out of 100)
        # Sections: 50% (10% each), Action verbs: 25%, Metrics: 25%
        section_score = (len(sections_found) / len(SECTION_PATTERNS)) * 50
        verb_score = min(25, action_verb_count * 5)
        metric_score = min(25, quantified_metrics_count * 8)

        total_score = round(section_score + verb_score + metric_score)

        return {
            "ats_score": total_score,
            "sections_found": sections_found,
            "missing_sections": missing_sections,
            "action_verb_count": action_verb_count,
            "unique_action_verbs": sorted(list(set(matched_verbs))),
            "quantified_metrics_count": quantified_metrics_count,
            "recommendations": recommendations if recommendations else ["Resume exhibits strong structural ATS formatting."]
        }
