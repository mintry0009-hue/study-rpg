"use client";

import { FormEvent, useEffect, useState } from "react";
import { TimerReset, Zap } from "lucide-react";
import { ExpPanel } from "@/components/exp-panel";
import { PageFrame } from "@/components/page-frame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { LevelState, StudySession } from "@/lib/types";

type SessionResult = {
  session: StudySession;
  level_state: LevelState;
  leveled_up: boolean;
  awarded_points: number;
  message: string;
};

type PomodoroResult = {
  combo: number;
  multiplier: number;
  exp_gained: number;
  level_state: LevelState;
};

export default function StudyPage() {
  const { user, refreshUser } = useAuth();
  const [level, setLevel] = useState<LevelState | null>(null);
  const [result, setResult] = useState<string>("");
  const [pulse, setPulse] = useState(false);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  async function load() {
    await Promise.all([
      apiFetch<LevelState>("/users/me/level").then(setLevel),
      apiFetch<StudySession[]>("/sessions").then(setSessions),
      refreshUser()
    ]);
  }

  useEffect(() => {
    void load();
  }, []);

  async function completeSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      subject: String(form.get("subject") || "General"),
      duration_minutes: Number(form.get("duration_minutes") || 25),
      problems_attempted: Number(form.get("problems_attempted") || 0),
      problems_correct: Number(form.get("problems_correct") || 0)
    };
    const response = await apiFetch<SessionResult>("/sessions/complete", { method: "POST", body: JSON.stringify(payload) });
    setLevel(response.level_state);
    setResult(`${response.message} Accuracy ${response.session.accuracy_rate}%`);
    setPulse(response.leveled_up);
    await load();
  }

  async function completePomodoro() {
    const response = await apiFetch<PomodoroResult>("/pomodoro/complete", { method: "POST", body: JSON.stringify({ focus_minutes: 25, break_minutes: 5 }) });
    setLevel(response.level_state);
    setResult(`Pomodoro complete: +${response.exp_gained} EXP, combo x${response.multiplier}`);
    setPulse(true);
    await load();
  }

  if (!user || !level) return <PageFrame><div className="text-muted-foreground">Loading study console...</div></PageFrame>;

  return (
    <PageFrame>
      <div className="grid gap-6">
        <ExpPanel user={user} level={level} pulse={pulse} />
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle>Complete Study Session</CardTitle>
              <CardDescription>과목, 시간, 문제 수만 입력하면 EXP와 퀘스트가 즉시 반영됩니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={completeSession}>
                <Input name="subject" placeholder="Subject" defaultValue="Math" />
                <Input name="duration_minutes" type="number" min={1} max={1440} defaultValue={25} />
                <Input name="problems_attempted" type="number" min={0} defaultValue={0} />
                <Input name="problems_correct" type="number" min={0} defaultValue={0} />
                <Button className="md:col-span-2"><Zap size={18} /> Gain EXP</Button>
              </form>
              {result && <p className="mt-4 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-primary">{result}</p>}
            </CardContent>
          </Card>
          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle>Pomodoro Focus</CardTitle>
              <CardDescription>25분 집중, 5분 휴식. 완료하면 콤보 배율이 오릅니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-5 flex aspect-square items-center justify-center rounded-lg border bg-background/70 text-center">
                <div>
                  <TimerReset className="mx-auto mb-3 text-secondary" size={42} />
                  <p className="text-4xl font-black">25:00</p>
                  <p className="text-sm text-muted-foreground">Focus cycle</p>
                </div>
              </div>
              <Button className="w-full" variant="secondary" onClick={completePomodoro}>Complete Pomodoro</Button>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-card/85">
          <CardHeader><CardTitle>Recent Sessions</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {sessions.map((session) => (
              <div key={session.id} className="grid gap-2 rounded-md border p-3 text-sm sm:grid-cols-5">
                <span className="font-semibold">{session.subject}</span>
                <span>{session.duration_minutes}m</span>
                <span>{session.problems_correct}/{session.problems_attempted}</span>
                <span>{session.accuracy_rate}%</span>
                <span className="text-primary">+{session.exp_gained} EXP</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageFrame>
  );
}
