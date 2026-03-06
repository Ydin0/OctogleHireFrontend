"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Camera,
  Globe,
  Linkedin,
  Loader2,
  MapPin,
  Save,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import type { CompanyProfileSummary } from "@/lib/api/companies";
import { updateCompanyProfile, uploadCompanyLogo } from "@/lib/api/companies";
import {
  companyProfileSchema,
  type CompanyProfileFormValues,
} from "@/lib/schemas/company-profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

const CompanySettingsForm = ({
  profile,
}: {
  profile: CompanyProfileSummary | null;
}) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState(profile?.logoUrl ?? null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      companyName: profile?.companyName ?? "",
      contactName: profile?.contactName ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
      website: profile?.website ?? "",
      linkedinCompanyUrl: profile?.linkedinCompanyUrl ?? "",
      location: profile?.location ?? "",
    },
  });

  const handleLogoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        setFeedback({ type: "error", message: "Logo must be JPEG, PNG, or WebP." });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFeedback({ type: "error", message: "Logo must be under 2MB." });
        return;
      }

      setUploadingLogo(true);
      setFeedback(null);
      try {
        const token = await getToken();
        const result = await uploadCompanyLogo(token, file);
        setLogoUrl(result.logoUrl);
        setFeedback({ type: "success", message: "Logo updated." });
        router.refresh();
      } catch {
        setFeedback({ type: "error", message: "Failed to upload logo." });
      } finally {
        setUploadingLogo(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [getToken, router],
  );

  const onSubmit = async (data: CompanyProfileFormValues) => {
    setSaving(true);
    setFeedback(null);

    try {
      const token = await getToken();
      await updateCompanyProfile(token, data);
      setFeedback({ type: "success", message: "Profile saved." });
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const companyName = profile?.companyName ?? "Company";

  return (
    <div className="space-y-6">
      {/* ── Profile Header ─────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
            {/* Logo with upload overlay */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="group relative flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted transition-colors hover:border-primary/50"
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={companyName}
                    width={80}
                    height={80}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  <Building2 className="size-8 text-muted-foreground" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {uploadingLogo ? (
                    <Loader2 className="size-5 animate-spin text-white" />
                  ) : (
                    <Camera className="size-5 text-white" />
                  )}
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            {/* Company info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-lg font-semibold">{companyName}</h1>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground sm:justify-start">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {profile.location}
                  </span>
                )}
                {profile?.website && (
                  <a
                    href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 transition-colors hover:text-foreground"
                  >
                    <Globe className="size-3.5" />
                    {profile.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {profile?.linkedinCompanyUrl && (
                  <a
                    href={profile.linkedinCompanyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 transition-colors hover:text-foreground"
                  >
                    <Linkedin className="size-3.5" />
                    LinkedIn
                  </a>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {profile?.status && (
                  <Badge variant="outline">{profile.status}</Badge>
                )}
                {profile?.domain && (
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {profile.domain}
                  </Badge>
                )}
                {profile?.invoiceCurrency && (
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {profile.invoiceCurrency}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Edit Form ──────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Company Information
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" {...register("companyName")} />
              {errors.companyName && (
                <p className="text-xs text-destructive">{errors.companyName.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g. San Francisco, CA" {...register("location")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Contact Details
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input id="contactName" {...register("contactName")} />
              {errors.contactName && (
                <p className="text-xs text-destructive">{errors.contactName.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Optional" {...register("phone")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Web Presence
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://example.com" {...register("website")} />
              {errors.website && (
                <p className="text-xs text-destructive">{errors.website.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="linkedinCompanyUrl">LinkedIn Company URL</Label>
              <Input
                id="linkedinCompanyUrl"
                placeholder="https://linkedin.com/company/..."
                {...register("linkedinCompanyUrl")}
              />
              {errors.linkedinCompanyUrl && (
                <p className="text-xs text-destructive">{errors.linkedinCompanyUrl.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {saving ? "Saving..." : "Save changes"}
          </Button>
          {feedback && (
            <p
              className={`text-xs ${feedback.type === "success" ? "text-emerald-600" : "text-destructive"}`}
            >
              {feedback.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export { CompanySettingsForm };
