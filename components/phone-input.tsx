"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  COUNTRY_OPTIONS,
  type CountryOption,
  guessCountryOptionFromClient,
} from "@/lib/data/geo";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const parsePhoneValue = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return { dialCode: "", nationalNumber: "" };

  const match = trimmed.match(/^(\+\d+)\s*(.*)$/);
  if (!match) return { dialCode: "", nationalNumber: trimmed };

  return { dialCode: match[1], nationalNumber: match[2] ?? "" };
};

const buildPhoneValue = (dialCode: string, nationalNumber: string) => {
  const d = dialCode.trim();
  const n = nationalNumber.trim();
  if (!d && !n) return "";
  if (!d) return n;
  if (!n) return "";
  return `${d} ${n}`;
};

// Find country option by dial code string like "+44"
const findByDialCode = (dialCode: string): CountryOption | undefined =>
  COUNTRY_OPTIONS.find((c) => `+${c.phoneCode}` === dialCode);

interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  className?: string;
}

function PhoneInput({
  value = "",
  onChange,
  id = "phone",
  placeholder = "82 123 4567",
  className,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    null
  );

  // Auto-detect country on mount — only sets the visual selector, does NOT
  // call onChange so validation isn't triggered before the user types.
  useEffect(() => {
    try {
      const guess = guessCountryOptionFromClient({
        languages: [...navigator.languages],
        locale: navigator.language,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      if (guess) {
        setSelectedCountry(guess);
      }
    } catch {
      // ignore
    }
  }, []);

  const parsed = useMemo(() => parsePhoneValue(value), [value]);

  // Resolve active country: from the actual value first, then from auto-detect
  const activeCountry = useMemo(() => {
    if (parsed.dialCode) return findByDialCode(parsed.dialCode) ?? selectedCountry;
    return selectedCountry;
  }, [parsed.dialCode, selectedCountry]);

  const activeDialCode = parsed.dialCode || (activeCountry ? `+${activeCountry.phoneCode}` : "+1");

  const handleCountrySelect = (country: CountryOption) => {
    setSelectedCountry(country);
    setOpen(false);
    const dialCode = `+${country.phoneCode}`;
    // Only set value if user has typed a number
    if (parsed.nationalNumber) {
      onChange(buildPhoneValue(dialCode, parsed.nationalNumber));
    }
  };

  const handleNumberChange = (nationalNumber: string) => {
    const cleaned = nationalNumber.replace(/[^\d\s]/g, "");
    if (cleaned) {
      onChange(buildPhoneValue(activeDialCode, cleaned));
    } else {
      // When number is cleared, clear the whole value so validation
      // doesn't fire on an empty field with just a dial code
      onChange("");
    }
  };

  return (
    <div
      className={cn(
        "flex w-full rounded-md border border-input bg-transparent text-sm shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        className
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="h-auto shrink-0 gap-1 rounded-r-none border-r border-input px-2.5 py-2 text-sm font-normal hover:bg-accent/50"
          >
            <span className="text-base leading-none">
              {activeCountry?.flag ?? "🌐"}
            </span>
            <span className="font-mono text-xs">
              {activeDialCode}
            </span>
            <ChevronsUpDown className="ml-0.5 size-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {COUNTRY_OPTIONS.map((country) => (
                  <CommandItem
                    key={country.isoCode}
                    value={`${country.name} +${country.phoneCode}`}
                    onSelect={() => handleCountrySelect(country)}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-3.5",
                        activeCountry?.isoCode === country.isoCode
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span className="mr-2 text-base">{country.flag}</span>
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      +{country.phoneCode}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        id={id}
        type="tel"
        className="h-auto min-w-0 flex-1 rounded-l-none border-0 shadow-none focus-visible:ring-0"
        placeholder={placeholder}
        autoComplete="off"
        value={parsed.nationalNumber}
        onChange={(e) => handleNumberChange(e.target.value)}
      />
    </div>
  );
}

export { PhoneInput };
