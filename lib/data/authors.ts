export interface Author {
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  social: { linkedin?: string; twitter?: string };
}

export const authors: Author[] = [
  {
    slug: "yaseen-deen",
    name: "Yaseen Deen",
    title: "Co-Founder, OctogleHire",
    bio: "Yaseen built OctogleHire to connect companies with the world's best engineering talent. He has personally reviewed thousands of developer profiles and helped over 300 companies build remote teams across 150+ countries.",
    avatar: "/Yaseen Founder.jpg",
    social: {
      linkedin: "https://www.linkedin.com/in/yaseen-deen-52249219b/",
    },
  },
  {
    slug: "octoglehire-team",
    name: "OctogleHire Team",
    title: "Engineering & Content",
    bio: "The OctogleHire team writes about global hiring, remote engineering, and building world-class distributed teams. Our insights are drawn from vetting 30,000+ developers and placing 1,000+ engineers at companies worldwide.",
    avatar: "/Octogle Darkmode.svg",
    social: {
      linkedin: "https://linkedin.com/company/octoglehire",
      twitter: "https://twitter.com/octoglehire",
    },
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function resolveAuthor(authorField: string): Author {
  // Try exact slug match first
  const bySlug = getAuthorBySlug(authorField);
  if (bySlug) return bySlug;

  // Try matching by name
  const byName = authors.find(
    (a) => a.name.toLowerCase() === authorField.toLowerCase(),
  );
  if (byName) return byName;

  // Fallback to team
  return authors.find((a) => a.slug === "octoglehire-team")!;
}
