export const TIMEZONE_OPTIONS = [
  { value: "any", label: "Any Timezone" },
  // Americas
  { value: "americas", label: "Americas" },
  { value: "us-east", label: "US East (EST/EDT)" },
  { value: "us-central", label: "US Central (CST/CDT)" },
  { value: "us-west", label: "US West (PST/PDT)" },
  { value: "canada", label: "Canada" },
  { value: "latin-america", label: "Latin America" },
  { value: "brazil", label: "Brazil (BRT)" },
  // Europe
  { value: "europe", label: "Europe" },
  { value: "uk-ireland", label: "UK / Ireland (GMT/BST)" },
  { value: "central-europe", label: "Central Europe (CET/CEST)" },
  { value: "eastern-europe", label: "Eastern Europe (EET/EEST)" },
  // Middle East & Africa
  { value: "middle-east", label: "Middle East (GST/AST)" },
  { value: "africa", label: "Africa" },
  // Asia-Pacific
  { value: "asia-pacific", label: "Asia-Pacific" },
  { value: "india", label: "India (IST)" },
  { value: "southeast-asia", label: "Southeast Asia (ICT/SGT)" },
  { value: "east-asia", label: "East Asia (JST/KST/CST)" },
  { value: "australia", label: "Australia (AEST/AWST)" },
  { value: "new-zealand", label: "New Zealand (NZST)" },
  // Overlap-based
  { value: "overlap-us", label: "US Overlap (4+ hrs)" },
  { value: "overlap-eu", label: "EU Overlap (4+ hrs)" },
  { value: "overlap-asia", label: "Asia Overlap (4+ hrs)" },
] as const;

export type TimezoneValue = (typeof TIMEZONE_OPTIONS)[number]["value"];

const labelMap = new Map<string, string>(
  TIMEZONE_OPTIONS.map((tz) => [tz.value, tz.label]),
);

export function getTimezoneLabel(value: string): string {
  return labelMap.get(value) ?? value.replace(/-/g, " ");
}
