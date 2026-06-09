"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const CATEGORY_OPTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "hr", label: "HR" },
];

interface CategoryFilterProps {
  selected: string[];
}

/** Multi-select for `professionalCategory` on applicants. Writes
 *  `?categories=a,b` to the URL. */
export function CategoryFilter({ selected }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const apply = (next: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.length > 0) params.set("categories", next.join(","));
    else params.delete("categories");
    startTransition(() => router.push(`?${params.toString()}`));
  };

  const toggle = (value: string) => {
    apply(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  const triggerLabel =
    selected.length === 0
      ? "All types"
      : selected.length === 1
        ? CATEGORY_OPTIONS.find((c) => c.value === selected[0])?.label ??
          selected[0]
        : `${selected.length} types`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Tag className="size-3.5" />
          {triggerLabel}
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {selected.length}
            </Badge>
          )}
          <ChevronDown className="size-3.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Filter…" />
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup>
              {CATEGORY_OPTIONS.map((c) => {
                const active = selected.includes(c.value);
                return (
                  <CommandItem
                    key={c.value}
                    onSelect={() => toggle(c.value)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 size-3.5 ${active ? "opacity-100" : "opacity-0"}`}
                    />
                    {c.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
