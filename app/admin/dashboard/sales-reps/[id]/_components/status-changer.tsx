"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateSalesRepApplicationStatus } from "@/lib/api/admin-sales-rep";
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
  type SalesRepApplicationStatus,
  SALES_REP_ALL_STATUSES,
  salesRepApplicationStatusLabel,
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
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
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

    try {
      const result = await updateSalesRepApplicationStatus(
        token,
        applicationId,
        selectedStatus,
        note.trim() || undefined
      );

      if (!result) {
        throw new Error("Failed to update status");
      }

      toast.success(
        `Status changed to ${
          salesRepApplicationStatusLabel[
            selectedStatus as SalesRepApplicationStatus
          ] ?? selectedStatus
        }`
      );
      setDialogOpen(false);
      setNote("");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedStatus(currentStatus);
    setDialogOpen(false);
    setNote("");
    setError(null);
  };

  return (
    <>
      <Select value={currentStatus} onValueChange={handleStatusSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Change status" />
        </SelectTrigger>
        <SelectContent>
          {SALES_REP_ALL_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {salesRepApplicationStatusLabel[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Change status to{" "}
              {salesRepApplicationStatusLabel[
                selectedStatus as SalesRepApplicationStatus
              ] ?? selectedStatus}
              ?
            </DialogTitle>
            <DialogDescription>
              Add an optional note explaining the change. The applicant will not
              see this note.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note..."
            rows={3}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button variant="ghost" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="rounded-full"
            >
              {isLoading ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { StatusChanger };
