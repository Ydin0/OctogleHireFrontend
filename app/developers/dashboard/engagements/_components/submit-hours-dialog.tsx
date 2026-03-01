"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

import type { DeveloperEngagement } from "@/lib/api/developer";
import { submitTimeEntry } from "@/lib/api/developer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SubmitHoursDialogProps {
  engagement: DeveloperEngagement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

function SubmitHoursDialog({
  engagement,
  open,
  onOpenChange,
  onSubmitted,
}: SubmitHoursDialogProps) {
  const { getToken } = useAuth();

  const now = new Date();
  const defaultPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [period, setPeriod] = useState(defaultPeriod);
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedHours = parseFloat(hours);
    if (!parsedHours || parsedHours <= 0) {
      setError("Please enter valid hours.");
      return;
    }

    if (!/^\d{4}-\d{2}$/.test(period)) {
      setError("Period must be in YYYY-MM format.");
      return;
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      await submitTimeEntry(token, {
        engagementId: engagement.id,
        hours: parsedHours,
        period,
        description: description.trim() || undefined,
      });

      setHours("");
      setDescription("");
      setPeriod(defaultPeriod);
      onOpenChange(false);
      onSubmitted();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit time entry.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Hours</DialogTitle>
          <DialogDescription>
            {engagement.companyName} &middot; {engagement.requirementTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Input
              id="period"
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Hours</Label>
            <Input
              id="hours"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 160"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Work summary for this period..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Hours"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { SubmitHoursDialog };
