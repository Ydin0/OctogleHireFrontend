import type { Metadata } from "next";

import { ApplyForm } from "./_components/apply-form";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Apply as a Developer",
  description:
    "Join our network of pre-vetted engineers. Apply to OctogleHire and get matched with top companies worldwide.",
  keywords: [
    "apply as developer",
    "remote developer jobs",
    "freelance engineer application",
    "join developer network",
    "remote software jobs",
  ],
  alternates: { canonical: absoluteUrl("/apply") },
};

export default function ApplyPage() {
  return <ApplyForm />;
}
