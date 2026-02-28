import type { Metadata } from "next";
import { Suspense } from "react";

import { StatusContent } from "./_components/status-content";

export const metadata: Metadata = {
  title: "Application Status | OctogleHire",
  description: "Track the status of your OctogleHire developer application.",
};

export default function StatusPage() {
  return (
    <Suspense>
      <StatusContent />
    </Suspense>
  );
}
