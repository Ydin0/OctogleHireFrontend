import { MapPin, Clock, Briefcase, Share2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Rating } from "@/components/shadcnblocks/rating";
import type { Developer } from "@/lib/data/developers";

interface ProfileHeroProps {
  developer: Developer;
}

const ProfileHero = ({ developer }: ProfileHeroProps) => {
  const firstName = developer.name.split(" ")[0];
  const initials = developer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <section className="flex flex-col items-center gap-6 py-12 lg:flex-row lg:items-start lg:gap-12">
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar className="size-28 border-4 border-border shadow-lg lg:size-36">
          <AvatarImage
            src={developer.avatar}
            alt={developer.name}
            className="object-cover"
          />
          <AvatarFallback className="text-3xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        {developer.isOnline && (
          <span className="absolute bottom-1 right-1 size-5 rounded-full border-[3px] border-background bg-emerald-500 lg:size-6" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col items-center gap-4 lg:items-start">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
            {developer.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {developer.role}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground lg:justify-start">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            <span>{developer.location}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            <span>{developer.yearsOfExperience} years exp.</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <Briefcase className="size-4" />
            <span>{developer.projects} projects</span>
          </div>
        </div>

        {/* Engagement rates */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
            ${developer.hourlyRate}/hr
          </Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
            ${developer.monthlyRate.toLocaleString()}/mo
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            Custom contract
          </Badge>
        </div>

        {/* Rating */}
        <Rating
          rate={developer.rating}
          showScore
          description={`${developer.rating.toFixed(1)} average across ${developer.projects} projects`}
        />

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="bg-pulse text-pulse-foreground hover:bg-pulse/90">
            Hire {firstName}
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="size-4" />
            Share Profile
          </Button>
        </div>
      </div>
    </section>
  );
};

export { ProfileHero };
