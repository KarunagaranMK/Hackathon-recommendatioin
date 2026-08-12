from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    college: Optional[str] = None
    year: Optional[str] = None
    programming_languages: Optional[List[str]] = []
    frameworks: Optional[List[str]] = []
    databases: Optional[List[str]] = []
    cloud_skills: Optional[List[str]] = []
    ai_skills: Optional[List[str]] = []
    experience_level: Optional[str] = "Beginner"
    interested_domains: Optional[List[str]] = []
    preferred_technologies: Optional[List[str]] = []
    hackathon_theme: Optional[str] = None


class UserInDB(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    hashed_password: str
    profile: Optional[UserProfile] = None
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserPublic(BaseModel):
    id: str
    name: str
    email: str
    profile: Optional[UserProfile] = None
    is_admin: bool = False
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic
