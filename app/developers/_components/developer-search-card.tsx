"use client";

import Link from "next/link";
import { Bookmark, Briefcase, Clock, MapPin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Developer } from "@/lib/data/developers";
import { TECH_ICONS } from "@/lib/tech-icons";

interface DeveloperSearchCardProps {
  developer: Developer;
}

function getProfileTags(developer: Developer): string[] {
  const tags: string[] = [];

  if (developer.yearsOfExperience >= 9) {
    tags.push("Industry Veteran 🛡️");
  } else if (developer.yearsOfExperience <= 5 && developer.rating >= 4.7) {
    tags.push("Rising Star 🔥");
  } else {
    tags.push("Proven Pro ⭐");
  }

  if (developer.isOnline) {
    tags.push("Available Now");
  }

  return tags;
}

const DeveloperSearchCard = ({ developer }: DeveloperSearchCardProps) => {
  const initials = developer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const extraSkills =
    developer.skills.length > 3 ? developer.skills.length - 3 : 0;
  const displayedSkills = developer.skills.slice(0, 3);
  const profileTags = getProfileTags(developer);

  return (
    <Link href={`/developers/${developer.id}`} className="block h-full">
      <Card className="group relative flex h-full w-full flex-col border-pulse/20 bg-gradient-to-b from-card to-pulse/5 p-5 transition-all hover:border-pulse/35 hover:shadow-md">
        {/* Bookmark */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 size-8 rounded-full text-muted-foreground hover:bg-pulse/10 hover:text-pulse opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Bookmark className="size-4" />
        </Button>

        {/* Centered avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="size-18 border-2 border-pulse/25 shadow-sm">
              <AvatarImage
                src={developer.avatar}
                alt={developer.name}
                className="object-cover"
              />
              <AvatarFallback className="text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {developer.isOnline && (
              <span className="absolute bottom-0.5 right-0.5 size-4 rounded-full border-2 border-background bg-emerald-500" />
            )}
          </div>

          {/* Name & role */}
          <h3 className="mt-3 text-lg font-semibold text-center">
            {developer.name}
          </h3>
          <p className="text-xs text-pulse text-center">
            {developer.role}
          </p>

          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {profileTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-pulse/35 bg-pulse/10 text-[10px] font-mono uppercase tracking-[0.06em] text-pulse"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-3 flex items-center justify-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="size-3 text-pulse" />
            <span className="text-[10px]">{developer.location}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2 text-center">
          {developer.bio}
        </p>

        {/* Skills */}
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {displayedSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="rounded-full border border-pulse/25 bg-pulse/10 text-xs text-foreground flex items-center gap-1.5"
            >
              {TECH_ICONS[skill] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={TECH_ICONS[skill]}
                  alt=""
                  className="size-3.5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              {skill}
            </Badge>
          ))}
          {extraSkills > 0 && (
            <Badge
              variant="secondary"
              className="rounded-full border border-pulse/25 bg-pulse/10 text-xs text-foreground"
            >
              +{extraSkills}
            </Badge>
          )}
        </div>

        {/* Stats footer */}
        <div className="mt-auto flex items-center justify-between border-t pt-4 mt-5">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center justify-center size-6 rounded-full bg-pulse/15">
              <span className="text-[10px] font-bold">{developer.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">rating</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-3 text-muted-foreground" />
            <span className="text-xs font-medium">
              {developer.yearsOfExperience} yrs
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="size-3 text-muted-foreground" />
            <span className="text-xs font-medium">{developer.projects} projects</span>
          </div>
          <div>
            <span className="text-sm font-bold">${developer.hourlyRate}</span>
            <span className="text-xs text-muted-foreground">/hr</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export { DeveloperSearchCard };
