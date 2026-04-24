"use client";

import { motion } from "framer-motion";

import { SlideShell } from "../_components/slide-shell";
import { VettingPipeline } from "@/components/marketing/how-it-works";

export const VettingSlide = () => {
  return (
    <SlideShell eyebrow="How we vet">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:items-center">
        {/* Left: headline + context */}
        <div className="space-y-8">
          <div className="space-y-5">
            <h2 className="text-4xl font-medium tracking-tight leading-[1.05] md:text-5xl xl:text-6xl">
              Only{" "}
              <span className="font-mono text-pulse">1 in 25</span>
              <br />
              make it through.
            </h2>
            <p className="text-base text-muted-foreground md:text-lg leading-relaxed max-w-xl">
              Every engineer passes four stages before they ever reach your
              shortlist. Take-homes and vibe checks don&apos;t make the cut.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-y border-border py-5">
            <div>
              <p className="font-mono text-2xl font-semibold tabular-nums md:text-3xl">
                25K+
              </p>
              <p className="text-xs text-muted-foreground">Reviewed</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-semibold tabular-nums md:text-3xl">
                1,000
              </p>
              <p className="text-xs text-muted-foreground">Accepted</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-semibold tabular-nums text-pulse md:text-3xl">
                4%
              </p>
              <p className="text-xs text-muted-foreground">Pass rate</p>
            </div>
          </div>

          <ul className="space-y-3 text-sm">
            {[
              "HR + English fluency screen before any technical stage",
              "30–50 min AI-led technical interview, tuned to the CV",
              "Face-to-face with one of our senior tech leads",
              "Background verification, ID, and 3 professional references",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-pulse" />
                <span className="text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: embedded pipeline */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <VettingPipeline />
        </motion.div>
      </div>
    </SlideShell>
  );
};
