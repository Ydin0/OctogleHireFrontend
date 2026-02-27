import { generateOgImage, OG_SIZE } from "@/lib/og-image";
import { slugToTech, slugToRole } from "@/lib/seo-data";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tech = slugToTech(slug);
  if (tech) {
    return generateOgImage(
      `Remote ${tech} Developer Jobs`,
      `Apply once, get matched with top ${tech} roles worldwide.`,
    );
  }

  const role = slugToRole(slug);
  if (role) {
    return generateOgImage(
      `${role} — Remote Jobs`,
      `Apply for remote ${role} positions at vetted companies.`,
    );
  }

  return generateOgImage(
    "Remote Developer Jobs",
    "Apply once, get matched with top companies worldwide.",
  );
}
