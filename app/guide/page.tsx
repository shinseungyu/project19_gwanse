"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

const TABS = [
  { id: "clearance", label: "목록통관 vs 일반통관" },
  { id: "tips", label: "관세 절세 팁" },
  { id: "rates", label: "국가별 세율 정리" },
];

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("clearance");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <span className={styles.headerBadge}>이용 가이드</span>
          <h1 className={styles.title}>해외직구 관세 완벽 가이드</h1>
          <p className={styles.subtitle}>관세 계산 방법부터 합산과세 절세 전략까지 한눈에 정리했습니다.</p>
        </header>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "9px 18px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer",
                background: activeTab === t.id ? "var(--primary)" : "white",
                color: activeTab === t.id ? "white" : "var(--text-secondary)",
                boxShadow: activeTab === t.id ? "var(--shadow-sm)" : "none",
                border: activeTab !== t.id ? "1px solid var(--border-color)" : "none",
                transition: "all 0.15s",
              } as React.CSSProperties}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.card} style={{ animation: "fadeIn 0.2s ease" }}>

          {/* ── 탭 1: 목록통관 vs 일반통관 ── */}
          {activeTab === "clearance" && (
            <article>
              <h2 style={{ marginTop: 0, fontSize: 18, fontWeight: 800 }}>목록통관 vs 일반통관 — 무엇이 다른가요?</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>
                해외직구 물건이 한국 세관을 통과하는 방법은 크게 두 가지입니다. 어떤 통관 방식이 적용되느냐에 따라 면세 한도, 통관 속도, 필요 서류가 모두 달라집니다. 직구 전 반드시 확인하세요.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
                {[
                  {
                    type: "목록통관 (List-based Clearance)",
                    color: "var(--success)",
                    bg: "var(--success-light)",
                    border: "var(--success-border)",
                    points: [
                      "미국 $200 / 기타 국가 $150 이하 물건에 적용",
                      "세관 신고서류 없이 간편하게 통관",
                      "소요시간 빠름 (1~2일 이내)",
                      "영양제 6병 이하, 일반 생활용품 소량 적용 가능",
                      "전자상거래 구매 물품 중 특정 품목 제외",
                    ],
                  },
                  {
                    type: "일반통관 (General Clearance)",
                    color: "var(--warn)",
                    bg: "var(--warn-light)",
                    border: "var(--warn-border)",
                    points: [
                      "면세 한도 초과 물건 또는 특정 품목에 적용",
                      "세관 신고서류(인보이스 등) 제출 필요",
                      "관세 및 부가세 납부 후 수령",
                      "영양제 7병 이상, 의약품, 식품류 등",
                      "통관 심사에 수일 이상 소요될 수 있음",
                    ],
                  },
                ].map((item) => (
                  <div key={item.type} style={{ padding: "18px 20px", background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 12 }}>
                    <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 15, fontWeight: 800, color: item.color }}>{item.type}</h3>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {item.points.map((p) => (
                        <li key={p} style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.75, marginBottom: 2 }}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 10px" }}>목록통관이 불가능한 품목</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75, marginBottom: 12 }}>
                아래 품목이 하나라도 포함된 택배는 전체가 일반통관으로 전환됩니다. 면세 금액 이하여도 서류 제출과 세관 검사가 필요합니다.
              </p>
              <ul style={{ paddingLeft: 20, margin: "0 0 24px" }}>
                {[
                  "의약품·한약재 (처방전 없이 구매한 약 포함)",
                  "건강기능식품 7병(개) 이상",
                  "식품·농산물·축산물 (검역 대상)",
                  "화장품 중 기능성 성분 함유 제품",
                  "전자담배·담배",
                  "총포·도검류 등 반입 제한 물품",
                ].map((item) => (
                  <li key={item} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 4 }}>{item}</li>
                ))}
              </ul>

              <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 10px" }}>개인통관고유부호란?</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75, marginBottom: 8 }}>
                해외직구 시 수취인 정보로 주민등록번호 대신 사용하는 13자리 고유번호입니다. 관세청 유니패스(unipass.customs.go.kr)에서 무료로 발급받을 수 있으며, 한 번 발급받으면 평생 사용 가능합니다.
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75 }}>
                개인통관고유부호는 수취인을 구분하는 기준이 되어 합산과세 여부도 이 번호를 기준으로 판단됩니다. 가족 명의(다른 개인통관고유부호)로 수령하면 별도 화물로 인정됩니다.
              </p>
            </article>
          )}

          {/* ── 탭 2: 관세 절세 팁 ── */}
          {activeTab === "tips" && (
            <article>
              <h2 style={{ marginTop: 0, fontSize: 18, fontWeight: 800 }}>관세 줄이는 실전 절세 팁 6가지</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>
                합법적인 방법으로 관세 부담을 줄이는 전략을 정리했습니다. 특히 합산과세는 모르면 세금 폭탄을 맞을 수 있으니 꼭 숙지하세요.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
                {[
                  { icon: "✂️", title: "면세 한도 이하로 주문 분산", desc: "$150(미국 $200)을 초과하지 않도록 주문을 여러 번으로 나누세요. 단, 합산과세 주의 — 같은 날 도착하면 금액이 합산됩니다." },
                  { icon: "📅", title: "입항일 분리 전략", desc: "여러 물건을 구매할 때 배송대행지 발송일을 다르게 설정해 한국 도착일을 분산시키세요. 도착일이 다르면 합산과세 대상이 되지 않습니다." },
                  { icon: "🌍", title: "출발 국가 다양화", desc: "미국 + 일본처럼 다른 나라에서 각각 구매하면 같은 날 도착해도 합산되지 않습니다. 나라별로 별도 화물로 취급됩니다." },
                  { icon: "👥", title: "가족 명의 활용", desc: "수취인 정보(이름, 개인통관고유부호)를 다르게 하면 각각 별도 화물로 인정됩니다. 가족 4명이 각각 $140씩 구매하면 총 $560어치를 무관세로 수령할 수 있습니다." },
                  { icon: "📦", title: "배송비 절약으로 과세가격 낮추기", desc: "배송비도 과세가격에 포함됩니다. 무료배송 행사나 최소주문금액 이벤트를 활용하거나, 배송대행지 이용 시 묶음 배송으로 건당 배송비를 낮추세요." },
                  { icon: "🔖", title: "관세 0% 품목 파악", desc: "스마트폰·노트북·태블릿·서적은 관세율 0%입니다. 면세 한도 초과 시 부가세(10%)만 납부하면 되어 상대적으로 유리합니다. 전자제품은 직구 메리트가 큰 편입니다." },
                ].map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: 14, padding: "14px 16px", background: "var(--bg-page)", borderRadius: 10, border: "1px solid var(--border-color)" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{item.title}</p>
                      <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 10px" }}>관세 계산 공식 이해하기</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75, marginBottom: 12 }}>
                관세와 부가세는 다음 순서로 계산됩니다. 면세 한도를 초과한 경우, 전체 금액에 대해 아래 공식이 적용됩니다.
              </p>
              <div style={{ background: "var(--primary-light)", border: "1px solid var(--primary-border)", borderRadius: 10, padding: "16px 20px", fontSize: 14, lineHeight: 2 }}>
                <p style={{ margin: 0, fontWeight: 700, color: "var(--primary)" }}>과세가격 = 물건값(USD) × 원/달러 환율</p>
                <p style={{ margin: 0, color: "var(--text-secondary)" }}>관세 = 과세가격 × 관세율 (품목별 상이)</p>
                <p style={{ margin: 0, color: "var(--text-secondary)" }}>부가세 = (과세가격 + 관세) × 10%</p>
                <p style={{ margin: 0, fontWeight: 700, color: "var(--primary)" }}>총 납부세액 = 관세 + 부가세</p>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, margin: "24px 0 10px" }}>합산과세, 이것만 알면 피할 수 있다</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75 }}>
                합산과세는 동일한 수취인(개인통관고유부호 기준)에게 같은 날 도착하는 해외 물건의 가격을 모두 합산해 면세 한도 초과 여부를 판단하는 제도입니다. 예를 들어 $100짜리 두 개가 같은 날 들어오면 $200으로 합산돼 $150 초과 시 관세가 부과됩니다. 배송대행지를 이용한다면 발송 타이밍을 조절해 입항일을 반드시 다르게 하세요.
              </p>
            </article>
          )}

          {/* ── 탭 3: 국가별 세율 정리 ── */}
          {activeTab === "rates" && (
            <article>
              <h2 style={{ marginTop: 0, fontSize: 18, fontWeight: 800 }}>국가별 면세 한도 & 품목별 관세율 정리</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>
                어느 나라에서 직구하느냐, 어떤 품목이냐에 따라 면세 한도와 관세율이 달라집니다. 구매 전 아래 표를 반드시 확인하세요.
              </p>

              <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 12px" }}>국가별 면세 한도</h3>
              <div style={{ overflowX: "auto", marginBottom: 28 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "var(--primary-light)" }}>
                      {["출발 국가", "면세 한도", "통화", "주요 특이사항"].map((h) => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid var(--primary-border)", fontWeight: 700, color: "var(--primary)", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { country: "🇺🇸 미국", limit: "$200", currency: "USD", note: "목록통관 가능, 가장 넉넉한 면세 한도" },
                      { country: "🇯🇵 일본", limit: "$150 (USD 환산)", currency: "JPY (¥)", note: "엔화 약세 시 면세 범위 확대, 합산과세 주의" },
                      { country: "🇨🇳 중국", limit: "$150 (USD 환산)", currency: "CNY (¥)", note: "위안화 환산 적용, 짝퉁 제품 반입 금지" },
                      { country: "🇪🇺 유럽", limit: "$150 (USD 환산)", currency: "EUR (€)", note: "배송비가 높은 경우 과세가격 초과 주의" },
                    ].map((r, i) => (
                      <tr key={r.country} style={{ background: i % 2 === 0 ? "#fff" : "var(--bg-page)" }}>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)", fontWeight: 600, whiteSpace: "nowrap" }}>{r.country}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)", color: "var(--primary)", fontWeight: 700, whiteSpace: "nowrap" }}>{r.limit}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)", whiteSpace: "nowrap" }}>{r.currency}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 12px" }}>품목별 관세율 (면세 한도 초과 시)</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75, marginBottom: 12 }}>
                아래는 국내 세관이 적용하는 주요 품목별 관세율입니다. 관세 외에 부가세 10%가 추가로 부과됩니다.
              </p>
              <div style={{ overflowX: "auto", marginBottom: 28 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "var(--primary-light)" }}>
                      {["품목", "관세율", "부가세", "비고"].map((h) => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid var(--primary-border)", fontWeight: 700, color: "var(--primary)", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { item: "의류·신발·가방", rate: "13%", vat: "10%", note: "가장 높은 관세율" },
                      { item: "화장품·스킨케어", rate: "6.5%", vat: "10%", note: "기능성 제품은 일반통관 가능성" },
                      { item: "향수·디퓨저", rate: "7%", vat: "10%", note: "" },
                      { item: "식품·간식", rate: "8%", vat: "10%", note: "검역 필요 품목 별도" },
                      { item: "영양제·건강보조제", rate: "8%", vat: "10%", note: "7병 이상 일반통관" },
                      { item: "완구·피규어", rate: "8%", vat: "10%", note: "" },
                      { item: "스포츠·아웃도어", rate: "8%", vat: "10%", note: "" },
                      { item: "주얼리·액세서리", rate: "8%", vat: "10%", note: "" },
                      { item: "전자제품 (스마트폰, 노트북 등)", rate: "0%", vat: "10%", note: "관세 없음, 부가세만 부과" },
                      { item: "서적·교재", rate: "0%", vat: "10%", note: "관세 없음" },
                    ].map((r, i) => (
                      <tr key={r.item} style={{ background: i % 2 === 0 ? "#fff" : "var(--bg-page)" }}>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)", fontWeight: 600 }}>{r.item}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)", color: r.rate === "0%" ? "var(--success)" : "var(--danger)", fontWeight: 700 }}>{r.rate}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)" }}>{r.vat}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: 13 }}>{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 10px" }}>부가세는 언제부터 붙나요?</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75, marginBottom: 8 }}>
                부가세(10%)는 면세 한도를 초과한 경우에만 부과됩니다. 즉, $150(미국 $200) 이하라면 관세도 부가세도 없습니다. 한도를 초과하면 관세와 부가세가 동시에 부과되며, 관세가 0%인 전자제품도 부가세는 피할 수 없습니다.
              </p>
              <div style={{ background: "var(--warn-light)", border: "1px solid var(--warn-border)", borderRadius: 10, padding: "14px 18px", fontSize: 13, color: "#92400e", lineHeight: 1.7 }}>
                <strong>주의:</strong> 과세가격은 물건값 + 배송비를 합산한 금액입니다. 배송비가 높으면 면세 한도를 초과할 수 있으므로, 구매 전 반드시 총액을 확인하세요.
              </div>
            </article>
          )}
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href="/" style={{ display: "inline-block", padding: "12px 28px", background: "var(--primary)", color: "white", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
            관세 계산기 바로가기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
