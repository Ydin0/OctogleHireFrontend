"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import type { CompanyEngagement } from "@/lib/api/companies";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { EngagementDetails } from "./engagement-details";

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "pending":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "cancelled":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    case "ended":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

const statusLabel: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  cancelled: "Cancelled",
  ended: "Ended",
};

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

function currentMonthIndicator(engagement: CompanyEngagement) {
  const te = engagement.currentMonthTimeEntry;
  if (!te) {
    return (
      <span className="flex items-center gap-1 text-xs text-amber-600">
        <span className="size-1.5 rounded-full bg-amber-500" />
        Awaiting submission
      </span>
    );
  }
  if (te.status === "rejected") {
    return (
      <span className="flex items-center gap-1 text-xs text-red-600">
        <span className="size-1.5 rounded-full bg-red-500" />
        Rejected ({te.hours}h)
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-emerald-600">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      Hours submitted ({te.hours}h)
    </span>
  );
}

interface EngagementRowProps {
  engagement: CompanyEngagement;
  token: string;
  companyId?: string;
  companyName?: string;
  companyLogoUrl?: string | null;
}

function EngagementRow({ engagement, token, companyId, companyName, companyLogoUrl }: EngagementRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div className="rounded-md border">
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar className="size-9 shrink-0">
                {engagement.developerAvatar && (
                  <AvatarImage src={engagement.developerAvatar} alt={engagement.developerName} />
                )}
                <AvatarFallback className="text-xs">
                  {getInitials(engagement.developerName || "D")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/companies/dashboard/developers/${engagement.developerId}`}
                    className="truncate text-sm font-medium hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {engagement.developerName}
                  </Link>
                  <Badge variant="outline" className={statusBadgeClass(engagement.status)}>
                    {statusLabel[engagement.status] ?? engagement.status}
                  </Badge>
                  {engagement.pendingChangeRequests > 0 && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-600/20">
                      {engagement.pendingChangeRequests} pending
                    </Badge>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {engagement.developerRole}
                </p>
                <p className="text-xs text-muted-foreground">
                  {engagement.requirementTitle}
                </p>
                {engagement.status === "active" && (
                  <div className="mt-1">{currentMonthIndicator(engagement)}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="font-mono text-sm">
                  {formatCurrency(engagement.companyBillingRate, engagement.currency)}/hr
                </p>
                <p className="text-xs text-muted-foreground">{engagement.engagementType}</p>
                {engagement.startDate && (
                  <p className="text-xs text-muted-foreground">
                    Since {new Date(engagement.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t">
            <EngagementDetails engagement={engagement} token={token} companyId={companyId} companyName={companyName} companyLogoUrl={companyLogoUrl} />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export { EngagementRow };
