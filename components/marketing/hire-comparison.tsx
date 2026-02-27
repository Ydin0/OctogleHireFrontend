import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface HireComparisonProps {
  className?: string;
}

const dimensions = [
  {
    label: "Vetting",
    agency: "Resume screening only",
    freelance: "Self-reported skills",
    octogle: "5-stage technical vetting (3% pass rate)",
  },
  {
    label: "Time to Hire",
    agency: "6–12 weeks",
    freelance: "Weeks of filtering",
    octogle: "48 hours to first match",
  },
  {
    label: "Cost",
    agency: "$20K–$40K placement fees",
    freelance: "Low rates, variable quality",
    octogle: "40–60% less, no placement fee",
  },
  {
    label: "Compliance",
    agency: "You manage it",
    freelance: "You manage it",
    octogle: "Fully managed (150+ countries)",
  },
  {
    label: "Replacement",
    agency: "30–90 days (if any)",
    freelance: "None",
    octogle: "Risk-free guarantee period",
  },
  {
    label: "Support",
    agency: "Account rep (9-5)",
    freelance: "Ticket system",
    octogle: "Dedicated account manager",
  },
];

const HireComparison = ({ className }: HireComparisonProps) => {
  return (
    <section className={cn("container mx-auto px-6 pb-24", className)}>
      <div className="mb-12 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Compare
        </span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          How OctogleHire compares
        </h2>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-border bg-muted/30">
        {/* Header */}
        <div className="grid grid-cols-4 gap-px bg-border">
          <div className="bg-background p-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Dimension
            </span>
          </div>
          <div className="bg-background p-5">
            <span className="text-sm font-medium text-muted-foreground">
              Traditional Agency
            </span>
          </div>
          <div className="bg-background p-5">
            <span className="text-sm font-medium text-muted-foreground">
              Freelance Platforms
            </span>
          </div>
          <div className="bg-background p-5">
            <span className="text-sm font-semibold text-pulse">
              OctogleHire
            </span>
          </div>
        </div>

        {/* Rows */}
        {dimensions.map((dim) => (
          <div key={dim.label} className="grid grid-cols-4 gap-px bg-border">
            <div className="bg-background p-5">
              <span className="text-sm font-semibold">{dim.label}</span>
            </div>
            <div className="bg-background p-5 flex items-start gap-2">
              <X className="size-4 shrink-0 text-muted-foreground/40 mt-0.5" strokeWidth={2} />
              <span className="text-sm text-muted-foreground">{dim.agency}</span>
            </div>
            <div className="bg-background p-5 flex items-start gap-2">
              <X className="size-4 shrink-0 text-muted-foreground/40 mt-0.5" strokeWidth={2} />
              <span className="text-sm text-muted-foreground">{dim.freelance}</span>
            </div>
            <div className="bg-background p-5 flex items-start gap-2">
              <Check className="size-4 shrink-0 text-pulse mt-0.5" strokeWidth={2.5} />
              <span className="text-sm font-medium">{dim.octogle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-4">
        {dimensions.map((dim) => (
          <div
            key={dim.label}
            className="rounded-2xl border border-border bg-muted/30 p-5 space-y-3"
          >
            <p className="text-sm font-semibold">{dim.label}</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <X className="size-3.5 shrink-0 text-muted-foreground/40 mt-0.5" strokeWidth={2} />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Agency</span>
                  <p className="text-xs text-muted-foreground">{dim.agency}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <X className="size-3.5 shrink-0 text-muted-foreground/40 mt-0.5" strokeWidth={2} />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Freelance</span>
                  <p className="text-xs text-muted-foreground">{dim.freelance}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="size-3.5 shrink-0 text-pulse mt-0.5" strokeWidth={2.5} />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-pulse">OctogleHire</span>
                  <p className="text-xs font-medium">{dim.octogle}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { HireComparison };
