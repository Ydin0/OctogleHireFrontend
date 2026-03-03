import {
  BarChart3,
  Briefcase,
  DollarSign,
  Link,
  Shield,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface AgencyBenefitsProps {
  className?: string;
}

const benefits = [
  {
    icon: DollarSign,
    title: "Commission on Every Placement",
    description:
      "Earn a percentage on every successful engagement sourced through your referral link. Transparent rates, no hidden fees.",
  },
  {
    icon: Link,
    title: "Branded Application Links",
    description:
      "Get a unique referral URL. Every candidate who applies through your link is automatically attributed to your agency.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    description:
      "Track candidates, commissions, and pipeline status in your dedicated agency dashboard. Full visibility from submission to placement.",
  },
  {
    icon: Briefcase,
    title: "Exclusive Requirements",
    description:
      "Browse curated job requirements from companies actively hiring through OctogleHire. Access roles you won't find elsewhere.",
  },
  {
    icon: Shield,
    title: "Pre-Vetted Platform",
    description:
      "Your candidates join a platform trusted by 300+ companies. OctogleHire handles contracts, compliance, and payroll.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite your team members. Manage submissions and track performance across your entire agency.",
  },
];

const AgencyBenefits = ({ className }: AgencyBenefitsProps) => {
  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mb-16 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Benefits
        </span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          Everything your agency needs to succeed
        </h2>
      </div>

      {/* 6-card grid */}
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title} className="bg-background p-8 space-y-4">
            <div className="size-10 rounded-xl border border-border flex items-center justify-center">
              <Icon className="size-5 text-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export { AgencyBenefits };
