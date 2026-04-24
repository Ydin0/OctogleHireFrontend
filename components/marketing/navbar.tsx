"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ChevronDown,
  Menu,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ThemeToggle } from "@/components/theme-toggle";
import { techToSlug, countryToSlug } from "@/lib/seo-data";

interface NavbarProps {
  className?: string;
}

/* ─── Mega-menu data ──────────────────────────────────────────────────────── */

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

type TalentLink = { label: string; href: string; icon?: string; flag?: string };
type TalentColumn = { title: string; links: TalentLink[] };

const techLink = (tech: string, iconPath: string): TalentLink => ({
  label: tech,
  href: `/hire/${techToSlug(tech)}`,
  icon: `${DEVICON}/${iconPath}`,
});

const countryLink = (country: string, isoCode: string): TalentLink => ({
  label: country,
  href: `/hire/developers-in/${countryToSlug(country)}`,
  flag: `https://flagcdn.com/w40/${isoCode.toLowerCase()}.png`,
});

const talentColumns: TalentColumn[] = [
  {
    title: "Frontend",
    links: [
      techLink("React",      "react/react-original.svg"),
      techLink("Next.js",    "nextjs/nextjs-original.svg"),
      techLink("Vue.js",     "vuejs/vuejs-original.svg"),
      techLink("Angular",    "angularjs/angularjs-original.svg"),
      techLink("TypeScript", "typescript/typescript-original.svg"),
    ],
  },
  {
    title: "Backend",
    links: [
      techLink("Node.js",    "nodejs/nodejs-original.svg"),
      techLink("Python",     "python/python-original.svg"),
      techLink("Go",         "go/go-original-wordmark.svg"),
      techLink("Java",       "java/java-original.svg"),
      techLink("Rust",       "rust/rust-original.svg"),
      techLink("Django",     "django/django-plain.svg"),
    ],
  },
  {
    title: "Mobile",
    links: [
      techLink("React Native", "react/react-original.svg"),
      techLink("Flutter",      "flutter/flutter-original.svg"),
      techLink("Swift",        "swift/swift-original.svg"),
      techLink("Kotlin",       "kotlin/kotlin-original.svg"),
    ],
  },
  {
    title: "DevOps & Cloud",
    links: [
      techLink("AWS",        "amazonwebservices/amazonwebservices-plain-wordmark.svg"),
      techLink("Docker",     "docker/docker-original.svg"),
      techLink("Kubernetes", "kubernetes/kubernetes-original.svg"),
      techLink("PostgreSQL", "postgresql/postgresql-original.svg"),
    ],
  },
  {
    title: "By Country",
    links: [
      countryLink("India",       "IN"),
      countryLink("Brazil",      "BR"),
      countryLink("Poland",      "PL"),
      countryLink("Ukraine",     "UA"),
      countryLink("Argentina",   "AR"),
      countryLink("Philippines", "PH"),
    ],
  },
];

const companyLinks = [
  { label: "About Us", href: "/about",       icon: Building2, description: "Our mission, story, and team." },
  { label: "Team",     href: "/about#team",  icon: Users,     description: "The people who vet and match." },
  { label: "Blog",     href: "/blog",        icon: BookOpen,  description: "Insights on hiring and AI native engineering." },
];

/* ─── Hire Talent mega menu (desktop) ─────────────────────────────────────── */

function HireTalentMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openNow = () => { clearTimer(); setOpen(true); };
  const scheduleClose = () => { clearTimer(); closeTimer.current = setTimeout(() => setOpen(false), 150); };
  const close = () => { clearTimer(); setOpen(false); };
  useEffect(() => () => clearTimer(), []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="inline-flex h-9 items-center gap-1 px-4 text-sm font-medium uppercase tracking-wide text-foreground/80 outline-none transition-colors hover:text-foreground data-[state=open]:text-foreground"
        onMouseEnter={openNow}
        onMouseLeave={scheduleClose}
      >
        Hire Talent
        <ChevronDown className="size-3 transition-transform data-[state=open]:rotate-180" aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[min(1040px,calc(100vw-3rem))] p-5"
        onMouseEnter={openNow}
        onMouseLeave={scheduleClose}
      >
        {/* Featured AI Engineers card */}
        <Link
          href="/marketplace"
          onClick={close}
          className="group/featured mb-5 flex flex-row items-center gap-4 rounded-2xl border border-pulse/30 bg-pulse/[0.06] p-5 transition-colors hover:bg-pulse/10"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-pulse/30 bg-background">
            <Sparkles className="size-5 text-pulse" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">AI Engineers</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-pulse/30 bg-pulse/10 px-1.5 py-0.5">
                <span className="size-1 rounded-full bg-pulse animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-pulse">
                  Most in demand
                </span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Hire engineers who ship with Cursor, Claude Code, RAG, and agentic workflows — all certified on the Octogle AI Playbook.
            </p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-pulse transition-transform group-hover/featured:translate-x-0.5" />
        </Link>

        {/* 5-column grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {talentColumns.map((col) => (
            <div key={col.title} className="min-w-0 space-y-2">
              <div className="border-b border-border pb-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {col.title}
                </p>
              </div>
              <ul className="space-y-0.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="group/row flex w-full flex-row items-center gap-2.5 whitespace-nowrap rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <span className="flex size-4 shrink-0 items-center justify-center">
                        {link.icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={link.icon}
                            alt=""
                            className="size-4 opacity-80 transition-opacity group-hover/row:opacity-100"
                          />
                        ) : link.flag ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={link.flag}
                            alt=""
                            className="h-3 w-auto rounded-sm shadow-sm"
                          />
                        ) : null}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ─── Company dropdown (desktop) ──────────────────────────────────────────── */

function CompanyMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openNow = () => { clearTimer(); setOpen(true); };
  const scheduleClose = () => { clearTimer(); closeTimer.current = setTimeout(() => setOpen(false), 150); };
  const close = () => { clearTimer(); setOpen(false); };
  useEffect(() => () => clearTimer(), []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="inline-flex h-9 items-center gap-1 px-4 text-sm font-medium uppercase tracking-wide text-foreground/80 outline-none transition-colors hover:text-foreground data-[state=open]:text-foreground"
        onMouseEnter={openNow}
        onMouseLeave={scheduleClose}
      >
        Company
        <ChevronDown className="size-3 transition-transform data-[state=open]:rotate-180" aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] p-3"
        onMouseEnter={openNow}
        onMouseLeave={scheduleClose}
      >
        <ul className="flex flex-col gap-1">
          {companyLinks.map(({ label, href, icon: Icon, description }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={close}
                className="group/row flex flex-row items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
              >
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                  <Icon className="size-4 text-muted-foreground transition-colors group-hover/row:text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none">{label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

/* ─── Direct top-level link ───────────────────────────────────────────────── */

function DirectNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center px-4 text-sm font-medium uppercase tracking-wide text-foreground/80 transition-colors hover:text-foreground"
    >
      {label}
    </Link>
  );
}

/* ─── Mobile helpers ──────────────────────────────────────────────────────── */

function MobileGroup({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <CollapsibleTrigger className="flex w-full items-center justify-between border-b border-border py-4 text-sm font-medium">
        {label}
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]/collapsible:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-1 py-3 pl-1">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function MobileSubGroup({
  label,
  links,
}: {
  label: string;
  links: TalentLink[];
}) {
  return (
    <div className="py-2">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={link.icon} alt="" className="size-3.5" />
              ) : link.flag ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={link.flag} alt="" className="h-2.5 w-auto rounded-sm shadow-sm" />
              ) : null}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileDirectLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between border-b border-border py-4 text-sm font-medium text-foreground"
    >
      {label}
      <ArrowRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────────────────── */

const Navbar = ({ className }: NavbarProps) => {
  const { isSignedIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className={cn(
        "sticky top-0 z-[120] py-3 transition-all duration-300",
        className,
      )}
    >
      <div className="container mx-auto px-6">
        <div
          className={cn(
            "transition-all duration-500 backdrop-blur-xl backdrop-saturate-150",
            isScrolled
              ? "rounded-full border border-border/60 bg-background/50 px-5 py-2.5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] ring-1 ring-inset ring-foreground/[0.04] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] dark:ring-white/[0.04]"
              : "rounded-full bg-background/30 px-5 py-2 ring-1 ring-inset ring-foreground/[0.02] dark:ring-white/[0.02]",
          )}
        >
          {/* ── Desktop ─────────────────────────────────────────────── */}
          <nav className="hidden items-center justify-between lg:flex">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Logo width={130} height={30} />
              </Link>

              <div className="flex items-center gap-0.5">
                <HireTalentMenu />
                <DirectNavLink href="/how-we-vet" label="How It Works" />
                <DirectNavLink href="/#pricing" label="Pricing" />
                <DirectNavLink href="/apply" label="For Developers" />
                <CompanyMenu />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              {isSignedIn ? (
                <Button asChild size="sm" className="rounded-full">
                  <Link href="/auth/after-sign-in">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="rounded-full gap-1.5">
                    <Link href="/companies/signup">
                      Start Hiring
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* ── Mobile ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-between lg:hidden">
            <Link href="/">
              <Logo width={130} height={30} />
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href="/">
                        <Logo width={130} height={30} />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col p-4">
                    {/* Hire Talent */}
                    <MobileGroup label="Hire Talent" defaultOpen>
                      <Link
                        href="/marketplace"
                        className="mb-3 flex items-center gap-3 rounded-xl border border-pulse/30 bg-pulse/[0.06] p-3"
                      >
                        <Sparkles className="size-4 text-pulse" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">AI Engineers</p>
                          <p className="text-[11px] text-muted-foreground">
                            Most in demand · View AI-certified talent
                          </p>
                        </div>
                        <ArrowRight className="size-3.5 text-pulse" />
                      </Link>

                      {talentColumns.map((col) => (
                        <MobileSubGroup key={col.title} label={col.title} links={col.links} />
                      ))}
                    </MobileGroup>

                    {/* Direct links */}
                    <MobileDirectLink href="/how-we-vet" label="How It Works" />
                    <MobileDirectLink href="/#pricing" label="Pricing" />
                    <MobileDirectLink href="/apply" label="For Developers" />

                    {/* Company */}
                    <MobileGroup label="Company">
                      <Link
                        href="/about"
                        className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Building2 className="size-4" />
                        About Us
                      </Link>
                      <Link
                        href="/about#team"
                        className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Users className="size-4" />
                        Team
                      </Link>
                      <Link
                        href="/blog"
                        className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <BookOpen className="size-4" />
                        Blog
                      </Link>
                    </MobileGroup>

                    <div className="mt-6 flex flex-col gap-3">
                      {isSignedIn ? (
                        <Button asChild>
                          <Link href="/auth/after-sign-in">Dashboard</Link>
                        </Button>
                      ) : (
                        <>
                          <Button asChild variant="outline">
                            <Link href="/login">Sign In</Link>
                          </Button>
                          <Button asChild className="gap-1.5">
                            <Link href="/companies/signup">
                              Start Hiring
                              <ArrowRight className="size-3.5" />
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
