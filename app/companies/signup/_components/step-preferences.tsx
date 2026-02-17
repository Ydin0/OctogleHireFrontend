"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Briefcase, CalendarDays, Megaphone } from "lucide-react";

import type { CompanyEnquiry } from "@/lib/schemas/company-enquiry";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface CardOption {
  value: CompanyEnquiry["preferredEngagementType"];
  label: string;
  description: string;
}

const engagementOptions: CardOption[] = [
  {
    value: "hourly",
    label: "Hourly",
    description: "Best for scoped tasks or ongoing support",
  },
  {
    value: "part-time",
    label: "Part-Time",
    description: "Roughly 20 hours per week",
  },
  {
    value: "full-time",
    label: "Full-Time",
    description: "Roughly 40 hours per week",
  },
  {
    value: "project-based",
    label: "Project-Based",
    description: "Outcome-focused delivery",
  },
  {
    value: "not-sure",
    label: "Not Sure Yet",
    description: "Need help deciding the best model",
  },
];

const heardAboutOptions: Array<{ value: CompanyEnquiry["heardAbout"]; label: string }> = [
  { value: "google", label: "Google Search" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "referral", label: "Referral" },
  { value: "social-media", label: "Social Media" },
  { value: "blog", label: "Blog / Resource" },
  { value: "other", label: "Other" },
];

const EngagementCards = ({
  value,
  onChange,
}: {
  value: CompanyEnquiry["preferredEngagementType"] | "";
  onChange: (next: CompanyEnquiry["preferredEngagementType"]) => void;
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {engagementOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex flex-col items-start rounded-lg border-2 p-4 text-left transition-colors",
            value === option.value
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/30 hover:bg-muted/50",
          )}
        >
          <span className="text-sm font-semibold">{option.label}</span>
          <span className="mt-0.5 text-xs text-muted-foreground">
            {option.description}
          </span>
        </button>
      ))}
    </div>
  );
};

const StepPreferences = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CompanyEnquiry>();

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel className="flex items-center gap-2">
          <Briefcase className="size-4" />
          Preferred Engagement Type
        </FieldLabel>
        <Controller
          name="preferredEngagementType"
          control={control}
          render={({ field }) => (
            <EngagementCards
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        {errors.preferredEngagementType && (
          <FieldError>{errors.preferredEngagementType.message}</FieldError>
        )}
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="estimatedStartDate" className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            Estimated Start Date
          </FieldLabel>
          <Input
            id="estimatedStartDate"
            type="date"
            {...register("estimatedStartDate")}
          />
          {errors.estimatedStartDate && (
            <FieldError>{errors.estimatedStartDate.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="heardAbout" className="flex items-center gap-2">
            <Megaphone className="size-4" />
            How did you hear about OctogleHire?
          </FieldLabel>
          <select
            id="heardAbout"
            className="border-input bg-background ring-offset-background focus-visible:ring-ring/50 flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
            {...register("heardAbout")}
            defaultValue=""
          >
            <option value="" disabled>
              Select one
            </option>
            {heardAboutOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.heardAbout && (
            <FieldError>{errors.heardAbout.message}</FieldError>
          )}
        </Field>
      </div>
    </div>
  );
};

export { StepPreferences };
