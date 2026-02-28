"use client";

import { useState } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { companyLeadSchema, type CompanyLead } from "@/lib/schemas/company-enquiry";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const CALENDLY_URL = "https://calendly.com/yaseen-octogle/30min";

type View = "form" | "calendly";

const CompanySignupForm = () => {
  const [view, setView] = useState<View>("form");
  const [contactName, setContactName] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyLead>({
    resolver: zodResolver(companyLeadSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: CompanyLead) => {
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/company-enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setApiError(body.message ?? "Something went wrong. Please try again.");
        return;
      }

      setContactName(data.contactName);
      setView("calendly");
    } catch {
      setApiError("Unable to connect. Please check your connection and try again.");
    }
  };

  if (view === "calendly") {
    return (
      <div className="animate-in fade-in duration-500">
        <p className="mb-4 text-sm text-muted-foreground">
          Thanks {contactName.split(" ")[0]}! Pick a time below to book your discovery call.
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

        {apiError && (
          <p className="text-sm text-destructive">{apiError}</p>
        )}

        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Book a Call →"}
        </Button>
      </div>
    </form>
  );
};

export { CompanySignupForm };
