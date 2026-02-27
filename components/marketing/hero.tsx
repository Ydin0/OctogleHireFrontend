"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { ArrowRight } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface HeroProps {
  className?: string;
}

const logos = [
  { id: "l1", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg", h: "h-6" },
  { id: "l2", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg", h: "h-6" },
  { id: "l3", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg", h: "h-6" },
  { id: "l4", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg", h: "h-6" },
  { id: "l5", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg", h: "h-5" },
  { id: "l6", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg", h: "h-6" },
  { id: "l7", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-7.svg", h: "h-6" },
  { id: "l8", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg", h: "h-6" },
];

const Hero = ({ className }: HeroProps) => {
  const allLogos = [...logos, ...logos];

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
          India&apos;s Best
          <br />
          Developers,
          <br />
          <span className="text-pulse">Verified.</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-xl text-center text-base text-muted-foreground sm:text-lg">
          Connect with pre-vetted, world-class Indian engineers from every
          specialisation. Build your dream team in days, not months — at a
          fraction of the cost.
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

        {/* Trusted by */}
        <p className="mt-16 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Trusted by teams at
        </p>
      </div>

      {/* Logo carousel — full width */}
      <div className="relative mt-6 pb-20">
        <Carousel
          plugins={[AutoScroll({ playOnInit: true, speed: 0.6 })]}
          opts={{ loop: true, align: "start" }}
        >
          <CarouselContent className="ml-0">
            {allLogos.map((logo, i) => (
              <CarouselItem
                key={`${logo.id}-${i}`}
                className="basis-1/3 pl-0 pr-10 sm:basis-1/4 md:basis-1/5 lg:basis-1/7 xl:basis-1/8"
              >
                <div className="flex h-12 items-center justify-center opacity-30">
                  <img
                    src={logo.src}
                    alt=""
                    className={cn("w-auto", logo.h)}
                  />
                </div>
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
