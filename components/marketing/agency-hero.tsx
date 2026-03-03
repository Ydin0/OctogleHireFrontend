"use client";

import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AgencyHeroProps {
  className?: string;
}

const statBadges = [
  { label: "10% commission", mono: true },
  { label: "300+ open roles", mono: true },
  { label: "48h placement", mono: true },
];

const AgencyHero = ({ className }: AgencyHeroProps) => {
  return (
    <section className={cn("pt-20 pb-24", className)}>
      <div className="container mx-auto px-6">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5">
            <span className="size-2 rounded-full bg-pulse animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Recruitment Agency Marketplace
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mt-8 text-center text-5xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          Source Candidates.
          <br />
          Earn Commissions.
          <br />
          <span className="text-pulse">Grow Your Agency.</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-xl text-center text-base text-muted-foreground sm:text-lg">
          Join the OctogleHire agency marketplace — access exclusive
          requirements, submit candidates through your branded link, and earn
          commissions on every successful placement. Real-time tracking included.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-6">
            <a href="/agencies/signup">
              Register Your Agency
              <ArrowRight className="ml-2 size-4 -rotate-45" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-6"
          >
            <a href="#how-it-works">Learn More</a>
          </Button>
        </div>

        <p className="mt-6 text-center text-[10px] text-muted-foreground">
          Trusted by recruitment agencies worldwide
        </p>

        {/* Stat badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {statBadges.map((badge) => (
            <Badge
              key={badge.label}
              variant="outline"
              className={cn(
                "px-4 py-1.5 text-xs",
                badge.mono && "font-mono",
              )}
            >
              {badge.label}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};

export { AgencyHero };
