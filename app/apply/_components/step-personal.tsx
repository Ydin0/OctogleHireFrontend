"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { Application } from "@/lib/schemas/application";
import {
  COUNTRY_OPTIONS,
  type CountryOption,
  findCountryOption,
  guessCountryOptionFromClient,
  getRegionalAreasByIsoCode,
} from "@/lib/data/geo";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const MAX_SUGGESTIONS = 12;

const parsePhoneValue = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { dialCode: "", nationalNumber: "" };
  }

  const match = trimmed.match(/^(\+\d+)\s*(.*)$/);
  if (!match) {
    return { dialCode: "", nationalNumber: trimmed };
  }

  return {
    dialCode: match[1],
    nationalNumber: match[2] ?? "",
  };
};

const buildPhoneValue = (dialCode: string, nationalNumber: string) => {
  const nextDialCode = dialCode.trim();
  const nextNumber = nationalNumber.trim();

  if (!nextDialCode) return nextNumber;
  if (!nextNumber) return nextDialCode;
  return `${nextDialCode} ${nextNumber}`;
};

const filterCountryOptions = (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return COUNTRY_OPTIONS.slice(0, MAX_SUGGESTIONS);
  }

  const startsWith = COUNTRY_OPTIONS.filter((country) =>
    country.name.toLowerCase().startsWith(normalizedQuery),
  );
  const contains = COUNTRY_OPTIONS.filter((country) => {
    const normalizedName = country.name.toLowerCase();
    return (
      !normalizedName.startsWith(normalizedQuery) &&
      normalizedName.includes(normalizedQuery)
    );
  });

  return startsWith.concat(contains).slice(0, MAX_SUGGESTIONS);
};

const filterRegionOptions = (options: string[], query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return options.slice(0, MAX_SUGGESTIONS);
  }

  const startsWith = options.filter((option) =>
    option.toLowerCase().startsWith(normalizedQuery),
  );
  const contains = options.filter((option) => {
    const normalizedOption = option.toLowerCase();
    return (
      !normalizedOption.startsWith(normalizedQuery) &&
      normalizedOption.includes(normalizedQuery)
    );
  });

  return startsWith.concat(contains).slice(0, MAX_SUGGESTIONS);
};

const StepPersonal = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<Application>();
  const countryValue = useWatch({ control, name: "locationState" });
  const cityValue = useWatch({ control, name: "locationCity" });
  const phoneValue = useWatch({ control, name: "phone" });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const selectedCountryIsoRef = useRef<string | null>(null);
  const hasAutoDetectedCountryRef = useRef(false);

  const selectedCountry = useMemo(
    () => findCountryOption(countryValue),
    [countryValue],
  );

  const regionOptions = useMemo(
    () =>
      selectedCountry
        ? getRegionalAreasByIsoCode(selectedCountry.isoCode)
        : ([] as string[]),
    [selectedCountry],
  );
  const countrySuggestions = useMemo(
    () => filterCountryOptions(countryValue ?? ""),
    [countryValue],
  );
  const regionSuggestions = useMemo(
    () => filterRegionOptions(regionOptions, cityValue ?? ""),
    [cityValue, regionOptions],
  );
  const parsedPhone = useMemo(
    () => parsePhoneValue(phoneValue ?? ""),
    [phoneValue],
  );
  const fallbackDialCode = selectedCountry ? `+${selectedCountry.phoneCode}` : "";
  const activeDialCode = parsedPhone.dialCode || fallbackDialCode || "+1";

  useEffect(() => {
    if (hasAutoDetectedCountryRef.current) return;
    if (countryValue?.trim()) {
      hasAutoDetectedCountryRef.current = true;
      return;
    }

    const detectedCountry = guessCountryOptionFromClient({
      languages: [...navigator.languages],
      locale: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    if (!detectedCountry) {
      hasAutoDetectedCountryRef.current = true;
      return;
    }

    setValue("locationState", detectedCountry.name, {
      shouldDirty: false,
      shouldValidate: false,
    });
    hasAutoDetectedCountryRef.current = true;
  }, [countryValue, setValue]);

  useEffect(() => {
    const selectedIsoCode = selectedCountry?.isoCode ?? null;
    if (selectedCountryIsoRef.current && selectedCountryIsoRef.current !== selectedIsoCode) {
      setValue("locationCity", "", { shouldDirty: true, shouldValidate: true });
    }
    selectedCountryIsoRef.current = selectedIsoCode;
  }, [selectedCountry, setValue]);

  const closeCountryDropdown = () => {
    setTimeout(() => setIsCountryDropdownOpen(false), 120);
  };

  const closeRegionDropdown = () => {
    setTimeout(() => setIsRegionDropdownOpen(false), 120);
  };

  const handleDialCodeChange = (dialCode: string) => {
    setValue(
      "phone",
      buildPhoneValue(dialCode, parsedPhone.nationalNumber),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handlePhoneNumberChange = (nationalNumber: string) => {
    setValue(
      "phone",
      buildPhoneValue(activeDialCode, nationalNumber),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handleCountryInputChange = (value: string) => {
    setValue("locationState", value, { shouldDirty: true, shouldValidate: true });
    setIsCountryDropdownOpen(true);
  };

  const handleCountrySuggestionSelect = (country: CountryOption) => {
    setValue("locationState", country.name, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setIsCountryDropdownOpen(false);
  };

  const handleRegionInputChange = (value: string) => {
    setValue("locationCity", value, { shouldDirty: true, shouldValidate: true });
    setIsRegionDropdownOpen(true);
  };

  const handleRegionSuggestionSelect = (value: string) => {
    setValue("locationCity", value, { shouldDirty: true, shouldValidate: true });
    setIsRegionDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
        <Input
          id="fullName"
          placeholder="John Doe"
          {...register("fullName")}
        />
        <div className="min-h-5">
          {errors.fullName && (
            <FieldError>{errors.fullName.message}</FieldError>
          )}
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
          />
          <div className="min-h-5">
            {errors.email && (
              <FieldError>{errors.email.message}</FieldError>
            )}
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <input type="hidden" {...register("phone")} />
          <div className="grid w-full grid-cols-[minmax(5rem,20%)_1fr] rounded-md border border-input bg-transparent text-sm shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
            <select
              aria-label="Country dial code"
              className="w-full rounded-l-md border-r border-input bg-transparent px-2 py-2 text-sm outline-none"
              value={activeDialCode}
              onChange={(event) => handleDialCodeChange(event.target.value)}
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
              id="phone"
              type="tel"
              className="h-auto min-w-0 rounded-l-none border-0 shadow-none focus-visible:ring-0"
              placeholder="82 123 4567"
              autoComplete="off"
              value={parsedPhone.nationalNumber}
              onChange={(event) => handlePhoneNumberChange(event.target.value)}
            />
          </div>
          <div className="min-h-5">
            {errors.phone && (
              <FieldError>{errors.phone.message}</FieldError>
            )}
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="locationState">Country</FieldLabel>
          <input type="hidden" {...register("locationState")} />
          <div className="relative">
            <Input
              id="locationState"
              placeholder="Type country to search"
              autoComplete="off"
              value={countryValue ?? ""}
              onChange={(event) => handleCountryInputChange(event.target.value)}
              onFocus={() => setIsCountryDropdownOpen(true)}
              onBlur={closeCountryDropdown}
            />
            {isCountryDropdownOpen && (
              <div className="absolute z-40 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-background shadow-md">
                {countrySuggestions.length > 0 ? (
                  countrySuggestions.map((country) => (
                    <button
                      key={`country-suggestion-${country.isoCode}`}
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleCountrySuggestionSelect(country);
                      }}
                    >
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    No countries found
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="min-h-5">
            {errors.locationState && (
              <FieldError>{errors.locationState.message}</FieldError>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="locationCity">City / Region</FieldLabel>
          <input type="hidden" {...register("locationCity")} />
          <div className="relative">
            <Input
              id="locationCity"
              placeholder={
                selectedCountry
                  ? "Type city or region to search"
                  : "Select country first"
              }
              autoComplete="off"
              disabled={!selectedCountry}
              value={cityValue ?? ""}
              onChange={(event) => handleRegionInputChange(event.target.value)}
              onFocus={() => setIsRegionDropdownOpen(true)}
              onBlur={closeRegionDropdown}
            />
            {isRegionDropdownOpen && selectedCountry && (
              <div className="absolute z-40 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-background shadow-md">
                {regionSuggestions.length > 0 ? (
                  regionSuggestions.map((option) => (
                    <button
                      key={`region-suggestion-${option}`}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleRegionSuggestionSelect(option);
                      }}
                    >
                      {option}
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    No regions found
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="min-h-5">
            {errors.locationCity && (
              <FieldError>{errors.locationCity.message}</FieldError>
            )}
          </div>
        </Field>
      </div>
    </div>
  );
};

export { StepPersonal };
