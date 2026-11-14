export const site = {
  name: "Blog",
  tagline: "Maybe once a year",
  description:
    "My personal blog, post maybe once a year on a good year.",
  url: "https://blog.kollod.dev",
  author: "Anson",
  links: [
    { label: "GitHub", href: "https://github.com/Anson10124" },
    { label: "X", href: "https://x.com/Anson10124" },
  ],
  // InsightFlare analytics. Only loaded in production builds so local dev
  // doesn't pollute the stats (the tracker records the page hostname).
  insightflare: {
    scriptUrl: "https://insight.kollod.dev/script.js",
    siteId: "368a45ea-9589-46bf-94a5-b00105119507",
  },
  giscus: {
    repo: "Anson10124/blog",
    repoId: "R_kgDOVuNwmA",
    category: "Announcements",
    categoryId: "DIC_kwDOVuNwmM4DLHo1",
  },
} as const;
