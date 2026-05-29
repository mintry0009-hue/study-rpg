export type User = {
  id: number;
  email: string;
  username: string;
  level: number;
  exp: number;
  points: number;
  streak_days: number;
  total_study_minutes: number;
  combo_count: number;
  created_at: string;
};

export type LevelState = {
  level: number;
  exp: number;
  required_exp: number;
  progress_percent: number;
};

export type DashboardStats = {
  total_sessions: number;
  total_minutes: number;
  average_accuracy: number;
  recommended_minutes: number;
  today_minutes: number;
  weekly_minutes: number;
};

export type Quest = {
  id: number;
  title: string;
  description: string;
  target_value: number;
  reward_exp: number;
  reward_points: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  progress_percent: number;
};

export type Achievement = {
  id: number;
  key: string;
  name: string;
  description: string;
  reward_points: number;
  unlocked: boolean;
  unlocked_at: string | null;
};

export type StudySession = {
  id: number;
  subject: string;
  duration_minutes: number;
  problems_attempted: number;
  problems_correct: number;
  accuracy_rate: number;
  wrong_answer_rate: number;
  exp_gained: number;
  created_at: string;
};

export type StatsResponse = {
  daily: Array<{ date: string; minutes: number; exp: number; accuracy: number; wrong_answer_rate: number; streak: number }>;
  weekly: Array<{ date: string; minutes: number; exp: number; accuracy: number; wrong_answer_rate: number; streak: number }>;
  subjects: Array<{ subject: string; minutes: number }>;
};

export type ShopItem = {
  id: number;
  key: string;
  name: string;
  description: string;
  category: string;
  price_points: number;
  purchased: boolean;
};
