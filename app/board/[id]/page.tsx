import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import postsData from "@/data/posts.json";
import styles from "../../page.module.css";
import type { Post } from "@/lib/article";
import { parseArticle, extractFaqs, extractHeadings, relatedPosts, lastModifiedOf } from "@/lib/article";
import { ArticleBody, ArticleToc } from "../../components/ArticleBody";
import { SITE_NAME, SITE_URL, OG_IMAGE, articleLd, breadcrumbLd, faqLd } from "@/lib/seo";

const allPosts = postsData as Post[];

/** 글 주제에 맞는 도구 페이지로 내보내는 CTA. 글 → 계산기 딥링크가 없어 게시판이 고립돼 있었다. */
function ctaFor(post: Post): { href: string; label: string; desc: string } {
  const text = `${post.category} ${post.title} ${(post.tags || []).join(" ")}`;

  if (/합산과세|입항일|분할 배송/.test(text)) {
    return {
      href: "/combined-tax",
      label: "합산과세 체크하기",
      desc: "같은 날 입항하는 주문이 있는지 확인하고 합산과세 여부를 미리 점검하세요.",
    };
  }
  if (/면세 한도|나라별|기초|통관|개인통관고유부호/.test(text)) {
    return {
      href: "/guide",
      label: "해외직구 관세 가이드 보기",
      desc: "면세 한도 기준과 목록통관·일반통관 차이를 한번에 정리했습니다.",
    };
  }
  return {
    href: "/",
    label: "내 주문 관세 계산해보기",
    desc: "물건값과 배송비를 넣으면 실시간 환율로 관세·부가세가 바로 계산됩니다.",
  };
}

export function generateStaticParams() {
  return allPosts.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = allPosts.find((p) => p.id === Number(id));
  if (!post) return {};

  const url = `${SITE_URL}/board/${post.id}`;
  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    alternates: { canonical: `/board/${post.id}` },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.summary,
      url,
      type: "article",
      publishedTime: post.date,
      modifiedTime: lastModifiedOf(post),
      section: post.category,
      tags: post.tags,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [OG_IMAGE],
    },
  };
}

export default async function BoardPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = allPosts.find((p) => p.id === Number(id));
  if (!post) notFound();

  const blocks = parseArticle(post.content);
  const headings = extractHeadings(blocks);
  const faqs = extractFaqs(blocks);
  const related = relatedPosts(allPosts, post, 4);
  const cta = ctaFor(post);
  const updated = lastModifiedOf(post);

  const schemas: object[] = [
    articleLd(post),
    breadcrumbLd([
      { name: "관세 정보 게시판", path: "/board" },
      { name: post.title, path: `/board/${post.id}` },
    ]),
  ];
  if (faqs.length > 0) schemas.push(faqLd(faqs));

  return (
    <div className={styles.container}>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className={styles.wrapper} style={{ maxWidth: 720 }}>
        <nav
          aria-label="breadcrumb"
          style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, display: "flex", gap: 6, flexWrap: "wrap" }}
        >
          <Link href="/" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>홈</Link>
          <span aria-hidden="true">/</span>
          <Link href="/board" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>관세 정보 게시판</Link>
          <span aria-hidden="true">/</span>
          <span>{post.category}</span>
        </nav>

        <article className={styles.card}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{post.category}</span>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "10px 0 10px", lineHeight: 1.4 }}>{post.title}</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 14px" }}>{post.summary}</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
            작성 <time dateTime={post.date}>{post.date}</time>
            {updated !== post.date && (
              <>
                {" · "}최종 수정 <time dateTime={updated}>{updated}</time>
              </>
            )}
          </p>

          <ArticleToc headings={headings} />
          <ArticleBody blocks={blocks} />

          {post.tags && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-color)" }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{ fontSize: 12, padding: "4px 10px", background: "var(--primary-light)", color: "var(--primary)", borderRadius: 100, fontWeight: 600 }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <aside
            style={{
              marginTop: 28,
              padding: 20,
              borderRadius: 12,
              background: "var(--primary-light)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "var(--primary)" }}>직접 계산해보기</p>
            <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{cta.desc}</p>
            <Link
              href={cta.href}
              style={{
                display: "inline-block",
                padding: "11px 20px",
                borderRadius: 10,
                background: "var(--primary)",
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {cta.label} →
            </Link>
          </aside>
        </article>

        {related.length > 0 && (
          <section style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: "var(--text-primary)" }}>함께 보면 좋은 글</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {related.map((p) => (
                <Link key={p.id} href={`/board/${p.id}`} style={{ textDecoration: "none", display: "block", padding: "14px 16px", background: "white", border: "1px solid var(--border-color)", borderRadius: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>{p.category}</span>
                  <p style={{ margin: "5px 0 0", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>{p.title}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>{p.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div style={{ marginTop: 28 }}>
          <Link href="/board" style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            ← 관세 정보 게시판 전체 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
