import asyncio
import os
import sys
sys.path.insert(0, ".")
from dotenv import load_dotenv
load_dotenv()
from motor.motor_asyncio import AsyncIOMotorClient

async def check():
    client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
    db = client["hackathon_db"]
    count = await db.projects.count_documents({})
    print("[OK] Projects in DB:", count)
    domains = await db.projects.distinct("domain")
    print("[OK] Domains found:", domains)
    p = await db.projects.find_one({}, {"title": 1, "domain": 1, "difficulty": 1, "embedding": 1})
    if p:
        emb_len = len(p.get("embedding", []))
        title = str(p.get("title", ""))[:60]
        print("[OK] Sample title:", title)
        print("[OK] Embedding dims:", emb_len)
    else:
        print("[WARN] No projects found!")
    client.close()

asyncio.run(check())
