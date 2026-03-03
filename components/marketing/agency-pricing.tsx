import { ArrowRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AgencyPricingProps {
  className?: string;
}

const freeFeatures = [
  "Free registration — no upfront costs",
  "Branded referral link",
  "Candidate tracking dashboard",
  "Real-time commission reports",
  "Team member access",
  "Dedicated support",
];

const enterpriseFeatures = [
  "Custom commission rates",
  "Priority matching & placement",
  "Dedicated account manager",
  "API access for integrations",
  "Volume bonuses",
  "Custom reporting",
];

const AgencyPricing = ({ className }: AgencyPricingProps) => {
  return (
    <section id="pricing" className={cn("py-24", className)}>
      <div className="container mx-auto px-6">
        {/* Header — centered */}
        <div className="mx-auto mb-14 max-w-xl text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Pricing
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
            Free to join. Earn on every placement.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            No registration fees, no monthly costs. You earn a commission on
            every successful placement — transparent rates with real-time
            tracking.
          </p>
        </div>

        {/* Cards — centered */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
          {/* ── Free to Join — hero ── */}
          <div className="group flex flex-col gap-6 rounded-3xl bg-foreground p-8 transition-transform duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-background">
                  Free to Join
                </h3>
                <span className="rounded-full bg-background/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-background/70">
                  No fees
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-background/60">
                Register your agency, get your referral link, and start
                submitting candidates. You only earn — you never pay.
              </p>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-semibold text-background">
                  $0
                </span>
                <span className="text-sm text-background/50">to register</span>
              </div>
              <p className="mt-1 text-xs text-background/40">
                Earn commissions from your first placement
              </p>
            </div>

            <Button
              asChild
              variant="secondary"
              className="rounded-full gap-2 transition-opacity group-hover:opacity-90"
            >
              <a href="/agencies/signup">
                Register Your Agency
                <ArrowRight className="size-4" />
              </a>
            </Button>

            <ul className="space-y-3">
              {freeFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2.5 text-sm text-background/80"
                >
                  <Check
                    className="size-4 shrink-0 text-background/40"
                    strokeWidth={2.5}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Enterprise / Volume ── */}
          <div className="group flex flex-col gap-6 rounded-3xl border bg-card p-8 transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Enterprise / Volume</h3>
                <span className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Custom
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                For agencies placing at scale. Get custom commission rates,
                priority access, and a dedicated account manager.
              </p>
            </div>

            {/* Price */}
            <div>
              <span className="font-mono text-2xl font-semibold">
                Contact Us
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Custom rates · Volume bonuses available
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full gap-2 transition-colors duration-200 group-hover:border-foreground/30"
            >
              <a href="mailto:agencies@octoglehire.com">
                Talk to Us
                <ArrowRight className="size-4" />
              </a>
            </Button>

            <ul className="space-y-3">
              {enterpriseFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check
                    className="size-4 shrink-0 text-pulse"
                    strokeWidth={2.5}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer note */}
        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted-foreground">
          Enterprise plans with custom SLAs and higher commission rates
          available on request.
        </p>
      </div>
    </section>
  );
};

export { AgencyPricing };
