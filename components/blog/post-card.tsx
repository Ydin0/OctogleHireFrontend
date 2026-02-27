import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Post } from "@/lib/blog";
import { resolveAuthor } from "@/lib/data/authors";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const author = resolveAuthor(post.author);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:bg-muted/50">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-pulse">
            {post.title}
          </h2>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {post.description}
        </p>

        {/* Footer: author + date */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2.5">
            <Image
              src={author.avatar}
              alt={author.name}
              width={24}
              height={24}
              className="size-6 rounded-full object-cover ring-1 ring-border"
            />
            <span className="text-xs text-muted-foreground">
              {author.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <time
              dateTime={post.date}
              className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </time>
            <span className="font-mono text-[10px] text-muted-foreground/60">
              {post.readingTime}m
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
