import type { Developer } from "@/lib/data/developers";
import { DeveloperSearchCard } from "./developer-search-card";

interface DeveloperGridProps {
  developers: Developer[];
}

const DeveloperGrid = ({ developers }: DeveloperGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {developers.map((developer) => (
        <DeveloperSearchCard key={developer.id} developer={developer} />
      ))}
    </div>
  );
};

export { DeveloperGrid };
