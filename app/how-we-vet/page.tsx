import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { absoluteUrl, SITE_URL, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { HowWeVetContent } from "./_components/how-we-vet-content";

export const metadata: Metadata = {
  title: "How We Vet — Our 5-Stage Process",
  description:
    "From over 25,000 applicants, only 1,000 engineers have been accepted. Learn how OctogleHire's 5-stage vetting process ensures you hire verified, exceptional talent.",
  alternates: { canonical: absoluteUrl("/how-we-vet") },
  openGraph: {
    title: "How We Vet — OctogleHire's 5-Stage Process",
    description:
      "From over 25,000 applicants, only 1,000 engineers have been accepted. Learn how our rigorous vetting works.",
    url: absoluteUrl("/how-we-vet"),
  },
};

export default function HowWeVetPage() {
  return (
    <>
      <Navbar />
      <main>
        <HowWeVetContent />
      </main>
      <Footer />

      <JsonLd
        data={[
          webPageSchema({
            path: "/how-we-vet",
            name: "How We Vet — OctogleHire",
            description:
              "From over 25,000 applicants, only 1,000 engineers have been accepted. Learn how OctogleHire's 5-stage vetting process ensures you hire verified, exceptional talent.",
          }),
          breadcrumbSchema("/how-we-vet", [
            { name: "Home", url: SITE_URL },
            { name: "How We Vet" },
          ]),
          {
            "@type": "HowTo",
            "@id": `${SITE_URL}/how-we-vet/#howto`,
            name: "OctogleHire's 5-Stage Vetting Process",
            description:
              "Our rigorous 5-stage vetting process to accept only the top 1 in 25 applicants into the OctogleHire network.",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Application & Resume Screening",
                text: "Background, work history, and code samples are screened against role requirements. Self-reported skills count for nothing until they're proven.",
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Technical Assessment",
                text: "A timed, proctored assessment covering data structures, algorithms, and language-specific depth. Auto-graded, plagiarism-checked, no take-home loopholes.",
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Live Coding & System Design",
                text: "A senior engineer runs a 60-minute live session — real problems, real trade-offs. We watch how they reason, debug, and design under pressure.",
              },
              {
                "@type": "HowToStep",
                position: 4,
                name: "AI-Native Playbook Evaluation",
                text: "Hands-on evaluation of agentic workflows — Cursor, Claude Code, RAG, and prompt engineering. We verify they ship faster with AI, not slower.",
              },
              {
                "@type": "HowToStep",
                position: 5,
                name: "Communication & Culture",
                text: "A final interview on written and spoken English, async habits, and ownership. Great code isn't enough — they have to integrate with your team.",
              },
            ],
          },
          {
            "@type": "Service",
            "@id": `${SITE_URL}/how-we-vet/#service`,
            name: "Pre-Vetted Developer Matching",
            provider: { "@id": `${SITE_URL}/#organization` },
            description:
              "OctogleHire matches companies with pre-vetted, world-class engineers from 30+ countries through a rigorous 5-stage vetting process.",
            serviceType: "Developer Staffing",
            areaServed: "Worldwide",
          },
        ]}
      />
    </>
  );
}
