"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface HeroProps {
  className?: string;
}

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

/* ─── Real client logos (from /public/company-logos) ──────────────────────── */

const logos = [
  { name: "Beekey",       src: "/company-logos/Beekey.svg",            h: "h-6" },
  { name: "Hireflow",     src: "/company-logos/Hireflow.svg",          h: "h-5" },
  { name: "Corpwise",     src: "/company-logos/Corpwise.svg",          h: "h-6" },
  { name: "Solidus",      src: "/company-logos/Solidus.svg",           h: "h-6" },
  { name: "SquareLogik",  src: "/company-logos/SquareLogik.svg",       h: "h-6" },
  { name: "Unichats",     src: "/company-logos/Unichats.svg",          h: "h-6" },
  { name: "DNO",          src: "/company-logos/DNO%20Investments.svg", h: "h-6" },
  { name: "The Care App", src: "/company-logos/thecareapp.svg",        h: "h-6" },
  { name: "ArtistaTours", src: "/company-logos/ArtistaTours.svg",      h: "h-6" },
  { name: "Workchats",    src: "/company-logos/Workchats.svg",         h: "h-6" },
];

/* ─── Featured developer profiles (use public/featured-developers/XX.png) ── */

type Profile = {
  image: string;
  name: string;
  role: string;
  location: string;
  flag: string; // ISO code
  stacks: string[];
  rate: string;
  available: boolean;
  aiCertified: boolean;
};

const profiles: Profile[] = [
  { image: "/featured-developers/01.png", name: "Priya Sharma",     role: "Senior Full-Stack",  location: "Bengaluru",  flag: "IN", stacks: ["react", "typescript", "ai"],          rate: "$65/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/02.png", name: "Arjun Kumar",      role: "Backend Engineer",   location: "Mumbai",     flag: "IN", stacks: ["python", "postgresql", "ai"],         rate: "$60/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/03.png", name: "Ananya Reddy",     role: "Frontend Engineer",  location: "Hyderabad",  flag: "IN", stacks: ["vuejs", "typescript", "tailwindcss"], rate: "$50/hr", available: false, aiCertified: true },
  { image: "/featured-developers/04.png", name: "Rohan Mehta",      role: "Platform Engineer",  location: "Pune",       flag: "IN", stacks: ["go", "kubernetes", "aws"],            rate: "$70/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/05.png", name: "Vikram Iyer",      role: "AI / ML Engineer",   location: "Chennai",    flag: "IN", stacks: ["python", "pytorch", "ai"],            rate: "$75/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/06.png", name: "Aryan Gupta",      role: "DevOps Engineer",    location: "New Delhi",  flag: "IN", stacks: ["aws", "docker", "kubernetes"],        rate: "$68/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/07.png", name: "Karthik Nair",     role: "Full-Stack",         location: "Bengaluru",  flag: "IN", stacks: ["nextjs", "typescript", "ai"],         rate: "$58/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/08.png", name: "Ayesha Khan",      role: "Senior Backend",     location: "Lucknow",    flag: "IN", stacks: ["go", "postgresql", "ai"],             rate: "$72/hr", available: false, aiCertified: true },
  { image: "/featured-developers/09.png", name: "Rahul Joshi",      role: "Mobile Engineer",    location: "Ahmedabad",  flag: "IN", stacks: ["flutter", "typescript"],              rate: "$55/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/10.png", name: "Meera Pillai",     role: "Backend Engineer",   location: "Kochi",      flag: "IN", stacks: ["java", "spring", "aws"],              rate: "$48/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/11.png", name: "Siddharth Rao",    role: "Frontend Engineer",  location: "Hyderabad",  flag: "IN", stacks: ["react", "typescript", "tailwindcss"], rate: "$45/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/12.png", name: "Divya Menon",      role: "Data Engineer",      location: "Chennai",    flag: "IN", stacks: ["python", "ai", "postgresql"],         rate: "$62/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/13.png", name: "Neha Tiwari",      role: "ML Engineer",        location: "New Delhi",  flag: "IN", stacks: ["typescript", "nextjs", "postgresql"], rate: "$78/hr", available: false, aiCertified: true },
  { image: "/featured-developers/14.png", name: "Kavya Patel",      role: "Product Engineer",   location: "Ahmedabad",  flag: "IN", stacks: ["react", "nodejs", "ai"],              rate: "$52/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/15.png", name: "Aditya Desai",     role: "Staff Engineer",     location: "Mumbai",     flag: "IN", stacks: ["go", "kubernetes", "ai"],             rate: "$85/hr", available: true,  aiCertified: true },
  { image: "/featured-developers/16.png", name: "Ishaan Verma",     role: "Backend Engineer",   location: "Pune",       flag: "IN", stacks: ["python", "pytorch", "ai"],            rate: "$58/hr", available: true,  aiCertified: true },
];

const STACK_ICON: Record<string, string> = {
  react:        `${DEVICON}/react/react-original.svg`,
  typescript:   `${DEVICON}/typescript/typescript-original.svg`,
  python:       `${DEVICON}/python/python-original.svg`,
  postgresql:   `${DEVICON}/postgresql/postgresql-original.svg`,
  tailwindcss:  `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
  go:           `${DEVICON}/go/go-original-wordmark.svg`,
  kubernetes:   `${DEVICON}/kubernetes/kubernetes-original.svg`,
  aws:          `${DEVICON}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
  docker:       `${DEVICON}/docker/docker-original.svg`,
  vuejs:        `${DEVICON}/vuejs/vuejs-original.svg`,
  nodejs:       `${DEVICON}/nodejs/nodejs-original.svg`,
  flutter:      `${DEVICON}/flutter/flutter-original.svg`,
  pytorch:      `${DEVICON}/pytorch/pytorch-original.svg`,
  nextjs:       `${DEVICON}/nextjs/nextjs-original.svg`,
  java:         `${DEVICON}/java/java-original.svg`,
  spring:       `${DEVICON}/spring/spring-original.svg`,
};

/* ─── Profile card (marketplace-style) ────────────────────────────────────── */

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="group/card flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 ease-out hover:scale-[1.02] hover:border-pulse/40 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)]">
      {/* Photo — top portion */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.image}
          alt={profile.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-110"
        />

        {/* Availability badge — top-left */}
        {profile.available && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 backdrop-blur-md">
            <span className="relative inline-flex">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span className="absolute inset-0 size-1.5 rounded-full bg-emerald-400 animate-ping opacity-60" />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-white">
              Available
            </span>
          </div>
        )}

        {/* AI certified badge — top-right */}
        {profile.aiCertified && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 backdrop-blur-md">
            <span className="relative inline-flex">
              <span className="size-1.5 rounded-full bg-pulse" />
              <span className="absolute inset-0 size-1.5 rounded-full bg-pulse animate-ping opacity-60" />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-white">
              AI Native
            </span>
          </div>
        )}

        {/* Country flag — bottom-left */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 backdrop-blur-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://flagcdn.com/w20/${profile.flag.toLowerCase()}.png`}
            alt={profile.location}
            className="h-2.5 w-auto rounded-[2px]"
          />
          <span className="text-[10px] text-white/90">{profile.location}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2.5 p-4 text-left">
        {/* Name + role */}
        <div>
          <p className="truncate text-sm font-semibold text-foreground">
            {profile.name}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-pulse">
            <MapPin className="size-3" />
            {profile.role}
          </div>
        </div>

        {/* Stack chips — fixed min-height so 2-chip and 3-chip cards are uniform */}
        <div className="flex flex-wrap content-start gap-1.5 min-h-[46px]">
          {profile.stacks.map((s) =>
            s === "ai" ? null : STACK_ICON[s] ? (
              <Badge
                key={s}
                variant="secondary"
                className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-normal text-muted-foreground"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={STACK_ICON[s]} alt="" className="mr-1 size-3" />
                {s[0].toUpperCase() + s.slice(1)}
              </Badge>
            ) : null,
          )}
        </div>

        {/* Rate + CTA */}
        <div className="mt-1 flex items-center justify-between border-t border-border pt-2.5">
          <span className="font-mono text-sm font-semibold text-foreground">
            {profile.rate}
          </span>
          <span className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all duration-300 group-hover/card:border-pulse group-hover/card:bg-pulse group-hover/card:text-pulse-foreground">
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/card:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */

const Hero = ({ className }: HeroProps) => {
  return (
    <section className={cn("relative pt-20 pb-0", className)}>
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-6 text-center">
        {/* Eyebrow pill */}
        <Link
          href="/marketplace"
          className="group inline-flex w-fit items-center gap-2.5 rounded-full border border-border bg-muted/70 px-4 py-1.5 transition-colors hover:bg-muted"
        >
          <span className="relative inline-flex">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="absolute inset-0 size-2 rounded-full bg-emerald-500 animate-ping opacity-60" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-foreground/80">
            Live now · 1,000+ engineers active
          </span>
          <ArrowRight className="size-3.5 text-foreground/50 transition group-hover:translate-x-0.5 group-hover:text-foreground" />
        </Link>

        {/* Headline */}
        <h1 className="mt-3 max-w-4xl text-balance text-5xl font-medium tracking-tight text-foreground md:text-6xl lg:text-7xl xl:text-[5.25rem]">
          <span className="text-pulse">AI Native</span> Engineers.
          <br />
          <span className="font-mono">40–60%</span> Lower Cost.
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-3 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
          Pre-vetted. AI-fluent. Delivered from 30+ countries in{" "}
          <span className="font-mono text-foreground">48 hours</span>. No
          recruitment fees, no long-term lock-in.
        </p>

        {/* CTAs */}
        <div className="mt-6 flex items-center gap-3">
          <Button asChild size="lg" className="rounded-full px-6">
            <a href="/companies/signup">
              Start Hiring
              <ArrowRight className="ml-2 size-4 -rotate-45 transition-transform group-hover:rotate-0" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-6">
            <a href="/how-we-vet#ai-playbook">See AI Playbook</a>
          </Button>
        </div>

        {/* Trust badges — ISO / GDPR / CCPA */}
        <div className="mt-6 flex items-center gap-5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Certified
          </span>
          <div className="h-3 w-px bg-border" />
          <a
            href="https://www.iafcertsearch.org/certified-entity/YgnCzSQq4p76plJ5hUNVNd5C"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ISO 27001 Certified"
          >
            <Image
              src="/security/ISO copy.png"
              alt="ISO 27001"
              width={120}
              height={120}
              className="h-10 w-auto opacity-60 brightness-0 transition-opacity hover:opacity-90 dark:brightness-200 dark:opacity-80 dark:hover:opacity-100"
            />
          </a>
          <Image
            src="/security/GDPR copy.png"
            alt="GDPR Compliant"
            width={120}
            height={120}
            className="h-10 w-auto opacity-60 brightness-0 dark:brightness-200 dark:opacity-80"
          />
          <Image
            src="/security/CCPA copy.png"
            alt="CCPA Compliant"
            width={120}
            height={120}
            className="h-10 w-auto opacity-60 brightness-0 dark:brightness-200 dark:opacity-80"
          />
        </div>

        {/* Logo strip — auto-scrolling */}
        <div className="relative mt-12 w-full">
          <Carousel
            plugins={[AutoScroll({ playOnInit: true, speed: 0.3, stopOnInteraction: false })]}
            opts={{ loop: true, align: "start" }}
          >
            <CarouselContent className="ml-0">
              {[...logos, ...logos].map((logo, i) => (
                <CarouselItem
                  key={`${logo.name}-${i}`}
                  className="mr-20 flex basis-auto items-center justify-center pl-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className={cn(
                      logo.h,
                      "w-auto brightness-0 opacity-60 transition-opacity hover:opacity-90 dark:brightness-100 dark:opacity-70 dark:hover:opacity-100",
                    )}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent" />
        </div>

        {/* Profile card carousel */}
        <div className="relative mx-auto mt-6 flex w-full items-center justify-center pb-16">
          <Carousel
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
            opts={{ loop: true, align: "start" }}
            className="w-full"
          >
            <CarouselContent>
              {profiles.map((p, i) => (
                <CarouselItem
                  key={`${p.name}-${i}`}
                  className="basis-4/5 pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="py-4">
                    <ProfileCard profile={p} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
};

export { Hero };
