import { z } from "zod";

export const personalInfoSchema = z.object({
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

export const professionalInfoSchema = z.object({
  professionalTitle: z.string().min(2, "Professional title is required"),
  yearsOfExperience: z.coerce
    .number()
    .min(0, "Must be 0 or more")
    .max(50, "Must be 50 or less"),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(500, "Bio must be 500 characters or less"),
});

export const workExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Title is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
  current: z.boolean().default(false),
});

export const workExperienceListSchema = z.object({
  workExperience: z.array(workExperienceSchema).default([]),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().optional(),
  grade: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
});

export const educationListSchema = z.object({
  education: z.array(educationSchema).default([]),
});

export const techStackSchema = z.object({
  primaryStack: z
    .array(z.string().min(1))
    .min(1, "Select at least 1 technology")
    .max(8, "Select up to 8 technologies"),
  secondarySkills: z.string().optional(),
  certifications: z.string().max(1000).optional(),
});

export const linksSchema = z.object({
  linkedinUrl: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => url.includes("linkedin.com"),
      "Must be a LinkedIn URL",
    ),
  githubUrl: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => url.includes("github.com"),
      "Must be a GitHub URL",
    ),
  portfolioUrl: z
    .union([z.string().url("Please enter a valid URL"), z.literal("")])
    .optional(),
  resumeFile: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Resume must be 5MB or less")
    .refine(
      (file) => file.type === "application/pdf",
      "Resume must be a PDF file",
    ),
  profilePhoto: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      "Photo must be 2MB or less",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Photo must be JPEG, PNG, or WebP",
    ),
});

export const preferencesSchema = z.object({
  engagementType: z
    .array(z.enum(["hourly", "part-time", "full-time"]))
    .min(1, "Please select at least one engagement type"),
  availability: z.enum(["immediate", "2-weeks", "1-month"], {
    message: "Please select your availability",
  }),
  englishProficiency: z.enum(
    ["basic", "conversational", "fluent", "native"],
    { message: "Please select your English proficiency" },
  ),
});

export const applicationSchema = z.object({
  ...personalInfoSchema.shape,
  ...professionalInfoSchema.shape,
  ...workExperienceListSchema.shape,
  ...educationListSchema.shape,
  ...techStackSchema.shape,
  ...linksSchema.shape,
  ...preferencesSchema.shape,
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ProfessionalInfo = z.infer<typeof professionalInfoSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type WorkExperienceList = z.infer<typeof workExperienceListSchema>;
export type Education = z.infer<typeof educationSchema>;
export type EducationList = z.infer<typeof educationListSchema>;
export type TechStack = z.infer<typeof techStackSchema>;
export type Links = z.infer<typeof linksSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export type Application = z.infer<typeof applicationSchema>;
