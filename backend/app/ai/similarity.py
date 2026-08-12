"""
Cosine Similarity Engine
Compares student embedding with all project embeddings and returns ranked results.
"""
from typing import List, Dict
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def rank_projects(
    student_embedding: List[float],
    projects: List[dict],
    top_k: int = 10,
) -> List[dict]:
    """
    Compare student embedding with all project embeddings using cosine similarity.
    Returns top_k projects sorted by descending similarity score.
    """
    valid_projects = [p for p in projects if p.get("embedding")]
    if not valid_projects:
        return []

    student_vec = np.array(student_embedding).reshape(1, -1)
    project_vecs = np.array([p["embedding"] for p in valid_projects])

    similarities = cosine_similarity(student_vec, project_vecs)[0]

    ranked = sorted(
        zip(valid_projects, similarities),
        key=lambda x: x[1],
        reverse=True,
    )

    results = []
    for project, score in ranked[:top_k]:
        project_copy = dict(project)
        project_copy["similarity_score"] = float(score)
        results.append(project_copy)

    return results


def cosine_score(vec_a: List[float], vec_b: List[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    a = np.array(vec_a).reshape(1, -1)
    b = np.array(vec_b).reshape(1, -1)
    return float(cosine_similarity(a, b)[0][0])
