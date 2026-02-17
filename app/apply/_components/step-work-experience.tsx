"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import type { Application } from "@/lib/schemas/application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const StepWorkExperience = () => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<Application>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

  const addEntry = () => {
    append({
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    });
  };

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No work experience added yet.
          </p>
        </div>
      )}

      {fields.map((field, index) => {
        const isCurrent = watch(`workExperience.${index}.current`);
        const fieldErrors = errors.workExperience?.[index];

        return (
          <div
            key={field.id}
            className="space-y-3 rounded-lg border p-4"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Experience {index + 1}
              </span>
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`workExperience.${index}.company`}>
                  Company
                </FieldLabel>
                <Input
                  id={`workExperience.${index}.company`}
                  placeholder="Acme Inc."
                  {...register(`workExperience.${index}.company`)}
                />
                <div className="min-h-5">
                  {fieldErrors?.company && (
                    <FieldError>{fieldErrors.company.message}</FieldError>
                  )}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor={`workExperience.${index}.title`}>
                  Title
                </FieldLabel>
                <Input
                  id={`workExperience.${index}.title`}
                  placeholder="Senior Developer"
                  {...register(`workExperience.${index}.title`)}
                />
                <div className="min-h-5">
                  {fieldErrors?.title && (
                    <FieldError>{fieldErrors.title.message}</FieldError>
                  )}
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`workExperience.${index}.startDate`}>
                  Start Date
                </FieldLabel>
                <Input
                  id={`workExperience.${index}.startDate`}
                  placeholder="Jan 2022"
                  {...register(`workExperience.${index}.startDate`)}
                />
                <div className="min-h-5">
                  {fieldErrors?.startDate && (
                    <FieldError>{fieldErrors.startDate.message}</FieldError>
                  )}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor={`workExperience.${index}.endDate`}>
                  End Date
                </FieldLabel>
                <Input
                  id={`workExperience.${index}.endDate`}
                  placeholder={isCurrent ? "Present" : "Dec 2023"}
                  disabled={isCurrent}
                  {...register(`workExperience.${index}.endDate`)}
                />
                <div className="min-h-5">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`workExperience.${index}.current`}
                      size="sm"
                      checked={isCurrent}
                      onCheckedChange={(checked) => {
                        setValue(
                          `workExperience.${index}.current`,
                          checked === true,
                        );
                        if (checked) {
                          setValue(`workExperience.${index}.endDate`, "");
                        }
                      }}
                    />
                    <label
                      htmlFor={`workExperience.${index}.current`}
                      className="text-xs text-muted-foreground"
                    >
                      Current role
                    </label>
                  </div>
                </div>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor={`workExperience.${index}.description`}>
                Description (optional)
              </FieldLabel>
              <Textarea
                id={`workExperience.${index}.description`}
                placeholder="Key responsibilities and achievements..."
                rows={2}
                {...register(`workExperience.${index}.description`)}
              />
            </Field>
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
        Add Experience
      </Button>
    </div>
  );
};

export { StepWorkExperience };
