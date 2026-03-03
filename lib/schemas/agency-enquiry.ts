import { z } from "zod";

export const agencyLeadSchema = z.object({
  contactName: z.string().min(2, "Required"),
  agencyName: z.string().min(2, "Required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Valid phone required"),
  website: z.string().url("Valid URL required").optional().or(z.literal("")),
  teamSize: z.string().min(1, "Required"),
});

export type AgencyLead = z.infer<typeof agencyLeadSchema>;
