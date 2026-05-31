import type { Metadata } from "next";
import Script from "next/script";
import postsData from "@/data/posts.json";

export const metadata: Metadata = {
  title: "관세 정보 게시판 — 해외직구 절세 팁 & 관세 최신 뉴스",
  description:
    "관세계산기 정보 게시판. 일본 직구 절세 노하우, 합산과세 피하는 법, 아이허브·쉬인 직구 세금, 명품 직구 관세, 나라별 면세한도 등 해외직구 관세 관련 최신 정보를 확인하세요.",
  alternates: { canonical: "/board" },
  keywords: [
    "해외직구 관세 정보",
    "직구 절세 팁",
    "관세 최신 뉴스",
    "일본 직구 팁",
    "합산과세 피하는 법",
    "면세 한도 변경",
    "아이허브 관세",
    "쉬인 직구 관세",
    "명품 직구 관세",
    "나라별 면세한도",
  ],
};

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://gwanse.kr";

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "해외직구 관세 정보 게시판",
  description: "해외직구 관세·면세한도·절세 팁 관련 최신 정보 모음",
  url: `${base}/board`,
  numberOfItems: postsData.length,
  itemListElement: postsData.map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${base}/board?id=${post.id}`,
    name: post.title,
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: base },
    { "@type": "ListItem", position: 2, name: "관세 정보 게시판", item: `${base}/board` },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="board-itemlist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Script
        id="board-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
