"""
Project Dataset Seeder — v2
Reads projects.csv, generates embeddings for each project,
and upserts them into MongoDB 'projects' collection.

Run from the backend/ directory:
    python -m app.dataset.seed_projects
"""
import asyncio
import csv
import os
import sys
from pathlib import Path

# Allow running as script
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/hackathon_db")
DB_NAME   = os.getenv("MONGO_DB_NAME", "hackathon_db")
CSV_PATH  = Path(__file__).parent / "projects.csv"


def parse_list(value: str):
    """Parse comma-separated string into a clean list."""
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


async def seed_projects():
    print("[INFO] Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]

    print("[INFO] Loading Sentence Transformer model (all-MiniLM-L6-v2)...")
    from app.ai.embedding import generate_embedding, project_to_text
    print("[OK] Model loaded.")

    if not CSV_PATH.exists():
        print(f"[ERROR] CSV not found at {CSV_PATH}")
        print("        Please ensure projects.csv is in backend/app/dataset/")
        client.close()
        return

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"[INFO] {len(rows)} projects found in CSV. Starting seed...")
    inserted = 0
    updated  = 0
    failed   = 0
    errors   = []

    for i, row in enumerate(rows):
        title = row.get("title", "").strip()
        if not title:
            print(f"  [SKIP] Row {i+1}: empty title, skipping.")
            continue

        try:
            project = {
                "title":              title,
                "description":        row.get("description",       "").strip(),
                "problem_statement":  row.get("problem_statement",  "").strip(),
                "domain":             row.get("domain",             "").strip(),
                "difficulty":         row.get("difficulty",         "Intermediate").strip(),
                "skills_required":    parse_list(row.get("skills_required",    "")),
                "technologies":       parse_list(row.get("technologies",       "")),
                "estimated_duration": row.get("estimated_duration", "2-3 days").strip(),
                "learning_resources": parse_list(row.get("learning_resources", "")),
                "architecture":       row.get("architecture",       "").strip(),
                "modules":            parse_list(row.get("modules",            "")),
                "dataset_info":       row.get("dataset_info",       "").strip(),
                # roadmap is generated dynamically at recommendation time from missing skills
            }

            # Generate embedding from project text
            text = project_to_text(project)
            project["embedding"] = generate_embedding(text)

            # Upsert by title (idempotent)
            result = await db.projects.update_one(
                {"title": project["title"]},
                {"$set": project},
                upsert=True,
            )

            if result.upserted_id:
                inserted += 1
            else:
                updated += 1

            if (i + 1) % 25 == 0 or (i + 1) == len(rows):
                print(f"  [OK] Processed {i+1}/{len(rows)} — inserted:{inserted} updated:{updated} failed:{failed}")

        except Exception as e:
            failed += 1
            errors.append(f"Row {i+1} ({title[:40]}): {e}")
            print(f"  [ERR] Row {i+1} ({title[:40]}): {e}")

    # Create indexes — drop old non-unique title index first to avoid conflict
    try:
        await db.projects.drop_index("title_1")
    except Exception:
        pass  # Index may not exist yet
    await db.projects.create_index("title", unique=True)
    await db.projects.create_index("domain")
    await db.projects.create_index("difficulty")
    print("[OK] Indexes created on projects collection.")

    total_in_db = await db.projects.count_documents({})
    print(f"\n[DONE] Seeding complete!")
    print(f"       Inserted : {inserted}")
    print(f"       Updated  : {updated}")
    print(f"       Failed   : {failed}")
    print(f"       Total in DB : {total_in_db}")

    if errors:
        print("\n[ERRORS]")
        for err in errors[:10]:
            print(f"  {err}")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed_projects())
