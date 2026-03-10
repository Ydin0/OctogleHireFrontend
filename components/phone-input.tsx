"use client";

import { useEffect, useMemo, useState } from "react";

import {
  COUNTRY_OPTIONS,
  guessCountryOptionFromClient,
} from "@/lib/data/geo";
import { Input } from "@/components/ui/input";

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
  if (!d) return n;
  if (!n) return d;
  return `${d} ${n}`;
};

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
  const [defaultDialCode, setDefaultDialCode] = useState("+1");

  // Auto-detect country on mount
  useEffect(() => {
    try {
      const guess = guessCountryOptionFromClient({
        languages: [...navigator.languages],
        locale: navigator.language,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      if (guess) {
        setDefaultDialCode(`+${guess.phoneCode}`);
        // If no value yet, set the dial code
        if (!value) {
          onChange(`+${guess.phoneCode}`);
        }
      }
    } catch {
      // ignore
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parsed = useMemo(() => parsePhoneValue(value), [value]);
  const activeDialCode = parsed.dialCode || defaultDialCode;

  const handleDialCodeChange = (dialCode: string) => {
    onChange(buildPhoneValue(dialCode, parsed.nationalNumber));
  };

  const handleNumberChange = (nationalNumber: string) => {
    // Strip non-digit chars except spaces
    const cleaned = nationalNumber.replace(/[^\d\s]/g, "");
    onChange(buildPhoneValue(activeDialCode, cleaned));
  };

  return (
    <div
      className={`grid w-full grid-cols-[minmax(6.5rem,22%)_1fr] rounded-md border border-input bg-transparent text-sm shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 ${className ?? ""}`}
    >
      <select
        aria-label="Country dial code"
        className="w-full rounded-l-md border-r border-input bg-transparent px-2 py-2 text-sm outline-none"
        value={activeDialCode}
        onChange={(e) => handleDialCodeChange(e.target.value)}
      >
        {COUNTRY_OPTIONS.map((country) => (
          <option
            key={`dial-${country.isoCode}`}
            value={`+${country.phoneCode}`}
          >
            {country.flag} +{country.phoneCode}
          </option>
        ))}
      </select>
      <Input
        id={id}
        type="tel"
        className="h-auto min-w-0 rounded-l-none border-0 shadow-none focus-visible:ring-0"
        placeholder={placeholder}
        autoComplete="off"
        value={parsed.nationalNumber}
        onChange={(e) => handleNumberChange(e.target.value)}
      />
    </div>
  );
}

export { PhoneInput };
