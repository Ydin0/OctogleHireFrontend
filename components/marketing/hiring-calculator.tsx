"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface HiringCalculatorProps {
  className?: string;
}

const HiringCalculator = ({ className }: HiringCalculatorProps) => {
  const [teamSize, setTeamSize] = useState([3]);
  const [monthsUnfilled, setMonthsUnfilled] = useState([2]);
  const [monthlySalary, setMonthlySalary] = useState([8000]);

  const results = useMemo(() => {
    const lostProductivity = teamSize[0] * monthsUnfilled[0] * monthlySalary[0];
    const recruitmentCost = monthlySalary[0] * 3;
    const total = lostProductivity + recruitmentCost;
    const savings = Math.round(total * 0.7);
    return { lostProductivity, recruitmentCost, total, savings };
  }, [teamSize, monthsUnfilled, monthlySalary]);

  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mb-12 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Calculator
        </span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          Quantify the cost
          of slow hiring
        </h2>
      </div>

      <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-muted/30 p-8 md:p-12">
        <div className="space-y-10">
          {/* Slider 1: Open roles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Open engineering roles</label>
              <span className="font-mono text-sm font-semibold">{teamSize[0]}</span>
            </div>
            <Slider
              value={teamSize}
              onValueChange={setTeamSize}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Number of unfilled developer positions right now
            </p>
          </div>

          {/* Slider 2: Months unfilled */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Average months each role stays open</label>
              <span className="font-mono text-sm font-semibold">{monthsUnfilled[0]} mo</span>
            </div>
            <Slider
              value={monthsUnfilled}
              onValueChange={setMonthsUnfilled}
              min={1}
              max={12}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Time from posting to hire using your current process
            </p>
          </div>

          {/* Slider 3: Monthly salary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Average monthly developer salary</label>
              <span className="font-mono text-sm font-semibold">${monthlySalary[0].toLocaleString()}</span>
            </div>
            <Slider
              value={monthlySalary}
              onValueChange={setMonthlySalary}
              min={2000}
              max={25000}
              step={500}
              className="w-full"
            />
          </div>

          {/* Result */}
          <div className="rounded-2xl border border-border bg-background p-6 space-y-4">
            <p className="text-2xl font-medium leading-snug">
              You&apos;re losing{" "}
              <span className="font-mono font-semibold text-foreground">
                {fmt(results.lostProductivity)}
              </span>{" "}
              in lost productivity — plus{" "}
              <span className="font-mono font-semibold text-foreground">
                {fmt(results.recruitmentCost)}
              </span>{" "}
              in recruitment costs.
            </p>
            <p className="text-muted-foreground text-sm">
              OctogleHire could save you{" "}
              <span className="font-mono font-semibold text-foreground">
                {fmt(results.savings)}
              </span>{" "}
              by filling your roles in 48 hours at a fraction of traditional
              agency fees.
            </p>
            <Button asChild className="w-full rounded-full gap-2" size="lg">
              <a href="/companies/signup">
                Fill Your Roles Now
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HiringCalculator };
