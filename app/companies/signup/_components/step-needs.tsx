"use client";

import { useFormContext } from "react-hook-form";

import type { CompanyEnquiry } from "@/lib/schemas/company-enquiry";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

const StepNeeds = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CompanyEnquiry>();

  const projectDescription = watch("projectDescription") ?? "";

  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel htmlFor="projectDescription">
          Project Description / Role Requirements
        </FieldLabel>
        <Textarea
          id="projectDescription"
          rows={8}
          placeholder="Tell us what you are building, the profile you need, key technologies, and team setup."
          {...register("projectDescription")}
        />
        <div className="flex items-center justify-between">
          {errors.projectDescription ? (
            <FieldError>{errors.projectDescription.message}</FieldError>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            {projectDescription.length}/2000 characters
          </span>
        </div>
      </Field>
    </div>
  );
};

export { StepNeeds };
