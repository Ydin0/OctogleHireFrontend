"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  companyLeadSchema,
  type CompanyLead,
} from "@/lib/schemas/company-enquiry";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const COPY = {
  "locked-profile": {
    title: "Unlock This Developer Profile",
    description:
      "Fill in your details and our team will give you full access to our developer marketplace.",
  },
  pagination: {
    title: "See More Developers",
    description:
      "Leave your details and our team will connect you with the right developers for your needs.",
  },
} as const;

interface LeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: "locked-profile" | "pagination";
}

function LeadCaptureDialog({
  open,
  onOpenChange,
  trigger,
}: LeadCaptureDialogProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyLead>({
    resolver: zodResolver(companyLeadSchema),
    mode: "onTouched",
  });

  const copy = COPY[trigger];

  const onSubmit = async (data: CompanyLead) => {
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/company-enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        setApiError(body.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmittedName(data.contactName.split(" ")[0]);
      setSubmitted(true);
    } catch {
      setApiError(
        "Unable to connect. Please check your connection and try again."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center text-center space-y-4 py-6">
            <CheckCircle className="size-10 text-pulse" />
            <h3 className="text-lg font-semibold">
              Thanks {submittedName}!
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Our team will reach out within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{copy.title}</DialogTitle>
              <DialogDescription>{copy.description}</DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-3"
            >
              <Field>
                <FieldLabel htmlFor="lc-contactName">Full Name</FieldLabel>
                <Input
                  id="lc-contactName"
                  placeholder="Jane Smith"
                  className="h-11 rounded-lg"
                  {...register("contactName")}
                />
                <div className="min-h-5">
                  {errors.contactName && (
                    <FieldError>{errors.contactName.message}</FieldError>
                  )}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="lc-companyName">Company Name</FieldLabel>
                <Input
                  id="lc-companyName"
                  placeholder="Acme Labs"
                  className="h-11 rounded-lg"
                  {...register("companyName")}
                />
                <div className="min-h-5">
                  {errors.companyName && (
                    <FieldError>{errors.companyName.message}</FieldError>
                  )}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="lc-email">Work Email</FieldLabel>
                <Input
                  id="lc-email"
                  type="email"
                  placeholder="jane@acme.com"
                  className="h-11 rounded-lg"
                  {...register("email")}
                />
                <div className="min-h-5">
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="lc-phone">Phone Number</FieldLabel>
                <Input
                  id="lc-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="h-11 rounded-lg"
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

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Get Started"}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              No fees until you hire. Cancel anytime.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { LeadCaptureDialog };
