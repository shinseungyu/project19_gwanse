import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "연락처",
  description: "관세계산기(gwanse.kr) 문의 안내. 관세 정보 오류 제보, 내용 요청, 제휴 및 일반 문의를 이메일로 받고 있습니다.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const h2 = { fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 } as const;
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px", fontFamily: "inherit" }}>
      <Link href="/" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>← 홈으로</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "20px 0 8px" }}>연락처</h1>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 32 }}>문의 및 제보 안내</p>
      <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.85 }}>
        <p>관세계산기(gwanse.kr)를 이용해 주셔서 감사합니다. 아래 이메일로 문의를 보내주시면 확인 후 순차적으로 답변드립니다.</p>

        <div style={{ margin: "24px 0", padding: "20px 24px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>이메일 문의</p>
          <a href="mailto:contact@gwanse.kr" style={{ fontSize: 20, fontWeight: 800, color: "#2563eb" }}>contact@gwanse.kr</a>
        </div>

        <h2 style={h2}>이런 문의를 받습니다</h2>
        <ul style={{ marginLeft: 18, listStyleType: "disc" }}>
          <li><strong>관세 정보 오류 제보</strong> — 세율·한도가 바뀌었거나 잘못된 부분을 발견하셨다면 알려주세요.</li>
          <li><strong>내용 요청</strong> — 다뤄줬으면 하는 국가·품목·주제</li>
          <li><strong>제휴·광고 문의</strong></li>
          <li><strong>기타 일반 문의</strong></li>
        </ul>

        <h2 style={h2}>답변 안내</h2>
        <p>
          문의는 보통 영업일 기준 2~3일 이내에 답변드리도록 노력하고 있습니다. 개인 운영 사이트 특성상 답변이 다소
          늦어질 수 있는 점 양해 부탁드립니다. 개인정보 관련 요청은{" "}
          <Link href="/privacy-policy" style={{ color: "#2563eb" }}>개인정보 처리방침</Link>의 안내에 따라 처리됩니다.
        </p>

        <p style={{ marginTop: 28 }}>
          사이트에 대한 더 자세한 내용은 <Link href="/about" style={{ color: "#2563eb" }}>사이트 소개</Link>를 참고해 주세요.
        </p>
      </div>
    </div>
  );
}
