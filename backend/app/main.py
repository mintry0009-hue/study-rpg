from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.rate_limit import RateLimitMiddleware
from app.db import Base, SessionLocal, engine
from app.models import achievement, pomodoro, quest, session, shop, user
from app.services.seed import seed_defaults

app = FastAPI(
    title="Study RPG API",
    description="JWT-secured RPG study growth backend with quests, achievements, stats, shop, and pomodoro systems.",
    version="1.0.0",
)

app.add_middleware(RateLimitMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.backend_cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_defaults(db)
    finally:
        db.close()


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api_router)
