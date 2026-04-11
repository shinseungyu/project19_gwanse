import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "해외직구 관세 완벽 가이드 — 면세 한도·목록통관·절세 팁 총정리",
  description:
    "관세계산기 공식 가이드. $150·$200 면세 한도 기준, 목록통관 vs 일반통관 차이, 일본 직구 절세 팁까지 한눈에 정리했습니다.",
  alternates: { canonical: "/guide" },
  keywords: ["해외직구 관세 가이드", "면세 한도 기준", "목록통관 일반통관 차이", "직구 절세 팁", "일본 직구 관세율", "관세 계산 방법"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
