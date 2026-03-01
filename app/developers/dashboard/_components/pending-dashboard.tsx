"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Circle,
  Clock3,
  FileText,
  HandCoins,
  Loader2,
  LogOut,
  X,
} from "lucide-react";
import { useClerk, useAuth } from "@clerk/nextjs";

import type { ApplicationTimelineItem } from "@/lib/developer-application";
import type { DeveloperOffer } from "@/lib/api/developer";
import { respondToDeveloperOffer } from "@/lib/api/developer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
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
  offers?: DeveloperOffer[];
}

function OfferSection({ offers }: { offers: DeveloperOffer[] }) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pendingOffers = offers.filter((o) => o.status === "pending");

  if (pendingOffers.length === 0) return null;

  const handleRespond = async (offerId: string, action: "accepted" | "declined") => {
    if (loadingId) return;
    setLoadingId(offerId);
    setError(null);
    try {
      const token = await getToken();
      await respondToDeveloperOffer(token, offerId, action);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {pendingOffers.map((offer) => {
        const isLoading = loadingId === offer.id;

        return (
          <Card key={offer.id} className="border-emerald-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <HandCoins className="size-4 text-emerald-600" />
                You have an offer
              </CardTitle>
              <CardDescription>
                Review the details below and accept to activate your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Hourly Rate
                  </p>
                  <p className="font-mono text-lg font-semibold">
                    {offer.currency} ${offer.hourlyRate.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Monthly Rate
                  </p>
                  <p className="font-mono text-lg font-semibold">
                    {offer.currency} ${offer.monthlyRate.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Engagement
                  </p>
                  <p className="text-sm font-medium capitalize">
                    {offer.engagementType}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Start Date
                  </p>
                  <p className="text-sm font-medium">{offer.startDate}</p>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={isLoading}
                  onClick={() => handleRespond(offer.id, "accepted")}
                >
                  {isLoading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  Accept Offer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => handleRespond(offer.id, "declined")}
                >
                  <X className="size-3.5" />
                  Decline
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Accepting will activate your profile on the marketplace and unlock the full dashboard.
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

const PendingDashboard = ({
  displayName,
  avatarUrl,
  status,
  timeline,
  offers = [],
}: PendingDashboardProps) => {
  const { signOut } = useClerk();

  const statusLabel = status
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

  const isOfferStage = status === "offer_extended";

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center text-foreground transition-colors hover:text-foreground/80">
            <Logo width={110} height={26} />
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

      <div className="container mx-auto max-w-3xl px-6 py-10 space-y-6">
        {isOfferStage && <OfferSection offers={offers} />}

        <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-pulse/30">
                <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>
                  {isOfferStage ? "Offer extended" : "Application in progress"}
                </CardTitle>
                <CardDescription>
                  {isOfferStage
                    ? "Accept the offer above to activate your account and access the full dashboard."
                    : `Current stage: ${statusLabel}. Full dashboard access unlocks once status is Approved.`}
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
