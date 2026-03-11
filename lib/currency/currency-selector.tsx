"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DISPLAY_CURRENCIES, type DisplayCurrencyCode } from "./currencies";
import { useCurrency } from "./currency-context";

export function CurrencySelector() {
  const { displayCurrency, setDisplayCurrency } = useCurrency();

  return (
    <Select
      value={displayCurrency}
      onValueChange={(value) =>
        setDisplayCurrency(value as DisplayCurrencyCode)
      }
    >
      <SelectTrigger className="h-7 w-[72px] gap-1 border-none bg-transparent px-2 text-[10px] font-mono uppercase shadow-none focus:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {DISPLAY_CURRENCIES.map((currency) => (
          <SelectItem
            key={currency.code}
            value={currency.code}
            className="text-xs"
          >
            <span className="font-mono">{currency.symbol}</span>{" "}
            <span className="font-medium">{currency.code}</span>{" "}
            <span className="text-muted-foreground">{currency.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
