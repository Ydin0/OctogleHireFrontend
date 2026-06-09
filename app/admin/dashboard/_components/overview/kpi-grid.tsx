"use client";

import {
  CheckCircle2,
  Percent,
  UserPlus,
  XCircle,
} from "lucide-react";

import type { AdminOverview } from "@/lib/api/admin";
import { KpiCard } from "./kpi-card";

interface KpiGridProps {
  overview: AdminOverview;
}

/** Applicant KPI row: New Applicants, Approved, Rejected, Conversion Rate.
 *  All four reflect the active time window + category filter. */
export function ApplicantKpiGrid({ overview }: KpiGridProps) {
  const d = overview.delta;
  const hint = `vs prior ${overview.range.days}d`;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        icon={<UserPlus className="size-5 text-blue-600" />}
        tint="bg-blue-500/10"
        label="New Applicants"
        value={String(d.newApplicants.current)}
        pctChange={d.newApplicants.pctChange}
        hint={hint}
      />
      <KpiCard
        icon={<CheckCircle2 className="size-5 text-emerald-600" />}
        tint="bg-emerald-500/10"
        label="Approved"
        value={String(d.approvedApplicants.current)}
        pctChange={d.approvedApplicants.pctChange}
        hint={hint}
      />
      <KpiCard
        icon={<XCircle className="size-5 text-red-600" />}
        tint="bg-red-500/10"
        label="Rejected"
        value={String(d.rejectedApplicants.current)}
        pctChange={d.rejectedApplicants.pctChange}
        hint={hint}
      />
      <KpiCard
        icon={<Percent className="size-5 text-amber-600" />}
        tint="bg-amber-500/10"
        label="Conversion Rate"
        value={`${d.conversionRate.current.toFixed(1)}%`}
        hint={`prev ${d.conversionRate.previous.toFixed(1)}%`}
      />
    </div>
  );
}
