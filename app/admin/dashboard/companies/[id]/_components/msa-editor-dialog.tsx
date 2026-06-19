"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2, Mail, Save, Send } from "lucide-react";

import {
  type Agreement,
  fetchAdminAgreement,
  fetchDefaultMsa,
  sendCompanyMsa,
  updateAdminAgreement,
  resendAgreement,
} from "@/lib/api/companies";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface MsaEditorDialogProps {
  companyId: string;
  /** The existing MSA agreement, or null if none has been created yet. */
  agreement: Agreement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
}

export function MsaEditorDialog({
  companyId,
  agreement,
  open,
  onOpenChange,
  onChanged,
}: MsaEditorDialogProps) {
  const { getToken } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"write" | "preview">("preview");

  const readOnly = agreement?.status === "signed";

  const load = useCallback(async () => {
    setLoading(true);
    const token = await getToken();
    const text = agreement
      ? (await fetchAdminAgreement(token, companyId, agreement.id))?.contentSnapshot ?? ""
      : (await fetchDefaultMsa(token, companyId)) ?? "";
    setContent(text);
    setMode(agreement && agreement.status === "pending" ? "write" : "preview");
    setLoading(false);
  }, [getToken, companyId, agreement]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleSend = async () => {
    setBusy(true);
    const token = await getToken();
    const result = await sendCompanyMsa(token, companyId, content);
    setBusy(false);
    if (!result.success) {
      toast.error(result.error ?? "Failed to send MSA");
      return;
    }
    toast.success("MSA sent to the company");
    onChanged();
    onOpenChange(false);
  };

  const handleSave = async (alsoResend: boolean) => {
    if (!agreement) return;
    setBusy(true);
    const token = await getToken();
    const ok = await updateAdminAgreement(token, companyId, agreement.id, content);
    if (ok && alsoResend) await resendAgreement(token, companyId, agreement.id);
    setBusy(false);
    if (!ok) {
      toast.error("Failed to save");
      return;
    }
    toast.success(alsoResend ? "Saved & re-sent to the company" : "MSA saved");
    onChanged();
    if (alsoResend) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {!agreement
              ? "Prepare MSA"
              : readOnly
                ? "Master Services Agreement (signed)"
                : "Edit MSA"}
          </DialogTitle>
          <DialogDescription>
            {readOnly
              ? `Signed by ${agreement?.signedByName ?? "the company"} — frozen and read-only.`
              : "This is the exact document the company sees and signs. Edit the HTML below; the preview matches their view."}
          </DialogDescription>
        </DialogHeader>

        {!readOnly && (
          <div className="flex gap-1">
            <Button
              variant={mode === "write" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("write")}
            >
              Edit HTML
            </Button>
            <Button
              variant={mode === "preview" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("preview")}
            >
              Preview
            </Button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-border">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : mode === "write" && !readOnly ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[420px] resize-none border-0 font-mono text-xs leading-relaxed focus-visible:ring-0"
            />
          ) : (
            <div
              style={{ colorScheme: "light" }}
              className="bg-zinc-200 p-6"
            >
              <div
                className="mx-auto max-w-[880px] rounded-lg bg-white text-zinc-900 shadow-sm"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!agreement && (
            <Button onClick={handleSend} disabled={busy || loading} className="gap-2 rounded-full">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Send MSA
            </Button>
          )}
          {agreement && !readOnly && (
            <>
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={busy || loading}
                className="gap-2 rounded-full"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={busy || loading}
                className="gap-2 rounded-full"
              >
                <Mail className="size-4" />
                Save &amp; re-send
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
