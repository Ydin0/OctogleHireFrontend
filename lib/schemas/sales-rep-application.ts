import { z } from "zod";
import { SALES_ROLE_TITLE_OPTIONS } from "@/lib/data/sales-rep-options";

export const salesRepPersonalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    }, "Please enter a valid phone number"),
  locationCity: z.string().min(1, "City is required"),
  locationState: z.string().min(1, "Country is required"),
});

export const salesRepProfessionalInfoSchema = z.object({
  salesRoleTitle: z
    .string()
    .min(2, "Sales role is required")
    .refine(
      (val) =>
        (SALES_ROLE_TITLE_OPTIONS as readonly string[]).includes(val),
      "Please select a role from the list"
    ),
  yearsOfExperience: z.coerce
    .number()
    .min(0, "Must be 0 or more")
    .max(50, "Must be 50 or less"),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(2000, "Bio must be 2000 characters or less"),
  salaryCurrency: z.string().min(1, "Currency is required"),
  salaryAmount: z.coerce.number().min(0, "Must be 0 or more"),
});

export const salesRepWorkExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Title is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
  current: z.boolean().default(false),
  companyLogoUrl: z.string().optional(),
});

export const salesRepWorkExperienceListSchema = z.object({
  workExperience: z.array(salesRepWorkExperienceSchema).default([]),
});

export const salesToolsSchema = z.object({
  salesTools: z
    .array(z.string().min(1))
    .min(1, "Select at least 1 tool you've used")
    .max(12, "Select up to 12 tools"),
  salesMethodologies: z
    .array(z.string().min(1))
    .max(6, "Select up to 6 methodologies")
    .default([]),
  industriesSold: z
    .array(z.string().min(1))
    .max(8, "Select up to 8 industries")
    .default([]),
  certifications: z.string().max(1000).optional(),
});

const salesRepLinksObject = z.object({
  linkedinUrl: z
    .union([
      z
        .string()
        .url("Please enter a valid URL")
        .refine(
          (url) => url.includes("linkedin.com"),
          "Must be a LinkedIn URL"
        ),
      z.literal(""),
    ])
    .optional(),
  githubUrl: z
    .union([z.string().url("Please enter a valid URL"), z.literal("")])
    .optional(),
  portfolioUrl: z
    .union([z.string().url("Please enter a valid URL"), z.literal("")])
    .optional(),
  resumeFile: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Resume must be 5MB or less"
    )
    .refine(
      (file) => file.type === "application/pdf",
      "Resume must be a PDF file"
    )
    .optional(),
  profilePhoto: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      "Photo must be 2MB or less"
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Photo must be JPEG, PNG, or WebP"
    ),
});

export const salesRepLinksSchema = salesRepLinksObject.refine(
  (data) => (data.linkedinUrl && data.linkedinUrl.length > 0) || data.resumeFile,
  {
    message: "Please provide either a LinkedIn URL or upload your CV",
    path: ["resumeFile"],
  }
);

export const salesRepIntroVideoSchema = z.object({
  introVideo: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 50 * 1024 * 1024,
      "Video must be 50MB or less"
    )
    .refine(
      (file) =>
        ["video/webm", "video/mp4", "video/quicktime"].includes(file.type),
      "Video must be WebM, MP4, or MOV"
    ),
});

export const salesRepPreferencesSchema = z.object({
  engagementType: z
    .array(z.enum(["hourly", "part-time", "full-time"]))
    .min(1, "Please select at least one engagement type"),
  availability: z.enum(["immediate", "2-weeks", "1-month"], {
    message: "Please select your availability",
  }),
  englishProficiency: z.enum(
    ["basic", "conversational", "fluent", "native"],
    { message: "Please select your English proficiency" }
  ),
});

export const salesRepApplicationSchema = z.object({
  ...salesRepPersonalInfoSchema.shape,
  ...salesRepProfessionalInfoSchema.shape,
  ...salesRepWorkExperienceListSchema.shape,
  ...salesToolsSchema.shape,
  ...salesRepLinksObject.shape,
  ...salesRepIntroVideoSchema.shape,
  ...salesRepPreferencesSchema.shape,
});

export type SalesRepPersonalInfo = z.infer<typeof salesRepPersonalInfoSchema>;
export type SalesRepProfessionalInfo = z.infer<
  typeof salesRepProfessionalInfoSchema
>;
export type SalesRepWorkExperience = z.infer<
  typeof salesRepWorkExperienceSchema
>;
export type SalesRepWorkExperienceList = z.infer<
  typeof salesRepWorkExperienceListSchema
>;
export type SalesToolsForm = z.infer<typeof salesToolsSchema>;
export type SalesRepLinks = z.infer<typeof salesRepLinksSchema>;
export type SalesRepIntroVideo = z.infer<typeof salesRepIntroVideoSchema>;
export type SalesRepPreferences = z.infer<typeof salesRepPreferencesSchema>;
export type SalesRepApplication = z.infer<typeof salesRepApplicationSchema>;
