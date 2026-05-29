"use client";

import { Crown, Flame, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LevelState, User } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ExpPanel({ user, level, pulse }: { user: User; level: LevelState; pulse?: boolean }) {
  return (
    <Card className={cn("overflow-hidden border-primary/30 bg-card/90", pulse && "level-pulse")}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
                <Crown className="text-primary" size={28} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adventurer</p>
                <h1 className="text-2xl font-black">{user.username}</h1>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:min-w-96">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-semibold"><Sparkles size={16} className="text-primary" /> Level {level.level}</span>
              <span className="text-muted-foreground">{level.exp} / {level.required_exp} EXP</span>
            </div>
            <Progress value={level.progress_percent} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Flame size={14} className="text-secondary" /> {user.streak_days} streak</span>
              <span>{user.points} points</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
