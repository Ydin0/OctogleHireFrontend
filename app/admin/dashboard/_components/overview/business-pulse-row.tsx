"use client";

import {
  Briefcase,
  Building2,
  ClipboardList,
  Globe,
} from "lucide-react";

import type { AdminOverview } from "@/lib/api/admin";
import { KpiCard } from "./kpi-card";

interface BusinessPulseRowProps {
  overview: AdminOverview;
}

/** Top-row business pulse: New Companies (demand) / Engagements Started
 *  (delivery) / Live Developers (supply) / Open Work (ops backlog). Every
 *  card respects the active time window. */
export function BusinessPulseRow({ overview }: BusinessPulseRowProps) {
  const d = overview.delta;
  const openWorkTotal =
    overview.openWork.openRequirements +
    overview.openWork.pendingApprovals +
    overview.openWork.pendingReviews +
    overview.openWork.pendingEnquiries;

  const hint = `vs prior ${overview.range.days}d`;

  // Net change in live developer count across the window. Pulled out so the
  // hint reads naturally: "+3 since 30d ago" / "no change".
  const liveDelta =
    d.liveDevelopers.current - d.liveDevelopers.previous;
  const liveHint =
    liveDelta === 0
      ? "no change in window"
      : `${liveDelta > 0 ? "+" : ""}${liveDelta} in window`;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        icon={<Building2 className="size-5 text-sky-600" />}
        tint="bg-sky-500/10"
        label="New Companies"
        value={String(d.newCompanies.current)}
        pctChange={d.newCompanies.pctChange}
        hint={hint}
      />
      <KpiCard
        icon={<Briefcase className="size-5 text-violet-600" />}
        tint="bg-violet-500/10"
        label="Engagements Started"
        value={String(d.newActiveEngagements.current)}
        pctChange={d.newActiveEngagements.pctChange}
        hint={hint}
      />
      <KpiCard
        icon={<Globe className="size-5 text-cyan-600" />}
        tint="bg-cyan-500/10"
        label="Live Developers"
        value={String(d.liveDevelopers.current)}
        pctChange={d.liveDevelopers.pctChange}
        hint={liveHint}
      />
      <KpiCard
        icon={<ClipboardList className="size-5 text-amber-600" />}
        tint="bg-amber-500/10"
        label="Open Work"
        value={String(openWorkTotal)}
        hint="items waiting"
      />
    </div>
  );
}
