"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface PlatformStatsProps {
  className?: string;
}

const stats = [
  {
    value: 1000,
    prefix: "",
    suffix: "+",
    label: "Engineers Vetted",
    description: "Pre-vetted and ready to deploy",
  },
  {
    value: 3,
    prefix: "Top ",
    suffix: "%",
    label: "Acceptance Rate",
    description: "Only the best make the cut",
  },
  {
    value: 48,
    prefix: "",
    suffix: "h",
    label: "Average Match Time",
    description: "From brief to shortlist",
  },
  {
    value: 300,
    prefix: "",
    suffix: "+",
    label: "Companies Served",
    description: "Startups to enterprise",
  },
  {
    value: 150,
    prefix: "",
    suffix: "+",
    label: "Countries Covered",
    description: "Truly global coverage",
  },
  {
    value: 94,
    prefix: "",
    suffix: "%",
    label: "6-Month Retention",
    description: "Placements that last",
  },
];

function AnimatedValue({
  value,
  prefix,
  suffix,
}: {
  value: number;
  prefix: string;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="text-pulse text-3xl font-semibold tracking-tight font-mono lg:text-4xl">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

const PlatformStats = ({ className }: PlatformStatsProps) => {
  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      <div className="mb-16 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          By the Numbers
        </span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          The platform behind the placements
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-background p-6 text-center space-y-2"
          >
            <AnimatedValue
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
            <p className="text-sm font-semibold">{stat.label}</p>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-[10px] text-muted-foreground">
        Based on 2024–2025 hiring data across 300+ placements
      </p>
    </section>
  );
};

export { PlatformStats };
