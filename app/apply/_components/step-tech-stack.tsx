"use client";

import { useFormContext, Controller } from "react-hook-form";

import type { Application } from "@/lib/schemas/application";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { TechStackSelector } from "./tech-stack-selector";

const StepTechStack = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<Application>();

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel>Primary Tech Stack</FieldLabel>
        <Controller
          name="primaryStack"
          control={control}
          render={({ field }) => (
            <TechStackSelector
              value={field.value ?? []}
              onChange={field.onChange}
              max={8}
            />
          )}
        />
        <div className="min-h-5">
          {errors.primaryStack && (
            <FieldError>{errors.primaryStack.message}</FieldError>
          )}
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="secondarySkills">
          Secondary Skills (optional)
        </FieldLabel>
        <Textarea
          id="secondarySkills"
          placeholder="e.g., Machine Learning, CI/CD, System Design..."
          rows={3}
          {...register("secondarySkills")}
        />
        <div className="min-h-5">
          {errors.secondarySkills && (
            <FieldError>{errors.secondarySkills.message}</FieldError>
          )}
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="certifications">
          Certifications & Key Achievements (optional)
        </FieldLabel>
        <Textarea
          id="certifications"
          placeholder="e.g., AWS Solutions Architect, Google Cloud Professional, PMP..."
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

export { StepTechStack };
