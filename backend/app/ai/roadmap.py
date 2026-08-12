"""
Learning Roadmap Generator
Generates an ordered learning path for missing skills based on domain and project context.
"""
from typing import List, Dict


# Domain-specific ordered learning paths
DOMAIN_ROADMAPS = {
    "healthcare": [
        "Python", "Data Analysis", "Machine Learning", "TensorFlow/PyTorch",
        "Medical Data Processing", "Model Evaluation", "FastAPI", "Deployment"
    ],
    "fintech": [
        "Python", "Data Structures", "Financial Mathematics", "Machine Learning",
        "Time Series Analysis", "Risk Modeling", "FastAPI", "Security", "Deployment"
    ],
    "edtech": [
        "Python", "React", "Database Design", "REST APIs",
        "Machine Learning", "NLP", "Recommendation Systems", "Deployment"
    ],
    "agritech": [
        "Python", "IoT Basics", "Data Collection", "Machine Learning",
        "Computer Vision", "Mobile Development", "Cloud", "Deployment"
    ],
    "environment": [
        "Python", "Data Analysis", "GIS/Mapping", "Machine Learning",
        "IoT", "Real-time Data", "Visualization", "Deployment"
    ],
    "smart city": [
        "Python", "IoT", "Real-time Systems", "Data Streams",
        "Machine Learning", "Dashboard", "Cloud", "Deployment"
    ],
    "cybersecurity": [
        "Python", "Networking Basics", "Cryptography", "Ethical Hacking",
        "Machine Learning", "Anomaly Detection", "Security Protocols", "Deployment"
    ],
    "social impact": [
        "Python", "React", "Database Design", "REST APIs",
        "Machine Learning", "NLP", "Accessibility", "Deployment"
    ],
    "iot": [
        "Python", "Arduino/Raspberry Pi", "Sensors", "MQTT Protocol",
        "Data Processing", "Cloud IoT", "Dashboard", "Deployment"
    ],
    "blockchain": [
        "JavaScript", "Solidity", "Smart Contracts", "Web3.js",
        "IPFS", "DeFi Concepts", "Security Auditing", "Deployment"
    ],
}

# Resource links per skill
SKILL_RESOURCES = {
    "python": ["https://docs.python.org/3/tutorial/", "https://realpython.com"],
    "machine learning": ["https://scikit-learn.org/stable/tutorial/", "https://ml-course.github.io"],
    "tensorflow": ["https://www.tensorflow.org/tutorials", "https://keras.io/guides/"],
    "pytorch": ["https://pytorch.org/tutorials/", "https://d2l.ai"],
    "react": ["https://react.dev/learn", "https://www.patterns.dev"],
    "fastapi": ["https://fastapi.tiangolo.com/tutorial/", "https://testdriven.io/blog/fastapi-crud/"],
    "docker": ["https://docs.docker.com/get-started/", "https://www.youtube.com/c/TechWorldwithNana"],
    "mongodb": ["https://www.mongodb.com/docs/manual/tutorial/", "https://university.mongodb.com"],
    "aws": ["https://aws.amazon.com/training/", "https://acloudguru.com"],
    "nlp": ["https://www.nltk.org/book/", "https://huggingface.co/course"],
    "deep learning": ["https://www.deeplearning.ai/", "https://d2l.ai"],
    "blockchain": ["https://ethereum.org/en/developers/", "https://solidity-by-example.org"],
    "iot": ["https://www.arduino.cc/en/Tutorial/HomePage", "https://learn.adafruit.com"],
}

DEFAULT_RESOURCES = ["https://docs.python.org", "https://www.youtube.com"]


def generate_roadmap(
    missing_skills: List[str],
    domain: str,
    technologies: List[str],
) -> List[Dict]:
    """
    Generate an ordered learning roadmap for missing skills.
    Returns a list of step dicts with skill, description, time estimate, and resources.
    """
    if not missing_skills:
        return []

    domain_lower = domain.lower()
    # Find closest domain roadmap
    domain_order = []
    for key in DOMAIN_ROADMAPS:
        if key in domain_lower:
            domain_order = DOMAIN_ROADMAPS[key]
            break

    # Sort missing skills by domain order (known skills first, unknown appended)
    ordered_missing = []
    domain_order_lower = [s.lower() for s in domain_order]
    for skill in domain_order:
        if skill.lower() in [m.lower() for m in missing_skills]:
            ordered_missing.append(skill)
    # Add any remaining missing skills not in domain map
    for skill in missing_skills:
        if skill.lower() not in [o.lower() for o in ordered_missing]:
            ordered_missing.append(skill)

    # Build roadmap steps
    from app.ai.skill_gap import SKILL_TIME_MAP, DEFAULT_TIME_WEEKS

    roadmap = []
    for i, skill in enumerate(ordered_missing):
        skill_lower = skill.lower()
        weeks = SKILL_TIME_MAP.get(skill_lower, DEFAULT_TIME_WEEKS)
        time_str = f"{weeks} week{'s' if weeks != 1 else ''}"

        resources = SKILL_RESOURCES.get(skill_lower, DEFAULT_RESOURCES)

        roadmap.append({
            "step": i + 1,
            "skill": skill,
            "description": f"Learn {skill} fundamentals and apply to {domain} projects",
            "estimated_time": time_str,
            "resources": resources[:2],
        })

    return roadmap
