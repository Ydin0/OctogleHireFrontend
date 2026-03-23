"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle } from "lucide-react";

import { trackMetaEvent } from "@/lib/analytics/meta-events";
import {
  agencyLeadSchema,
  type AgencyLead,
} from "@/lib/schemas/agency-enquiry";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const TEAM_SIZE_OPTIONS = [
  "1–5 recruiters",
  "6–20 recruiters",
  "21–50 recruiters",
  "50+ recruiters",
];

type View = "form" | "success";

const AgencySignupForm = () => {
  const [view, setView] = useState<View>("form");
  const [contactName, setContactName] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AgencyLead>({
    resolver: zodResolver(agencyLeadSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: AgencyLead) => {
    setApiError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/public/agency-enquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        setApiError(
          body.message ?? "Something went wrong. Please try again.",
        );
        return;
      }

      trackMetaEvent("Lead", {
        content_name: "Agency Signup",
        content_category: "agency",
      });

      setContactName(data.contactName);
      setView("success");
    } catch {
      setApiError(
        "Unable to connect. Please check your connection and try again.",
      );
    }
  };

  if (view === "success") {
    return (
      <div className="animate-in fade-in duration-500 space-y-6 py-4">
        <div className="flex items-center justify-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle className="size-7 text-emerald-600" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">
            Thanks, {contactName.split(" ")[0]}!
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your agency registration has been submitted. Our team will review
            your application and get back to you within 24 hours with your
            unique referral link and dashboard access.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            What happens next
          </p>
          {[
            "We review your application (within 24h)",
            "You receive your agency dashboard invite",
            "Get your branded referral link",
            "Start submitting candidates and earning commissions",
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-[10px] text-background">
                {i + 1}
              </span>
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="animate-in fade-in duration-300"
    >
      <div className="space-y-4">
        <Field>
          <FieldLabel htmlFor="contactName">Full Name</FieldLabel>
          <Input
            id="contactName"
            placeholder="Sarah Chen"
            {...register("contactName")}
          />
          <div className="min-h-5">
            {errors.contactName && (
              <FieldError>{errors.contactName.message}</FieldError>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="agencyName">Agency Name</FieldLabel>
          <Input
            id="agencyName"
            placeholder="Acme Recruiting"
            {...register("agencyName")}
          />
          <div className="min-h-5">
            {errors.agencyName && (
              <FieldError>{errors.agencyName.message}</FieldError>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Work Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="sarah@acme-recruiting.com"
            {...register("email")}
          />
          <div className="min-h-5">
            {errors.email && (
              <FieldError>{errors.email.message}</FieldError>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Mobile Number</FieldLabel>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register("phone")}
          />
          <div className="min-h-5">
            {errors.phone && (
              <FieldError>{errors.phone.message}</FieldError>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="website">
            Website{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </FieldLabel>
          <Input
            id="website"
            type="url"
            placeholder="https://acme-recruiting.com"
            {...register("website")}
          />
          <div className="min-h-5">
            {errors.website && (
              <FieldError>{errors.website.message}</FieldError>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="teamSize">Team Size</FieldLabel>
          <select
            id="teamSize"
            {...register("teamSize")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue=""
          >
            <option value="" disabled>
              Select team size
            </option>
            {TEAM_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="min-h-5">
            {errors.teamSize && (
              <FieldError>{errors.teamSize.message}</FieldError>
            )}
          </div>
        </Field>

        {apiError && (
          <p className="text-sm text-destructive">{apiError}</p>
        )}

        <Button
          type="submit"
          className="w-full mt-2 gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              Register Your Agency
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export { AgencySignupForm };
