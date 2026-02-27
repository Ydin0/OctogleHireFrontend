import {
  Clock,
  Globe,
  Headphones,
  Scale,
  Shield,
  Users,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface BenefitsProps {
  className?: string;
}

const benefits = [
  {
    icon: Shield,
    title: "Pre-Vetted Talent",
    description:
      "Only 3% of applicants pass our 5-stage vetting — technical assessment, live interview, and background check. 1,000+ engineers are active in the network today.",
  },
  {
    icon: Globe,
    title: "150+ Countries Covered",
    description:
      "Access engineers across 150+ countries with 4–6 hours of timezone overlap guaranteed. Every major tech hub, every specialisation covered.",
  },
  {
    icon: Zap,
    title: "48-Hour Placement",
    description:
      "Post a role and receive 3–5 hand-picked, vetted profiles within 48 hours. That's 10x faster than the 6–12 week agency average.",
  },
  {
    icon: Scale,
    title: "Compliance Handled",
    description:
      "Contracts, payroll, tax, and local employment law — fully managed across 150+ countries. We act as Employer of Record so you get a single invoice.",
  },
  {
    icon: Users,
    title: "Dedicated Account Manager",
    description:
      "A human account manager supports 300+ companies on the platform — handling onboarding, replacements, and ongoing success.",
  },
  {
    icon: Clock,
    title: "Flexible Engagements",
    description:
      "Hire hourly, weekly, monthly, or full-time. 94% of placements extend beyond 6 months — but there's no lock-in or cancellation fees.",
  },
];

const Benefits = ({ className }: BenefitsProps) => {
  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mb-16 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Benefits
        </span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          300+ companies hire faster, cheaper, and better
        </h2>
      </div>

      {/* 6-card grid */}
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="bg-background p-8 space-y-4"
          >
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

export { Benefits };
