import fs from "node:fs";
import path from "node:path";

const postsPath = path.join(process.cwd(), ".velite", "posts.json");
const posts: Post[] = JSON.parse(fs.readFileSync(postsPath, "utf-8"));

export interface Post {
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  published: boolean;
  slug: string;
  body: string;
  readingTime: number;
}

export function getPublishedPosts(): Post[] {
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug && post.published);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  posts
    .filter((post) => post.published)
    .forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): Post[] {
  return getPublishedPosts().filter((post) => post.tags.includes(tag));
}
