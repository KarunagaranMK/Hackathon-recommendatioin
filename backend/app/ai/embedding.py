"""
AI Embedding Module
Uses sentence-transformers all-MiniLM-L6-v2 (384-dim embeddings)
Singleton model loaded once at startup.
"""
from typing import List
from functools import lru_cache

_model = None


def get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        print("[INFO] Loading Sentence Transformer model (all-MiniLM-L6-v2)...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        print("[OK] Model loaded successfully")
    return _model


def generate_embedding(text: str) -> List[float]:
    """Generate a 384-dimensional embedding for the given text."""
    model = get_model()
    embedding = model.encode(text, convert_to_tensor=False)
    return embedding.tolist()


def profile_to_sentence(profile: dict) -> str:
    """Convert a student profile dict to a descriptive sentence for embedding."""
    parts = []

    experience = profile.get("experience_level", "Beginner")
    parts.append(f"{experience} student")

    all_skills = []
    for field in ["programming_languages", "frameworks", "databases", "cloud_skills", "ai_skills"]:
        skills = profile.get(field) or []
        all_skills.extend(skills)

    if all_skills:
        parts.append(f"skilled in {', '.join(all_skills)}")

    domains = profile.get("interested_domains") or []
    if domains:
        parts.append(f"interested in {', '.join(domains)}")

    technologies = profile.get("preferred_technologies") or []
    if technologies:
        parts.append(f"preferring {', '.join(technologies)}")

    theme = profile.get("hackathon_theme")
    if theme:
        parts.append(f"focused on {theme}")

    department = profile.get("department")
    if department:
        parts.append(f"studying {department}")

    sentence = ", ".join(parts) + "."
    return sentence


def project_to_text(project: dict) -> str:
    """Convert a project dict to a descriptive text for embedding."""
    title = project.get("title", "")
    description = project.get("description", "")
    domain = project.get("domain", "")
    difficulty = project.get("difficulty", "")
    skills = ", ".join(project.get("skills_required") or [])
    technologies = ", ".join(project.get("technologies") or [])

    text = (
        f"{title}. {description}. "
        f"Domain: {domain}. Difficulty: {difficulty}. "
        f"Skills required: {skills}. Technologies: {technologies}."
    )
    return text
