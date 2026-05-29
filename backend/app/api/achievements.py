from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models.achievement import Achievement, UserAchievement
from app.models.user import User
from app.schemas.game import AchievementRead

router = APIRouter(prefix="/achievements", tags=["achievements"])


@router.get("", response_model=list[AchievementRead])
def achievements(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[AchievementRead]:
    unlocked = {
        item.achievement_id: item
        for item in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    }
    items = db.query(Achievement).order_by(Achievement.id).all()
    return [
        AchievementRead(
            id=item.id,
            key=item.key,
            name=item.name,
            description=item.description,
            reward_points=item.reward_points,
            unlocked=item.id in unlocked,
            unlocked_at=unlocked[item.id].unlocked_at if item.id in unlocked else None,
        )
        for item in items
    ]
