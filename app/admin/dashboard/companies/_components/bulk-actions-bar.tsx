"use client";

import { useState, useTransition } from "react";

import type { CompanyStatus } from "@/app/admin/dashboard/_components/dashboard-data";
import { companyStatusLabel } from "@/app/admin/dashboard/_components/dashboard-data";
import { updateCompanyStatus } from "@/lib/api/companies";
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

const ALL_COMPANY_STATUSES: CompanyStatus[] = [
  "enquired",
  "pending",
  "contacted",
  "active",
  "inactive",
];

interface BulkActionsBarProps {
  selectedIds: string[];
  token: string;
  onComplete: () => void;
}

function BulkActionsBar({
  selectedIds,
  token,
  onComplete,
}: BulkActionsBarProps) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("");

  const handleBulkUpdate = async () => {
    if (!status) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          updateCompanyStatus(token, id, status as CompanyStatus),
        ),
      );

      setDialogOpen(false);
      setStatus("");
      startTransition(() => {
        onComplete();
      });
    } catch {
      // Error handling kept simple
    }
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
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            setStatus("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Status Change</DialogTitle>
            <DialogDescription>
              Update status for {selectedIds.length} selected company
              {selectedIds.length > 1 ? "ies" : "y"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">New Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                {ALL_COMPANY_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {companyStatusLabel[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setStatus("");
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
