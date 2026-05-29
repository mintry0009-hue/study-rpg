from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserRead(BaseModel):
    id: int
    email: EmailStr
    username: str
    level: int
    exp: int
    points: int
    streak_days: int
    total_study_minutes: int
    combo_count: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    username: str | None = None
