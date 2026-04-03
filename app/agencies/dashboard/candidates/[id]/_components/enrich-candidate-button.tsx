"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { enrichAgencyCandidate } from "@/lib/api/agencies";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = useState(false);

  const needsEnrichment =
    !email ||
    email.includes("placeholder") ||
    email.includes("linkedin-import") ||
    !phone;

  if (!needsEnrichment) return null;

  async function handleEnrich() {
    setLoading(true);
    try {
      const ok = await enrichAgencyCandidate(token, candidateId);
      if (ok) {
        toast.success(
          "Enrichment requested — email and phone will update shortly",
        );
      } else {
        toast.error("Failed to request enrichment");
      }
    } catch {
      toast.error("Failed to request enrichment");
    }
    setLoading(false);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full"
      disabled={loading}
      onClick={handleEnrich}
    >
      <Sparkles className="mr-1.5 size-3.5" />
      {loading ? "Enriching..." : "Enrich Email & Phone"}
    </Button>
  );
}
