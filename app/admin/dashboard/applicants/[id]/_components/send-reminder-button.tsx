"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2, MessageSquareWarning } from "lucide-react";
import { fetchWithRetry } from "@/lib/api/fetch-with-retry";

import { Button } from "@/components/ui/button";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface SendReminderButtonProps {
  applicationId: string;
  status: string;
}

export function SendReminderButton({
  applicationId,
  status,
}: SendReminderButtonProps) {
  const { getToken } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (status !== "draft") return null;

  const handleSend = async () => {
    setSending(true);
    try {
      const token = await getToken();
      const res = await fetchWithRetry(
        `${apiBaseUrl}/api/admin/applications/${applicationId}/send-reminder`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setSent(true);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      disabled={sending || sent}
      onClick={handleSend}
    >
      {sending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <MessageSquareWarning className="size-3.5" />
      )}
      {sent ? "Reminder Sent" : "Send Reminder"}
    </Button>
  );
}
