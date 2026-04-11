import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "해외직구 필수 계산기 — 합산과세 체크·단위변환·배송비 한번에",
  description:
    "같은 날 여러 건 직구하면 합산과세 대상! 입항일 중복 여부를 즉시 체크하고 세금 폭탄을 미리 피하세요. 관세계산기가 자동으로 계산해드립니다.",
  alternates: { canonical: "/combined-tax" },
  keywords: ["합산과세 계산기", "합산과세 피하는 법", "직구 합산과세", "해외직구 세금 폭탄", "입항일 체크", "합산과세 기준"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
