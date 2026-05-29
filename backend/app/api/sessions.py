from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models.session import StudySession
from app.models.user import User
from app.schemas.game import SessionResult, StudySessionCreate, StudySessionRead
from app.services.game import complete_study_session, level_state

router = APIRouter(prefix="/sessions", tags=["study sessions"])


@router.get("", response_model=list[StudySessionRead])
def list_sessions(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[StudySession]:
    return db.query(StudySession).filter(StudySession.user_id == user.id).order_by(StudySession.created_at.desc()).limit(50).all()


@router.post("/complete", response_model=SessionResult, status_code=201)
def complete_session(
    payload: StudySessionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> SessionResult:
    session, leveled_up, awarded_points = complete_study_session(db, user, payload)
    message = "Level up! New power unlocked." if leveled_up else f"+{session.exp_gained} EXP gained."
    return SessionResult(session=session, level_state=level_state(user), leveled_up=leveled_up, awarded_points=awarded_points, message=message)
