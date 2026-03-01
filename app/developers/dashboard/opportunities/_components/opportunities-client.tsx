"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Briefcase, Check, Clock, Globe, Loader2, MapPin, X } from "lucide-react";

import type { DeveloperOpportunity } from "@/lib/api/developer";
import { respondToDeveloperOpportunity } from "@/lib/api/developer";
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
import { Textarea } from "@/components/ui/textarea";

const STATUS_STYLES: Record<string, string> = {
  proposed: "border-amber-500/35 bg-amber-500/10 text-amber-600",
  accepted: "border-emerald-500/35 bg-emerald-500/10 text-emerald-600",
  declined: "border-red-500/35 bg-red-500/10 text-red-600",
};

function formatExperienceRange(min: number | null, max: number | null) {
  if (min != null && max != null) return `${min}–${max} years`;
  if (min != null) return `${min}+ years`;
  if (max != null) return `Up to ${max} years`;
  return null;
}

export function OpportunitiesClient({
  opportunities,
}: {
  opportunities: DeveloperOpportunity[];
}) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  const handleRespond = async (
    matchId: string,
    action: "accepted" | "declined",
    rejectionReason?: string,
  ) => {
    setLoadingId(matchId);
    try {
      const token = await getToken();
      await respondToDeveloperOpportunity(token, matchId, action, rejectionReason);
      setDeclineReason("");
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
          <CardTitle>Opportunities</CardTitle>
          <CardDescription>
            Proposed matches from the OctogleHire team based on your profile.
          </CardDescription>
        </CardHeader>
      </Card>

      {opportunities.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No opportunities yet. Complete your profile to get matched with roles.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {opportunities.map((opp) => {
          const isLoading = loadingId === opp.id;
          const expRange = formatExperienceRange(opp.experienceYearsMin, opp.experienceYearsMax);

          return (
            <Card key={opp.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{opp.requirementTitle}</CardTitle>
                    <CardDescription>{opp.companyName}</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={STATUS_STYLES[opp.status] ?? ""}
                  >
                    {opp.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {opp.requirementDescription && (
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {opp.requirementDescription}
                  </p>
                )}

                {opp.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {opp.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase className="size-3.5 shrink-0" />
                    <span className="capitalize">{opp.engagementType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-3.5 shrink-0" />
                    <span className="capitalize">{opp.experienceLevel}</span>
                  </div>
                  {opp.companyLocation && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      <span>{opp.companyLocation}</span>
                    </div>
                  )}
                  {opp.timezonePreference && opp.timezonePreference !== "any" && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Globe className="size-3.5 shrink-0" />
                      <span>{opp.timezonePreference}</span>
                    </div>
                  )}
                </div>

                {(expRange || opp.startDate) && (
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {expRange && <span>Experience: {expRange}</span>}
                    {opp.startDate && <span>Start: {opp.startDate}</span>}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Proposed: {new Date(opp.proposedAt).toLocaleDateString()}</span>
                  {opp.respondedAt && (
                    <span>Responded: {new Date(opp.respondedAt).toLocaleDateString()}</span>
                  )}
                </div>

                {opp.status === "proposed" && (
                  <div className="flex gap-2 pt-1">
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
                          Interested
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Express interest?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will notify the team that you are interested in this opportunity. They will follow up with next steps.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRespond(opp.id, "accepted")}
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            Confirm Interest
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
                          <AlertDialogTitle>Decline this opportunity?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Optionally provide a reason so the team can better match you in the future.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="px-6">
                          <Textarea
                            placeholder="Reason (optional)"
                            rows={3}
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeclineReason("")}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleRespond(opp.id, "declined", declineReason || undefined)
                            }
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Confirm Decline
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
