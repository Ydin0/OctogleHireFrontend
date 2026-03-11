import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About OctogleHire",
  description:
    "OctogleHire connects companies with the top 3% of pre-vetted engineers from 150+ countries. Learn about our mission, team, and the platform behind 300+ successful placements.",
  alternates: { canonical: absoluteUrl("/about") },
};

const stats = [
  { value: "1,000+", label: "Engineers Vetted" },
  { value: "300+", label: "Companies Served" },
  { value: "150+", label: "Countries Covered" },
  { value: "3%", label: "Acceptance Rate" },
  { value: "48h", label: "Average Match Time" },
  { value: "94%", label: "6-Month Retention" },
];

const values = [
  {
    title: "Quality Over Quantity",
    description:
      "We reject 97% of applicants. Every engineer in our network has passed a 5-stage vetting process including technical assessments, live interviews, and background checks.",
  },
  {
    title: "Transparency First",
    description:
      "No hidden markups, no surprise fees. Rates are disclosed upfront to both companies and developers. What you see is what you pay.",
  },
  {
    title: "Global by Default",
    description:
      "We operate across 150+ countries because talent is everywhere. We handle compliance, payroll, and contracts so geography is never a barrier.",
  },
  {
    title: "Speed Without Compromise",
    description:
      "48-hour matching doesn't mean cutting corners. Our pre-vetted network means we can deliver fast because the work is already done.",
  },
];

export default function AboutPage() {
  const jsonLd = buildJsonLd({
    "@type": "AboutPage",
    name: `About ${SITE_NAME}`,
    description:
      "Learn about OctogleHire's mission to connect companies with the world's best engineering talent.",
    url: absoluteUrl("/about"),
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/Octogle Darkmode.svg"),
      foundingDate: "2024",
      description:
        "The global talent platform for pre-vetted developers. Build world-class engineering teams in days, not months.",
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        minValue: 10,
      },
      sameAs: [
        "https://twitter.com/octoglehire",
        "https://linkedin.com/company/octoglehire",
      ],
    },
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="container mx-auto px-6 py-16 lg:py-24">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            About Us
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight lg:text-5xl">
            We connect companies with the world&apos;s best engineers
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            OctogleHire is a global talent platform that has vetted 1,000+
            engineers across 150+ countries through a rigorous 5-stage process
            with a 3% acceptance rate. Over 300 companies use OctogleHire to
            build engineering teams in days, not months — at 40–60% below
            US/UK rates.
          </p>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-6 pb-24">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-muted/30 p-6 text-center"
              >
                <p className="font-mono text-2xl font-semibold text-pulse lg:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="container mx-auto px-6 pb-24">
          <div className="rounded-3xl border border-border bg-muted/30 p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[200px_1fr] lg:items-start">
              <div className="flex flex-col items-center lg:items-start">
                <Image
                  src="/Yaseen Founder.jpg"
                  alt="Yaseen Deen"
                  width={160}
                  height={160}
                  className="size-40 rounded-2xl object-cover ring-2 ring-border"
                />
                <p className="mt-4 text-sm font-semibold">Yaseen Deen</p>
                <p className="text-xs text-muted-foreground">
                  Co-Founder
                </p>
                <Link
                  href="https://www.linkedin.com/in/yaseen-deen-52249219b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  LinkedIn
                </Link>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Our Story
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  OctogleHire was founded on a simple observation: the best
                  engineering talent is everywhere, but access to it is broken.
                  Traditional agencies charge $20K–$40K placement fees and take
                  months. Freelance platforms offer quantity over quality. Neither
                  model serves companies or developers well.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We built OctogleHire to fix this. Our 5-stage vetting process
                  ensures only the top 3% of applicants join the network. Our
                  compliance infrastructure covers 150+ countries. And our
                  matching engine delivers 3–5 curated profiles within 48 hours —
                  not weeks.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, over 300 companies trust OctogleHire to build their
                  engineering teams. 94% of our placements extend beyond 6
                  months. We&apos;re proving that global hiring can be fast,
                  affordable, and high-quality — all at once.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="container mx-auto px-6 pb-24">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Our Values
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            How we operate
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="bg-background p-8 space-y-3">
                <h3 className="text-base font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 pb-24">
          <div className="rounded-3xl border border-border bg-muted/30 p-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to build your team?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join 300+ companies hiring pre-vetted engineers through
              OctogleHire.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full gap-2">
                <Link href="/companies/signup">
                  Start Hiring
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Link href="/apply">Apply as a Developer</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
    </>
  );
}
