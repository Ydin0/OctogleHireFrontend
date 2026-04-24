import { Suspense } from "react";

import { Presentation } from "./_components/presentation";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-background" />}>
      <Presentation />
    </Suspense>
  );
}
