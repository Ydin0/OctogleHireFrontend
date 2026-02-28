"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

import type { Payout } from "@/lib/api/payouts";
import { updatePayoutStatus } from "@/lib/api/payouts";
import {
  type PayoutStatus,
  payoutStatusLabel,
  formatDate,
} from "../../../_components/dashboard-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const allPayoutStatuses: PayoutStatus[] = [
  "pending",
  "approved",
  "processing",
  "paid",
  "cancelled",
];

interface PayoutActionsProps {
  payout: Payout;
  token: string;
  onStatusChange: (updated: Payout) => void;
}

function PayoutActions({ payout, token, onStatusChange }: PayoutActionsProps) {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    const updated = await updatePayoutStatus(
      token,
      payout.id,
      newStatus as PayoutStatus,
    );
    if (updated) {
      onStatusChange(updated);
    } else {
      onStatusChange({ ...payout, status: newStatus as PayoutStatus });
    }
    setUpdating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Status
          </p>
          <Select
            value={payout.status}
            onValueChange={handleStatusChange}
            disabled={updating}
          >
            <SelectTrigger className="w-full">
              {updating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SelectValue />
              )}
            </SelectTrigger>
            <SelectContent>
              {allPayoutStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {payoutStatusLabel[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full gap-2" asChild>
          <a
            href={`/api/payouts/${payout.id}/pdf`}
            download={`${payout.payoutNumber}.pdf`}
          >
            <Download className="size-4" />
            Download PDF Payslip
          </a>
        </Button>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Period</span>
            <span className="font-medium">
              {formatDate(payout.periodStart)} – {formatDate(payout.periodEnd)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Developer</span>
            <span className="font-medium">{payout.developerEmail}</span>
          </div>
          {payout.paidAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid On</span>
              <span className="font-medium">
                {formatDate(payout.paidAt)}
              </span>
            </div>
          )}
        </div>

        {payout.notes && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Notes
              </p>
              <p className="text-sm text-muted-foreground">{payout.notes}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { PayoutActions };
