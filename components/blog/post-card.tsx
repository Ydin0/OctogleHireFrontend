import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/lib/blog";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-muted/50">
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
      <div className="p-5">
        <div className="mb-3 flex items-center gap-3">
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
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {post.readingTime} min read
          </span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-lg font-semibold leading-snug tracking-tight">
            {post.title}
          </h2>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {post.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
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
      </div>
    </article>
  );
}
