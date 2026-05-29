# Study RPG

Study RPG is a full-stack web service that turns study sessions into RPG-style growth. Users earn EXP, level up, maintain streaks, complete daily quests, unlock achievements, run pomodoro combos, and spend points in a cosmetic shop.

## Stack

- Frontend: Next.js App Router, TypeScript, TailwindCSS, shadcn/ui-style components, Recharts
- Backend: FastAPI, SQLAlchemy, Pydantic, JWT auth
- Database: PostgreSQL
- Deployment: Vercel-ready frontend and Railway/Render-ready backend
- Local runtime: Docker Compose

## Project Structure

```text
app/                 # Next.js App Router frontend, Vercel root
components/
lib/
public/
backend/             # FastAPI API service
docker-compose.yml
vercel.json
```

## Quick Start With Docker

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8000/health`
- Swagger API docs: `http://localhost:8000/docs`

## Local Development

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend:

```bash
npm install
copy .env.frontend.example .env.local
npm run dev
```

## Core Game Rules

- EXP formula: `(duration_minutes * 0.5) + (problems_attempted * 2) + accuracy_bonus + streak_bonus`
- Accuracy bonus: 90% `+30`, 80% `+20`, 70% `+10`
- Streak bonus: `streak_days * 2`
- Level requirement: `50 * level^1.5`
- Level-up reward: points are granted automatically
- Recommended study time: recent 7-day average plus a small capped increase

## Security

- JWT bearer authentication
- Password hashing with bcrypt
- SQL injection protection through SQLAlchemy ORM
- Pydantic input validation
- Basic in-memory rate limiting middleware

## Deployment Notes

Frontend on Vercel:

- Set `NEXT_PUBLIC_API_URL=https://your-backend.example.com/api`
- Build command: `npm run build`
- Root directory: repository root
- Included `vercel.json` lets Vercel detect and build the mobile-first Next.js app directly
- The app includes a web manifest, standalone display mode, and portrait mobile viewport settings

Backend on Railway/Render:

- Root directory: `backend`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set `DATABASE_URL`, `SECRET_KEY`, and `BACKEND_CORS_ORIGINS`
- Run `alembic upgrade head` during deploy or use the included startup `create_all` fallback for first boot

## API Documentation

See `backend/API.md` or use FastAPI Swagger at `/docs`.
