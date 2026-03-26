"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addAgencyCandidate } from "@/lib/api/agencies";
import {
  fetchLinkedInProfile,
  mapProfileToFormValues,
  type ApifyProfile,
} from "@/lib/linkedin";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

type RowStatus = "pending" | "importing" | "success" | "error";

interface ImportRow {
  url: string;
  status: RowStatus;
  name?: string;
  error?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractLinkedInUrls(text: string): string[] {
  const lines = text.split(/[\r\n]+/);
  const urls: string[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    // Match LinkedIn profile URLs anywhere in the line
    const match = line.match(
      /https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/,
    );
    if (match) {
      const normalized = match[0].replace(/\/$/, "");
      if (!seen.has(normalized)) {
        seen.add(normalized);
        urls.push(normalized);
      }
    }
  }

  return urls;
}

// ── Component ────────────────────────────────────────────────────────────────

const BulkImportDialog = () => {
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

  const reset = () => {
    setRows([]);
    setRunning(false);
    setDone(false);
    abortRef.current = false;
  };

  // ── File / paste handling ────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const urls = extractLinkedInUrls(text);
      setRows(urls.map((url) => ({ url, status: "pending" })));
      setDone(false);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile],
  );

  // ── Import logic ─────────────────────────────────────────────────────────

  const runImport = async () => {
    setRunning(true);
    setDone(false);
    abortRef.current = false;

    for (let i = 0; i < rows.length; i++) {
      if (abortRef.current) break;
      if (rows[i].status === "success") continue;

      // Mark as importing
      setRows((prev) =>
        prev.map((r, idx) => (idx === i ? { ...r, status: "importing", error: undefined } : r)),
      );

      try {
        // Get fresh token for each candidate to prevent expiry
        const token = await getToken();
        if (!token) throw new Error("Session expired — please refresh the page and try again.");

        // 1. Scrape LinkedIn profile
        const profile: ApifyProfile = await fetchLinkedInProfile(rows[i].url);
        const values = mapProfileToFormValues(profile, rows[i].url);

        const name = values.fullName ?? "Unknown";

        // Resolve photo URL
        const photoUrl =
          (profile._profilePhotoR2Url as string | undefined) ??
          (profile.profilePicHighQuality as string | undefined) ??
          (profile.profilePic as string | undefined) ??
          (profile.profilePicture as string | undefined) ??
          undefined;

        // 2. We need an email to create a candidate. If LinkedIn doesn't provide one,
        //    use a placeholder based on the LinkedIn handle so admin can update later.
        const linkedinHandle = rows[i].url.split("/in/")[1]?.replace(/\/$/, "") ?? "unknown";
        const email =
          (profile.email as string | undefined) ??
          `${linkedinHandle}@linkedin-import.placeholder`;

        // 3. Add candidate via existing API
        await addAgencyCandidate(token, {
          fullName: values.fullName || undefined,
          email,
          professionalTitle: values.professionalTitle || undefined,
          bio: values.bio || undefined,
          primaryStack:
            values.primaryStack && values.primaryStack.length > 0
              ? values.primaryStack
              : undefined,
          secondarySkills: values.secondarySkills || undefined,
          locationCity: values.locationCity || undefined,
          locationState: values.locationState || undefined,
          linkedinUrl: rows[i].url,
          profilePhotoUrl: photoUrl,
          workExperience:
            values.workExperience && values.workExperience.length > 0
              ? values.workExperience
              : undefined,
          education:
            values.education && values.education.length > 0
              ? values.education
              : undefined,
          sourcedByUserId: userId ?? undefined,
          sourcedByName: user?.fullName ?? user?.firstName ?? undefined,
        });

        setRows((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "success", name } : r,
          ),
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Import failed";
        setRows((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "error", error: message } : r,
          ),
        );
      }

      // Small delay between requests to avoid hammering APIs
      if (i < rows.length - 1 && !abortRef.current) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    setRunning(false);
    setDone(true);

    const sc = rows.filter((r) => r.status === "success").length;
    const ec = rows.filter((r) => r.status === "error").length;
    if (sc > 0) toast.success(`${sc} profile${sc !== 1 ? "s" : ""} imported successfully`);
    if (ec > 0) toast.error(`${ec} profile${ec !== 1 ? "s" : ""} failed to import`);

    router.refresh();
  };

  const handleStop = () => {
    abortRef.current = true;
  };

  // ── Stats ────────────────────────────────────────────────────────────────

  const successCount = rows.filter((r) => r.status === "success").length;
  const errorCount = rows.filter((r) => r.status === "error").length;
  const pendingCount = rows.filter(
    (r) => r.status === "pending" || r.status === "importing",
  ).length;
  const currentIndex = rows.findIndex((r) => r.status === "importing");

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (running) return; // prevent closing during import
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <FileSpreadsheet className="size-3.5" />
          Bulk Import
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Import from LinkedIn</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing LinkedIn profile URLs. Each profile
            will be scraped and added to your candidate pool.
          </DialogDescription>
        </DialogHeader>

        {rows.length === 0 ? (
          /* ── Upload zone ────────────────────────────────────────── */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 px-6 text-center transition-colors hover:border-foreground/20"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Upload className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Drop a CSV file here, or{" "}
                <button
                  type="button"
                  className="text-foreground underline underline-offset-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                CSV, TXT, or any file with one LinkedIn URL per line
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,.tsv"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        ) : (
          /* ── URL list + progress ────────────────────────────────── */
          <div className="space-y-3">
            {/* Progress bar */}
            {(running || done) && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {running
                      ? `Importing ${currentIndex + 1} of ${rows.length}...`
                      : `Done — ${successCount} imported, ${errorCount} failed`}
                  </span>
                  <span className="font-mono">
                    {successCount + errorCount}/{rows.length}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-foreground transition-all duration-300"
                    style={{
                      width: `${((successCount + errorCount) / rows.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* URL table */}
            <div className="max-h-[400px] overflow-y-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background border-b">
                  <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="w-8 px-3 py-2">#</th>
                    <th className="px-3 py-2 text-left">LinkedIn URL</th>
                    <th className="w-24 px-3 py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {rows.map((row, i) => (
                    <tr
                      key={row.url}
                      className={cn(
                        row.status === "importing" && "bg-muted/50",
                        row.status === "error" && "bg-red-500/5",
                      )}
                    >
                      <td className="px-3 py-2 text-xs text-muted-foreground font-mono">
                        {i + 1}
                      </td>
                      <td className="px-3 py-2">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-mono">
                            {row.url.replace("https://www.linkedin.com/in/", "")}
                          </p>
                          {row.name && (
                            <p className="text-xs text-muted-foreground">
                              {row.name}
                            </p>
                          )}
                          {row.error && (
                            <p className="text-xs text-red-600 mt-0.5">
                              {row.error}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right">
                        {row.status === "pending" && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-normal"
                          >
                            Pending
                          </Badge>
                        )}
                        {row.status === "importing" && (
                          <Loader2 className="ml-auto size-3.5 animate-spin text-muted-foreground" />
                        )}
                        {row.status === "success" && (
                          <Check className="ml-auto size-3.5 text-emerald-500" />
                        )}
                        {row.status === "error" && (
                          <AlertCircle className="ml-auto size-3.5 text-red-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary badges */}
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary">{rows.length} URLs</Badge>
              {successCount > 0 && (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-600/20">
                  {successCount} imported
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge className="bg-red-500/10 text-red-600 border-red-600/20">
                  {errorCount} failed
                </Badge>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          {rows.length === 0 ? (
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          ) : running ? (
            <Button variant="outline" onClick={handleStop} className="gap-1.5">
              <X className="size-3.5" />
              Stop Import
            </Button>
          ) : done ? (
            <Button
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Done
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={reset}>
                Clear
              </Button>
              <Button onClick={runImport} className="gap-1.5">
                <Upload className="size-3.5" />
                Import {rows.length} Profile{rows.length !== 1 ? "s" : ""}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { BulkImportDialog };
