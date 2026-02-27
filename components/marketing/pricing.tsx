import { ArrowRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PricingProps {
  className?: string;
}

const onDemandFeatures = [
  "Free to post, free to receive candidates",
  "3–5 curated profiles within 48 hours",
  "All-inclusive monthly rate per developer",
  "Payroll, compliance & contracts managed",
  "Flexible — scale up or down any month",
  "14-day replacement guarantee",
  "Dedicated account manager",
];

const marketplaceFeatures = [
  "Browse 1,000+ vetted profiles directly",
  "Unlimited concurrent role postings",
  "Priority matching & onboarding",
  "All-inclusive monthly rates",
  "Volume pricing available",
  "30-day replacement guarantee",
  "Senior account team",
];

const Pricing = ({ className }: PricingProps) => {
  return (
    <section id="pricing" className={cn("py-24", className)}>
      <div className="container mx-auto px-6">

        {/* Header — centered */}
        <div className="mx-auto mb-14 max-w-xl text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Pricing
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
            Start for free.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Post a role and receive vetted candidates at zero cost.
            <br />
            You only pay a monthly rate once your developer starts.
          </p>
        </div>

        {/* Cards — centered */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">

          {/* ── On-Demand — hero ── */}
          <div className="group flex flex-col gap-6 rounded-3xl bg-foreground p-8 transition-transform duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-background">
                  On-Demand
                </h3>
                <span className="rounded-full bg-background/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-background/70">
                  Zero upfront
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-background/60">
                We source, vet, and deliver candidates for free. Once you
                engage a developer, pay us a simple monthly rate — we handle
                payroll, compliance, and contracts.
              </p>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-semibold text-background">
                  FREE
                </span>
                <span className="text-sm text-background/50">to get started</span>
              </div>
              <p className="mt-1 text-xs text-background/40">
                Monthly rate per developer begins on their start date
              </p>
            </div>

            <Button
              asChild
              variant="secondary"
              className="rounded-full gap-2 transition-opacity group-hover:opacity-90"
            >
              <a href="/companies/signup">
                Post a Role Free
                <ArrowRight className="size-4" />
              </a>
            </Button>

            <ul className="space-y-3">
              {onDemandFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-background/80">
                  <Check className="size-4 shrink-0 text-background/40" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Marketplace — secondary ── */}
          <div className="group flex flex-col gap-6 rounded-3xl border bg-card p-8 transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Marketplace</h3>
                <span className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  For scale
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Direct access to browse and engage from 1,000+ pre-vetted
                engineers — no waiting, no delivery window.
              </p>
            </div>

            {/* Price */}
            <div>
              <span className="font-mono text-2xl font-semibold">
                Contact Sales
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Custom monthly rates · Volume pricing available
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full gap-2 transition-colors duration-200 group-hover:border-foreground/30"
            >
              <a href="/companies/signup">
                Talk to Sales
                <ArrowRight className="size-4" />
              </a>
            </Button>

            <ul className="space-y-3">
              {marketplaceFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="size-4 shrink-0 text-pulse" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer note */}
        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted-foreground">
          Enterprise plans with custom SLAs available on request.
        </p>
      </div>
    </section>
  );
};

export { Pricing };
