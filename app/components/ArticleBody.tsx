import type { Block } from "@/lib/article";

/**
 * 파싱된 본문 블록을 시맨틱 HTML 로 렌더한다.
 * 이전에는 본문 전체를 whiteSpace: pre-line 인 <div> 하나에 통째로 넣어서
 * 크롤러 입장에서는 소제목도 목록도 없는 텍스트 덩어리 하나였다.
 */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85 }}>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2
                key={i}
                id={block.id}
                style={{
                  scrollMarginTop: 80,
                  margin: "32px 0 12px",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  lineHeight: 1.45,
                }}
              >
                {block.text}
              </h2>
            );

          case "ul":
            return (
              <ul key={i} style={{ margin: "0 0 18px", paddingLeft: 20 }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: 6 }}>
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={i} style={{ margin: "0 0 18px", paddingLeft: 22 }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: 6 }}>
                    {item}
                  </li>
                ))}
              </ol>
            );

          case "check":
            return (
              <ul
                key={i}
                style={{
                  margin: "0 0 18px",
                  padding: 16,
                  listStyle: "none",
                  background: "var(--primary-light)",
                  borderRadius: 10,
                  display: "grid",
                  gap: 8,
                }}
              >
                {block.items.map((item, j) => (
                  <li key={j} style={{ display: "flex", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    <span aria-hidden="true" style={{ color: "var(--primary)" }}>
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "faq":
            return (
              <dl
                key={i}
                style={{
                  margin: "0 0 18px",
                  border: "1px solid var(--border-color)",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "white",
                }}
              >
                {block.items.map((item, j) => (
                  <div
                    key={j}
                    style={{
                      padding: 16,
                      borderTop: j === 0 ? "none" : "1px solid var(--border-color)",
                    }}
                  >
                    <dt style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, fontSize: 14 }}>
                      Q. {item.q}
                    </dt>
                    <dd style={{ margin: 0, fontSize: 14 }}>A. {item.a}</dd>
                  </div>
                ))}
              </dl>
            );

          default:
            return (
              <p key={i} style={{ margin: "0 0 14px" }}>
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}

/** 글 상단 목차. 체류시간과 내부 앵커 링크를 동시에 확보한다. */
export function ArticleToc({ headings }: { headings: { id: string; text: string }[] }) {
  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="목차"
      style={{
        margin: "0 0 28px",
        padding: 16,
        background: "var(--primary-light)",
        borderRadius: 10,
      }}
    >
      <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>
        이 글의 목차
      </p>
      <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.9 }}>
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
