"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import { PageFrame } from "@/components/page-frame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { User } from "@/lib/types";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await apiFetch<User>("/users/me", { method: "PATCH", body: JSON.stringify({ username: String(form.get("username")) }) });
    await refreshUser();
    setMessage("Settings saved.");
  }

  return (
    <PageFrame>
      <div className="max-w-2xl">
        <Card className="bg-card/85">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>프로필 정보와 향후 커스터마이징 옵션을 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={submit}>
              <Input name="email" value={user?.email ?? ""} disabled />
              <Input name="username" defaultValue={user?.username ?? ""} minLength={2} />
              <Button className="w-fit"><Save size={16} /> Save</Button>
            </form>
            {message && <p className="mt-4 text-sm text-primary">{message}</p>}
          </CardContent>
        </Card>
      </div>
    </PageFrame>
  );
}
