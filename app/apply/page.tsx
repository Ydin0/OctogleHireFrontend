import type { Metadata } from "next";

import { ApplyForm } from "./_components/apply-form";

export const metadata: Metadata = {
  title: "Apply as a Developer | OctogleHire",
  description:
    "Join our network of pre-vetted engineers. Apply to OctogleHire and get matched with top companies worldwide.",
};

export default function ApplyPage() {
  return <ApplyForm />;
}
