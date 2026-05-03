"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toggleSalesRepApplicationLive } from "@/lib/api/admin-sales-rep";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LiveToggleProps {
  applicationId: string;
  isLive: boolean;
  status: string;
  token: string;
}

function LiveToggle({ applicationId, isLive, status, token }: LiveToggleProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(isLive);
  const [pending, setPending] = useState(false);

  const handleToggle = async (checked: boolean) => {
    if (checked && status !== "approved") {
      toast.error("Only approved applications can go live");
      return;
    }
    setOptimistic(checked);
    setPending(true);
    try {
      const result = await toggleSalesRepApplicationLive(
        token,
        applicationId,
        checked
      );
      if (!result) throw new Error("Failed to update");
      toast.success(checked ? "Now visible on marketplace" : "Hidden from marketplace");
      startTransition(() => router.refresh());
    } catch (err) {
      setOptimistic(!checked);
      const msg = err instanceof Error ? err.message : "Failed to update";
      toast.error(msg);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Switch
        id="live-toggle"
        checked={optimistic}
        onCheckedChange={handleToggle}
        disabled={pending || status !== "approved"}
      />
      <Label htmlFor="live-toggle" className="text-sm">
        {optimistic ? "Visible on marketplace" : "Hidden"}
      </Label>
    </div>
  );
}

export { LiveToggle };
