import type { Developer } from "@/lib/data/developers";

import { ProfileHero } from "./profile-hero";
import { ProfileAbout } from "./profile-about";
import { ProfileAchievements } from "./profile-achievements";
import { ProfileSkills } from "./profile-skills";
import { ProfileWorkHistory } from "./profile-work-history";
import { ProfileEducation } from "./profile-education";
import { ProfileCta } from "./profile-cta";

interface DeveloperProfileProps {
  developer: Developer;
}

const DeveloperProfile = ({ developer }: DeveloperProfileProps) => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-12">
        <ProfileHero developer={developer} />
        <ProfileAbout developer={developer} />
        <ProfileAchievements developer={developer} />
        <ProfileSkills developer={developer} />
        <ProfileWorkHistory developer={developer} />
        <ProfileEducation developer={developer} />
        <ProfileCta developer={developer} />
      </div>
    </div>
  );
};

export { DeveloperProfile };
