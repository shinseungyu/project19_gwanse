import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://gwanse.kr";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/combined-tax`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/qna`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/board`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/terms-of-service`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/cookie-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
