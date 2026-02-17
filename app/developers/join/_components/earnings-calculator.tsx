"use client";

import { useMemo, useState } from "react";

import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type RoleId = "frontend" | "fullstack" | "backend" | "mobile" | "ai";
type LocationId =
  | "india"
  | "south-africa"
  | "egypt"
  | "nigeria"
  | "kenya"
  | "pakistan"
  | "brazil"
  | "mexico"
  | "indonesia"
  | "philippines"
  | "eastern-europe"
  | "western-europe";

const roles: Array<{ id: RoleId; label: string; baseHourlyUsd: number }> = [
  { id: "frontend", label: "Frontend Engineer", baseHourlyUsd: 44 },
  { id: "fullstack", label: "Full-Stack Engineer", baseHourlyUsd: 52 },
  { id: "backend", label: "Backend Engineer", baseHourlyUsd: 56 },
  { id: "mobile", label: "Mobile Engineer", baseHourlyUsd: 49 },
  { id: "ai", label: "AI / ML Engineer", baseHourlyUsd: 67 },
];

const locations: Array<{ id: LocationId; label: string; multiplier: number }> = [
  { id: "india", label: "India", multiplier: 0.79 },
  { id: "south-africa", label: "South Africa", multiplier: 0.74 },
  { id: "egypt", label: "Egypt", multiplier: 0.69 },
  { id: "nigeria", label: "Nigeria", multiplier: 0.67 },
  { id: "kenya", label: "Kenya", multiplier: 0.65 },
  { id: "pakistan", label: "Pakistan", multiplier: 0.68 },
  { id: "brazil", label: "Brazil", multiplier: 0.83 },
  { id: "mexico", label: "Mexico", multiplier: 0.81 },
  { id: "indonesia", label: "Indonesia", multiplier: 0.72 },
  { id: "philippines", label: "Philippines", multiplier: 0.7 },
  { id: "eastern-europe", label: "Eastern Europe", multiplier: 0.91 },
  { id: "western-europe", label: "Western Europe", multiplier: 1.08 },
];

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const EarningsCalculator = () => {
  const [role, setRole] = useState<RoleId>("fullstack");
  const [location, setLocation] = useState<LocationId>("india");
  const [years, setYears] = useState<number[]>([5]);
  const [hours, setHours] = useState<number[]>([35]);

  const selectedRole = useMemo(
    () => roles.find((item) => item.id === role) ?? roles[0],
    [role],
  );

  const selectedLocation = useMemo(
    () => locations.find((item) => item.id === location) ?? locations[0],
    [location],
  );

  const experienceMultiplier = useMemo(() => {
    const calculated = 0.78 + years[0] * 0.065;
    return Math.min(1.62, Number(calculated.toFixed(2)));
  }, [years]);

  const estimates = useMemo(() => {
    const hourly =
      selectedRole.baseHourlyUsd *
      selectedLocation.multiplier *
      experienceMultiplier;
    const weekly = hourly * hours[0];
    const monthly = weekly * 4.33;
    const annual = monthly * 12;
    const lower = monthly * 0.86;
    const upper = monthly * 1.14;

    return {
      hourly,
      monthly,
      annual,
      lower,
      upper,
    };
  }, [experienceMultiplier, hours, selectedLocation.multiplier, selectedRole.baseHourlyUsd]);

  const locationBars = useMemo(() => {
    const bars = locations.map((item) => {
      const monthly =
        selectedRole.baseHourlyUsd *
        item.multiplier *
        experienceMultiplier *
        hours[0] *
        4.33;

      return {
        id: item.id,
        label: item.label,
        monthly,
      };
    });

    const maxMonthly = Math.max(...bars.map((item) => item.monthly));

    return bars.map((item) => ({
      ...item,
      percent: Math.round((item.monthly / maxMonthly) * 100),
    }));
  }, [experienceMultiplier, hours, selectedRole.baseHourlyUsd]);

  return (
    <div className="rounded-2xl border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
            Role
          </p>
          <Select value={role} onValueChange={(value) => setRole(value as RoleId)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="mb-2 text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
            Location
          </p>
          <Select
            value={location}
            onValueChange={(value) => setLocation(value as LocationId)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 grid gap-5">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
              Experience
            </p>
            <p className="text-sm font-semibold">{years[0]} years</p>
          </div>
          <Slider
            value={years}
            min={1}
            max={12}
            step={1}
            onValueChange={setYears}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
              Weekly hours
            </p>
            <p className="text-sm font-semibold">{hours[0]} hrs/week</p>
          </div>
          <Slider
            value={hours}
            min={10}
            max={40}
            step={1}
            onValueChange={setHours}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
          <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
            Hourly
          </p>
          <p className="mt-1 text-xl font-semibold text-pulse">
            {usd.format(estimates.hourly)}
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
          <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
            Monthly
          </p>
          <p className="mt-1 text-xl font-semibold text-pulse">
            {usd.format(estimates.monthly)}
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
          <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
            Annualized
          </p>
          <p className="mt-1 text-xl font-semibold text-pulse">
            {usd.format(estimates.annual)}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-pulse/25 bg-pulse/10 p-3">
        <p className="text-xs text-muted-foreground">
          Typical monthly range for this profile:
          <span className="ml-1 font-semibold text-foreground">
            {usd.format(estimates.lower)} - {usd.format(estimates.upper)}
          </span>
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
          Relative Earnings By Country (same role/experience)
        </p>
        <div className="space-y-3">
          {locationBars.map((item) => (
            <div key={item.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span>{item.label}</span>
                <span className="font-medium">{usd.format(item.monthly)}</span>
              </div>
              <Progress value={item.percent} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { EarningsCalculator };
