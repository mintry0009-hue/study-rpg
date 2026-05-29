"use client";

import { useEffect, useState } from "react";
import { GrowthCharts } from "@/components/charts/growth-charts";
import { PageFrame } from "@/components/page-frame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { StatsResponse } from "@/lib/types";

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    void apiFetch<StatsResponse>("/stats").then(setStats);
  }, []);

  return (
    <PageFrame>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-black">Growth Statistics</h1>
          <p className="mt-2 text-muted-foreground">최근 30일 기준으로 공부 시간, EXP, 정확도, 오답률과 과목 분포를 보여줍니다.</p>
        </div>
        {stats ? <GrowthCharts stats={stats} /> : <p className="text-muted-foreground">Loading charts...</p>}
        <Card className="bg-card/85">
          <CardHeader><CardTitle>Weekly Summary</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {stats?.weekly.map((week) => (
              <div key={week.date} className="grid rounded-md border p-3 text-sm sm:grid-cols-4">
                <span className="font-semibold">{week.date}</span>
                <span>{week.minutes} minutes</span>
                <span>{week.exp} EXP</span>
                <span>{week.accuracy}% accuracy</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageFrame>
  );
}
