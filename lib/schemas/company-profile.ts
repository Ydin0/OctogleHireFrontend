import { z } from "zod";

export const companyProfileSchema = z.object({
  companyName: z.string().min(2, "Company name required"),
  contactName: z.string().min(2, "Contact name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  linkedinCompanyUrl: z
    .string()
    .refine((v) => !v || v.includes("linkedin.com/company/"), "Must be a LinkedIn company URL")
    .optional()
    .or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>;
