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
      `Hire Top ${tech} Developers`,
      `Pre-vetted ${tech} engineers from 150+ countries. Start in days.`,
    );
  }

  const role = slugToRole(slug);
  if (role) {
    return generateOgImage(
      `Hire a ${role}`,
      `Pre-vetted ${role} professionals ready to join your team.`,
    );
  }

  return generateOgImage(
    "Hire Top Developer Talent",
    "Pre-vetted engineers from 150+ countries.",
  );
}
