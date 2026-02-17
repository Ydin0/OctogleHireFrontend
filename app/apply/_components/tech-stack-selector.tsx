"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { MARKETPLACE_TECH_STACK_OPTIONS } from "@/lib/data/developers";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface TechStackSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
}

const TechStackSelector = ({
  value,
  onChange,
  max = 8,
}: TechStackSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return MARKETPLACE_TECH_STACK_OPTIONS;
    return MARKETPLACE_TECH_STACK_OPTIONS.filter((option) =>
      option.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const toggle = (tech: string) => {
    if (value.includes(tech)) {
      onChange(value.filter((t) => t !== tech));
    } else if (value.length < max) {
      onChange([...value, tech]);
    }
  };

  const remove = (tech: string) => {
    onChange(value.filter((t) => t !== tech));
  };

  const handleToggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectionLabel =
    value.length === 0
      ? "Select technologies..."
      : value.length <= 2
        ? value.join(", ")
        : `${value.length} technologies selected`;

  return (
    <div ref={containerRef}>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="h-auto w-full justify-between px-3 py-2 text-left font-normal"
          onClick={handleToggleOpen}
        >
          <span className="truncate text-sm">{selectionLabel}</span>
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </Button>

        {open && (
          <div className="absolute left-0 z-50 mt-1 w-full rounded-md border bg-card shadow-md">
            <div className="border-b p-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search technologies..."
                  className="h-8 w-full rounded-md border bg-background pl-7 pr-2 text-sm outline-none focus:border-ring"
                />
              </div>
            </div>

            <ScrollArea className="h-48">
              <div className="space-y-0.5 p-2">
                {filteredOptions.length === 0 ? (
                  <p className="px-2 py-2 text-xs text-muted-foreground">
                    No matches found.
                  </p>
                ) : (
                  filteredOptions.map((option) => {
                    const checked = value.includes(option);
                    const disabled = !checked && value.length >= max;

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={disabled}
                        onClick={() => toggle(option)}
                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                          checked
                            ? "bg-primary/10 text-foreground"
                            : disabled
                              ? "cursor-not-allowed opacity-40"
                              : "hover:bg-muted"
                        }`}
                      >
                        <span
                          className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border ${
                            checked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input"
                          }`}
                        >
                          {checked && <Check className="size-3" />}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {value.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="gap-1 pr-1 text-xs"
            >
              {tech}
              <button
                type="button"
                onClick={() => remove(tech)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="mt-1.5 text-xs text-muted-foreground">
        {value.length}/{max} selected
      </p>
    </div>
  );
};

export { TechStackSelector };
