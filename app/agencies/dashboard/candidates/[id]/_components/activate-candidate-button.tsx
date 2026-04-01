"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface ActivateCandidateButtonProps {
  candidateId: string;
  token: string;
  hasAccount: boolean;
  hasValidEmail: boolean;
}

export function ActivateCandidateButton({
  candidateId,
  token,
  hasAccount,
  hasValidEmail,
}: ActivateCandidateButtonProps) {
  const router = useRouter();
  const [activating, setActivating] = useState(false);

  if (hasAccount) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
        <UserCheck className="size-3.5" />
        Account Active
      </div>
    );
  }

  async function handleActivate() {
    setActivating(true);
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/agencies/candidates/${candidateId}/activate`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.message ?? "Failed to activate account");
        return;
      }

      toast.success("Account activated — login email sent to candidate");
      router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setActivating(false);
    }
  }

  return (
    <Button
      variant="default"
      size="sm"
      className="rounded-full"
      disabled={activating || !hasValidEmail}
      onClick={handleActivate}
      title={!hasValidEmail ? "Candidate needs a valid email first" : undefined}
    >
      <UserCheck className="mr-1.5 size-3.5" />
      {activating ? "Activating..." : "Activate Account"}
    </Button>
  );
}
