"""
Skill Gap Analysis Module
Compares student skills with project required skills.
"""
from typing import List, Dict


# Estimated learning time per skill category (in weeks)
SKILL_TIME_MAP = {
    # Languages
    "python": 2, "javascript": 3, "java": 4, "c++": 4, "go": 3, "rust": 5,
    "typescript": 2, "kotlin": 3, "swift": 4, "r": 3, "scala": 4,
    # Frameworks
    "react": 3, "nextjs": 2, "vue": 2, "angular": 4, "fastapi": 1,
    "django": 3, "flask": 2, "express": 2, "spring": 4, "laravel": 3,
    # ML/AI
    "tensorflow": 3, "pytorch": 3, "scikit-learn": 2, "keras": 2,
    "hugging face": 2, "langchain": 2, "openai": 1, "nlp": 4, "computer vision": 4,
    "deep learning": 5, "machine learning": 4, "reinforcement learning": 6,
    # Databases
    "mongodb": 2, "postgresql": 2, "mysql": 2, "redis": 1, "elasticsearch": 2,
    "cassandra": 3, "firebase": 1, "supabase": 1,
    # Cloud
    "aws": 4, "gcp": 4, "azure": 4, "docker": 2, "kubernetes": 4,
    "terraform": 3, "ci/cd": 2,
    # Other
    "blockchain": 5, "solidity": 4, "web3": 3, "iot": 3, "arduino": 2,
    "raspberry pi": 1, "embedded systems": 4,
}

DEFAULT_TIME_WEEKS = 2


def normalize(skill: str) -> str:
    return skill.strip().lower()


def analyze_skill_gap(
    student_skills: List[str],
    project_skills: List[str],
) -> Dict:
    """
    Compare student skills with project required skills.
    Returns matched, missing, extra skills and match percentage.
    """
    student_set = {normalize(s) for s in student_skills if s}
    project_set = {normalize(s) for s in project_skills if s}

    matched = sorted(list(student_set & project_set))
    missing = sorted(list(project_set - student_set))
    extra = sorted(list(student_set - project_set))

    match_pct = (
        (len(matched) / len(project_set) * 100) if project_set else 100.0
    )

    # Estimate total learning time for missing skills
    total_weeks = sum(
        SKILL_TIME_MAP.get(skill, DEFAULT_TIME_WEEKS) for skill in missing
    )
    if total_weeks == 0:
        learning_time = "Ready to start!"
    elif total_weeks <= 1:
        estimated = f"{total_weeks} week"
    elif total_weeks <= 4:
        estimated = f"{total_weeks} weeks"
    elif total_weeks <= 12:
        estimated = f"{total_weeks // 4} month{'s' if total_weeks // 4 > 1 else ''}"
    else:
        estimated = f"{total_weeks // 4} months"

    learning_time = "Ready to start!" if total_weeks == 0 else (
        f"{total_weeks} week{'s' if total_weeks != 1 else ''}"
        if total_weeks <= 12 else f"{total_weeks // 4} months"
    )

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "extra_skills": extra,
        "match_percentage": round(match_pct, 1),
        "estimated_learning_time": learning_time,
    }
