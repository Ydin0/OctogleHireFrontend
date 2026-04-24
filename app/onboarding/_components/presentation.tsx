"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { CoverSlide } from "../_slides/01-cover";
import { ProblemSlide } from "../_slides/02-problem";
import { IntroducingSlide } from "../_slides/03-introducing";
import { NetworkSlide } from "../_slides/04-network";
import { VettingSlide } from "../_slides/05-vetting";
import { AiNativeSlide } from "../_slides/06-ai-native";
import { ProcessSlide } from "../_slides/07-process";
import { PricingSlide } from "../_slides/08-pricing";
import { ComplianceSlide } from "../_slides/09-compliance";
import { SavingsSlide } from "../_slides/10-savings";
import { NextStepsSlide } from "../_slides/11-next-steps";
import { OverviewGrid } from "./overview-grid";
import { SlideNav } from "./slide-nav";

export interface SlideMeta {
  id: string;
  title: string;
  Component: React.ComponentType;
}

export const SLIDES: SlideMeta[] = [
  { id: "cover", title: "Welcome", Component: CoverSlide },
  { id: "problem", title: "The hiring problem", Component: ProblemSlide },
  { id: "introducing", title: "Introducing OctogleHire", Component: IntroducingSlide },
  { id: "network", title: "The Network", Component: NetworkSlide },
  { id: "vetting", title: "How we vet", Component: VettingSlide },
  { id: "ai-native", title: "AI Native", Component: AiNativeSlide },
  { id: "process", title: "How hiring works", Component: ProcessSlide },
  { id: "pricing", title: "Pricing", Component: PricingSlide },
  { id: "compliance", title: "Compliance + guarantees", Component: ComplianceSlide },
  { id: "savings", title: "Real savings", Component: SavingsSlide },
  { id: "next-steps", title: "What happens next", Component: NextStepsSlide },
];

export const Presentation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Preserve non-slide params once so URL sync doesn't loop
  const preservedParamsRef = useRef<URLSearchParams | null>(null);

  // On mount: capture preserved params + read ?slide
  useEffect(() => {
    const preserved = new URLSearchParams();
    params.forEach((v, k) => {
      if (k !== "slide") preserved.set(k, v);
    });
    preservedParamsRef.current = preserved;

    const slide = params.get("slide");
    if (slide) {
      const n = parseInt(slide, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= SLIDES.length) {
        setIndex(n - 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync URL when index changes
  useEffect(() => {
    if (!preservedParamsRef.current) return;
    const next = new URLSearchParams(preservedParamsRef.current);
    next.set("slide", String(index + 1));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [index, router, pathname]);

  const goTo = useCallback((n: number) => {
    setIndex((curr) => {
      const clamped = Math.max(0, Math.min(SLIDES.length - 1, n));
      if (clamped === curr) return curr;
      setDirection(clamped > curr ? 1 : -1);
      return clamped;
    });
  }, []);

  const next = useCallback(() => {
    setIndex((i) => {
      if (i >= SLIDES.length - 1) return i;
      setDirection(1);
      return i + 1;
    });
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => {
      if (i <= 0) return i;
      setDirection(-1);
      return i - 1;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          if (overviewOpen) {
            setOverviewOpen(false);
            return;
          }
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          if (overviewOpen) {
            setOverviewOpen(false);
            return;
          }
          prev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(SLIDES.length - 1);
          break;
        case "Escape":
          e.preventDefault();
          setOverviewOpen((v) => !v);
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          if (/^[1-9]$/.test(e.key)) {
            e.preventDefault();
            goTo(parseInt(e.key, 10) - 1);
          }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, goTo, toggleFullscreen, overviewOpen]);

  // Fullscreen state sync
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Swipe
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  const { Component } = SLIDES[index];

  return (
    <div
      className="relative min-h-[100dvh] overflow-x-hidden bg-background"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[100dvh]"
        >
          <Component />
        </motion.div>
      </AnimatePresence>

      <SlideNav
        index={index}
        total={SLIDES.length}
        onPrev={prev}
        onNext={next}
        onGoTo={goTo}
        onToggleOverview={() => setOverviewOpen((v) => !v)}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />

      {overviewOpen && (
        <OverviewGrid
          slides={SLIDES}
          activeIndex={index}
          onSelect={(i) => {
            goTo(i);
            setOverviewOpen(false);
          }}
          onClose={() => setOverviewOpen(false)}
        />
      )}
    </div>
  );
};
