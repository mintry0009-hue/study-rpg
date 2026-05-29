import { AppShell } from "@/components/app-shell";
import { AuthGuard } from "@/components/auth-guard";

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
