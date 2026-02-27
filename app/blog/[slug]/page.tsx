import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { MDXContent } from "@/components/blog/mdx-content";
import { AuthorCard } from "@/components/blog/author-card";
import { SourcesSection } from "@/components/blog/sources-section";
import { getPublishedPosts, getPostBySlug, getPostAuthor } from "@/lib/blog";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: absoluteUrl(`/blog/${slug}`) },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630 }],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = getPostAuthor(post);
  const isNamedAuthor = author.slug !== "octoglehire-team";

  const blogPostingJsonLd = buildJsonLd({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: isNamedAuthor
      ? {
          "@type": "Person",
          name: author.name,
          url: author.social.linkedin,
          image: absoluteUrl(author.avatar),
          jobTitle: author.title,
        }
      : {
          "@type": "Organization",
          name: author.name,
        },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
    keywords: post.tags.join(", "),
    ...(post.sources && post.sources.length > 0
      ? {
          citation: post.sources.map((s) => ({
            "@type": "CreativeWork",
            name: s.title,
            url: s.url,
            ...(s.publisher ? { publisher: { "@type": "Organization", name: s.publisher } } : {}),
          })),
        }
      : {}),
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
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: absoluteUrl(`/blog/${slug}`),
      },
    ],
  });

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-16">
        <article className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; Back to blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <time
                dateTime={post.date}
                className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {post.readingTime} min read
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {post.description}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Image
                src={author.avatar}
                alt={author.name}
                width={24}
                height={24}
                className="size-6 rounded-full object-cover ring-1 ring-border"
              />
              <span className="text-sm text-muted-foreground">
                {author.name}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </header>

          {/* Cover image */}
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXContent code={post.body} />
          </div>

          {/* Sources */}
          {post.sources && <SourcesSection sources={post.sources} />}

          {/* Author */}
          <AuthorCard author={author} />
        </article>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={blogPostingJsonLd}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={breadcrumbJsonLd}
      />
    </>
  );
}
