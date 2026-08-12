import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

settings = get_settings()

client: AsyncIOMotorClient = None
db = None
_connected = False


async def connect_db():
    """Connect to MongoDB using Motor async client. Non-fatal on failure."""
    global client, db, _connected

    try:
        client = AsyncIOMotorClient(
            settings.MONGO_URI,
            serverSelectionTimeoutMS=15000,
            connectTimeoutMS=15000,
            socketTimeoutMS=30000,
            tlsCAFile=certifi.where(),
        )
        db = client.hackathon_db

        # Motor-native async ping — this properly uses the event loop
        await db.command("ping")

        # Create indexes after successful connection
        await _create_indexes()
        _connected = True
        print("[OK] Connected to MongoDB Atlas and indexes created")

    except Exception as e:
        err = str(e)
        if "SSL" in err or "TLS" in err or "handshake" in err.lower():
            print("[WARN] MongoDB SSL error — check Atlas Network Access (IP whitelist).")
            print("[WARN] Go to: MongoDB Atlas > Network Access > Add IP: 0.0.0.0/0")
        elif "authentication" in err.lower() or "auth" in err.lower():
            print("[WARN] MongoDB auth failed — check username/password in .env")
        else:
            print(f"[WARN] MongoDB connection error: {err[:300]}")
        print("[INFO] Backend started WITHOUT database. Fix connection and restart.")
        _connected = False


async def _create_indexes():
    """Create required database indexes."""
    try:
        await db.users.create_index("email", unique=True)
        await db.projects.create_index("title")
        await db.projects.create_index("domain")
        await db.projects.create_index("difficulty")
        await db.recommendations.create_index("user_id")
        await db.favorites.create_index(
            [("user_id", 1), ("project_id", 1)], unique=True
        )
        await db.history.create_index("user_id")
        await db.learning_progress.create_index(
            [("user_id", 1), ("project_id", 1)], unique=True
        )
    except Exception as e:
        print(f"[WARN] Index creation skipped (non-fatal): {e}")


async def close_db():
    global client, _connected
    if client:
        client.close()
        _connected = False
        print("[INFO] MongoDB connection closed")


def get_db():
    return db


def is_connected() -> bool:
    return _connected
