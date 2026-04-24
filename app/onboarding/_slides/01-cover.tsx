"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { SlideShell } from "../_components/slide-shell";

const isSafeImageUrl = (url: string) => {
  if (url.startsWith("/")) return true;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export const CoverSlide = () => {
  const params = useSearchParams();
  const company = params.get("company");
  const contact = params.get("contact");
  const logo = params.get("logo");

  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
  }, []);

  const safeLogo = logo && isSafeImageUrl(logo) ? logo : null;

  return (
    <SlideShell>
      <div className="flex flex-col gap-12 md:gap-16">
        {/* Top row: live chip + date */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Live Discovery Session
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {today}
          </span>
        </div>

        {/* Big title */}
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {company ? `Prepared for` : "Discovery Deck"}
          </p>
          <h1 className="text-5xl font-medium tracking-tight leading-[1.05] md:text-6xl lg:text-7xl xl:text-8xl">
            {company ? (
              <>
                <span className="text-muted-foreground/60">Welcome,</span>
                <br />
                {company}
              </>
            ) : (
              <>
                <span className="text-pulse">AI Native</span>
                <br />
                engineers, on tap.
              </>
            )}
          </h1>

          {contact && (
            <p className="text-xl text-muted-foreground md:text-2xl">
              A walkthrough for{" "}
              <span className="text-foreground font-medium">{contact}</span>
            </p>
          )}
        </div>

        {/* Bottom: OctogleHire + optional prospect logo + hint */}
        <div className="flex flex-col gap-10 pt-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Presented by
              </p>
              <p className="text-2xl font-semibold tracking-tight">
                OctogleHire
              </p>
            </div>
            {safeLogo && (
              <>
                <span className="h-10 w-px bg-border" />
                <div className="flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={safeLogo}
                    alt={company ? `${company} logo` : "Company logo"}
                    className="h-10 w-auto max-w-[160px] object-contain opacity-90"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Press</span>
            <kbd className="inline-flex h-7 items-center rounded-md border border-border bg-muted/40 px-2 font-mono text-xs">
              →
            </kbd>
            <span>or</span>
            <kbd className="inline-flex h-7 items-center rounded-md border border-border bg-muted/40 px-2 font-mono text-xs">
              Space
            </kbd>
            <span>to begin</span>
            <ArrowRight className="size-4 text-pulse" />
          </div>
        </div>
      </div>
    </SlideShell>
  );
};
