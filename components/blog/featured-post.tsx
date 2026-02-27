import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Post } from "@/lib/blog";
import { resolveAuthor } from "@/lib/data/authors";

interface FeaturedPostProps {
  post: Post;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const author = resolveAuthor(post.author);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-muted/30">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[400px]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-foreground px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-background">
                Featured
              </span>
              <time
                dateTime={post.date}
                className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>

            <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              {post.title}
            </h2>

            <p className="mt-4 line-clamp-3 text-muted-foreground leading-relaxed">
              {post.description}
            </p>

            {/* Author */}
            <div className="mt-6 flex items-center gap-3">
              <Image
                src={author.avatar}
                alt={author.name}
                width={32}
                height={32}
                className="size-8 rounded-full object-cover ring-1 ring-border"
              />
              <div>
                <p className="text-sm font-medium">{author.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {post.readingTime} min read
                </p>
              </div>
            </div>

            {/* Read more */}
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors group-hover:text-pulse">
              Read article
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
