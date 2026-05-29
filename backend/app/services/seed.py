from sqlalchemy.orm import Session

from app.models.achievement import Achievement
from app.models.quest import DailyQuest
from app.models.shop import ShopItem


QUESTS = [
    ("study_60", "60분 집중", "오늘 60분 이상 공부하기", 60, 40, 5),
    ("solve_30", "문제 30개 격파", "문제를 30개 이상 풀기", 30, 35, 4),
    ("wrong_review", "오답 복습", "오답을 1개 이상 기록하고 복습하기", 1, 25, 3),
    ("pomodoro_3", "뽀모도로 3회", "집중 타이머를 3회 완료하기", 3, 45, 6),
]

ACHIEVEMENTS = [
    ("streak_7", "7일 연속 공부", "7일 연속으로 성장 루틴 유지", 30),
    ("streak_30", "30일 연속 공부", "30일 연속으로 공부 리듬 유지", 150),
    ("hours_100", "누적 100시간", "총 100시간 공부 달성", 120),
    ("accuracy_95", "정밀 타격", "한 세션에서 정확도 95% 이상 달성", 50),
]

SHOP_ITEMS = [
    ("theme_ember", "Ember Theme", "붉은 강화석 느낌의 UI 테마", "theme", 40),
    ("title_archmage", "Archmage", "프로필 칭호: Archmage", "title", 80),
    ("frame_crystal", "Crystal Frame", "프로필 크리스탈 프레임", "profile", 60),
    ("ui_compact", "Compact HUD", "더 조밀한 대시보드 HUD", "ui", 35),
]


def seed_defaults(db: Session) -> None:
    for key, title, description, target, reward_exp, reward_points in QUESTS:
        if not db.query(DailyQuest).filter(DailyQuest.key == key).first():
            db.add(DailyQuest(key=key, title=title, description=description, target_value=target, reward_exp=reward_exp, reward_points=reward_points))

    for key, name, description, reward_points in ACHIEVEMENTS:
        if not db.query(Achievement).filter(Achievement.key == key).first():
            db.add(Achievement(key=key, name=name, description=description, reward_points=reward_points))

    for key, name, description, category, price in SHOP_ITEMS:
        if not db.query(ShopItem).filter(ShopItem.key == key).first():
            db.add(ShopItem(key=key, name=name, description=description, category=category, price_points=price))

    db.commit()
