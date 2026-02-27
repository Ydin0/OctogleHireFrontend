"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { REGIONAL_COUNTRIES, countryToSlug } from "@/lib/seo-data";

interface CountryStripProps {
  className?: string;
}

const EXPENSIVE_MARKETS = new Set([
  "GB", "US", "CA", "DE", "FR", "NL", "IT", "AU",
]);

const hireFromCountries = REGIONAL_COUNTRIES.filter(
  (c) => !EXPENSIVE_MARKETS.has(c.isoCode),
);

const CountryStrip = ({ className }: CountryStripProps) => {
  const allCountries = [...hireFromCountries, ...hireFromCountries];

  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-6 mb-8">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Global Talent
        </span>
        <h2 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          Hire from 30+ countries
        </h2>
      </div>

      <div className="relative">
        <Carousel
          plugins={[AutoScroll({ playOnInit: true, speed: 0.4 })]}
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

export { CountryStrip };
