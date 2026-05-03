"use client";

import { useFormContext } from "react-hook-form";
import { Check, Pencil } from "lucide-react";

import type { SalesRepApplication } from "@/lib/schemas/sales-rep-application";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface StepSalesReviewProps {
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

const ReviewField = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm">{value || "—"}</p>
  </div>
);

const StepSalesReview = ({ onEditStep }: StepSalesReviewProps) => {
  const { getValues } = useFormContext<SalesRepApplication>();
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
        <ReviewField label="Sales Role" value={data.salesRoleTitle} />
        <ReviewField
          label="Years of Experience"
          value={data.yearsOfExperience?.toString()}
        />
        <div>
          <p className="text-xs text-muted-foreground">
            Target Monthly OTE / Salary
          </p>
          <p className="font-mono text-sm">
            {data.salaryCurrency && data.salaryAmount != null
              ? `${data.salaryCurrency} ${data.salaryAmount.toLocaleString()}/mo`
              : "—"}
          </p>
        </div>
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
        <p className="text-sm text-muted-foreground">
          No work experience added.
        </p>
      )}

      <Separator />

      {/* Sales Tools */}
      <SectionHeader
        title="Sales Tools & Methodology"
        step={2}
        onEdit={onEditStep}
      />
      <div>
        <p className="mb-2 text-xs text-muted-foreground">Tools & CRMs</p>
        <div className="flex flex-wrap gap-1.5">
          {data.salesTools?.map((tool) => (
            <Badge key={tool} variant="secondary" className="text-xs">
              {tool}
            </Badge>
          ))}
          {(!data.salesTools || data.salesTools.length === 0) && (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      </div>
      {data.salesMethodologies && data.salesMethodologies.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">Methodologies</p>
          <div className="flex flex-wrap gap-1.5">
            {data.salesMethodologies.map((m) => (
              <Badge key={m} variant="outline" className="text-xs">
                {m}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {data.industriesSold && data.industriesSold.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">
            Industries Sold Into
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.industriesSold.map((ind) => (
              <Badge key={ind} variant="outline" className="text-xs">
                {ind}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {data.certifications && (
        <ReviewField
          label="Certifications & Achievements"
          value={data.certifications}
        />
      )}

      <Separator />

      {/* Links & Uploads */}
      <SectionHeader title="Links & Uploads" step={3} onEdit={onEditStep} />
      <div className="grid grid-cols-1 gap-4">
        <ReviewField label="LinkedIn" value={data.linkedinUrl} />
        {data.portfolioUrl && (
          <ReviewField label="Portfolio" value={data.portfolioUrl} />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ReviewField label="Resume" value={data.resumeFile?.name} />
        <ReviewField label="Profile Photo" value={data.profilePhoto?.name} />
      </div>

      <Separator />

      {/* Preferences */}
      <SectionHeader title="Preferences" step={4} onEdit={onEditStep} />
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

      <Separator />

      {/* Video Introduction */}
      <SectionHeader title="Video Introduction" step={5} onEdit={onEditStep} />
      {data.introVideo ? (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
          <Check className="size-4 text-emerald-600" />
          <div>
            <p className="text-sm font-medium">Video recorded</p>
            <p className="text-xs text-muted-foreground">
              {data.introVideo.name} &middot;{" "}
              {(data.introVideo.size / (1024 * 1024)).toFixed(1)}MB
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-destructive">
          No video recorded. Please go back and record your introduction.
        </p>
      )}
    </div>
  );
};

export { StepSalesReview };
