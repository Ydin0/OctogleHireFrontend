import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discovery Deck — OctogleHire",
  description:
    "A guided walkthrough of how OctogleHire delivers AI Native engineers at 40–60% lower cost.",
  robots: { index: false, follow: false },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-background">{children}</div>;
}
