"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type ApplicationStatus,
  applicationStatusLabel,
} from "@/app/admin/dashboard/_components/dashboard-data";

const SAVED_STATUSES = ["prospected", "contacted", "interviewing", "rejected"] as const;

interface AgencyStatusChangerProps {
  candidateId: string;
  currentStatus: string;
  sourceTable: "application" | "saved";
  token: string;
}

function AgencyStatusChanger({
  candidateId,
  currentStatus,
  sourceTable,
  token,
}: AgencyStatusChangerProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statuses = sourceTable === "saved" ? SAVED_STATUSES : SAVED_STATUSES;

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
        `${apiBaseUrl}/api/agencies/candidates/${candidateId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: selectedStatus, sourceTable }),
        }
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Failed to update status");
      }

      setDialogOpen(false);
      toast.success("Status updated successfully");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedStatus(currentStatus);
  };

  return (
    <div id="status">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
        Status
      </p>
      <Select value={currentStatus} onValueChange={handleStatusSelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {applicationStatusLabel[status as ApplicationStatus] ?? status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Candidate Status</DialogTitle>
            <DialogDescription>
              Moving from{" "}
              <span className="font-medium text-foreground">
                {applicationStatusLabel[currentStatus as ApplicationStatus] ?? currentStatus}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {applicationStatusLabel[selectedStatus as ApplicationStatus] ?? selectedStatus}
              </span>
            </DialogDescription>
          </DialogHeader>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { AgencyStatusChanger };
