import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관세 정보 게시판 — 해외직구 절세 팁 & 관세 최신 뉴스",
  description:
    "관세계산기 정보 게시판. 일본 직구 절세 노하우, 합산과세 피하는 법, 면세 한도 변경 소식 등 해외직구 관세 관련 최신 정보를 확인하세요.",
  alternates: { canonical: "/board" },
  keywords: ["해외직구 관세 정보", "직구 절세 팁", "관세 최신 뉴스", "일본 직구 팁", "합산과세 피하는 법", "면세 한도 변경"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
