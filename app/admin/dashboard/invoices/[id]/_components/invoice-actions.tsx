"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, Trash2 } from "lucide-react";

import { toast } from "sonner";
import type { Invoice } from "@/lib/api/invoices";
import { updateInvoiceStatus, deleteInvoice } from "@/lib/api/invoices";
import {
  type InvoiceStatus,
  invoiceStatusLabel,
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

const allInvoiceStatuses: InvoiceStatus[] = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
];

interface InvoiceActionsProps {
  invoice: Invoice;
  token: string;
  isSuperAdmin?: boolean;
  onStatusChange: (updated: Invoice) => void;
}

function InvoiceActions({ invoice, token, isSuperAdmin, onStatusChange }: InvoiceActionsProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const updated = await updateInvoiceStatus(
        token,
        invoice.id,
        newStatus as InvoiceStatus,
      );
      if (updated) {
        onStatusChange(updated);
      } else {
        onStatusChange({ ...invoice, status: newStatus as InvoiceStatus });
      }
      toast.success("Invoice status updated");
    } catch {
      toast.error("Failed to update invoice status");
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
            value={invoice.status}
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
              {allInvoiceStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {invoiceStatusLabel[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full gap-2" asChild>
          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            download={`${invoice.invoiceNumber}.pdf`}
          >
            <Download className="size-4" />
            Download PDF
          </a>
        </Button>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Due Date</span>
            <span className="font-medium">{formatDate(invoice.dueDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Terms</span>
            <span className="font-medium">Net 30</span>
          </div>
          {invoice.paidAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid On</span>
              <span className="font-medium">
                {formatDate(invoice.paidAt)}
              </span>
            </div>
          )}
        </div>

        {invoice.notes && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Notes
              </p>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          </>
        )}

        {isSuperAdmin && (
          <>
            <Separator />
            <Button
              variant="destructive"
              className="w-full gap-2"
              disabled={deleting}
              onClick={async () => {
                if (!confirm(`Delete invoice ${invoice.invoiceNumber}? This cannot be undone.`)) return;
                setDeleting(true);
                const ok = await deleteInvoice(token, invoice.id);
                if (ok) {
                  toast.success("Invoice deleted");
                  router.push("/admin/dashboard/invoices");
                } else {
                  toast.error("Failed to delete invoice");
                }
                setDeleting(false);
              }}
            >
              {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Delete Invoice
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { InvoiceActions };
