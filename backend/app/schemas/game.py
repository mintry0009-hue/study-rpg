from datetime import datetime

from pydantic import BaseModel, Field, computed_field


class LevelState(BaseModel):
    level: int
    exp: int
    required_exp: int
    progress_percent: float


class StudySessionCreate(BaseModel):
    subject: str = Field(default="General", min_length=1, max_length=120)
    duration_minutes: int = Field(ge=1, le=1440)
    problems_attempted: int = Field(default=0, ge=0, le=10000)
    problems_correct: int = Field(default=0, ge=0, le=10000)


class StudySessionRead(BaseModel):
    id: int
    subject: str
    duration_minutes: int
    problems_attempted: int
    problems_correct: int
    accuracy_rate: float
    wrong_answer_rate: float
    exp_gained: int
    created_at: datetime

    model_config = {"from_attributes": True}


class SessionResult(BaseModel):
    session: StudySessionRead
    level_state: LevelState
    leveled_up: bool
    awarded_points: int
    message: str


class QuestRead(BaseModel):
    id: int
    title: str
    description: str
    target_value: int
    reward_exp: int
    reward_points: int
    progress: int
    completed: bool
    claimed: bool

    @computed_field
    @property
    def progress_percent(self) -> float:
        return min(100, round((self.progress / self.target_value) * 100, 1)) if self.target_value else 0


class AchievementRead(BaseModel):
    id: int
    key: str
    name: str
    description: str
    reward_points: int
    unlocked: bool
    unlocked_at: datetime | None = None


class PomodoroComplete(BaseModel):
    focus_minutes: int = Field(default=25, ge=1, le=180)
    break_minutes: int = Field(default=5, ge=0, le=60)


class PomodoroResult(BaseModel):
    combo: int
    multiplier: float
    exp_gained: int
    level_state: LevelState


class ShopItemRead(BaseModel):
    id: int
    key: str
    name: str
    description: str
    category: str
    price_points: int
    purchased: bool


class PurchaseResult(BaseModel):
    item: ShopItemRead
    remaining_points: int
