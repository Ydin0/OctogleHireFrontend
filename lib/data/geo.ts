import { City, Country, State } from "country-state-city";

type CountryOption = {
  name: string;
  isoCode: string;
  phoneCode: string;
  flag: string;
  countryLabel: string;
  dialLabel: string;
};

const toFlagEmoji = (isoCode: string) =>
  isoCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    );

const normalize = (value: string) => value.trim().toLowerCase();

const baseCountries = Country.getAllCountries()
  .filter((country) => Boolean(country.isoCode) && Boolean(country.name))
  .sort((a, b) => a.name.localeCompare(b.name));

const COUNTRY_OPTIONS: CountryOption[] = baseCountries.map((country) => {
  const flag = toFlagEmoji(country.isoCode);
  return {
    name: country.name,
    isoCode: country.isoCode,
    phoneCode: country.phonecode,
    flag,
    countryLabel: `${flag} ${country.name}`,
    dialLabel: `${flag} ${country.name} (+${country.phonecode})`,
  };
});

const countryByName = new Map(
  COUNTRY_OPTIONS.map((country) => [normalize(country.name), country]),
);

const countryByCountryLabel = new Map(
  COUNTRY_OPTIONS.map((country) => [normalize(country.countryLabel), country]),
);

const countryByDialLabel = new Map(
  COUNTRY_OPTIONS.map((country) => [normalize(country.dialLabel), country]),
);
const countryByIsoCode = new Map(
  COUNTRY_OPTIONS.map((country) => [country.isoCode.toUpperCase(), country]),
);

const REGIONAL_HUBS: Record<string, string[]> = {
  IN: [
    "Bangalore",
    "Pune",
    "Hyderabad",
    "Mumbai",
    "Delhi NCR",
    "Chennai",
    "Ahmedabad",
    "Kolkata",
    "Noida",
    "Gurgaon",
    "Kochi",
    "Jaipur",
    "Indore",
    "Coimbatore",
    "Bhubaneswar",
    "Chandigarh",
    "Lucknow",
    "Surat",
  ],
  GB: [
    "London",
    "Manchester",
    "Birmingham",
    "Leeds",
    "Edinburgh",
    "Glasgow",
    "Bristol",
  ],
  ZA: [
    "Cape Town",
    "Johannesburg",
    "Pretoria",
    "Durban",
    "Port Elizabeth",
    "Centurion",
    "Sandton",
    "Midrand",
    "Stellenbosch",
    "Bloemfontein",
  ],
  EG: ["Cairo", "Alexandria", "Giza", "New Cairo", "Nasr City", "Maadi"],
  NG: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"],
  KE: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
  PK: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"],
  BD: ["Dhaka", "Chittagong", "Khulna", "Sylhet"],
  ID: ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Bali"],
  PH: ["Metro Manila", "Cebu", "Davao", "Iloilo"],
  VN: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hai Phong"],
  BR: ["Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Recife"],
  MX: ["Mexico City", "Guadalajara", "Monterrey", "Puebla"],
  AR: ["Buenos Aires", "Cordoba", "Rosario", "Mendoza"],
  CO: ["Bogota", "Medellin", "Cali", "Barranquilla"],
  TR: ["Istanbul", "Ankara", "Izmir", "Bursa"],
  UA: ["Kyiv", "Lviv", "Kharkiv", "Odesa"],
  PL: ["Warsaw", "Krakow", "Wroclaw", "Gdansk"],
  RO: ["Bucharest", "Cluj-Napoca", "Timisoara", "Iasi"],
  DE: ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt"],
  FR: ["Paris", "Lyon", "Marseille", "Toulouse"],
  ES: ["Madrid", "Barcelona", "Valencia", "Seville"],
  IT: ["Milan", "Rome", "Turin", "Bologna"],
  NL: ["Amsterdam", "Rotterdam", "Utrecht", "Eindhoven"],
  PT: ["Lisbon", "Porto", "Braga"],
  AE: ["Dubai", "Abu Dhabi", "Sharjah"],
  SA: ["Riyadh", "Jeddah", "Dammam"],
  MA: ["Casablanca", "Rabat", "Marrakesh"],
  GH: ["Accra", "Kumasi", "Takoradi"],
  ET: ["Addis Ababa", "Adama", "Bahir Dar"],
  TZ: ["Dar es Salaam", "Dodoma", "Mwanza"],
  UG: ["Kampala", "Entebbe", "Jinja"],
  US: ["San Francisco Bay Area", "New York City", "Austin", "Seattle"],
  CA: ["Toronto", "Vancouver", "Montreal", "Calgary"],
};

const regionCache = new Map<string, string[]>();
const MAX_CITY_POOL = 2500;

const dedupe = (values: string[]) => {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const rawValue of values) {
    const value = rawValue.trim();
    if (!value) continue;

    const key = normalize(value);
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(value);
  }

  return output;
};

const getRegionalAreasByIsoCode = (isoCode: string) => {
  const cacheKey = isoCode.toUpperCase();
  const cached = regionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const curated = REGIONAL_HUBS[cacheKey];
  if (curated && curated.length > 0) {
    const states = (State.getStatesOfCountry(cacheKey) ?? [])
      .map((state) => state.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    const cityPool = dedupe(
      (City.getCitiesOfCountry(cacheKey) ?? [])
        .map((city) => city.name)
        .filter((name) => Boolean(name) && name.length >= 3),
    ).slice(0, MAX_CITY_POOL);

    const merged = dedupe([...curated, ...states, ...cityPool]);
    regionCache.set(cacheKey, merged);
    return merged;
  }

  const states = (State.getStatesOfCountry(cacheKey) ?? [])
    .map((state) => state.name)
    .filter(Boolean);

  const cityPool = dedupe(
    (City.getCitiesOfCountry(cacheKey) ?? [])
      .map((city) => city.name)
      .filter((name) => Boolean(name) && name.length >= 3),
  ).slice(0, MAX_CITY_POOL);

  const dedupedStates = Array.from(new Set(states)).sort((a, b) =>
    a.localeCompare(b),
  );

  const merged = dedupe([...dedupedStates, ...cityPool]);
  regionCache.set(cacheKey, merged);
  return merged;
};

const findCountryOption = (value?: string | null) => {
  if (!value) return null;
  const normalized = normalize(value);
  return (
    countryByName.get(normalized) ??
    countryByCountryLabel.get(normalized) ??
    countryByDialLabel.get(normalized) ??
    null
  );
};

const extractDialCode = (value: string) => {
  const dialMatch = value.match(/\(\+(\d+)\)\s*$/);
  if (dialMatch) {
    return `+${dialMatch[1]}`;
  }

  const rawMatch = value.match(/^\+(\d+)/);
  if (rawMatch) {
    return `+${rawMatch[1]}`;
  }

  return null;
};

const extractRegionFromLocale = (locale?: string | null): string | null => {
  if (!locale) return null;

  try {
    const region = new Intl.Locale(locale).region;
    if (region && region.length === 2) {
      return region.toUpperCase();
    }
  } catch {
    // Fall through to regex parsing below.
  }

  const match = locale.match(/[-_]([A-Za-z]{2})(?:$|[-_])/);
  if (!match) return null;
  return match[1].toUpperCase();
};

const TIMEZONE_TO_COUNTRY: Array<[string, string]> = [
  ["Asia/Kolkata", "IN"],
  ["Asia/Karachi", "PK"],
  ["Asia/Dhaka", "BD"],
  ["Africa/Johannesburg", "ZA"],
  ["Africa/Cairo", "EG"],
  ["Africa/Lagos", "NG"],
  ["Africa/Nairobi", "KE"],
  ["Africa/Casablanca", "MA"],
  ["Europe/London", "GB"],
  ["Europe/Dublin", "IE"],
  ["Europe/Berlin", "DE"],
  ["Europe/Paris", "FR"],
  ["Europe/Madrid", "ES"],
  ["Europe/Rome", "IT"],
  ["Europe/Amsterdam", "NL"],
  ["Europe/Lisbon", "PT"],
  ["Europe/Warsaw", "PL"],
  ["Europe/Bucharest", "RO"],
  ["Europe/Kyiv", "UA"],
  ["America/New_York", "US"],
  ["America/Chicago", "US"],
  ["America/Denver", "US"],
  ["America/Los_Angeles", "US"],
  ["America/Toronto", "CA"],
  ["America/Vancouver", "CA"],
  ["America/Mexico_City", "MX"],
  ["America/Sao_Paulo", "BR"],
  ["America/Buenos_Aires", "AR"],
  ["America/Bogota", "CO"],
  ["Asia/Jakarta", "ID"],
  ["Asia/Manila", "PH"],
  ["Asia/Ho_Chi_Minh", "VN"],
  ["Asia/Bangkok", "TH"],
  ["Asia/Singapore", "SG"],
  ["Asia/Dubai", "AE"],
  ["Asia/Riyadh", "SA"],
];

const findCountryByIsoCode = (isoCode?: string | null) => {
  if (!isoCode) return null;
  return countryByIsoCode.get(isoCode.toUpperCase()) ?? null;
};

const guessCountryOptionFromClient = (params: {
  languages?: string[] | null;
  locale?: string | null;
  timeZone?: string | null;
}) => {
  const localeCandidates = [
    ...(params.languages ?? []),
    params.locale ?? "",
  ].filter(Boolean);

  for (const locale of localeCandidates) {
    const region = extractRegionFromLocale(locale);
    if (!region) continue;
    const country = findCountryByIsoCode(region);
    if (country) return country;
  }

  const normalizedTimeZone = params.timeZone?.trim();
  if (!normalizedTimeZone) return null;

  for (const [zone, isoCode] of TIMEZONE_TO_COUNTRY) {
    if (
      normalizedTimeZone === zone ||
      normalizedTimeZone.startsWith(`${zone}/`)
    ) {
      return findCountryByIsoCode(isoCode);
    }
  }

  return null;
};

export {
  COUNTRY_OPTIONS,
  extractDialCode,
  findCountryOption,
  guessCountryOptionFromClient,
  getRegionalAreasByIsoCode,
};
export type { CountryOption };
