"use client";

import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { Application } from "@/lib/schemas/application";
import { PROFESSIONAL_TITLE_OPTIONS } from "@/lib/data/professional-titles";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const MAX_TITLE_SUGGESTIONS = 10;

const filterTitleSuggestions = (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return PROFESSIONAL_TITLE_OPTIONS.slice(0, MAX_TITLE_SUGGESTIONS);
  }

  const startsWith = PROFESSIONAL_TITLE_OPTIONS.filter((option) =>
    option.toLowerCase().startsWith(normalizedQuery),
  );
  const contains = PROFESSIONAL_TITLE_OPTIONS.filter((option) => {
    const normalizedOption = option.toLowerCase();
    return (
      !normalizedOption.startsWith(normalizedQuery) &&
      normalizedOption.includes(normalizedQuery)
    );
  });

  return startsWith.concat(contains).slice(0, MAX_TITLE_SUGGESTIONS);
};

const StepProfessional = () => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<Application>();

  const bio = watch("bio") ?? "";
  const professionalTitle = useWatch({ control, name: "professionalTitle" }) ?? "";
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const titleSuggestions = useMemo(
    () => filterTitleSuggestions(professionalTitle),
    [professionalTitle],
  );

  const handleTitleInputChange = (value: string) => {
    setValue("professionalTitle", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setIsTitleDropdownOpen(true);
  };

  const handleTitleSuggestionSelect = (value: string) => {
    setValue("professionalTitle", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setIsTitleDropdownOpen(false);
  };

  const closeTitleDropdown = () => {
    setTimeout(() => setIsTitleDropdownOpen(false), 120);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_8rem]">
        <Field>
          <FieldLabel htmlFor="professionalTitle">Professional Title</FieldLabel>
          <input type="hidden" {...register("professionalTitle")} />
          <div className="relative">
            <Input
              id="professionalTitle"
              placeholder="e.g. Full-Stack Developer"
              autoComplete="off"
              value={professionalTitle}
              onChange={(event) => handleTitleInputChange(event.target.value)}
              onFocus={() => setIsTitleDropdownOpen(true)}
              onBlur={closeTitleDropdown}
            />
            {isTitleDropdownOpen && (
              <div className="absolute z-40 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-background shadow-md">
                {titleSuggestions.length > 0 ? (
                  titleSuggestions.map((option) => (
                    <button
                      key={`title-option-${option}`}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleTitleSuggestionSelect(option);
                      }}
                    >
                      {option}
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    No titles found
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="min-h-5">
            {errors.professionalTitle && (
              <FieldError>{errors.professionalTitle.message}</FieldError>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="yearsOfExperience">Years Exp.</FieldLabel>
          <Input
            id="yearsOfExperience"
            type="number"
            min={0}
            max={50}
            placeholder="5"
            {...register("yearsOfExperience")}
          />
          <div className="min-h-5">
            {errors.yearsOfExperience && (
              <FieldError>{errors.yearsOfExperience.message}</FieldError>
            )}
          </div>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Textarea
          id="bio"
          placeholder="Tell us about your experience, expertise, and what makes you a great developer..."
          rows={3}
          {...register("bio")}
        />
        <div className="flex min-h-5 items-center justify-between gap-2">
          <div>
            {errors.bio ? (
              <FieldError>{errors.bio.message}</FieldError>
            ) : null}
          </div>
          <span className="text-xs text-muted-foreground">
            {bio.length}/500
          </span>
        </div>
      </Field>
    </div>
  );
};

export { StepProfessional };
