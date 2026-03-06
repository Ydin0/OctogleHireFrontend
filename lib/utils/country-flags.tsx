import { hiringCountryByCode } from "@/lib/data/hiring-countries";

export function CountryFlags({
  codes,
  max = 5,
}: {
  codes: string[];
  max?: number;
}) {
  if (!codes || codes.length === 0) return null;

  const visible = codes.slice(0, max);
  const overflow = codes.length - max;

  return (
    <span className="inline-flex flex-wrap items-center gap-1 text-sm">
      {visible.map((code) => {
        const country = hiringCountryByCode.get(code);
        if (!country) return null;
        return (
          <span key={code} title={country.name}>
            {country.flag}
          </span>
        );
      })}
      {overflow > 0 && (
        <span className="text-xs text-muted-foreground">+{overflow}</span>
      )}
    </span>
  );
}
