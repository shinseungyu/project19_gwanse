import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "관세계산기 서비스의 개인정보 처리방침입니다.",
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px", fontFamily: "inherit" }}>
      <Link href="/" style={{ fontSize: 13, color: "#059669", textDecoration: "none", fontWeight: 600 }}>← 홈으로</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "20px 0 8px" }}>개인정보 처리방침</h1>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 32 }}>최종 업데이트: 2026년 4월 1일</p>
      <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.85 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>1. 수집하는 개인정보</h2>
        <p>본 서비스는 회원가입 없이 이용 가능하며, 별도의 개인정보를 수집하지 않습니다. 관세 계산 시 입력하는 가격 정보는 서버에 저장되지 않습니다.</p>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>2. 자동 수집 정보</h2>
        <p>서비스 개선을 위해 Google Analytics 및 Vercel Analytics를 통해 페이지 방문 통계(방문자 수, 접속 국가, 사용 기기 등)를 익명으로 수집할 수 있습니다. 이 정보는 개인 식별에 사용되지 않습니다.</p>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>3. 쿠키 사용</h2>
        <p>본 서비스는 서비스 운영에 필요한 기능성 쿠키와 방문자 분석을 위한 분석 쿠키를 사용할 수 있습니다. 브라우저 설정에서 쿠키를 비활성화할 수 있습니다.</p>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>4. 제3자 제공</h2>
        <p>수집된 정보는 법령에 따른 경우를 제외하고 제3자에게 제공하지 않습니다.</p>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>5. 문의</h2>
        <p>개인정보 처리에 관한 문의는 contact@gwanse.kr으로 연락하시기 바랍니다.</p>
      </div>
    </div>
  );
}
