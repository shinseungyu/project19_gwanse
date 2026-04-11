import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "해외직구 관세 Q&A — 면세 한도·합산과세·영양제 통관 궁금증 해결",
  description:
    "직구 관세 계산이 헷갈리시나요? 면세 한도 기준, 합산과세 회피법, 영양제·식품 통관 주의사항까지 자주 묻는 질문을 모두 정리했습니다.",
  alternates: { canonical: "/qna" },
  keywords: ["해외직구 관세 질문", "면세 한도 FAQ", "합산과세 질문", "영양제 통관", "직구 관세 궁금증", "관세 계산 질문"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
