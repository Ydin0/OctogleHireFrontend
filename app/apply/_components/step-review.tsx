"use client";

import { useFormContext } from "react-hook-form";
import { Pencil } from "lucide-react";

import type { Application } from "@/lib/schemas/application";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface StepReviewProps {
  onEditStep: (step: number) => void;
}

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

const ReviewField = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm">{value || "—"}</p>
  </div>
);

const StepReview = ({ onEditStep }: StepReviewProps) => {
  const { getValues } = useFormContext<Application>();
  const data = getValues();

  const engagementLabels: Record<string, string> = {
    hourly: "Hourly",
    "part-time": "Part-Time",
    "full-time": "Full-Time",
  };

  const availabilityLabels: Record<string, string> = {
    immediate: "Immediate",
    "2-weeks": "2 Weeks",
    "1-month": "1 Month",
  };

  const englishLabels: Record<string, string> = {
    basic: "Basic",
    conversational: "Conversational",
    fluent: "Fluent",
    native: "Native",
  };

  return (
    <div className="space-y-5">
      {/* About You */}
      <SectionHeader title="About You" step={0} onEdit={onEditStep} />
      <div className="grid grid-cols-2 gap-4">
        <ReviewField label="Full Name" value={data.fullName} />
        <ReviewField label="Email" value={data.email} />
        <ReviewField label="Phone" value={data.phone} />
        <ReviewField
          label="Location"
          value={
            data.locationCity && data.locationState
              ? `${data.locationCity}, ${data.locationState}`
              : undefined
          }
        />
        <ReviewField label="Title" value={data.professionalTitle} />
        <ReviewField
          label="Years of Experience"
          value={data.yearsOfExperience?.toString()}
        />
      </div>
      <ReviewField label="Bio" value={data.bio} />

      <Separator />

      {/* Work Experience */}
      <SectionHeader title="Work Experience" step={1} onEdit={onEditStep} />
      {data.workExperience && data.workExperience.length > 0 ? (
        <div className="space-y-3">
          {data.workExperience.map((exp, i) => (
            <div key={i} className="rounded-lg border p-3">
              <p className="text-sm font-semibold">
                {exp.title || "—"}{" "}
                <span className="font-normal text-muted-foreground">
                  at {exp.company || "—"}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {exp.startDate || "—"} &ndash;{" "}
                {exp.current ? "Present" : exp.endDate || "—"}
              </p>
              {exp.description && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No work experience added.</p>
      )}

      <Separator />

      {/* Education */}
      <SectionHeader title="Education" step={2} onEdit={onEditStep} />
      {data.education && data.education.length > 0 ? (
        <div className="space-y-3">
          {data.education.map((edu, i) => (
            <div key={i} className="rounded-lg border p-3">
              <p className="text-sm font-semibold">
                {edu.institution || "—"}
              </p>
              {edu.degree && (
                <p className="text-xs text-muted-foreground">{edu.degree}</p>
              )}
              {edu.grade && (
                <p className="text-xs text-muted-foreground">Grade: {edu.grade}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {edu.startYear || "—"} &ndash; {edu.endYear || "—"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No education added.</p>
      )}

      <Separator />

      {/* Tech Stack */}
      <SectionHeader title="Tech Stack & Skills" step={3} onEdit={onEditStep} />
      <div>
        <p className="mb-2 text-xs text-muted-foreground">Primary Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {data.primaryStack?.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {(!data.primaryStack || data.primaryStack.length === 0) && (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      </div>
      {data.secondarySkills && (
        <ReviewField label="Secondary Skills" value={data.secondarySkills} />
      )}
      {data.certifications && (
        <ReviewField
          label="Certifications & Key Achievements"
          value={data.certifications}
        />
      )}

      <Separator />

      {/* Links & Uploads */}
      <SectionHeader title="Links & Uploads" step={4} onEdit={onEditStep} />
      <div className="grid grid-cols-1 gap-4">
        <ReviewField label="LinkedIn" value={data.linkedinUrl} />
        <ReviewField label="GitHub" value={data.githubUrl} />
        {data.portfolioUrl && (
          <ReviewField label="Portfolio" value={data.portfolioUrl} />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ReviewField
          label="Resume"
          value={data.resumeFile?.name}
        />
        <ReviewField
          label="Profile Photo"
          value={data.profilePhoto?.name}
        />
      </div>

      <Separator />

      {/* Preferences */}
      <SectionHeader title="Preferences" step={5} onEdit={onEditStep} />
      <div className="grid grid-cols-2 gap-4">
        <ReviewField
          label="Engagement Type"
          value={
            Array.isArray(data.engagementType)
              ? data.engagementType
                  .map((t) => engagementLabels[t] ?? t)
                  .join(", ")
              : engagementLabels[data.engagementType] ?? data.engagementType
          }
        />
        <ReviewField
          label="Availability"
          value={availabilityLabels[data.availability] ?? data.availability}
        />
        <ReviewField
          label="English Proficiency"
          value={
            englishLabels[data.englishProficiency] ?? data.englishProficiency
          }
        />
      </div>
    </div>
  );
};

export { StepReview };
