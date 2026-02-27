import { generateOgImage, OG_SIZE } from "@/lib/og-image";
import { slugToTech, slugToCountry } from "@/lib/seo-data";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string; country: string }>;
}) {
  const { slug: techSlug, country: countrySlug } = await params;
  const tech = slugToTech(techSlug);
  const country = slugToCountry(countrySlug);

  return generateOgImage(
    `Hire ${tech ?? "Top"} Developers in ${country ?? "This Region"}`,
    `Pre-vetted ${tech ?? ""} engineers in ${country ?? "your target region"}.`,
  );
}
