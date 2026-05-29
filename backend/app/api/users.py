from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models.user import User
from app.schemas.game import LevelState
from app.schemas.user import UserRead, UserUpdate
from app.services.game import level_state

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(get_current_user)) -> User:
    return user


@router.patch("/me", response_model=UserRead)
def update_me(payload: UserUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> User:
    if payload.username:
        user.username = payload.username
    db.commit()
    db.refresh(user)
    return user


@router.get("/me/level", response_model=LevelState)
def my_level(user: User = Depends(get_current_user)) -> LevelState:
    return level_state(user)
