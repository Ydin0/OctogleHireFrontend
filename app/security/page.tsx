import type { Metadata } from "next";
import { Shield, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { absoluteUrl, SITE_NAME, webPageSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import {
  FadeUp,
  Stagger,
  StaggerItem,
  ScaleIn,
} from "@/components/marketing/animated";

export const metadata: Metadata = {
  title: "Security — ISO 27001 Certified",
  description: `${SITE_NAME} is ISO 27001:2022 certified. Learn about our information security practices, certification details, and how we protect your data.`,
  alternates: { canonical: absoluteUrl("/security") },
};

const practices = [
  {
    title: "Data Encryption",
    description:
      "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Database backups are encrypted and stored in geographically redundant locations.",
  },
  {
    title: "Access Control",
    description:
      "Role-based access control (RBAC) with least-privilege principles. All internal access requires multi-factor authentication and is logged for audit.",
  },
  {
    title: "Vendor Security",
    description:
      "All third-party vendors and subprocessors are assessed against our security requirements before onboarding. We maintain an up-to-date vendor risk register.",
  },
  {
    title: "Incident Response",
    description:
      "Documented incident response procedures with defined escalation paths. Security incidents are investigated, contained, and communicated within established SLAs.",
  },
  {
    title: "Employee Security",
    description:
      "All team members undergo security awareness training. Access is revoked immediately upon role change or departure. Background checks are conducted for all staff.",
  },
  {
    title: "Continuous Monitoring",
    description:
      "Infrastructure and application monitoring with automated alerting. Regular vulnerability scanning and penetration testing to identify and remediate risks.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="container mx-auto px-6 py-20 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <FadeUp>
              <span className="inline-block rounded-full border border-border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Security
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight lg:text-6xl">
                ISO 27001:2022{" "}
                <span className="text-pulse">Certified</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                OctogleHire maintains an Information Security Management System
                (ISMS) independently audited and certified to the ISO/IEC
                27001:2022 standard.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Certification details */}
        <section className="container mx-auto px-6 pb-24">
          <FadeUp>
            <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-muted/30 p-8 md:p-12">
              <div className="flex items-start gap-5">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-background">
                  <Shield className="size-6 text-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    ISO/IEC 27001:2022 Certification
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Information Security Management System
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Audit Body
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    Kingsmen Certification Services (KCS)
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Issue Date
                  </p>
                  <p className="mt-1 text-sm font-medium">23 March 2026</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Standard
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    ISO/IEC 27001:2022
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-background p-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Scope
                </p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  The ISMS covers the design, development, and operation of the
                  OctogleHire platform, including developer vetting processes,
                  client data management, matching and engagement workflows, and
                  supporting infrastructure.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <a
                  href="https://www.iafcertsearch.org/certified-entity/YgnCzSQq4p76plJ5hUNVNd5C"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <CheckCircle className="size-4 text-pulse" />
                  IAF CertSearch Verified
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* Security practices */}
        <section className="container mx-auto px-6 pb-24">
          <FadeUp>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Our Practices
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
              How we protect your data
            </h2>
          </FadeUp>
          <Stagger
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.08}
          >
            {practices.map((practice) => (
              <StaggerItem key={practice.title}>
                <div className="group flex h-full flex-col rounded-2xl border border-border p-6 transition-colors hover:border-pulse/40 hover:bg-pulse/5">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="size-4 text-pulse" />
                    <h3 className="text-sm font-semibold">{practice.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {practice.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 pb-24">
          <ScaleIn>
            <div className="rounded-3xl border border-border bg-muted/30 p-10 text-center md:p-16">
              <h2 className="text-2xl font-semibold tracking-tight">
                Questions about our security practices?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Contact us for more details about our ISMS, data processing
                agreements, or to request our full ISO 27001 certificate. Our
                certification can be independently verified via IAF CertSearch.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="rounded-full gap-2">
                  <a href="mailto:hello@octoglehire.com">
                    Contact Security Team
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  <Link href="/privacy">Privacy Policy</Link>
                </Button>
              </div>
            </div>
          </ScaleIn>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={[
          webPageSchema({
            path: "/security",
            name: "Security — ISO 27001 Certified — OctogleHire",
            description:
              "OctogleHire is ISO 27001:2022 certified. Learn about our information security practices, certification details, and how we protect your data.",
          }),
        ]}
      />
    </>
  );
}
