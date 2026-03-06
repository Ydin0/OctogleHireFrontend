import { z } from "zod";

export const agencyProfileSchema = z.object({
  name: z.string().min(2, "Agency name required"),
  contactName: z.string().min(2, "Contact name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  logo: z.string().url().optional().or(z.literal("")),
});

export type AgencyProfileFormValues = z.infer<typeof agencyProfileSchema>;
