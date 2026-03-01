"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Check, Loader2, X } from "lucide-react";

import type { DeveloperOffer } from "@/lib/api/developer";
import { respondToDeveloperOffer } from "@/lib/api/developer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-500/35 bg-amber-500/10 text-amber-600",
  accepted: "border-emerald-500/35 bg-emerald-500/10 text-emerald-600",
  declined: "border-red-500/35 bg-red-500/10 text-red-600",
};

export function OffersClient({ offers }: { offers: DeveloperOffer[] }) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRespond = async (offerId: string, action: "accepted" | "declined") => {
    setLoadingId(offerId);
    try {
      const token = await getToken();
      await respondToDeveloperOffer(token, offerId, action);
      router.refresh();
    } catch {
      // Silently handle — page will refresh
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Offers</CardTitle>
          <CardDescription>
            Review and respond to offers from the OctogleHire team.
          </CardDescription>
        </CardHeader>
      </Card>

      {offers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No offers yet. You will be notified when an offer is made.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {offers.map((offer) => {
          const isLoading = loadingId === offer.id;

          return (
            <Card key={offer.id}>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{offer.engagementType}</Badge>
                      <Badge
                        variant="outline"
                        className={STATUS_STYLES[offer.status] ?? ""}
                      >
                        {offer.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-baseline gap-4">
                      <div>
                        <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                          Hourly Rate
                        </p>
                        <p className="text-lg font-semibold font-mono">
                          {offer.currency} ${offer.hourlyRate.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                          Monthly Rate
                        </p>
                        <p className="text-lg font-semibold font-mono">
                          {offer.currency} ${offer.monthlyRate.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Start: {offer.startDate}</span>
                      <span>Offered: {new Date(offer.createdAt).toLocaleDateString()}</span>
                      {offer.respondedAt && (
                        <span>Responded: {new Date(offer.respondedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {offer.status === "pending" && (
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Check className="size-3.5" />
                            )}
                            Accept
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Accept this offer?</AlertDialogTitle>
                            <AlertDialogDescription>
                              By accepting, your application status will be updated to approved and your profile will go live on the marketplace.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRespond(offer.id, "accepted")}
                              className="bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              Confirm Accept
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isLoading}
                          >
                            <X className="size-3.5" />
                            Decline
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Decline this offer?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to decline this offer? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRespond(offer.id, "declined")}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Confirm Decline
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
