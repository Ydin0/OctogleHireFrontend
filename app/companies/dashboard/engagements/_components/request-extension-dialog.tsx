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

interface RequestExtensionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  engagementId: string;
  currentEndDate: string;
  token: string;
}

function RequestExtensionDialog({
  open,
  onOpenChange,
  engagementId,
  currentEndDate,
  token,
}: RequestExtensionDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [newEndDate, setNewEndDate] = useState("");
  const [reason, setReason] = useState("");

  const currentEndDateFormatted = new Date(currentEndDate).toISOString().split("T")[0];
  const minDate = new Date(new Date(currentEndDate).getTime() + 86400000)
    .toISOString()
    .split("T")[0];

  const handleSubmit = async () => {
    setError(null);

    if (!newEndDate) {
      setError("Please select a new end date.");
      return;
    }
    if (!reason.trim()) {
      setError("Please provide a reason.");
      return;
    }

    try {
      await createChangeRequest(token, engagementId, {
        type: "extension",
        reason: reason.trim(),
        requestedEffectiveDate: currentEndDateFormatted,
        requestedEndDate: newEndDate,
      });
      onOpenChange(false);
      setNewEndDate("");
      setReason("");
      toast.success("Extension request submitted");
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      toast.error("Failed to submit extension request");
      setError(err instanceof Error ? err.message : "Failed to submit request.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Extension</DialogTitle>
          <DialogDescription>
            Request to extend the end date of this engagement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current End Date</Label>
            <p className="font-mono text-sm font-medium">
              {new Date(currentEndDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-end-date">New End Date</Label>
            <DatePicker
              value={newEndDate ? new Date(newEndDate + "T00:00:00") : undefined}
              onChange={(d) => setNewEndDate(d ? d.toISOString().split("T")[0] : "")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extension-reason">Reason</Label>
            <Textarea
              id="extension-reason"
              placeholder="Why do you need to extend this engagement?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !reason.trim() || !newEndDate}
          >
            {isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { RequestExtensionDialog };
