"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Plus, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import styles from "../page.module.css";

interface Item {
  id: number;
  price: string;
}

const TABS = [
  { id: "combined", label: "⚠️ 합산과세 체크" },
  { id: "unit",     label: "📐 단위 변환" },
  { id: "shipping", label: "✈️ 배송비 계산" },
];

/* ────────────────────────────────────────
   탭 1: 합산과세 체크
──────────────────────────────────────── */
function CombinedTaxTab() {
  const { rates } = useExchangeRate();
  const [origin, setOrigin] = useState<"us" | "jp" | "cn">("jp");
  const [items, setItems] = useState<Item[]>([
    { id: 1, price: "" },
    { id: 2, price: "" },
  ]);

  const limit = origin === "us" ? 200 : 150;
  const getCurrencyLabel = () => (origin === "jp" ? "JPY (¥)" : origin === "cn" ? "CNY (¥)" : "USD ($)");
  const getCurrencySymbol = () => (origin === "jp" || origin === "cn" ? "¥" : "$");

  const totalLocal = useMemo(
    () => items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0),
    [items]
  );
  const totalUSD = useMemo(() => {
    if (origin === "us") return totalLocal;
    if (!rates) return totalLocal;
    if (origin === "jp") return totalLocal / rates.JPY;
    if (origin === "cn") return totalLocal / rates.CNY;
    return totalLocal;
  }, [totalLocal, origin, rates]);

  const isOverLimit = totalUSD > limit;
  const addItem = () => setItems((prev) => [...prev, { id: Date.now(), price: "" }]);
  const removeItem = (id: number) => {
    if (items.length <= 2) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
  const updateItem = (id: number, price: string) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, price } : item)));

  return (
    <div>
      {/* 출발 국가 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>출발 국가</label>
        <div className={styles.radioGroup}>
          {(["us", "jp", "cn"] as const).map((o) => (
            <div key={o} className={styles.radioOption}>
              <input
                type="radio" id={`o-${o}`} name="combined-origin"
                value={o} checked={origin === o}
                onChange={() => setOrigin(o)} className={styles.radioInput}
              />
              <label htmlFor={`o-${o}`} className={styles.radioLabel}>
                {o === "us" ? "🇺🇸 미국" : o === "jp" ? "🇯🇵 일본" : "🇨🇳 중국"}
                <span>
                  {o === "us" ? "$200 이하 면세"
                    : o === "jp" && rates ? `¥${(150 * rates.JPY).toLocaleString("ko-KR", { maximumFractionDigits: 0 })} 이하 면세`
                    : "$150 이하 면세"}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 물품 입력 */}
      <div className={styles.formGroup} style={{ marginTop: 20 }}>
        <label className={styles.label}>합산될 물품 가격 ({getCurrencyLabel()})</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item, index) => (
            <div key={item.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: "var(--bg-page)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", flexShrink: 0,
              }}>
                {index + 1}
              </div>
              <input
                type="number" className={styles.input}
                placeholder={`물품 ${index + 1} 가격`}
                min="0" step="any" value={item.price}
                onChange={(e) => updateItem(item.id, e.target.value)}
                style={{ flex: 1 }}
              />
              {items.length > 2 && (
                <button onClick={() => removeItem(item.id)}
                  style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: 8, display: "flex", alignItems: "center" }}
                  aria-label="삭제">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addItem} style={{
          marginTop: 12, width: "100%", padding: "11px 0",
          background: "var(--bg-page)", color: "var(--primary)",
          border: "1.5px dashed var(--primary)", borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, cursor: "pointer", gap: 7, fontSize: 14,
        }}>
          <Plus size={16} /> 물품 추가
        </button>
      </div>

      {/* 결과 */}
      <div style={{
        marginTop: 24, padding: 20, borderRadius: 12, background: "var(--bg-page)",
        border: `2px solid ${isOverLimit ? "var(--danger)" : totalUSD > 0 ? "var(--success)" : "var(--border-color)"}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>총 합산 금액</span>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", display: "block" }}>
              {getCurrencySymbol()}{totalLocal.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
            </span>
            {origin !== "us" && (
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                (USD 환산: ${totalUSD.toFixed(2)} / 한도: ${limit})
              </span>
            )}
          </div>
        </div>
        {totalLocal > 0 && (
          <div style={{
            padding: 14, borderRadius: 8,
            background: isOverLimit ? "var(--danger-light)" : "var(--success-light)",
            color: isOverLimit ? "var(--danger)" : "var(--success)",
          }}>
            {isOverLimit ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
                  <AlertTriangle size={18} /> ⚠️ 합산과세 대상 — 입항일을 분리하세요
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-primary)" }}>
                  면세 한도(${limit})를 초과했습니다. 같은 날 한국에 도착하면 <strong>{getCurrencySymbol()}{totalLocal.toLocaleString("ko-KR", { maximumFractionDigits: 2 })} 전체 금액</strong>에 관세·부가세가 부과됩니다.<br />
                  <span style={{ color: "var(--danger)", fontWeight: 600 }}>👉 결제일을 나누거나 배송대행지 발송 날짜를 조절하세요.</span>
                </p>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
                  <CheckCircle2 size={18} /> ✅ 안전 — 면세 한도 이내입니다
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text-primary)" }}>
                  면세 한도(${limit}) 이내이므로 같은 날 도착해도 합산과세가 부과되지 않습니다.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── 합산과세 설명 ── */}
      <article style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
        <section>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 10px", color: "var(--text-primary)" }}>합산과세란 무엇인가요?</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0 }}>
            <strong>합산과세</strong>란 같은 나라에서 출발한 해외 직구 물건이 <strong>같은 날(입항일 기준) 2건 이상</strong> 한국에 도착할 경우,
            세관이 모든 물건의 가격을 합산해 면세 한도 초과 여부를 판단하는 제도입니다.
            각각의 주문이 면세 한도 이내라도 합산 금액이 초과하면 전체 금액에 관세와 부가세가 부과됩니다.
          </p>
        </section>

        <section style={{ padding: "16px 18px", background: "#fff5f5", border: "1.5px solid #fecaca", borderRadius: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 10px", color: "var(--danger)" }}>⚠️ 왜 합산과세를 꼭 신경써야 할까요?</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.9 }}>
            <li>초과분에만 세금이 붙는 게 아닙니다. <strong>한 푼이라도 초과하면 전체 금액이 과세 대상</strong>이 됩니다.</li>
            <li>예: 일본 직구 ¥15,000 + ¥8,000 = ¥23,000 (USD 환산 약 $155) → $150 초과 → <strong>¥23,000 전체에 관세 부과</strong></li>
            <li>각각 따로 주문했더라도 같은 날 입항하면 합산됩니다.</li>
            <li>라쿠텐, 아마존 재팬, 큐텐 재팬 등 <strong>여러 쇼핑몰에서 동시 구매 시 특히 위험</strong>합니다.</li>
          </ul>
        </section>

        <section>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 10px", color: "var(--text-primary)" }}>합산과세 피하는 3가지 방법</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { num: "①", title: "입항일 분리", desc: "첫 번째 물건이 한국 통관을 완료한 뒤 다음 배송대행지 발송을 요청하세요. 입항일이 달라지면 합산 대상에서 제외됩니다." },
              { num: "②", title: "출발 국가 분산", desc: "미국과 일본처럼 서로 다른 나라에서 구매한 물건은 합산되지 않습니다. 장바구니를 국가별로 나눠 결제하는 것도 방법입니다." },
              { num: "③", title: "수취인 분리", desc: "가족 각각의 이름과 개인통관고유부호로 수취인을 다르게 설정하면 별도 건으로 처리됩니다. 단, 주소도 다른 게 안전합니다." },
            ].map((item) => (
              <div key={item.num} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "var(--primary-light)", border: "1px solid var(--primary-border)", borderRadius: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: "var(--primary)", flexShrink: 0 }}>{item.num}</span>
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "14px 16px", background: "var(--bg-page)", border: "1px solid var(--border-color)", borderRadius: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, margin: "0 0 8px", color: "var(--text-primary)" }}>합산과세 국가별 면세 한도</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <tbody>
              {[
                { flag: "🇺🇸", country: "미국", limit: "$200", note: "목록통관 품목 기준" },
                { flag: "🇯🇵", country: "일본", limit: "$150", note: "엔화 → USD 환산" },
                { flag: "🇨🇳", country: "중국", limit: "$150", note: "위안화 → USD 환산" },
              ].map((r) => (
                <tr key={r.country}>
                  <td style={{ padding: "7px 0", borderBottom: "1px solid var(--border-color)", fontWeight: 600 }}>{r.flag} {r.country}</td>
                  <td style={{ padding: "7px 0", borderBottom: "1px solid var(--border-color)", color: "var(--primary)", fontWeight: 800, textAlign: "center" }}>{r.limit}</td>
                  <td style={{ padding: "7px 0", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: 12 }}>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </article>
    </div>
  );
}

/* ────────────────────────────────────────
   탭 2: 단위 변환
──────────────────────────────────────── */
const UNIT_GROUPS = [
  {
    label: "길이",
    units: ["cm", "inch", "mm", "m", "ft"],
    toBase: { cm: 1, inch: 2.54, mm: 0.1, m: 100, ft: 30.48 }, // base: cm
    fromBase: { cm: 1, inch: 1 / 2.54, mm: 10, m: 0.01, ft: 1 / 30.48 },
    decimals: { cm: 2, inch: 3, mm: 1, m: 4, ft: 3 },
  },
  {
    label: "무게",
    units: ["kg", "lb", "g", "oz"],
    toBase: { kg: 1, lb: 0.453592, g: 0.001, oz: 0.0283495 }, // base: kg
    fromBase: { kg: 1, lb: 1 / 0.453592, g: 1000, oz: 1 / 0.0283495 },
    decimals: { kg: 3, lb: 3, g: 0, oz: 2 },
  },
  {
    label: "온도",
    units: ["°C", "°F", "K"],
    toBase: {} as Record<string, number>,   // 특수 처리
    fromBase: {} as Record<string, number>,
    decimals: { "°C": 1, "°F": 1, "K": 1 },
  },
];

function convertTemp(value: number, from: string, to: string): number {
  let celsius = value;
  if (from === "°F") celsius = (value - 32) * 5 / 9;
  if (from === "K")  celsius = value - 273.15;
  if (to === "°C") return celsius;
  if (to === "°F") return celsius * 9 / 5 + 32;
  return celsius + 273.15; // K
}

function UnitTab() {
  const [groupIdx, setGroupIdx] = useState(0);
  const [fromUnit, setFromUnit] = useState("cm");
  const [toUnit, setToUnit] = useState("inch");
  const [inputVal, setInputVal] = useState("");

  const group = UNIT_GROUPS[groupIdx];

  const result = useMemo(() => {
    const v = parseFloat(inputVal);
    if (isNaN(v)) return null;
    if (group.label === "온도") {
      return convertTemp(v, fromUnit, toUnit);
    }
    const base = v * ((group.toBase as Record<string, number>)[fromUnit] ?? 1);
    return base * ((group.fromBase as Record<string, number>)[toUnit] ?? 1);
  }, [inputVal, fromUnit, toUnit, group]);

  const dec = (group.decimals as unknown as Record<string, number>)[toUnit] ?? 2;

  const handleGroupChange = (idx: number) => {
    setGroupIdx(idx);
    setFromUnit(UNIT_GROUPS[idx].units[0]);
    setToUnit(UNIT_GROUPS[idx].units[1]);
    setInputVal("");
  };

  return (
    <div>
      {/* 단위 종류 선택 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>단위 종류</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {UNIT_GROUPS.map((g, i) => (
            <button key={g.label} onClick={() => handleGroupChange(i)}
              style={{
                padding: "8px 18px", borderRadius: 8, border: "1.5px solid",
                borderColor: groupIdx === i ? "var(--primary)" : "var(--border-color)",
                background: groupIdx === i ? "var(--primary-light)" : "white",
                color: groupIdx === i ? "var(--primary)" : "var(--text-secondary)",
                fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.15s",
              }}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* 변환 폼 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end", marginTop: 8 }}>
        <div>
          <label className={styles.label}>변환할 값</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="number" className={styles.input} placeholder="값 입력"
              value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              style={{ flex: 1 }}
            />
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className={styles.select} style={{ width: "auto", minWidth: 80 }}>
              {group.units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 22, color: "var(--primary)", paddingBottom: 6 }}>→</div>

        <div>
          <label className={styles.label}>변환 단위</label>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className={styles.select}>
            {group.units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* 결과 */}
      <div style={{
        marginTop: 20, padding: "20px 24px", borderRadius: 12,
        background: result !== null ? "var(--primary-light)" : "var(--bg-page)",
        border: `1.5px solid ${result !== null ? "var(--primary-border)" : "var(--border-color)"}`,
        textAlign: "center",
      }}>
        {result !== null ? (
          <>
            <p style={{ margin: "0 0 6px", fontSize: 14, color: "var(--text-secondary)" }}>
              {inputVal} {fromUnit} =
            </p>
            <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "var(--primary)" }}>
              {result.toFixed(dec)} <span style={{ fontSize: 20 }}>{toUnit}</span>
            </p>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>값을 입력하면 변환 결과가 표시됩니다</p>
        )}
      </div>

      {/* 주요 환산표 */}
      <div style={{ marginTop: 20 }}>
        <p className={styles.label}>자주 쓰는 환산 참고표</p>
        {groupIdx === 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <tbody>
              {[["1 inch", "2.54 cm"], ["1 ft", "30.48 cm"], ["1 m", "39.37 inch"], ["10 cm", "3.94 inch"], ["30 cm", "11.81 inch"]].map(([a, b]) => (
                <tr key={a}>
                  <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--border-color)", fontWeight: 600 }}>{a}</td>
                  <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--border-color)", color: "var(--primary)", fontWeight: 700 }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {groupIdx === 1 && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <tbody>
              {[["1 lb", "453.6 g"], ["1 kg", "2.205 lb"], ["1 oz", "28.35 g"], ["500 g", "1.102 lb"], ["2 kg", "4.409 lb"]].map(([a, b]) => (
                <tr key={a}>
                  <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--border-color)", fontWeight: 600 }}>{a}</td>
                  <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--border-color)", color: "var(--primary)", fontWeight: 700 }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {groupIdx === 2 && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <tbody>
              {[["0°C", "32°F / 273.15K"], ["100°C", "212°F / 373.15K"], ["37°C", "98.6°F"], ["-40°C", "-40°F"], ["20°C", "68°F"]].map(([a, b]) => (
                <tr key={a}>
                  <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--border-color)", fontWeight: 600 }}>{a}</td>
                  <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--border-color)", color: "var(--primary)", fontWeight: 700 }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── 단위변환 설명 ── */}
      <article style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
        <section>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 10px", color: "var(--text-primary)" }}>해외직구에서 단위 변환이 필요한 이유</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0 }}>
            미국·일본·유럽 쇼핑몰은 사이즈 표기 단위가 한국과 다릅니다. 옷은 inch, 무게는 lb, 온도는 °F로 표기되는 경우가 많아
            실제 구매 전 반드시 단위를 변환해 확인해야 합니다. 잘못된 사이즈 구매는 반품·교환이 어렵고 추가 배송비가 발생합니다.
          </p>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { title: "👗 의류 사이즈", desc: "미국 의류는 inch 기준. 허리 32inch = 약 81cm. 꼭 cm로 변환 후 실측치와 비교하세요." },
            { title: "⚖️ 무게 (lb → kg)", desc: "미국 제품은 lb 단위. 1lb = 약 453g. 영양제 용량 표기 시 특히 자주 등장합니다." },
            { title: "📦 배송 무게", desc: "배송비는 kg 기준. 배송사 사이트에서 부피무게도 함께 확인하면 더 정확합니다." },
            { title: "🌡️ 온도 (°F → °C)", desc: "미국 조리법·제품 보관 온도는 °F 표기. 350°F = 약 177°C (오븐 설정 시 참고)." },
          ].map((item) => (
            <div key={item.title} style={{ padding: "12px 14px", background: "var(--bg-page)", border: "1px solid var(--border-color)", borderRadius: 10 }}>
              <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 13, color: "var(--text-primary)" }}>{item.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </section>

        <section style={{ padding: "14px 16px", background: "var(--primary-light)", border: "1px solid var(--primary-border)", borderRadius: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, margin: "0 0 6px", color: "var(--primary)" }}>💡 직구 의류 사이즈 빠른 참고</h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            미국 여성 의류 S = 한국 55 / M = 66 / L = 77 기준 (브랜드마다 다를 수 있음)<br />
            신발: 미국 7 = 한국 240mm / 8 = 250mm / 9 = 260mm / 10 = 270mm
          </p>
        </section>
      </article>
    </div>
  );
}

/* ────────────────────────────────────────
   탭 3: 배송비 계산
──────────────────────────────────────── */
const CARRIERS = [
  {
    name: "EMS",
    zones: {
      jp: [
        { max: 0.5, price: 18000 }, { max: 1, price: 22500 }, { max: 2, price: 29500 },
        { max: 3, price: 36000 }, { max: 4, price: 42500 }, { max: 5, price: 49000 },
        { max: 10, price: 70000 }, { max: 20, price: 105000 },
      ],
      us: [
        { max: 0.5, price: 28000 }, { max: 1, price: 37000 }, { max: 2, price: 52000 },
        { max: 3, price: 66000 }, { max: 4, price: 80000 }, { max: 5, price: 93000 },
        { max: 10, price: 148000 }, { max: 20, price: 236000 },
      ],
      cn: [
        { max: 0.5, price: 14000 }, { max: 1, price: 17000 }, { max: 2, price: 22000 },
        { max: 3, price: 27000 }, { max: 4, price: 32000 }, { max: 5, price: 37000 },
        { max: 10, price: 57000 }, { max: 20, price: 87000 },
      ],
    } as Record<string, { max: number; price: number }[]>,
  },
  {
    name: "K-Packet",
    zones: {
      jp: [
        { max: 0.1, price: 4500 }, { max: 0.3, price: 6000 }, { max: 0.5, price: 7500 },
        { max: 1, price: 10000 }, { max: 2, price: 14000 },
      ],
      us: [
        { max: 0.1, price: 7000 }, { max: 0.3, price: 9500 }, { max: 0.5, price: 12000 },
        { max: 1, price: 16500 }, { max: 2, price: 23000 },
      ],
      cn: [
        { max: 0.1, price: 3500 }, { max: 0.3, price: 5000 }, { max: 0.5, price: 6500 },
        { max: 1, price: 9000 }, { max: 2, price: 13000 },
      ],
    } as Record<string, { max: number; price: number }[]>,
  },
];

function ShippingTab() {
  const { rate } = useExchangeRate();
  const [dest, setDest] = useState<"jp" | "us" | "cn">("jp");
  const [weight, setWeight] = useState("");
  const [carrier, setCarrier] = useState("EMS");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;
    const c = CARRIERS.find((c) => c.name === carrier);
    if (!c) return null;
    const zones = c.zones[dest];
    const tier = zones.find((z) => w <= z.max);
    return tier ? tier.price : zones[zones.length - 1].price + Math.ceil((w - zones[zones.length - 1].max) / 1) * 8000;
  }, [weight, dest, carrier]);

  const resultUSD = result && rate ? (result / rate).toFixed(2) : null;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* 목적지 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>배송 목적지</label>
          <div className={styles.radioGroup} style={{ flexDirection: "column" }}>
            {(["jp", "us", "cn"] as const).map((d) => (
              <div key={d} className={styles.radioOption} style={{ minWidth: "auto" }}>
                <input type="radio" id={`dest-${d}`} name="dest" value={d}
                  checked={dest === d} onChange={() => setDest(d)} className={styles.radioInput} />
                <label htmlFor={`dest-${d}`} className={styles.radioLabel} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 8, padding: "10px 14px" }}>
                  {d === "jp" ? "🇯🇵 일본" : d === "us" ? "🇺🇸 미국" : "🇨🇳 중국"}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 운송사 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>운송사</label>
          <div className={styles.radioGroup} style={{ flexDirection: "column" }}>
            {CARRIERS.map((c) => (
              <div key={c.name} className={styles.radioOption} style={{ minWidth: "auto" }}>
                <input type="radio" id={`carrier-${c.name}`} name="carrier" value={c.name}
                  checked={carrier === c.name} onChange={() => setCarrier(c.name)} className={styles.radioInput} />
                <label htmlFor={`carrier-${c.name}`} className={styles.radioLabel} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 8, padding: "10px 14px" }}>
                  {c.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 무게 입력 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>무게 (kg)</label>
        <input
          type="number" className={styles.input}
          placeholder="예: 0.5 (500g)"
          min="0" step="0.1" value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      {/* 결과 */}
      <div style={{
        marginTop: 8, padding: "20px 24px", borderRadius: 12,
        background: result ? "var(--primary-light)" : "var(--bg-page)",
        border: `1.5px solid ${result ? "var(--primary-border)" : "var(--border-color)"}`,
      }}>
        {result ? (
          <>
            <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--text-secondary)" }}>
              {dest === "jp" ? "🇯🇵 일본" : dest === "us" ? "🇺🇸 미국" : "🇨🇳 중국"} → 한국 · {carrier} · {weight}kg
            </p>
            <p style={{ margin: "0 0 4px", fontSize: 32, fontWeight: 800, color: "var(--primary)" }}>
              {result.toLocaleString("ko-KR")}원
            </p>
            {resultUSD && (
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
                ≈ ${resultUSD} (현재 환율 기준)
              </p>
            )}
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
              * 위 요금은 우체국 기준 참고치이며 실제 요금은 배송사·부피무게 등에 따라 다를 수 있습니다.
            </p>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", textAlign: "center" }}>무게를 입력하면 예상 배송비가 표시됩니다</p>
        )}
      </div>

      {/* 참고 운임표 */}
      <div style={{ marginTop: 20 }}>
        <p className={styles.label}>EMS 요금 참고 (일본 → 한국, 우체국 기준)</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg-page)" }}>
              {["무게", "EMS 요금", "K-Packet 요금"].map((h) => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", borderBottom: "1px solid var(--border-color)", fontWeight: 700, fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["0.5kg 이하", "18,000원", "7,500원"],
              ["1kg 이하", "22,500원", "10,000원"],
              ["2kg 이하", "29,500원", "14,000원"],
              ["3kg 이하", "36,000원", "—"],
              ["5kg 이하", "49,000원", "—"],
            ].map(([w, ems, kp]) => (
              <tr key={w}>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--border-color)", fontWeight: 600 }}>{w}</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--border-color)", color: "var(--primary)", fontWeight: 700 }}>{ems}</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--border-color)" }}>{kp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 배송비 설명 ── */}
      <article style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
        <section>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 10px", color: "var(--text-primary)" }}>배송비도 관세 과세가격에 포함됩니다</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0 }}>
            많은 분들이 놓치는 부분입니다. 해외직구 관세를 계산할 때 <strong>상품 가격 + 배송비</strong>를 합산한 금액이 과세가격(CIF 기준)이 됩니다.
            배송비가 높으면 면세 한도를 초과할 수 있으므로, 배송비까지 포함해서 미리 계산해보는 것이 중요합니다.
          </p>
        </section>

        <section style={{ padding: "16px 18px", background: "#fff5f5", border: "1.5px solid #fecaca", borderRadius: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 10px", color: "var(--danger)" }}>⚠️ 배송비 관련 주의사항</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.9 }}>
            <li><strong>배대지(배송대행지) 수수료도 포함</strong> — 현지 쇼핑몰 배송비 + 배대지 → 한국 국제 배송비 전부 합산됩니다.</li>
            <li><strong>무료배송 상품이 유리</strong> — 배송비가 0이면 상품 가격만으로 면세 여부가 결정됩니다.</li>
            <li><strong>EMS vs K-Packet</strong> — EMS는 빠르지만 비쌈. K-Packet은 2kg 이하 소형 상품에 저렴합니다.</li>
            <li><strong>부피무게 주의</strong> — 실제 무게보다 부피가 크면 부피무게 기준으로 요금이 책정될 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 10px", color: "var(--text-primary)" }}>EMS vs K-Packet — 어떤 걸 선택해야 할까요?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              {
                name: "EMS",
                pros: ["빠른 배송 (3~5일)", "무거운 물건에 유리", "분실·파손 보상 우수"],
                cons: ["요금이 비쌈", "2kg 이하 소형엔 비효율"],
                color: "var(--primary)",
                bg: "var(--primary-light)",
                border: "var(--primary-border)",
              },
              {
                name: "K-Packet",
                pros: ["소형·경량에 저렴", "2kg 이하 최적", "신뢰할 수 있는 우체국 서비스"],
                cons: ["EMS보다 느림 (7~14일)", "무거운 물건엔 불리"],
                color: "#92400e",
                bg: "#fefce8",
                border: "#fde68a",
              },
            ].map((item) => (
              <div key={item.name} style={{ padding: "14px 16px", background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 12 }}>
                <p style={{ margin: "0 0 10px", fontWeight: 800, fontSize: 15, color: item.color }}>{item.name}</p>
                <ul style={{ margin: "0 0 8px", paddingLeft: 16, fontSize: 12, color: "var(--text-primary)", lineHeight: 1.8 }}>
                  {item.pros.map((p) => <li key={p}>✅ {p}</li>)}
                </ul>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  {item.cons.map((c) => <li key={c}>— {c}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "14px 16px", background: "var(--bg-page)", border: "1px solid var(--border-color)", borderRadius: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, margin: "0 0 6px", color: "var(--text-primary)" }}>💡 배송비 절약 팁</h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.85 }}>
            같은 배대지로 보내는 물건은 <strong>합포장(consolidation)</strong>으로 묶으면 배송비를 줄일 수 있습니다.
            단, 합포장 시 여러 주문이 같은 날 발송되므로 합산과세 여부를 꼭 확인하세요.
            무게가 2kg 이하라면 K-Packet이, 그 이상이라면 EMS가 대체로 유리합니다.
          </p>
        </section>
      </article>
    </div>
  );
}

/* ────────────────────────────────────────
   메인 페이지
──────────────────────────────────────── */
export default function CombinedTaxPage() {
  const [activeTab, setActiveTab] = useState("combined");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <span className={styles.headerBadge}>직구 도우미 툴</span>
          <h1 className={styles.title}>해외직구 필수 계산기 모음</h1>
          <p className={styles.subtitle}>
            합산과세 체크, 단위 변환, 배송비 계산까지 — 직구할 때 필요한 도구를 한 곳에 모았습니다.
          </p>
        </header>

        {/* 탭 버튼 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "10px 20px", borderRadius: 10, fontWeight: 700,
                fontSize: 14, cursor: "pointer", transition: "all 0.15s",
                border: activeTab === t.id ? "2px solid var(--primary)" : "1.5px solid var(--border-color)",
                background: activeTab === t.id ? "var(--primary)" : "white",
                color: activeTab === t.id ? "white" : "var(--text-secondary)",
                boxShadow: activeTab === t.id ? "var(--shadow-sm)" : "none",
              } as React.CSSProperties}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 탭 컨텐츠 */}
        <div
          className={styles.card}
          style={{ border: "2px solid var(--primary)", boxShadow: "var(--shadow-md)", animation: "fadeIn 0.15s ease" }}
        >
          {activeTab === "combined" && <CombinedTaxTab />}
          {activeTab === "unit"     && <UnitTab />}
          {activeTab === "shipping" && <ShippingTab />}
        </div>

        <footer style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-color)", textAlign: "center" }}>
          <Link href="/" style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            ← 관세 계산기로 돌아가기
          </Link>
        </footer>
      </div>
    </div>
  );
}
