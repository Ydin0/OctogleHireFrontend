"use client";

import { Badge } from "@/components/ui/badge";
import { TECH_ICONS } from "@/lib/tech-icons";
import type { Developer } from "@/lib/data/developers";

interface ProfileSkillsProps {
  developer: Developer;
}

const ProfileSkills = ({ developer }: ProfileSkillsProps) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">
        Tech Stack
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {developer.skills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
          >
            {TECH_ICONS[skill] && (
              <img
                src={TECH_ICONS[skill]}
                alt=""
                className="size-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            {skill}
          </Badge>
        ))}
      </div>
    </section>
  );
};

export { ProfileSkills };
