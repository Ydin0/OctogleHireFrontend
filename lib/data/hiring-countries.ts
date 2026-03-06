import { COUNTRY_OPTIONS } from "./geo";

export interface HiringCountryOption {
  code: string;
  name: string;
  flag: string;
  note?: string;
}

const NOTED_COUNTRIES: Array<{
  code: string;
  name: string;
  note: string;
}> = [
  { code: "IN", name: "India", note: "Up to 60% cost savings" },
  { code: "PK", name: "Pakistan", note: "Up to 65% cost savings" },
  { code: "BD", name: "Bangladesh", note: "Up to 70% cost savings" },
  {
    code: "PH",
    name: "Philippines",
    note: "Up to 50% cost savings, strong English",
  },
  { code: "VN", name: "Vietnam", note: "Up to 65% cost savings" },
  { code: "ID", name: "Indonesia", note: "Up to 60% cost savings" },
  { code: "UA", name: "Ukraine", note: "Strong engineering talent" },
  { code: "PL", name: "Poland", note: "EU timezone, strong engineering" },
  { code: "RO", name: "Romania", note: "EU timezone, cost-effective" },
  { code: "TR", name: "Turkey", note: "EU-adjacent, cost-effective" },
  { code: "BR", name: "Brazil", note: "Americas timezone overlap" },
  { code: "MX", name: "Mexico", note: "US timezone overlap, nearshore" },
  { code: "CO", name: "Colombia", note: "US timezone overlap" },
  { code: "AR", name: "Argentina", note: "Americas timezone, cost-effective" },
  { code: "EG", name: "Egypt", note: "Cost-effective, multilingual" },
  { code: "NG", name: "Nigeria", note: "Growing tech hub" },
  { code: "KE", name: "Kenya", note: "East Africa tech hub" },
  { code: "ZA", name: "South Africa", note: "Strong English, diverse talent" },
  { code: "GH", name: "Ghana", note: "Emerging tech talent" },
  { code: "ET", name: "Ethiopia", note: "Emerging tech talent" },
];

const notedCodes = new Set(NOTED_COUNTRIES.map((c) => c.code));

const toFlagEmoji = (isoCode: string) =>
  isoCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    );

const notedOptions: HiringCountryOption[] = NOTED_COUNTRIES.map((c) => ({
  code: c.code,
  name: c.name,
  flag: toFlagEmoji(c.code),
  note: c.note,
}));

const otherOptions: HiringCountryOption[] = COUNTRY_OPTIONS.filter(
  (c) => !notedCodes.has(c.isoCode),
)
  .map((c) => ({
    code: c.isoCode,
    name: c.name,
    flag: c.flag,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const HIRING_COUNTRY_OPTIONS: HiringCountryOption[] = [
  ...notedOptions,
  ...otherOptions,
];

export const hiringCountryByCode = new Map<string, HiringCountryOption>(
  HIRING_COUNTRY_OPTIONS.map((c) => [c.code, c]),
);
