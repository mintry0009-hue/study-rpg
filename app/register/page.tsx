"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await register(String(form.get("email")), String(form.get("username")), String(form.get("password")));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card/90">
        <CardHeader>
          <CardTitle>Create Character</CardTitle>
          <CardDescription>첫 세션부터 EXP와 퀘스트가 기록됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <Input name="email" type="email" placeholder="email@example.com" required />
            <Input name="username" placeholder="username" minLength={2} required />
            <Input name="password" type="password" placeholder="8+ characters" minLength={8} required />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button disabled={loading}>{loading ? "Creating..." : "Start Adventure"}</Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">이미 계정이 있다면 <Link className="text-primary" href="/login">로그인</Link></p>
        </CardContent>
      </Card>
    </main>
  );
}
