"use client";

import {
  ArrowRight,
  Bookmark,
  Check,
  Download,
  MessageSquare,
  Play,
  TrendingUp,
} from "lucide-react";

import type { Developer, MarketplaceSettings } from "@/lib/data/developers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RateRailProps {
  developer: Developer;
  saved: boolean;
  onSave: (id: string) => void;
  settings: MarketplaceSettings;
}

function RateRail({ developer, saved, onSave, settings }: RateRailProps) {
  const localRate = developer.localRate ?? Math.round(developer.hourlyRate * 2.2);
  const savePct =
    localRate > 0
      ? Math.round(((localRate - developer.hourlyRate) / localRate) * 100)
      : 0;
  const hourlyPrimary = settings.defaultRateFraming !== "monthly";
  const firstName = developer.name.split(" ")[0];

  return (
    <div className="sticky top-4 flex flex-col gap-4">
      {/* Rate card */}
      <div className="rounded-[18px] border border-pulse/30 bg-gradient-to-b from-pulse/8 to-card p-5">
        <p className="text-[10px] font-mono uppercase tracking-wider text-pulse">
          Engagement rate
        </p>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-4xl font-bold leading-none">
            $
            {hourlyPrimary
              ? developer.hourlyRate
              : developer.monthlyRate.toLocaleString()}
          </span>
          <span className="text-[15px] text-muted-foreground">
            / {hourlyPrimary ? "hr" : "mo"}
          </span>
        </div>
        <div className="mt-1.5 text-[13px] text-muted-foreground">
          {hourlyPrimary ? (
            <>
              ≈{" "}
              <strong className="text-foreground">
                ${developer.monthlyRate.toLocaleString()}/mo
              </strong>{" "}
              full-time
            </>
          ) : (
            <>
              ≈ <strong className="text-foreground">${developer.hourlyRate}/hr</strong>{" "}
              · 160 hrs/mo
            </>
          )}
        </div>

        {/* Cost vs local hire */}
        <div className="mt-4 rounded-xl border border-border bg-background/60 p-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              vs. local hire
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-500">
              <TrendingUp className="size-3" /> Save {savePct}%
            </span>
          </div>
          {[
            { k: "Local market", v: localRate, w: 100, muted: true },
            {
              k: "OctogleHire",
              v: developer.hourlyRate,
              w: Math.round((developer.hourlyRate / localRate) * 100),
              muted: false,
            },
          ].map((row) => (
            <div key={row.k} className={row.muted ? "mb-2.5" : ""}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">{row.k}</span>
                <span
                  className={cn(
                    "font-mono font-semibold",
                    row.muted ? "text-muted-foreground" : "text-pulse"
                  )}
                >
                  ${row.v}/hr
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    row.muted ? "bg-foreground/25" : "bg-pulse"
                  )}
                  style={{ width: `${row.w}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-4 flex flex-col gap-2">
          <Button className="w-full rounded-full">
            <ArrowRight className="size-4" /> Request interview
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => onSave(developer.id)}
            >
              <Bookmark className={cn("size-4", saved && "fill-current")} />
              {saved ? "Saved" : "Shortlist"}
            </Button>
            <Button variant="outline" className="flex-1 rounded-full">
              <MessageSquare className="size-4" /> Message
            </Button>
          </div>
          <button className="mt-0.5 inline-flex items-center justify-center gap-1.5 p-1.5 text-[12.5px] text-muted-foreground hover:text-foreground">
            <Download className="size-3.5" /> Download profile (PDF)
          </button>
        </div>
      </div>

      {/* What's included */}
      <div className="rounded-[18px] border border-border bg-card p-5">
        <p className="text-[10px] font-mono uppercase tracking-wider text-pulse">
          Hire compliantly
        </p>
        <p className="mb-3.5 mt-1.5 text-[15px] font-semibold">What&apos;s included</p>
        <div className="flex flex-col gap-2.5">
          {settings.included.map((t) => (
            <div key={t} className="flex items-start gap-2.5">
              <span className="mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-500">
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span className="text-[13px] leading-snug">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Availability + video */}
      <div className="rounded-[18px] border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[13.5px] font-medium">
            <span className="size-2 rounded-full bg-emerald-400" />
            {developer.isOnline ? "Available now" : "Available in 2 weeks"}
          </span>
          {developer.timezone && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {developer.timezone.split(" ")[0]}
            </span>
          )}
        </div>
        {developer.overlap && (
          <p className="mb-3.5 text-[12.5px] leading-relaxed text-muted-foreground">
            {developer.overlap}.
          </p>
        )}
        <button className="flex w-full items-center gap-3 rounded-xl border border-border bg-background p-3 text-left">
          <span className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-full bg-pulse text-pulse-foreground">
            <Play className="size-4 fill-current" />
          </span>
          <span>
            <span className="block text-[13px] font-semibold">
              Watch 60-sec intro
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Meet {firstName}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

export { RateRail };
