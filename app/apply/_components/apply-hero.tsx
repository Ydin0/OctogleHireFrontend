"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  Code,
  Globe,
  HandCoins,
  Layers,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { Rating } from "@/components/shadcnblocks/rating";
import { Navbar } from "@/components/marketing/navbar";

import { Footer } from "@/components/marketing/footer";
import { EarningsCalculator } from "@/app/developers/join/_components/earnings-calculator";

interface ApplyHeroProps {
  onStart: () => void;
}

const circle1Images = [
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
];

const circle2Images = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
];

const circle3Images = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
];

const trustStats = [
  { value: "48h", label: "application review target" },
  { value: "Top 3%", label: "acceptance standard" },
  { value: "150+", label: "countries supported" },
  { value: "24/7", label: "global operations support" },
];

const valueProps = [
  {
    icon: BriefcaseBusiness,
    title: "Serious product teams",
    copy: "You interview with hiring managers and founders, not faceless job boards.",
  },
  {
    icon: HandCoins,
    title: "Transparent compensation",
    copy: "Comp bands and engagement model are shared early in the process.",
  },
  {
    icon: ShieldCheck,
    title: "Vetted companies",
    copy: "We verify roles before matching so your interview pipeline is worth your time.",
  },
  {
    icon: Globe,
    title: "Remote-first opportunities",
    copy: "Work from where you are while collaborating with global engineering orgs.",
  },
];

const roleTracks = [
  {
    icon: Layers,
    label: "Full-Stack",
    title: "Own features end-to-end",
    summary:
      "Best fit for engineers who can move from UI to APIs and ship fast with product teams.",
    focus: ["React / Next.js delivery", "API + DB ownership", "System thinking"],
  },
  {
    icon: Code,
    label: "Backend",
    title: "Build scalable core systems",
    summary:
      "For engineers who enjoy architecture, reliability, and high-throughput service design.",
    focus: ["Distributed systems", "Cloud + observability", "Performance tuning"],
  },
  {
    icon: Brain,
    label: "AI / Data",
    title: "Ship applied AI products",
    summary:
      "Work on LLM pipelines, data infrastructure, and production machine learning systems.",
    focus: ["LLM integrations", "Data modeling", "Evaluation frameworks"],
  },
  {
    icon: Smartphone,
    label: "Mobile",
    title: "Build product experiences people keep",
    summary:
      "Own modern mobile app development with fast release loops and meaningful user impact.",
    focus: [
      "React Native / Swift / Kotlin",
      "Performance + UX polish",
      "App store lifecycle",
    ],
  },
];

const testimonials = [
  {
    name: "Aisha M.",
    title: "Senior Backend Engineer",
    quote:
      "I stopped mass-applying and got two strong interview loops in my first week after approval.",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Mateo R.",
    title: "Full-Stack Developer",
    quote:
      "The role briefs were clear, compensation was transparent, and the process respected my time.",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Nina K.",
    title: "ML Engineer",
    quote:
      "I joined for contract work and ended up in a long-term high-impact AI product team.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1542204625-de293a2f3d29?w=400&h=400&fit=crop&crop=face",
  },
];

const ApplyHero = ({ onStart }: ApplyHeroProps) => {
  return (
    <>
      <Navbar />

      {/* Orbiting circles hero */}
      <section className="pt-8 pb-16">
        <div className="container mx-auto px-6">
          <div className="relative">
            <div className="flex w-full items-center justify-center">
              {/* Center content overlay */}
              <div className="absolute z-99 flex h-full w-full flex-col items-center justify-center gap-4">
                <div className="pointer-events-none absolute inset-y-0 top-1/2 left-1/2 h-1/3 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-background blur-2xl"></div>

                <Button
                  variant="secondary"
                  className="group relative z-10 flex w-fit items-center justify-center gap-3 rounded-full bg-muted/70 px-5 py-1"
                >
                  <span className="size-2.5 rounded-full bg-pulse" />
                  <span className="text-xs">
                    Join 10,000+ Engineers Worldwide
                  </span>
                </Button>

                <h1 className="relative z-10 max-w-3xl text-center text-5xl font-medium tracking-tight text-foreground md:text-7xl">
                  Earn More. Work <br />
                  <span className="text-pulse">On Your Terms.</span>
                </h1>

                <p className="relative z-10 mt-3 max-w-xl text-center text-muted-foreground/80">
                  Get paid up to 50% more than local rates. Access instant
                  contracts with top global companies and long-term security
                  &mdash; no middlemen, no uncertainty.
                </p>

                <div className="relative z-10 mt-4 flex gap-4">
                  <Button
                    variant="secondary"
                    className="group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
                    asChild
                  >
                    <a href="#why-join">
                      <span>Why Join</span>
                      <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
                    </a>
                  </Button>
                  <Button
                    variant="default"
                    className="group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
                    onClick={onStart}
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
                  </Button>
                </div>
              </div>

              {/* Orbiting circles */}
              <div className="pointer-events-none relative z-0 flex h-[840px] w-full flex-col items-center justify-center overflow-x-clip">
                <OrbitingCircles iconSize={44} radius={180} speed={0.5}>
                  {circle1Images.map((src, index) => (
                    <div
                      key={index}
                      className="size-11 overflow-hidden rounded-full"
                    >
                      <img
                        src={src}
                        className="size-full object-cover"
                        alt=""
                      />
                    </div>
                  ))}
                </OrbitingCircles>
                <OrbitingCircles
                  iconSize={44}
                  radius={280}
                  reverse
                  speed={0.4}
                >
                  {circle2Images.map((src, index) => (
                    <div
                      key={index}
                      className="size-11 overflow-hidden rounded-full"
                    >
                      <img
                        src={src}
                        className="size-full object-cover"
                        alt=""
                      />
                    </div>
                  ))}
                </OrbitingCircles>
                <OrbitingCircles iconSize={44} radius={380} speed={0.3}>
                  {circle3Images.map((src, index) => (
                    <div
                      key={index}
                      className="size-11 overflow-hidden rounded-full"
                    >
                      <img
                        src={src}
                        className="size-full object-cover"
                        alt=""
                      />
                    </div>
                  ))}
                </OrbitingCircles>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustStats.map((item) => (
              <Card key={item.label} className="border-border/70 bg-card/85">
                <CardContent className="pt-6">
                  <p className="text-3xl font-semibold text-pulse">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role tracks */}
      <section id="why-join" className="py-14 lg:py-18">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-mono uppercase tracking-[0.08em] text-pulse">
              Role Tracks
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Pick the path that fits your strengths.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {roleTracks.map((item) => (
              <Card
                key={item.label}
                className="group border-border/70 transition-colors hover:border-pulse/40"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <item.icon className="size-5 text-pulse" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {item.summary}
                  </p>
                  <ul className="space-y-1.5">
                    {item.focus.map((focus) => (
                      <li
                        key={focus}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Sparkles className="size-3.5 text-pulse" />
                        <span>{focus}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 px-0 text-pulse hover:text-pulse"
                    onClick={onStart}
                  >
                    Apply for this track
                    <ArrowRight className="size-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings estimator */}
      <section className="py-14 lg:py-18">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-mono uppercase tracking-[0.08em] text-pulse">
              Earnings Estimator
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Estimate compensation by role, location, and experience.
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-5xl">
            <EarningsCalculator />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 lg:py-18">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-mono uppercase tracking-[0.08em] text-pulse">
              Developer Outcomes
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Real feedback from active developers.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="border-border/70 bg-card/90">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border border-border/70">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Rating rate={item.rating} showScore />
                  <p className="mt-3 text-sm text-muted-foreground">
                    {item.quote}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-14 lg:py-18">
        <div className="container mx-auto px-6">
          <div className="grid gap-4 md:grid-cols-2">
            {valueProps.map((item) => (
              <Card key={item.title} className="border-border/70 bg-card/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <item.icon className="size-5 text-pulse" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.copy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-18">
        <div className="container mx-auto px-6">
          <Card className="relative overflow-hidden border-pulse/30 bg-card/95">
            <CardContent className="relative px-6 py-10 md:px-10 md:py-12">
              <p className="text-xs font-mono uppercase tracking-[0.08em] text-pulse">
                Final Step
              </p>
              <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
                One application can open multiple global opportunities.
              </h3>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Submit your profile once and we&apos;ll match you to roles
                aligned with your stack, seniority, and preferred working style.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" className="gap-2" onClick={onStart}>
                  Apply as a developer
                  <Rocket className="size-4" />
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">
                    Already in the network
                    <Trophy className="size-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </>
  );
};

export { ApplyHero };
