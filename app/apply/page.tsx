import type { Metadata } from "next";

import { ApplyForm } from "./_components/apply-form";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Apply as a Professional",
  description:
    "Join our network of pre-vetted professionals. Apply to OctogleHire and get matched with top companies worldwide.",
  keywords: [
    "apply as professional",
    "remote developer jobs",
    "remote design jobs",
    "remote marketing jobs",
    "remote HR jobs",
    "freelance application",
    "join talent network",
  ],
  alternates: { canonical: absoluteUrl("/apply") },
};

export default function ApplyPage() {
  return <ApplyForm />;
}
