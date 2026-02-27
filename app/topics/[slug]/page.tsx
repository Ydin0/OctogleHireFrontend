import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { PostCard } from "@/components/blog/post-card";
import { Button } from "@/components/ui/button";
import { getPostBySlug } from "@/lib/blog";
import { getTopicBySlug, getAllTopicSlugs } from "@/lib/data/topics";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllTopicSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};

  return {
    title: `${topic.title} — Guides & Resources`,
    description: topic.description,
    alternates: { canonical: absoluteUrl(`/topics/${slug}`) },
    openGraph: {
      title: `${topic.title} — ${SITE_NAME}`,
      description: topic.description,
      url: absoluteUrl(`/topics/${slug}`),
    },
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const posts = topic.posts
    .map((postSlug) => getPostBySlug(postSlug))
    .filter(Boolean);

  const jsonLd = buildJsonLd({
    "@type": "CollectionPage",
    name: topic.headline,
    description: topic.description,
    url: absoluteUrl(`/topics/${slug}`),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/blog/${post!.slug}`),
        name: post!.title,
      })),
    },
  });

  const breadcrumbJsonLd = buildJsonLd({
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Topics",
        item: absoluteUrl("/topics"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: topic.title,
        item: absoluteUrl(`/topics/${slug}`),
      },
    ],
  });

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; All articles
          </Link>
          <span className="mt-4 block text-[10px] font-semibold uppercase tracking-wider text-pulse">
            Topic Cluster
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {topic.headline}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {topic.description}
          </p>
        </div>

        {/* Posts grid */}
        {posts.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {posts.length} articles in this topic
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map(
                (post) => post && <PostCard key={post.slug} post={post} />,
              )}
            </div>
          </section>
        )}

        {/* Related hire links */}
        {topic.relatedHireLinks.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Related Pages
            </h2>
            <div className="flex flex-wrap gap-2">
              {topic.relatedHireLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-3xl border border-border bg-muted/30 p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {topic.cta.title}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {topic.cta.description}
          </p>
          <Button asChild size="lg" className="mt-6 rounded-full gap-2">
            <Link href={topic.cta.href}>
              {topic.cta.label}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={breadcrumbJsonLd}
      />
    </>
  );
}
