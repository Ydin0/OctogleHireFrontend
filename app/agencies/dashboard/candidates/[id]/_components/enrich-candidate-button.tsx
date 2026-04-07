"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { enrichAgencyCandidate } from "@/lib/api/agencies";
import { Button } from "@/components/ui/button";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface EnrichCandidateButtonProps {
  candidateId: string;
  token: string;
  email: string | null;
  phone: string | null;
}

export function EnrichCandidateButton({
  candidateId,
  token,
  email,
  phone,
}: EnrichCandidateButtonProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [polling, setPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  const isPlaceholderEmail =
    !email ||
    email.includes("placeholder") ||
    email.includes("linkedin-import");
  const needsEnrichment = isPlaceholderEmail || !phone;

  // Poll for updates after enrichment is submitted
  const checkForUpdates = useCallback(async () => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/agencies/candidates/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
      );
      if (!res.ok) return false;
      const data = await res.json();

      const hasNewEmail =
        data.email &&
        !data.email.includes("placeholder") &&
        !data.email.includes("linkedin-import");
      const hasNewPhone = !!data.phone;

      // If we got new data, refresh the page
      if (
        (isPlaceholderEmail && hasNewEmail) ||
        (!phone && hasNewPhone)
      ) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [candidateId, token, isPlaceholderEmail, phone]);

  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      setPollCount((c) => c + 1);
      const updated = await checkForUpdates();
      if (updated) {
        setPolling(false);
        setPollCount(0);
        toast.success("Contact details enriched successfully");
        router.refresh();
      }
    }, 10000); // Check every 10 seconds

    // Stop polling after 5 minutes (30 checks)
    if (pollCount >= 30) {
      setPolling(false);
      setPollCount(0);
      toast.info("Enrichment is taking longer than expected. Refresh the page later to check for updates.");
    }

    return () => clearInterval(interval);
  }, [polling, pollCount, checkForUpdates, router]);

  if (!needsEnrichment && !polling) return null;

  async function handleEnrich() {
    setSubmitting(true);
    try {
      const ok = await enrichAgencyCandidate(token, candidateId);
      if (ok) {
        toast.success("Enrichment submitted — checking for results...");
        setPolling(true);
        setPollCount(0);
      } else {
        toast.error("Failed to request enrichment");
      }
    } catch {
      toast.error("Failed to request enrichment");
    }
    setSubmitting(false);
  }

  if (polling) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-600 dark:text-amber-400">
        <Loader2 className="size-3.5 animate-spin" />
        Enriching contact details...
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full"
      disabled={submitting}
      onClick={handleEnrich}
    >
      {submitting ? (
        <Loader2 className="mr-1.5 size-3.5 animate-spin" />
      ) : (
        <Sparkles className="mr-1.5 size-3.5" />
      )}
      {submitting ? "Submitting..." : "Enrich Email & Phone"}
    </Button>
  );
}
