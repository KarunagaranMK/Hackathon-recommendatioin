from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.database.mongodb import connect_db, close_db, is_connected
from app.api import auth, users, projects, recommendation, favorites, progress
from app.api import project_roadmap
from app.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──────────────────────────────────────────────────────
    print("[INFO] Starting HackMatch AI backend...")

    # Connect to MongoDB (non-fatal if it fails)
    await connect_db()

    if not is_connected():
        print("=" * 60)
        print("  IMPORTANT: MongoDB is NOT connected.")
        print("  The backend will start but API calls will fail.")
        print("  TO FIX:")
        print("  1. Go to https://cloud.mongodb.com")
        print("  2. Select your cluster -> Network Access")
        print("  3. Click 'Add IP Address'")
        print("  4. Click 'Allow Access from Anywhere' (0.0.0.0/0)")
        print("  5. Confirm, wait 30 seconds, then restart backend")
        print("=" * 60)
    else:
        print("[OK] Backend is fully ready!")

    yield

    # ── Shutdown ─────────────────────────────────────────────────────
    await close_db()


app = FastAPI(
    title="HackMatch AI — Hackathon Project Recommender",
    description="AI-Powered Hackathon Project Idea Recommendation System",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Global error handler — ensures CORS headers on 500 errors ──────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
    )

# ── Routers ───────────────────────────────────────────────────────────
app.include_router(auth.router,              prefix="/api")
app.include_router(users.router,             prefix="/api")
app.include_router(projects.router,          prefix="/api")
app.include_router(recommendation.router,    prefix="/api")
app.include_router(favorites.router,         prefix="/api")
app.include_router(progress.router,          prefix="/api")
app.include_router(project_roadmap.router,   prefix="/api")


# ── Health ────────────────────────────────────────────────────────────
@app.get("/health")
async def health_check():
    db_status = "connected" if is_connected() else "disconnected"
    return {
        "status": "ok" if is_connected() else "degraded",
        "api": "running",
        "database": db_status,
        "message": "Fix Atlas IP whitelist if database is disconnected",
    }


@app.get("/")
async def root():
    return {
        "message": "HackMatch AI — Hackathon Project Recommendation API",
        "docs": "/docs",
        "health": "/health",
    }
