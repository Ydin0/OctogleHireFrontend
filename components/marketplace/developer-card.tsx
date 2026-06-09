"use client";

import Image from "next/image";
import { Bookmark, Clock, MapPin, ShieldCheck, Star } from "lucide-react";

import type { Developer } from "@/lib/data/developers";
import { TECH_ICONS } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

interface DeveloperCardProps {
  developer: Developer;
  saved: boolean;
  onSave: (id: string) => void;
  onOpen: (developer: Developer) => void;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function DeveloperCard({ developer, saved, onSave, onOpen }: DeveloperCardProps) {
  const skills = developer.skillLevels?.length
    ? developer.skillLevels.map((s) => s.name)
    : developer.skills;

  return (
    <button
      type="button"
      onClick={() => onOpen(developer)}
      className="group relative flex flex-col rounded-2xl border border-pulse/20 bg-gradient-to-b from-card to-pulse/5 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-pulse/40 hover:shadow-lg"
    >
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onSave(developer.id);
        }}
        className={cn(
          "absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full transition-opacity",
          saved
            ? "bg-pulse/15 text-pulse opacity-100"
            : "text-muted-foreground opacity-0 group-hover:opacity-100"
        )}
        aria-label={saved ? "Remove from shortlist" : "Save to shortlist"}
      >
        <Bookmark className={cn("size-4", saved && "fill-pulse")} />
      </span>

      <div className="flex flex-col items-center">
        <div className="relative">
          <span className="inline-flex size-[72px] overflow-hidden rounded-full border-2 border-pulse/25 bg-muted">
            {developer.avatar ? (
              <Image
                src={developer.avatar}
                alt={developer.name}
                width={72}
                height={72}
                className="size-full object-cover"
                unoptimized
              />
            ) : (
              <span className="flex size-full items-center justify-center text-lg font-semibold text-muted-foreground">
                {getInitials(developer.name)}
              </span>
            )}
          </span>
          {developer.isOnline && (
            <span className="absolute bottom-0.5 right-0.5 size-[15px] rounded-full border-2 border-card bg-emerald-400" />
          )}
        </div>

        <h3 className="mt-3 text-[17px] font-semibold">{developer.name}</h3>
        <p className="mt-0.5 text-xs text-pulse">{developer.role}</p>

        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {developer.tag && (
            <span className="rounded-full border border-pulse/35 bg-pulse/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-pulse">
              {developer.tag} {developer.tagEmoji}
            </span>
          )}
          {developer.isOnline && (
            <span className="rounded-full border border-emerald-400/35 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-500">
              Available
            </span>
          )}
        </div>
      </div>

      {developer.location && (
        <div className="mt-2.5 flex items-center justify-center gap-1 text-muted-foreground">
          <MapPin className="size-3" />
          <span className="text-[11px]">{developer.location}</span>
        </div>
      )}

      {developer.bio && (
        <p className="mt-2.5 line-clamp-2 text-center text-[13px] leading-relaxed text-muted-foreground">
          {developer.bio}
        </p>
      )}

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {skills.slice(0, 3).map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1.5 rounded-full border border-pulse/25 bg-pulse/10 px-2 py-0.5 text-xs"
          >
            {TECH_ICONS[s] && (
              <Image src={TECH_ICONS[s]} alt="" width={13} height={13} unoptimized />
            )}
            {s}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between border-t border-border pt-3.5">
          <span className="inline-flex items-center gap-1 text-xs" title="Rating">
            <Star className="size-3.5 fill-pulse text-pulse" />
            {developer.rating}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {developer.yearsOfExperience} yrs
          </span>
          {developer.gauntlet && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="size-3" />
              {developer.gauntlet.overall}
            </span>
          )}
          <span>
            <span className="font-mono text-[15px] font-bold">
              ${developer.hourlyRate}
            </span>
            <span className="text-[11px] text-muted-foreground">/hr</span>
          </span>
        </div>
      </div>
    </button>
  );
}

export { DeveloperCard };
