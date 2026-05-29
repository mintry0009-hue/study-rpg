"use client";

import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { PageFrame } from "@/components/page-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Quest } from "@/lib/types";

export default function QuestsPage() {
  const { refreshUser } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    setQuests(await apiFetch<Quest[]>("/quests/daily"));
  }

  useEffect(() => {
    void load();
  }, []);

  async function claim(id: number) {
    const quest = await apiFetch<Quest>(`/quests/${id}/claim`, { method: "POST", body: JSON.stringify({}) });
    setMessage(`${quest.title} reward claimed.`);
    await refreshUser();
    await load();
  }

  return (
    <PageFrame>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-black">Daily Quests</h1>
          <p className="mt-2 text-muted-foreground">매일 자동 생성되는 작은 목표입니다. 완료 보상은 EXP와 포인트로 지급됩니다.</p>
        </div>
        {message && <div className="rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-primary">{message}</div>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quests.map((quest) => (
            <Card key={quest.id} className="bg-card/85">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{quest.title}</CardTitle>
                    <CardDescription className="mt-2">{quest.description}</CardDescription>
                  </div>
                  <Badge>{quest.completed ? "Complete" : "Active"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex justify-between text-sm text-muted-foreground">
                  <span>{quest.progress}/{quest.target_value}</span>
                  <span>+{quest.reward_exp} EXP / +{quest.reward_points} P</span>
                </div>
                <Progress value={quest.progress_percent} />
                <Button className="mt-4 w-full" disabled={!quest.completed || quest.claimed} onClick={() => claim(quest.id)}>
                  <Gift size={16} /> {quest.claimed ? "Claimed" : "Claim Reward"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageFrame>
  );
}
