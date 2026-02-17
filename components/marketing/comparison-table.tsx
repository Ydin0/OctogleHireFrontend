import {
  CheckCircle,
  CircleMinus,
  Clock,
  DollarSign,
  Globe,
  Headset,
  Search,
  Shield,
  Users,
} from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ComparisonTableProps {
  className?: string;
}

const ComparisonTable = ({ className }: ComparisonTableProps) => {
  return (
    <section id="compare" className={cn("py-32", className)}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-4">
          <Badge
            variant="outline"
            className="font-mono uppercase tracking-[0.08em]"
          >
            Comparison
          </Badge>
          <h2 className="mx-auto max-w-2xl text-center text-4xl font-semibold tracking-tight lg:text-5xl">
            See how <span className="text-pulse">OctogleHire</span> compares
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            We combine the best of freelance marketplaces with the quality of
            elite talent networks — at a fraction of the cost.
          </p>
        </div>
        <div className="-mx-7 overflow-x-auto">
          <div className="mt-14 grid min-w-2xl grid-cols-4 [&_.text-sm]:font-mono [&_.text-sm]:uppercase [&_.text-sm]:tracking-[0.08em] [&_.text-xs]:font-mono [&_.text-xs]:uppercase [&_.text-xs]:tracking-[0.08em]">
            {/* Header row */}
            <div className="border-b border-border p-5"></div>
            <div className="flex flex-col items-center gap-2 border-b border-border p-5">
              <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-white p-1.5 shadow-xs dark:bg-card">
                <Image
                  src="https://cdn.simpleicons.org/freelancer"
                  alt="Freelancer logo"
                  width={30}
                  height={30}
                  unoptimized
                  className="size-full object-contain"
                />
              </div>
              <p className="text-lg font-semibold">Freelancer</p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Open marketplace
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-t-2xl border-b border-border bg-muted p-5">
              <div className="flex size-8 items-center justify-center">
                <Globe className="size-6 text-pulse" />
              </div>
              <p className="text-lg font-semibold">OctogleHire</p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Pre-vetted global talent
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 border-b border-border p-5">
              <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-white p-1.5 shadow-xs dark:bg-card">
                <Image
                  src="https://cdn.simpleicons.org/toptal"
                  alt="Toptal logo"
                  width={30}
                  height={30}
                  unoptimized
                  className="size-full object-contain"
                />
              </div>
              <p className="text-lg font-semibold">Toptal</p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Elite talent network
              </p>
            </div>

            {/* Vetting Process */}
            <div className="flex items-center gap-2 border-b border-border p-5">
              <Search className="size-4 shrink-0" />
              <span className="text-sm font-semibold">Vetting Process</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border p-5">
              <CircleMinus className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Self-reported profiles
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border bg-muted p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                Multi-stage technical vetting
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                Rigorous screening
              </span>
            </div>

            {/* Time to Hire */}
            <div className="flex items-center gap-2 border-b border-border p-5">
              <Clock className="size-4 shrink-0" />
              <span className="text-sm font-semibold">Time to Hire</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border p-5">
              <CircleMinus className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Weeks of filtering
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border bg-muted p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                48 hours average
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                1–3 weeks
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-2 border-b border-border p-5">
              <DollarSign className="size-4 shrink-0" />
              <span className="text-sm font-semibold">Pricing</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                Low rates, variable quality
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border bg-muted p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                Competitive & transparent
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border p-5">
              <CircleMinus className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Premium pricing
              </span>
            </div>

            {/* Global Talent */}
            <div className="flex items-center gap-2 border-b border-border p-5">
              <Users className="size-4 shrink-0" />
              <span className="text-sm font-semibold">Global Talent Pool</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                Large, unfiltered pool
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border bg-muted p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                50,000+ vetted in 150+ countries
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border p-5">
              <CircleMinus className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Smaller, selective pool
              </span>
            </div>

            {/* Compliance */}
            <div className="flex items-center gap-2 border-b border-border p-5">
              <Shield className="size-4 shrink-0" />
              <span className="text-sm font-semibold">Compliance & Payments</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border p-5">
              <CircleMinus className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                You handle everything
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border bg-muted p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                Fully managed globally
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-b border-border p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                Managed for you
              </span>
            </div>

            {/* Support */}
            <div className="flex items-center gap-2 border-border p-5">
              <Headset className="size-4 shrink-0" />
              <span className="text-sm font-semibold">Dedicated Support</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-5">
              <CircleMinus className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Community forums
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-border bg-muted p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                24/7 dedicated account manager
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-5">
              <CheckCircle className="size-5 text-pulse" />
              <span className="text-xs text-muted-foreground">
                Account manager
              </span>
            </div>

            {/* CTA row */}
            <div className="border-border p-5"></div>
            <div className="border-border p-5"></div>
            <div className="flex items-center justify-center gap-2 rounded-b-2xl border-border bg-muted p-5">
              <Button asChild className="w-full">
                <a href="/companies/signup">Start Hiring with OctogleHire</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ComparisonTable };
