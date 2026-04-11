import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관",
  description: "관세계산기 서비스의 이용약관입니다.",
};

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px", fontFamily: "inherit" }}>
      <Link href="/" style={{ fontSize: 13, color: "#059669", textDecoration: "none", fontWeight: 600 }}>← 홈으로</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "20px 0 8px" }}>이용약관</h1>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 32 }}>최종 업데이트: 2026년 4월 1일</p>
      <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.85 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>제1조 목적</h2>
        <p>본 약관은 관세계산기(이하 "서비스") 이용에 관한 조건과 절차를 규정합니다.</p>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>제2조 서비스 내용</h2>
        <p>서비스는 해외직구 관세 및 부가세를 참고용으로 계산하는 기능을 제공합니다. 계산 결과는 실시간 환율과 일반적인 세율을 기반으로 하며, 실제 관세액은 한국 세관의 최종 판단에 따릅니다.</p>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>제3조 면책사항</h2>
        <p>본 서비스는 참고용 정보만을 제공하며, 실제 통관 결과에 대한 법적 책임을 지지 않습니다. 정확한 관세 산출은 관세청 또는 관세사에 문의하시기 바랍니다.</p>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>제4조 서비스 변경 및 중단</h2>
        <p>운영상 필요에 의해 서비스를 사전 고지 없이 변경하거나 중단할 수 있습니다.</p>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>제5조 문의</h2>
        <p>이용약관에 관한 문의는 contact@gwanse.kr으로 연락하시기 바랍니다.</p>
      </div>
    </div>
  );
}
