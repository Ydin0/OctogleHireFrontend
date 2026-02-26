"use client";

import { Pencil } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { CompanyEnquiry } from "@/lib/schemas/company-enquiry";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface StepReviewProps {
  onEditStep: (step: number) => void;
}

const engagementLabels: Record<CompanyEnquiry["preferredEngagementType"], string> = {
  hourly: "Hourly",
  "part-time": "Part-Time",
  "full-time": "Full-Time",
  "project-based": "Project-Based",
  "not-sure": "Not Sure Yet",
};

const heardAboutLabels: Record<CompanyEnquiry["heardAbout"], string> = {
  google: "Google Search",
  linkedin: "LinkedIn",
  referral: "Referral",
  "social-media": "Social Media",
  blog: "Blog / Resource",
  other: "Other",
};

const SectionHeader = ({
  title,
  step,
  onEdit,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
}) => (
  <div className="flex items-center justify-between">
    <h3 className="text-sm font-semibold">{title}</h3>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-auto gap-1 px-2 py-1 text-xs text-muted-foreground"
      onClick={() => onEdit(step)}
    >
      <Pencil className="size-3" />
      Edit
    </Button>
  </div>
);

const ReviewField = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm">{value || "-"}</p>
  </div>
);

const StepReview = ({ onEditStep }: StepReviewProps) => {
  const { getValues } = useFormContext<CompanyEnquiry>();
  const data = getValues();

  return (
    <div className="space-y-5">
      <SectionHeader title="Company Information" step={0} onEdit={onEditStep} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ReviewField label="Company Name" value={data.companyName} />
        <ReviewField label="Contact Person" value={data.contactName} />
        <ReviewField label="Business Email" value={data.businessEmail} />
        <ReviewField label="Phone" value={data.phone} />
      </div>
      {(data.companyWebsite || data.linkedinUrl) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.companyWebsite && (
            <ReviewField label="Company Website" value={data.companyWebsite} />
          )}
          {data.linkedinUrl && (
            <ReviewField label="Company LinkedIn" value={data.linkedinUrl} />
          )}
        </div>
      )}

      <Separator />

      <SectionHeader title="Role Requirements" step={1} onEdit={onEditStep} />
      <ReviewField
        label="Project Description / Role Requirements"
        value={data.projectDescription}
      />

      <Separator />

      <SectionHeader title="Preferences" step={2} onEdit={onEditStep} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ReviewField
          label="Preferred Engagement"
          value={
            data.preferredEngagementType
              ? engagementLabels[data.preferredEngagementType]
              : undefined
          }
        />
        <ReviewField label="Estimated Start Date" value={data.estimatedStartDate} />
        <ReviewField
          label="How You Heard About Us"
          value={data.heardAbout ? heardAboutLabels[data.heardAbout] : undefined}
        />
      </div>
    </div>
  );
};

export { StepReview };
