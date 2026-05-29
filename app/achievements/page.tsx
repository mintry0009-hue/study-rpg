"use client";

import { useEffect, useState } from "react";
import { Lock, Medal } from "lucide-react";
import { PageFrame } from "@/components/page-frame";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { Achievement } from "@/lib/types";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    void apiFetch<Achievement[]>("/achievements").then(setAchievements);
  }, []);

  return (
    <PageFrame>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-black">Achievements</h1>
          <p className="mt-2 text-muted-foreground">긴 누적 성장과 뛰어난 세션을 포인트 보상으로 남깁니다.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={achievement.unlocked ? "border-primary/40 bg-card/90" : "bg-card/60 opacity-75"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  {achievement.unlocked ? <Medal className="text-secondary" /> : <Lock className="text-muted-foreground" />}
                  <Badge>{achievement.reward_points} P</Badge>
                </div>
                <CardTitle>{achievement.name}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {achievement.unlocked ? `Unlocked ${new Date(achievement.unlocked_at ?? "").toLocaleDateString()}` : "Locked"}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageFrame>
  );
}
