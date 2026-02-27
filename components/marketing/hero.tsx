"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { ArrowRight } from "lucide-react";
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

const EXPENSIVE_MARKETS = new Set([
  "GB", "US", "CA", "DE", "FR", "NL", "IT", "AU",
]);

const hireFromCountries = REGIONAL_COUNTRIES.filter(
  (c) => !EXPENSIVE_MARKETS.has(c.isoCode),
);

const Hero = ({ className }: HeroProps) => {
  const allCountries = [...hireFromCountries, ...hireFromCountries];

  return (
    <section className={cn("pt-20 pb-0", className)}>
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
        <h1 className="mt-8 text-center text-5xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          World-Class Developers,
          <br />
          Fraction of the
          <br />
          <span className="text-pulse">Cost.</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-xl text-center text-base text-muted-foreground sm:text-lg">
          Access pre-vetted engineers from 30+ countries at up to 60% less
          than UK &amp; US rates. Build your dream team in days, not months.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-6">
            <a href="/companies/signup">
              Start Hiring
              <ArrowRight className="ml-2 size-4 -rotate-45" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-6">
            <a href="/marketplace">Browse Developers</a>
          </Button>
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
