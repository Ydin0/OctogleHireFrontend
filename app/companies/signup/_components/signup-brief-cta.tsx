"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBriefWizard } from "@/components/marketing/brief-wizard-context";

/**
 * Replaces the old direct account-creation form. Companies no longer create
 * an account here — they submit a hiring brief (enquiry) and our team reaches
 * out. Opens the shared BriefWizard modal.
 */
export function SignupBriefCta() {
  const { open } = useBriefWizard();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Tell us what you&apos;re building</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Answer a few quick questions · No commitment · Matched in 48h
        </p>
      </div>
      <Button
        size="lg"
        className="w-full gap-2 rounded-full"
        onClick={() => open({ sourcePage: "Company signup page" })}
      >
        Start your brief
        <ArrowRight className="size-4" />
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        We&apos;ll review your brief and personally reach out — no account needed yet.
      </p>
    </div>
  );
}
