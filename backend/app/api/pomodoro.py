from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models.user import User
from app.schemas.game import PomodoroComplete, PomodoroResult
from app.services.game import complete_pomodoro, level_state

router = APIRouter(prefix="/pomodoro", tags=["pomodoro"])


@router.post("/complete", response_model=PomodoroResult, status_code=201)
def complete(payload: PomodoroComplete, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> PomodoroResult:
    pomodoro = complete_pomodoro(db, user, payload)
    return PomodoroResult(
        combo=pomodoro.combo_after,
        multiplier=pomodoro.multiplier / 10,
        exp_gained=pomodoro.exp_gained,
        level_state=level_state(user),
    )
