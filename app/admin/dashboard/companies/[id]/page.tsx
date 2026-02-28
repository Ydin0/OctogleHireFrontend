"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  Phone,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { use } from "react";

import {
  type CompanyProfile,
  activateCompany,
  fetchCompany,
  updateCompanyStatus,
} from "@/lib/api/companies";
import { CompanyInvoices } from "./_components/company-invoices";
import {
  type CompanyStatus,
  companyStatusBadgeClass,
  companyStatusLabel,
  formatDate,
  getInitials,
  priorityBadgeClass,
  priorityLabel,
  requirementStatusBadgeClass,
  requirementStatusLabel,
} from "../../_components/dashboard-data";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const allCompanyStatuses: CompanyStatus[] = [
  "enquired",
  "pending",
  "contacted",
  "active",
  "inactive",
];

const CompanyDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { getToken } = useAuth();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [activating, setActivating] = useState(false);

  const load = useCallback(async () => {
    const token = await getToken();
    const data = await fetchCompany(token, id);
    setCompany(data);
    setLoading(false);
  }, [getToken, id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (newStatus: string) => {
    if (!company) return;
    setUpdatingStatus(true);
    const token = await getToken();
    const updated = await updateCompanyStatus(
      token,
      company.id,
      newStatus as CompanyStatus,
    );
    if (updated) {
      setCompany(updated);
    } else {
      setCompany({ ...company, status: newStatus as CompanyStatus });
    }
    setUpdatingStatus(false);
  };

  const handleActivate = async () => {
    if (!company) return;
    setActivating(true);
    try {
      const token = await getToken();
      const activated = await activateCompany(token, company.id);
      if (activated) {
        setCompany(activated);
      } else {
        setCompany({ ...company, status: "active" });
      }
    } catch {
      // Activation failed — keep current state
    } finally {
      setActivating(false);
      setActivateOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!company) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Company not found.
        </CardContent>
      </Card>
    );
  }

  // ── Computed stats ──────────────────────────────────────────────────────
  const totalRequirements = company.requirements.length;
  const openPositions = company.requirements
    .filter((r) => r.status !== "closed" && r.status !== "filled")
    .reduce((sum, r) => sum + r.developersNeeded, 0);
  const matchedEngineers = company.requirements.reduce((sum, r) => {
    const matches = r.proposedMatches ?? [];
    return (
      sum +
      matches.filter((m) => m.status === "accepted" || m.status === "active")
        .length
    );
  }, 0);
  const totalNeeded = company.requirements.reduce(
    (sum, r) => sum + r.developersNeeded,
    0,
  );
  const fillRate = totalNeeded > 0 ? Math.round((matchedEngineers / totalNeeded) * 100) : 0;

  const latestReqDate =
    company.requirements.length > 0
      ? company.requirements.reduce((latest, r) =>
          r.createdAt > latest.createdAt ? r : latest,
        ).createdAt
      : null;

  return (
    <>
      {/* ── Back navigation ──────────────────────────────────────────── */}
      <Link
        href="/admin/dashboard/companies"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Companies
      </Link>

      {/* ── Enquired Lead Banner ─────────────────────────────────────── */}
      {company.status === "enquired" && (
        <Card className="border-violet-600/20 bg-violet-500/5">
          <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-violet-500/10">
                <UserPlus className="size-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  New Enquiry — Not Yet Activated
                </p>
                <p className="text-xs text-muted-foreground">
                  This company signed up but hasn&apos;t been given account access yet.
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
            <DialogTitle>Activate Company Account</DialogTitle>
            <DialogDescription>
              This will change {company.companyName}&apos;s status to Active. They
              will receive login access and be able to view the platform. You
              can reverse this by changing the status back.
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
                <Building2 className="size-8 text-pulse" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">
                  {company.companyName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {company.contactName}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Badge
                    variant="outline"
                    className={companyStatusBadgeClass(company.status)}
                  >
                    {companyStatusLabel[company.status]}
                  </Badge>
                  {company.website && (
                    <a
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="size-3" />
                      {company.website}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <Select
                value={company.status}
                onValueChange={handleStatusChange}
                disabled={updatingStatus}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allCompanyStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {companyStatusLabel[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Quick Stats Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <FileText className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Requirements
              </p>
              <p className="font-mono text-lg font-semibold">
                {totalRequirements}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Briefcase className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Open Positions
              </p>
              <p className="font-mono text-lg font-semibold">
                {openPositions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Users className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Matched Engineers
              </p>
              <p className="font-mono text-lg font-semibold">
                {matchedEngineers}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
              <TrendingUp className="size-5 text-violet-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Fill Rate
              </p>
              <p className="font-mono text-lg font-semibold">{fillRate}%</p>
              <Progress value={fillRate} className="mt-1 h-1.5" />
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
                <span>{company.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <span>{company.phone}</span>
              </div>
              {company.website && (
                <div className="flex items-center gap-3 text-sm">
                  <ExternalLink className="size-4 text-muted-foreground" />
                  <a
                    href={`https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pulse underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              {company.requirements.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No requirements posted yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {company.requirements.map((req) => {
                    const matches = req.proposedMatches ?? [];
                    const acceptedCount = matches.filter(
                      (m) =>
                        m.status === "accepted" || m.status === "active",
                    ).length;
                    const fillPct =
                      req.developersNeeded > 0
                        ? Math.round(
                            (acceptedCount / req.developersNeeded) * 100,
                          )
                        : 0;

                    return (
                      <Link
                        key={req.id}
                        href={`/admin/dashboard/companies/${company.id}/requirements/${req.id}`}
                        className="block rounded-lg border border-border/70 p-4 transition-colors hover:border-pulse/30"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold">
                                {req.title}
                              </p>
                              <Badge
                                variant="outline"
                                className={priorityBadgeClass(req.priority)}
                              >
                                {priorityLabel[req.priority]}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={requirementStatusBadgeClass(
                                  req.status,
                                )}
                              >
                                {requirementStatusLabel[req.status]}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {req.techStack.slice(0, 4).map((tech) => (
                                <Badge
                                  key={tech}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tech}
                                </Badge>
                              ))}
                              {req.techStack.length > 4 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  +{req.techStack.length - 4}
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <span className="capitalize">
                                {req.experienceLevel}
                              </span>
                              <span className="capitalize">
                                {req.engagementType.replace("-", " ")}
                              </span>
                              {req.budgetMin && req.budgetMax ? (
                                <span className="font-mono">
                                  ${req.budgetMin}–${req.budgetMax}/hr
                                </span>
                              ) : (
                                <span>Flexible budget</span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <Progress
                                value={fillPct}
                                className="h-1.5 flex-1"
                              />
                              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                                {acceptedCount}/{req.developersNeeded}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoices */}
          <CompanyInvoices companyId={company.id} />
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              {company.teamMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No team members yet.
                </p>
              ) : (
                <>
                  <AvatarGroup className="mb-3">
                    {company.teamMembers.slice(0, 4).map((member) => (
                      <Avatar key={member.id} size="sm">
                        <AvatarFallback>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {company.teamMembers.length > 4 && (
                      <AvatarGroupCount>
                        +{company.teamMembers.length - 4}
                      </AvatarGroupCount>
                    )}
                  </AvatarGroup>
                  <Separator className="mb-3" />
                  <div className="space-y-3">
                    {company.teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3"
                      >
                        <Avatar size="sm">
                          <AvatarFallback className="text-[10px]">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Company Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Account Created
                  </p>
                  <p className="font-medium">
                    {formatDate(company.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span
                  className={`size-2.5 rounded-full ${
                    company.status === "active"
                      ? "bg-emerald-500"
                      : company.status === "enquired"
                        ? "bg-violet-500"
                        : company.status === "inactive"
                          ? "bg-zinc-400"
                          : "bg-amber-500"
                  }`}
                />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Current Status
                  </p>
                  <p className="font-medium">
                    {companyStatusLabel[company.status]}
                  </p>
                </div>
              </div>

              {latestReqDate && (
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Latest Requirement
                    </p>
                    <p className="font-medium">
                      {formatDate(latestReqDate)}
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

export default CompanyDetailPage;
