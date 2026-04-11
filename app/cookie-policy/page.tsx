import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "쿠키 정책",
  description: "관세계산기 서비스의 쿠키 정책입니다.",
};

export default function CookiePolicyPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px", fontFamily: "inherit" }}>
      <Link href="/" style={{ fontSize: 13, color: "#059669", textDecoration: "none", fontWeight: 600 }}>← 홈으로</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "20px 0 8px" }}>쿠키 정책</h1>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 32 }}>최종 업데이트: 2026년 4월 1일</p>
      <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.85 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>쿠키란?</h2>
        <p>쿠키는 웹사이트가 사용자의 브라우저에 저장하는 소량의 텍스트 파일입니다. 서비스 이용 편의성 향상과 방문 통계 분석에 활용됩니다.</p>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>사용하는 쿠키 종류</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 1.85 }}>
          <li><strong>필수 쿠키:</strong> 서비스 기본 기능 운영에 필요한 쿠키입니다.</li>
          <li><strong>분석 쿠키:</strong> Google Analytics, Vercel Analytics를 통한 익명 방문 통계 수집에 사용됩니다.</li>
          <li><strong>광고 쿠키:</strong> Google AdSense를 통한 광고 표시에 사용될 수 있습니다.</li>
        </ul>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>쿠키 비활성화</h2>
        <p>브라우저 설정에서 쿠키를 비활성화할 수 있습니다. 단, 일부 기능이 정상적으로 동작하지 않을 수 있습니다.</p>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>문의</h2>
        <p>쿠키 정책에 관한 문의는 contact@gwanse.kr으로 연락하시기 바랍니다.</p>
      </div>
    </div>
  );
}
