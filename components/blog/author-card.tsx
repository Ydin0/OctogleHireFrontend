import Image from "next/image";
import Link from "next/link";
import { Linkedin, Twitter } from "lucide-react";

import type { Author } from "@/lib/data/authors";

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6">
      <div className="flex items-start gap-4">
        <Image
          src={author.avatar}
          alt={author.name}
          width={56}
          height={56}
          className="size-14 rounded-full object-cover ring-2 ring-border"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{author.name}</p>
          <p className="text-xs text-muted-foreground">{author.title}</p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {author.bio}
          </p>
          <div className="mt-3 flex items-center gap-3">
            {author.social.linkedin && (
              <Link
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Linkedin className="size-4" />
              </Link>
            )}
            {author.social.twitter && (
              <Link
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Twitter className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
