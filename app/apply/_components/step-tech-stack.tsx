"use client";

import { useEffect, useRef } from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form";

import type { Application } from "@/lib/schemas/application";
import {
  getCategoryForTitle,
  getSkillOptionsForCategory,
} from "@/lib/data/professional-categories";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { TechStackSelector } from "./tech-stack-selector";

const StepTechStack = () => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<Application>();

  const professionalTitle = useWatch({ control, name: "professionalTitle" }) ?? "";
  const category = getCategoryForTitle(professionalTitle);
  const skillOptions = getSkillOptionsForCategory(category);
  const isEngineering = category === "engineering";

  const prevCategoryRef = useRef(category);

  useEffect(() => {
    if (prevCategoryRef.current !== category) {
      prevCategoryRef.current = category;
      setValue("primaryStack", [], { shouldDirty: true });
    }
  }, [category, setValue]);

  const fieldLabel = isEngineering ? "Primary Tech Stack" : "Primary Skills & Tools";
  const selectorPlaceholder = isEngineering
    ? "Search technologies..."
    : category === "design"
      ? "Search design tools & skills..."
      : category === "marketing"
        ? "Search marketing tools & skills..."
        : "Search HR tools & skills...";
  const selectorItemLabel = isEngineering ? "technologies" : "skills";
  const secondaryPlaceholder = isEngineering
    ? "e.g., Machine Learning, CI/CD, System Design..."
    : category === "design"
      ? "e.g., Design Thinking, Creative Direction, Art Direction..."
      : category === "marketing"
        ? "e.g., Affiliate Marketing, Community Building, Event Marketing..."
        : "e.g., Mediation, Executive Coaching, Policy Writing...";

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel>{fieldLabel}</FieldLabel>
        <Controller
          name="primaryStack"
          control={control}
          render={({ field }) => (
            <TechStackSelector
              value={field.value ?? []}
              onChange={field.onChange}
              max={8}
              options={skillOptions}
              placeholder={selectorPlaceholder}
              itemLabel={selectorItemLabel}
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
          placeholder={secondaryPlaceholder}
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
