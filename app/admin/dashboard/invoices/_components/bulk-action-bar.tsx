"use client";

import { useState } from "react";
import { Check, Loader2, Send, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InvoiceBulkActionBarProps {
  selectedCount: number;
  isSuperAdmin: boolean;
  onMarkPaid: () => Promise<void> | void;
  onSend: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  onClear: () => void;
}

type BusyKind = "markPaid" | "send" | "delete" | null;

/**
 * Sticky bottom action bar — slides up when ≥1 invoice is selected.
 * Mark paid + Send drafts + Delete (super-admin) + Clear.
 *
 * "Send drafts" and "Delete" prompt for confirmation because they're either
 * outward-facing (emails go out) or destructive.
 */
export function InvoiceBulkActionBar({
  selectedCount,
  isSuperAdmin,
  onMarkPaid,
  onSend,
  onDelete,
  onClear,
}: InvoiceBulkActionBarProps) {
  const [busy, setBusy] = useState<BusyKind>(null);
  const [confirm, setConfirm] = useState<"send" | "delete" | null>(null);

  const run = async (kind: BusyKind, fn: () => Promise<void> | void) => {
    setBusy(kind);
    try {
      await fn();
    } finally {
      setBusy(null);
      setConfirm(null);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="sticky bottom-4 z-30 mx-auto flex w-full max-w-3xl items-center gap-2 rounded-full border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
        <span className="ml-1 text-sm font-medium tabular-nums">
          {selectedCount} selected
        </span>
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
