import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";
import {
  FadeUp,
  Stagger,
  StaggerItem,
  ScaleIn,
  SlideIn,
  CountUp,
  FillBar,
} from "@/components/marketing/animated";

export const metadata: Metadata = {
  title: "About OctogleHire",
  description:
    "OctogleHire connects companies with rigorously vetted engineers from 30+ countries. Learn about our mission, team, and the platform behind 300+ successful placements.",
  alternates: { canonical: absoluteUrl("/about") },
};

const stats = [
  { value: "1,000+", label: "Engineers Vetted" },
  { value: "300+", label: "Companies Served" },
  { value: "30+", label: "Countries Covered" },
  { value: "1 in 25", label: "Acceptance Rate" },
  { value: "48h", label: "Average Match Time" },
  { value: "94%", label: "6-Month Retention" },
];

const team = [
  {
    name: "Yaseen Deen",
    role: "CEO",
    image: "/Yaseen Founder.jpg",
    linkedin: "https://www.linkedin.com/in/yaseen-deen-52249219b/",
    bio: "Leads company strategy, product, and growth. Built OctogleHire to fix how companies access global engineering talent.",
  },
  {
    name: "Stergios Pappos",
    role: "Head of Technology",
    image: "/Stergios-Technology.jpg",
    linkedin: null,
    bio: "Oversees platform architecture, engineering, and infrastructure. Stergios ensures OctogleHire's technology scales reliably as our network and client base grow.",
  },
  {
    name: "Dimitris Pappos",
    role: "Head of Marketing",
    image: "/Dimitris-Marketing.jpg",
    linkedin: null,
    bio: "Drives brand strategy, demand generation, and market positioning. Dimitris builds the channels that connect companies with OctogleHire's vetted talent network.",
  },
  {
    name: "Anil Wadghule",
    role: "Tech Lead",
    image: "/Anil-TechLead.jpg",
    linkedin: null,
    bio: "18 years of engineering experience across full-stack, architecture, and Elixir. A recognised speaker at Elixir conferences, Anil leads our technical vetting and assessment design — ensuring only truly exceptional engineers make it through.",
  },
  {
    name: "Milo",
    role: "Client Success Manager",
    image: "/MiloSales.jpg",
    linkedin: null,
    bio: "Manages client relationships end-to-end — from onboarding to ongoing success — ensuring every company gets the right talent and a seamless experience.",
  },
  {
    name: "Ricardo Machado",
    role: "Recruitment Partner",
    image: "/Ricardo-Recruitment.jpg",
    linkedin: null,
    bio: "Leads our global talent sourcing and candidate pipeline. Ricardo identifies, screens, and shortlists engineering talent across 30+ countries to keep our network stocked with top-tier professionals.",
  },
];

const values = [
  {
    title: "Quality Over Quantity",
    description:
      "We reject 97% of applicants. Every engineer in our network has passed a 5-stage vetting process including technical assessments, live interviews, and background checks.",
    stat: "4%",
    statLabel: "acceptance rate",
  },
  {
    title: "Transparency First",
    description:
      "No hidden markups, no surprise fees. Rates are disclosed upfront to both companies and developers. What you see is what you pay.",
    stat: "$0",
    statLabel: "hidden fees",
  },
  {
    title: "Global by Default",
    description:
      "We operate across 30+ countries because talent is everywhere. We handle compliance, payroll, and contracts so geography is never a barrier.",
    stat: "30+",
    statLabel: "countries",
  },
  {
    title: "Speed Without Compromise",
    description:
      "48-hour matching doesn't mean cutting corners. Our pre-vetted network means we can deliver fast because the work is already done.",
    stat: "48h",
    statLabel: "to first match",
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
        <section className="container mx-auto px-6 py-20 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <FadeUp>
              <span className="inline-block rounded-full border border-border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                About Us
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight lg:text-6xl">
                We connect companies with the world&apos;s{" "}
                <span className="text-pulse">best engineers</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                OctogleHire is a global talent platform that has vetted 1,000+
                engineers across 30+ countries through a rigorous 5-stage process
                with only 1 in 25 applicants accepted. Over 300 companies use
                OctogleHire to build engineering teams in days, not months.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="mt-8 flex justify-center gap-3">
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
                  <Link href="/how-we-vet">How We Vet</Link>
                </Button>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-6 pb-24">
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="group rounded-2xl border border-border bg-muted/30 p-6 text-center transition-colors hover:border-pulse/40 hover:bg-pulse/5">
                  <CountUp
                    value={stat.value}
                    className="block font-mono text-2xl font-semibold text-pulse lg:text-3xl"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Our Story */}
        <section className="container mx-auto px-6 pb-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <SlideIn from="left">
              <div className="space-y-6">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Our Story
                </span>
                <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                  Hiring is broken.{" "}
                  <span className="text-muted-foreground">We&apos;re fixing it.</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    OctogleHire was founded on a simple observation: the best
                    engineering talent is everywhere, but access to it is broken.
                    Traditional agencies charge $20K&ndash;$40K placement fees and take
                    months. Freelance platforms offer quantity over quality.
                  </p>
                  <p>
                    We built OctogleHire to fix this. Our 5-stage vetting process
                    ensures only 1 in 25 applicants join the network. Our
                    compliance infrastructure covers 30+ countries. And our
                    matching engine delivers 3&ndash;5 curated profiles within 48
                    hours &mdash; not weeks.
                  </p>
                  <p>
                    Today, over 300 companies trust OctogleHire to build their
                    engineering teams. 94% of our placements extend beyond 6
                    months. We&apos;re proving that global hiring can be fast,
                    affordable, and high-quality &mdash; all at once.
                  </p>
                </div>
              </div>
            </SlideIn>
            <SlideIn from="right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { big: "40–60%", sub: "cost savings vs US/UK rates" },
                  { big: "5", sub: "vetting stages" },
                  { big: "48h", sub: "average match time" },
                  { big: "94%", sub: "6-month retention" },
                ].map((item) => (
                  <div
                    key={item.big}
                    className="group flex flex-col justify-between rounded-2xl border border-border bg-muted/30 p-6 transition-colors hover:border-pulse/40 hover:bg-pulse/5"
                  >
                    <p className="font-mono text-3xl font-semibold lg:text-4xl">
                      {item.big}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.sub}
                    </p>
                  </div>
                ))}
              </div>
            </SlideIn>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="container mx-auto px-6 pb-24">
          <FadeUp>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Our Team
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
              The people behind OctogleHire
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              A lean, senior team across engineering, vetting, recruitment, and
              client success — distributed globally.
            </p>
          </FadeUp>
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {team.map((member) => (
              <StaggerItem key={`${member.name}-${member.role}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-muted/30 p-6 transition-all hover:border-pulse/40 hover:bg-pulse/5 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="size-16 shrink-0 rounded-full object-cover ring-2 ring-border transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted ring-2 ring-border">
                        <span className="text-lg font-semibold text-muted-foreground">
                          {member.role
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{member.name}</p>
                      <p className="text-xs font-medium text-pulse">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                  {member.linkedin && (
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                    >
                      LinkedIn
                      <ArrowRight className="size-3" />
                    </Link>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Values */}
        <section className="container mx-auto px-6 pb-24">
          <FadeUp>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Our Values
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
              How we operate
            </h2>
          </FadeUp>
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2" stagger={0.1}>
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="group flex h-full flex-col justify-between rounded-2xl border border-border p-8 transition-colors hover:border-pulse/40 hover:bg-pulse/5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold">{value.title}</h3>
                      <span className="font-mono text-lg font-semibold text-pulse">
                        {value.stat}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 pb-24">
          <ScaleIn>
            <div className="rounded-3xl border border-border bg-muted/30 p-10 text-center md:p-16">
              <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                Ready to build your team?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                Join 300+ companies hiring pre-vetted engineers through
                OctogleHire.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
          </ScaleIn>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
    </>
  );
}
