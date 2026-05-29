from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_sessions: int
    total_minutes: int
    average_accuracy: float
    recommended_minutes: int
    today_minutes: int
    weekly_minutes: int


class TimePoint(BaseModel):
    date: str
    minutes: int
    exp: int
    accuracy: float
    wrong_answer_rate: float
    streak: int


class SubjectPoint(BaseModel):
    subject: str
    minutes: int


class StatisticsResponse(BaseModel):
    daily: list[TimePoint]
    weekly: list[TimePoint]
    subjects: list[SubjectPoint]
