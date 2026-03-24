"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Calendar, Check } from "lucide-react";

import { trackMetaEvent } from "@/lib/analytics/meta-events";
import { useCalendlyLead } from "@/lib/analytics/use-calendly-lead";
import { companyLeadSchema, type CompanyLead } from "@/lib/schemas/company-enquiry";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/phone-input";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const CALENDLY_URL = "https://calendly.com/yaseen-octogle/30min";

type View = "form" | "success";

const CompanySignupForm = () => {
  const [view, setView] = useState<View>("form");
  const [contactName, setContactName] = useState("");
  const [showCalendly, setShowCalendly] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useCalendlyLead(showCalendly);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyLead>({
    resolver: zodResolver(companyLeadSchema),
    mode: "onTouched",
  });

  const phoneValue = watch("phone") ?? "";

  const onSubmit = async (data: CompanyLead) => {
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/company-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setApiError(body.message ?? "Something went wrong. Please try again.");
        return;
      }

      trackMetaEvent("Lead", {
        content_name: "Company Signup",
        content_category: "company",
      });

      setContactName(data.contactName);
      setView("success");
    } catch {
      setApiError("Unable to connect. Please check your connection and try again.");
    }
  };

  if (view === "success" && showCalendly) {
    return (
      <div className="animate-in fade-in duration-500">
        <p className="mb-4 text-sm text-muted-foreground">
          Pick a time below to book your demo with Yaseen.
        </p>
        <div
          className="calendly-inline-widget"
          data-url={CALENDLY_URL}
          style={{ minWidth: "100%", height: "650px" }}
        />
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />
      </div>
    );
  }

  if (view === "success") {
    const firstName = contactName.split(" ")[0];
    return (
      <div className="animate-in fade-in duration-500 space-y-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
            <Check className="size-5 text-emerald-500" strokeWidth={2.5} />
          </span>
          <div>
            <p className="text-sm font-semibold">Account created, {firstName}!</p>
            <p className="text-sm text-muted-foreground">
              Check your email for login instructions.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full rounded-full gap-2"
            onClick={() => setShowCalendly(true)}
          >
            <Calendar className="size-4" />
            Book a Demo with Yaseen
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full gap-2"
          >
            <Link href="/login">
              Skip and go to Dashboard
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          You can always book a demo later from your dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="animate-in fade-in duration-300">
      <div className="space-y-4">
        <Field>
          <FieldLabel htmlFor="contactName">Full Name</FieldLabel>
          <Input
            id="contactName"
            placeholder="Jane Smith"
            {...register("contactName")}
          />
          <div className="min-h-5">
            {errors.contactName && (
              <FieldError>{errors.contactName.message}</FieldError>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
          <Input
            id="companyName"
            placeholder="Acme Labs"
            {...register("companyName")}
          />
          <div className="min-h-5">
            {errors.companyName && (
              <FieldError>{errors.companyName.message}</FieldError>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Work Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="jane@acme.com"
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
          <input type="hidden" {...register("phone")} />
          <PhoneInput
            id="phone"
            value={phoneValue}
            onChange={(v) => setValue("phone", v, { shouldValidate: true })}
          />
          <div className="min-h-5">
            {errors.phone && (
              <FieldError>{errors.phone.message}</FieldError>
            )}
          </div>
        </Field>

        {/* Honeypot — hidden from humans */}
        <div className="hidden" aria-hidden="true">
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        {apiError && (
          <p className="text-sm text-destructive">{apiError}</p>
        )}

        <Button type="submit" className="w-full rounded-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Creating your account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export { CompanySignupForm };
