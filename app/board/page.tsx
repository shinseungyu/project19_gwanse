"use client";

import { useState } from "react";
import Link from "next/link";
import postsData from "@/data/posts.json";
import styles from "../page.module.css";
import { lastModifiedOf } from "@/lib/article";
import { SITE_NAME, SITE_URL, breadcrumbLd } from "@/lib/seo";

// 목록용 구조화 데이터. 레이아웃에 두면 /board/[id] 개별 글에도 상속돼
// Article 과 CollectionPage 가 한 페이지에 같이 선언되므로 목록 페이지에서만 렌더한다.
// ItemList 의 url 이 예전 쿼리 주소(/board?id=N)로 남아 있어
// 구글에 같은 목록 페이지를 가리키는 URL 16개가 중복으로 신고되고 있었다.
const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "해외직구 관세 정보 게시판",
  description: "해외직구 관세·면세한도·절세 팁 관련 최신 정보 모음",
  url: `${SITE_URL}/board`,
  numberOfItems: postsData.length,
  itemListElement: postsData.map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}/board/${post.id}`,
    name: post.title,
  })),
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "해외직구 관세 정보 게시판",
  description: "해외직구 관세·면세한도·절세 팁 관련 정보 모음",
  url: `${SITE_URL}/board`,
  inLanguage: "ko",
  isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  dateModified: postsData.map((p) => lastModifiedOf(p)).sort().reverse()[0],
};

export default function BoardPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");

  const categories = ["전체", ...Array.from(new Set(postsData.map((p) => p.category)))];

  const filtered = postsData.filter((p) => {
    const matchSearch = p.title.includes(search) || p.summary.includes(search) || p.category.includes(search);
    const matchCategory = activeCategory === "전체" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {[collectionJsonLd, itemListJsonLd, breadcrumbLd([{ name: "관세 정보 게시판", path: "/board" }])].map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <header className={styles.header}>
          <span className={styles.headerBadge}>관세 정보</span>
          <h1 className={styles.title}>관세 정보 게시판</h1>
          <p className={styles.subtitle}>해외직구 관세, 일본 직구 팁, 합산과세 절세 전략 등 유용한 정보를 모았습니다.</p>
        </header>

        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            className={styles.input}
            placeholder="검색어를 입력하세요 (제목, 카테고리)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 카테고리 필터 */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "5px 14px",
                borderRadius: 100,
                border: `1.5px solid ${activeCategory === cat ? "var(--primary)" : "var(--border-color)"}`,
                background: activeCategory === cat ? "var(--primary)" : "white",
                color: activeCategory === cat ? "white" : "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>검색 결과가 없습니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((post) => (
              <Link
                key={post.id}
                href={`/board/${post.id}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  className={styles.card}
                  style={{ cursor: "pointer", transition: "box-shadow 0.15s, transform 0.15s" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                    (e.currentTarget as HTMLDivElement).style.transform = "";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {post.category}
                      </span>
                      <h2 style={{ margin: "6px 0 6px", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.4 }}>
                        {post.title}
                      </h2>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        {post.summary}
                      </p>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {post.date}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
