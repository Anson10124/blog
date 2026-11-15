import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/site.config";

// Served at /sitemap.xml: the home page plus every published post.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    {
      url: site.url,
      // The home page changes whenever a new post is published.
      lastModified: posts[0]?.date,
    },
    ...posts.map((post) => ({
      url: `${site.url}/posts/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
