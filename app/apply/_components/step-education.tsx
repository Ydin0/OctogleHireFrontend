"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

import type { Application } from "@/lib/schemas/application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const StepEducation = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<Application>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const addEntry = () => {
    append({
      institution: "",
      degree: "",
      grade: "",
      startYear: "",
      endYear: "",
      institutionLogoUrl: "",
    });
  };

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No education added yet.
          </p>
        </div>
      )}

      {fields.map((field, index) => {
        const fieldErrors = errors.education?.[index];
        const logoUrl = watch(`education.${index}.institutionLogoUrl`);

        return (
          <div
            key={field.id}
            className="space-y-3 rounded-lg border p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt=""
                    className="size-6 rounded object-contain"
                  />
                ) : (
                  <div className="flex size-6 items-center justify-center rounded bg-muted">
                    <GraduationCap className="size-3.5 text-muted-foreground" />
                  </div>
                )}
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Education {index + 1}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground hover:text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            <Field>
              <FieldLabel htmlFor={`education.${index}.institution`}>
                Institution
              </FieldLabel>
              <Input
                id={`education.${index}.institution`}
                placeholder="University of Example"
                {...register(`education.${index}.institution`)}
              />
              <div className="min-h-5">
                {fieldErrors?.institution && (
                  <FieldError>{fieldErrors.institution.message}</FieldError>
                )}
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor={`education.${index}.degree`}>
                Degree (optional)
              </FieldLabel>
              <Input
                id={`education.${index}.degree`}
                placeholder="BSc Computer Science"
                {...register(`education.${index}.degree`)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={`education.${index}.grade`}>
                Grade (optional)
              </FieldLabel>
              <Input
                id={`education.${index}.grade`}
                placeholder="First Class Honours"
                {...register(`education.${index}.grade`)}
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`education.${index}.startYear`}>
                  Start Year
                </FieldLabel>
                <Input
                  id={`education.${index}.startYear`}
                  placeholder="2018"
                  {...register(`education.${index}.startYear`)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor={`education.${index}.endYear`}>
                  End Year
                </FieldLabel>
                <Input
                  id={`education.${index}.endYear`}
                  placeholder="2022"
                  {...register(`education.${index}.endYear`)}
                />
              </Field>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={addEntry}
      >
        <Plus className="size-4" />
        Add Education
      </Button>
    </div>
  );
};

export { StepEducation };
