import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us — OctogleHire",
  description:
    "Meet the founders behind OctogleHire. Learn how Yaseen Deen and Eduardo came together to build the global talent platform connecting companies with the top 3% of pre-vetted engineers.",
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
            Two founders. One mission.
            <br />
            <span className="text-pulse">Talent without borders.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            OctogleHire was born from a shared conviction that the best
            engineering talent exists everywhere — but access to it is broken.
            We&apos;re here to fix that.
          </p>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-6 pb-20">
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

        {/* Origin Story */}
        <section className="container mx-auto px-6 pb-24">
          <div className="rounded-3xl border border-border bg-muted/30 p-8 md:p-12 lg:p-16">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Our Story
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight lg:text-3xl">
              How it started
            </h2>

            <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
              <p>
                It started the way most good things do — with a problem neither
                of us could ignore.
              </p>
              <p>
                Yaseen had been building Octogle Technologies, a tech company
                focused on building products that push the boundaries of
                what&apos;s possible. Along the way, he faced the same problem
                every ambitious founder hits: finding engineers who were truly
                exceptional, not just available. The recruitment industry was
                slow, expensive, and built around volume rather than quality.
                Agencies charged eye-watering fees. Freelance platforms were a
                lottery. There had to be a better way.
              </p>
              <p>
                Eduardo was running Scale Your Offer, helping businesses
                optimise their sales infrastructure and scale their revenue. He
                understood the mechanics of growth — how to build systems that
                actually work, how to create offerings that companies would pay
                for without hesitation, and how to turn an idea into a
                repeatable engine. But he also saw the same talent bottleneck
                from the other side: companies wanted to grow, but they
                couldn&apos;t find the developers to build what they needed.
              </p>
              <p>
                When they met, it clicked immediately. Yaseen brought the
                technical vision — the obsession with vetting quality, the
                infrastructure thinking, the product mind. Eduardo brought the
                commercial engine — the growth strategy, the market
                positioning, the ability to turn a platform into a business.
                They weren&apos;t just complementary; they were the exact
                combination this problem needed.
              </p>
              <p>
                The conversation was simple: what if hiring world-class
                engineers was as fast as ordering a service, as reliable as
                working with your own team, and as affordable as hiring
                globally should be? What if companies could get curated,
                pre-vetted developer profiles in 48 hours instead of 6 weeks?
                What if developers from 150+ countries had a platform that
                valued their skills rather than their postcode?
              </p>
              <p>
                OctogleHire was the answer. Not another job board. Not another
                freelance marketplace. A talent platform with a 3% acceptance
                rate, a rigorous 5-stage vetting process, and a matching engine
                that actually understands what companies need. Built by
                someone who knows what great engineering looks like, and
                someone who knows how to build a business that lasts.
              </p>
              <p className="text-foreground font-medium">
                Today, over 300 companies trust OctogleHire to build their
                engineering teams. 94% of placements extend beyond six months.
                We didn&apos;t set out to disrupt hiring — we set out to make
                it work the way it should have from the start.
              </p>
            </div>
          </div>
        </section>

        {/* Founders */}
        <section className="container mx-auto px-6 pb-24">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            The Founders
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight lg:text-3xl">
            Meet the team behind OctogleHire
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Yaseen */}
            <div className="rounded-2xl border border-border bg-muted/30 p-8">
              <div className="flex items-start gap-5">
                <Image
                  src="/Yaseen Founder.jpg"
                  alt="Yaseen Deen"
                  width={120}
                  height={120}
                  className="size-28 rounded-2xl object-cover ring-2 ring-border"
                />
                <div className="pt-1">
                  <p className="text-lg font-semibold">Yaseen Deen</p>
                  <p className="text-sm text-muted-foreground">
                    Co-Founder &amp; CEO
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Founder of Octogle Technologies
                  </p>
                  <Link
                    href="https://www.linkedin.com/in/yaseen-deen-52249219b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    LinkedIn
                  </Link>
                </div>
              </div>
              <Separator className="my-5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yaseen built Octogle Technologies from the ground up — a tech
                company driven by the belief that great products come from
                great engineers. After spending years navigating the broken
                recruitment landscape firsthand, he decided to build the
                platform he wished existed. He leads OctogleHire&apos;s
                product, engineering, and vetting infrastructure with the same
                rigour he applies to every line of code: nothing ships unless
                it&apos;s exceptional.
              </p>
            </div>

            {/* Eduardo */}
            <div className="rounded-2xl border border-border bg-muted/30 p-8">
              <div className="flex items-start gap-5">
                <div className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-muted ring-2 ring-border">
                  <span className="font-mono text-3xl font-semibold text-muted-foreground">
                    E
                  </span>
                </div>
                <div className="pt-1">
                  <p className="text-lg font-semibold">Eduardo</p>
                  <p className="text-sm text-muted-foreground">
                    Co-Founder &amp; COO
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Founder of Scale Your Offer
                  </p>
                </div>
              </div>
              <Separator className="my-5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Eduardo built Scale Your Offer into a powerhouse for businesses
                looking to optimise their commercial operations and scale
                revenue. He brings the strategic growth engine that turns a
                great product into a sustainable business. At OctogleHire, he
                drives go-to-market strategy, commercial partnerships, and
                client acquisition — making sure the companies who need
                world-class talent can find it without the traditional
                headaches of recruitment.
              </p>
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
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Link href="/apply">Apply as a Developer</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Link href="/marketplace">Browse Developers</Link>
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
