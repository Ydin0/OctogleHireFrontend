import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Globe,
  HandCoins,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { Rating } from "@/components/shadcnblocks/rating";
import { ScrollableTabsList } from "@/components/shadcnblocks/scrollable-tabslist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EarningsCalculator } from "./_components/earnings-calculator";

export const metadata: Metadata = {
  title: "For Developers | OctogleHire",
  description:
    "Join OctogleHire to get matched with global engineering roles, transparent compensation, and long-term remote opportunities.",
};

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
    value: "fullstack",
    label: "Full-Stack",
    title: "Own features end-to-end",
    summary:
      "Best fit for engineers who can move from UI to APIs and ship fast with product teams.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&h=900&fit=crop",
    focus: ["React/Next.js delivery", "API + DB ownership", "System thinking"],
  },
  {
    value: "backend",
    label: "Backend",
    title: "Build scalable core systems",
    summary:
      "For engineers who enjoy architecture, reliability, and high-throughput service design.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&h=900&fit=crop",
    focus: ["Distributed systems", "Cloud + observability", "Performance tuning"],
  },
  {
    value: "ai",
    label: "AI / Data",
    title: "Ship applied AI products",
    summary:
      "Work on LLM pipelines, data infrastructure, and production machine learning systems.",
    image:
      "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=1400&h=900&fit=crop",
    focus: ["LLM integrations", "Data modeling", "Evaluation frameworks"],
  },
  {
    value: "mobile",
    label: "Mobile",
    title: "Build product experiences people keep",
    summary:
      "Own modern mobile app development with fast release loops and meaningful user impact.",
    image:
      "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1400&h=900&fit=crop",
    focus: ["React Native / Swift / Kotlin", "Performance + UX polish", "App store lifecycle"],
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

export default function DevelopersJoinPage() {
  return (
    <div className="bg-gradient-to-b from-background via-background to-pulse/5">
      <Navbar />

      <main>
        <section className="relative flex min-h-[calc(100svh-88px)] items-center overflow-hidden py-8 lg:py-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-18 left-1/2 h-72 w-72 -translate-x-[140%] rounded-full bg-pulse/25 blur-3xl" />
            <div className="absolute right-0 bottom-10 h-72 w-72 translate-x-1/3 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="container relative mx-auto grid h-full items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_500px]">
            <div className="pt-2">
              <Badge
                variant="outline"
                className="border-pulse/35 bg-pulse/10 font-mono uppercase tracking-[0.08em] text-pulse"
              >
                Developer Acquisition Phase
              </Badge>
              <h1 className="mt-5 max-w-2xl text-5xl leading-tight font-semibold tracking-tight md:text-6xl">
                Build your next career move with better signal.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                Join a curated developer network where roles are verified,
                compensation is clear, and opportunities are matched to your
                strengths.
              </p>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                Prioritizing top talent from high-growth markets including India,
                South Africa, Egypt, Nigeria, and Brazil.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/apply">
                    Start your application
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/developers">Browse marketplace</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              <Card className="overflow-hidden border-pulse/25 bg-card/90">
                <CardContent className="p-0">
                  <div className="relative h-70 w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1522071901873-411886a10004?w=1600&h=1000&fit=crop"
                      alt="Developers collaborating on product planning"
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="overflow-hidden border-border/70">
                  <CardContent className="p-0">
                    <div className="relative h-40 w-full">
                      <Image
                        src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&h=900&fit=crop"
                        alt="Developer working on production code"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-muted/40">
                  <CardContent className="flex h-full flex-col justify-center p-5">
                    <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                      Intake Focus
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      Full-stack, backend, and AI engineers from India, South
                      Africa, Egypt, and other global growth markets.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trustStats.map((item) => (
                <Card key={item.label} className="border-border/70 bg-card/85">
                  <CardContent className="pt-6">
                    <p className="text-3xl font-semibold text-pulse">{item.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-18">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-mono uppercase tracking-[0.08em] text-pulse">
                Role Tracks
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Pick the path that fits your strengths.
              </h2>
            </div>

            <Tabs defaultValue={roleTracks[0].value} className="mt-8">
              <ScrollableTabsList>
                <TabsList className="h-auto rounded-full bg-muted/60 p-1">
                  {roleTracks.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      className="rounded-full px-4 font-mono uppercase tracking-[0.08em]"
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollableTabsList>

              {roleTracks.map((item) => (
                <TabsContent key={item.value} value={item.value} className="mt-5">
                  <Card className="overflow-hidden border-border/70">
                    <CardContent className="grid gap-0 p-0 lg:grid-cols-[45%_55%]">
                      <div className="relative min-h-72">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 md:p-8">
                        <h3 className="text-2xl font-semibold">{item.title}</h3>
                        <p className="mt-3 text-muted-foreground">{item.summary}</p>

                        <ul className="mt-5 space-y-2">
                          {item.focus.map((focus) => (
                            <li key={focus} className="flex items-start gap-2 text-sm">
                              <Sparkles className="mt-0.5 size-4 text-pulse" />
                              <span>{focus}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6">
                          <Button asChild className="gap-2">
                            <Link href="/apply">
                              Apply for this track
                              <ArrowRight className="size-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

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
                        <p className="text-xs text-muted-foreground">{item.title}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Rating rate={item.rating} showScore />
                    <p className="mt-3 text-sm text-muted-foreground">{item.quote}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

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

        <section className="pb-18">
          <div className="container mx-auto px-6">
            <Card className="relative overflow-hidden border-pulse/30 bg-card/95">
              <div className="pointer-events-none absolute inset-0 opacity-25">
                <div className="absolute top-8 left-8 h-44 w-44 rounded-full bg-pulse blur-3xl" />
                <div className="absolute right-10 bottom-2 h-44 w-44 rounded-full bg-primary blur-3xl" />
              </div>
              <CardContent className="relative px-6 py-10 md:px-10 md:py-12">
                <p className="text-xs font-mono uppercase tracking-[0.08em] text-pulse">
                  Final Step
                </p>
                <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
                  One application can open multiple global opportunities.
                </h3>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Submit your profile once and we&apos;ll match you to roles
                  aligned with your stack, seniority, and preferred working
                  style.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/apply">
                      Apply as a developer
                      <Rocket className="size-4" />
                    </Link>
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
      </main>

      <Footer />
    </div>
  );
}
