"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DeveloperSpecializationsProps {
  className?: string;
}

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const techStack = [
  { label: "JavaScript", logo: `${DEVICON}/javascript/javascript-original.svg` },
  { label: "TypeScript", logo: `${DEVICON}/typescript/typescript-original.svg` },
  { label: "Python", logo: `${DEVICON}/python/python-original.svg` },
  { label: "Go", logo: `${DEVICON}/go/go-original-wordmark.svg` },
  { label: "Rust", logo: `${DEVICON}/rust/rust-original.svg` },
  { label: "React", logo: `${DEVICON}/react/react-original.svg` },
  { label: "Node.js", logo: `${DEVICON}/nodejs/nodejs-original.svg` },
  { label: "Next.js", logo: `${DEVICON}/nextjs/nextjs-original.svg` },
  { label: "Vue.js", logo: `${DEVICON}/vuejs/vuejs-original.svg` },
  { label: "Swift", logo: `${DEVICON}/swift/swift-original.svg` },
  { label: "Kotlin", logo: `${DEVICON}/kotlin/kotlin-original.svg` },
  { label: "AWS", logo: `${DEVICON}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
  { label: "Docker", logo: `${DEVICON}/docker/docker-original.svg` },
  { label: "Kubernetes", logo: `${DEVICON}/kubernetes/kubernetes-original.svg` },
  { label: "PostgreSQL", logo: `${DEVICON}/postgresql/postgresql-original.svg` },
  { label: "MongoDB", logo: `${DEVICON}/mongodb/mongodb-original.svg` },
  { label: "GraphQL", logo: `${DEVICON}/graphql/graphql-plain.svg` },
  { label: "Terraform", logo: `${DEVICON}/terraform/terraform-original.svg` },
  { label: "Firebase", logo: `${DEVICON}/firebase/firebase-original.svg` },
  { label: "Flutter", logo: `${DEVICON}/flutter/flutter-original.svg` },
];

const accordionItems = [
  {
    id: "frontend",
    label: "Frontend Engineering",
    skills: ["React", "Vue.js", "TypeScript", "Next.js"],
    description:
      "Expert UI engineers who build fast, accessible, and pixel-perfect interfaces. Specialists in React, Vue, and modern CSS — covering everything from design systems to complex state management.",
  },
  {
    id: "backend",
    label: "Backend & API Engineering",
    skills: ["Node.js", "Python", "Go", "PostgreSQL"],
    description:
      "Architects and engineers who build scalable APIs, microservices, and distributed systems. Deep expertise in database design, caching strategies, and cloud infrastructure.",
  },
  {
    id: "mobile",
    label: "Mobile Engineering",
    skills: ["React Native", "Flutter", "Swift", "Kotlin"],
    description:
      "Cross-platform and native mobile developers who deliver polished apps for iOS and Android. Specialists in performance optimisation, offline capabilities, and app store deployment.",
  },
  {
    id: "devops",
    label: "DevOps & Cloud",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
    description:
      "Cloud engineers who design and automate infrastructure at scale. From Kubernetes clusters to CI/CD pipelines — they keep your systems reliable, secure, and cost-efficient.",
  },
  {
    id: "aiml",
    label: "AI / Machine Learning",
    skills: ["Python", "PyTorch", "TensorFlow", "MLOps"],
    description:
      "ML engineers and AI researchers who build production-grade models, LLM integrations, and intelligent data pipelines. Ready to take your AI features from prototype to scale.",
  },
];

const DeveloperSpecializations = ({ className }: DeveloperSpecializationsProps) => {
  const [open, setOpen] = useState<string | null>("frontend");
  const allTech = [...techStack, ...techStack, ...techStack];

  return (
    <section className={cn("py-24 bg-muted/20", className)}>
      {/* Scrolling tech logos */}
      <div className="relative overflow-hidden border-y border-border py-4">
        <div
          className="flex items-center gap-10 animate-scroll-x"
          style={{ width: "max-content" }}
        >
          {allTech.map((t, i) => (
            <div
              key={`${t.label}-${i}`}
              className="flex items-center gap-2.5 whitespace-nowrap"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.logo}
                alt={t.label}
                className="size-5 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-sm font-mono uppercase tracking-[0.06em] text-muted-foreground">
                {t.label}
              </span>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-muted/20 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-muted/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 mt-20">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Specialisations
          </span>
          <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
            Built for every stack.
            Across every industry.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: Accordion with smooth animation */}
          <div className="border-t border-border">
            {accordionItems.map((item) => {
              const isOpen = open === item.id;
              return (
                <div key={item.id} className="border-b border-border">
                  <button
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between py-5 text-left"
                  >
                    <span className="text-base font-medium">{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground shrink-0 transition-transform duration-300",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {/* Smooth height animation via CSS grid trick */}
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-5 space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.skills.map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="gap-1.5 text-[11px]"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`${DEVICON}/${s.toLowerCase().replace(/\./g, "").replace(/\s/g, "")}/${s.toLowerCase().replace(/\./g, "").replace(/\s/g, "")}-original.svg`}
                                alt=""
                                className="size-3"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: stat cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-background p-6 space-y-1">
              <p className="font-mono text-4xl font-semibold">1,000+</p>
              <p className="text-sm text-muted-foreground">Vetted developers</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 space-y-1">
              <p className="font-mono text-4xl font-semibold">Top 3%</p>
              <p className="text-sm text-muted-foreground">Acceptance rate</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 space-y-1">
              <p className="font-mono text-4xl font-semibold">20+</p>
              <p className="text-sm text-muted-foreground">Tech specialisations</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 space-y-1">
              <p className="font-mono text-4xl font-semibold">48h</p>
              <p className="text-sm text-muted-foreground">Average match time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { DeveloperSpecializations };
