"use client";

import { useMemo, useState } from "react";

type Mode = "monthly" | "daily" | "varied";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TAX_EXEMPT_CAP = 90000;

const formatPHP = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const toNumber = (v: string) => {
  const n = parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: "8px",
  fontSize: "0.95rem",
  color: "#111827",
  background: "#ffffff",
};

const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" };

const ThirteenthMonthCalculator = () => {
  const [mode, setMode] = useState<Mode>("monthly");
  const [monthlySalary, setMonthlySalary] = useState("20000");
  const [dailyRate, setDailyRate] = useState("755");
  const [daysPerMonth, setDaysPerMonth] = useState("26");
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);
  const [unpaidDeductions, setUnpaidDeductions] = useState("0");
  const [perMonth, setPerMonth] = useState<string[]>(Array(12).fill(""));

  const monthsWorked = endMonth >= startMonth ? endMonth - startMonth + 1 : 0;

  const totalBasic = useMemo(() => {
    if (mode === "varied") return perMonth.reduce((sum, v) => sum + toNumber(v), 0);
    const perMonthBasic = mode === "monthly" ? toNumber(monthlySalary) : toNumber(dailyRate) * toNumber(daysPerMonth);
    return Math.max(perMonthBasic * monthsWorked - toNumber(unpaidDeductions), 0);
  }, [mode, perMonth, monthlySalary, dailyRate, daysPerMonth, monthsWorked, unpaidDeductions]);

  const thirteenthMonth = totalBasic / 12;

  const tabs: { key: Mode; label: string }[] = [
    { key: "monthly", label: "Monthly salary" },
    { key: "daily", label: "Daily rate" },
    { key: "varied", label: "Salary changed" },
  ];

  return (
    <div style={{ border: "1px solid rgba(255,193,7,0.35)", borderRadius: "16px", padding: "1.5rem", background: "#FFFBF0", marginBottom: "2.5rem" }}>
      <p style={{ fontWeight: 700, color: "#111827", fontSize: "1.05rem", margin: "0 0 0.25rem 0" }}>13th Month Pay Calculator (2026)</p>
      <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: "0 0 1.25rem 0" }}>
        Enter basic salary only. Leave out overtime, allowances, night differential, holiday pay, and COLA unless your company treats them as part of basic salary.
      </p>

      <div role="tablist" aria-label="Salary type" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={mode === t.key}
            onClick={() => setMode(t.key)}
            style={{
              padding: "0.45rem 0.9rem",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 600,
              border: mode === t.key ? "1px solid hsl(38, 92%, 45%)" : "1px solid rgba(0,0,0,0.12)",
              background: mode === t.key ? "hsl(38, 92%, 45%)" : "#ffffff",
              color: mode === t.key ? "#ffffff" : "#374151",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mode !== "varied" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
          {mode === "monthly" ? (
            <div>
              <label htmlFor="tm-monthly" style={labelStyle}>Monthly basic salary (₱)</label>
              <input id="tm-monthly" inputMode="decimal" style={inputStyle} value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} />
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="tm-daily" style={labelStyle}>Daily rate (₱)</label>
                <input id="tm-daily" inputMode="decimal" style={inputStyle} value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} />
              </div>
              <div>
                <label htmlFor="tm-days" style={labelStyle}>Days worked per month</label>
                <input id="tm-days" inputMode="numeric" style={inputStyle} value={daysPerMonth} onChange={(e) => setDaysPerMonth(e.target.value)} />
              </div>
            </>
          )}
          <div>
            <label htmlFor="tm-start" style={labelStyle}>First month worked in 2026</label>
            <select id="tm-start" style={inputStyle} value={startMonth} onChange={(e) => setStartMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="tm-end" style={labelStyle}>Last month worked in 2026</label>
            <select id="tm-end" style={inputStyle} value={endMonth} onChange={(e) => setEndMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="tm-unpaid" style={labelStyle}>Unpaid absences deducted (₱)</label>
            <input id="tm-unpaid" inputMode="decimal" style={inputStyle} value={unpaidDeductions} onChange={(e) => setUnpaidDeductions(e.target.value)} />
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "0 0 0.75rem 0" }}>
            Enter the basic salary actually earned each month. Leave months not worked blank. Use this for raises, wage order increases, or daily-paid workers with varying days.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.75rem" }}>
            {MONTHS.map((m, i) => (
              <div key={m}>
                <label htmlFor={`tm-m-${i}`} style={labelStyle}>{m} (₱)</label>
                <input
                  id={`tm-m-${i}`}
                  inputMode="decimal"
                  style={inputStyle}
                  value={perMonth[i]}
                  onChange={(e) => setPerMonth((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {mode !== "varied" && monthsWorked === 0 && (
        <p style={{ fontSize: "0.85rem", color: "#b91c1c", margin: "0 0 1rem 0" }}>The last month worked must be the same as or after the first month.</p>
      )}

      <div aria-live="polite" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.9rem", color: "#374151", marginBottom: "0.4rem" }}>
          <span>Total basic salary earned</span>
          <span style={{ fontWeight: 600 }}>{formatPHP(totalBasic)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827" }}>13th month pay (÷ 12)</span>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "hsl(38, 92%, 38%)" }}>{formatPHP(thirteenthMonth)}</span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "0.6rem 0 0 0" }}>
          {thirteenthMonth <= TAX_EXEMPT_CAP
            ? "Within the ₱90,000 tax-exempt ceiling, which is shared with other bonuses and benefits paid in the year."
            : `${formatPHP(thirteenthMonth - TAX_EXEMPT_CAP)} exceeds the ₱90,000 tax-exempt ceiling and is taxable, before counting other bonuses.`}
        </p>
      </div>
    </div>
  );
};

export default ThirteenthMonthCalculator;
