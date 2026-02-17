import { z } from "zod";

export const companyInfoSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact person name is required"),
  businessEmail: z.string().email("Please enter a valid business email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  companyWebsite: z
    .union([z.string().url("Please enter a valid URL"), z.literal("")])
    .optional(),
});

export const requirementsSchema = z.object({
  projectDescription: z
    .string()
    .min(40, "Please add at least 40 characters")
    .max(2000, "Description must be 2000 characters or less"),
});

export const preferencesSchema = z.object({
  preferredEngagementType: z.enum(
    ["hourly", "part-time", "full-time", "project-based", "not-sure"],
    { message: "Please select an engagement type" },
  ),
  estimatedStartDate: z
    .string()
    .min(1, "Please choose an estimated start date")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Please choose a valid date"),
  heardAbout: z.enum(
    [
      "google",
      "linkedin",
      "referral",
      "social-media",
      "blog",
      "other",
    ],
    { message: "Please choose how you heard about OctogleHire" },
  ),
});

export const companyEnquirySchema = z.object({
  ...companyInfoSchema.shape,
  ...requirementsSchema.shape,
  ...preferencesSchema.shape,
});

export type CompanyInfo = z.infer<typeof companyInfoSchema>;
export type Requirements = z.infer<typeof requirementsSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export type CompanyEnquiry = z.infer<typeof companyEnquirySchema>;
