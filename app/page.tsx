"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { AlertTriangle, CircleCheck, AlertCircle, ChevronDown } from "lucide-react";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import {
  PRODUCT_CATEGORIES,
  ORIGIN_COUNTRIES,
  VAT_RATE,
  VITAMIN_BOTTLE_LIMIT,
} from "@/lib/constants";
import postsData from "@/data/posts.json";
import styles from "./page.module.css";

export default function HomePage() {
  const { rate, rates, loading, error } = useExchangeRate();

  const [origin, setOrigin] = useState<string>("jp");
  const [category, setCategory] = useState<string>("clothing");
  const [priceLocal, setPriceLocal] = useState<string>("");
  const [shippingLocal, setShippingLocal] = useState<string>("");
  const [bottleCount, setBottleCount] = useState<string>("");

  const selectedCategory = PRODUCT_CATEGORIES.find((c) => c.id === category);
  const selectedOrigin = ORIGIN_COUNTRIES.find((c) => c.id === origin);

  const result = useMemo(() => {
    const price = parseFloat(priceLocal) || 0;
    const shipping = parseFloat(shippingLocal) || 0;
    const totalLocal = price + shipping;
    if (!rates || !rate || totalLocal <= 0) return null;

    const dutyFreeLimit = selectedOrigin?.dutyFreeLimit ?? 150;
    let totalUSD = totalLocal;
    if (selectedOrigin?.id === "jp") totalUSD = totalLocal / rates.JPY;
    else if (selectedOrigin?.id === "cn") totalUSD = totalLocal / rates.CNY;
    else if (selectedOrigin?.id === "eu") totalUSD = totalLocal / rates.EUR;

    if (totalUSD <= dutyFreeLimit) {
      return { isDutyFree: true, totalLocal, totalUSD, totalKRW: Math.round(totalUSD * rate), dutyFreeLimit };
    }

    const dutyRate = selectedCategory
      ? (selectedCategory.dutyRate as Record<string, number>)[origin] ?? 0.08
      : 0.08;
    const totalKRW = Math.round(totalUSD * rate);
    const customsDuty = Math.round(totalKRW * dutyRate);
    const vat = Math.round((totalKRW + customsDuty) * VAT_RATE);
    const totalTax = customsDuty + vat;
    const totalCost = totalKRW + totalTax;
    return { isDutyFree: false, totalLocal, totalUSD, totalKRW, dutyRate, customsDuty, vat, totalTax, totalCost, dutyFreeLimit };
  }, [priceLocal, shippingLocal, rate, rates, selectedCategory, selectedOrigin, origin]);

  const [qnaOpen, setQnaOpen] = useState<number | null>(null);
  const showVitaminWarning = category === "vitamins" && parseInt(bottleCount) > VITAMIN_BOTTLE_LIMIT;
  const recentPosts = postsData.slice(0, 3);

  const MAIN_FAQS = [
    {
      q: "달러가 아닌 엔화나 위안화로 결제하면 어떻게 계산하나요?",
      a: "세관에서는 물건이 한국에 도착하는 날(입항일)의 '과세환율'을 기준으로 모든 금액을 확인합니다. 본 계산기에서 출발 국가를 일본이나 중국으로 선택하시면 현지 통화로 편리하게 입력하면서 예상되는 달러 환산액을 미리 확인할 수 있습니다.",
    },
    {
      q: "배대지(배송대행지) 요금도 세금 부과 기준(과세가격)에 포함되나요?",
      a: "아닙니다. 면세 한도($150 또는 $200)를 계산할 때나 세금을 책정할 때, 배대지에 지불하는 국제 배송비는 포함되지 않습니다. 오직 해외 쇼핑몰에 지불한 총 금액(물건값 + 현지 배송비 + 현지 세금)이 기준이 됩니다.",
    },
    {
      q: "목록통관과 일반통관의 차이가 무엇인가요?",
      a: "목록통관은 의류, 신발 등 위험성이 낮은 물품을 서류만으로 빠르게 통관시키는 제도입니다(미국 $200 면세). 일반통관은 영양제, 의약품, 식품 등 세관의 직접 확인이 필요한 품목으로, 전 세계 어디서 오든 무조건 $150가 면세 한도입니다. 일반통관 품목이 하나라도 섞여 있다면 전체 택배가 일반통관($150 한도)으로 취급되니 주의하세요.",
    },
    {
      q: "향수를 직구할 때 세금은 어떻게 되나요?",
      a: "향수는 용량에 따라 면세 여부가 완전히 달라집니다. 총 결제 금액이 면세 한도($150~$200) 이내이면서 향수의 총 용량이 60ml 이하라면 관세·부가세·개별소비세가 모두 면제됩니다. 하지만 60ml를 조금이라도 초과하면 전체 금액에 대해 높은 세율이 부과되므로 각별히 주의해야 합니다.",
    },
    {
      q: "세금을 피하려고 박스를 두 개로 나눠서(분할 배송) 보내면 괜찮을까요?",
      a: "절대 추천하지 않습니다. 세관에서는 같은 목적지, 같은 수취인으로 여러 박스가 며칠 간격으로 들어와도 이를 동일한 주문으로 간주해 합산과세 처분을 내릴 확률이 매우 높습니다. 세금 납부는 물론 통관 지연까지 발생할 수 있으니, 한 번에 정상적으로 결제하는 것이 가장 안전하고 빠릅니다.",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>

        {/* ══════════════════════════════════════════
            전체 페이지 레이아웃: [메인] | [사이드바]
            사이드바는 페이지 끝까지 sticky로 따라다님
            ══════════════════════════════════════════ */}
        <div className={styles.pageGrid}>

          {/* ━━━━━━━━━━━━━━━━━━━━━━
              왼쪽: 메인 전체 컨텐츠
              ━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className={styles.mainCol}>

            {/* 헤더 */}
            <div className={styles.calcHeader}>
              <span className={styles.headerBadge}>실시간 환율 자동 적용</span>
              <h1 className={styles.title}>관세계산기 - 해외직구 관세 즉시 계산</h1>
              <p className={styles.subtitle}>
                일본·미국·중국·유럽 해외직구 관세를 실시간 환율로 바로 계산하세요. 면세점 관세계산도 지원합니다.
              </p>
            </div>

            {/* 환율 바 */}
            <div className={styles.rateBar}>
              {loading && <span className={styles.rateLoading}><span className={styles.spinner} />환율 불러오는 중...</span>}
              {error && <span className={styles.rateError}><AlertCircle size={13} />{error}</span>}
              {rates && !loading && (
                <>
                  <div className={styles.ratePill}>
                    <span className={styles.ratePillLabel}>USD</span>
                    <span className={styles.ratePillValue}>{rate?.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원</span>
                    <span className={styles.ratePillSub}>$1 기준</span>
                  </div>
                  <div className={styles.ratePill}>
                    <span className={styles.ratePillLabel}>JPY</span>
                    <span className={styles.ratePillValue}>{(rate! / rates.JPY * 100).toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원</span>
                    <span className={styles.ratePillSub}>100엔 기준</span>
                  </div>
                  <div className={styles.ratePill}>
                    <span className={styles.ratePillLabel}>CNY</span>
                    <span className={styles.ratePillValue}>{(rate! / rates.CNY).toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원</span>
                    <span className={styles.ratePillSub}>¥1 기준</span>
                  </div>
                  <div className={styles.ratePill}>
                    <span className={styles.ratePillLabel}>EUR</span>
                    <span className={styles.ratePillValue}>{(rate! / rates.EUR).toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원</span>
                    <span className={styles.ratePillSub}>€1 기준</span>
                  </div>
                </>
              )}
            </div>

            {/* ── 계산기 카드 ── */}
            <div className={styles.calcCard}>

              {/* 출발 국가 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>출발 국가</label>
                <div className={styles.radioGroup}>
                  {ORIGIN_COUNTRIES.map((c) => (
                    <div key={c.id} className={styles.radioOption}>
                      <input
                        type="radio"
                        id={`origin-${c.id}`}
                        name="origin"
                        value={c.id}
                        checked={origin === c.id}
                        onChange={() => setOrigin(c.id)}
                        className={styles.radioInput}
                      />
                      <label htmlFor={`origin-${c.id}`} className={styles.radioLabel}>
                        {c.flag} {c.label}
                        <span>
                          {c.id === "us" ? "$200 면세"
                            : c.id === "jp" && rates ? `¥${(150 * rates.JPY).toLocaleString("ko-KR", { maximumFractionDigits: 0 })} 면세`
                            : "$150 면세"}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 품목 */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="category">품목</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} — 관세율 {((c.dutyRate as Record<string, number>)[origin] * 100).toFixed(0)}%
                    </option>
                  ))}
                </select>
              </div>

              {/* 상품 가격 */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="price">
                  상품 가격 ({selectedOrigin?.currency ?? "USD"})
                </label>
                <input
                  id="price" type="number" className={styles.input}
                  placeholder={
                    origin === "jp" ? "예: 3980 (엔화)" :
                    origin === "cn" ? "예: 150 (위안)" :
                    origin === "eu" ? "예: 49.99 (유로)" : "예: 49.99 (달러)"
                  }
                  min="0" step="any" value={priceLocal}
                  onChange={(e) => setPriceLocal(e.target.value)}
                />
              </div>

              {/* 배송비 */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="shipping">
                  배송비 ({selectedOrigin?.currency ?? "USD"}) · 없으면 0
                </label>
                <input
                  id="shipping" type="number" className={styles.input}
                  placeholder="예: 0 (무료배송)"
                  min="0" step="any" value={shippingLocal}
                  onChange={(e) => setShippingLocal(e.target.value)}
                />
              </div>

              {/* 영양제 */}
              {category === "vitamins" && (
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="bottles">영양제 병 수</label>
                  <input
                    id="bottles" type="number" className={styles.input}
                    placeholder="몇 병인지 입력" min="0" value={bottleCount}
                    onChange={(e) => setBottleCount(e.target.value)}
                  />
                  {showVitaminWarning && (
                    <div className={styles.vitaminWarning}>
                      <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                      6병 초과 시 일반통관 대상 — 세관 서류 제출 필요
                    </div>
                  )}
                </div>
              )}

              {/* 결과 */}
              {result ? (
                <div className={`${styles.resultBox} ${result.isDutyFree ? styles.resultBoxFree : styles.resultBoxTaxed}`}>
                  {result.isDutyFree ? (
                    <>
                      <div className={styles.resultHeroFree}>
                        <div className={styles.resultHeroLabel} style={{ color: "var(--success)" }}>
                          <CircleCheck size={14} /> 면세 대상 — 관세·부가세 없음
                        </div>
                        <div className={styles.resultHeroAmount} style={{ color: "var(--success)" }}>
                          {result.totalKRW.toLocaleString("ko-KR")}원
                        </div>
                        <div className={styles.resultHeroSub}>세금 없이 이 금액만 결제하면 됩니다</div>
                      </div>
                      <div className={styles.resultDivider}>계산 내역</div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultRowLabel}>상품+배송 ({selectedOrigin?.currency})</span>
                        <span className={styles.resultRowValue}>{selectedOrigin?.symbol}{result.totalLocal.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultRowLabel}>달러 환산액</span>
                        <span className={styles.resultRowValue}>${result.totalUSD.toFixed(2)}</span>
                      </div>
                      <div className={styles.resultRow} style={{ borderBottom: "none" }}>
                        <span className={styles.resultRowLabel}>면세 한도 기준</span>
                        <span className={styles.resultRowValue}>${result.dutyFreeLimit} 이하 ✅</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.resultHeroTaxed}>
                        <div className={styles.resultHeroLabel} style={{ color: "var(--danger)" }}>
                          <AlertTriangle size={14} /> 과세 대상 — 총 예상 비용
                        </div>
                        <div className={styles.resultHeroAmount}>
                          {result.totalCost?.toLocaleString("ko-KR")}원
                        </div>
                        <div className={styles.resultHeroSub}>
                          상품금액 {result.totalKRW?.toLocaleString("ko-KR")}원 + 세금 {result.totalTax?.toLocaleString("ko-KR")}원
                        </div>
                      </div>
                      <div className={styles.resultDivider}>계산 내역</div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultRowLabel}>상품+배송 ({selectedOrigin?.currency})</span>
                        <span className={styles.resultRowValue}>{selectedOrigin?.symbol}{result.totalLocal.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultRowLabel}>달러 환산액</span>
                        <span className={styles.resultRowValue}>${result.totalUSD.toFixed(2)}</span>
                      </div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultRowLabel}>원화 과세가격</span>
                        <span className={styles.resultRowValue}>{result.totalKRW?.toLocaleString("ko-KR")}원</span>
                      </div>
                      <div className={styles.resultTaxSection}>
                        <div className={styles.resultRow}>
                          <span className={styles.resultRowLabel}>관세 ({((result.dutyRate ?? 0) * 100).toFixed(1)}%)</span>
                          <span className={styles.resultRowValueDanger}>{result.customsDuty?.toLocaleString("ko-KR")}원</span>
                        </div>
                        <div className={styles.resultRow}>
                          <span className={styles.resultRowLabel}>부가세 (10%)</span>
                          <span className={styles.resultRowValueDanger}>{result.vat?.toLocaleString("ko-KR")}원</span>
                        </div>
                        <div className={styles.resultRow} style={{ borderBottom: "none" }}>
                          <span className={styles.resultRowLabel} style={{ fontWeight: 700, color: "var(--text-primary)" }}>총 세금</span>
                          <span className={styles.resultRowValueDanger} style={{ fontSize: 15 }}>{result.totalTax?.toLocaleString("ko-KR")}원</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className={styles.emptyResult}>
                  ③ 상품 가격을 입력하면 관세가 자동 계산됩니다
                  <div style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
                    면세 여부 · 관세 · 부가세 · 총 예상 비용 즉시 확인
                  </div>
                </div>
              )}
            </div>
            {/* /calcCard */}

            {/* ── 관세란? 미니 섹션 ── */}
            <div className={styles.whatIsCard}>
              <h2 className={styles.whatIsTitle}>관세란 무엇인가요?</h2>
              <p className={styles.whatIsDesc}>
                관세(Customs Duty)는 해외에서 물건을 구입해 국내로 들여올 때 세관에 납부하는 세금입니다.
                수입 물품의 가격·종류·원산지에 따라 세율이 다르며, 국내 산업 보호와 국가 세수 확보를 위해 부과됩니다.
              </p>
              <div className={styles.whatIsGrid}>
                <div className={styles.whatIsItem}>
                  <span className={styles.whatIsItemIcon}>📦</span>
                  <div>
                    <p className={styles.whatIsItemTitle}>면세 한도 이하</p>
                    <p className={styles.whatIsItemDesc}>관세·부가세 없음. 미국 $200, 그 외 $150 이하</p>
                  </div>
                </div>
                <div className={styles.whatIsItem}>
                  <span className={styles.whatIsItemIcon}>🧾</span>
                  <div>
                    <p className={styles.whatIsItemTitle}>관세 = 품목마다 다름</p>
                    <p className={styles.whatIsItemDesc}>의류 13% · 전자제품 0% · 화장품 6.5%</p>
                  </div>
                </div>
                <div className={styles.whatIsItem}>
                  <span className={styles.whatIsItemIcon}>➕</span>
                  <div>
                    <p className={styles.whatIsItemTitle}>부가세는 항상 10%</p>
                    <p className={styles.whatIsItemDesc}>면세 초과 시 관세와 함께 반드시 부과</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════
                교육 콘텐츠 (mainCol 안에 있어야
                사이드바가 여기까지 따라다닌다)
                ════════════════════════════════ */}
            <article className={styles.guideSection}>

              {/* 가이드 인트로 */}
              <section style={{ marginBottom: 32, padding: "18px 22px", background: "var(--primary-light)", border: "1.5px solid var(--primary-border)", borderRadius: 14 }}>
                <p style={{ margin: 0, fontSize: 14, color: "var(--text-primary)", lineHeight: 1.85 }}>
                  아마존, 이베이, 알리익스프레스, 테무 등 글로벌 쇼핑몰에서 마음에 드는 상품을 발견했을 때,
                  결제 금액 외에 추가로 납부해야 하는 세금을 미리 모르면 예상치 못한 세금 고지서를 받고 당황하는 상황이 생깁니다.
                  특히 면세 한도($150~$200)를 조금만 초과해도 관세와 부가세가 한꺼번에 부과되기 때문에,
                  <strong> 사전에 정확히 계산해보는 습관</strong>이 절약의 핵심입니다.
                  아래 가이드에서 관세·부가세의 차이, 국가별 면세 한도, 합산과세 주의사항까지 핵심만 정리해 드립니다.
                </p>
              </section>

              {/* ① 관세 vs 부가세 차이 */}
              <section style={{ marginBottom: 40 }}>
                <h2>🧾 관세 vs 부가세 — 무엇이 다른가요?</h2>
                <p>
                  관세는 해외 물건을 한국으로 들여올 때 내는 세금입니다. 관세계산기에 금액을 입력하기 전에 기본 개념만 알면 훨씬 쉽게 활용할 수 있습니다.
                </p>
                <p style={{ marginTop: 8 }}>
                  수입 물품에 붙는 세금은 <strong>관세</strong>와 <strong>부가세</strong> 두 가지입니다. 흔히 <strong>관부가세</strong>라고 묶어 부르지만 계산 방식과 적용 기준이 완전히 다릅니다.
                  관세계산기를 제대로 활용하려면 두 세금의 차이를 먼저 이해해야 합니다.
                </p>

                {/* 비교 표 */}
                <div style={{ overflowX: "auto", margin: "16px 0" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "var(--primary-light)" }}>
                        {["구분", "관세 (Customs Duty)", "부가세 (VAT)"].map(h => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "left", borderBottom: "2px solid var(--primary-border)", fontWeight: 700, color: "var(--primary)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["세율", "품목별 상이 (0~13%)", "일률 10%"],
                        ["과세 기준", "과세가격(CIF) × 관세율", "(과세가격 + 관세) × 10%"],
                        ["전자제품·서적", "0% — 관세 없음", "10% — 면세 초과 시 부과"],
                        ["의류·신발", "13%", "10% 추가"],
                        ["화장품", "6.5%", "10% 추가"],
                        ["영양제·식품", "8%", "10% 추가"],
                        ["면세 한도 이하", "부과 안 됨", "부과 안 됨"],
                      ].map(([label, customs, vat], i) => (
                        <tr key={label} style={{ background: i % 2 === 0 ? "white" : "var(--bg-page)" }}>
                          <td style={{ padding: "9px 14px", borderBottom: "1px solid var(--border-color)", fontWeight: 700, color: "var(--text-primary)" }}>{label}</td>
                          <td style={{ padding: "9px 14px", borderBottom: "1px solid var(--border-color)", color: "var(--primary)" }}>{customs}</td>
                          <td style={{ padding: "9px 14px", borderBottom: "1px solid var(--border-color)", color: "#92400e" }}>{vat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0" }}>
                  <div style={{ padding: "16px 18px", background: "var(--primary-light)", border: "1.5px solid var(--primary-border)", borderRadius: 12 }}>
                    <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 14, color: "var(--primary)" }}>관세 — 품목마다 다르다</p>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                      수입 물품 보호를 위한 세금. 같은 $200이라도 의류면 13%, 전자제품이면 0%로 품목에 따라 크게 달라집니다.
                      <strong> 관세계산기에서 품목을 선택하면 자동 적용</strong>됩니다.
                    </p>
                  </div>
                  <div style={{ padding: "16px 18px", background: "#fefce8", border: "1.5px solid #fde68a", borderRadius: 12 }}>
                    <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 14, color: "#92400e" }}>부가세 — 무조건 10%</p>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                      소비세 성격의 세금. 관세율이 0%인 전자제품도 면세 한도를 초과하면 부가세 10%는 반드시 납부해야 합니다.
                    </p>
                  </div>
                </div>

                <div className={styles.guideCallout} style={{ background: "var(--primary-light)", border: "1px solid var(--primary-border)" }}>
                  <h4 style={{ color: "var(--primary)" }}>💡 관세계산기로 두 세금을 한 번에 확인하세요</h4>
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--text-primary)", lineHeight: 1.7 }}>
                    위 관세계산기에 금액과 품목을 입력하면 관세·부가세·총 세금을 자동으로 계산합니다.
                    예: $300 노트북 → 관세 $0 + 부가세 약 42,000원. 전자제품은 관세 없어도 부가세는 냅니다.
                  </p>
                </div>
              </section>

              <hr className={styles.divider} />

              {/* ② 해외직구 시 발생하는 비용 */}
              <section style={{ marginBottom: 40 }}>
                <h2>💸 관세 계산 시 발생하는 비용 총정리</h2>
                <p>
                  해외직구를 할 때 상품 가격 외에 생각보다 많은 비용이 발생합니다. 구매 전 아래 항목들을 모두 고려해야 실제 총비용을 정확히 파악할 수 있습니다.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { step: "①", label: "상품 가격", desc: "현지 판매가. 할인쿠폰·포인트 적용 후 금액 기준으로 관세가 계산됩니다.", color: "var(--primary)" },
                    { step: "②", label: "현지 배송비", desc: "판매자 창고 → 배송대행지(배대지) 또는 한국 주소까지의 배송비. 과세가격에 포함됩니다.", color: "var(--primary)" },
                    { step: "③", label: "배대지 수수료 (해당 시)", desc: "배송대행지 이용 시 발생하는 수수료. 국제 배송비 + 창고 보관료 등이 포함되며 과세가격에 합산됩니다.", color: "var(--primary)" },
                    { step: "④", label: "관세", desc: "과세가격(상품가 + 배송비) × 품목별 관세율. 면세 한도 이하면 0원.", color: "var(--warn)" },
                    { step: "⑤", label: "부가세 (VAT 10%)", desc: "(과세가격 + 관세) × 10%. 관세가 0%여도 면세 한도 초과 시 부과됩니다.", color: "var(--warn)" },
                    { step: "⑥", label: "통관 수수료 (일반통관 시)", desc: "일반통관 대상 품목은 관세사 수수료 등 소액의 통관 수수료가 추가될 수 있습니다.", color: "var(--text-secondary)" },
                  ].map((item) => (
                    <div key={item.step} style={{ display: "flex", gap: 14, padding: "12px 16px", background: "var(--bg-page)", borderRadius: 10, border: "1px solid var(--border-color)", alignItems: "flex-start" }}>
                      <span style={{ width: 28, height: 28, borderRadius: "50%", background: "white", border: `2px solid ${item.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: item.color, flexShrink: 0, marginTop: 1 }}>{item.step}</span>
                      <div>
                        <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{item.label}</p>
                        <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <hr className={styles.divider} />

              {/* ② -1 과세가격(CIF) */}
              <section style={{ marginBottom: 40 }}>
                <h2>💰 세금의 기준 &apos;과세가격(CIF)&apos;이란?</h2>
                <p>
                  많은 분이 물건값만 생각하시지만, 관세청이 기준으로 삼는 금액은 단순 상품가가 아닙니다.
                  <strong> 물품 가액 + 현지 배송비 + 현지 세금(Sales Tax) + 선편요금</strong>을 모두 합한 값이 과세가격(CIF)이 됩니다.
                </p>
                <div style={{ background: "#fefce8", border: "1.5px solid #fde68a", borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
                  <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 14, color: "#92400e" }}>⚠️ 주의 — 관세청 고시 선편요금이 따로 추가됩니다</p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                    실제 내가 낸 배송비가 아닌 <strong>관세청 고시 무게별 선편요금</strong>이 더해질 수 있습니다.
                    배대지(배송대행지)를 이용하거나 무료배송 상품을 구매해도 과세가격에 선편요금이 가산될 수 있으니,
                    위의 관세계산기에 배송비까지 포함해 입력해야 정확한 세금을 확인할 수 있습니다.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "물품 가액", desc: "해외 쇼핑몰 결제 금액 (할인·쿠폰 적용 후 금액 기준)" },
                    { label: "현지 배송비", desc: "판매자 창고 → 배대지 또는 직배송지까지의 배송비. 과세가격에 포함됩니다." },
                    { label: "현지 세금 (Sales Tax)", desc: "미국 일부 주에서 부과되는 판매세. 환급이 안 되며 과세가격에 합산됩니다." },
                    { label: "선편요금 (관세청 고시)", desc: "중량 기준 관세청 고시 요금. 실제 배송비와 다를 수 있어 계산기 입력 시 유의하세요.", highlight: true },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, padding: "11px 16px", background: item.highlight ? "#fff7ed" : "var(--bg-page)", borderRadius: 10, border: `1px solid ${item.highlight ? "#fed7aa" : "var(--border-color)"}` }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: "var(--primary)", minWidth: 18 }}>+</span>
                      <div>
                        <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>{item.label}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <hr className={styles.divider} />

              {/* ③ 해외직구 관세 면세 기준 */}
              <section style={{ marginBottom: 40 }}>
                <h2>✅ 관세 면세 기준 — 국가별 한도 총정리</h2>
                <p>
                  면세 기준을 정확히 알면 세금 없이 합법적으로 더 많은 쇼핑을 즐길 수 있습니다.
                  면세 여부는 <strong>상품 가격 + 배송비 합산 금액을 USD로 환산</strong>한 값을 기준으로 판단합니다.
                </p>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "var(--primary-light)" }}>
                        {["출발국", "면세 한도", "통관 방식", "주의사항"].map(h => (
                          <th key={h} style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid var(--primary-border)", fontWeight: 700, color: "var(--primary)", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { country: "🇺🇸 미국", limit: "USD $200", method: "목록통관", note: "배송비 포함 $200 이하. 특송화물 기준." },
                        { country: "🇯🇵 일본", limit: "USD $150", method: "목록통관", note: "엔화 → USD 환산. 환율 변동 주의." },
                        { country: "🇨🇳 중국", limit: "USD $150", method: "목록통관", note: "위안화 → USD 환산." },
                        { country: "🇪🇺 유럽", limit: "USD $150", method: "목록통관", note: "유로 → USD 환산." },
                        { country: "전 세계 (면세점)", limit: "USD $800", method: "입국 시 자진신고", note: "술·담배·향수 별도 한도 있음." },
                      ].map((r, i) => (
                        <tr key={r.country} style={{ background: i % 2 === 0 ? "white" : "var(--bg-page)" }}>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)", fontWeight: 600 }}>{r.country}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)", fontWeight: 800, color: "var(--primary)" }}>{r.limit}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)" }}>{r.method}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: 12 }}>{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.guideCallout} style={{ background: "var(--danger-light)", border: "1px solid var(--danger-border)", marginTop: 16 }}>
                  <h4 style={{ color: "var(--danger)" }}>🚫 면세라도 이건 안 됩니다</h4>
                  <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.75 }}>
                    <li>영양제 7병 이상 → 금액과 무관하게 일반통관 대상</li>
                    <li>의약품 6개월치 초과 → 반입 불가</li>
                    <li>검역 필요 품목(육가공품, 식물 등) → 반입 금지 또는 검역 통과 필요</li>
                    <li>상표권 침해 모조품 → 금액 무관 전량 압수</li>
                  </ul>
                </div>
              </section>

              <hr className={styles.divider} />

              {/* ④ 해외직구 관세 계산 방법 */}
              <section style={{ marginBottom: 40 }}>
                <h2>🧮 관세계산기 사용법 — 관세 계산 단계별 예시</h2>
                <p>
                  관세 계산은 어렵지 않습니다. 아래 공식과 예시를 보면 5분이면 바로 이해할 수 있습니다.
                </p>

                {/* 계산 공식 */}
                <div style={{ background: "var(--primary-light)", border: "1.5px solid var(--primary-border)", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
                  <p style={{ margin: "0 0 10px", fontWeight: 800, fontSize: 14, color: "var(--primary)" }}>📐 관세 계산 공식</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--text-primary)" }}>
                    {[
                      ["1단계", "과세가격", "(상품가 + 배송비) × 원달러 환율"],
                      ["2단계", "관세", "과세가격 × 품목별 관세율"],
                      ["3단계", "부가세", "(과세가격 + 관세) × 10%"],
                      ["4단계", "총 세금", "관세 + 부가세"],
                      ["5단계", "총 비용", "과세가격 + 총 세금"],
                    ].map(([step, label, formula]) => (
                      <div key={step} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)", minWidth: 44, opacity: 0.7 }}>{step}</span>
                        <span style={{ fontWeight: 700, minWidth: 56 }}>{label}</span>
                        <span style={{ color: "var(--text-secondary)" }}>= {formula}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 실전 예시 */}
                <h3 style={{ marginTop: 0 }}>실전 예시 — 일본 직구 의류 ¥15,000 (배송비 ¥2,000 포함)</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { step: "①", label: "JPY → USD 환산", value: "¥17,000 ÷ 150 ≈ $113.3", sub: "(USD/JPY 환율 150 가정)" },
                    { step: "②", label: "면세 한도 확인", value: "$113.3 < $150", sub: "→ 면세! 관세·부가세 없음 ✅", highlight: true },
                  ].map((r) => (
                    <div key={r.step} style={{
                      display: "flex", gap: 12, padding: "11px 16px",
                      background: r.highlight ? "var(--success-light)" : "var(--bg-page)",
                      border: `1px solid ${r.highlight ? "var(--success-border)" : "var(--border-color)"}`,
                      borderRadius: 10, alignItems: "center"
                    }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: "var(--primary)", flexShrink: 0 }}>{r.step}</span>
                      <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", minWidth: 130 }}>{r.label}</span>
                      <span style={{ fontSize: 13, color: r.highlight ? "var(--success)" : "var(--text-primary)", fontWeight: r.highlight ? 700 : 400 }}>{r.value}</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>{r.sub}</span>
                    </div>
                  ))}
                </div>

                <h3>실전 예시 2 — 미국 직구 의류 $250 (배송비 $20 포함)</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { step: "①", label: "과세가격 (원화)", value: "$270 × 1,400원 = 378,000원", sub: "USD/KRW 1,400 가정" },
                    { step: "②", label: "관세 (의류 13%)", value: "378,000 × 13% = 49,140원", sub: "" },
                    { step: "③", label: "부가세 (10%)", value: "(378,000 + 49,140) × 10% = 42,714원", sub: "" },
                    { step: "④", label: "총 세금", value: "49,140 + 42,714 = 91,854원", sub: "", highlight: true },
                    { step: "⑤", label: "총 예상 비용", value: "378,000 + 91,854 = 469,854원", sub: "약 47만원", highlight: false },
                  ].map((r) => (
                    <div key={r.step} style={{
                      display: "flex", gap: 12, padding: "11px 16px",
                      background: r.highlight ? "#fff7ed" : "var(--bg-page)",
                      border: `1px solid ${r.highlight ? "#fed7aa" : "var(--border-color)"}`,
                      borderRadius: 10, alignItems: "center", flexWrap: "wrap"
                    }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: "var(--primary)", flexShrink: 0 }}>{r.step}</span>
                      <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", minWidth: 130 }}>{r.label}</span>
                      <span style={{ fontSize: 13, color: r.highlight ? "#c2410c" : "var(--text-primary)", fontWeight: r.highlight ? 700 : 400 }}>{r.value}</span>
                      {r.sub && <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>{r.sub}</span>}
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
                  * 위 계산기에 숫자를 입력하면 현재 실시간 환율로 자동 계산됩니다.
                </p>
              </section>

              <hr className={styles.divider} />

              <section style={{ marginBottom: 40 }}>
                <h2>⚠️ 합산과세 — 직구 세금 폭탄 원인 1위</h2>
                <p>
                  구매 날짜가 달라도 <strong>같은 나라 물건 2개 이상이 같은 날 한국 도착</strong>하면
                  세관이 전체 금액을 합산해 과세합니다. 각각 면세 구간이어도 합치면 초과될 수 있습니다.
                </p>
                <div className={styles.guideCallout} style={{ background: "var(--danger-light)", border: "1px solid var(--danger-border)" }}>
                  <h4 style={{ color: "var(--danger)" }}>🚨 일본 직구 합산과세 사례</h4>
                  <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 14, color: "var(--text-primary)", lineHeight: 1.75 }}>
                    <li>라쿠텐 의류 ¥12,000 + 아마존 재팬 화장품 ¥10,000 → 각각 면세</li>
                    <li>같은 날 한국 도착: ¥22,000 ≈ $148 → 면세처럼 보이지만...</li>
                    <li><strong style={{ color: "var(--danger)" }}>배송비 포함 시 $150 초과 → 전액 과세 대상!</strong></li>
                  </ul>
                </div>
                <h3>합산과세 피하는 3가지 방법</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { icon: "1️⃣", title: "첫 번째 물건 통관 완료 후 다음 배송 결제", desc: "배송조회에서 '반출 완료' 확인 후 다음 배송비 결제 — 가장 확실한 방법" },
                    { icon: "2️⃣", title: "다른 나라에서 분산 구매", desc: "미국 + 일본처럼 출발국이 다르면 같은 날 도착해도 합산 안 됨" },
                    { icon: "3️⃣", title: "수취인 정보 다르게 설정", desc: "이름·개인통관고유부호 중 하나만 달라도 별도 화물로 처리 (가족 명의 활용)" },
                  ].map((item) => (
                    <div key={item.icon} style={{ display: "flex", gap: 12, padding: "13px 16px", background: "var(--bg-page)", borderRadius: 10, border: "1px solid var(--border-color)" }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{item.title}</p>
                        <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </article>
            {/* /guideSection */}

            {/* QNA 섹션 */}
            <section style={{ marginTop: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>자주 묻는 질문</h2>
                <Link href="/qna" style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>전체 보기 →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {MAIN_FAQS.map((faq, i) => (
                  <div
                    key={i}
                    style={{
                      background: "white",
                      border: `1.5px solid ${qnaOpen === i ? "var(--primary)" : "var(--border-color)"}`,
                      borderRadius: 12,
                      overflow: "hidden",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <button
                      onClick={() => setQnaOpen(qnaOpen === i ? null : i)}
                      style={{
                        width: "100%", display: "flex", justifyContent: "space-between",
                        alignItems: "center", padding: "15px 18px", background: "none",
                        border: "none", cursor: "pointer", textAlign: "left", gap: 12,
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 14, color: qnaOpen === i ? "var(--primary)" : "var(--text-primary)", lineHeight: 1.5 }}>
                        Q. {faq.q}
                      </span>
                      <ChevronDown
                        size={17}
                        style={{
                          flexShrink: 0,
                          color: "var(--text-muted)",
                          transform: qnaOpen === i ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    </button>
                    {qnaOpen === i && (
                      <div style={{ padding: "0 18px 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, whiteSpace: "pre-line" }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 최신 글 */}
            {recentPosts.length > 0 && (
              <section style={{ marginTop: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>관세 정보 최신 글</h2>
                  <Link href="/board" style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>전체 보기 →</Link>
                </div>
                <div className={styles.postGrid}>
                  {recentPosts.map((post) => (
                    <Link key={post.id} href={`/board?id=${post.id}`} className={styles.postCard}>
                      <span className={styles.postCategory}>{post.category}</span>
                      <span className={styles.postTitle}>{post.title}</span>
                      <span className={styles.postSummary}>{post.summary}</span>
                      <span className={styles.postDate}>{post.date}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>
          {/* /mainCol */}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              오른쪽: 사이드바
              mainCol 전체 높이만큼 sticky로 따라다님
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <aside className={styles.infoCol}>

            <div className={styles.infoCard}>
              <h2 className={styles.infoCardTitle}>📐 관세 계산 공식</h2>
              <ol className={styles.formulaList}>
                <li><strong>과세가격</strong> = (상품가 + 배송비) × 환율</li>
                <li><strong>관세</strong> = 과세가격 × 품목별 세율</li>
                <li><strong>부가세</strong> = (과세가격 + 관세) × 10%</li>
                <li><strong>총 세금</strong> = 관세 + 부가세</li>
              </ol>
            </div>

            <div className={styles.infoCard}>
              <h2 className={styles.infoCardTitle}>🌍 국가별 면세 한도</h2>
              <table className={styles.infoTable}>
                <tbody>
                  {[
                    { flag: "🇺🇸", country: "미국", limit: "$200", note: "목록통관 가능" },
                    { flag: "🇯🇵", country: "일본", limit: "$150", note: "엔화 환산 기준" },
                    { flag: "🇨🇳", country: "중국", limit: "$150", note: "위안화 환산 기준" },
                    { flag: "🇪🇺", country: "유럽", limit: "$150", note: "유로 환산 기준" },
                  ].map((r) => (
                    <tr key={r.country}>
                      <td>{r.flag} {r.country}</td>
                      <td style={{ fontWeight: 700, color: "var(--primary)" }}>{r.limit}</td>
                      <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.infoCard}>
              <h2 className={styles.infoCardTitle}>📊 주요 품목 관세율</h2>
              <table className={styles.infoTable}>
                <tbody>
                  {[
                    { label: "의류·신발", rate: "13%" },
                    { label: "전자제품", rate: "0%" },
                    { label: "화장품", rate: "6.5%" },
                    { label: "영양제·식품", rate: "8%" },
                    { label: "향수", rate: "7%" },
                    { label: "서적", rate: "0%" },
                  ].map((r) => (
                    <tr key={r.label}>
                      <td>{r.label}</td>
                      <td style={{ fontWeight: 700, color: r.rate === "0%" ? "var(--success)" : "var(--text-primary)" }}>{r.rate}</td>
                      <td style={{ fontSize: 11, color: "var(--text-muted)" }}>+ 부가세 10%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Link href="/combined-tax" className={styles.ctaCard}>
              <span style={{ fontSize: 22 }}>⚠️</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>합산과세 위험 체크</p>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>여러 건이 같은 날 도착하면 세금 폭탄</p>
              </div>
              <span style={{ marginLeft: "auto", color: "var(--primary)", fontWeight: 700 }}>→</span>
            </Link>

          </aside>
          {/* /infoCol */}

        </div>
        {/* /pageGrid */}

      </div>
    </div>
  );
}
