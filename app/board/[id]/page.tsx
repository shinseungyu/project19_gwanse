import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import postsData from "@/data/posts.json";
import styles from "../../page.module.css";

interface Post {
  id: number;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
}

const allPosts = postsData as Post[];

export function generateStaticParams() {
  return allPosts.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = allPosts.find((p) => p.id === Number(id));
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    alternates: { canonical: `/board/${post.id}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BoardPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = allPosts.find((p) => p.id === Number(id));
  if (!post) notFound();

  const otherPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 4);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    keywords: (post.tags || []).join(", "),
    inLanguage: "ko",
    author: { "@type": "Organization", name: "관세계산기" },
    publisher: { "@type": "Organization", name: "관세계산기" },
  };

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
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
                <Link key={p.id} href={`/board/${p.id}`} style={{ textDecoration: "none", display: "block", padding: "14px 16px", background: "white", border: "1px solid var(--border-color)", borderRadius: 10 }}>
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
