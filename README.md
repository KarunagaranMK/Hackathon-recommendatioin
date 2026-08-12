# HackMatch AI

**AI-Powered Hackathon Project Idea Recommendation System**

---

## Quick Start

### Option 1 — Double-click `start.bat`
Just double-click [`start.bat`](./start.bat) in the project root. It will open the backend and frontend in separate terminal windows automatically.

### Option 2 — Manual (2 terminals)

**Terminal 1 — Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Database Seeding

The first time you run the project, you need to seed the project dataset into MongoDB.

**Option 1 — Double-click `seed_database.bat`** (recommended, takes ~2-3 min)

**Option 2 — Manual:**
```bash
cd backend
python -m app.dataset.seed_projects
```

This seeds **212 hackathon projects** from `backend/app/dataset/projects.csv` into MongoDB with AI embeddings.  
You only need to run this **once**. Re-running is safe (upserts by title).

---

## URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Material UI v9 |
| Backend | FastAPI + Motor (async MongoDB) |
| Database | MongoDB Atlas |
| AI Model | Sentence Transformers (all-MiniLM-L6-v2) |
| Similarity | Cosine Similarity (scikit-learn) |
| Auth | JWT (python-jose) |
| Font | Manrope (Google Fonts) |

---

## How the AI Works

1. **Student Profile** → converted to a descriptive sentence
2. **Sentence Embedding** → 384-dim vector via `all-MiniLM-L6-v2`
3. **Cosine Similarity** → compared against all 212 project embeddings
4. **Ranked Results** → top-K most similar projects returned
5. **Skill Gap Analysis** → matched vs. missing skills calculated
6. **Learning Roadmap** → ordered steps generated for missing skills

---

## Project Structure

```
project-recommendation/
├── start.bat               # Start both servers
├── seed_database.bat       # Seed MongoDB with projects
├── backend/
│   ├── main.py             # FastAPI app
│   ├── .env                # MongoDB URI, JWT secret
│   └── app/
│       ├── ai/             # Embedding, similarity, skill gap, roadmap
│       ├── api/            # Auth, users, projects, recommend, favorites, progress
│       ├── dataset/        # projects.csv + seed_projects.py
│       ├── database/       # MongoDB connection
│       ├── middleware/      # JWT auth
│       └── models/         # Pydantic models
└── frontend/
    ├── src/
    │   ├── pages/          # All page components
    │   ├── components/     # Sidebar, AppShell, ProjectCard, etc.
    │   ├── services/       # API service files
    │   ├── context/        # AuthContext (JWT)
    │   └── theme.js        # MUI design system
    └── .env                # VITE_API_BASE_URL
```
