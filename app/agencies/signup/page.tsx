import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SITE_URL } from "@/lib/seo";

import { Navbar } from "@/components/marketing/navbar";
import { AgencySignupForm } from "./_components/agency-signup-form";

export const metadata: Metadata = {
  title: "Register Your Agency — OctogleHire",
  description:
    "Join the OctogleHire agency marketplace. Register your recruitment agency to access exclusive requirements, earn commissions, and grow your business.",
  keywords: [
    "recruitment agency registration",
    "agency marketplace signup",
    "recruitment partner program",
    "earn commissions recruitment",
    "agency referral program",
  ],
  alternates: { canonical: `${SITE_URL}/agencies/signup` },
  openGraph: {
    title: "Register Your Agency — OctogleHire",
    description:
      "Join the OctogleHire agency marketplace. Access exclusive requirements, earn commissions on every placement.",
    url: `${SITE_URL}/agencies/signup`,
  },
};

const benefits = [
  {
    title: "Commission on every placement",
    description:
      "Earn a transparent commission on every successful engagement sourced through your referral link. No hidden fees.",
  },
  {
    title: "Branded referral link",
    description:
      "Get a unique URL for your agency. Every candidate who applies through your link is automatically attributed to you.",
  },
  {
    title: "Real-time dashboard",
    description:
      "Track candidates, commissions, and pipeline status from your dedicated agency dashboard. Full visibility at all times.",
  },
  {
    title: "300+ exclusive requirements",
    description:
      "Browse curated job requirements from companies actively hiring through OctogleHire. Access roles you won't find elsewhere.",
  },
];

const stats = [
  { value: "10%", label: "Base commission rate" },
  { value: "300+", label: "Open requirements" },
  { value: "24h", label: "Application review" },
];

export default function AgencySignupPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_460px] gap-12 xl:gap-20 py-16 lg:py-24 lg:items-start">
            {/* ── Left — value props ── */}
            <div className="lg:sticky lg:top-24 space-y-10">
              {/* Headline block */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  For Agencies
                </span>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
                  Source candidates.
                  <br />
                  Earn commissions.
                </h1>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                  Register your recruitment agency on OctogleHire and start
                  earning commissions on every successful placement — with
                  your own branded pipeline and real-time tracking.
                </p>
              </div>

              {/* Benefits */}
              <ul className="space-y-5">
                {benefits.map((b) => (
                  <li key={b.title} className="flex gap-3.5 items-start">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                      <Check
                        className="size-3 text-foreground"
                        strokeWidth={2.5}
                      />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{b.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {b.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 border-t pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-mono text-2xl font-semibold text-pulse lg:text-3xl">
                      {s.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right — form ── */}
            <div>
              <div className="rounded-2xl border bg-card p-7 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold">
                    Register your agency
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Free to join · No commitments · Start earning immediately
                  </p>
                </div>
                <AgencySignupForm />
              </div>

              {/* Trust row */}
              <div className="mt-4 flex items-center justify-center gap-5 flex-wrap">
                {[
                  "Free to join",
                  "No minimum submissions",
                  "24h review",
                ].map((label) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <Check className="size-3.5" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
