from datetime import UTC, date, datetime, timedelta
from math import pow

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.achievement import Achievement, UserAchievement
from app.models.pomodoro import PomodoroSession
from app.models.quest import DailyQuest, UserDailyQuest
from app.models.session import StudySession
from app.models.user import User
from app.schemas.game import LevelState, PomodoroComplete, StudySessionCreate


def required_exp(level: int) -> int:
    return round(50 * pow(level, 1.5))


def level_state(user: User) -> LevelState:
    req = required_exp(user.level)
    return LevelState(level=user.level, exp=user.exp, required_exp=req, progress_percent=round(min(100, user.exp / req * 100), 1))


def accuracy_bonus(accuracy_rate: float) -> int:
    if accuracy_rate >= 90:
        return 30
    if accuracy_rate >= 80:
        return 20
    if accuracy_rate >= 70:
        return 10
    return 0


def calculate_exp(duration_minutes: int, problems_attempted: int, accuracy_rate: float, streak_days: int) -> int:
    total = (duration_minutes * 0.5) + (problems_attempted * 2) + accuracy_bonus(accuracy_rate) + (streak_days * 2)
    return max(1, round(total))


def apply_levelups(user: User) -> tuple[bool, int]:
    leveled_up = False
    awarded_points = 0
    while user.exp >= required_exp(user.level):
        user.exp -= required_exp(user.level)
        user.level += 1
        points = 10 + user.level * 2
        user.points += points
        awarded_points += points
        leveled_up = True
    return leveled_up, awarded_points


def update_streak(user: User, today: date) -> None:
    if user.last_study_date == today:
        return
    if user.last_study_date == today - timedelta(days=1):
        user.streak_days += 1
    elif user.last_study_date == today - timedelta(days=2):
        user.streak_days = max(1, user.streak_days)
    else:
        user.streak_days = 1
    user.last_study_date = today


def ensure_daily_quests(db: Session, user: User, quest_date: date | None = None) -> list[UserDailyQuest]:
    quest_date = quest_date or date.today()
    quests = db.query(DailyQuest).all()
    existing = {
        item.quest_id: item
        for item in db.query(UserDailyQuest).filter(UserDailyQuest.user_id == user.id, UserDailyQuest.quest_date == quest_date).all()
    }
    for quest in quests:
        if quest.id not in existing:
            item = UserDailyQuest(user_id=user.id, quest_id=quest.id, quest_date=quest_date)
            db.add(item)
            existing[quest.id] = item
    db.flush()
    return list(existing.values())


def increment_quest(db: Session, user: User, key: str, amount: int, quest_date: date) -> None:
    quest = db.query(DailyQuest).filter(DailyQuest.key == key).first()
    if not quest:
        return
    user_quest = (
        db.query(UserDailyQuest)
        .filter(UserDailyQuest.user_id == user.id, UserDailyQuest.quest_id == quest.id, UserDailyQuest.quest_date == quest_date)
        .first()
    )
    if not user_quest:
        user_quest = UserDailyQuest(user_id=user.id, quest_id=quest.id, quest_date=quest_date)
        db.add(user_quest)
        db.flush()
    user_quest.progress = min(quest.target_value, user_quest.progress + amount)
    user_quest.completed = user_quest.progress >= quest.target_value


def check_achievements(db: Session, user: User, session: StudySession | None = None) -> list[Achievement]:
    unlocked: list[Achievement] = []
    achievements = {item.key: item for item in db.query(Achievement).all()}
    owned_ids = {item.achievement_id for item in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()}

    checks = {
        "streak_7": user.streak_days >= 7,
        "streak_30": user.streak_days >= 30,
        "hours_100": user.total_study_minutes >= 6000,
        "accuracy_95": bool(session and session.accuracy_rate >= 95),
    }
    for key, passed in checks.items():
        achievement = achievements.get(key)
        if passed and achievement and achievement.id not in owned_ids:
            db.add(UserAchievement(user_id=user.id, achievement_id=achievement.id))
            user.points += achievement.reward_points
            unlocked.append(achievement)
    return unlocked


def complete_study_session(db: Session, user: User, payload: StudySessionCreate) -> tuple[StudySession, bool, int]:
    today = date.today()
    ensure_daily_quests(db, user, today)
    attempted = payload.problems_attempted
    correct = min(payload.problems_correct, attempted) if attempted else 0
    accuracy_rate_value = round((correct / attempted) * 100, 1) if attempted else 0
    wrong_answer_rate_value = round(100 - accuracy_rate_value, 1) if attempted else 0

    update_streak(user, today)
    exp_gained = calculate_exp(payload.duration_minutes, attempted, accuracy_rate_value, user.streak_days)
    session = StudySession(
        user_id=user.id,
        subject=payload.subject,
        duration_minutes=payload.duration_minutes,
        problems_attempted=attempted,
        problems_correct=correct,
        accuracy_rate=accuracy_rate_value,
        wrong_answer_rate=wrong_answer_rate_value,
        exp_gained=exp_gained,
    )
    db.add(session)
    user.exp += exp_gained
    user.total_study_minutes += payload.duration_minutes

    increment_quest(db, user, "study_60", payload.duration_minutes, today)
    increment_quest(db, user, "solve_30", attempted, today)
    if attempted - correct > 0:
        increment_quest(db, user, "wrong_review", 1, today)

    leveled_up, awarded_points = apply_levelups(user)
    db.flush()
    check_achievements(db, user, session)
    db.commit()
    db.refresh(session)
    db.refresh(user)
    return session, leveled_up, awarded_points


def claim_daily_quest(db: Session, user: User, user_quest_id: int) -> UserDailyQuest:
    user_quest = db.query(UserDailyQuest).filter(UserDailyQuest.id == user_quest_id, UserDailyQuest.user_id == user.id).first()
    if not user_quest:
        raise ValueError("Quest not found")
    if not user_quest.completed:
        raise ValueError("Quest is not complete")
    if user_quest.claimed:
        return user_quest
    user_quest.claimed = True
    user.exp += user_quest.quest.reward_exp
    user.points += user_quest.quest.reward_points
    apply_levelups(user)
    db.commit()
    db.refresh(user_quest)
    return user_quest


def combo_multiplier(combo: int) -> float:
    if combo >= 5:
        return 1.5
    if combo >= 3:
        return 1.2
    if combo >= 2:
        return 1.1
    return 1.0


def complete_pomodoro(db: Session, user: User, payload: PomodoroComplete) -> PomodoroSession:
    today = date.today()
    ensure_daily_quests(db, user, today)
    update_streak(user, today)
    user.combo_count += 1
    multiplier = combo_multiplier(user.combo_count)
    exp_gained = round(payload.focus_minutes * 0.8 * multiplier + user.streak_days * 2)
    pomodoro = PomodoroSession(
        user_id=user.id,
        focus_minutes=payload.focus_minutes,
        break_minutes=payload.break_minutes,
        combo_after=user.combo_count,
        multiplier=round(multiplier * 10),
        exp_gained=exp_gained,
    )
    db.add(pomodoro)
    user.exp += exp_gained
    user.total_study_minutes += payload.focus_minutes
    increment_quest(db, user, "pomodoro_3", 1, today)
    increment_quest(db, user, "study_60", payload.focus_minutes, today)
    apply_levelups(user)
    db.commit()
    db.refresh(pomodoro)
    db.refresh(user)
    return pomodoro


def recommended_minutes(db: Session, user: User) -> int:
    since = datetime.now(UTC) - timedelta(days=7)
    total = (
        db.query(func.coalesce(func.sum(StudySession.duration_minutes), 0))
        .filter(StudySession.user_id == user.id, StudySession.created_at >= since)
        .scalar()
    )
    average = round(total / 7)
    if average <= 0:
        return 25
    return min(average + 5, round(average * 1.1))
