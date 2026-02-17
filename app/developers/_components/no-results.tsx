import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

interface NoResultsProps {
  onClearFilters: () => void;
}

const NoResults = ({ onClearFilters }: NoResultsProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-pulse/25 bg-gradient-to-br from-card to-pulse/5 py-24 text-center">
      <SearchX className="size-12 text-pulse/65" />
      <h3 className="mt-4 text-lg font-semibold">No developers found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try adjusting your search or filters
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 border-pulse/30 hover:bg-pulse/10"
        onClick={onClearFilters}
      >
        Clear all filters
      </Button>
    </div>
  );
};

export { NoResults };
