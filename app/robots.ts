import type { MetadataRoute } from "next";
import { site } from "@/site.config";

// Served at /robots.txt: everything may be crawled, and here is the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
