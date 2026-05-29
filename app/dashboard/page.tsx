"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, Target, Trophy, Zap } from "lucide-react";
import { ExpPanel } from "@/components/exp-panel";
import { PageFrame } from "@/components/page-frame";
import { GrowthCharts } from "@/components/charts/growth-charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { DashboardStats, LevelState, Quest, StatsResponse } from "@/lib/types";

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [level, setLevel] = useState<LevelState | null>(null);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    void Promise.all([
      apiFetch<LevelState>("/users/me/level").then(setLevel),
      apiFetch<DashboardStats>("/stats/dashboard").then(setDashboard),
      apiFetch<Quest[]>("/quests/daily").then(setQuests),
      apiFetch<StatsResponse>("/stats").then(setStats),
      refreshUser()
    ]);
  }, [refreshUser]);

  if (!user || !level || !dashboard || !stats) return <PageFrame><div className="text-muted-foreground">Loading dashboard...</div></PageFrame>;

  return (
    <PageFrame>
      <div className="grid gap-6">
        <ExpPanel user={user} level={level} />
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={Clock} label="Today" value={`${dashboard.today_minutes}m`} />
          <StatCard icon={Zap} label="Weekly" value={`${dashboard.weekly_minutes}m`} />
          <StatCard icon={Target} label="Recommended" value={`${dashboard.recommended_minutes}m`} />
          <StatCard icon={Trophy} label="Accuracy" value={`${dashboard.average_accuracy}%`} />
        </div>
        <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <div>
            <GrowthCharts stats={stats} />
          </div>
          <Card className="bg-card/85">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Daily Quests</CardTitle>
              <Button asChild variant="outline" size="sm"><Link href="/quests">All</Link></Button>
            </CardHeader>
            <CardContent className="grid gap-3">
              {quests.map((quest) => (
                <div key={quest.id} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="font-semibold">{quest.title}</p>
                    <Badge>{quest.completed ? "Done" : `${quest.progress}/${quest.target_value}`}</Badge>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{quest.description}</p>
                  <Progress value={quest.progress_percent} />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </PageFrame>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <Card className="bg-card/85">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-muted">
          <Icon className="text-primary" size={22} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
