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
import { OrbitingCircles } from "@/components/ui/orbiting-circles";

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  const circle1Images = [
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  ];

  const circle2Images = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
  ];

  const circle3Images = [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
  ];

  const logos = [
    {
      id: "logo-1",
      description: "Logo 1",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-2",
      description: "Logo 2",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-3",
      description: "Logo 3",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-4",
      description: "Logo 4",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-5",
      description: "Logo 5",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-6",
      description: "Logo 6",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
      className: "h-5 w-auto",
    },
    {
      id: "logo-7",
      description: "Logo 7",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-8",
      description: "Logo 8",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-7.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-1b",
      description: "Logo 1",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-2b",
      description: "Logo 2",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-3b",
      description: "Logo 3",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-4b",
      description: "Logo 4",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-5b",
      description: "Logo 5",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-6b",
      description: "Logo 6",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
      className: "h-5 w-auto",
    },
    {
      id: "logo-7b",
      description: "Logo 7",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-8b",
      description: "Logo 8",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-7.svg",
      className: "h-7 w-auto",
    },
  ];

  return (
    <section className={cn("pt-8 pb-16", className)}>
      <div className="container mx-auto px-6">
        {/* Orbiting circles with overlaid text */}
        <div className="relative">
          <div className="flex w-full items-center justify-center">
            {/* Center content overlay */}
            <div className="absolute z-99 flex h-full w-full flex-col items-center justify-center gap-4">
              <div className="pointer-events-none absolute inset-y-0 top-1/2 left-1/2 h-1/3 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-background blur-2xl"></div>

              <Button
                variant="secondary"
                className="group relative z-10 flex w-fit items-center justify-center gap-3 rounded-full bg-muted/70 px-5 py-1"
              >
                <span className="size-2.5 rounded-full bg-pulse" />
                <span className="text-xs">Now Hiring in 150+ Countries</span>
              </Button>

              <h1 className="relative z-10 max-w-3xl text-center text-5xl font-medium tracking-tight text-foreground md:text-7xl">
                Hire the World&apos;s Best <br /> <span className="text-pulse">Developers.</span>
              </h1>

              <p className="relative z-10 mt-3 max-w-xl text-center text-muted-foreground/80">
                Connect with pre-vetted, world-class engineers from 150+
                countries. Build your dream team in days, not months.
              </p>

              <div className="relative z-10 mt-4 flex gap-4">
                <Button
                  variant="secondary"
                  className="group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
                  asChild
                >
                  <a href="#how-it-works">
                    <span>See How It Works</span>
                    <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
                  </a>
                </Button>
                <Button
                  variant="default"
                  className="group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
                  asChild
                >
                  <a href="/companies/signup">
                    <span>Start Hiring</span>
                    <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Orbiting circles */}
            <div className="pointer-events-none relative z-0 flex h-[840px] w-full flex-col items-center justify-center overflow-x-clip">
              <OrbitingCircles iconSize={44} radius={180} speed={0.5}>
                {circle1Images.map((src, index) => (
                  <div
                    key={index}
                    className="size-11 overflow-hidden rounded-full"
                  >
                    <img
                      src={src}
                      className="size-full object-cover"
                      alt=""
                    />
                  </div>
                ))}
              </OrbitingCircles>
              <OrbitingCircles iconSize={44} radius={280} reverse speed={0.4}>
                {circle2Images.map((src, index) => (
                  <div
                    key={index}
                    className="size-11 overflow-hidden rounded-full"
                  >
                    <img
                      src={src}
                      className="size-full object-cover"
                      alt=""
                    />
                  </div>
                ))}
              </OrbitingCircles>
              <OrbitingCircles iconSize={44} radius={380} speed={0.3}>
                {circle3Images.map((src, index) => (
                  <div
                    key={index}
                    className="size-11 overflow-hidden rounded-full"
                  >
                    <img
                      src={src}
                      className="size-full object-cover"
                      alt=""
                    />
                  </div>
                ))}
              </OrbitingCircles>
            </div>
          </div>
        </div>

        {/* Logo carousel */}
        <div className="relative mx-auto mt-8 flex items-center justify-center">
          <Carousel
            plugins={[AutoScroll({ playOnInit: true })]}
            opts={{ loop: true, align: "start" }}
          >
            <CarouselContent className="ml-0">
              {logos.map((logo, index) => (
                <CarouselItem
                  key={index}
                  className="relative mr-6 flex h-15 basis-1/2 justify-center pl-0 opacity-30 sm:basis-1/4 md:basis-1/3 lg:basis-1/9"
                >
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={logo.className}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
