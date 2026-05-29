# Study RPG API

FastAPI automatically serves interactive Swagger documentation at:

- Local: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

All protected endpoints require:

```http
Authorization: Bearer <JWT>
```

## Auth

- `POST /api/auth/register` creates a user and returns a JWT.
- `POST /api/auth/login` validates credentials and returns a JWT.

## User

- `GET /api/users/me` returns the current user profile.
- `PATCH /api/users/me` updates profile fields.
- `GET /api/users/me/level` returns level, EXP requirement, and EXP progress.

## Study Sessions

- `GET /api/sessions` returns recent sessions.
- `POST /api/sessions/complete` records a completed study session.

Completing a session automatically calculates EXP, updates level, updates streak, updates quests, and unlocks achievements.

EXP:

```text
(duration_minutes * 0.5) + (problems_attempted * 2) + accuracy_bonus + (streak_days * 2)
```

## Quests

- `GET /api/quests/daily` creates or returns today's quests.
- `POST /api/quests/{user_quest_id}/claim` claims completed quest rewards.

## Achievements

- `GET /api/achievements` returns locked and unlocked achievements.

## Pomodoro

- `POST /api/pomodoro/complete` completes a focus cycle and grants combo EXP.

## Shop

- `GET /api/shop` lists cosmetic items.
- `POST /api/shop/{item_id}/purchase` purchases an item with points.

## Statistics

- `GET /api/stats/dashboard` returns dashboard metrics and recommended study minutes.
- `GET /api/stats` returns chart series for daily, weekly, and subject graphs.
