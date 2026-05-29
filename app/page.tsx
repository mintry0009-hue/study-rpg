"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, Crown, LineChart, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="min-h-screen hud-grid">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <nav className="absolute left-4 right-4 top-4 mx-auto flex max-w-7xl items-center justify-between sm:left-6 sm:right-6 lg:left-8 lg:right-8">
          <Link href="/" className="text-xl font-black">Study RPG</Link>
          <div className="flex gap-2">
            <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
            <Button asChild><Link href="/register">Start</Link></Button>
          </div>
        </nav>
        <div className="max-w-3xl pt-16">
          <p className="mb-4 inline-flex rounded-md border border-primary/40 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">EXP, quests, streaks, and level-ups for study</p>
          <h1 className="text-5xl font-black leading-tight sm:text-7xl">Study RPG</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            공부 세션을 기록하면 EXP가 오르고, 일일 퀘스트와 업적이 열리며, 성장 그래프가 캐릭터처럼 쌓입니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/register">Create Character <ArrowRight size={18} /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/login">Continue Run</Link></Button>
          </div>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {[
            { icon: Crown, title: "Level Growth", text: "EXP bar and level-up rewards" },
            { icon: BookOpenCheck, title: "Daily Quests", text: "60 minutes, 30 problems, pomodoro" },
            { icon: LineChart, title: "Progress Graphs", text: "Accuracy, wrong answer, subjects" },
            { icon: Swords, title: "Fast Logging", text: "Minimal inputs, immediate feedback" }
          ].map((item) => (
            <Card key={item.title} className="bg-card/70">
              <CardContent className="p-5">
                <item.icon className="mb-4 text-primary" size={28} />
                <h2 className="font-bold">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
