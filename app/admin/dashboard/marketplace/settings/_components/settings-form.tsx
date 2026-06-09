"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Save, Trash2, X } from "lucide-react";

import { updateMarketplaceSettings } from "@/lib/api/admin-marketplace";
import { type MarketplaceSettings } from "@/lib/data/developers";
import { MARKETPLACE_TECH_STACK_OPTIONS } from "@/lib/data/developers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4">
        <p className="text-[10px] font-mono uppercase tracking-wider text-pulse">
          {eyebrow}
        </p>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

interface SettingsFormProps {
  settings: MarketplaceSettings;
  token: string;
}

function SettingsForm({ settings, token }: SettingsFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  const [hero, setHero] = useState(settings.hero);
  const [techStacks, setTechStacks] = useState<string[]>(
    settings.filters.techStacks
  );
  const [rateMin, setRateMin] = useState(String(settings.filters.rateMin));
  const [rateMax, setRateMax] = useState(String(settings.filters.rateMax));
  const [included, setIncluded] = useState<string[]>(settings.included);
  const [showGauntlet, setShowGauntlet] = useState(settings.showGauntlet);
  const [rateFraming, setRateFraming] = useState(settings.defaultRateFraming);
  const [stackToAdd, setStackToAdd] = useState("");

  const addStack = (value: string) => {
    const v = value.trim();
    if (v && !techStacks.includes(v)) setTechStacks((s) => [...s, v]);
    setStackToAdd("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const next: MarketplaceSettings = {
        hero,
        filters: {
          techStacks,
          rateMin: Number(rateMin) || 0,
          rateMax: Number(rateMax) || 0,
          experienceRanges: settings.filters.experienceRanges,
        },
        included: included.map((s) => s.trim()).filter(Boolean),
        showGauntlet,
        defaultRateFraming: rateFraming,
        defaultSort: settings.defaultSort,
      };
      const result = await updateMarketplaceSettings(token, next);
      if (!result) throw new Error("Save failed");
      toast.success("Marketplace settings saved");
      startTransition(() => router.refresh());
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      <Section eyebrow="Header" title="Hero copy">
        <div className="space-y-4">
          <Field label="Eyebrow badge">
            <Input
              value={hero.eyebrow}
              onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title">
              <Input
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
              />
            </Field>
            <Field label="Title accent word (pulse colour)">
              <Input
                value={hero.titleAccent}
                onChange={(e) =>
                  setHero({ ...hero, titleAccent: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Description">
            <Textarea
              rows={2}
              value={hero.description}
              onChange={(e) =>
                setHero({ ...hero, description: e.target.value })
              }
            />
          </Field>
        </div>
      </Section>

      <Section eyebrow="Discovery" title="Filters">
        <div className="space-y-4">
          <Field label="Filterable tech stacks">
            <div className="flex flex-wrap gap-2">
              {techStacks.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-pulse/35 bg-pulse/10 px-3 py-1 text-xs text-pulse"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() =>
                      setTechStacks((s) => s.filter((x) => x !== t))
                    }
                    className="text-pulse/70 hover:text-pulse"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex max-w-sm gap-2">
              <Select value={stackToAdd} onValueChange={addStack}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Add a tech stack…" />
                </SelectTrigger>
                <SelectContent>
                  {MARKETPLACE_TECH_STACK_OPTIONS.filter(
                    (o) => !techStacks.includes(o)
                  )
                    .slice(0, 80)
                    .map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </Field>
          <div className="grid max-w-sm grid-cols-2 gap-4">
            <Field label="Min rate (USD/hr)">
              <Input
                inputMode="numeric"
                value={rateMin}
                onChange={(e) => setRateMin(e.target.value)}
              />
            </Field>
            <Field label="Max rate (USD/hr)">
              <Input
                inputMode="numeric"
                value={rateMax}
                onChange={(e) => setRateMax(e.target.value)}
              />
            </Field>
          </div>
        </div>
      </Section>

      <Section eyebrow="Hire compliantly" title="What's included">
        <div className="space-y-3">
          {included.map((line, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={line}
                onChange={(e) =>
                  setIncluded((arr) =>
                    arr.map((l, j) => (j === i ? e.target.value : l))
                  )
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                onClick={() =>
                  setIncluded((arr) => arr.filter((_, j) => j !== i))
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setIncluded((arr) => [...arr, ""])}
          >
            <Plus className="size-4" /> Add line
          </Button>
        </div>
      </Section>

      <Section eyebrow="Presentation" title="Profile display">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Show the AI vetting gauntlet</Label>
              <p className="text-xs text-muted-foreground">
                Displays each developer&apos;s 5-stage Octogle Gauntlet scores.
              </p>
            </div>
            <Switch checked={showGauntlet} onCheckedChange={setShowGauntlet} />
          </div>
          <Field label="Default rate framing">
            <Select
              value={rateFraming}
              onValueChange={(v) =>
                setRateFraming(v as "hourly" | "monthly")
              }
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl items-center justify-end px-6 py-3">
          <Button onClick={handleSave} disabled={saving} className="rounded-full">
            <Save className="size-4" />
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { SettingsForm };
