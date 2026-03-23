"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import AutoScroll from "embla-carousel-auto-scroll";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDownRight,
  ArrowRight,
  Briefcase,
  Calendar,
  Check,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  CornerDownRight,
  FileSearch,
  FileText,
  Globe,
  Layers,
  Loader2,
  MessageSquare,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  UserSearch,
  Users,
  UsersRound,
  Video,
  X,
  Zap,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PhoneInput } from "@/components/phone-input";
import { companyLeadSchema, type CompanyLead } from "@/lib/schemas/company-enquiry";
import { HiringCalculator } from "@/components/marketing/hiring-calculator";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const CALENDLY_URL = "https://calendly.com/yaseen-octogle/30min";

/* ═══════════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

const avatars = [
  { src: "/review-1.jpg", alt: "Client" },
  { src: "/review-2.jpg", alt: "Client" },
  { src: "/review-3.jpg", alt: "Client" },
  { src: "/review-4.jpg", alt: "Client" },
];

const companyLogos = [
  { id: "logo-1", name: "1VA", image: "/company-logos/1VA.svg" },
  { id: "logo-2", name: "Beekey", image: "/company-logos/Beekey.svg" },
  { id: "logo-3", name: "Corpwise", image: "/company-logos/Corpwise.svg" },
  { id: "logo-4", name: "DNO Investments", image: "/company-logos/DNO Investments.svg" },
  { id: "logo-5", name: "Solidus", image: "/company-logos/Solidus.svg" },
  { id: "logo-6", name: "SquareLogik", image: "/company-logos/SquareLogik.svg" },
  { id: "logo-7", name: "Unichats", image: "/company-logos/Unichats.svg" },
  { id: "logo-8", name: "Workchats", image: "/company-logos/Workchats.svg" },
  { id: "logo-9", name: "The Care App", image: "/company-logos/thecareapp.svg" },
];

const processSteps = [
  {
    step: "01",
    title: "Tell Us What You Need",
    description:
      "Share your role requirements, tech stack, and timeline. It takes under 5 minutes. We match against 1,000+ pre-vetted engineers in our network.",
  },
  {
    step: "02",
    title: "Review Your Shortlist",
    description:
      "Receive 3–5 vetted, stack-matched profiles within 48 hours — complete with ratings, work history, and timezone overlap. You interview only for fit.",
  },
  {
    step: "03",
    title: "Onboard & Start Building",
    description:
      "We handle contracts, payroll, tax, and compliance across 30+ countries. You get a single invoice. Your engineer starts within days.",
  },
];

const featureCards = [
  {
    icon: ShieldCheck,
    title: "5-Stage Vetting",
    description: "Only 1 in 25 applicants pass. Coding tests, system design, live interviews, reference checks.",
  },
  {
    icon: Zap,
    title: "48-Hour Matching",
    description: "Post a role today, review hand-picked profiles tomorrow. 10x faster than agencies.",
  },
  {
    icon: Globe,
    title: "30+ Countries",
    description: "Engineers across every major tech hub with 4–6 hours of timezone overlap guaranteed.",
  },
  {
    icon: FileText,
    title: "Compliance Handled",
    description: "Contracts, payroll, tax, and IP — fully managed. One invoice, zero legal headaches.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Every client gets a dedicated account manager for onboarding, support, and replacements.",
  },
  {
    icon: Clock,
    title: "Flexible Terms",
    description: "Hire hourly, monthly, or full-time. 94% extend beyond 6 months — but there's no lock-in.",
  },
];

const vettingStages = [
  { icon: FileSearch, label: "Application Review", count: "10,000", passRate: 40 },
  { icon: Zap, label: "Technical Assessment", count: "3,500", passRate: 14 },
  { icon: MessageSquare, label: "System Design Interview", count: "1,750", passRate: 7 },
  { icon: ShieldCheck, label: "Communication Eval", count: "1,500", passRate: 6 },
  { icon: UserCheck, label: "Reference & Background", count: "1,000", passRate: 4 },
];

const complianceCards = [
  {
    icon: FileText,
    title: "Contracts",
    description: "Legally compliant employment and contractor agreements in every jurisdiction.",
  },
  {
    icon: Globe,
    title: "Payroll",
    description: "Local-currency payroll processing, on time, in 30+ countries.",
  },
  {
    icon: Shield,
    title: "Tax Compliance",
    description: "We handle tax withholding, reporting, and statutory obligations.",
  },
  {
    icon: ShieldCheck,
    title: "IP Protection",
    description: "All engineers sign IP assignment and NDA agreements. Work product is yours.",
  },
];

const onDemandFeatures = [
  "Free to post, free to receive candidates",
  "3–5 curated profiles within 48 hours",
  "All-inclusive monthly rate per developer",
  "Payroll, compliance & contracts managed",
  "14-day replacement guarantee",
  "Dedicated account manager",
];

const marketplaceFeatures = [
  "Browse 1,000+ vetted profiles directly",
  "Unlimited concurrent role postings",
  "Priority matching & onboarding",
  "Volume pricing available",
  "30-day replacement guarantee",
  "Senior account team",
];

const faqItems = [
  {
    id: "faq-1",
    question: "How quickly can I hire?",
    answer:
      "You'll receive 3–5 curated, vetted profiles within 48 hours of submitting your brief. Most companies have an engineer onboarded and working within 1–3 weeks.",
  },
  {
    id: "faq-2",
    question: "How are developers vetted?",
    answer:
      "Every engineer passes our 5-stage process: application screening, stack-specific coding assessments, a 90-minute live technical interview, communication evaluation, and full background and reference checks. Only 1 in 25 applicants are accepted.",
  },
  {
    id: "faq-3",
    question: "What does it cost?",
    answer:
      "Typical monthly rates range from $3,000–$6,000 per developer depending on seniority and stack. No placement fees, no hidden markups. You only pay once your developer starts.",
  },
  {
    id: "faq-4",
    question: "What if a developer isn't the right fit?",
    answer:
      "Our On-Demand tier includes a 14-day replacement guarantee. Marketplace placements include a 30-day guarantee. If the engineer isn't right, we replace them at no additional cost.",
  },
  {
    id: "faq-5",
    question: "Do you handle compliance?",
    answer:
      "Yes — fully. We act as Employer of Record and handle contracts, payroll, tax compliance, and IP protection across 30+ countries. You receive a single invoice.",
  },
  {
    id: "faq-6",
    question: "Can I see profiles before committing?",
    answer:
      "Absolutely. We send you fully detailed profiles — including skills, experience, timezone, rate, and our internal vetting scores — before you interview anyone. No commitment until you're ready.",
  },
  {
    id: "faq-7",
    question: "How does OctogleHire compare to Toptal or Upwork?",
    answer:
      "We're 40–60% cheaper than Toptal with the same vetting quality, and unlike Upwork, every engineer is pre-vetted — no screening work on your end. We also handle compliance, which neither does.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   DECORATIVE SVG — Process step corner mark (from shadcnblocks process1)
   ═══════════════════════════════════════════════════════════════════════════════ */

function StepMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line x1="0.607" y1="2.574" x2="21.576" y2="2.574" stroke="currentColor" strokeWidth="4" />
      <line x1="19.576" y1="19.624" x2="19.576" y2="4.574" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════════ */

export function GetStartedContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"shortlist" | "consultation">("shortlist");
  const [modalView, setModalView] = useState<"form" | "calendly">("form");
  const [contactFirstName, setContactFirstName] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyLead>({
    resolver: zodResolver(companyLeadSchema),
    mode: "onTouched",
  });

  const phoneValue = watch("phone") ?? "";

  const openModal = (type: "shortlist" | "consultation") => {
    setModalType(type);
    setModalView("form");
    setApiError(null);
    reset();
    setModalOpen(true);
  };

  const onLeadSubmit = async (data: CompanyLead) => {
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/company-enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setApiError(body.message ?? "Something went wrong. Please try again.");
        return;
      }

      setContactFirstName(data.contactName.split(" ")[0]);
      setModalView("calendly");
    } catch {
      setApiError("Unable to connect. Please check your connection and try again.");
    }
  };

  return (
    <>
      {/* ─── Lead Capture Modal ────────────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0">
          {modalView === "form" ? (
            <>
              {/* Header with accent bar */}
              <div className="border-b border-border bg-muted/30 px-6 pt-6 pb-5">
                <DialogHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-pulse/10">
                      {modalType === "shortlist" ? (
                        <Sparkles className="size-4 text-pulse" />
                      ) : (
                        <Calendar className="size-4 text-pulse" />
                      )}
                    </div>
                    <DialogTitle className="text-lg font-semibold">
                      {modalType === "shortlist"
                        ? "Get Your Free Shortlist"
                        : "Book a Free Consultation"}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {modalType === "shortlist"
                      ? "Tell us what you need and we'll send 3-5 vetted profiles within 48 hours."
                      : "Share your details and book a call with our team."}
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Form */}
              <form
                className="px-6 py-5 space-y-4"
                onSubmit={handleSubmit(onLeadSubmit)}
                noValidate
              >
                {/* Honeypot — hidden from real users */}
                <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} />

                <div className="space-y-1.5">
                  <Label htmlFor="contactName" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</Label>
                  <Input
                    id="contactName"
                    placeholder="Jane Smith"
                    className="h-10"
                    {...register("contactName")}
                  />
                  {errors.contactName && (
                    <p className="text-xs text-destructive">{errors.contactName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Inc."
                    className="h-10"
                    {...register("companyName")}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-destructive">{errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="leadEmail" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Work Email</Label>
                  <Input
                    id="leadEmail"
                    type="email"
                    placeholder="jane@acme.com"
                    className="h-10"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="leadPhone" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                  <input type="hidden" {...register("phone")} />
                  <PhoneInput
                    id="leadPhone"
                    value={phoneValue}
                    onChange={(v) => setValue("phone", v, { shouldValidate: true })}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                {apiError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
                    <p className="text-sm text-destructive">{apiError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-full gap-2 h-11"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : modalType === "shortlist" ? (
                    <>
                      Get My Free Shortlist
                      <ArrowRight className="size-4" />
                    </>
                  ) : (
                    <>
                      Continue to Booking
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-4 pt-1 pb-1">
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <ShieldCheck className="size-3" />
                    No spam, ever
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Clock className="size-3" />
                    Response in 24h
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Check className="size-3" />
                    No commitment
                  </span>
                </div>
              </form>
            </>
          ) : (
            /* ─── Calendly Booking View ─── */
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="border-b border-border bg-muted/30 px-6 pt-6 pb-5">
                <DialogHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-green-500/10">
                      <CheckCircle className="size-4 text-green-500" />
                    </div>
                    <DialogTitle className="text-lg font-semibold">
                      Thanks{contactFirstName ? `, ${contactFirstName}` : ""}!
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Your details have been received. Book a time below to speak with our team.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="px-2 py-2">
                <div
                  className="calendly-inline-widget rounded-lg overflow-hidden"
                  data-url={CALENDLY_URL}
                  style={{ minWidth: "100%", height: "580px" }}
                />
                <Script
                  src="https://assets.calendly.com/assets/external/widget.js"
                  strategy="lazyOnload"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Minimal Header ─────────────────────────────────────────────── */}
      <header className="container mx-auto px-6 py-6">
        <Link href="/">
          <Logo width={130} height={30} />
        </Link>
      </header>

      <main>
        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1 — HERO
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* Left — Copy */}
            <div className="mx-auto flex flex-col items-center text-center lg:ml-0 lg:max-w-3xl lg:items-start lg:text-left">
              <Badge variant="outline" className="mb-6">
                48-hour matching guarantee
                <span className="relative ml-2 flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-pulse" />
                </span>
              </Badge>

              <h1 className="my-6 mt-0 text-4xl font-bold text-pretty lg:text-6xl xl:text-7xl">
                Pre-Vetted Engineers,{" "}
                <span className="text-pulse">40-60% Lower Cost</span>
              </h1>

              <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
                Receive 3–5 curated developer profiles within 48 hours. No
                placement fees. Compliance handled across 30+ countries.
              </p>

              {/* Avatar stack + Clutch rating */}
              <div className="mb-12 flex w-fit items-center gap-4 rounded-full border border-border/60 bg-background/80 py-2.5 pl-3 pr-5 shadow-sm backdrop-blur">
                <span className="inline-flex items-center -space-x-3">
                  {avatars.map((avatar, i) => (
                    <Avatar key={i} className="size-9 border-2 border-background ring-1 ring-border/40">
                      <AvatarImage src={avatar.src} alt={avatar.alt} />
                    </Avatar>
                  ))}
                </span>
                <span className="h-6 w-px bg-border/60" />
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">5.0</span>
                  <span className="text-xs text-muted-foreground">on</span>
                  <span className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="12" fill="#E41E2E" />
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </svg>
                    <span className="text-sm font-bold tracking-tight">Clutch</span>
                  </span>
                </div>
              </div>

              {/* CTAs — open modal */}
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                <Button
                  size="lg"
                  className="w-full rounded-full sm:w-auto"
                  onClick={() => openModal("shortlist")}
                >
                  Get Your Free Shortlist
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full sm:w-auto"
                  onClick={() => openModal("consultation")}
                >
                  Book a Free Consultation
                  <ArrowDownRight className="ml-1 size-4" />
                </Button>
              </div>

              {/* Certification badges */}
              <div className="mt-8 flex items-center gap-5 flex-wrap justify-center lg:justify-start">
                {[
                  { src: "/security/ISO copy.png", alt: "ISO 27001 Certified" },
                  { src: "/security/GDPR copy.png", alt: "GDPR Compliant" },
                  { src: "/security/CCPA copy.png", alt: "CCPA Compliant" },
                ].map((badge) => (
                  <Image
                    key={badge.alt}
                    src={badge.src}
                    alt={badge.alt}
                    width={80}
                    height={80}
                    className="h-14 w-auto invert dark:invert-0 opacity-70 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>
            </div>

            {/* Right — Real product dashboard mockup */}
            <div className="flex">
              <div className="w-full overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-2xl shadow-black/10">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 border-b border-border/60 px-5 py-3">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-[#ff5f57]" />
                    <div className="size-3 rounded-full bg-[#febc2e]" />
                    <div className="size-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="ml-4 flex-1 flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-1.5">
                    <svg className="size-3 text-muted-foreground/50" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 00-5 5v1.5A2.5 2.5 0 005.5 10h5A2.5 2.5 0 0013 7.5V6a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.5"/><rect x="6" y="10" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
                    <span className="text-[11px] text-muted-foreground/70">
                      app.octoglehire.com/dashboard
                    </span>
                  </div>
                </div>

                <div className="flex">
                  {/* Sidebar — mirrors real product nav */}
                  <div className="hidden md:flex w-44 shrink-0 flex-col border-r border-border/40 bg-muted/20 py-4 px-3">
                    <div className="mb-5 px-2">
                      <Logo width={90} height={20} />
                    </div>
                    {/* Nav groups */}
                    {[
                      {
                        label: "WORKSPACE",
                        items: [
                          { icon: Layers, name: "Overview", active: true },
                        ],
                      },
                      {
                        label: "HIRING",
                        items: [
                          { icon: ClipboardList, name: "Requirements", active: false },
                          { icon: UserSearch, name: "Candidates", active: false, badge: "3" },
                          { icon: Video, name: "Interviews", active: false },
                        ],
                      },
                      {
                        label: "TEAM",
                        items: [
                          { icon: Briefcase, name: "Engagements", active: false },
                          { icon: UsersRound, name: "Team", active: false },
                          { icon: Clock, name: "Timesheets", active: false },
                        ],
                      },
                      {
                        label: "BILLING",
                        items: [
                          { icon: FileText, name: "Invoices", active: false },
                          { icon: Settings, name: "Settings", active: false },
                        ],
                      },
                    ].map((group) => (
                      <div key={group.label} className="mb-3">
                        <p className="px-2 mb-1 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                          {group.label}
                        </p>
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.name}
                              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${
                                item.active
                                  ? "bg-pulse/10 border border-pulse/20 text-foreground font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <Icon className={`size-3.5 ${item.active ? "text-pulse" : ""}`} />
                              <span className="flex-1">{item.name}</span>
                              {"badge" in item && item.badge && (
                                <span className="rounded-full bg-pulse/15 text-pulse px-1.5 py-0.5 text-[8px] font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Main content — Operations Overview */}
                  <div className="flex-1 p-4 space-y-4 overflow-hidden">
                    {/* Page header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">Operations Overview</p>
                        <p className="text-[10px] text-muted-foreground">
                          Track engagements, review matches, and manage requirements.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="rounded-full bg-foreground px-2.5 py-1 text-[9px] font-semibold text-background">
                          + Post Requirement
                        </div>
                      </div>
                    </div>

                    {/* KPI cards — mirrors real product */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { icon: Briefcase, label: "Active Engagements", value: "8", color: "text-blue-500 bg-blue-500/10" },
                        { icon: FileText, label: "Monthly Bill", value: "$34,200", color: "text-emerald-500 bg-emerald-500/10" },
                        { icon: UserSearch, label: "To Review", value: "3", color: "text-amber-500 bg-amber-500/10" },
                        { icon: ClipboardList, label: "Open Positions", value: "2", color: "text-purple-500 bg-purple-500/10" },
                      ].map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                          <div key={kpi.label} className="rounded-lg border border-border/50 bg-background p-2.5">
                            <div className={`inline-flex size-6 items-center justify-center rounded-full ${kpi.color} mb-1.5`}>
                              <Icon className="size-3" />
                            </div>
                            <p className="text-[8px] text-muted-foreground uppercase tracking-wider font-medium">
                              {kpi.label}
                            </p>
                            <p className="font-mono text-sm font-bold mt-0.5">
                              {kpi.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Matches to review — amber highlight */}
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <UserSearch className="size-3.5 text-amber-500" />
                        <p className="text-[11px] font-semibold">Matches to Review</p>
                        <span className="rounded-full bg-amber-500/15 text-amber-600 px-1.5 py-0.5 text-[8px] font-bold">
                          3 new
                        </span>
                      </div>
                      {[
                        { title: "Senior React Engineer", stack: ["React", "TypeScript", "Node.js"], count: 2 },
                        { title: "DevOps Engineer", stack: ["AWS", "Kubernetes", "Terraform"], count: 1 },
                      ].map((req) => (
                        <div key={req.title} className="flex items-center gap-2 py-1.5 border-t border-amber-500/10">
                          <ClipboardList className="size-3 text-muted-foreground shrink-0" />
                          <span className="text-[10px] font-medium flex-1 truncate">{req.title}</span>
                          <div className="flex gap-1">
                            {req.stack.map((s) => (
                              <span key={s} className="rounded bg-background px-1 py-0.5 text-[7px] font-medium text-muted-foreground border border-border/50">
                                {s}
                              </span>
                            ))}
                          </div>
                          <span className="rounded-full bg-amber-500/15 text-amber-600 px-1.5 py-0.5 text-[8px] font-bold shrink-0">
                            {req.count} to review
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Active team */}
                    <div className="rounded-lg border border-border/50 bg-background p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-semibold">Active Team</p>
                        <span className="text-[9px] text-muted-foreground">View all →</span>
                      </div>
                      {[
                        { name: "Arjun P.", role: "Senior React Engineer", req: "Frontend Rebuild", rate: "$28/hr", type: "Full-time", img: "/Anil-TechLead.jpg" },
                        { name: "Sofia M.", role: "Backend Engineer", req: "API Platform", rate: "$25/hr", type: "Full-time", img: "/Ricardo-Recruitment.jpg" },
                        { name: "Dimitri K.", role: "DevOps Engineer", req: "Cloud Migration", rate: "$30/hr", type: "Part-time", img: "/Dimitris-Marketing.jpg" },
                      ].map((eng) => (
                        <div key={eng.name} className="flex items-center gap-2 py-1.5 border-t border-border/30">
                          <div className="relative size-6 rounded-full overflow-hidden border border-border/60 shrink-0">
                            <Image src={eng.img} alt={eng.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold truncate">{eng.name}</p>
                            <p className="text-[8px] text-muted-foreground truncate">{eng.req}</p>
                          </div>
                          <span className="font-mono text-[9px] font-semibold shrink-0">{eng.rate}</span>
                          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[8px] font-medium text-muted-foreground shrink-0">
                            {eng.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2 — LOGO CAROUSEL (shadcnblocks/logos3 pattern)
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-16">
          <div className="container mx-auto px-6 flex flex-col items-center text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Trusted by engineering teams building with
            </p>
          </div>
          <div className="pt-10">
            <div className="relative mx-auto flex items-center justify-center">
              <Carousel
                opts={{ loop: true, align: "start" }}
                plugins={[AutoScroll({ playOnInit: true, speed: 0.6, stopOnInteraction: false })]}
              >
                <CarouselContent className="ml-0">
                  {[...companyLogos, ...companyLogos].map((logo, i) => (
                    <CarouselItem
                      key={`${logo.id}-${i}`}
                      className="flex basis-1/3 items-center justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-[12.5%]"
                    >
                      <div className="flex h-10 w-32 shrink-0 items-center justify-center">
                        <img
                          src={logo.image}
                          alt={logo.name}
                          className="max-h-7 max-w-[120px] w-auto object-contain invert dark:invert-0 opacity-50 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3 — FEATURE CARDS (shadcnblocks/feature3 pattern)
            6 cards with images showing why OctogleHire
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
              <Badge variant="outline">Why OctogleHire</Badge>
              <h2 className="mb-6 text-4xl font-semibold text-pretty lg:text-5xl">
                Everything you need to build a{" "}
                <span className="text-pulse">world-class</span> engineering team
              </h2>

              <div className="mt-10 grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {featureCards.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={feature.title}>
                      <CardHeader className="pb-1">
                        <Icon className="size-5" strokeWidth={1.5} />
                      </CardHeader>
                      <CardContent className="text-left">
                        <h3 className="mb-1 text-lg font-semibold">
                          {feature.title}
                        </h3>
                        <p className="leading-snug text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4 — PROCESS (shadcnblocks/process1 pattern)
            Sticky sidebar left, numbered steps right
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-32 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-6 lg:gap-20">
              {/* Sticky sidebar */}
              <div className="top-10 col-span-2 h-fit w-fit gap-3 space-y-7 py-8 lg:sticky">
                <div className="relative w-fit text-5xl font-semibold tracking-tight lg:text-7xl">
                  <h2 className="w-fit">How It Works</h2>
                  <span className="absolute -top-2 -right-2 size-3 rounded-full bg-pulse md:-right-6 lg:-right-8" />
                </div>
                <p className="text-base text-foreground/50">
                  From first brief to working engineer in under 3 weeks. No
                  placement fees, no hidden costs, no long-term lock-in.
                </p>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-2"
                  onClick={() => openModal("shortlist")}
                >
                  <CornerDownRight className="text-pulse" />
                  Start hiring
                </Button>
              </div>

              {/* Steps */}
              <ul className="relative col-span-4 w-full lg:pl-22">
                {processSteps.map((step, index) => (
                  <li
                    key={index}
                    className="relative flex flex-col justify-between gap-10 border-t py-8 md:flex-row lg:py-10"
                  >
                    <StepMark className="absolute top-4 right-0 text-pulse" />
                    <div className="flex size-12 items-center justify-center bg-muted px-4 py-1 font-mono tracking-tighter text-lg font-semibold">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="mb-4 text-2xl font-semibold tracking-tight lg:text-3xl">
                        {step.title}
                      </h3>
                      <p className="text-foreground/50 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 5 — SAVINGS CALCULATOR (existing component)
           ═══════════════════════════════════════════════════════════════════ */}
        <HiringCalculator />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 6 — VETTING PROOF (feature1 pattern — image + text split)
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-32 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              {/* Left — Funnel visualization */}
              <div className="space-y-3">
                {vettingStages.map((stage, i) => {
                  const Icon = stage.icon;
                  const isLast = i === vettingStages.length - 1;
                  const widthPercent = Math.max(stage.passRate * 2.5, 20);
                  return (
                    <div key={stage.label} className="flex items-center gap-3">
                      <div
                        className={`flex items-center gap-2.5 rounded-lg py-3 px-4 transition-all ${
                          isLast
                            ? "bg-pulse/10 border border-pulse/20"
                            : "bg-background border border-border"
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      >
                        <Icon
                          className={`size-4 shrink-0 ${
                            isLast ? "text-pulse" : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-xs font-medium truncate">
                          {stage.label}
                        </span>
                      </div>
                      <span className="font-mono text-sm text-muted-foreground shrink-0">
                        {stage.count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Right — Copy */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <Badge variant="outline" className="mb-4">
                  Vetting Process
                </Badge>
                <h2 className="my-6 mt-0 text-4xl font-semibold text-balance lg:text-5xl">
                  1 in 25 applicants accepted
                </h2>
                <p className="mb-8 max-w-xl text-muted-foreground lg:text-lg">
                  From over 25,000 applicants, only 1,000 engineers have been
                  accepted into our network. Every engineer has passed all 5
                  stages — no exceptions. Live 90-minute interviews, 3+ reference
                  checks, background verification.
                </p>
                <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button asChild className="rounded-full">
                    <Link href="/how-we-vet">See Our Vetting Process</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => openModal("shortlist")}
                  >
                    Get Vetted Profiles
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 7 — COMPLIANCE (feature2 pattern — image left, text right)
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="grid items-center gap-8 md:gap-16 lg:grid-cols-2">
              {/* Left — Country flags + compliance cards */}
              <div className="space-y-6">
                {/* Flag grid */}
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    "in", "br", "pl", "ua", "ar", "ng", "pk", "ro", "co",
                    "mx", "tr", "eg", "ph", "vn", "id", "ke",
                  ].map((code) => (
                    <img
                      key={code}
                      src={`https://flagcdn.com/w40/${code}.png`}
                      alt=""
                      className="h-6 w-auto rounded-sm border border-border"
                      width={40}
                      height={28}
                    />
                  ))}
                  <span className="text-xs font-medium text-muted-foreground">
                    +14 more
                  </span>
                </div>

                {/* Compliance cards grid */}
                <div className="grid grid-cols-2 gap-3">
                  {complianceCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.title}
                        className="rounded-xl border border-border bg-background p-4 space-y-2"
                      >
                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                          <Icon className="size-4 text-muted-foreground" />
                        </div>
                        <h4 className="text-sm font-semibold">{card.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right — Copy */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <h2 className="my-6 mt-0 text-4xl font-semibold text-balance lg:text-5xl">
                  Contracts, Payroll, Tax, IP:{" "}
                  <span className="text-muted-foreground">All Handled</span>
                </h2>
                <p className="mb-8 max-w-xl text-muted-foreground lg:text-lg">
                  We act as Employer of Record across 30+ countries so you
                  don&apos;t need to set up foreign entities. Single invoice, zero
                  legal complexity.
                </p>
                <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button
                    className="rounded-full"
                    onClick={() => openModal("shortlist")}
                  >
                    Start Hiring Globally
                  </Button>
                  <Button variant="outline" asChild className="rounded-full">
                    <Link href="/security">
                      ISO 27001 Certified
                      <ShieldCheck className="ml-1 size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 8 — PRICING (two cards, inverted primary)
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-32 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                Pricing
              </Badge>
              <h2 className="text-4xl font-semibold tracking-tight lg:text-5xl">
                Transparent Pricing, No Hidden Fees
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Typical monthly rates: $3,000–$6,000 per developer depending on
                seniority and stack.
              </p>
            </div>

            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
              {/* On-Demand */}
              <div className="flex flex-col gap-5 rounded-3xl bg-foreground p-8 transition-transform duration-200 hover:-translate-y-1">
                <div>
                  <h3 className="text-sm font-semibold text-background">
                    On-Demand
                  </h3>
                  <p className="mt-1 text-xs text-background/60">
                    Free to post. Pay per developer monthly.
                  </p>
                </div>
                <div>
                  <span className="font-mono text-4xl font-semibold text-background">
                    FREE
                  </span>
                  <span className="ml-2 text-sm text-background/50">
                    to get started
                  </span>
                  <p className="mt-1 text-xs text-background/50">
                    14-day replacement guarantee
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="rounded-full gap-2"
                  onClick={() => openModal("shortlist")}
                >
                  Post a Role Free
                  <ArrowRight className="size-4" />
                </Button>
                <ul className="space-y-2.5">
                  {onDemandFeatures.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-background/80"
                    >
                      <Check
                        className="size-4 shrink-0 text-background/40"
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Marketplace */}
              <div className="flex flex-col gap-5 rounded-3xl border bg-card p-8 transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20">
                <div>
                  <h3 className="text-sm font-semibold">Marketplace</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Direct access. Volume pricing.
                  </p>
                </div>
                <div>
                  <span className="font-mono text-2xl font-semibold">
                    Contact Sales
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    30-day replacement guarantee
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full gap-2"
                  onClick={() => openModal("consultation")}
                >
                  Get a Custom Quote
                  <ArrowRight className="size-4" />
                </Button>
                <ul className="space-y-2.5">
                  {marketplaceFeatures.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <Check
                        className="size-4 shrink-0 text-pulse"
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 9 — FAQ (shadcnblocks/faq1 pattern — accordion)
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-32">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="mb-4 text-3xl font-semibold md:mb-11 md:text-4xl">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible>
              {faqItems.map((item, index) => (
                <AccordionItem key={item.id} value={`item-${index}`}>
                  <AccordionTrigger className="font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 10 — CTA (shadcnblocks/cta4 pattern — split with checklist)
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="flex justify-center">
              <div className="max-w-5xl w-full">
                <div className="flex flex-col items-start justify-between gap-10 rounded-3xl bg-foreground px-6 py-10 md:flex-row lg:px-20 lg:py-16">
                  <div className="md:w-1/2">
                    <h2 className="mb-2 text-3xl font-bold text-background md:text-4xl">
                      Ready to Hire Smarter?
                    </h2>
                    <p className="text-background/60">
                      No placement fees. No long-term lock-in. Your first
                      shortlist in 48 hours.
                    </p>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="rounded-full gap-2"
                        onClick={() => openModal("shortlist")}
                      >
                        Get Your Free Shortlist
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="md:w-1/3">
                    <ul className="flex flex-col space-y-3 text-sm font-medium text-background/80">
                      {[
                        "Pre-vetted engineers only",
                        "48-hour matching",
                        "No placement fees",
                        "30+ countries covered",
                        "ISO 27001 certified",
                        "14–30 day guarantee",
                      ].map((item, idx) => (
                        <li className="flex items-center" key={idx}>
                          <Check className="mr-3 size-4 shrink-0 text-background/40" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Minimal Footer ─────────────────────────────────────────────── */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/">
              <Logo width={110} height={26} />
            </Link>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/security"
                className="hover:text-foreground transition-colors"
              >
                Security
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">OctogleHire 2026</p>
          </div>
        </div>
      </footer>
    </>
  );
}
