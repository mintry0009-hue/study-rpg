from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models.quest import UserDailyQuest
from app.models.user import User
from app.schemas.game import QuestRead
from app.services.game import claim_daily_quest, ensure_daily_quests

router = APIRouter(prefix="/quests", tags=["quests"])


def serialize_quest(item: UserDailyQuest) -> QuestRead:
    return QuestRead(
        id=item.id,
        title=item.quest.title,
        description=item.quest.description,
        target_value=item.quest.target_value,
        reward_exp=item.quest.reward_exp,
        reward_points=item.quest.reward_points,
        progress=item.progress,
        completed=item.completed,
        claimed=item.claimed,
    )


@router.get("/daily", response_model=list[QuestRead])
def daily_quests(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[QuestRead]:
    ensure_daily_quests(db, user, date.today())
    db.commit()
    quests = (
        db.query(UserDailyQuest)
        .filter(UserDailyQuest.user_id == user.id, UserDailyQuest.quest_date == date.today())
        .join(UserDailyQuest.quest)
        .all()
    )
    return [serialize_quest(item) for item in quests]


@router.post("/{user_quest_id}/claim", response_model=QuestRead)
def claim_quest(user_quest_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> QuestRead:
    try:
        item = claim_daily_quest(db, user, user_quest_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return serialize_quest(item)
