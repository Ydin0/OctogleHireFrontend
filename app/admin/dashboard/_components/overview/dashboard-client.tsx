"use client";

import { ShieldCheck } from "lucide-react";

import type {
  AdminOverview,
  AdminOverviewFilters,
} from "@/lib/api/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TimeRangeBar } from "./time-range-bar";
import { CategoryFilter } from "./category-filter";
import { BusinessPulseRow } from "./business-pulse-row";
import { ApplicantKpiGrid } from "./kpi-grid";
import { ApplicantsTrendChart } from "./applicants-trend-chart";
import { PipelineFunnel } from "./pipeline-funnel";
import { TopBars } from "./top-bars";
import { SourceDonut } from "./source-donut";
import { ActivityFeed } from "./activity-feed";
import { OpenWorkCard } from "./open-work-card";

interface DashboardClientProps {
  overview: AdminOverview | null;
  filters: AdminOverviewFilters;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  token: string;
}

const titlecase = (s: string) =>
  s.length === 0 ? s : s[0]!.toUpperCase() + s.slice(1);

/** Top-level layout for the rebuilt admin dashboard. Reads filters from
 *  searchParams (server-side) and arranges the row-stack of widgets. */
export function DashboardClient({ overview, filters }: DashboardClientProps) {
  if (!overview) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          Couldn&apos;t load the dashboard. Try refreshing.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* ── Hero + filters ─────────────────────────────────────────── */}
      <Card className="overflow-hidden border-pulse/30">
        <CardContent className="space-y-4 p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="gap-1.5 border-pulse/40 bg-pulse/10 text-pulse"
              >
                <ShieldCheck className="size-3.5" />
                Admin Workspace
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                Dashboard
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Live operating picture across applicants, companies,
                engagements and revenue. Filter the window or applicant type
                — every widget below updates.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryFilter selected={filters.categories ?? []} />
              <TimeRangeBar
                range={filters.range ?? "30d"}
                from={overview.range.from}
                to={overview.range.to}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Business pulse ──────────────────────────────────────── */}
      <BusinessPulseRow overview={overview} />

      {/* ── Applicant KPIs ──────────────────────────────────────── */}
      <ApplicantKpiGrid overview={overview} />

      {/* ── Trend chart + pipeline funnel ───────────────────────── */}
      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ApplicantsTrendChart
            data={overview.applicantsByPeriod}
            granularity={overview.range.granularity}
          />
        </div>
        <PipelineFunnel snapshot={overview.pipelineSnapshot} />
      </section>

      {/* ── Top bars row ────────────────────────────────────────── */}
      <section className="grid gap-4 md:grid-cols-3">
        <TopBars
          title="Top tech stacks"
          rows={overview.topStacks}
          barClass="bg-sky-500"
          emptyText="No stacks in this window."
        />
        <TopBars
          title="Top categories"
          rows={overview.topCategories}
          barClass="bg-violet-500"
          formatLabel={titlecase}
          emptyText="No categories yet."
        />
        <TopBars
          title="Top locations"
          rows={overview.topLocations}
          barClass="bg-emerald-500"
          emptyText="No locations yet."
        />
      </section>

      {/* ── Sources + open work ─────────────────────────────────── */}
      <section className="grid gap-4 md:grid-cols-2">
        <SourceDonut data={overview.sourceBreakdown} />
        <OpenWorkCard data={overview.openWork} />
      </section>

      {/* ── Activity feed ───────────────────────────────────────── */}
      <ActivityFeed events={overview.recentActivity} />
    </>
  );
}
