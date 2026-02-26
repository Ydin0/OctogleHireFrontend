"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import type { Application } from "@/lib/schemas/application";
import { PROFESSIONAL_TITLE_OPTIONS } from "@/lib/data/professional-titles";
import { CURRENCIES } from "@/lib/data/currencies";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
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

const StepProfessional = () => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<Application>();

  const bio = watch("bio") ?? "";
  const professionalTitle =
    useWatch({ control, name: "professionalTitle" }) ?? "";
  const salaryCurrency =
    useWatch({ control, name: "salaryCurrency" }) ?? "";

  const [titleOpen, setTitleOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const selectedCurrency = CURRENCIES.find((c) => c.code === salaryCurrency);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_8rem]">
        <Field>
          <FieldLabel>Professional Title</FieldLabel>
          <input type="hidden" {...register("professionalTitle")} />
          <Popover open={titleOpen} onOpenChange={setTitleOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={titleOpen}
                className="w-full justify-between font-normal"
              >
                {professionalTitle || (
                  <span className="text-muted-foreground">
                    Select a title...
                  </span>
                )}
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search titles..." />
                <CommandList>
                  <CommandEmpty>No titles found.</CommandEmpty>
                  <CommandGroup>
                    {PROFESSIONAL_TITLE_OPTIONS.map((option) => (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={() => {
                          setValue("professionalTitle", option, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setTitleOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            professionalTitle === option
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {option}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="min-h-5">
            {errors.professionalTitle && (
              <FieldError>{errors.professionalTitle.message}</FieldError>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="yearsOfExperience">Years Exp.</FieldLabel>
          <Input
            id="yearsOfExperience"
            type="number"
            min={0}
            max={50}
            placeholder="5"
            {...register("yearsOfExperience")}
          />
          <div className="min-h-5">
            {errors.yearsOfExperience && (
              <FieldError>{errors.yearsOfExperience.message}</FieldError>
            )}
          </div>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Textarea
          id="bio"
          placeholder="Tell us about your experience, expertise, and what makes you a great developer..."
          rows={3}
          {...register("bio")}
        />
        <div className="flex min-h-5 items-center justify-between gap-2">
          <div>
            {errors.bio ? (
              <FieldError>{errors.bio.message}</FieldError>
            ) : null}
          </div>
          <span className="text-xs text-muted-foreground">
            {bio.length}/500
          </span>
        </div>
      </Field>

      <Field>
        <FieldLabel>Current / Most Recent Monthly Salary</FieldLabel>
        <div className="grid grid-cols-[10rem_1fr] gap-3">
          <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={currencyOpen}
                className="w-full justify-between font-normal"
              >
                {selectedCurrency ? (
                  selectedCurrency.code
                ) : (
                  <span className="text-muted-foreground">Currency</span>
                )}
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <CommandInput placeholder="Search currencies..." />
                <CommandList>
                  <CommandEmpty>No currency found.</CommandEmpty>
                  <CommandGroup>
                    {CURRENCIES.map((c) => (
                      <CommandItem
                        key={c.code}
                        value={`${c.code} ${c.name}`}
                        onSelect={() => {
                          setValue("salaryCurrency", c.code, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setCurrencyOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            salaryCurrency === c.code
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {c.code} &mdash; {c.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Input
            id="salaryAmount"
            type="number"
            min={0}
            placeholder="e.g. 5000"
            className="font-mono"
            {...register("salaryAmount")}
          />
        </div>
        <div className="min-h-5">
          {errors.salaryCurrency ? (
            <FieldError>{errors.salaryCurrency.message}</FieldError>
          ) : errors.salaryAmount ? (
            <FieldError>{errors.salaryAmount.message}</FieldError>
          ) : null}
        </div>
      </Field>
    </div>
  );
};

export { StepProfessional };
