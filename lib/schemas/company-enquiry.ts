import { z } from "zod";

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "yahoo.fr",
  "hotmail.com", "hotmail.co.uk", "outlook.com", "outlook.co.uk",
  "live.com", "live.co.uk", "msn.com", "aol.com", "icloud.com", "me.com",
  "mail.com", "zoho.com", "protonmail.com", "proton.me", "yandex.com",
  "gmx.com", "gmx.net", "tutanota.com", "fastmail.com",
]);

export const companyLeadSchema = z.object({
  contactName: z.string().min(2, "Required"),
  companyName: z.string().min(2, "Required"),
  // Any valid email is accepted — personal or work.
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Valid phone required"),
  website: z.string().optional(), // honeypot — must stay empty
});

export type CompanyLead = z.infer<typeof companyLeadSchema>;

/**
 * Full payload posted by the hire-page "Start your brief" wizard.
 * Extends the basic lead with all the structured brief fields. Every brief
 * field is optional so the same POST /api/public/company-enquiries endpoint
 * accepts both the plain lead form and the full wizard.
 */
export interface CompanyBriefPayload {
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  website?: string; // honeypot
  dialCode?: string;
  role?: string;
  techStack?: string[];
  experienceLevel?: string;
  teamSize?: number;
  engagementType?: string;
  workMode?: string;
  timeline?: string;
  sourcePage?: string;
}

export const FREE_EMAIL_DOMAIN_SET = FREE_EMAIL_DOMAINS;

export function isWorkEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? !FREE_EMAIL_DOMAINS.has(domain) : false;
}
