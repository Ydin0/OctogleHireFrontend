"use client";

import {
  Banknote,
  Briefcase,
  Building2,
  ClipboardList,
} from "lucide-react";

import type { AdminOverview } from "@/lib/api/admin";
import { useAdminCurrency } from "../admin-currency-context";
import { formatCurrency } from "../dashboard-data";
import { KpiCard } from "./kpi-card";

interface BusinessPulseRowProps {
  overview: AdminOverview;
}

/** Top-row business pulse: New Companies / Active Engagements / Revenue /
 *  Open Work. Always reflects the active time window. */
export function BusinessPulseRow({ overview }: BusinessPulseRowProps) {
  const { displayCurrency } = useAdminCurrency();
  const d = overview.delta;
  const openWorkTotal =
    overview.openWork.openRequirements +
    overview.openWork.pendingApprovals +
    overview.openWork.pendingReviews +
    overview.openWork.pendingEnquiries;

  const hint = `vs prior ${overview.range.days}d`;

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
        icon={<Banknote className="size-5 text-emerald-600" />}
        tint="bg-emerald-500/10"
        label="Revenue collected"
        value={formatCurrency(d.revenue.current, displayCurrency)}
        pctChange={d.revenue.pctChange}
        hint={`${d.newInvoicesPaid.current} invoices paid`}
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
