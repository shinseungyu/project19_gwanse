import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "사이트 소개",
  description: "관세계산기(gwanse.kr)는 해외직구 관세·부가세를 실시간 환율로 계산하고, 통관·절세 정보를 정리해 제공하는 개인 운영 정보 사이트입니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const h2 = { fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 } as const;
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px", fontFamily: "inherit" }}>
      <Link href="/" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>← 홈으로</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "20px 0 8px" }}>사이트 소개</h1>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 32 }}>관세계산기 · gwanse.kr</p>
      <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.85 }}>
        <h2 style={h2}>어떤 사이트인가요?</h2>
        <p>
          관세계산기(gwanse.kr)는 해외직구 시 헷갈리는 관세와 부가세를 누구나 쉽게 계산할 수 있도록 만든 정보 제공
          사이트입니다. 일본·미국·중국 등 국가별 직구 관세를 실시간 환율로 즉시 계산하고, 면세 한도, 합산과세,
          품목별 세율, 통관 절차 같은 실전 정보를 함께 정리해 제공합니다.
        </p>

        <h2 style={h2}>이런 정보를 다룹니다</h2>
        <ul style={{ marginLeft: 18, listStyleType: "disc" }}>
          <li>국가별·품목별 <strong>관세·부가세 계산</strong>과 면세 한도 안내</li>
          <li><strong>합산과세</strong> 개념과 회피 방법</li>
          <li>면세점 입국 한도, <strong>목록통관 vs 일반통관</strong> 등 통관 실무</li>
          <li>배송대행·개인통관고유부호 등 <strong>직구 절세 팁</strong></li>
        </ul>

        <h2 style={h2}>정보의 신뢰성</h2>
        <p>
          모든 콘텐츠는 관세청 등 공개 자료를 바탕으로 이해하기 쉽게 재구성한 것입니다. 관세 제도와 면세 한도,
          세율은 정책에 따라 바뀔 수 있으므로 실제 통관 전에는 관세청 또는 관세사를 통해 최신 기준을 확인하시기
          바랍니다. 계산 결과는 참고용 추정치이며 실제 세액은 세관의 최종 판단에 따릅니다.
        </p>

        <h2 style={h2}>운영 주체</h2>
        <p>
          본 사이트는 <strong>개인이 운영</strong>하는 정보 제공 목적의 웹사이트입니다. 회원가입 없이 무료로 이용할 수
          있으며, 운영 비용 충당을 위해 Google AdSense 광고가 게재됩니다.
        </p>
        <ul style={{ marginLeft: 18, listStyleType: "disc" }}>
          <li><strong>운영:</strong> 관세계산기 운영자 (개인)</li>
          <li><strong>문의:</strong> <a href="mailto:contact@gwanse.kr" style={{ color: "#2563eb" }}>contact@gwanse.kr</a></li>
        </ul>

        <p style={{ marginTop: 28 }}>
          문의는 <Link href="/contact" style={{ color: "#2563eb" }}>연락처 페이지</Link>를,
          개인정보 처리에 관한 내용은 <Link href="/privacy-policy" style={{ color: "#2563eb" }}>개인정보 처리방침</Link>을 참고해 주세요.
        </p>
      </div>
    </div>
  );
}
