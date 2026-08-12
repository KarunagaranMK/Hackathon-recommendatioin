"""
Web Scraper Module
Fetches live resource links from GitHub Topics API and DevDocs
to enrich project roadmaps with real, current learning materials.
"""
import asyncio
import re
from typing import List, Dict
import httpx

GITHUB_TOPICS_API = "https://api.github.com/search/repositories"
HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "HackMatchAI/1.0",
}

# Skill → curated search query for GitHub
SKILL_GITHUB_QUERY = {
    "python":           "python tutorial beginner",
    "react":            "react tutorial starter",
    "fastapi":          "fastapi example project",
    "machine learning": "machine-learning beginner project",
    "deep learning":    "deep-learning pytorch tutorial",
    "nlp":              "nlp natural-language-processing tutorial",
    "computer vision":  "computer-vision opencv tutorial",
    "blockchain":       "blockchain solidity starter",
    "docker":           "docker tutorial beginners",
    "mongodb":          "mongodb example application",
    "aws":              "aws lambda tutorial",
    "nodejs":           "nodejs express tutorial",
    "tensorflow":       "tensorflow keras tutorial",
    "pytorch":          "pytorch tutorial project",
    "iot":              "raspberry-pi iot project",
    "flutter":          "flutter app tutorial",
    "kubernetes":       "kubernetes beginner tutorial",
    "next.js":          "nextjs starter template",
    "typescript":       "typescript starter project",
    "graphql":          "graphql api tutorial",
}

# Curated static docs per skill (fallback)
DOCS_LINKS = {
    "python":           ["https://docs.python.org/3/tutorial/", "https://realpython.com"],
    "react":            ["https://react.dev/learn", "https://www.patterns.dev"],
    "fastapi":          ["https://fastapi.tiangolo.com/tutorial/", "https://testdriven.io/blog/fastapi-crud/"],
    "machine learning": ["https://scikit-learn.org/stable/tutorial/", "https://ml-course.github.io"],
    "deep learning":    ["https://www.deeplearning.ai/", "https://d2l.ai"],
    "tensorflow":       ["https://www.tensorflow.org/tutorials", "https://keras.io/guides/"],
    "pytorch":          ["https://pytorch.org/tutorials/", "https://d2l.ai"],
    "mongodb":          ["https://www.mongodb.com/docs/manual/tutorial/", "https://university.mongodb.com"],
    "docker":           ["https://docs.docker.com/get-started/", "https://labs.play-with-docker.com"],
    "kubernetes":       ["https://kubernetes.io/docs/tutorials/", "https://www.katacoda.com"],
    "aws":              ["https://aws.amazon.com/training/", "https://acloudguru.com"],
    "blockchain":       ["https://ethereum.org/en/developers/", "https://solidity-by-example.org"],
    "nlp":              ["https://huggingface.co/course", "https://www.nltk.org/book/"],
    "iot":              ["https://www.arduino.cc/en/Tutorial/HomePage", "https://learn.adafruit.com"],
    "typescript":       ["https://www.typescriptlang.org/docs/", "https://typescript-exercises.github.io"],
    "next.js":          ["https://nextjs.org/learn", "https://nextjs.org/docs"],
    "flutter":          ["https://docs.flutter.dev/get-started/codelab", "https://flutter.dev/docs"],
}

DEFAULT_DOCS = ["https://docs.python.org/3/", "https://developer.mozilla.org/"]


async def get_github_repos(skill: str, max_results: int = 2) -> List[str]:
    """Fetch top GitHub repo URLs for a skill using GitHub Search API."""
    query_str = SKILL_GITHUB_QUERY.get(skill.lower(), f"{skill} tutorial")
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(
                GITHUB_TOPICS_API,
                params={"q": query_str, "sort": "stars", "order": "desc", "per_page": max_results},
                headers=HEADERS,
            )
            if resp.status_code == 200:
                items = resp.json().get("items", [])
                return [item["html_url"] for item in items[:max_results]]
    except Exception:
        pass
    return []


async def get_resources_for_skill(skill: str) -> List[str]:
    """Get learning resources for a skill — GitHub repos + curated docs."""
    skill_lower = skill.lower()

    # Start with curated docs
    docs = DOCS_LINKS.get(skill_lower, DEFAULT_DOCS)

    # Try to enrich with live GitHub repos (non-blocking)
    try:
        repos = await asyncio.wait_for(get_github_repos(skill), timeout=5.0)
    except asyncio.TimeoutError:
        repos = []

    # Combine: docs first, then repos
    all_links = docs + repos
    # Deduplicate preserving order
    seen = set()
    unique = []
    for link in all_links:
        if link not in seen:
            seen.add(link)
            unique.append(link)

    return unique[:4]  # Return max 4 resources


async def enrich_roadmap_with_resources(roadmap: List[Dict]) -> List[Dict]:
    """Add live GitHub resources to each roadmap step concurrently."""
    async def enrich_step(step: Dict) -> Dict:
        skill = step.get("skill", "")
        live_resources = await get_resources_for_skill(skill)
        return {**step, "resources": live_resources}

    enriched = await asyncio.gather(*[enrich_step(step) for step in roadmap])
    return list(enriched)
