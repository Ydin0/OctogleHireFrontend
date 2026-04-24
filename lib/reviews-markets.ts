export const CURRENCY_SYMBOLS = [
  "£",
  "$",
  "€",
  "C$",
  "A$",
  "S$",
  "CHF",
  "SEK",
  "DKK",
  "NOK",
  "AED",
] as const;

export type CurrencySymbol = (typeof CURRENCY_SYMBOLS)[number];

export interface MarketOption {
  market: string;
  flag: string;
  currency: CurrencySymbol;
}

export const REVIEW_MARKET_OPTIONS: MarketOption[] = [
  { market: "UK", flag: "gb", currency: "£" },
  { market: "USA", flag: "us", currency: "$" },
  { market: "Canada", flag: "ca", currency: "C$" },
  { market: "Australia", flag: "au", currency: "A$" },
  { market: "Ireland", flag: "ie", currency: "€" },
  { market: "Spain", flag: "es", currency: "€" },
  { market: "Germany", flag: "de", currency: "€" },
  { market: "France", flag: "fr", currency: "€" },
  { market: "Netherlands", flag: "nl", currency: "€" },
  { market: "Switzerland", flag: "ch", currency: "CHF" },
  { market: "Sweden", flag: "se", currency: "SEK" },
  { market: "Denmark", flag: "dk", currency: "DKK" },
  { market: "Norway", flag: "no", currency: "NOK" },
  { market: "UAE", flag: "ae", currency: "AED" },
  { market: "Singapore", flag: "sg", currency: "S$" },
];
