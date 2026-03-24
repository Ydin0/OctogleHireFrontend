"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { use } from "react";

import type { JobRequirement } from "@/lib/api/companies";
import {
  fetchCompanyRequirementAdmin,
  proposeMatch,
  removeMatch,
} from "@/lib/api/companies";
import {
  updateAdminRequirement,
  toggleRequirementFeatured,
  deleteAdminRequirement,
} from "@/lib/api/admin";
import { getTimezoneLabel } from "@/lib/constants/timezones";
import { experienceLabel } from "@/lib/utils/experience";
import { CountryFlags } from "@/lib/utils/country-flags";
import {
  type RequirementStatus,
  requirementStatusBadgeClass,
  requirementStatusLabel,
  priorityBadgeClass,
  priorityLabel,
  formatDate,
} from "../../_components/dashboard-data";
import { MarkdownDisplay } from "@/components/markdown-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import { CurrentMatches } from "./_components/current-matches";
import { DeveloperPool } from "./_components/developer-pool";

const RequirementDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { getToken } = useAuth();
  const router = useRouter();

  const [requirement, setRequirement] = useState<JobRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    experienceLevel: "",
    priority: "",
    status: "",
    engagementType: "",
    budgetMin: "",
    budgetMax: "",
    developersNeeded: "",
    timezonePreference: "",
    startDate: "",
    techStack: "",
  });

  const loadRequirement = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const data = await fetchCompanyRequirementAdmin(token, id);
    setRequirement(data);

    if (data) {
      setEditForm({
        title: data.title,
        description: data.description,
        experienceLevel: data.experienceLevel,
        priority: data.priority,
        status: data.status,
        engagementType: data.engagementType,
        budgetMin: data.budgetMin ? String(data.budgetMin) : "",
        budgetMax: data.budgetMax ? String(data.budgetMax) : "",
        developersNeeded: String(data.developersNeeded),
        timezonePreference: data.timezonePreference,
        startDate: data.startDate ?? "",
        techStack: data.techStack.join(", "),
      });
    }

    setLoading(false);
  }, [getToken, id]);

  useEffect(() => {
    loadRequirement();
  }, [loadRequirement]);

  const handleSave = async () => {
    const token = await getToken();
    if (!token || !requirement) return;

    setSaving(true);

    const updates: Record<string, unknown> = {
      title: editForm.title,
      description: editForm.description,
      experienceLevel: editForm.experienceLevel,
      priority: editForm.priority,
      status: editForm.status,
      engagementType: editForm.engagementType,
      developersNeeded: parseInt(editForm.developersNeeded) || 1,
      timezonePreference: editForm.timezonePreference,
      startDate: editForm.startDate || null,
      techStack: editForm.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editForm.budgetMin) {
      updates.budgetMinCents = Math.round(parseFloat(editForm.budgetMin) * 100);
    } else {
      updates.budgetMinCents = null;
    }

    if (editForm.budgetMax) {
      updates.budgetMaxCents = Math.round(parseFloat(editForm.budgetMax) * 100);
    } else {
      updates.budgetMaxCents = null;
    }

    const result = await updateAdminRequirement(
      token,
      requirement.id,
      updates as never,
    );

    if (result) {
      setEditing(false);
      await loadRequirement();
    }

    setSaving(false);
  };

  const handleToggleFeatured = async () => {
    const token = await getToken();
    if (!token || !requirement) return;

    await toggleRequirementFeatured(
      token,
      requirement.id,
      !(requirement as unknown as { isFeatured: boolean }).isFeatured,
    );
    await loadRequirement();
  };

  const handleDelete = async () => {
    const token = await getToken();
    if (!token || !requirement) return;

    setDeleting(true);
    const ok = await deleteAdminRequirement(token, requirement.id, true);

    if (ok) {
      router.push("/admin/dashboard/requirements");
    }
    setDeleting(false);
  };

  const handlePropose = async (payload: {
    developerId: string;
    hourlyRate: number;
    monthlyRate: number;
    currency: string;
  }) => {
    const token = await getToken();
    await proposeMatch(token, id, payload);
    await loadRequirement();
  };

  const handleRemoveMatch = async (matchId: string) => {
    const token = await getToken();
    await removeMatch(token, matchId);
    setRequirement((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        proposedMatches: prev.proposedMatches?.filter((m) => m.id !== matchId),
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/dashboard/requirements"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Requirements
        </Link>
        <p className="text-muted-foreground">Requirement not found.</p>
      </div>
    );
  }

  const isFeatured = (requirement as unknown as { isFeatured?: boolean })
    .isFeatured;
  const companyLogoUrl = (
    requirement as unknown as { companyLogoUrl?: string }
  ).companyLogoUrl;
  const companyName = (requirement as unknown as { companyName?: string })
    .companyName;

  const matches = requirement.proposedMatches ?? [];
  const matchedDevIds = new Set(matches.map((m) => m.developerId));
  const acceptedCount = matches.filter(
    (m) => m.status === "accepted" || m.status === "active",
  ).length;
  const fillPct =
    requirement.developersNeeded > 0
      ? Math.round((acceptedCount / requirement.developersNeeded) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/dashboard/requirements"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Requirements
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
              {companyLogoUrl ? (
                <Image
                  src={companyLogoUrl}
                  alt={companyName ?? ""}
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                  unoptimized
                />
              ) : (
                <Building2 className="size-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold">{requirement.title}</h1>
              <p className="text-sm text-muted-foreground">{companyName}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToggleFeatured}>
            <Star
              className={`mr-1.5 size-3.5 ${
                isFeatured ? "fill-amber-400 text-amber-400" : ""
              }`}
            />
            {isFeatured ? "Unfeature" : "Feature"}
          </Button>
          {!editing ? (
            <Button size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-1.5 size-3.5" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                <X className="mr-1.5 size-3.5" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                ) : (
                  <Save className="mr-1.5 size-3.5" />
                )}
                Save
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-1.5 size-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* ── Status badges ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={requirementStatusBadgeClass(
            requirement.status as RequirementStatus,
          )}
        >
          {requirementStatusLabel[requirement.status as RequirementStatus] ??
            requirement.status}
        </Badge>
        <Badge
          variant="outline"
          className={priorityBadgeClass(requirement.priority)}
        >
          {priorityLabel[requirement.priority] ?? requirement.priority}
        </Badge>
        {isFeatured && (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 border-amber-600/20"
          >
            <Star className="mr-1 size-3 fill-current" />
            Featured
          </Badge>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          <Calendar className="inline mr-1 size-3" />
          Created {formatDate(requirement.createdAt)}
        </span>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-lg border border-border/70 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Experience
          </p>
          <p className="mt-1 text-sm font-semibold">
            {experienceLabel(
              requirement.experienceYearsMin,
              requirement.experienceYearsMax,
              requirement.experienceLevel,
            )}
          </p>
        </div>

        <div className="rounded-lg border border-border/70 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Engagement
          </p>
          <p className="mt-1 text-sm font-semibold capitalize">
            {requirement.engagementType?.replace("-", " ") ?? "-"}
          </p>
        </div>

        <div className="rounded-lg border border-border/70 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Budget
          </p>
          <p className="mt-1 font-mono text-sm font-semibold">
            {requirement.budgetMin && requirement.budgetMax
              ? `$${requirement.budgetMin}\u2013$${requirement.budgetMax}/${requirement.budgetType === "annual" ? "yr" : requirement.budgetType === "monthly" ? "mo" : "hr"}`
              : "Flexible"}
          </p>
        </div>

        <div className="rounded-lg border border-border/70 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Start Date
          </p>
          <p className="mt-1 text-sm font-semibold">
            {formatDate(requirement.startDate)}
          </p>
        </div>

        <div className="rounded-lg border border-border/70 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Team Size
          </p>
          <p className="mt-1 font-mono text-sm font-semibold">
            {acceptedCount}/{requirement.developersNeeded}
          </p>
          <Progress value={fillPct} className="mt-1.5 h-1.5" />
        </div>
      </div>

      <Separator />

      {/* ── Current Matches ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Current Matches</CardTitle>
              <p className="text-sm text-muted-foreground">
                {matches.length === 0
                  ? "No engineers matched yet."
                  : `${matches.length} engineer${matches.length !== 1 ? "s" : ""} matched.`}
              </p>
            </div>
            <DeveloperPool
              requirement={requirement}
              excludeDevIds={matchedDevIds}
              onPropose={handlePropose}
            />
          </div>
        </CardHeader>
        {matches.length > 0 && (
          <CardContent>
            <CurrentMatches matches={matches} onRemove={handleRemoveMatch} />
          </CardContent>
        )}
      </Card>

      {/* ── Edit Form / Description + Details ──────────────────────── */}
      {editing ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  rows={6}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tech Stack (comma-separated)</Label>
                <Input
                  value={editForm.techStack}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, techStack: e.target.value }))
                  }
                  placeholder="React, Node.js, TypeScript"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Experience Level</Label>
                  <Select
                    value={editForm.experienceLevel}
                    onValueChange={(v) =>
                      setEditForm((f) => ({ ...f, experienceLevel: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["junior", "mid", "senior", "lead", "principal"].map(
                        (l) => (
                          <SelectItem key={l} value={l}>
                            {l.charAt(0).toUpperCase() + l.slice(1)}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select
                    value={editForm.priority}
                    onValueChange={(v) =>
                      setEditForm((f) => ({ ...f, priority: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["low", "medium", "high", "urgent"].map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(v) =>
                      setEditForm((f) => ({ ...f, status: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "open",
                        "matching",
                        "partially_filled",
                        "filled",
                        "closed",
                      ].map((s) => (
                        <SelectItem key={s} value={s}>
                          {requirementStatusLabel[s as RequirementStatus] ?? s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Engagement Type</Label>
                  <Select
                    value={editForm.engagementType}
                    onValueChange={(v) =>
                      setEditForm((f) => ({ ...f, engagementType: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "full-time",
                        "part-time",
                        "contract",
                        "project-based",
                      ].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t
                            .split("-")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join("-")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Budget Min ($)</Label>
                  <Input
                    type="number"
                    value={editForm.budgetMin}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        budgetMin: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Budget Max ($)</Label>
                  <Input
                    type="number"
                    value={editForm.budgetMax}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        budgetMax: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Developers Needed</Label>
                  <Input
                    type="number"
                    value={editForm.developersNeeded}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        developersNeeded: e.target.value,
                      }))
                    }
                    min={1}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Timezone Preference</Label>
                <Input
                  value={editForm.timezonePreference}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      timezonePreference: e.target.value,
                    }))
                  }
                  placeholder="any"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <button
              type="button"
              onClick={() => setDescriptionExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between text-left"
            >
              <CardTitle className="text-base">Description</CardTitle>
              {descriptionExpanded ? (
                <ChevronUp className="size-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-4 text-muted-foreground" />
              )}
            </button>
            {!descriptionExpanded && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {requirement.techStack.slice(0, 8).map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
                {requirement.techStack.length > 8 && (
                  <Badge variant="outline">
                    +{requirement.techStack.length - 8}
                  </Badge>
                )}
                {requirement.hiringCountries?.length > 0 && (
                  <span className="ml-1">
                    <CountryFlags codes={requirement.hiringCountries} />
                  </span>
                )}
              </div>
            )}
          </CardHeader>
          {descriptionExpanded && (
            <CardContent>
              <div className="text-sm leading-relaxed text-muted-foreground">
                <MarkdownDisplay content={requirement.description} />
              </div>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-1.5">
                {requirement.techStack.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
              {requirement.hiringCountries?.length > 0 && (
                <div className="mt-2">
                  <CountryFlags codes={requirement.hiringCountries} />
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* ── Delete Confirmation Dialog ──────────────────────────────── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Requirement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{requirement.title}</strong>? This will also remove all
              associated matches and pitches. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequirementDetailPage;
