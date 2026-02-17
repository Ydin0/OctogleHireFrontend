import Link from "next/link";
import { Globe } from "lucide-react";

import { cn } from "@/lib/utils";

import { Globe as GlobeViz } from "@/components/ui/globe";
import { Separator } from "@/components/ui/separator";

const sections = [
  {
    title: "Platform",
    links: [
      { name: "How It Works", href: "#how-it-works" },
      { name: "Pricing", href: "#" },
      { name: "For Companies", href: "/companies/signup" },
      { name: "For Developers", href: "/developers/join" },
      { name: "Assessments", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Press", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
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
        <footer>
          <Separator className="my-14" />
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="lg:max-w-md">
              <div className="flex items-center justify-start gap-2">
                <Link href="/" className="flex items-center gap-2">
                  <Globe className="size-6" />
                  <h2 className="text-xl font-semibold tracking-tight">
                    OctogleHire
                  </h2>
                </Link>
              </div>
              <p className="mt-4 text-left text-sm text-muted-foreground">
                The global talent platform connecting companies with pre-vetted,
                world-class developers from 150+ countries. Build your dream
                engineering team in days, not months.
              </p>
            </div>
            <div className="mt-8 flex w-full flex-wrap justify-between gap-12 lg:mt-0 lg:w-fit">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="mb-4">
                  <h3 className="mb-4 text-xs font-mono uppercase tracking-[0.08em]">
                    {section.title}
                  </h3>
                  <ul className="space-y-2 text-sm font-mono uppercase tracking-[0.08em] text-muted-foreground">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx} className="hover:text-primary">
                        <a href={link.href}>{link.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-4 h-56 overflow-hidden lg:h-[22rem]">
            <GlobeViz className="absolute top-[4.75rem] md:top-20 md:scale-[1.2] lg:top-24 lg:scale-[1.4]" />
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
