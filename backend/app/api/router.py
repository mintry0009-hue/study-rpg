from fastapi import APIRouter

from app.api import achievements, auth, pomodoro, quests, sessions, shop, stats, users

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(sessions.router)
api_router.include_router(quests.router)
api_router.include_router(achievements.router)
api_router.include_router(pomodoro.router)
api_router.include_router(shop.router)
api_router.include_router(stats.router)
