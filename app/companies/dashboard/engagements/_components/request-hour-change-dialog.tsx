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

interface RequestHourChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  engagementId: string;
  currentHours: number;
  token: string;
}

function RequestHourChangeDialog({
  open,
  onOpenChange,
  engagementId,
  currentHours,
  token,
}: RequestHourChangeDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [newHours, setNewHours] = useState("");
  const [reason, setReason] = useState("");

  // Default effective month = next month
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const defaultEffective = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-01`;

  const [effectiveDate, setEffectiveDate] = useState(defaultEffective);

  const handleSubmit = async () => {
    setError(null);

    const hours = parseInt(newHours, 10);
    if (!hours || hours <= 0) {
      setError("New hours must be greater than 0.");
      return;
    }
    if (hours >= currentHours) {
      setError(`New hours must be less than current (${currentHours}h).`);
      return;
    }
    if (!reason.trim()) {
      setError("Please provide a reason.");
      return;
    }

    try {
      await createChangeRequest(token, engagementId, {
        type: "hour_reduction",
        reason: reason.trim(),
        requestedEffectiveDate: effectiveDate,
        requestedMonthlyHours: hours,
      });
      onOpenChange(false);
      setNewHours("");
      setReason("");
      toast.success("Hour change request submitted");
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      toast.error("Failed to submit hour change request");
      setError(err instanceof Error ? err.message : "Failed to submit request.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Hour Reduction</DialogTitle>
          <DialogDescription>
            Request to reduce the monthly hours for this engagement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current Monthly Hours</Label>
            <p className="font-mono text-sm font-medium">{currentHours}h</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-hours">New Monthly Hours</Label>
            <Input
              id="new-hours"
              type="number"
              placeholder="e.g. 80"
              value={newHours}
              onChange={(e) => setNewHours(e.target.value)}
              min={1}
              max={currentHours - 1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hour-reason">Reason</Label>
            <Textarea
              id="hour-reason"
              placeholder="Why do you need to reduce hours?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hour-effective">Effective From</Label>
            <Input
              id="hour-effective"
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              min={defaultEffective}
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
            disabled={isPending || !reason.trim() || !newHours}
          >
            {isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { RequestHourChangeDialog };
