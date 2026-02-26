"use client";

import Link from "next/link";
import { Circle, Clock3, FileText, Globe, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import type { ApplicationTimelineItem } from "@/lib/developer-application";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

interface PendingDashboardProps {
  displayName: string;
  avatarUrl: string | null;
  status: string;
  timeline: ApplicationTimelineItem[];
}

const PendingDashboard = ({
  displayName,
  avatarUrl,
  status,
  timeline,
}: PendingDashboardProps) => {
  const { signOut } = useClerk();

  const statusLabel = status
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 text-foreground transition-colors hover:text-foreground/80">
            <Globe className="size-5" />
            <span className="text-sm font-semibold">OctogleHire</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="size-7 border border-pulse/30">
                <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                <AvatarFallback className="text-[10px]">{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{displayName}</span>
            </div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              <LogOut className="size-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-6 py-10">
        <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-pulse/30">
                <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Application in progress</CardTitle>
                <CardDescription>
                  Current stage: {statusLabel}. Full dashboard access unlocks once
                  status is Approved.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {timeline.map((step, index) => (
              <div key={step.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex size-7 items-center justify-center rounded-full ${
                      step.state === "completed"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : step.state === "active"
                          ? "bg-pulse/15 text-pulse"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.state === "active" ? (
                      <Clock3 className="size-3.5" />
                    ) : (
                      <Circle className="size-3.5" />
                    )}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="my-1 w-0.5 flex-1 bg-border" />
                  )}
                </div>
                <p className="pt-1 text-sm">{step.label}</p>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/apply/status">
                  <FileText className="size-4" />
                  Open detailed status
                </Link>
              </Button>
              <Button asChild className="bg-pulse text-pulse-foreground hover:bg-pulse/90">
                <Link href="/apply">Update application</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export { PendingDashboard };
