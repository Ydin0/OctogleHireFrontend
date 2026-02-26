"use client";

import { useFormContext } from "react-hook-form";

import type { CompanyEnquiry } from "@/lib/schemas/company-enquiry";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const StepCompanyInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CompanyEnquiry>();

  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
        <Input
          id="companyName"
          placeholder="Acme Labs"
          {...register("companyName")}
        />
        {errors.companyName && (
          <FieldError>{errors.companyName.message}</FieldError>
        )}
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="contactName">Contact Person</FieldLabel>
          <Input
            id="contactName"
            placeholder="Jane Smith"
            {...register("contactName")}
          />
          {errors.contactName && (
            <FieldError>{errors.contactName.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="businessEmail">Business Email</FieldLabel>
          <Input
            id="businessEmail"
            type="email"
            placeholder="jane@acme.com"
            {...register("businessEmail")}
          />
          {errors.businessEmail && (
            <FieldError>{errors.businessEmail.message}</FieldError>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register("phone")}
          />
          {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="companyWebsite">
            Company Website
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (optional)
            </span>
          </FieldLabel>
          <Input
            id="companyWebsite"
            type="url"
            placeholder="https://acme.com"
            {...register("companyWebsite")}
          />
          {errors.companyWebsite && (
            <FieldError>{errors.companyWebsite.message}</FieldError>
          )}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="linkedinUrl">
          Company LinkedIn
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        </FieldLabel>
        <Input
          id="linkedinUrl"
          type="url"
          placeholder="https://linkedin.com/company/acme"
          {...register("linkedinUrl")}
        />
        {errors.linkedinUrl && (
          <FieldError>{errors.linkedinUrl.message}</FieldError>
        )}
      </Field>
    </div>
  );
};

export { StepCompanyInfo };
