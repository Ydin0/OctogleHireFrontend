import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { FeaturedPost } from "@/components/blog/featured-post";
import { PostCard } from "@/components/blog/post-card";
import { TagFilter } from "@/components/blog/tag-filter";
import { getPublishedPosts, getAllTags } from "@/lib/blog";
import { topics } from "@/lib/data/topics";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on remote hiring, engineering teams, and the future of global talent.",
  keywords: [
    "remote hiring blog",
    "engineering team building",
    "hire developers tips",
    "global talent insights",
  ],
  alternates: { canonical: absoluteUrl("/blog") },
};

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag } = await searchParams;
  const allPosts = getPublishedPosts();
  const allTags = getAllTags();
  const posts = tag
    ? allPosts.filter((post) => post.tags.includes(tag))
    : allPosts;

  const featuredPost = !tag ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  const jsonLd = buildJsonLd({
    "@type": "CollectionPage",
    name: "OctogleHire Blog",
    description:
      "Insights on remote hiring, engineering teams, and the future of global talent.",
    url: absoluteUrl("/blog"),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero header */}
        <section className="container mx-auto px-6 pt-20 pb-12">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Blog
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
            Insights & Resources
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Practical advice on hiring remote developers, building distributed
            engineering teams, and scaling with global talent.
          </p>
        </section>

        {/* Featured post */}
        {featuredPost && (
          <section className="container mx-auto px-6 pb-16">
            <FeaturedPost post={featuredPost} />
          </section>
        )}

        {/* Topic clusters */}
        <section className="border-y border-border bg-muted/30">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Topics
              </span>
              <div className="flex gap-2">
                {topics.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/topics/${topic.slug}`}
                    className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {topic.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filter + grid */}
        <section className="container mx-auto px-6 py-16">
          {/* Tag filter */}
          <div className="mb-10 flex items-center justify-between gap-4">
            <h2 className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {tag ? `Filtered by "${tag}"` : "All Articles"}
              <span className="ml-2 font-mono text-muted-foreground/60">
                ({posts.length})
              </span>
            </h2>
          </div>

          <div className="mb-10">
            <Suspense>
              <TagFilter tags={allTags} />
            </Suspense>
          </div>

          {/* Posts grid */}
          {gridPosts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground">
                No posts found for this tag.
              </p>
              <Link
                href="/blog"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-pulse"
              >
                View all articles
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="container mx-auto px-6 pb-24">
          <div className="rounded-3xl border border-border bg-muted/30 p-10 text-center md:p-16">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Stay in the loop
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              Get hiring insights delivered
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Join 300+ engineering leaders who read our weekly breakdown of
              remote hiring trends, salary data, and team-building strategies.
            </p>
            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <Link
                href="/companies/signup"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Start Hiring
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/developers/join"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-muted"
              >
                Join as Developer
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
    </>
  );
}
