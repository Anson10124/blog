import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Lets .mdx files be imported (and used as pages) alongside .ts/.tsx.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  options: {
    // Plugins are named as strings (not imported) because Turbopack can only
    // pass serializable options through to the MDX compiler.
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      // Gives every heading an id so sections can be linked with #fragments.
      "rehype-slug",
      // Syntax highlighting at build time, with a light and a dark theme.
      [
        "rehype-pretty-code",
        {
          theme: { light: "github-light", dark: "github-dark-dimmed" },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
