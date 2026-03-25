"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { createChangeRequest } from "@/lib/api/companies";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

interface RequestCancellationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  engagementId: string;
  token: string;
}

function RequestCancellationDialog({
  open,
  onOpenChange,
  engagementId,
  token,
}: RequestCancellationDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Default to end of current month
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const defaultDate = lastDay.toISOString().split("T")[0];

  const [reason, setReason] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(defaultDate);

  const handleSubmit = async () => {
    setError(null);

    if (!reason.trim()) {
      setError("Please provide a reason.");
      return;
    }

    try {
      await createChangeRequest(token, engagementId, {
        type: "cancellation",
        reason: reason.trim(),
        requestedEffectiveDate: effectiveDate,
      });
      onOpenChange(false);
      setReason("");
      toast.success("Cancellation request submitted");
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      toast.error("Failed to submit cancellation request");
      setError(err instanceof Error ? err.message : "Failed to submit request.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Cancellation</DialogTitle>
          <DialogDescription>
            Submit a request to cancel this engagement. This will be reviewed by our team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cancellation-reason">Reason</Label>
            <Textarea
              id="cancellation-reason"
              placeholder="Why do you want to cancel this engagement?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancellation-date">Effective Date</Label>
            <DatePicker
              value={effectiveDate ? new Date(effectiveDate + "T00:00:00") : undefined}
              onChange={(d) => setEffectiveDate(d ? d.toISOString().split("T")[0] : "")}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            This request will be reviewed by our team. The engagement continues until approved.
          </p>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isPending || !reason.trim()}
          >
            {isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { RequestCancellationDialog };
