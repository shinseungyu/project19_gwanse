import type { FaqItem, Post } from "./article";
import { countWords, lastModifiedOf } from "./article";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gwanse.kr";
export const SITE_NAME = "관세계산기";
export const OG_IMAGE = `${SITE_URL}/thumb.webp`;

/** 사이트 전역 발행 주체. Article/FAQ 스키마에서 재사용한다. */
export const publisher = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: OG_IMAGE,
    width: 1200,
    height: 630,
  },
};

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "홈", path: "/" }, ...trail].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function faqLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Article 리치결과 요건을 채운 스키마.
 * 기존에는 image / mainEntityOfPage / publisher.logo 가 없어 리치결과 대상이 아니었다.
 */
export function articleLd(post: Post) {
  const url = `${SITE_URL}/board/${post.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title.slice(0, 110),
    description: post.summary,
    image: [OG_IMAGE],
    datePublished: post.date,
    dateModified: lastModifiedOf(post),
    articleSection: post.category,
    keywords: (post.tags || []).join(", "),
    wordCount: countWords(post.content),
    inLanguage: "ko",
    isAccessibleForFree: true,
    author: publisher,
    publisher,
  };
}
