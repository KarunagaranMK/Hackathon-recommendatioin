from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class ProjectCreate(BaseModel):
    title: str
    description: str
    problem_statement: str
    domain: str
    difficulty: str  # Beginner / Intermediate / Advanced
    skills_required: List[str]
    technologies: List[str]
    estimated_duration: str
    learning_resources: Optional[List[str]] = []
    roadmap: Optional[List[str]] = []
    architecture: Optional[str] = None
    modules: Optional[List[str]] = []
    dataset_info: Optional[str] = None


class Project(ProjectCreate):
    id: Optional[str] = None
    embedding: Optional[List[float]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class SkillGap(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    extra_skills: List[str]
    match_percentage: float
    estimated_learning_time: str


class RoadmapStep(BaseModel):
    skill: str
    description: str
    estimated_time: str
    resources: List[str]


class RecommendationResult(BaseModel):
    project_id: str
    title: str
    description: str
    problem_statement: str
    domain: str
    difficulty: str
    technologies: List[str]
    skills_required: List[str]
    estimated_duration: str
    similarity_score: float
    skill_gap: SkillGap
    roadmap: List[RoadmapStep]
    learning_resources: List[str]


class RecommendationRequest(BaseModel):
    top_k: int = 10


class FavoriteProject(BaseModel):
    project_id: str
    title: str
    domain: str
    difficulty: str
    similarity_score: Optional[float] = None
    saved_at: datetime = Field(default_factory=datetime.utcnow)
