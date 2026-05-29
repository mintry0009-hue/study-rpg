"use client";

import { useEffect, useState } from "react";
import { Gem, ShoppingBag } from "lucide-react";
import { PageFrame } from "@/components/page-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { ShopItem } from "@/lib/types";

export default function ShopPage() {
  const { user, refreshUser } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    setItems(await apiFetch<ShopItem[]>("/shop"));
  }

  useEffect(() => {
    void load();
  }, []);

  async function purchase(id: number) {
    await apiFetch(`/shop/${id}/purchase`, { method: "POST", body: JSON.stringify({}) });
    setMessage("Purchase complete. Cosmetic unlock added.");
    await refreshUser();
    await load();
  }

  return (
    <PageFrame>
      <div className="grid gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black">Point Shop</h1>
            <p className="mt-2 text-muted-foreground">포인트로 테마, 칭호, 프로필 장식, UI 커스터마이징을 해금합니다.</p>
          </div>
          <Badge className="w-fit border-primary/40 text-primary"><Gem size={14} /> {user?.points ?? 0} points</Badge>
        </div>
        {message && <div className="rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-primary">{message}</div>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="bg-card/85">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <ShoppingBag className="text-primary" />
                  <Badge>{item.category}</Badge>
                </div>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled={item.purchased || (user?.points ?? 0) < item.price_points} onClick={() => purchase(item.id)}>
                  {item.purchased ? "Owned" : `${item.price_points} points`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageFrame>
  );
}
