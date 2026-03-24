"use client";

import { useState, useTransition } from "react";

import { toast } from "sonner";
import { fetchWithRetry } from "@/lib/api/fetch-with-retry";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ALL_STATUSES,
  applicationStatusLabel,
} from "../../_components/dashboard-data";

interface BulkActionsBarProps {
  selectedIds: string[];
  token: string;
  onComplete: () => void;
}

function BulkActionsBar({ selectedIds, token, onComplete }: BulkActionsBarProps) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleBulkUpdate = async () => {
    if (!status) return;
    setError(null);

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

    try {
      const response = await fetchWithRetry(
        `${apiBaseUrl}/api/admin/applications/bulk/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: selectedIds,
            status,
            note: note.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Failed to update status");
      }

      setDialogOpen(false);
      setStatus("");
      setNote("");
      setError(null);
      toast.success(`Status updated for ${selectedIds.length} applicant${selectedIds.length > 1 ? "s" : ""}`);
      startTransition(() => {
        onComplete();
      });
    } catch (err) {
      toast.error("Failed to update status");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleReject = () => {
    setStatus("rejected");
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-2.5">
        <span className="text-sm font-medium">
          {selectedIds.length} selected
        </span>
        <div className="h-4 w-px bg-border" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDialogOpen(true)}
        >
          Change Status
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-600"
          onClick={handleReject}
        >
          Reject
        </Button>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            setStatus("");
            setNote("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Status Change</DialogTitle>
            <DialogDescription>
              Update status for {selectedIds.length} selected applicant
              {selectedIds.length > 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">New Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {applicationStatusLabel[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Note <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                placeholder="Reason for status change..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setStatus("");
                setNote("");
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkUpdate}
              disabled={isPending || !status}
            >
              {isPending ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { BulkActionsBar };
