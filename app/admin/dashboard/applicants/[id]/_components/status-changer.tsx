"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  type ApplicationStatus,
  ALL_STATUSES,
  applicationStatusLabel,
} from "../../../_components/dashboard-data";

interface StatusChangerProps {
  applicationId: string;
  currentStatus: string;
  token: string;
}

function StatusChanger({
  applicationId,
  currentStatus,
  token,
}: StatusChangerProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusSelect = (value: string) => {
    if (value !== currentStatus) {
      setSelectedStatus(value);
      setError(null);
      setDialogOpen(true);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
            note: note.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(payload?.message ?? "Failed to update status");
      }

      setDialogOpen(false);
      setNote("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedStatus(currentStatus);
    setNote("");
  };

  return (
    <div id="status">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
        Pipeline Status
      </p>
      <Select value={currentStatus} onValueChange={handleStatusSelect}>
        <SelectTrigger className="w-[240px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ALL_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {applicationStatusLabel[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Application Status</DialogTitle>
            <DialogDescription>
              Moving from{" "}
              <span className="font-medium text-foreground">
                {applicationStatusLabel[currentStatus as ApplicationStatus]}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {applicationStatusLabel[selectedStatus as ApplicationStatus]}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Add an optional note for this status change:
            </p>
            <Textarea
              placeholder="Reason for status change..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { StatusChanger };
