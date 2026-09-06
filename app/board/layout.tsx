import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관세 정보 게시판 — 해외직구 절세 팁 & 관세 최신 뉴스",
  description:
    "관세계산기 정보 게시판. 일본 직구 절세 노하우, 합산과세 피하는 법, 아이허브·쉬인 직구 세금, 명품 직구 관세, 나라별 면세한도 등 해외직구 관세 관련 최신 정보를 확인하세요.",
  alternates: { canonical: "/board" },
  keywords: [
    "해외직구 관세 정보",
    "직구 절세 팁",
    "관세 최신 뉴스",
    "일본 직구 팁",
    "합산과세 피하는 법",
    "면세 한도 변경",
    "아이허브 관세",
    "쉬인 직구 관세",
    "명품 직구 관세",
    "나라별 면세한도",
  ],
};

/**
 * 목록용 구조화 데이터(ItemList / CollectionPage / BreadcrumbList)는 여기가 아니라
 * app/board/page.tsx 에 있다. 이 레이아웃은 /board/[id] 개별 글에도 함께 적용되기 때문에,
 * 여기에 두면 글 페이지가 Article 이면서 동시에 CollectionPage 로 선언되고
 * BreadcrumbList 도 두 벌 나가서 스키마가 서로 충돌한다.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
