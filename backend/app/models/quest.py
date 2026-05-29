from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class DailyQuest(Base):
    __tablename__ = "daily_quests"

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    target_value: Mapped[int] = mapped_column(Integer, nullable=False)
    reward_exp: Mapped[int] = mapped_column(Integer, nullable=False)
    reward_points: Mapped[int] = mapped_column(Integer, nullable=False)

    users = relationship("UserDailyQuest", back_populates="quest")


class UserDailyQuest(Base):
    __tablename__ = "user_daily_quests"
    __table_args__ = (UniqueConstraint("user_id", "quest_id", "quest_date", name="uq_user_quest_date"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    quest_id: Mapped[int] = mapped_column(ForeignKey("daily_quests.id", ondelete="CASCADE"))
    quest_date: Mapped[date] = mapped_column(Date, index=True)
    progress: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    claimed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="quests")
    quest = relationship("DailyQuest", back_populates="users")
