"use client";

import { useState } from "react";
import { Check, Loader2, Unplug } from "lucide-react";

import type { CalendarConnection } from "@/lib/api/companies";
import { startCalendarConnect, disconnectCalendar } from "@/lib/api/companies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CalendarConnectionCardProps {
  connection: CalendarConnection;
  token: string;
  onConnectionChange: () => void;
}

export function CalendarConnectionCard({
  connection,
  token,
  onConnectionChange,
}: CalendarConnectionCardProps) {
  const [connecting, setConnecting] = useState<"google" | "microsoft" | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleConnect = async (provider: "google" | "microsoft") => {
    setConnecting(provider);
    const result = await startCalendarConnect(token, provider);
    if (result?.authUrl) {
      window.location.href = result.authUrl;
    }
    setConnecting(null);
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    await disconnectCalendar(token);
    onConnectionChange();
    setDisconnecting(false);
  };

  if (connection.connected) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
              <Check className="size-5 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Calendar Connected</p>
                <Badge variant="outline" className="text-[10px] capitalize">
                  {connection.provider}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{connection.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            disabled={disconnecting}
          >
            {disconnecting ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Unplug className="mr-1.5 size-3.5" />
            )}
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <svg className="size-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold">Connect Your Calendar</h3>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          Sync your Google or Microsoft calendar to show busy times and
          auto-create meeting invites for interviews.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleConnect("google")}
            disabled={!!connecting}
          >
            {connecting === "google" && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
            Connect Google Calendar
          </Button>
          <Button
            variant="outline"
            onClick={() => handleConnect("microsoft")}
            disabled={!!connecting}
          >
            {connecting === "microsoft" && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
            Connect Microsoft Outlook
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
