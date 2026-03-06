"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import type { CompanyProfileSummary } from "@/lib/api/companies";
import { updateCompanyProfile } from "@/lib/api/companies";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CompanySettingsForm = ({
  profile,
}: {
  profile: CompanyProfileSummary | null;
}) => {
  const router = useRouter();
  const { getToken } = useAuth();

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
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
      logoUrl: profile?.logoUrl ?? "",
    },
  });

  const logoUrl = watch("logoUrl");

  const onSubmit = async (data: CompanyProfileFormValues) => {
    setSaving(true);
    setFeedback(null);

    try {
      const token = await getToken();
      await updateCompanyProfile(token, data);
      setFeedback({ type: "success", message: "Settings saved successfully." });
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to save. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your company profile and contact information.
          </CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
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
                <p className="text-xs text-destructive">
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, CA"
                {...register("location")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
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
                <p className="text-xs text-destructive">
                  {errors.contactName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Optional"
                {...register("phone")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Web Presence */}
        <Card>
          <CardHeader>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Web Presence
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://example.com"
                {...register("website")}
              />
              {errors.website && (
                <p className="text-xs text-destructive">
                  {errors.website.message}
                </p>
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
                <p className="text-xs text-destructive">
                  {errors.linkedinCompanyUrl.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Branding
            </p>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                placeholder="https://example.com/logo.png"
                {...register("logoUrl")}
              />
              {errors.logoUrl && (
                <p className="text-xs text-destructive">
                  {errors.logoUrl.message}
                </p>
              )}
            </div>
            {logoUrl && (
              <div className="flex items-center gap-3">
                <Image
                  src={logoUrl}
                  alt="Logo preview"
                  width={48}
                  height={48}
                  unoptimized
                  className="size-12 rounded-full border border-border object-cover"
                />
                <p className="text-xs text-muted-foreground">Logo preview</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Read-only fields */}
        {profile && (
          <Card>
            <CardHeader>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Account Info
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-1">
                <p className="text-xs text-muted-foreground">Domain</p>
                <p className="text-sm font-medium">
                  {profile.domain ?? "Not set"}
                </p>
              </div>
              <div className="grid gap-1">
                <p className="text-xs text-muted-foreground">
                  Invoice Currency
                </p>
                <p className="font-mono text-sm font-medium">
                  {profile.invoiceCurrency}
                </p>
              </div>
              <div className="grid gap-1">
                <p className="text-xs text-muted-foreground">Status</p>
                <div>
                  <Badge variant="outline">{profile.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {saving ? "Saving..." : "Save settings"}
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
