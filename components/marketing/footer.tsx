import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const sections = [
  {
    title: "Platform",
    links: [
      { name: "Marketplace", href: "/marketplace" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Pricing", href: "#pricing" },
      { name: "For Companies", href: "/companies/signup" },
      { name: "For Developers", href: "/apply" },
    ],
  },
  {
    title: "Hire by Technology",
    links: [
      { name: "React Developers", href: "/hire/react-developers" },
      { name: "Python Developers", href: "/hire/python-developers" },
      { name: "Node.js Developers", href: "/hire/node-js-developers" },
      { name: "TypeScript Developers", href: "/hire/typescript-developers" },
      { name: "Go Developers", href: "/hire/go-developers" },
      { name: "Java Developers", href: "/hire/java-developers" },
      { name: "Next.js Developers", href: "/hire/next-js-developers" },
      { name: "Angular Developers", href: "/hire/angular-developers" },
      { name: "AWS Developers", href: "/hire/aws-developers" },
      { name: "Flutter Developers", href: "/hire/flutter-developers" },
    ],
  },
  {
    title: "Hire by Country",
    links: [
      { name: "Developers in India", href: "/hire/developers-in/india" },
      { name: "Developers in Brazil", href: "/hire/developers-in/brazil" },
      { name: "Developers in Poland", href: "/hire/developers-in/poland" },
      { name: "Developers in Ukraine", href: "/hire/developers-in/ukraine" },
      { name: "Developers in Argentina", href: "/hire/developers-in/argentina" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "mailto:hello@octoglehire.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <section className={cn("", className)}>
      <div className="container mx-auto px-6">
        {/* CTA top block */}
        <div className="rounded-3xl border border-border bg-muted/30 p-10 md:p-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Get started
            </span>
            <h2 className="text-4xl font-medium tracking-tight lg:text-5xl">
              Don&apos;t hire
              <br />
              harder. Hire
              <br />
              <span className="text-pulse">smarter.</span>
            </h2>
            <p className="text-muted-foreground">
              OctogleHire helps you find pre-vetted global engineers, reduce
              hiring costs by up to 60%, and onboard in days — not months.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Button asChild size="lg" className="rounded-full gap-2">
              <a href="/companies/signup">
                Start Hiring
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <a href="/apply">Apply as a Developer</a>
            </Button>
          </div>
        </div>

        {/* Links row */}
        <footer className="pb-16">
          <Separator className="my-14" />
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row">
            <div className="max-w-xs space-y-4">
              <Link href="/">
                <Logo width={140} height={32} />
              </Link>
              <p className="text-sm text-muted-foreground">
                The global talent platform for pre-vetted developers from 30+
                countries. Build world-class engineering teams in days, not months.
              </p>
            </div>
            <div className="flex flex-wrap gap-12">
              {sections.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-10" />
          <p className="text-xs text-muted-foreground">
            OctogleHire 2026. All Rights Reserved.
          </p>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
