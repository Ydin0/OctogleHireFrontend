"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { EngagementChangeRequestAdmin } from "@/lib/api/engagement-change-requests";
import { reviewChangeRequest } from "@/lib/api/engagement-change-requests";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type ChangeRequestType,
  changeRequestTypeBadgeClass,
  changeRequestTypeLabel,
} from "../../_components/dashboard-data";
import { useAdminCurrency } from "../../_components/admin-currency-context";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: EngagementChangeRequestAdmin | null;
  token: string;
}

function ReviewDialog({ open, onOpenChange, request, token }: ReviewDialogProps) {
  const { formatDisplay } = useAdminCurrency();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [adminNotes, setAdminNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!request) return null;

  const handleAction = async (action: "approved" | "rejected") => {
    setError(null);
    try {
      await reviewChangeRequest(token, request.id, action, adminNotes.trim() || undefined);
      onOpenChange(false);
      setAdminNotes("");
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to review request.");
    }
  };

  const approvalWarning = () => {
    switch (request.type) {
      case "cancellation":
        return `This will cancel the engagement and set end date to ${request.requestedEffectiveDate}.`;
      case "hour_reduction":
        return `This will cap monthly hours to ${request.requestedMonthlyHours}h.`;
      case "extension":
        return `This will extend the engagement to ${request.requestedEndDate}.`;
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Change Request</DialogTitle>
          <DialogDescription>
            Review and approve or reject this engagement change request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Context */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Company</p>
              <p className="font-medium">{request.companyName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Developer</p>
              <p className="font-medium">{request.developerName}</p>
              <p className="text-xs text-muted-foreground">{request.developerRole}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Engagement</p>
              <p className="font-medium">{request.requirementTitle}</p>
              <p className="text-xs text-muted-foreground">{request.engagementType}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Billing Rate</p>
              <p className="font-mono font-medium">{formatDisplay(request.companyBillingRate, "USD")}/hr</p>
            </div>
          </div>

          <div className="rounded-md border p-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={changeRequestTypeBadgeClass(request.type as ChangeRequestType)}>
                {changeRequestTypeLabel[request.type as ChangeRequestType]}
              </Badge>
            </div>
            <p className="text-sm">{request.reason}</p>

            {request.type === "cancellation" && (
              <p className="mt-2 text-xs text-muted-foreground">
                Effective date: <span className="font-mono">{request.requestedEffectiveDate}</span>
              </p>
            )}
            {request.type === "hour_reduction" && (
              <p className="mt-2 text-xs text-muted-foreground">
                Requested hours: <span className="font-mono">{request.currentMonthlyHours}h &rarr; {request.requestedMonthlyHours}h</span>
              </p>
            )}
            {request.type === "extension" && (
              <p className="mt-2 text-xs text-muted-foreground">
                Requested end date: <span className="font-mono">{request.requestedEndDate}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-notes">Admin Notes (optional)</Label>
            <Textarea
              id="admin-notes"
              placeholder="Add notes for internal reference..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
            />
          </div>

          <p className="text-xs text-amber-600">{approvalWarning()}</p>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleAction("rejected")}
            disabled={isPending}
          >
            Reject
          </Button>
          <Button
            onClick={() => handleAction("approved")}
            disabled={isPending}
          >
            {isPending ? "Processing..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ReviewDialog };
