"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await login(String(form.get("email")), String(form.get("password")));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card/90">
        <CardHeader>
          <CardTitle>Continue Run</CardTitle>
          <CardDescription>캐릭터 성장 기록을 불러옵니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <Input name="email" type="email" placeholder="email@example.com" required />
            <Input name="password" type="password" placeholder="password" required />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button disabled={loading}>{loading ? "Loading..." : "Login"}</Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">처음이라면 <Link className="text-primary" href="/register">캐릭터 생성</Link></p>
        </CardContent>
      </Card>
    </main>
  );
}
