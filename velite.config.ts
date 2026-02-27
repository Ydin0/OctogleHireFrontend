import { defineConfig, s } from "velite";

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: {
    posts: {
      name: "Post",
      pattern: "blog/**/*.mdx",
      schema: s
        .object({
          title: s.string().max(120),
          description: s.string().max(260),
          date: s.isodate(),
          author: s.string(),
          image: s.string(),
          tags: s.array(s.string()).default([]),
          sources: s
            .array(
              s.object({
                title: s.string(),
                url: s.string(),
                publisher: s.string().optional(),
              }),
            )
            .default([]),
          published: s.boolean().default(true),
          slug: s.path(),
          body: s.mdx(),
        })
        .transform((data) => {
          // Strip "blog/" prefix from slug
          const slug = data.slug.replace(/^blog\//, "");
          // Estimate reading time (~200 wpm)
          const words = data.body.split(/\s+/g).length;
          const readingTime = Math.max(1, Math.ceil(words / 200));
          return { ...data, slug, readingTime };
        }),
    },
  },
});
