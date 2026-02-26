import Link from "next/link";
import { ArrowRight, Globe, Star, Users } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialsProps {
  className?: string;
}

const Testimonials = ({ className }: TestimonialsProps) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          {/* Bento grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* Featured testimonial — large, spans 2 cols + 2 rows */}
            <Card className="relative flex flex-col justify-between overflow-hidden md:col-span-2 md:row-span-2">
              <CardContent className="flex flex-1 flex-col justify-between p-8">
                <div>
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-pulse text-pulse"
                      />
                    ))}
                  </div>
                  <q className="text-xl font-medium leading-relaxed lg:text-2xl">
                    OctogleHire transformed how we build engineering teams. We
                    went from months of searching to having three senior
                    engineers onboarded in under two weeks. The quality of
                    candidates is exceptional.
                  </q>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <Avatar className="size-12 ring-2 ring-border">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face"
                      alt="Sarah Chen"
                    />
                  </Avatar>
                  <div>
                    <p className="font-semibold">Sarah Chen</p>
                    <p className="text-xs text-muted-foreground">
                      CTO, Nextera Technologies
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stat card — companies */}
            <Card className="flex flex-col items-center justify-center bg-[#000711] p-6 text-white dark:bg-card dark:text-card-foreground">
              <Users className="mb-3 size-8" strokeWidth={1.5} />
              <p className="text-4xl font-semibold">2,500+</p>
              <p className="mt-1 text-sm text-white/75 dark:text-card-foreground/70">
                Companies hiring globally
              </p>
            </Card>

            {/* Testimonial 2 */}
            <Card className="flex flex-col justify-between">
              <CardContent className="p-6">
                <q className="text-sm leading-relaxed text-foreground/80">
                  We scaled our backend team from 5 to 20 engineers in three
                  months. Every hire has been a perfect fit both technically
                  and culturally.
                </q>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar className="size-8 ring-1 ring-input">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                      alt="Marcus Rivera"
                    />
                  </Avatar>
                  <div className="text-xs">
                    <p className="font-medium">Marcus Rivera</p>
                    <p className="text-muted-foreground">
                      VP of Engineering, Cloudshift
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image card */}
            <Card className="overflow-hidden p-0 md:col-span-1">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="size-full object-cover"
                loading="lazy"
              />
            </Card>

            {/* Testimonial 3 */}
            <Card className="flex flex-col justify-between">
              <CardContent className="p-6">
                <q className="text-sm leading-relaxed text-foreground/80">
                  The compliance handling alone saved us thousands in legal
                  fees. Hiring across borders has never been this seamless.
                </q>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar className="size-8 ring-1 ring-input">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
                      alt="Priya Sharma"
                    />
                  </Avatar>
                  <div className="text-xs">
                    <p className="font-medium">Priya Sharma</p>
                    <p className="text-muted-foreground">
                      Head of People, Finova
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stat card — countries */}
            <Card className="flex flex-col items-center justify-center bg-muted p-6">
              <Globe className="mb-3 size-8 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-4xl font-semibold">150+</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Countries represented
              </p>
            </Card>

            {/* Testimonial 4 */}
            <Card className="flex flex-col justify-between">
              <CardContent className="p-6">
                <q className="text-sm leading-relaxed text-foreground/80">
                  The vetting process is incredible. Every developer
                  we&apos;ve hired through OctogleHire has exceeded our
                  expectations from day one.
                </q>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar className="size-8 ring-1 ring-input">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                      alt="James Okafor"
                    />
                  </Avatar>
                  <div className="text-xs">
                    <p className="font-medium">James Okafor</p>
                    <p className="text-muted-foreground">
                      CTO, DataPulse Analytics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA card — spans 2 cols */}
            <Card className="flex flex-col items-center justify-center bg-[#000711] p-8 text-white dark:bg-card dark:text-card-foreground md:col-span-2">
              <h3 className="text-center text-xl font-semibold">
                Ready to hire world-class engineers?
              </h3>
              <p className="mt-2 text-center text-sm text-white/75 dark:text-card-foreground/70">
                Join thousands of companies building with OctogleHire.
              </p>
              <Button
                variant="secondary"
                className="mt-5 gap-2 rounded-full"
                asChild
              >
                <Link href="/companies/signup">
                  Start Hiring
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Testimonials };
