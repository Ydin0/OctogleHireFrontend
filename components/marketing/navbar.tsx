"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Code2,
  Globe,
  Menu,
  Shield,
  Users,
  Briefcase,
  BookOpen,
  HelpCircle,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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

interface NavbarProps {
  className?: string;
}

/* ─── Submenu item helper ─────────────────────────────────────────────────── */

function NavItem({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
        >
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
            <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

/* ─── Mobile accordion group ──────────────────────────────────────────────── */

function MobileGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between border-b border-border py-4 text-sm font-medium">
        {label}
        <ChevronDown className="size-4 text-muted-foreground transition-transform [[data-state=open]>svg&]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-1 py-2 pl-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function MobileLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <Icon className="size-4" />
      {label}
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
            "transition-all duration-300",
            isScrolled
              ? "rounded-full border border-border/70 bg-background/70 px-5 py-2.5 shadow-lg backdrop-blur-md"
              : "py-1",
          )}
        >
          {/* ── Desktop ─────────────────────────────────────────────── */}
          <nav className="hidden items-center justify-between lg:flex">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Logo width={130} height={30} />
              </Link>

              <NavigationMenu>
                <NavigationMenuList>
                  {/* Platform */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      Platform
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[520px] grid-cols-2 gap-1 p-3">
                        <NavItem
                          href="/"
                          icon={Building2}
                          title="For Companies"
                          description="Hire pre-vetted engineers in 48 hours. Save 40–60% on hiring costs."
                        />
                        <NavItem
                          href="/for-agencies"
                          icon={Users}
                          title="For Agencies"
                          description="White-label access to vetted developers for your clients."
                        />
                        <NavItem
                          href="/apply"
                          icon={Code2}
                          title="For Developers"
                          description="Join our network. Work with top companies globally."
                        />
                        <NavItem
                          href="/marketplace"
                          icon={Globe}
                          title="Marketplace"
                          description="Browse available engineers by stack, country, and rate."
                        />
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* How It Works */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      How It Works
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[520px] grid-cols-2 gap-1 p-3">
                        <NavItem
                          href="/how-we-vet"
                          icon={Shield}
                          title="How We Vet"
                          description="Our 5-stage process — only 1 in 25 applicants are accepted."
                        />
                        <NavItem
                          href="/#pricing"
                          icon={DollarSign}
                          title="Pricing"
                          description="Transparent pricing. No placement fees, no hidden costs."
                        />
                        <NavItem
                          href="/#how-it-works"
                          icon={Briefcase}
                          title="Hiring Process"
                          description="From demo to matched engineers in under 48 hours."
                        />
                        <NavItem
                          href="/#faq"
                          icon={HelpCircle}
                          title="FAQ"
                          description="Common questions about hiring, vetting, and guarantees."
                        />
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Company */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      Company
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[520px] grid-cols-2 gap-1 p-3">
                        <NavItem
                          href="/about"
                          icon={Building2}
                          title="About Us"
                          description="Our mission, story, and the team behind OctogleHire."
                        />
                        <NavItem
                          href="/about#team"
                          icon={Users}
                          title="Team"
                          description="Meet the people who vet, match, and support your hires."
                        />
                        <NavItem
                          href="/blog"
                          icon={BookOpen}
                          title="Blog"
                          description="Insights on remote hiring, global teams, and engineering."
                        />
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
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
                    {/* Platform */}
                    <MobileGroup label="Platform">
                      <MobileLink href="/" icon={Building2} label="For Companies" />
                      <MobileLink href="/for-agencies" icon={Users} label="For Agencies" />
                      <MobileLink href="/apply" icon={Code2} label="For Developers" />
                      <MobileLink href="/marketplace" icon={Globe} label="Marketplace" />
                    </MobileGroup>

                    {/* How It Works */}
                    <MobileGroup label="How It Works">
                      <MobileLink href="/how-we-vet" icon={Shield} label="How We Vet" />
                      <MobileLink href="/#pricing" icon={DollarSign} label="Pricing" />
                      <MobileLink href="/#how-it-works" icon={Briefcase} label="Hiring Process" />
                      <MobileLink href="/#faq" icon={HelpCircle} label="FAQ" />
                    </MobileGroup>

                    {/* Company */}
                    <MobileGroup label="Company">
                      <MobileLink href="/about" icon={Building2} label="About Us" />
                      <MobileLink href="/about#team" icon={Users} label="Team" />
                      <MobileLink href="/blog" icon={BookOpen} label="Blog" />
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
