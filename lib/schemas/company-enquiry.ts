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
  email: z
    .string()
    .email("Valid email required")
    .refine(
      (val) => {
        const domain = val.split("@")[1]?.toLowerCase();
        return domain ? !FREE_EMAIL_DOMAINS.has(domain) : false;
      },
      { message: "Please use your work email" }
    ),
  phone: z.string().min(7, "Valid phone required"),
  website: z.string().optional(), // honeypot — must stay empty
});

export type CompanyLead = z.infer<typeof companyLeadSchema>;
