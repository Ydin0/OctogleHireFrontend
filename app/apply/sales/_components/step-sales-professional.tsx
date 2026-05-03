"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import type { SalesRepApplication } from "@/lib/schemas/sales-rep-application";
import { SALES_ROLE_TITLE_OPTIONS } from "@/lib/data/sales-rep-options";
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

const StepSalesProfessional = () => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SalesRepApplication>();

  const bio = watch("bio") ?? "";
  const salesRoleTitle = useWatch({ control, name: "salesRoleTitle" }) ?? "";
  const salaryCurrency = useWatch({ control, name: "salaryCurrency" }) ?? "";

  const [titleOpen, setTitleOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const selectedCurrency = CURRENCIES.find((c) => c.code === salaryCurrency);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_8rem]">
        <Field>
          <FieldLabel>Sales Role</FieldLabel>
          <input type="hidden" {...register("salesRoleTitle")} />
          <Popover open={titleOpen} onOpenChange={setTitleOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={titleOpen}
                className="w-full justify-between font-normal"
              >
                {salesRoleTitle || (
                  <span className="text-muted-foreground">
                    Select your role...
                  </span>
                )}
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search roles..." />
                <CommandList>
                  <CommandEmpty>No roles found.</CommandEmpty>
                  <CommandGroup>
                    {SALES_ROLE_TITLE_OPTIONS.map((option) => (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={() => {
                          setValue("salesRoleTitle", option, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setTitleOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            salesRoleTitle === option
                              ? "opacity-100"
                              : "opacity-0"
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
            {errors.salesRoleTitle && (
              <FieldError>{errors.salesRoleTitle.message}</FieldError>
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
          placeholder="Tell us about your sales experience, biggest deals, methodology, and what you sell best..."
          rows={3}
          {...register("bio")}
        />
        <div className="flex min-h-5 items-center justify-between gap-2">
          <div>
            {errors.bio ? (
              <FieldError>{errors.bio.message}</FieldError>
            ) : (
              <span className="text-xs text-muted-foreground">
                {bio.length < 50
                  ? `${50 - bio.length} more characters needed`
                  : ""}
              </span>
            )}
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            {bio.length}/2000
          </span>
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[8rem_1fr]">
        <Field>
          <FieldLabel>Currency</FieldLabel>
          <input type="hidden" {...register("salaryCurrency")} />
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
                  <span className="text-muted-foreground">USD</span>
                )}
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search currency..." />
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
                              : "opacity-0"
                          )}
                        />
                        <span className="font-mono">{c.code}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {c.name}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="min-h-5">
            {errors.salaryCurrency && (
              <FieldError>{errors.salaryCurrency.message}</FieldError>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="salaryAmount">
            Target Monthly OTE / Salary
          </FieldLabel>
          <Input
            id="salaryAmount"
            type="number"
            min={0}
            placeholder="8000"
            {...register("salaryAmount")}
          />
          <div className="min-h-5">
            {errors.salaryAmount && (
              <FieldError>{errors.salaryAmount.message}</FieldError>
            )}
          </div>
        </Field>
      </div>
    </div>
  );
};

export { StepSalesProfessional };
