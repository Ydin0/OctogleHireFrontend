"use client";

import { useFormContext, Controller } from "react-hook-form";

import type { SalesRepApplication } from "@/lib/schemas/sales-rep-application";
import {
  SALES_TOOL_OPTIONS,
  SALES_METHODOLOGY_OPTIONS,
  INDUSTRY_OPTIONS,
} from "@/lib/data/sales-rep-options";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { TechStackSelector } from "@/app/apply/_components/tech-stack-selector";

const StepSalesTools = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<SalesRepApplication>();

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel>Sales Tools & CRMs</FieldLabel>
        <Controller
          name="salesTools"
          control={control}
          render={({ field }) => (
            <TechStackSelector
              value={field.value ?? []}
              onChange={field.onChange}
              max={12}
              options={[...SALES_TOOL_OPTIONS]}
              placeholder="Search Salesforce, HubSpot, Outreach..."
              itemLabel="tools"
            />
          )}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Pick up to 12. Include CRMs, prospecting tools, and conversation
          intelligence platforms you&rsquo;ve used in the last 2 years.
        </p>
        <div className="min-h-5">
          {errors.salesTools && (
            <FieldError>{errors.salesTools.message}</FieldError>
          )}
        </div>
      </Field>

      <Field>
        <FieldLabel>Sales Methodologies (optional)</FieldLabel>
        <Controller
          name="salesMethodologies"
          control={control}
          render={({ field }) => (
            <TechStackSelector
              value={field.value ?? []}
              onChange={field.onChange}
              max={6}
              options={[...SALES_METHODOLOGY_OPTIONS]}
              placeholder="Search MEDDIC, Challenger, BANT..."
              itemLabel="methodologies"
            />
          )}
        />
        <div className="min-h-5">
          {errors.salesMethodologies && (
            <FieldError>{errors.salesMethodologies.message}</FieldError>
          )}
        </div>
      </Field>

      <Field>
        <FieldLabel>Industries Sold Into (optional)</FieldLabel>
        <Controller
          name="industriesSold"
          control={control}
          render={({ field }) => (
            <TechStackSelector
              value={field.value ?? []}
              onChange={field.onChange}
              max={8}
              options={[...INDUSTRY_OPTIONS]}
              placeholder="Search B2B SaaS, FinTech, Healthcare..."
              itemLabel="industries"
            />
          )}
        />
        <div className="min-h-5">
          {errors.industriesSold && (
            <FieldError>{errors.industriesSold.message}</FieldError>
          )}
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="certifications">
          Sales Certifications & Achievements (optional)
        </FieldLabel>
        <Textarea
          id="certifications"
          placeholder="e.g., 130% of quota in 2024, President's Club 2023, Sandler Foundations..."
          rows={3}
          {...register("certifications")}
        />
        <div className="min-h-5">
          {errors.certifications && (
            <FieldError>{errors.certifications.message}</FieldError>
          )}
        </div>
      </Field>
    </div>
  );
};

export { StepSalesTools };
