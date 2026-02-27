"use client";

import { useEffect, useState } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { developers as staticDevelopers, type Developer } from "@/lib/data/developers";
import { fetchPublicDevelopers } from "@/lib/api/public-developers";
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
  const [topDevelopers, setTopDevelopers] = useState<Developer[]>(
    staticDevelopers.slice(0, 8),
  );

  useEffect(() => {
    const load = async () => {
      const result = await fetchPublicDevelopers({ featured: true, limit: 8 });
      if (result && result.developers.length > 0) {
        setTopDevelopers(result.developers);
      }
    };
    load();
  }, []);

  return (
    <section className={cn("py-24", className)}>
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              The Network
            </span>
            <h2 className="text-4xl font-medium tracking-tight lg:text-5xl">
              Meet our top developers
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Browse pre-vetted Indian engineers ready to join your team.
              Transparent rates — hire hourly, weekly, or monthly.
            </p>
          </div>
          <Button variant="outline" className="gap-2 rounded-full shrink-0" asChild>
            <Link href="/marketplace">
              Browse All Developers
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Full-width auto-scroll carousel with edge fades */}
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
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background to-transparent" />
      </div>
    </section>
  );
};

export { DeveloperProfiles };
