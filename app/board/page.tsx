"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import postsData from "@/data/posts.json";
import styles from "../page.module.css";

function BoardContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [search, setSearch] = useState("");

  if (id) {
    const post = postsData.find((p) => p.id === Number(id));
    if (!post) return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <p style={{ color: "var(--text-secondary)" }}>게시글을 찾을 수 없습니다.</p>
          <Link href="/board" style={{ color: "var(--primary)", fontWeight: 700 }}>← 목록으로</Link>
        </div>
      </div>
    );
    const otherPosts = postsData.filter((p) => p.id !== post.id).slice(0, 4);
    return (
      <div className={styles.container}>
        <div className={styles.wrapper} style={{ maxWidth: 720 }}>
          <Link href="/board" style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none", fontWeight: 600, display: "inline-block", marginBottom: 24 }}>
            ← 목록으로
          </Link>
          <article className={styles.card}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{post.category}</span>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: "10px 0 8px", lineHeight: 1.4 }}>{post.title}</h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>📅 {post.date}</p>
            <div style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, whiteSpace: "pre-line" }}>
              {post.content}
            </div>
            {post.tags && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-color)" }}>
                {post.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: 12, padding: "4px 10px", background: "var(--primary-light)", color: "var(--primary)", borderRadius: 100, fontWeight: 600 }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* 다른 글 보기 */}
          {otherPosts.length > 0 && (
            <section style={{ marginTop: 32 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: "var(--text-primary)" }}>다른 글 보기</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {otherPosts.map((p) => (
                  <Link key={p.id} href={`/board?id=${p.id}`} style={{ textDecoration: "none", display: "block", padding: "14px 16px", background: "white", border: "1px solid var(--border-color)", borderRadius: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>{p.category}</span>
                    <p style={{ margin: "5px 0 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>{p.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  const categories = ["전체", ...Array.from(new Set(postsData.map((p) => p.category)))];
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered = postsData.filter((p) => {
    const matchSearch = p.title.includes(search) || p.summary.includes(search) || p.category.includes(search);
    const matchCategory = activeCategory === "전체" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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
                href={`/board?id=${post.id}`}
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

export default function BoardPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>로딩 중...</div>}>
      <BoardContent />
    </Suspense>
  );
}
