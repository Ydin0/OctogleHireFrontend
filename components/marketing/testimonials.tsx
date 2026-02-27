"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TestimonialsProps {
  className?: string;
}

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO",
    company: "Nextera Technologies",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    quote:
      "OctogleHire transformed how we build engineering teams. We went from months of searching to having three senior engineers fully onboarded in under two weeks. The quality of candidates is exceptional.",
    tags: ["SaaS", "Series B", "Product", "Growth"],
    stat: { value: "3x", label: "faster time to hire" },
  },
  {
    name: "Marcus Rivera",
    role: "VP of Engineering",
    company: "Cloudshift",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    quote:
      "We scaled our backend team from 5 to 20 engineers in three months. Every hire has been a perfect fit both technically and culturally. OctogleHire made remote hiring completely painless.",
    tags: ["Scale-up", "Engineering", "Remote", "Backend"],
    stat: { value: "15", label: "engineers hired" },
  },
  {
    name: "Priya Sharma",
    role: "Head of People",
    company: "Finova",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    quote:
      "The compliance handling alone saved us thousands in legal fees. Hiring across borders has never been this seamless — contracts, payroll, taxes all fully managed. I couldn't recommend it more.",
    tags: ["Fintech", "Global Team", "Compliance", "Startup"],
    stat: { value: "60%", label: "lower hiring costs" },
  },
  {
    name: "James Okafor",
    role: "CTO",
    company: "DataPulse Analytics",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    quote:
      "The vetting process is genuinely incredible. Every developer we've hired through OctogleHire has exceeded expectations from day one. The 48-hour turnaround time is real — and it changes everything.",
    tags: ["Data", "AI / ML", "Enterprise", "Series A"],
    stat: { value: "48h", label: "average match time" },
  },
];

const Testimonials = ({ className }: TestimonialsProps) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animKey, setAnimKey] = useState(0);

  const go = (dir: "left" | "right") => {
    setDirection(dir);
    setAnimKey((k) => k + 1);
    setIndex((i) =>
      dir === "right"
        ? (i + 1) % testimonials.length
        : (i - 1 + testimonials.length) % testimonials.length,
    );
  };

  const t = testimonials[index];

  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mb-12 flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Testimonials
        </span>
        <h2 className="text-4xl font-medium tracking-tight lg:text-5xl">
          You&apos;re in good company.
        </h2>
        <p className="text-muted-foreground">You don&apos;t have to trust our word.</p>
      </div>

      {/* Carousel */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Left arrow */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => go("left")}
          className="rounded-full size-11 shrink-0"
          aria-label="Previous testimonial"
        >
          <ArrowLeft className="size-4" />
        </Button>

        {/* Card */}
        <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-card">
          <div
            key={animKey}
            className={cn(
              "grid grid-cols-1 md:grid-cols-[180px_1fr] animate-in duration-300",
              direction === "right"
                ? "fade-in slide-in-from-right-4"
                : "fade-in slide-in-from-left-4",
            )}
          >
            {/* Left column — category tags */}
            <div className="border-b border-border md:border-b-0 md:border-r p-6 flex flex-col gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Company type
              </p>
              <div className="flex flex-wrap gap-2 md:flex-col md:flex-nowrap">
                {t.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full text-[11px] w-fit"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Stat */}
              <div className="mt-auto pt-4 border-t border-border hidden md:block">
                <p className="font-mono text-3xl font-semibold">{t.stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.stat.label}</p>
              </div>
            </div>

            {/* Right column — quote + author */}
            <div className="p-6 md:p-8 flex flex-col gap-6 justify-between">
              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="size-12 ring-2 ring-border shrink-0">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback>{t.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-xl font-medium leading-relaxed lg:text-2xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Mobile stat */}
              <div className="flex items-center justify-between md:hidden pt-4 border-t border-border">
                <div>
                  <p className="font-mono text-2xl font-semibold">{t.stat.value}</p>
                  <p className="text-xs text-muted-foreground">{t.stat.label}</p>
                </div>
                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > index ? "right" : "left");
                        setAnimKey((k) => k + 1);
                        setIndex(i);
                      }}
                      className={cn(
                        "size-1.5 rounded-full transition-all duration-200",
                        i === index ? "bg-foreground w-4" : "bg-border",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right arrow */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => go("right")}
          className="rounded-full size-11 shrink-0"
          aria-label="Next testimonial"
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Dot indicators — desktop */}
      <div className="mt-6 hidden md:flex items-center justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? "right" : "left");
              setAnimKey((k) => k + 1);
              setIndex(i);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "bg-foreground w-6" : "bg-border w-1.5",
            )}
          />
        ))}
      </div>
    </section>
  );
};

export { Testimonials };
