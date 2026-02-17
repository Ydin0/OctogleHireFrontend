"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Briefcase, Check, Clock, Languages } from "lucide-react";

import type { Application } from "@/lib/schemas/application";
import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

interface CardOption {
  value: string;
  label: string;
  description: string;
}

const RadioCardGroup = ({
  options,
  value,
  onChange,
}: {
  options: CardOption[];
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((option) => (
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

const MultiSelectCardGroup = ({
  options,
  value,
  onChange,
}: {
  options: CardOption[];
  value: string[];
  onChange: (value: string[]) => void;
}) => {
  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {options.map((option) => {
        const selected = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={cn(
              "relative flex flex-col items-start rounded-lg border-2 p-4 text-left transition-colors",
              selected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30 hover:bg-muted/50",
            )}
          >
            {selected && (
              <div className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-primary">
                <Check className="size-3 text-primary-foreground" />
              </div>
            )}
            <span className="text-sm font-semibold">{option.label}</span>
            <span className="mt-0.5 text-xs text-muted-foreground">
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const engagementOptions: CardOption[] = [
  {
    value: "hourly",
    label: "Hourly",
    description: "Flexible per-hour billing",
  },
  {
    value: "part-time",
    label: "Part-Time",
    description: "20 hours per week",
  },
  {
    value: "full-time",
    label: "Full-Time",
    description: "40 hours per week",
  },
];

const availabilityOptions: CardOption[] = [
  {
    value: "immediate",
    label: "Immediate",
    description: "Available to start now",
  },
  {
    value: "2-weeks",
    label: "2 Weeks",
    description: "Available in 2 weeks",
  },
  {
    value: "1-month",
    label: "1 Month",
    description: "Available in 1 month",
  },
];

const englishOptions: CardOption[] = [
  {
    value: "basic",
    label: "Basic",
    description: "Can read and write simple text",
  },
  {
    value: "conversational",
    label: "Conversational",
    description: "Comfortable in daily conversations",
  },
  {
    value: "fluent",
    label: "Fluent",
    description: "Professional working proficiency",
  },
  {
    value: "native",
    label: "Native",
    description: "Native or bilingual proficiency",
  },
];

const StepPreferences = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Application>();

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel className="flex items-center gap-2">
          <Briefcase className="size-4" />
          Engagement Type
          <span className="text-xs font-normal text-muted-foreground">
            (select all that apply)
          </span>
        </FieldLabel>
        <Controller
          name="engagementType"
          control={control}
          render={({ field }) => (
            <MultiSelectCardGroup
              options={engagementOptions}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
        <div className="min-h-5">
          {errors.engagementType && (
            <FieldError>{errors.engagementType.message}</FieldError>
          )}
        </div>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2">
          <Clock className="size-4" />
          Availability
        </FieldLabel>
        <Controller
          name="availability"
          control={control}
          render={({ field }) => (
            <RadioCardGroup
              options={availabilityOptions}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        <div className="min-h-5">
          {errors.availability && (
            <FieldError>{errors.availability.message}</FieldError>
          )}
        </div>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2">
          <Languages className="size-4" />
          English Proficiency
        </FieldLabel>
        <Controller
          name="englishProficiency"
          control={control}
          render={({ field }) => (
            <RadioCardGroup
              options={englishOptions}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        <div className="min-h-5">
          {errors.englishProficiency && (
            <FieldError>{errors.englishProficiency.message}</FieldError>
          )}
        </div>
      </Field>
    </div>
  );
};

export { StepPreferences };
