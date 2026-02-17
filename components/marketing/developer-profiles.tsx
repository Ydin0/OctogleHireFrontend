"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { developers } from "@/lib/data/developers";
import { DeveloperSearchCard } from "@/app/developers/_components/developer-search-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface DeveloperProfilesProps {
  className?: string;
}

const DeveloperProfiles = ({ className }: DeveloperProfilesProps) => {
  const topDevelopers = developers.slice(0, 8);

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="mb-2 text-4xl font-semibold tracking-tight lg:text-5xl">
            Meet Our <span className="text-pulse">Top Developers</span>
          </h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Browse pre-vetted engineers ready to join your team. Transparent
            rates — hire hourly, weekly, or monthly.
          </p>
        </div>
      </div>

      {/* Full-width carousel with edge fades */}
      <div className="relative">
        <Carousel
          plugins={[AutoScroll({ playOnInit: true, speed: 0.8 })]}
          opts={{ loop: true, align: "start" }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {[...topDevelopers, ...topDevelopers].map((dev, index) => (
              <CarouselItem
                key={`${dev.id}-${index}`}
                className="basis-[85%] pl-4 sm:basis-[45%] md:basis-[35%] lg:basis-[28%] xl:basis-[22%]"
              >
                <DeveloperSearchCard developer={dev} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      <div className="container mx-auto mt-10 flex justify-center px-6">
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/developers">
            Browse All Developers
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export { DeveloperProfiles };
