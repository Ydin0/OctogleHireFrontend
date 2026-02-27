import type { Developer } from "@/lib/data/developers";
import { DeveloperSearchCard } from "./developer-search-card";
import { LockedDeveloperCard } from "./locked-developer-card";

interface DeveloperGridProps {
  developers: Developer[];
  lockedCount?: number;
  onUnlockClick?: () => void;
}

const DeveloperGrid = ({
  developers,
  lockedCount = 0,
  onUnlockClick,
}: DeveloperGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {developers.map((developer) => (
        <DeveloperSearchCard key={developer.id} developer={developer} />
      ))}
      {Array.from({ length: lockedCount }, (_, i) => (
        <LockedDeveloperCard
          key={`locked-${i}`}
          onUnlock={() => onUnlockClick?.()}
        />
      ))}
    </div>
  );
};

export { DeveloperGrid };
