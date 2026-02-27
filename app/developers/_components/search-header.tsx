"use client";

import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchHeader = ({ searchQuery, onSearchChange }: SearchHeaderProps) => {
  return (
    <div className="space-y-4 rounded-2xl border border-pulse/30 bg-gradient-to-br from-card via-card to-pulse/5 p-5 sm:p-6">
      {/* Heading */}
      <div>
        <Badge
          variant="outline"
          className="mb-3 border-pulse/40 bg-pulse/10 text-pulse"
        >
          Developer Marketplace
        </Badge>
        <h1 className="text-3xl font-semibold text-pretty lg:text-4xl">
          Find Your Next <span className="text-pulse">Developer</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse 1,000+ pre-vetted engineers. Filter by tech stack, country,
          title, rate, and experience.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, role, skills, or location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-10 w-full min-w-0 rounded-md border border-pulse/25 bg-background/90 pl-9 pr-9 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-pulse focus-visible:ring-pulse/40 focus-visible:ring-[3px]"
        />
        {searchQuery.length > 0 && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export { SearchHeader };
