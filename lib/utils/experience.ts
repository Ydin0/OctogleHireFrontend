export function yearsToLevel(
  min: number,
  max: number,
): "junior" | "mid" | "senior" | "lead" | "principal" {
  const avg = (min + max) / 2;
  if (avg <= 2) return "junior";
  if (avg <= 5) return "mid";
  if (avg <= 9) return "senior";
  if (avg <= 14) return "lead";
  return "principal";
}

export function experienceLabel(
  min?: number,
  max?: number,
  level?: string,
): string {
  if (min != null && max != null) {
    const lvl = yearsToLevel(min, max);
    return `${min}-${max} years (${lvl.charAt(0).toUpperCase() + lvl.slice(1)})`;
  }
  return level
    ? `${level.charAt(0).toUpperCase() + level.slice(1)} level`
    : "Any";
}
