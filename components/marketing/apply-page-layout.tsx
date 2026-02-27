import Link from "next/link";
import { ArrowRight, Check, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { DevFaqAccordion } from "@/components/marketing/dev-faq-accordion";
import { EarningsCalculator } from "@/app/developers/join/_components/earnings-calculator";
import { techToSlug, roleToSlug } from "@/lib/seo-data";
import {
  devBenefits,
  testimonials,
  ctaList,
  devFaqs,
} from "@/lib/data/apply-shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Benefit {
  title: string;
  description: string;
}

interface CrossLink {
  label: string;
  href: string;
}

interface ApplyPageLayoutProps {
  label: string;
  title: string;
  titleAccent?: string;
  description: string;
  benefits: Benefit[];
  techCrossLinks?: string[];
  roleCrossLinks?: string[];
  hireSlug?: string;
}

// ---------------------------------------------------------------------------
// Helper — render title with accent
// ---------------------------------------------------------------------------

function renderTitle(title: string, accent?: string) {
  if (!accent) return title;
  const idx = title.toLowerCase().indexOf(accent.toLowerCase());
  if (idx === -1) return title;
  const before = title.slice(0, idx);
  const match = title.slice(idx, idx + accent.length);
  const after = title.slice(idx + accent.length);
  return (
    <>
      {before}
      <span className="text-pulse">{match}</span>
      {after}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ApplyPageLayout({
  label,
  title,
  titleAccent,
  description,
  benefits,
  techCrossLinks,
  roleCrossLinks,
  hireSlug,
}: ApplyPageLayoutProps) {
  const allCrossLinks: CrossLink[] = [
    ...(hireSlug
      ? [{ label: "Companies hiring this role", href: `/hire/${hireSlug}` }]
      : []),
    ...(techCrossLinks ?? []).map((tech) => ({
      label: `${tech} Developer Jobs`,
      href: `/apply/${techToSlug(tech)}`,
    })),
    ...(roleCrossLinks ?? []).map((role) => ({
      label: `${role} Jobs`,
      href: `/apply/${roleToSlug(role)}`,
    })),
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* ── 1. Hero ────────────────────────────────────────── */}
        <section className="container mx-auto px-6">
          <div className="max-w-3xl py-16 lg:py-24 space-y-10">
            {/* Label */}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </span>

            {/* Headline */}
            <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
              {renderTitle(title, titleAccent)}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>

            {/* Benefits checklist */}
            <ul className="space-y-4">
              {benefits.map((b) => (
                <li key={b.title} className="flex gap-3.5 items-start">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                    <Check
                      className="size-3 text-foreground"
                      strokeWidth={2.5}
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{b.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {b.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 border-t pt-8">
              {[
                { value: "48h", label: "Avg. review time" },
                { value: "Top 3%", label: "Acceptance rate" },
                { value: "60%", label: "Above local rates" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-mono text-2xl font-semibold text-pulse lg:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full gap-2">
                <Link href="/apply">
                  Apply Now
                  <ArrowRight className="size-4 -rotate-45" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── 2. Benefits grid ───────────────────────────────── */}
        <section className="container mx-auto px-6 pb-24">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Benefits
          </span>
          <h2 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
            Focus on your craft. We handle the rest.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {devBenefits.map(({ icon: Icon, title: t, description: d }) => (
              <div key={t} className="bg-background p-8 space-y-4">
                <div className="flex size-10 items-center justify-center rounded-xl border border-border">
                  <Icon className="size-5 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold">{t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Testimonials ────────────────────────────────── */}
        <section className="container mx-auto px-6 pb-24">
          <div className="mb-16 flex flex-col gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Testimonials
            </span>
            <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
              You&apos;re in good company.
            </h2>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="bg-background p-8 flex flex-col justify-between gap-6"
              >
                <blockquote className="text-xl font-medium leading-snug lg:text-2xl">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 ring-2 ring-border">
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback className="text-xs font-semibold">
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Earnings calculator ─────────────────────────── */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="mb-10 flex flex-col gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Earnings
              </span>
              <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
                See what you could earn
              </h2>
            </div>
            <EarningsCalculator />
          </div>
        </section>

        {/* ── 5. CTA band ────────────────────────────────────── */}
        <section className="dark bg-background py-16 text-foreground">
          <div className="container mx-auto px-6">
            <div className="relative grid grid-cols-1 overflow-hidden rounded-[0.75rem] px-8 pt-10 pb-12 xl:grid-cols-2 xl:px-15.5 xl:pb-12">
              <div className="flex flex-col gap-5 md:gap-7">
                <h2 className="text-4xl tracking-tight md:text-5xl lg:text-6xl">
                  <span className="block font-semibold text-pulse">
                    Apply today.
                  </span>
                  <span className="font-normal">
                    One profile, multiple global opportunities.
                  </span>
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl">
                  Join the network and let the right roles come to you.
                </p>
                <ul className="grid max-w-[36.25rem] grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                  {ctaList.map((item) => (
                    <li key={item.text} className="flex items-center gap-3">
                      <item.icon className="size-5 stroke-white" />
                      <span className="font-mono text-xs tracking-[0.06em] text-white">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full md:w-fit hover:bg-pulse hover:text-pulse-foreground rounded-full gap-2"
                  >
                    <Link href="/apply">
                      Apply as a Developer
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full gap-2"
                  >
                    <Link href="/login">
                      Already in the network
                      <Trophy className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden xl:flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {[
                    { value: "1,000+", label: "Engineers vetted" },
                    { value: "Top 3%", label: "Acceptance rate" },
                    { value: "48h", label: "Match timeline" },
                    { value: "30+", label: "Countries" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border border-white/10 bg-white/5 p-6 text-center"
                    >
                      <p className="font-mono text-3xl font-semibold text-pulse">
                        {s.value}
                      </p>
                      <p className="mt-1 font-mono text-xs uppercase tracking-wider text-white/60">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. FAQ ─────────────────────────────────────────── */}
        <section className="py-24 container mx-auto px-6">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              FAQ
            </span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
              Frequently asked questions
            </h2>
          </div>
          <DevFaqAccordion faqs={devFaqs} />
        </section>

        {/* ── 7. Cross-links ─────────────────────────────────── */}
        {allCrossLinks.length > 0 && (
          <section className="container mx-auto px-6 pb-20">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Related
            </p>
            <h2 className="mt-3 text-lg font-semibold tracking-tight">
              Explore more
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {allCrossLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
