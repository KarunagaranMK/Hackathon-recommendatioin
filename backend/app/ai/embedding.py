"""
AI Embedding Module — Lightweight TF-IDF version
Replaces sentence-transformers (requires PyTorch ~400MB RAM)
with scikit-learn TF-IDF (< 10MB RAM) — perfect for Render free tier.
"""
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import threading

_vectorizer = None
_lock = threading.Lock()


def get_model():
    """Return the TF-IDF vectorizer (lazy singleton)."""
    global _vectorizer
    if _vectorizer is None:
        with _lock:
            if _vectorizer is None:
                print("[INFO] Initialising TF-IDF vectorizer...")
                _vectorizer = TfidfVectorizer(
                    max_features=5000,
                    ngram_range=(1, 2),
                    sublinear_tf=True,
                    strip_accents="unicode",
                    analyzer="word",
                )
                print("[OK] TF-IDF vectorizer ready")
    return _vectorizer


def generate_embedding(text: str) -> List[float]:
    """
    Generate a TF-IDF vector for the given text.
    Returns a dense list of floats.
    """
    vectorizer = get_model()
    # fit_transform on a single doc so the vectorizer is always consistent
    # We store the full vocab after the first real batch — see rank_projects
    vec = vectorizer.transform([text]) if hasattr(vectorizer, "vocabulary_") else None
    if vec is None:
        # Fallback: return a zero-length list; rank_projects will handle it
        return []
    return vec.toarray()[0].tolist()


def profile_to_sentence(profile: dict) -> str:
    """Convert a student profile dict to a descriptive sentence."""
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

    return ", ".join(parts) + "."


def project_to_text(project: dict) -> str:
    """Convert a project dict to descriptive text."""
    title = project.get("title", "")
    description = project.get("description", "")
    domain = project.get("domain", "")
    difficulty = project.get("difficulty", "")
    skills = ", ".join(project.get("skills_required") or [])
    technologies = ", ".join(project.get("technologies") or [])

    return (
        f"{title}. {description}. "
        f"Domain: {domain}. Difficulty: {difficulty}. "
        f"Skills required: {skills}. Technologies: {technologies}."
    )


def rank_projects_by_text(
    student_profile: dict,
    projects: List[dict],
    top_k: int = 10,
) -> List[dict]:
    """
    Rank projects against a student profile using TF-IDF cosine similarity.
    Fits the vectorizer on all texts together for a consistent vocabulary.
    """
    if not projects:
        return []

    student_text = profile_to_sentence(student_profile)
    project_texts = [project_to_text(p) for p in projects]

    all_texts = [student_text] + project_texts

    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        sublinear_tf=True,
        strip_accents="unicode",
    )
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    student_vec = tfidf_matrix[0]
    project_vecs = tfidf_matrix[1:]

    similarities = cosine_similarity(student_vec, project_vecs)[0]

    ranked = sorted(
        zip(projects, similarities),
        key=lambda x: x[1],
        reverse=True,
    )

    results = []
    for project, score in ranked[:top_k]:
        project_copy = dict(project)
        project_copy["similarity_score"] = float(score)
        results.append(project_copy)

    return results
