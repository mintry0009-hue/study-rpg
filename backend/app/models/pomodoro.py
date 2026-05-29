from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    focus_minutes: Mapped[int] = mapped_column(Integer, default=25, nullable=False)
    break_minutes: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    combo_after: Mapped[int] = mapped_column(Integer, nullable=False)
    multiplier: Mapped[int] = mapped_column(Integer, nullable=False)
    exp_gained: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="pomodoros")
