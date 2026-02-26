"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Linkedin, Github, Globe } from "lucide-react";

import type { Application } from "@/lib/schemas/application";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { FileUpload } from "./file-upload";

const StepLinks = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<Application>();

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="linkedinUrl">LinkedIn Profile</FieldLabel>
        <div className="relative">
          <Linkedin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="linkedinUrl"
            placeholder="https://linkedin.com/in/yourprofile"
            className="pl-10"
            {...register("linkedinUrl")}
          />
        </div>
        <div className="min-h-5">
          {errors.linkedinUrl && (
            <FieldError>{errors.linkedinUrl.message}</FieldError>
          )}
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="githubUrl">
          GitHub Profile
          <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
        </FieldLabel>
        <div className="relative">
          <Github className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="githubUrl"
            placeholder="https://github.com/yourusername"
            className="pl-10"
            {...register("githubUrl")}
          />
        </div>
        <div className="min-h-5">
          {errors.githubUrl && (
            <FieldError>{errors.githubUrl.message}</FieldError>
          )}
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="portfolioUrl">
          Portfolio Website (optional)
        </FieldLabel>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="portfolioUrl"
            placeholder="https://yourportfolio.com"
            className="pl-10"
            {...register("portfolioUrl")}
          />
        </div>
        <div className="min-h-5">
          {errors.portfolioUrl && (
            <FieldError>{errors.portfolioUrl.message}</FieldError>
          )}
        </div>
      </Field>

      <Field>
        <FieldLabel>Resume / CV (PDF)</FieldLabel>
        <Controller
          name="resumeFile"
          control={control}
          render={({ field }) => (
            <FileUpload
              accept="application/pdf"
              maxSize={5}
              label="Drop resume or click"
              value={field.value}
              onChange={field.onChange}
              error={errors.resumeFile?.message}
            />
          )}
        />
      </Field>
    </div>
  );
};

export { StepLinks };
