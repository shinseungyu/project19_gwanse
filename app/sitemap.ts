import type { MetadataRoute } from "next";
import postsData from "@/data/posts.json";
import { lastModifiedOf } from "@/lib/article";

/**
 * lastModified 는 "실제 콘텐츠가 바뀐 날"만 넣는다.
 * 이전에는 전부 new Date() 라서 배포할 때마다 모든 URL 이 수정된 것처럼 나갔고,
 * 그렇게 되면 구글은 이 사이트의 lastmod 를 신뢰하지 않고 통째로 무시한다.
 * 날짜를 모르는 정책 페이지는 아예 값을 넣지 않는다(잘못된 값보다 없는 편이 낫다).
 */
const CONTENT_UPDATED = new Date("2026-09-06");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://gwanse.kr";

  const postUrls: MetadataRoute.Sitemap = postsData.map((p) => ({
    url: `${base}/board/${p.id}`,
    lastModified: new Date(lastModifiedOf(p)),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/combined-tax`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/guide`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/qna`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/board`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    ...postUrls,
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms-of-service`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cookie-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
