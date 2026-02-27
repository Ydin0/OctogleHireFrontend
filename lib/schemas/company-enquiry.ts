import { z } from "zod";

export const companyLeadSchema = z.object({
  contactName: z.string().min(2, "Required"),
  companyName: z.string().min(2, "Required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Valid phone required"),
});

export type CompanyLead = z.infer<typeof companyLeadSchema>;
