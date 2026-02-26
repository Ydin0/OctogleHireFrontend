import type { Metadata } from "next";
import { Suspense } from "react";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { PostCard } from "@/components/blog/post-card";
import { TagFilter } from "@/components/blog/tag-filter";
import { getPublishedPosts, getAllTags } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — OctogleHire",
  description:
    "Insights on remote hiring, engineering teams, and the future of global talent.",
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

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Blog
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Insights & Resources
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Practical advice on hiring remote developers, building distributed
            engineering teams, and scaling with global talent.
          </p>
        </div>

        <div className="mb-8">
          <Suspense>
            <TagFilter tags={allTags} />
          </Suspense>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No posts found for this tag. Try another filter.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
