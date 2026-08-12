"""
Team Work Split Module
Given a roadmap and team size, randomly assign steps to team members.
Also calculates total project time based on parallel execution.
"""
import random
from typing import List, Dict


MEMBER_ROLES = [
    "Frontend Developer",
    "Backend Developer",
    "ML Engineer",
    "DevOps Engineer",
    "Full Stack Developer",
    "Data Engineer",
    "QA Engineer",
    "UI/UX Designer",
]

MEMBER_COLORS = [
    "#4F46E5",  # indigo
    "#059669",  # green
    "#D97706",  # amber
    "#DC2626",  # red
    "#7C3AED",  # violet
    "#0891B2",  # cyan
    "#D97706",  # orange
    "#BE185D",  # pink
]


def assign_team_work(roadmap: List[Dict], team_size: int) -> Dict:
    """
    Split roadmap steps randomly across team members.
    Returns team assignments + parallel time estimate.
    """
    if not roadmap or team_size <= 0:
        return {"members": [], "total_weeks_parallel": 0, "total_weeks_sequential": 0}

    team_size = min(team_size, 8)  # max 8 members

    # Create team members with roles
    roles = random.sample(MEMBER_ROLES, min(team_size, len(MEMBER_ROLES)))
    if team_size > len(MEMBER_ROLES):
        roles += [f"Developer {i}" for i in range(team_size - len(MEMBER_ROLES))]

    members = []
    for i in range(team_size):
        members.append({
            "id": i + 1,
            "name": f"Member {i + 1}",
            "role": roles[i],
            "color": MEMBER_COLORS[i % len(MEMBER_COLORS)],
            "steps": [],
            "total_weeks": 0,
        })

    # Shuffle roadmap steps for random assignment
    shuffled_steps = list(roadmap)
    random.shuffle(shuffled_steps)

    # Assign steps using round-robin + balance by time
    for step in shuffled_steps:
        # Pick member with least total weeks so far (load balancing)
        target = min(members, key=lambda m: m["total_weeks"])
        step_weeks = _parse_weeks(step.get("estimated_time", "1 week"))
        target["steps"].append({
            "step": step["step"],
            "skill": step["skill"],
            "description": step["description"],
            "estimated_time": step.get("estimated_time", "1 week"),
        })
        target["total_weeks"] += step_weeks

    # Calculate timing
    sequential_weeks = sum(_parse_weeks(s.get("estimated_time", "1 week")) for s in roadmap)
    parallel_weeks = max(m["total_weeks"] for m in members) if members else 0

    # Format time strings
    for member in members:
        member["total_time"] = _format_weeks(member["total_weeks"])
        del member["total_weeks"]

    return {
        "team_size": team_size,
        "members": members,
        "total_weeks_sequential": sequential_weeks,
        "total_weeks_parallel": parallel_weeks,
        "total_time_sequential": _format_weeks(sequential_weeks),
        "total_time_parallel": _format_weeks(parallel_weeks),
        "time_saved_percent": round((1 - parallel_weeks / sequential_weeks) * 100) if sequential_weeks > 0 else 0,
    }


def _parse_weeks(time_str: str) -> int:
    """Parse '3 weeks' / '1 month' → integer weeks."""
    time_str = time_str.lower()
    if "month" in time_str:
        nums = [int(x) for x in time_str.split() if x.isdigit()]
        return (nums[0] if nums else 1) * 4
    nums = [int(x) for x in time_str.split() if x.isdigit()]
    return nums[0] if nums else 1


def _format_weeks(weeks: int) -> str:
    if weeks == 0:
        return "Ready to start!"
    if weeks <= 1:
        return "1 week"
    if weeks <= 4:
        return f"{weeks} weeks"
    if weeks <= 12:
        months = weeks // 4
        return f"{months} month{'s' if months > 1 else ''}"
    return f"{weeks // 4} months"


def calculate_roadmap_stats(roadmap: List[Dict]) -> Dict:
    """Calculate total time and step count for a roadmap."""
    total_weeks = sum(_parse_weeks(s.get("estimated_time", "1 week")) for s in roadmap)
    return {
        "total_steps": len(roadmap),
        "total_weeks": total_weeks,
        "total_time": _format_weeks(total_weeks),
    }
