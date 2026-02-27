import {
  ArrowRight,
  Clock,
  Globe,
  HeadphonesIcon,
  Scale,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const list = [
  {
    icon: Sparkles,
    text: "AI-powered candidate matching",
  },
  {
    icon: Shield,
    text: "Pre-vetted top 3% engineers",
  },
  {
    icon: Globe,
    text: "Talent from 150+ countries",
  },
  {
    icon: Scale,
    text: "Compliance & payroll handled",
  },
  {
    icon: Users,
    text: "Dedicated account management",
  },
  {
    icon: Zap,
    text: "48-hour candidate delivery",
  },
  {
    icon: Clock,
    text: "Flexible engagement models",
  },
  {
    icon: HeadphonesIcon,
    text: "Priority support & onboarding",
  },
];

const List = () => {
  return (
    <ul
      className={cn(
        "grid max-w-[36.25rem] grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2",
      )}
    >
      {list.map((item, i) => (
        <li key={`cta-item-${i}`} className="flex items-center gap-3">
          <item.icon className="size-5 stroke-white" />
          <div className="text-xs font-mono tracking-[0.06em] text-white">
            {item.text}
          </div>
        </li>
      ))}
    </ul>
  );
};

interface CtaProps {
  className?: string;
}

const Cta = ({ className }: CtaProps) => {
  return (
    <section
      className={cn("dark bg-background py-16 text-foreground", className)}
    >
      <div className="container mx-auto px-6">
        <div className="relative grid grid-cols-1 overflow-hidden rounded-[0.75rem] px-8 pt-10 pb-12 xl:grid-cols-2 xl:px-15.5 xl:pb-12">
          <div className="flex flex-col gap-5 md:gap-7">
            <h2 className="text-4xl tracking-tight md:text-5xl lg:text-6xl">
              <span className="block text-pulse font-semibold">Enterprise:</span>
              <span className="font-normal">Scale your team globally</span>
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl">
              Everything you need to build and manage a world-class engineering
              team.
            </p>
            <List />
            <div>
              <Button
                size="lg"
                className="w-full md:w-fit hover:bg-pulse hover:text-pulse-foreground"
                asChild
              >
                <a href="/companies/signup">
                  Start Hiring Today
                  <ArrowRight />
                </a>
              </Button>
            </div>
          </div>
          <div className="hidden xl:flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-3xl font-semibold font-mono text-pulse">150+</p>
                <p className="mt-1 text-xs font-mono uppercase tracking-wider text-white/60">Countries</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-3xl font-semibold font-mono text-pulse">1,000+</p>
                <p className="mt-1 text-xs font-mono uppercase tracking-wider text-white/60">Developers</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-3xl font-semibold font-mono text-pulse">48h</p>
                <p className="mt-1 text-xs font-mono uppercase tracking-wider text-white/60">Delivery</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-3xl font-semibold font-mono text-pulse">Top 3%</p>
                <p className="mt-1 text-xs font-mono uppercase tracking-wider text-white/60">Engineers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta };
