import { z } from "zod";

export const jobRequirementSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    techStack: z.array(z.string()).min(1, "Select at least one technology"),
    experienceYearsMin: z
      .number()
      .int()
      .min(0, "Min years must be 0 or more")
      .max(50),
    experienceYearsMax: z
      .number()
      .int()
      .min(0, "Max years must be 0 or more")
      .max(50),
    developersNeeded: z.number().int().min(1).max(10),
    engagementType: z.enum([
      "full-time",
      "part-time",
      "contract",
      "project-based",
    ]),
    timezonePreference: z.enum([
      "any",
      "americas",
      "europe",
      "asia-pacific",
      "overlap-us",
      "overlap-eu",
    ]),
    budgetMin: z.string().optional(),
    budgetMax: z.string().optional(),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),
    startDate: z.string().min(1, "Start date is required"),
    priority: z.enum(["low", "medium", "high", "urgent"]),
  })
  .refine((data) => data.experienceYearsMax >= data.experienceYearsMin, {
    message: "Max years must be greater than or equal to min years",
    path: ["experienceYearsMax"],
  });

export type JobRequirementFormData = z.infer<typeof jobRequirementSchema>;
