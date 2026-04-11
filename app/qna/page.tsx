"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import styles from "../page.module.css";

const FAQS = [
  {
    q: "해외직구 면세 한도는 얼마인가요?",
    a: `미국에서 출발한 물건은 USD $200 이하면 면세입니다. 일본·중국·유럽 등 기타 국가는 USD $150 이하가 면세 기준입니다. 단, 면세 한도는 물건 가격 + 배송비를 합산한 금액 기준이며, 일본·중국은 현지 통화를 USD로 환산해서 비교합니다.\n\n예를 들어 일본에서 ¥20,000(약 $135)짜리 물건을 배송비 ¥1,500(약 $10)과 함께 구매하면 USD 환산 $145로 면세 대상이지만, 배송비가 올라가면 $150을 넘어 과세될 수 있습니다.`,
  },
  {
    q: "합산과세란 무엇이고, 어떻게 피하나요?",
    a: `합산과세는 같은 나라에서 출발한 물건 2개 이상이 같은 날 한국에 도착하면, 세관이 모든 금액을 합산해 과세하는 제도입니다. 각각 면세 한도 이내라도 합산하면 초과할 수 있습니다.\n\n피하는 방법:\n① 첫 번째 물건이 통관 완료된 후 다음 물건의 배송비를 결제\n② 출발 국가를 다르게 구매 (미국 + 일본)\n③ 수취인 정보(이름·개인통관고유부호)를 다르게 설정 (가족 명의 활용)`,
  },
  {
    q: "일본 직구 관세는 어떻게 계산되나요?",
    a: `일본 직구는 엔화(JPY) 가격을 당일 USD 환율로 환산해 $150 초과 여부를 판단합니다.\n\n$150을 초과하면:\n· 관세 = 상품 원화 환산 금액 × 품목별 관세율\n  (의류 13%, 화장품 6.5%, 전자제품 0%, 기타 8%)\n· 부가세 = (원화 환산 금액 + 관세) × 10%\n· 총 세금 = 관세 + 부가세\n\n위쪽 관세 계산기에 엔화 금액을 입력하면 자동으로 계산됩니다.`,
  },
  {
    q: "영양제·비타민을 많이 사면 안 되나요?",
    a: `영양제·건강보조제는 6병(개) 이하면 목록통관(간편 통관)으로 빠르게 수령할 수 있습니다. 7병 이상부터는 일반통관 대상이 되어 세관 신고 서류 제출이 필요하고 통관이 지연될 수 있습니다.\n\n또한 의약품(처방약 등)은 6개월 복용분 이내만 반입이 허용됩니다. 초과분은 반송 처리될 수 있으니 수량에 주의하세요.`,
  },
  {
    q: "면세점 쇼핑도 입국 시 관세를 내야 하나요?",
    a: `면세점에서 구매한 물건은 입국 시 면세 한도 USD $800을 초과하면 관세가 부과됩니다. 해외직구 면세 한도($150~$200)와는 별개 기준입니다.\n\n단, 술은 1L 이하 1병, 담배는 200개비(1보루), 향수 60mL 이하는 별도 면세 혜택이 있습니다. $800 초과분에 대해서는 품목별 관세율이 적용됩니다.`,
  },
  {
    q: "판매자가 낮은 금액으로 송장을 발행해줬는데, 괜찮나요?",
    a: `안전하지 않습니다. 한국 세관은 실제 거래 금액과 다른 허위 송장에 대해 적발 시 실제 금액 기준으로 세금을 추징하고 과태료를 부과할 수 있습니다. 또한 해당 판매자와의 거래 자체가 문제가 될 수 있습니다.\n\n정직하게 실제 구매 금액을 기재하는 것이 안전하며, 면세 한도 이내라면 굳이 허위 기재할 필요가 없습니다.`,
  },
  {
    q: "전자제품(스마트폰, 노트북)은 관세가 없나요?",
    a: `스마트폰·노트북·태블릿 등 주요 전자제품은 관세율이 0%입니다. 단, 면세 한도($150 또는 $200)를 초과하면 관세(0%) + 부가세(10%)가 부과됩니다.\n\n즉, 관세는 없지만 부가세 10%는 납부해야 합니다. 예를 들어 $300짜리 노트북을 미국에서 구매하면 관세 $0 + 부가세 $30(원화 환산) 정도가 됩니다.`,
  },
];

export default function QnaPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <span className={styles.headerBadge}>자주 묻는 질문</span>
          <h1 className={styles.title}>해외직구 관세 FAQ</h1>
          <p className={styles.subtitle}>관세 계산부터 합산과세, 일본 직구, 면세점까지 자주 묻는 질문을 모았습니다.</p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: `1.5px solid ${open === i ? "var(--primary)" : "var(--border-color)"}`,
                borderRadius: 12,
                overflow: "hidden",
                transition: "border-color 0.15s",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "18px 20px", background: "none",
                  border: "none", cursor: "pointer", textAlign: "left", gap: 12,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 15, color: open === i ? "var(--primary)" : "var(--text-primary)", lineHeight: 1.5 }}>
                  Q. {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  style={{
                    flexShrink: 0,
                    color: "var(--text-muted)",
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              {open === i && (
                <div
                  style={{
                    padding: "0 20px 18px",
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    whiteSpace: "pre-line",
                    borderTop: "1px solid var(--border-color)",
                    paddingTop: 14,
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Link
            href="/"
            style={{
              display: "inline-block", padding: "12px 28px",
              background: "var(--primary)", color: "white",
              borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: 15,
            }}
          >
            관세 계산기 바로가기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
