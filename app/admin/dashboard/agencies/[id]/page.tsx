import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  fetchAdminAgency,
  fetchAdminAgencyCandidates,
  fetchAdminAgencyCommissions,
} from "@/lib/api/agencies";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AgencyDetailClient } from "./_components/agency-detail-client";

const statusBadge: Record<string, string> = {
  pending: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  active: "border-emerald-600/20 bg-emerald-500/10 text-emerald-600",
  suspended: "border-red-600/20 bg-red-500/10 text-red-600",
};

const commissionStatusBadge: Record<string, string> = {
  pending: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  accruing: "border-blue-600/20 bg-blue-500/10 text-blue-600",
  paid: "border-emerald-600/20 bg-emerald-500/10 text-emerald-600",
  cancelled: "border-red-600/20 bg-red-500/10 text-red-600",
};

const formatCurrency = (cents: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);

interface AgencyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAgencyDetailPage({
  params,
}: AgencyDetailPageProps) {
  const { getToken } = await auth();
  const token = await getToken();
  const { id } = await params;

  const [agency, candidates, commissions] = await Promise.all([
    fetchAdminAgency(token, id),
    fetchAdminAgencyCandidates(token, id),
    fetchAdminAgencyCommissions(token, id),
  ]);

  if (!agency) {
    notFound();
  }

  return (
    <>
      <Link
        href="/admin/dashboard/agencies"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Agencies
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {agency.logo && (
                  <img
                    src={agency.logo}
                    alt=""
                    className="size-10 rounded-md object-contain"
                  />
                )}
                <h1 className="text-2xl font-semibold">{agency.name}</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                {agency.contactName} &middot; {agency.email}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Badge
                  variant="outline"
                  className={statusBadge[agency.status] ?? statusBadge.pending}
                >
                  {agency.status}
                </Badge>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {agency.referralCode}
                </code>
                <span className="font-mono text-xs text-muted-foreground">
                  {agency.commissionRate}% commission
                </span>
              </div>
            </div>

            <AgencyDetailClient agency={agency} token={token!} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Candidates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Sourced Candidates ({candidates?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!candidates || candidates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No candidates sourced yet.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {candidates.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/dashboard/applicants/${c.id}`}
                    className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-accent/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {c.fullName ?? "Unknown"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.professionalTitle ?? c.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {c.status.replace(/_/g, " ")}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commissions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Commissions ({commissions?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!commissions || commissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No commissions recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {commissions.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {c.developerName ?? "Unknown"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.companyName ?? "-"} &middot; {c.commissionRate}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-medium">
                        {formatCurrency(c.totalEarnedCents, c.currency)}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${commissionStatusBadge[c.status] ?? commissionStatusBadge.pending}`}
                      >
                        {c.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
