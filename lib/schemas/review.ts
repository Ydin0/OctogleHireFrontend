import { z } from "zod";

import { CURRENCY_SYMBOLS } from "@/lib/reviews-markets";

export const reviewSchema = z
  .object({
    linkedinUrl: z
      .string()
      .url("Enter a valid URL")
      .refine(
        (v) => /^https?:\/\/(www\.)?linkedin\.com\//i.test(v),
        "Must be a linkedin.com URL",
      ),
    name: z.string().min(2, "Enter your full name").max(80),
    role: z.string().min(2, "Enter your role / title").max(80),
    company: z.string().min(1, "Enter your company name").max(80),
    quote: z
      .string()
      .min(40, "Share at least a sentence or two about your experience")
      .max(600, "Keep it under 600 characters"),
    hiredRole: z.string().min(2, "e.g. Senior Frontend Engineer").max(80),
    hiredCount: z.coerce.number().int().min(1).max(50),
    localRate: z.coerce.number().int().min(100).max(50000),
    octogleRate: z.coerce.number().int().min(100).max(50000),
    market: z.string().min(2).max(60),
    flag: z
      .string()
      .length(2, "Flag must be a 2-letter ISO country code")
      .regex(/^[a-z]{2}$/i, "Use lowercase ISO alpha-2 code"),
    currency: z.enum(CURRENCY_SYMBOLS),
    avatar: z
      .instanceof(File, { message: "Upload your photo" })
      .refine((f) => f.size <= 5 * 1024 * 1024, "Photo must be under 5MB")
      .refine(
        (f) => ["image/png", "image/jpeg", "image/webp"].includes(f.type),
        "PNG, JPG or WebP only",
      ),
    logo: z
      .instanceof(File)
      .refine((f) => f.size <= 2 * 1024 * 1024, "Logo must be under 2MB")
      .refine(
        (f) =>
          ["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(
            f.type,
          ),
        "PNG, JPG, WebP or SVG only",
      )
      .optional(),
    consent: z.boolean().refine((v) => v === true, {
      message: "You must agree before submitting",
    }),
  })
  .refine((v) => v.octogleRate < v.localRate, {
    message: "OctogleHire rate should be lower than the local rate",
    path: ["octogleRate"],
  });

export type ReviewFormValues = z.infer<typeof reviewSchema>;
