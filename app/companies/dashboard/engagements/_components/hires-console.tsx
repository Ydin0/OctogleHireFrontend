"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Coins,
  Globe,
  MessageSquare,
  Plus,
  Users,
} from "lucide-react";

import type { CompanyEngagement } from "@/lib/api/companies";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  EmptyState,
  Mono,
  PageHead,
  PageScroll,
  StatusPill,
  SummaryStat,
} from "../../_components/console-ui";
import { EngagementDetails } from "./engagement-details";

const money = (n: number) => "$" + Math.round(n).toLocaleString();

interface HiresConsoleProps {
  engagements: CompanyEngagement[];
  token: string;
  companyId?: string;
  companyName?: string;
  companyLogoUrl?: string | null;
}

function HireCard({
  e,
  token,
  companyId,
  companyName,
  companyLogoUrl,
}: {
  e: CompanyEngagement;
  token: string;
  companyId?: string;
  companyName?: string;
  companyLogoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const planned = e.monthlyHoursExpected ?? 160;
  const logged = e.currentMonthTimeEntry?.hours ?? 0;
  const pct = planned > 0 ? Math.min(100, Math.round((logged / planned) * 100)) : 0;
  const monthly = e.companyBillingRate * planned;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-2xl border border-border bg-card"
    >
      <div className="flex flex-wrap gap-4 p-5">
        <span className="inline-flex size-[58px] shrink-0 overflow-hidden rounded-full border border-border bg-muted">
          {e.developerAvatar ? (
            <Image src={e.developerAvatar} alt={e.developerName} width={58} height={58} className="size-full object-cover" unoptimized />
          ) : (
            <span className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground">
              {e.developerName.slice(0, 1)}
            </span>
          )}
        </span>
        <div className="min-w-[240px] flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link
                href={`/companies/dashboard/developers/${e.developerId}`}
                className="text-base font-semibold hover:underline"
              >
                {e.developerName}
              </Link>
              <div className="text-[12.5px] text-pulse">
                {e.developerRole} · {e.requirementTitle}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill status={e.status} />
              {e.pendingChangeRequests > 0 && (
                <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-amber-500">
                  {e.pendingChangeRequests} pending
                </span>
              )}
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap gap-6">
            {[
              ["Started", e.startDate ? new Date(e.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"],
              ["Rate", `${money(e.companyBillingRate)}/hr`],
              ["Run-rate", `${money(monthly)}/mo`],
              ["Type", e.engagementType],
            ].map(([k, v]) => (
              <div key={k}>
                <Mono className="mb-1 block text-[9px] text-muted-foreground">{k}</Mono>
                <span className={cn("text-[13px] font-medium", (k === "Rate" || k === "Run-rate") && "font-mono")}>
                  {v}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-[11.5px] text-muted-foreground">
              <span>Hours logged · this month</span>
              <Mono className="text-[10px]">{logged} / {planned} hrs</Mono>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-pulse transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" className="rounded-full">
              <Link href={`/companies/dashboard/developers/${e.developerId}`}>View profile</Link>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <MessageSquare className="size-3.5" /> Message
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full">
                Manage
                <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
      </div>
      <CollapsibleContent>
        <div className="border-t border-border">
          <EngagementDetails
            engagement={e}
            token={token}
            companyId={companyId}
            companyName={companyName}
            companyLogoUrl={companyLogoUrl}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function HiresConsole({
  engagements,
  token,
  companyId,
  companyName,
  companyLogoUrl,
}: HiresConsoleProps) {
  const active = engagements.filter((e) => e.status === "active");
  const runRate = active.reduce(
    (s, e) => s + e.companyBillingRate * (e.monthlyHoursExpected ?? 160),
    0,
  );
  const countries = new Set(
    engagements.map((e) => e.requirementTitle).filter(Boolean),
  ).size;
  const pending = engagements.filter((e) => e.pendingChangeRequests > 0).length;

  return (
    <PageScroll>
      <PageHead
        eyebrow="Hires"
        title="Your team"
        subtitle="Everyone you've hired through OctogleHire — contracts, payroll, and compliance handled for every engagement."
      />
      {engagements.length > 0 ? (
        <>
          <div className="mb-6 flex flex-wrap gap-3.5">
            <SummaryStat icon={<Users className="size-4" />} value={active.length} label="Active engagements" />
            <SummaryStat icon={<Coins className="size-4" />} value={`${money(runRate)}/mo`} label="Monthly run-rate" accent />
            <SummaryStat icon={<Globe className="size-4" />} value={countries} label="Active roles" />
            <SummaryStat icon={<MessageSquare className="size-4" />} value={pending} label="Pending requests" />
          </div>
          <div className="flex flex-col gap-3.5">
            {engagements.map((e) => (
              <HireCard
                key={e.id}
                e={e}
                token={token}
                companyId={companyId}
                companyName={companyName}
                companyLogoUrl={companyLogoUrl}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Users className="size-6" />}
          title="No active hires yet"
          body="Post a role and your account manager will match vetted engineers. Accepted candidates become engagements here."
          action={
            <Button asChild className="rounded-full">
              <Link href="/companies/dashboard/requirements">
                <Plus className="size-4" /> Post a role
              </Link>
            </Button>
          }
        />
      )}
    </PageScroll>
  );
}
