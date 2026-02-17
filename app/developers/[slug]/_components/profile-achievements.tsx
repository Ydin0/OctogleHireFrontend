import { Trophy } from "lucide-react";

import type { Developer } from "@/lib/data/developers";

interface ProfileAchievementsProps {
  developer: Developer;
}

const ProfileAchievements = ({ developer }: ProfileAchievementsProps) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">
        Top Achievements
      </h2>
      <ul className="mt-4 space-y-3">
        {developer.achievements.map((achievement) => (
          <li key={achievement} className="flex items-start gap-3">
            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-pulse/10">
              <Trophy className="size-3.5 text-pulse" />
            </div>
            <span className="leading-relaxed text-muted-foreground">
              {achievement}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export { ProfileAchievements };
