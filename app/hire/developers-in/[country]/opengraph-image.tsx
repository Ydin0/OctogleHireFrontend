import { generateOgImage, OG_SIZE } from "@/lib/og-image";
import { slugToCountry } from "@/lib/seo-data";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: countrySlug } = await params;
  const country = slugToCountry(countrySlug);

  return generateOgImage(
    `Hire Top Developers in ${country ?? "This Region"}`,
    `Pre-vetted engineers in ${country ?? "your target region"}, ready in days.`,
  );
}
