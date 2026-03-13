"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import { fetchCompanyRequirement, type JobRequirement } from "@/lib/api/companies";
import { RequirementForm } from "../../new/_components/requirement-form";
import type { JobRequirementFormData } from "@/lib/schemas/job-requirement";

export default function EditRequirementPage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const [requirement, setRequirement] = useState<JobRequirement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      const data = await fetchCompanyRequirement(token, id);
      setRequirement(data);
      setLoading(false);
    }
    load();
  }, [getToken, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Requirement not found.
      </div>
    );
  }

  const initialValues: Partial<JobRequirementFormData> = {
    title: requirement.title,
    techStack: requirement.techStack,
    experienceYearsMin: requirement.experienceYearsMin ?? 3,
    experienceYearsMax: requirement.experienceYearsMax ?? 5,
    developersNeeded: requirement.developersNeeded,
    engagementType: requirement.engagementType,
    timezonePreference: requirement.timezonePreference as JobRequirementFormData["timezonePreference"],
    hiringCountries: requirement.hiringCountries,
    budgetMin: requirement.budgetMin != null ? String(requirement.budgetMin) : undefined,
    budgetMax: requirement.budgetMax != null ? String(requirement.budgetMax) : undefined,
    budgetType: requirement.budgetType ?? "hourly",
    description: requirement.description,
    startDate: requirement.startDate,
    priority: requirement.priority,
  };

  return (
    <RequirementForm
      mode="edit"
      requirementId={id}
      initialValues={initialValues}
    />
  );
}
