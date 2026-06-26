"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, Mail, Send, Trash2, X } from "lucide-react";

import type { Invoice } from "@/lib/api/invoices";
import { formatCurrency } from "../../_components/dashboard-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InvoiceBulkActionBarProps {
  selectedInvoices: Invoice[];
  isSuperAdmin: boolean;
  onMarkPaid: () => Promise<void> | void;
  onSend: () => Promise<void> | void;
  onEmail: (recipientEmail: string, note: string) => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  onClear: () => void;
}

type BusyKind = "markPaid" | "send" | "email" | "delete" | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sticky bottom action bar — slides up when ≥1 invoice is selected.
 * Mark paid + Send drafts + Delete (super-admin) + Clear.
 *
 * "Send drafts" and "Delete" prompt for confirmation because they're either
 * outward-facing (emails go out) or destructive.
 */
export function InvoiceBulkActionBar({
  selectedInvoices,
  isSuperAdmin,
  onMarkPaid,
  onSend,
  onEmail,
  onDelete,
  onClear,
}: InvoiceBulkActionBarProps) {
  const [busy, setBusy] = useState<BusyKind>(null);
  const [confirm, setConfirm] = useState<"send" | "email" | "delete" | null>(null);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const selectedCount = selectedInvoices.length;

  // Excel-style sum of the selected invoices, grouped by their native currency
  // (so mixed-currency selections stay accurate — no FX guessing).
  const totalsByCurrency = useMemo(() => {
    const map = new Map<string, number>();
    for (const inv of selectedInvoices) {
      map.set(inv.currency, (map.get(inv.currency) ?? 0) + inv.total);
    }
    return Array.from(map.entries()).map(([currency, total]) => ({ currency, total }));
  }, [selectedInvoices]);

  const run = async (kind: BusyKind, fn: () => Promise<void> | void) => {
    setBusy(kind);
    try {
      await fn();
    } finally {
      setBusy(null);
      setConfirm(null);
    }
  };

  const emailValid = EMAIL_RE.test(email.trim());

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-border bg-background/95 px-5 py-3 shadow-2xl ring-1 ring-pulse/20 backdrop-blur">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tabular-nums">
            {selectedCount} selected
          </span>
          <span className="font-mono text-[13px] font-semibold text-pulse tabular-nums">
            {totalsByCurrency.length === 0
              ? "—"
              : totalsByCurrency
                  .map((t) => formatCurrency(t.total, t.currency))
                  .join("  ·  ")}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => run("markPaid", onMarkPaid)}
            disabled={busy !== null}
            className="gap-1.5"
          >
            {busy === "markPaid" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
            Mark paid
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfirm("send")}
            disabled={busy !== null}
            className="gap-1.5"
          >
            <Send className="size-3.5" />
            Send drafts
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEmail("");
              setNote("");
              setConfirm("email");
            }}
            disabled={busy !== null}
            className="gap-1.5"
          >
            <Mail className="size-3.5" />
            Email PDFs
          </Button>
          {isSuperAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirm("delete")}
              disabled={busy !== null}
              className="gap-1.5 text-red-600 hover:text-red-700"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            disabled={busy !== null}
            aria-label="Clear selection"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Send confirm */}
      <Dialog
        open={confirm === "send"}
        onOpenChange={(o) => !o && setConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send {selectedCount} invoice(s)?</DialogTitle>
            <DialogDescription>
              Only draft invoices will be sent. Non-drafts in the selection
              are skipped. Each company gets an email with the PDF attached.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirm(null)}
              disabled={busy === "send"}
            >
              Cancel
            </Button>
            <Button
              onClick={() => run("send", onSend)}
              disabled={busy === "send"}
              className="gap-1.5"
            >
              {busy === "send" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" />
              )}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email PDFs to a custom address */}
      <Dialog
        open={confirm === "email"}
        onOpenChange={(o) => !o && busy !== "email" && setConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email {selectedCount} invoice PDF(s)</DialogTitle>
            <DialogDescription>
              Send the selected invoices&apos; PDFs as attachments to any email
              address — e.g. a client&apos;s accounts department. This does not
              change invoice status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="bulk-email-to">Recipient email</Label>
              <Input
                id="bulk-email-to"
                type="email"
                placeholder="accounts@client.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-email-note">
                Note <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="bulk-email-note"
                placeholder="Add a short message to include in the email…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirm(null)}
              disabled={busy === "email"}
            >
              Cancel
            </Button>
            <Button
              onClick={() => run("email", () => onEmail(email.trim(), note.trim()))}
              disabled={busy === "email" || !emailValid}
              className="gap-1.5"
            >
              {busy === "email" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Mail className="size-3.5" />
              )}
              Send PDFs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={confirm === "delete"}
        onOpenChange={(o) => !o && setConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedCount} invoice(s)?</DialogTitle>
            <DialogDescription>
              This permanently removes the invoices and all their line items.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirm(null)}
              disabled={busy === "delete"}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => run("delete", onDelete)}
              disabled={busy === "delete"}
              className="gap-1.5"
            >
              {busy === "delete" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
