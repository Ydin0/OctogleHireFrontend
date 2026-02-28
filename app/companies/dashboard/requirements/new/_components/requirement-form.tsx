"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import {
  jobRequirementSchema,
  type JobRequirementFormData,
} from "@/lib/schemas/job-requirement";
import { createJobRequirement } from "@/lib/api/companies";
import { TechStackSelector } from "@/app/apply/_components/tech-stack-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const RequirementForm = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobRequirementFormData>({
    resolver: zodResolver(jobRequirementSchema),
    defaultValues: {
      techStack: [],
      experienceLevel: "mid",
      developersNeeded: 1,
      engagementType: "full-time",
      timezonePreference: "any",
      priority: "medium",
    },
  });

  const techStack = watch("techStack");

  const onSubmit = async (data: JobRequirementFormData) => {
    setSubmitting(true);
    try {
      const token = await getToken();
      await createJobRequirement(token, {
        ...data,
        budgetMin: data.budgetMin ? Number(data.budgetMin) : undefined,
        budgetMax: data.budgetMax ? Number(data.budgetMax) : undefined,
      });
      router.push("/companies/dashboard/requirements");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="size-8" asChild>
          <Link href="/companies/dashboard/requirements">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold">Post New Requirement</h1>
          <p className="text-sm text-muted-foreground">
            Describe the role and we&apos;ll match you with engineers.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requirement Details</CardTitle>
          <CardDescription>
            Fill out the details below. Our team will start matching engineers once submitted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Role Title</Label>
              <Input
                id="title"
                placeholder="e.g. Senior React Engineer"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <TechStackSelector
                value={techStack}
                onChange={(val) => setValue("techStack", val, { shouldValidate: true })}
              />
              {errors.techStack && (
                <p className="text-xs text-red-600">{errors.techStack.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                  defaultValue="mid"
                  onValueChange={(val) =>
                    setValue("experienceLevel", val as JobRequirementFormData["experienceLevel"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="experienceLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid-Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="principal">Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="developersNeeded">Number of Developers</Label>
                <Select
                  defaultValue="1"
                  onValueChange={(val) =>
                    setValue("developersNeeded", Number(val), { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="developersNeeded">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="engagementType">Engagement Type</Label>
                <Select
                  defaultValue="full-time"
                  onValueChange={(val) =>
                    setValue("engagementType", val as JobRequirementFormData["engagementType"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="engagementType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-Time</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="project-based">Project-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezonePreference">Timezone Preference</Label>
                <Select
                  defaultValue="any"
                  onValueChange={(val) =>
                    setValue("timezonePreference", val as JobRequirementFormData["timezonePreference"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="timezonePreference">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Timezone</SelectItem>
                    <SelectItem value="americas">Americas</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia-pacific">Asia-Pacific</SelectItem>
                    <SelectItem value="overlap-us">US Overlap (4+ hrs)</SelectItem>
                    <SelectItem value="overlap-eu">EU Overlap (4+ hrs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Budget Min ($/hr, optional)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="e.g. 60"
                  className="font-mono"
                  {...register("budgetMin")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">Budget Max ($/hr, optional)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="e.g. 120"
                  className="font-mono"
                  {...register("budgetMax")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="Describe the role, project context, and any specific requirements..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-xs text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  defaultValue="medium"
                  onValueChange={(val) =>
                    setValue("priority", val as JobRequirementFormData["priority"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" asChild>
                <Link href="/companies/dashboard/requirements">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="gap-2 bg-pulse text-pulse-foreground hover:bg-pulse/90"
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Submit Requirement
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export { RequirementForm };
