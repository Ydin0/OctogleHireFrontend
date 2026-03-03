"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface AgencyStatsProps {
  className?: string;
}

const stats = [
  {
    value: 10,
    prefix: "",
    suffix: "%",
    label: "Base Commission",
    description: "Starting commission rate",
  },
  {
    value: 300,
    prefix: "",
    suffix: "+",
    label: "Open Requirements",
    description: "Active job postings",
  },
  {
    value: 48,
    prefix: "",
    suffix: "h",
    label: "Avg. Placement Time",
    description: "From submission to shortlist",
  },
  {
    value: 150,
    prefix: "",
    suffix: "+",
    label: "Countries",
    description: "Global coverage",
  },
  {
    value: 94,
    prefix: "",
    suffix: "%",
    label: "Retention Rate",
    description: "Placements that last 6+ months",
  },
  {
    value: 1000,
    prefix: "",
    suffix: "+",
    label: "Engineers on Platform",
    description: "Pre-vetted and active",
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
    <span
      ref={ref}
      className="text-pulse text-3xl font-semibold tracking-tight font-mono lg:text-4xl"
    >
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

const AgencyStats = ({ className }: AgencyStatsProps) => {
  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      <div className="mb-16 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          By the Numbers
        </span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          The marketplace behind the placements
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
        Based on 2024–2025 marketplace data
      </p>
    </section>
  );
};

export { AgencyStats };
