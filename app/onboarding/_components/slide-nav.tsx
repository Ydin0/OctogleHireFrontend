"use client";

import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Maximize2,
  Minimize2,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface SlideNavProps {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (n: number) => void;
  onToggleOverview: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export const SlideNav = ({
  index,
  total,
  onPrev,
  onNext,
  onGoTo,
  onToggleOverview,
  onToggleFullscreen,
  isFullscreen,
}: SlideNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 border-t border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
        {/* Left: prev/next */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrev}
            disabled={index <= 0}
            aria-label="Previous slide"
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full border border-border transition-colors",
              index <= 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-muted",
            )}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={onNext}
            disabled={index >= total - 1}
            aria-label="Next slide"
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full border border-border transition-colors",
              index >= total - 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-muted",
            )}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Center: counter + dots */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            <span className="text-foreground">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-1 opacity-40">/</span>
            {String(total).padStart(2, "0")}
          </span>
          <div className="hidden items-center gap-1.5 sm:flex">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => onGoTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index
                    ? "w-6 bg-pulse"
                    : i < index
                      ? "w-1.5 bg-foreground/60 hover:bg-foreground"
                      : "w-1.5 bg-border hover:bg-muted-foreground/60",
                )}
              />
            ))}
          </div>
        </div>

        {/* Right: overview + fullscreen */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleOverview}
            aria-label="Slide overview"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
