"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Check,
  Copy,
  DollarSign,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { use } from "react";

import type {
  Agency,
  AgencyCandidate,
  AgencyCommission,
  AdminAgencyPitch,
  AdminAgencyStats,
} from "@/lib/api/agencies";
import {
  activateAdminAgency,
  fetchAdminAgency,
  fetchAdminAgencyCandidates,
  fetchAdminAgencyCommissions,
  fetchAdminAgencyPitchesForAgency,
  fetchAdminAgencyStats,
  markCommissionPaid,
  updateAdminAgency,
} from "@/lib/api/agencies";
import { formatDate } from "../../_components/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusBadge: Record<string, string> = {
  pending: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  active: "border-emerald-600/20 bg-emerald-500/10 text-emerald-600",
  suspended: "border-red-600/20 bg-red-500/10 text-red-600",
};

const pitchStatusBadge: Record<string, string> = {
  pending: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  approved: "border-emerald-600/20 bg-emerald-500/10 text-emerald-600",
  rejected: "border-red-600/20 bg-red-500/10 text-red-600",
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

const AgencyDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { getToken } = useAuth();

  const [agency, setAgency] = useState<Agency | null>(null);
  const [stats, setStats] = useState<AdminAgencyStats | null>(null);
  const [candidates, setCandidates] = useState<AgencyCandidate[] | null>(null);
  const [commissions, setCommissions] = useState<AgencyCommission[] | null>(
    null,
  );
  const [pitches, setPitches] = useState<AdminAgencyPitch[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [activating, setActivating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [payingCommission, setPayingCommission] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = await getToken();
    const [agencyData, statsData, candidatesData, commissionsData, pitchesData] =
      await Promise.all([
        fetchAdminAgency(token, id),
        fetchAdminAgencyStats(token, id),
        fetchAdminAgencyCandidates(token, id),
        fetchAdminAgencyCommissions(token, id),
        fetchAdminAgencyPitchesForAgency(token, id),
      ]);
    setAgency(agencyData);
    setStats(statsData);
    setCandidates(candidatesData);
    setCommissions(commissionsData);
    setPitches(pitchesData);
    setLoading(false);
  }, [getToken, id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (newStatus: string) => {
    if (!agency) return;
    setUpdatingStatus(true);
    const token = await getToken();
    const updated = await updateAdminAgency(token, agency.id, {
      status: newStatus,
    });
    if (updated) {
      setAgency(updated);
    } else {
      setAgency({ ...agency, status: newStatus });
    }
    setUpdatingStatus(false);
  };

  const handleActivate = async () => {
    if (!agency) return;
    setActivating(true);
    try {
      const token = await getToken();
      const activated = await activateAdminAgency(token, agency.id);
      setAgency(activated);
    } catch {
      // Activation failed — keep current state
    } finally {
      setActivating(false);
      setActivateOpen(false);
    }
  };

  const handleCopyReferral = async () => {
    if (!agency) return;
    await navigator.clipboard.writeText(agency.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkPaid = async (commissionId: string) => {
    if (!agency) return;
    setPayingCommission(commissionId);
    const token = await getToken();
    const updated = await markCommissionPaid(token, agency.id, commissionId);
    if (updated && commissions) {
      setCommissions(
        commissions.map((c) => (c.id === commissionId ? updated : c)),
      );
    }
    setPayingCommission(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!agency) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Agency not found.
        </CardContent>
      </Card>
    );
  }

  const totalEarned = stats?.totalCommissionsCents ?? 0;
  const totalPaid = stats?.paidCommissionsCents ?? 0;
  const totalPending = totalEarned - totalPaid;

  return (
    <>
      {/* ── Back navigation ──────────────────────────────────────────── */}
      <Link
        href="/admin/dashboard/agencies"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Agencies
      </Link>

      {/* ── Activation Banner ──────────────────────────────────────── */}
      {!agency.clerkOrgId && (
        <Card className="border-violet-600/20 bg-violet-500/5">
          <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-violet-500/10">
                <UserPlus className="size-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Pending Agency — Not Yet Activated
                </p>
                <p className="text-xs text-muted-foreground">
                  This agency hasn&apos;t been given account access yet.
                </p>
              </div>
            </div>
            <Button
              className="bg-pulse text-pulse-foreground hover:bg-pulse/90"
              onClick={() => setActivateOpen(true)}
            >
              Activate Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Activate Dialog ──────────────────────────────────────────── */}
      <Dialog open={activateOpen} onOpenChange={setActivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Agency Account</DialogTitle>
            <DialogDescription>
              This will create a Clerk organization for{" "}
              <strong>{agency.name}</strong>, send a login email to{" "}
              <strong>{agency.email}</strong>, and set the status to Active.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivateOpen(false)}>
              Cancel
            </Button>
            <Button
              className="gap-2 bg-pulse text-pulse-foreground hover:bg-pulse/90"
              disabled={activating}
              onClick={handleActivate}
            >
              {activating && <Loader2 className="size-4 animate-spin" />}
              Confirm Activation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Header Card ──────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-pulse/10">
                <Briefcase className="size-8 text-pulse" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{agency.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {agency.contactName}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge
                    variant="outline"
                    className={statusBadge[agency.status] ?? statusBadge.pending}
                  >
                    {agency.status}
                  </Badge>
                  {agency.website && (
                    <a
                      href={
                        agency.website.startsWith("http")
                          ? agency.website
                          : `https://${agency.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="size-3" />
                      {agency.website}
                    </a>
                  )}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {agency.referralCode}
                  </code>
                  <span className="font-mono text-xs text-muted-foreground">
                    {agency.commissionRate}% commission
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <Select
                value={agency.status}
                onValueChange={handleStatusChange}
                disabled={updatingStatus}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Quick Stats Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Candidates Sourced
              </p>
              <p className="font-mono text-lg font-semibold">
                {stats?.candidatesSourced ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Briefcase className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Candidates Placed
              </p>
              <p className="font-mono text-lg font-semibold">
                {stats?.candidatesPlaced ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
              <Send className="size-5 text-violet-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Total Pitches
              </p>
              <p className="font-mono text-lg font-semibold">
                {stats?.pitchesTotal ?? 0}
              </p>
              {(stats?.pitchesPending ?? 0) > 0 && (
                <p className="text-[10px] text-muted-foreground">
                  {stats!.pitchesPending} pending
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Check className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Approved Pitches
              </p>
              <p className="font-mono text-lg font-semibold">
                {stats?.pitchesApproved ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
              <DollarSign className="size-5 text-violet-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Total Revenue
              </p>
              <p className="font-mono text-lg font-semibold">
                {formatCurrency(totalEarned, stats?.currency)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Wallet className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Pending Payouts
              </p>
              <p className="font-mono text-lg font-semibold">
                {formatCurrency(totalPending, stats?.currency)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Two-Column Layout ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left column — 2/3 */}
        <div className="space-y-6 xl:col-span-2">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span>{agency.email}</span>
              </div>
              {agency.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{agency.phone}</span>
                </div>
              )}
              {agency.website && (
                <div className="flex items-center gap-3 text-sm">
                  <ExternalLink className="size-4 text-muted-foreground" />
                  <a
                    href={
                      agency.website.startsWith("http")
                        ? agency.website
                        : `https://${agency.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pulse underline"
                  >
                    {agency.website}
                  </a>
                </div>
              )}
              {agency.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{agency.location}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sourced Candidates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Sourced Candidates ({candidates?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!candidates || candidates.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
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
                      {c.profilePhotoPath ? (
                        <img
                          src={c.profilePhotoPath}
                          alt=""
                          className="size-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                          {(c.fullName ?? "?")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {c.fullName ?? "Unknown"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {c.professionalTitle ?? c.email}
                        </p>
                        {c.primaryStack && c.primaryStack.length > 0 && (
                          <div className="mt-0.5 flex flex-wrap gap-1">
                            {c.primaryStack.slice(0, 3).map((tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {tech}
                              </Badge>
                            ))}
                            {c.primaryStack.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
                                +{c.primaryStack.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        {c.status.replace(/_/g, " ")}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pitches */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Pitches ({pitches?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!pitches || pitches.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No pitches submitted yet.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {pitches.map((p) => (
                    <div key={p.id} className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="text-sm font-medium">
                            {p.developer?.name ?? "Unknown Developer"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.requirementTitle ?? "Unknown Requirement"}
                            {p.companyName && ` — ${p.companyName}`}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {formatCurrency(p.pitchedHourlyRate * 100, p.currency)}
                            /hr
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            pitchStatusBadge[p.status] ??
                            pitchStatusBadge.pending
                          }
                        >
                          {p.status}
                        </Badge>
                      </div>
                    </div>
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
              {/* Summary row */}
              {commissions && commissions.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-4 rounded-lg bg-muted/50 p-3 text-sm">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Earned
                    </span>
                    <p className="font-mono font-semibold">
                      {formatCurrency(totalEarned, stats?.currency)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Paid
                    </span>
                    <p className="font-mono font-semibold">
                      {formatCurrency(totalPaid, stats?.currency)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Pending
                    </span>
                    <p className="font-mono font-semibold">
                      {formatCurrency(totalPending, stats?.currency)}
                    </p>
                  </div>
                </div>
              )}

              {!commissions || commissions.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No commissions recorded yet.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {commissions.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {c.developerName ?? "Unknown"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {c.companyName ?? "-"} &middot; {c.commissionRate}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
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
                        {c.status !== "paid" && c.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={payingCommission === c.id}
                            onClick={() => handleMarkPaid(c.id)}
                          >
                            {payingCommission === c.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              "Mark Paid"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          {/* Agency Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Agency Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Referral Code
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                    {agency.referralCode}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-7 p-0"
                    onClick={handleCopyReferral}
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Commission Rate
                </p>
                <p className="mt-0.5 font-mono text-sm font-medium">
                  {agency.commissionRate}%
                </p>
              </div>

              {agency.clerkOrgId && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Clerk Org ID
                  </p>
                  <code className="mt-0.5 block truncate rounded bg-muted px-2 py-1 font-mono text-xs">
                    {agency.clerkOrgId}
                  </code>
                </div>
              )}

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Members
                </p>
                <p className="mt-0.5 font-mono text-sm font-medium">
                  {stats?.membersCount ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Created
                  </p>
                  <p className="font-medium">{formatDate(agency.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span
                  className={`size-2.5 rounded-full ${
                    agency.status === "active"
                      ? "bg-emerald-500"
                      : agency.status === "suspended"
                        ? "bg-red-500"
                        : "bg-amber-500"
                  }`}
                />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Status
                  </p>
                  <p className="font-medium capitalize">{agency.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Last Updated
                  </p>
                  <p className="font-medium">{formatDate(agency.updatedAt)}</p>
                </div>
              </div>

              {agency.clerkOrgId && (
                <div className="flex items-center gap-3 text-sm">
                  <Check className="size-4 text-emerald-600" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Activated On
                    </p>
                    <p className="font-medium">
                      {formatDate(agency.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AgencyDetailPage;
