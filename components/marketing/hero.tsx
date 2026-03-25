"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { REGIONAL_COUNTRIES, countryToSlug } from "@/lib/seo-data";

interface HeroProps {
  className?: string;
}

const EXCLUDED = new Set([
  "GB", "US", "CA", "DE", "FR", "NL", "IT", "AU",
  "ET", "KE", "NG", "GH", "TZ", "UG",
]);

const hireFromCountries = (() => {
  const filtered = REGIONAL_COUNTRIES.filter(
    (c) => !EXCLUDED.has(c.isoCode),
  );
  const india = filtered.find((c) => c.isoCode === "IN");
  const rest = filtered.filter((c) => c.isoCode !== "IN");
  if (!india) return rest;
  const mid = Math.floor(rest.length / 2);
  return [...rest.slice(0, mid), india, ...rest.slice(mid)];
})();

const badges = [
  { src: "/security/ISO copy.png", alt: "ISO 27001 Certified", href: "https://www.iafcertsearch.org/certified-entity/YgnCzSQq4p76plJ5hUNVNd5C" },
  { src: "/security/GDPR copy.png", alt: "GDPR Compliant", href: undefined },
  { src: "/security/CCPA copy.png", alt: "CCPA Compliant", href: undefined },
];

const Hero = ({ className }: HeroProps) => {
  const allCountries = [...hireFromCountries, ...hireFromCountries];

  return (
    <section className={cn("pt-24 pb-0 lg:pt-32", className)}>
      <div className="container mx-auto px-6">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5">
            <span className="size-2 rounded-full bg-pulse animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Introducing OctogleHire
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mt-10 text-center text-5xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          World-Class Developers,
          <br />
          Fraction of the
          <br />
          <span className="text-pulse">Cost.</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-xl text-center text-base text-muted-foreground sm:text-lg">
          OctogleHire delivers pre-vetted engineers from 30+ countries
          at 40–60% below US/UK rates. Receive 3–5 curated profiles within 48
          hours — no recruitment fees, no long-term lock-in.
        </p>

        {/* CTAs + Badges row */}
        <div className="mt-10 flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-12">
          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <a href="/companies/signup">
                Start Hiring
                <ArrowRight className="ml-2 size-4 -rotate-45" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
              <a href="/get-started?demo=true">
                Book a Demo
              </a>
            </Button>
          </div>

          {/* Divider (desktop only) */}
          <div className="hidden lg:block h-10 w-px bg-border" />

          {/* Certification badges */}
          <div className="flex items-center gap-4">
            {badges.map((badge) =>
              badge.href ? (
                <a key={badge.alt} href={badge.href} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    width={80}
                    height={80}
                    className="h-10 w-auto invert dark:invert-0 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </a>
              ) : (
                <Image
                  key={badge.alt}
                  src={badge.src}
                  alt={badge.alt}
                  width={80}
                  height={80}
                  className="h-10 w-auto invert dark:invert-0 opacity-60 hover:opacity-100 transition-opacity"
                />
              )
            )}
          </div>
        </div>

        {/* Hire from 30+ countries */}
        <p className="mt-16 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Hire from 30+ countries
        </p>
      </div>

      {/* Country flag carousel — full width */}
      <div className="relative mt-6 pb-20">
        <Carousel
          plugins={[AutoScroll({ playOnInit: true, speed: 0.4, stopOnInteraction: false })]}
          opts={{ loop: true, align: "start" }}
        >
          <CarouselContent className="ml-0">
            {allCountries.map((country, i) => (
              <CarouselItem
                key={`${country.isoCode}-${i}`}
                className="basis-1/4 pl-0 pr-4 sm:basis-1/5 md:basis-1/6 lg:basis-1/8 xl:basis-1/10"
              >
                <Link
                  href={`/hire/developers-in/${countryToSlug(country.name)}`}
                  className="flex flex-col items-center gap-2 group"
                >
                  <img
                    src={`https://flagcdn.com/w40/${country.isoCode.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w80/${country.isoCode.toLowerCase()}.png 2x`}
                    alt={country.name}
                    className="h-8 w-auto rounded-sm shadow-sm transition-transform group-hover:scale-110"
                    width={40}
                    height={27}
                  />
                  <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                    {country.name}
                  </span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent" />
      </div>
    </section>
  );
};

export { Hero };
