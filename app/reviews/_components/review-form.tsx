"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { ArrowRight, Camera, Check, Image as ImageIcon, Loader2, Quote, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitReview } from "@/lib/api/reviews";
import { REVIEW_MARKET_OPTIONS } from "@/lib/reviews-markets";
import { reviewSchema, type ReviewFormValues } from "@/lib/schemas/review";

const FIELD_ERROR_CLASS = "text-xs text-destructive mt-1";

export const ReviewForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ReviewFormValues>({
    resolver: standardSchemaResolver(reviewSchema),
    mode: "onBlur",
    defaultValues: {
      market: "UK",
      flag: "gb",
      currency: "£" as const,
      hiredCount: 1,
      consent: false,
    } as Partial<ReviewFormValues>,
  });

  // Watch every field — used to drive the live preview and market-linked flag/currency
  const values = watch();

  // Revoke blob URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [avatarPreview, logoPreview]);

  const handleAvatarChange = (file: File | null) => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setValue("avatar", file, { shouldValidate: true });
    } else {
      setAvatarPreview(null);
    }
  };

  const handleLogoChange = (file: File | null) => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setValue("logo", file, { shouldValidate: true });
    } else {
      setLogoPreview(null);
    }
  };

  const onMarketChange = (marketLabel: string) => {
    const opt = REVIEW_MARKET_OPTIONS.find((o) => o.market === marketLabel);
    if (!opt) return;
    setValue("market", opt.market);
    setValue("flag", opt.flag);
    setValue("currency", opt.currency);
  };

  const onSubmit: SubmitHandler<ReviewFormValues> = async (data) => {
    setSubmitting(true);
    const result = await submitReview({
      name: data.name,
      role: data.role,
      company: data.company,
      linkedinUrl: data.linkedinUrl,
      quote: data.quote,
      hiredRole: data.hiredRole,
      hiredCount: data.hiredCount,
      localRate: data.localRate,
      octogleRate: data.octogleRate,
      market: data.market,
      flag: data.flag,
      currency: data.currency,
      avatar: data.avatar,
      logo: data.logo,
    });
    setSubmitting(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success("Thanks! Your review is in review. We'll be in touch.");
    setSubmitted(true);
    reset();
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setAvatarPreview(null);
    setLogoPreview(null);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center">
        <div className="mx-auto mb-5 inline-flex size-12 items-center justify-center rounded-full bg-pulse/10 text-pulse">
          <Check className="size-6" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Thanks for your story.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          It&apos;s landed in our queue. We&apos;ll review within 48 hours and
          email you once it&apos;s approved and live on the homepage.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-full"
          onClick={() => setSubmitted(false)}
        >
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]"
    >
      {/* ── Left: form ── */}
      <div className="space-y-6">
        {/* LinkedIn + verification */}
        <Section title="Your LinkedIn" eyebrow="01 · Who are you">
          <Field error={errors.linkedinUrl?.message}>
            <Label htmlFor="linkedinUrl">LinkedIn profile URL</Label>
            <Input
              id="linkedinUrl"
              placeholder="https://linkedin.com/in/your-profile"
              {...register("linkedinUrl")}
            />
            <p className="text-xs text-muted-foreground">
              We use this to verify the story is from you. Your profile URL
              isn&apos;t shown publicly.
            </p>
          </Field>
        </Section>

        {/* Person */}
        <Section title="About you" eyebrow="02 · Tell us about yourself">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field error={errors.name?.message}>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Jane Smith" {...register("name")} />
            </Field>
            <Field error={errors.role?.message}>
              <Label htmlFor="role">Your role</Label>
              <Input
                id="role"
                placeholder="CEO / Founder / CTO"
                {...register("role")}
              />
            </Field>
          </div>
          <Field error={errors.company?.message}>
            <Label htmlFor="company">Company name</Label>
            <Input
              id="company"
              placeholder="Beekey"
              {...register("company")}
            />
          </Field>
        </Section>

        {/* Quote */}
        <Section title="Your story" eyebrow="03 · In your words">
          <Field error={errors.quote?.message}>
            <Label htmlFor="quote">What happened?</Label>
            <Textarea
              id="quote"
              rows={5}
              placeholder="e.g. We were about to commit to three engineers at London rates. OctogleHire matched us in under a week — saving over £200k a year."
              {...register("quote")}
            />
            <p className="text-xs text-muted-foreground">
              40–600 characters. The more concrete (rates, roles, savings) the
              better.
            </p>
          </Field>
        </Section>

        {/* Hire details */}
        <Section title="The hire" eyebrow="04 · The numbers">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Field error={errors.hiredRole?.message}>
              <Label htmlFor="hiredRole">Role you hired for</Label>
              <Input
                id="hiredRole"
                placeholder="Senior Frontend Engineer"
                {...register("hiredRole")}
              />
            </Field>
            <Field error={errors.hiredCount?.message}>
              <Label htmlFor="hiredCount">How many?</Label>
              <Input
                id="hiredCount"
                type="number"
                min={1}
                max={50}
                {...register("hiredCount", { valueAsNumber: true })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="market"
              render={({ field }) => (
                <Field error={errors.market?.message}>
                  <Label>Local market</Label>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      onMarketChange(v);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select market" />
                    </SelectTrigger>
                    <SelectContent>
                      {REVIEW_MARKET_OPTIONS.map((opt) => (
                        <SelectItem key={opt.market} value={opt.market}>
                          <span className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`https://flagcdn.com/w20/${opt.flag}.png`}
                              alt=""
                              className="h-3 w-auto rounded-[1px]"
                            />
                            {opt.market}
                            <span className="text-muted-foreground">
                              · {opt.currency}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <div className="hidden sm:block" aria-hidden />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field error={errors.localRate?.message}>
              <Label htmlFor="localRate">
                Local quote{" "}
                <span className="text-muted-foreground font-mono">
                  ({values.currency ?? "£"}/mo)
                </span>
              </Label>
              <Input
                id="localRate"
                type="number"
                min={100}
                placeholder="9500"
                {...register("localRate", { valueAsNumber: true })}
              />
            </Field>
            <Field error={errors.octogleRate?.message}>
              <Label htmlFor="octogleRate">
                OctogleHire rate{" "}
                <span className="text-muted-foreground font-mono">
                  ({values.currency ?? "£"}/mo)
                </span>
              </Label>
              <Input
                id="octogleRate"
                type="number"
                min={100}
                placeholder="3800"
                {...register("octogleRate", { valueAsNumber: true })}
              />
            </Field>
          </div>
        </Section>

        {/* Photos */}
        <Section title="Photos" eyebrow="05 · Make it personal">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FileUpload
              label="Your photo"
              required
              icon={Camera}
              accept="image/png,image/jpeg,image/webp"
              preview={avatarPreview}
              onChange={handleAvatarChange}
              error={errors.avatar?.message as string | undefined}
              hint="Square headshot preferred · under 5MB"
            />
            <FileUpload
              label="Company logo"
              icon={ImageIcon}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              preview={logoPreview}
              onChange={handleLogoChange}
              error={errors.logo?.message as string | undefined}
              hint="Optional · SVG or transparent PNG · under 2MB"
            />
          </div>
        </Section>

        {/* Consent + submit */}
        <div className="space-y-4 rounded-2xl border border-border bg-muted/30 p-5">
          <Controller
            control={control}
            name="consent"
            render={({ field }) => (
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(v) => field.onChange(!!v)}
                  className="mt-0.5"
                />
                <span className="text-sm leading-relaxed text-foreground/80">
                  I confirm this is my genuine experience with OctogleHire and
                  consent to OctogleHire featuring my name, photo, company, and
                  quote on their marketing materials.
                </span>
              </label>
            )}
          />
          {errors.consent?.message && (
            <p className="text-xs text-destructive">{errors.consent.message}</p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Submit for review
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            We review each submission within 48 hours. You&apos;ll get an email
            once it&apos;s live.
          </p>
        </div>
      </div>

      {/* ── Right: sticky live preview ── */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Live preview
          </p>
          <ReviewPreview
            values={values}
            avatarPreview={avatarPreview}
            logoPreview={logoPreview}
          />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This is how your story will appear on the OctogleHire homepage once
            approved.
          </p>
        </div>
      </aside>
    </form>
  );
};

// ── Subcomponents ────────────────────────────────────────────────────────────

const Section = ({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5 md:p-6 space-y-4">
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-base font-semibold">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="space-y-1.5">
    {children}
    {error && <p className={FIELD_ERROR_CLASS}>{error}</p>}
  </div>
);

const FileUpload = ({
  label,
  icon: Icon,
  accept,
  preview,
  onChange,
  error,
  hint,
  required,
}: {
  label: string;
  icon: typeof Upload;
  accept: string;
  preview: string | null;
  onChange: (file: File | null) => void;
  error?: string;
  hint?: string;
  required?: boolean;
}) => (
  <div className="space-y-1.5">
    <Label>
      {label}
      {required && <span className="ml-1 text-destructive">*</span>}
    </Label>
    <label
      className={cn(
        "relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors",
        preview
          ? "border-border bg-muted/30"
          : "border-border bg-muted/20 hover:border-foreground/30 hover:bg-muted/40",
      )}
    >
      {preview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="preview"
            className="absolute inset-0 size-full object-cover"
          />
          <span className="absolute inset-x-0 bottom-0 bg-background/80 px-2 py-1 text-center text-[10px] font-medium backdrop-blur">
            Click to replace
          </span>
        </>
      ) : (
        <>
          <Icon className="size-6 text-muted-foreground" strokeWidth={1.5} />
          <span className="mt-2 text-xs font-medium">Upload {label.toLowerCase()}</span>
          {hint && (
            <span className="mt-1 px-4 text-center text-[10px] text-muted-foreground">
              {hint}
            </span>
          )}
        </>
      )}
      <input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="sr-only"
      />
    </label>
    {error && <p className={FIELD_ERROR_CLASS}>{error}</p>}
  </div>
);

const ReviewPreview = ({
  values,
  avatarPreview,
  logoPreview,
}: {
  values: Partial<ReviewFormValues>;
  avatarPreview: string | null;
  logoPreview: string | null;
}) => {
  const localRate = values.localRate || 0;
  const octogleRate = values.octogleRate || 0;
  const hiredCount = values.hiredCount || 1;
  const pct = useMemo(() => {
    if (!localRate || localRate <= octogleRate) return 0;
    return Math.round(((localRate - octogleRate) / localRate) * 100);
  }, [localRate, octogleRate]);
  const annualSavings = Math.max(0, (localRate - octogleRate) * hiredCount * 12);
  const currency = values.currency || "£";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid grid-cols-1">
        {/* Portrait */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {avatarPreview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarPreview}
              alt="You"
              className="size-full object-cover object-[50%_20%]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              <Camera className="mr-2 size-4" /> Your photo will appear here
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

          {values.flag && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2 py-0.5 backdrop-blur-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://flagcdn.com/w40/${values.flag}.png`}
                alt=""
                className="h-2.5 w-auto rounded-[1px]"
              />
              <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-white">
                {values.market}
              </span>
            </div>
          )}

          {pct > 0 && (
            <div className="absolute right-3 top-3 inline-flex items-center rounded-full bg-pulse px-2 py-0.5">
              <span className="font-mono text-[10px] font-semibold text-background">
                −{pct}%
              </span>
            </div>
          )}

          {(values.hiredCount || values.hiredRole) && (
            <div className="absolute inset-x-3 bottom-3">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-white/70">
                Hired via OctogleHire
              </p>
              <p className="text-sm font-semibold text-white leading-tight">
                {hiredCount}× {values.hiredRole || "Engineer"}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-5">
          <Quote className="size-5 text-pulse/50" strokeWidth={1.25} />
          <blockquote className="text-sm font-medium leading-[1.5] tracking-tight md:text-base">
            {values.quote?.trim() ||
              "Your story will appear here as you type."}
          </blockquote>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
            <div>
              <p className="text-sm font-semibold">
                {values.name || "Your name"}
              </p>
              <p className="text-xs text-muted-foreground">
                {values.role || "Your role"}
                {values.company && `, ${values.company}`}
              </p>
            </div>
            {logoPreview && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logoPreview}
                alt=""
                className="h-5 w-auto opacity-60"
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-muted/40 p-3">
            <div className="space-y-0.5 border-r border-border pr-2">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Local
              </p>
              <p className="font-mono text-sm font-semibold tracking-tight line-through decoration-muted-foreground/50">
                {currency}
                {localRate.toLocaleString()}
              </p>
            </div>
            <div className="space-y-0.5 border-r border-border pr-2">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Octogle
              </p>
              <p className="font-mono text-sm font-semibold tracking-tight text-pulse">
                {currency}
                {octogleRate.toLocaleString()}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Saved /yr
              </p>
              <p className="font-mono text-sm font-semibold tracking-tight">
                {currency}
                {(annualSavings / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
