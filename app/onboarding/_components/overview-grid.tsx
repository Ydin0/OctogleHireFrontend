"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { SlideMeta } from "./presentation";

interface OverviewGridProps {
  slides: SlideMeta[];
  activeIndex: number;
  onSelect: (i: number) => void;
  onClose: () => void;
}

export const OverviewGrid = ({
  slides,
  activeIndex,
  onSelect,
  onClose,
}: OverviewGridProps) => {
  return (
    <AnimatePresence>
      <motion.div
        key="overview"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5 md:px-10">
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Deck overview
            </p>
            <p className="text-base font-semibold">
              {slides.length} slides · press Esc to close
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close overview"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {slides.map((slide, i) => {
              const isActive = i === activeIndex;
              return (
                <motion.button
                  key={slide.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  onClick={() => onSelect(i)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border bg-card p-5 text-left transition-all duration-200 aspect-[16/9] flex flex-col justify-between",
                    isActive
                      ? "border-pulse shadow-[0_0_0_1px_oklch(from_var(--pulse)_l_c_h_/_0.35)]"
                      : "border-border hover:border-foreground/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "font-mono text-[10px] font-semibold uppercase tracking-[0.2em]",
                        isActive ? "text-pulse" : "text-muted-foreground",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-pulse">
                        <span className="size-1.5 rounded-full bg-pulse animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold leading-tight">
                      {slide.title}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
