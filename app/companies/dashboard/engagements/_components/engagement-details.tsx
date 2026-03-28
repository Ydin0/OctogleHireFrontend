"use client";

import { useEffect, useState } from "react";
import { Clock, FileText, AlertCircle, MessageSquarePlus } from "lucide-react";

import type {
  CompanyEngagement,
  CompanyTimeEntry,
  EngagementChangeRequest,
} from "@/lib/api/companies";
import {
  fetchEngagementTimeEntries,
  fetchEngagementChangeRequests,
} from "@/lib/api/companies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequestCancellationDialog } from "./request-cancellation-dialog";
import { RequestHourChangeDialog } from "./request-hour-change-dialog";
import { RequestExtensionDialog } from "./request-extension-dialog";
import { DeveloperOnboardingChecklist } from "./developer-onboarding-checklist";
import { useReviews } from "@/lib/reviews/use-reviews";
import { ReviewDialog } from "@/app/companies/dashboard/_components/review-dialog";
import { DeveloperReviewsDisplay } from "@/app/companies/dashboard/_components/developer-reviews-display";

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

const changeRequestTypeBadge = (type: string) => {
  switch (type) {
    case "cancellation":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    case "hour_reduction":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "extension":
      return "bg-blue-500/10 text-blue-600 border-blue-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

const changeRequestStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "rejected":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

const timeEntryStatusBadge = (status: string) => {
  switch (status) {
    case "submitted":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "rejected":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

const typeLabel: Record<string, string> = {
  cancellation: "Cancellation",
  hour_reduction: "Hour Reduction",
  extension: "Extension",
};

interface EngagementDetailsProps {
  engagement: CompanyEngagement;
  token: string;
  companyId?: string;
  companyName?: string;
  companyLogoUrl?: string | null;
}

function EngagementDetails({ engagement, token, companyId, companyName, companyLogoUrl }: EngagementDetailsProps) {
  const [timeEntries, setTimeEntries] = useState<CompanyTimeEntry[] | null>(null);
  const [changeRequests, setChangeRequests] = useState<EngagementChangeRequest[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [hourDialogOpen, setHourDialogOpen] = useState(false);
  const [extensionDialogOpen, setExtensionDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const { reviews, addReview, updateReview, deleteReview, hasCompanyReviewed, getCompanyReview } = useReviews(engagement.developerId);
  const existingCompanyReview = companyId ? getCompanyReview(companyId) : null;
  const [editingReview, setEditingReview] = useState<import("@/lib/reviews/types").DeveloperReview | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [te, cr] = await Promise.all([
          fetchEngagementTimeEntries(token, engagement.id),
          fetchEngagementChangeRequests(token, engagement.id),
        ]);
        if (!cancelled) {
          setTimeEntries(te);
          setChangeRequests(cr);
        }
      } catch {
        // Silently fail, show empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token, engagement.id]);

  const effectiveHours = engagement.monthlyHoursCap ?? engagement.monthlyHoursExpected;
  const pendingTypes = new Set(
    (changeRequests ?? []).filter((cr) => cr.status === "pending").map((cr) => cr.type),
  );

  const startDate = engagement.startDate
    ? new Date(engagement.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";
  const endDate = engagement.endDate
    ? new Date(engagement.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Ongoing";

  if (loading) {
    return (
      <div className="px-4 py-6 text-sm text-muted-foreground">Loading details...</div>
    );
  }

  return (
    <div className="space-y-6 px-4 pb-4 pt-2">
      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Type</p>
          <p className="text-sm font-medium">{engagement.engagementType}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Billing Rate</p>
          <p className="font-mono text-sm font-medium">{formatCurrency(engagement.companyBillingRate, engagement.currency)}/hr</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Start Date</p>
          <p className="text-sm font-medium">{startDate}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">End Date</p>
          <p className="text-sm font-medium">{endDate}</p>
        </div>
        {effectiveHours !== null && effectiveHours !== undefined && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly Hours</p>
            <p className="font-mono text-sm font-medium">
              {effectiveHours}h
              {engagement.monthlyHoursCap !== null &&
                engagement.monthlyHoursCap !== undefined &&
                engagement.monthlyHoursExpected !== null &&
                engagement.monthlyHoursExpected !== undefined &&
                engagement.monthlyHoursCap !== engagement.monthlyHoursExpected && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (was {engagement.monthlyHoursExpected}h)
                  </span>
                )}
            </p>
          </div>
        )}
        {engagement.currentMonthTimeEntry && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Current Month</p>
            <p className="text-sm font-medium">
              <span className="font-mono">{engagement.currentMonthTimeEntry.hours}h</span>
              {effectiveHours && (
                <span className="text-muted-foreground"> / {effectiveHours}h</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Developer Onboarding Checklist */}
      <DeveloperOnboardingChecklist
        engagementId={engagement.id}
        engagementStatus={engagement.status}
        token={token}
      />

      {/* Time Entry History */}
      {timeEntries && timeEntries.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Clock className="size-3.5 text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Time Entry History</p>
          </div>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium">Period</th>
                  <th className="px-3 py-2 text-left font-medium">Hours</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-0">
                    <td className="px-3 py-2 font-mono">{entry.period}</td>
                    <td className="px-3 py-2 font-mono">{entry.hours}h</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className={timeEntryStatusBadge(entry.status)}>
                        {entry.status}
                      </Badge>
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-2 text-muted-foreground">
                      {entry.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Change Requests */}
      {changeRequests && changeRequests.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <FileText className="size-3.5 text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Change Requests</p>
          </div>
          <div className="space-y-2">
            {changeRequests.map((cr) => (
              <div key={cr.id} className="rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={changeRequestTypeBadge(cr.type)}>
                    {typeLabel[cr.type] ?? cr.type}
                  </Badge>
                  <Badge variant="outline" className={changeRequestStatusBadge(cr.status)}>
                    {cr.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(cr.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{cr.reason}</p>
                {cr.type === "hour_reduction" && cr.requestedMonthlyHours && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Requested: <span className="font-mono">{cr.requestedMonthlyHours}h/mo</span>
                  </p>
                )}
                {cr.type === "extension" && cr.requestedEndDate && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Requested end date: <span className="font-mono">{cr.requestedEndDate}</span>
                  </p>
                )}
                {cr.adminNotes && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Admin notes: {cr.adminNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {engagement.status === "active" && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <AlertCircle className="size-3.5 text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Actions</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelDialogOpen(true)}
              disabled={pendingTypes.has("cancellation")}
            >
              {pendingTypes.has("cancellation") ? "Cancellation Pending" : "Request Cancellation"}
            </Button>

            {effectiveHours !== null && effectiveHours !== undefined && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHourDialogOpen(true)}
                disabled={pendingTypes.has("hour_reduction")}
              >
                {pendingTypes.has("hour_reduction") ? "Hour Change Pending" : "Request Hour Reduction"}
              </Button>
            )}

            {engagement.endDate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExtensionDialogOpen(true)}
                disabled={pendingTypes.has("extension")}
              >
                {pendingTypes.has("extension") ? "Extension Pending" : "Request Extension"}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <RequestCancellationDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        engagementId={engagement.id}
        token={token}
      />

      {effectiveHours !== null && effectiveHours !== undefined && (
        <RequestHourChangeDialog
          open={hourDialogOpen}
          onOpenChange={setHourDialogOpen}
          engagementId={engagement.id}
          currentHours={effectiveHours}
          token={token}
        />
      )}

      {engagement.endDate && (
        <RequestExtensionDialog
          open={extensionDialogOpen}
          onOpenChange={setExtensionDialogOpen}
          engagementId={engagement.id}
          currentEndDate={engagement.endDate}
          token={token}
        />
      )}

      {/* Review Section for ended engagements */}
      {engagement.status === "ended" && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="size-3.5 text-muted-foreground" />
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Developer Review</p>
            </div>
            {existingCompanyReview ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setEditingReview(existingCompanyReview);
                  setReviewDialogOpen(true);
                }}
              >
                <MessageSquarePlus className="size-3.5" />
                Edit Review
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setEditingReview(null);
                  setReviewDialogOpen(true);
                }}
              >
                <MessageSquarePlus className="size-3.5" />
                Leave Review
              </Button>
            )}
          </div>
          {reviews.length > 0 ? (
            <DeveloperReviewsDisplay
              reviews={reviews}
              ownCompanyId={companyId}
              onEdit={(review) => {
                setEditingReview(review);
                setReviewDialogOpen(true);
              }}
              onDelete={(reviewId) => deleteReview(reviewId)}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No reviews yet. Share your experience with this developer.
            </p>
          )}
          <ReviewDialog
            open={reviewDialogOpen}
            onOpenChange={setReviewDialogOpen}
            developerName={engagement.developerName}
            mode={editingReview ? "edit" : "create"}
            initialValues={editingReview ? { rating: editingReview.rating, tags: editingReview.tags, text: editingReview.text } : undefined}
            onSubmit={(data) => {
              if (editingReview) {
                updateReview(editingReview.id, data);
              } else {
                addReview({ ...data, engagementId: engagement.id, companyId, companyName, companyLogoUrl });
              }
              setEditingReview(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

export { EngagementDetails };
