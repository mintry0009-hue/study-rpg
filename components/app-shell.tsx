"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookOpenCheck, Flame, Gem, Home, LogOut, Medal, Settings, ShoppingBag, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dash", icon: Home },
  { href: "/study", label: "Study", icon: Swords },
  { href: "/statistics", label: "Stats", icon: BarChart3 },
  { href: "/quests", label: "Quests", icon: BookOpenCheck },
  { href: "/achievements", label: "Achieve", icon: Medal },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/settings", label: "Set", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen hud-grid">
      <aside className="fixed left-0 top-0 z-20 hidden h-full w-64 border-r bg-background/85 p-4 backdrop-blur lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Gem size={22} />
          </div>
          <div>
            <p className="text-lg font-black">Study RPG</p>
            <p className="text-xs text-muted-foreground">Growth Console</p>
          </div>
        </Link>
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground", active && "bg-muted text-foreground")}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Flame className="text-secondary" size={16} />
            {user?.streak_days ?? 0} day streak
          </div>
          <p className="mt-1 text-xs text-muted-foreground">하루 쉬어도 성장 리듬은 다시 이어집니다.</p>
          <Button
            className="mt-3 w-full"
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>
      <header className="sticky top-0 z-10 border-b bg-background/85 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="font-black">Study RPG</Link>
          <Button variant="outline" size="sm" onClick={() => router.push("/study")}>Record</Button>
        </div>
      </header>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-6">{children}</div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-7 gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium text-muted-foreground", active && "bg-muted text-primary")}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
