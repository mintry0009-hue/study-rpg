from collections import defaultdict
from datetime import UTC, date, datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models.session import StudySession
from app.models.user import User
from app.schemas.stats import DashboardStats, StatisticsResponse, SubjectPoint, TimePoint
from app.services.game import recommended_minutes

router = APIRouter(prefix="/stats", tags=["statistics"])


@router.get("/dashboard", response_model=DashboardStats)
def dashboard_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> DashboardStats:
    today = date.today()
    week_start = datetime.now(UTC) - timedelta(days=7)
    sessions = db.query(StudySession).filter(StudySession.user_id == user.id)
    total_sessions = sessions.count()
    avg_accuracy = sessions.with_entities(func.coalesce(func.avg(StudySession.accuracy_rate), 0)).scalar()
    today_minutes = sum(item.duration_minutes for item in sessions.all() if item.created_at.date() == today)
    weekly_minutes = sessions.filter(StudySession.created_at >= week_start).with_entities(func.coalesce(func.sum(StudySession.duration_minutes), 0)).scalar()
    return DashboardStats(
        total_sessions=total_sessions,
        total_minutes=user.total_study_minutes,
        average_accuracy=round(avg_accuracy or 0, 1),
        recommended_minutes=recommended_minutes(db, user),
        today_minutes=today_minutes,
        weekly_minutes=weekly_minutes or 0,
    )


@router.get("", response_model=StatisticsResponse)
def statistics(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> StatisticsResponse:
    since = datetime.now(UTC) - timedelta(days=30)
    sessions = (
        db.query(StudySession)
        .filter(StudySession.user_id == user.id, StudySession.created_at >= since)
        .order_by(StudySession.created_at)
        .all()
    )
    by_day: dict[str, dict[str, float]] = defaultdict(lambda: {"minutes": 0, "exp": 0, "accuracy_sum": 0, "wrong_sum": 0, "count": 0})
    by_subject: dict[str, int] = defaultdict(int)
    for session in sessions:
        key = session.created_at.date().isoformat()
        by_day[key]["minutes"] += session.duration_minutes
        by_day[key]["exp"] += session.exp_gained
        by_day[key]["accuracy_sum"] += session.accuracy_rate
        by_day[key]["wrong_sum"] += session.wrong_answer_rate
        by_day[key]["count"] += 1
        by_subject[session.subject] += session.duration_minutes

    daily: list[TimePoint] = []
    for offset in range(29, -1, -1):
        current = date.today() - timedelta(days=offset)
        row = by_day[current.isoformat()]
        count = row["count"] or 1
        daily.append(
            TimePoint(
                date=current.strftime("%m/%d"),
                minutes=int(row["minutes"]),
                exp=int(row["exp"]),
                accuracy=round(row["accuracy_sum"] / count, 1),
                wrong_answer_rate=round(row["wrong_sum"] / count, 1),
                streak=user.streak_days if offset == 0 else 0,
            )
        )

    weekly = []
    for week in range(4):
        chunk = daily[week * 7 : (week + 1) * 7]
        minutes = sum(item.minutes for item in chunk)
        exp = sum(item.exp for item in chunk)
        active = [item for item in chunk if item.minutes > 0]
        divisor = len(active) or 1
        weekly.append(
            TimePoint(
                date=f"W{week + 1}",
                minutes=minutes,
                exp=exp,
                accuracy=round(sum(item.accuracy for item in active) / divisor, 1),
                wrong_answer_rate=round(sum(item.wrong_answer_rate for item in active) / divisor, 1),
                streak=0,
            )
        )

    subjects = [SubjectPoint(subject=subject, minutes=minutes) for subject, minutes in sorted(by_subject.items(), key=lambda item: item[1], reverse=True)]
    return StatisticsResponse(daily=daily, weekly=weekly, subjects=subjects)
