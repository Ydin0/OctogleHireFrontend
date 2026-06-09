"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";

import {
  toggleApplicationFeatured,
  toggleApplicationLive,
  updateApplicationProfile,
  updateMarketplaceProfile,
  type AdminApplicationFull,
} from "@/lib/api/admin";
import {
  GAUNTLET_STAGES,
  MARKETPLACE_TAGS,
  type GauntletScores,
  type MarketplaceLanguage,
  type MarketplacePortfolioItem,
  type MarketplaceProfile,
  type MarketplaceSkill,
} from "@/lib/data/developers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const centsToDollars = (cents: number | null | undefined) =>
  cents == null ? "" : String(Math.round(cents / 100));
const dollarsToCents = (value: string) => {
  const n = Number(value);
  return Number.isFinite(n) && value.trim() !== "" ? Math.round(n * 100) : null;
};
const numOrNull = (value: string) => {
  const n = Number(value);
  return Number.isFinite(n) && value.trim() !== "" ? n : null;
};

const EMPTY_GAUNTLET: GauntletScores = {
  identity: 0,
  technical: 0,
  live: 0,
  system: 0,
  comms: 0,
};

function Section({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-pulse">
            {eyebrow}
          </p>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

interface MarketplaceEditorProps {
  application: AdminApplicationFull;
  token: string;
}

function MarketplaceEditor({ application, token }: MarketplaceEditorProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  const profile = application.marketplaceProfile ?? {};

  // ── Visibility (immediate actions) ──────────────────────────────────────
  const [isLive, setIsLive] = useState(application.isLive);
  const [isFeatured, setIsFeatured] = useState(application.isFeatured);

  // ── Editable form state ─────────────────────────────────────────────────
  const [hourlyRate, setHourlyRate] = useState(
    centsToDollars(application.hourlyRateCents)
  );
  const [monthlyRate, setMonthlyRate] = useState(
    centsToDollars(application.monthlyRateCents)
  );
  const [localRate, setLocalRate] = useState(
    centsToDollars(profile.localRateCents)
  );
  const [rating, setRating] = useState(application.marketplaceRating ?? "");
  const [projects, setProjects] = useState(
    application.marketplaceProjects == null
      ? ""
      : String(application.marketplaceProjects)
  );
  const [responseTime, setResponseTime] = useState(profile.responseTime ?? "");
  const [repeatHire, setRepeatHire] = useState(
    profile.repeatHire == null ? "" : String(profile.repeatHire)
  );
  const [timezone, setTimezone] = useState(profile.timezone ?? "");
  const [overlap, setOverlap] = useState(profile.overlap ?? "");
  const [tag, setTag] = useState(profile.tag ?? "");
  const [tagEmoji, setTagEmoji] = useState(profile.tagEmoji ?? "");
  const [bio, setBio] = useState(application.bio ?? "");
  const [aboutLong, setAboutLong] = useState(application.aboutLong ?? "");

  const [skills, setSkills] = useState<MarketplaceSkill[]>(
    profile.skills && profile.skills.length > 0
      ? profile.skills
      : (application.primaryStack ?? []).map((name) => ({ name, level: 85 }))
  );
  const [percentile, setPercentile] = useState(
    profile.gauntlet?.percentile ?? ""
  );
  const [overall, setOverall] = useState(
    profile.gauntlet?.overall == null ? "" : String(profile.gauntlet.overall)
  );
  const [scores, setScores] = useState<GauntletScores>(
    profile.gauntlet?.scores ?? EMPTY_GAUNTLET
  );
  const [languages, setLanguages] = useState<MarketplaceLanguage[]>(
    profile.languages ?? []
  );
  const [portfolio, setPortfolio] = useState<MarketplacePortfolioItem[]>(
    profile.portfolio ?? []
  );

  // ── Immediate toggles ───────────────────────────────────────────────────
  const handleLiveToggle = async (checked: boolean) => {
    if (checked && application.status !== "approved") {
      toast.error("Only approved developers can go live");
      return;
    }
    setIsLive(checked);
    const result = await toggleApplicationLive(token, application.id, checked);
    if (!result) {
      setIsLive(!checked);
      toast.error("Failed to update visibility");
      return;
    }
    if (!checked) setIsFeatured(false);
    toast.success(checked ? "Now live on marketplace" : "Hidden from marketplace");
    startTransition(() => router.refresh());
  };

  const handleFeaturedToggle = async (checked: boolean) => {
    if (checked && !isLive) {
      toast.error("Only live developers can be featured");
      return;
    }
    setIsFeatured(checked);
    const result = await toggleApplicationFeatured(
      token,
      application.id,
      checked
    );
    if (!result) {
      setIsFeatured(!checked);
      toast.error("Failed to update featured");
      return;
    }
    toast.success(checked ? "Featured on marketplace" : "Unfeatured");
    startTransition(() => router.refresh());
  };

  // ── Save everything companies see ───────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const marketplaceProfile: MarketplaceProfile = {
        tag: tag.trim() || undefined,
        tagEmoji: tagEmoji.trim() || undefined,
        localRateCents: dollarsToCents(localRate) ?? undefined,
        timezone: timezone.trim() || undefined,
        overlap: overlap.trim() || undefined,
        responseTime: responseTime.trim() || undefined,
        repeatHire: numOrNull(repeatHire) ?? undefined,
        skills: skills.filter((s) => s.name.trim()),
        gauntlet:
          overall.trim() || percentile.trim()
            ? {
                overall: numOrNull(overall) ?? 0,
                percentile: percentile.trim(),
                scores,
              }
            : undefined,
        languages: languages.filter((l) => l.name.trim()),
        portfolio: portfolio.filter((p) => p.name.trim()),
      };

      const [profileRes, marketRes] = await Promise.all([
        updateApplicationProfile(token, application.id, { bio }),
        updateMarketplaceProfile(token, application.id, {
          hourlyRateCents: dollarsToCents(hourlyRate),
          monthlyRateCents: dollarsToCents(monthlyRate),
          marketplaceRating: rating.trim() || null,
          marketplaceProjects: numOrNull(projects),
          aboutLong: aboutLong.trim() || null,
          marketplaceProfile,
        }),
      ]);

      if (!profileRes || !marketRes) throw new Error("Save failed");
      toast.success("Marketplace profile saved");
      startTransition(() => router.refresh());
    } catch {
      toast.error("Failed to save — please try again");
    } finally {
      setSaving(false);
    }
  };

  const initials = (application.fullName ?? "??")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-pulse/25 bg-gradient-to-br from-card to-pulse/5 p-5">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            {application.profilePhotoPath && (
              <AvatarImage
                src={application.profilePhotoPath}
                alt={application.fullName ?? ""}
              />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold">
              {application.fullName ?? "Developer"}
            </h1>
            <p className="text-sm text-pulse">
              {application.professionalTitle ?? "Software Engineer"}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] font-mono uppercase tracking-wider"
              >
                {application.status}
              </Badge>
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500">
                  <span className="size-2 rounded-full bg-emerald-500" /> Live
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Hidden</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Switch
              checked={isLive}
              onCheckedChange={handleLiveToggle}
              disabled={application.status !== "approved"}
            />
            <Label className="text-sm">Live</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={isFeatured}
              onCheckedChange={handleFeaturedToggle}
              disabled={!isLive}
            />
            <Label className="text-sm">Featured</Label>
          </div>
        </div>
      </div>

      {application.status !== "approved" && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400">
          This developer isn&apos;t approved yet — they can&apos;t be set live
          until their application reaches the <strong>approved</strong> stage.
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Rate & pricing */}
        <Section eyebrow="Engagement" title="Rate & pricing">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hourly rate (USD)">
              <Input
                inputMode="numeric"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="65"
              />
            </Field>
            <Field label="Monthly rate (USD)">
              <Input
                inputMode="numeric"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                placeholder="10400"
              />
            </Field>
            <Field label="Local market rate (USD/hr)" hint="Cost-vs-local comparison">
              <Input
                inputMode="numeric"
                value={localRate}
                onChange={(e) => setLocalRate(e.target.value)}
                placeholder="145"
              />
            </Field>
            <Field label="Response time">
              <Input
                value={responseTime}
                onChange={(e) => setResponseTime(e.target.value)}
                placeholder="~2 hrs"
              />
            </Field>
          </div>
        </Section>

        {/* Stats & badge */}
        <Section eyebrow="Headline stats" title="Rating, badge & availability">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rating (0–5)">
              <Input
                inputMode="decimal"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="4.9"
              />
            </Field>
            <Field label="Projects">
              <Input
                inputMode="numeric"
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                placeholder="34"
              />
            </Field>
            <Field label="Repeat-hire rate (%)">
              <Input
                inputMode="numeric"
                value={repeatHire}
                onChange={(e) => setRepeatHire(e.target.value)}
                placeholder="92"
              />
            </Field>
            <Field label="Quality tag">
              <Select
                value={tag || "__none"}
                onValueChange={(v) => {
                  if (v === "__none") {
                    setTag("");
                    setTagEmoji("");
                    return;
                  }
                  const match = MARKETPLACE_TAGS.find((t) => t.tag === v);
                  setTag(v);
                  setTagEmoji(match?.tagEmoji ?? "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">No tag</SelectItem>
                  {MARKETPLACE_TAGS.map((t) => (
                    <SelectItem key={t.tag} value={t.tag}>
                      {t.tag} {t.tagEmoji}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Timezone">
              <Input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="IST (UTC+5:30)"
              />
            </Field>
            <Field label="Overlap note">
              <Input
                value={overlap}
                onChange={(e) => setOverlap(e.target.value)}
                placeholder="4.5 hrs overlap with US-East"
              />
            </Field>
          </div>
        </Section>
      </div>

      {/* Bio / about */}
      <Section eyebrow="Narrative" title="Bio & about">
        <div className="space-y-4">
          <Field label="Short bio (card + about section)">
            <Textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Full-stack engineer who ships production React + Node at scale…"
            />
          </Field>
          <Field label="Extended about (optional)">
            <Textarea
              rows={4}
              value={aboutLong}
              onChange={(e) => setAboutLong(e.target.value)}
            />
          </Field>
        </div>
      </Section>

      {/* Skills */}
      <Section
        eyebrow="Verified proficiency"
        title="Tech stack & levels"
        action={
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setSkills((s) => [...s, { name: "", level: 80 }])}
          >
            <Plus className="size-4" /> Add skill
          </Button>
        }
      >
        <div className="space-y-3">
          {skills.length === 0 && (
            <p className="text-sm text-muted-foreground">No skills yet.</p>
          )}
          {skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-3">
              <Input
                className="w-44"
                value={skill.name}
                onChange={(e) =>
                  setSkills((arr) =>
                    arr.map((s, j) =>
                      j === i ? { ...s, name: e.target.value } : s
                    )
                  )
                }
                placeholder="React"
              />
              <Slider
                className="flex-1"
                min={0}
                max={100}
                step={1}
                value={[skill.level]}
                onValueChange={([v]) =>
                  setSkills((arr) =>
                    arr.map((s, j) => (j === i ? { ...s, level: v } : s))
                  )
                }
              />
              <span className="w-10 text-right font-mono text-sm">
                {skill.level}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                onClick={() =>
                  setSkills((arr) => arr.filter((_, j) => j !== i))
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* Gauntlet */}
      <Section eyebrow="The Octogle Gauntlet" title="5-stage AI vetting scores">
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
          <Field label="Overall score (0–100)">
            <Input
              inputMode="numeric"
              value={overall}
              onChange={(e) => setOverall(e.target.value)}
              placeholder="96"
            />
          </Field>
          <Field label="Percentile label">
            <Input
              value={percentile}
              onChange={(e) => setPercentile(e.target.value)}
              placeholder="Top 3%"
            />
          </Field>
        </div>
        <div className="space-y-3">
          {GAUNTLET_STAGES.map((stage) => {
            const key = stage.key as keyof GauntletScores;
            return (
              <div key={stage.key} className="flex items-center gap-3">
                <span className="w-48 text-sm">{stage.label}</span>
                <Slider
                  className="flex-1"
                  min={0}
                  max={100}
                  step={1}
                  value={[scores[key]]}
                  onValueChange={([v]) =>
                    setScores((s) => ({ ...s, [key]: v }))
                  }
                />
                <span className="w-10 text-right font-mono text-sm">
                  {scores[key]}
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Languages */}
        <Section
          eyebrow="Communication"
          title="Languages"
          action={
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                setLanguages((l) => [...l, { name: "", level: "Fluent" }])
              }
            >
              <Plus className="size-4" /> Add
            </Button>
          }
        >
          <div className="space-y-3">
            {languages.length === 0 && (
              <p className="text-sm text-muted-foreground">No languages yet.</p>
            )}
            {languages.map((lang, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  value={lang.name}
                  onChange={(e) =>
                    setLanguages((arr) =>
                      arr.map((l, j) =>
                        j === i ? { ...l, name: e.target.value } : l
                      )
                    )
                  }
                  placeholder="English"
                />
                <Input
                  className="w-36"
                  value={lang.level}
                  onChange={(e) =>
                    setLanguages((arr) =>
                      arr.map((l, j) =>
                        j === i ? { ...l, level: e.target.value } : l
                      )
                    )
                  }
                  placeholder="Fluent"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setLanguages((arr) => arr.filter((_, j) => j !== i))
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </Section>

        {/* Portfolio */}
        <Section
          eyebrow="Selected work"
          title="Sample projects"
          action={
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                setPortfolio((p) => [
                  ...p,
                  { name: "", blurb: "", tags: [], metric: "" },
                ])
              }
            >
              <Plus className="size-4" /> Add
            </Button>
          }
        >
          <div className="space-y-4">
            {portfolio.length === 0 && (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            )}
            {portfolio.map((item, i) => (
              <div
                key={i}
                className="space-y-2 rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-2">
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      setPortfolio((arr) =>
                        arr.map((p, j) =>
                          j === i ? { ...p, name: e.target.value } : p
                        )
                      )
                    }
                    placeholder="Project name"
                  />
                  <Input
                    className="w-36"
                    value={item.metric}
                    onChange={(e) =>
                      setPortfolio((arr) =>
                        arr.map((p, j) =>
                          j === i ? { ...p, metric: e.target.value } : p
                        )
                      )
                    }
                    placeholder="48% faster"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      setPortfolio((arr) => arr.filter((_, j) => j !== i))
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <Textarea
                  rows={2}
                  value={item.blurb}
                  onChange={(e) =>
                    setPortfolio((arr) =>
                      arr.map((p, j) =>
                        j === i ? { ...p, blurb: e.target.value } : p
                      )
                    )
                  }
                  placeholder="Short description"
                />
                <Input
                  value={item.tags.join(", ")}
                  onChange={(e) =>
                    setPortfolio((arr) =>
                      arr.map((p, j) =>
                        j === i
                          ? {
                              ...p,
                              tags: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            }
                          : p
                      )
                    )
                  }
                  placeholder="React, GraphQL (comma-separated)"
                />
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <p className="text-xs text-muted-foreground">
            Everything here is what companies see on the marketplace.
          </p>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full"
          >
            <Save className="size-4" />
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { MarketplaceEditor };
