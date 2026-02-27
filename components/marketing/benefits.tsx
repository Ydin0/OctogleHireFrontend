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
      "Every developer passes a rigorous 5-stage vetting process. Only the top 5% of applicants make it into our network.",
  },
  {
    icon: Globe,
    title: "Global Indian Network",
    description:
      "Access India's deepest pool of engineering talent — every timezone, every major city, every specialisation covered.",
  },
  {
    icon: Zap,
    title: "48-Hour Placement",
    description:
      "Post a role and receive 3–5 hand-picked candidate profiles within 48 hours. Hire faster than any agency.",
  },
  {
    icon: Scale,
    title: "Compliance Handled",
    description:
      "Contracts, payroll, tax, and local employment law — fully managed. We act as Employer of Record in 150+ countries.",
  },
  {
    icon: Users,
    title: "Dedicated Account Manager",
    description:
      "A human account manager handles your onboarding, manages replacements, and ensures every hire is a success.",
  },
  {
    icon: Clock,
    title: "Flexible Engagements",
    description:
      "Hire hourly, weekly, monthly, or full-time. Scale up or down with no long-term lock-in or cancellation fees.",
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
          Let your team focus
          on what matters most
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
