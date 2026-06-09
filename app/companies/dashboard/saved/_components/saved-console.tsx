"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Bookmark, MapPin, ShieldCheck, Sparkles, Star, Users } from "lucide-react";

import type { Developer } from "@/lib/data/developers";
import { TECH_ICONS } from "@/lib/tech-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  EmptyState,
  PageHead,
  PageScroll,
  ProfileOverlay,
} from "../../_components/console-ui";
import { useShortlist } from "../../_components/shortlist-context";

function ShortlistCard({
  dev,
  onOpen,
  saved,
  onSave,
}: {
  dev: Developer;
  onOpen: () => void;
  saved: boolean;
  onSave: () => void;
}) {
  const skills = dev.skillLevels?.map((s) => s.name) ?? dev.skills;
  return (
    <div
      onClick={onOpen}
      className="group relative cursor-pointer rounded-2xl border border-border bg-gradient-to-b from-card to-pulse/5 p-4.5 transition-all hover:-translate-y-0.5 hover:border-pulse/40 hover:shadow-lg"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSave();
        }}
        className="absolute right-3 top-3 inline-flex size-[30px] items-center justify-center rounded-full bg-pulse/14 text-pulse"
        title="Remove from shortlist"
      >
        <Bookmark className={`size-3.5 ${saved ? "fill-pulse" : ""}`} />
      </button>
      <div className="flex items-center gap-3">
        <span className="relative inline-flex size-[52px] shrink-0 overflow-hidden rounded-full border border-pulse/25 bg-muted">
          {dev.avatar ? (
            <Image src={dev.avatar} alt={dev.name} width={52} height={52} className="size-full object-cover" unoptimized />
          ) : (
            <span className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground">
              {dev.name.slice(0, 1)}
            </span>
          )}
        </span>
        <div className="min-w-0">
          <div className="text-[15.5px] font-semibold">{dev.name}</div>
          <div className="text-[12.5px] text-pulse">{dev.role}</div>
          <div className="mt-0.5 inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
            <MapPin className="size-3" /> {dev.location.split(",").pop()?.trim()}
          </div>
        </div>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-1.5 py-0.5 text-[10.5px] text-muted-foreground"
          >
            {TECH_ICONS[s] && <Image src={TECH_ICONS[s]} alt="" width={11} height={11} unoptimized />}
            {s}
          </span>
        ))}
      </div>
      <div className="mt-3.5 flex items-center justify-between border-t border-border pt-3.5">
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-xs">
            <Star className="size-3 fill-pulse text-pulse" /> {dev.rating}
          </span>
          {dev.gauntlet && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="size-3 text-pulse" /> {dev.gauntlet.overall}
            </span>
          )}
        </span>
        <span className="font-mono text-[15px] font-bold">
          ${dev.hourlyRate}
          <span className="text-[11px] font-normal text-muted-foreground">/hr</span>
        </span>
      </div>
    </div>
  );
}

export function SavedConsole({ developers }: { developers: Developer[] }) {
  const { isSaved, toggle } = useShortlist();
  const [overlay, setOverlay] = useState<Developer | null>(null);

  // Render saved developers; toggling off hides them immediately.
  const visible = developers.filter((d) => isSaved(d.id));

  return (
    <PageScroll>
      <PageHead
        eyebrow="Shortlist"
        title="Saved engineers"
        subtitle="The engineers you're considering. Compare them side by side, then request interviews when you're ready."
        actions={
          visible.length > 0 ? (
            <>
              <Button variant="outline" className="rounded-full">
                <Users className="size-4" /> Compare
              </Button>
              <Button className="rounded-full">
                <ArrowRight className="size-4" /> Request interviews ({visible.length})
              </Button>
            </>
          ) : undefined
        }
      />
      {visible.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {visible.map((d) => (
            <ShortlistCard
              key={d.id}
              dev={d}
              saved={isSaved(d.id)}
              onSave={() => toggle(d.id)}
              onOpen={() => setOverlay(d)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark className="size-6" />}
          title="Your shortlist is empty"
          body="Browse Discover and tap the bookmark on any engineer to save them here for later."
          action={
            <Button asChild className="rounded-full">
              <Link href="/companies/dashboard">
                <Sparkles className="size-4" /> Discover engineers
              </Link>
            </Button>
          }
        />
      )}
      <ProfileOverlay
        developer={overlay}
        saved={overlay ? isSaved(overlay.id) : false}
        onSave={toggle}
        onClose={() => setOverlay(null)}
      />
    </PageScroll>
  );
}
