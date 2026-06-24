"use client";

import { useState, useMemo, useRef } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormValues {
  employees: number;
  hrStaff: number;
  avgMonthlySalary: number;
  payrollHoursPerWeek: number;
  complianceHoursPerWeek: number;
  errorsPerMonth: number;
  toolCount: number;
}

interface LeadValues {
  name: string;
  email: string;
  company: string;
}

interface CalcResults {
  payrollTimeCost: number;
  complianceTimeCost: number;
  errorCost: number;
  toolRedundancyCost: number;
  totalWaste: number;
  yahshuaSavings: number;
  monthsToROI: number;
  yahshuaMonthly: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const CALENDLY =
  "https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=calculator&utm_campaign=hris_2026";

const DEFAULTS: FormValues = {
  employees: 50,
  hrStaff: 2,
  avgMonthlySalary: 30000,
  payrollHoursPerWeek: 10,
  complianceHoursPerWeek: 5,
  errorsPerMonth: 3,
  toolCount: 2,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n));

const calcYahshuaMonthly = (employees: number): number => {
  const base = 4000;
  if (employees <= 100) return base;
  let extra = 0;
  let rem = employees - 100;
  const t1 = Math.min(rem, 150);
  extra += t1 * 39;
  rem -= t1;
  if (rem > 0) {
    const t2 = Math.min(rem, 250);
    extra += t2 * 37;
    rem -= t2;
  }
  if (rem > 0) extra += rem * 35;
  return Math.round((base + extra) * 1.12);
};

const runCalc = (f: FormValues): CalcResults => {
  // 1.18 = PH employer burden: 13th month (8.3%) + SSS (~4%) + PhilHealth (~2.5%) + Pag-IBIG (~0.3%) + misc (~3%)
  // 173 = standard PH working hours per month (8h × 5d × ~21.75 working days)
  const hourlyRate = (f.avgMonthlySalary * 1.18) / 173;
  // Multiply by hrStaff — payroll/compliance hours are per-person, not total team
  const payrollTimeCost = hourlyRate * f.hrStaff * f.payrollHoursPerWeek * 52;
  const complianceTimeCost = hourlyRate * f.hrStaff * f.complianceHoursPerWeek * 52;
  const errorCost = f.errorsPerMonth * 2500 * 12;
  // ₱36,000/yr per extra tool (≈ ₱3,000/mo — entry-level PH software subscription equivalent)
  const toolRedundancyCost = (f.toolCount - 1) * 36000;
  const totalWaste = payrollTimeCost + complianceTimeCost + errorCost + toolRedundancyCost;
  const yahshuaSavings = totalWaste * 0.7;
  const yahshuaMonthly = calcYahshuaMonthly(f.employees);
  const monthsToROI =
    yahshuaSavings > 0 ? Math.ceil(yahshuaMonthly / (yahshuaSavings / 12)) : 0;
  return {
    payrollTimeCost,
    complianceTimeCost,
    errorCost,
    toolRedundancyCost,
    totalWaste,
    yahshuaSavings,
    monthsToROI,
    yahshuaMonthly,
  };
};

// ─── SliderField ────────────────────────────────────────────────────────────

function SliderField({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  prefix = "",
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  const clamp = (raw: number) =>
    Math.min(max, Math.max(min, isNaN(raw) ? min : raw));

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <label className="text-sm font-medium text-gray-700 leading-snug flex-1">
          {label}
        </label>
        <div className="flex items-center gap-1 flex-shrink-0">
          {prefix && (
            <span className="text-sm font-semibold text-gray-400">{prefix}</span>
          )}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(clamp(Number(e.target.value)))}
            className="w-24 text-right border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-bold text-navy focus:outline-none focus:border-primary bg-white"
          />
        </div>
      </div>

      {/* Track + thumb */}
      <div className="relative h-8 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Visual thumb */}
        <div
          className="absolute w-5 h-5 rounded-full bg-primary shadow-md pointer-events-none transition-all duration-75 border-2 border-white"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
        {/* Invisible interactive input on top */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="calc-range absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 10 }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>
          {prefix}
          {min.toLocaleString()}
        </span>
        <span>
          {prefix}
          {max.toLocaleString()}
        </span>
      </div>

      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Progress Steps ──────────────────────────────────────────────────────────

function ProgressSteps({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1 as const, label: "Calculate" },
    { n: 2 as const, label: "Unlock Report" },
    { n: 3 as const, label: "Your Results" },
  ];
  return (
    <div className="flex items-center justify-center gap-1 mt-8 print:hidden">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-1">
          <div
            className={`flex items-center gap-2 transition-opacity ${step >= s.n ? "opacity-100" : "opacity-40"}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s.n ? "bg-primary text-navy" : "bg-white/20 text-white"}`}
            >
              {step > s.n ? "✓" : s.n}
            </div>
            <span className="text-sm text-white/80 hidden sm:block">{s.label}</span>
          </div>
          {i < 2 && (
            <div
              className={`h-px w-6 sm:w-12 mx-1 transition-colors ${step > s.n ? "bg-primary" : "bg-white/20"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function HrCostCalculatorContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormValues>(DEFAULTS);
  const [lead, setLead] = useState<LeadValues>({ name: "", email: "", company: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => runCalc(form), [form]);

  const set = (key: keyof FormValues) => (value: number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Benchmark: typical PH company HR/payroll overhead per employee per year
  const benchmark = Math.round(form.employees * 9800);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const [firstName, ...rest] = lead.name.trim().split(" ");
    const lastName = rest.join(" ");

    const fmtNum = (n: number) =>
      new Intl.NumberFormat("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(n));

    try {
      await fetch("/api/loops/calculator/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: lead.email.trim(),
          firstName,
          lastName,
          companyName: lead.company.trim(),
          numberOfEmployees: form.employees,
          source: "hr-cost-calculator",
          subscribed: true,
          calcTotalAnnualWaste: Math.round(results.totalWaste),
          calcYahshuaSavings: Math.round(results.yahshuaSavings),
          calcMonthsToROI: results.monthsToROI,
        }),
      });

      await fetch("/api/loops/calculator/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: lead.email.trim(),
          eventName: "lm01_calculator_completed",
          eventProperties: {
            totalAnnualWaste: Math.round(results.totalWaste),
            yahshuaSavings: Math.round(results.yahshuaSavings),
            monthsToROI: results.monthsToROI,
            employees: form.employees,
          },
        }),
      });

      fetch("/api/loops/calculator/transactional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: lead.email.trim(),
          firstName,
          companyName: lead.company.trim(),
          calcTotalAnnualWaste: fmtNum(results.totalWaste),
          calcYahshuaSavings: fmtNum(results.yahshuaSavings),
          calcMonthsToRoi: results.monthsToROI,
        }),
      }).catch(() => {});

      setStep(3);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-navy py-14 md:py-20 print:hidden">
        <div className="lp-section-container text-center">
          <span className="lp-section-label justify-center mb-4">Free Tool</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            HR &amp; Payroll Cost Calculator
          </h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto">
            Find out exactly how much manual HR and payroll is costing your business
            every year, then see how much you&apos;d save with YAHSHUA.
          </p>
          <ProgressSteps step={step} />
        </div>
      </section>

      {/* Print header — only appears when printing */}
      <div className="calc-print-only hidden mb-8 px-8 pt-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">YAHSHUA HRIS Cost Report</h1>
            <p className="text-gray-600 text-sm mt-1">
              {lead.company || "Your Company"} &middot; {form.employees} employees &middot;{" "}
              {new Date().toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <p className="text-xs text-gray-400">yahshuahris.com/hr-cost-calculator</p>
        </div>
        <hr className="mt-4 border-gray-200" />
      </div>

      {/* ── Step 1: Calculator ────────────────────────────────────────── */}
      {step === 1 && (
        <section className="lp-section-container py-12 md:py-16 print:hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-16 items-start">
            {/* Form fields */}
            <div>
              <p className="text-sm text-gray-400 mb-8">
                Move the sliders to match your situation. The panel on the right updates live.
              </p>

              <SliderField
                label="How many employees does your business have?"
                value={form.employees}
                min={10}
                max={500}
                onChange={set("employees")}
              />

              <SliderField
                label="How many staff handle HR and payroll?"
                value={form.hrStaff}
                min={1}
                max={20}
                onChange={set("hrStaff")}
              />

              <SliderField
                label="Average monthly salary of those HR/payroll staff"
                value={form.avgMonthlySalary}
                min={15000}
                max={80000}
                step={1000}
                prefix="₱"
                onChange={set("avgMonthlySalary")}
              />

              <SliderField
                label="Hours per person per week spent processing payroll manually"
                hint="Per HR/payroll staff member"
                value={form.payrollHoursPerWeek}
                min={1}
                max={40}
                onChange={set("payrollHoursPerWeek")}
              />

              <SliderField
                label="Hours per person per week on government compliance reports"
                hint="BIR, SSS, PhilHealth, Pag-IBIG, DOLE — per HR/payroll staff member"
                value={form.complianceHoursPerWeek}
                min={1}
                max={20}
                onChange={set("complianceHoursPerWeek")}
              />

              <SliderField
                label="Payroll errors or corrections per month"
                value={form.errorsPerMonth}
                min={0}
                max={20}
                onChange={set("errorsPerMonth")}
              />

              {/* Tool count dropdown */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many separate tools does your team use for HR and payroll?{" "}
                  <span className="text-gray-400 font-normal">
                    (Excel, biometrics, separate HRIS, etc.)
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={form.toolCount}
                    onChange={(e) => set("toolCount")(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-navy bg-white focus:outline-none focus:border-primary appearance-none cursor-pointer pr-10"
                  >
                    <option value={1}>1 tool</option>
                    <option value={2}>2 tools</option>
                    <option value={3}>3 tools</option>
                    <option value={4}>4 or more tools</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="lp-btn-primary lp-btn-glow w-full sm:w-auto text-base px-10 py-4"
              >
                Calculate My Report
              </button>
            </div>

            {/* Live total panel */}
            <div className="lg:sticky lg:top-24">
              <div
                className="rounded-2xl p-6 text-white"
                style={{ background: "hsl(var(--lp-surface))" }}
              >
                <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">
                  Estimated Annual Waste
                </p>
                <p className="text-4xl font-bold text-primary leading-tight mb-6">
                  {fmt(results.totalWaste)}
                </p>

                <div className="space-y-3">
                  {[
                    { label: "Payroll processing time", value: results.payrollTimeCost },
                    { label: "Compliance admin time", value: results.complianceTimeCost },
                    { label: "Error corrections", value: results.errorCost },
                    { label: "Redundant tools", value: results.toolRedundancyCost },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-white/60">{item.label}</span>
                      <span className="font-semibold tabular-nums">{fmt(item.value)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 mt-5 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">YAHSHUA saves you</span>
                    <span className="font-bold text-green-400 tabular-nums">
                      {fmt(results.yahshuaSavings)}/yr
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="mt-5 w-full bg-primary text-navy font-bold py-3 rounded-xl text-sm transition-all hover:brightness-110 active:scale-[0.97]"
                >
                  Unlock Full Report
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Step 2: Lead Capture ──────────────────────────────────────── */}
      {step === 2 && (
        <section className="lp-section-container py-16 print:hidden">
          <div className="max-w-md mx-auto">
            <div className="lp-light-card p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-navy">Your report is ready</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Enter your details to unlock the full breakdown and savings estimate.
                </p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={lead.name}
                    onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Juan dela Cruz"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-primary bg-white placeholder:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work email
                  </label>
                  <input
                    type="email"
                    value={lead.email}
                    onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                    placeholder="juan@company.com"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-primary bg-white placeholder:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company name
                  </label>
                  <input
                    type="text"
                    value={lead.company}
                    onChange={(e) => setLead((p) => ({ ...p, company: e.target.value }))}
                    placeholder="Acme Corporation"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-primary bg-white placeholder:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of employees
                  </label>
                  <input
                    type="number"
                    value={form.employees}
                    readOnly
                    className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                  />
                </div>

                {submitError && (
                  <p className="text-red-500 text-sm">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="lp-btn-primary lp-btn-glow w-full py-4 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Loading..." : "Unlock My Report"}
                </button>

                <p className="text-center text-xs text-gray-400 mt-2">
                  No spam. Just your results. We&apos;ll also send you a PDF copy.
                </p>
              </form>
            </div>

            <button
              onClick={() => setStep(1)}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600 mx-auto block transition-colors"
            >
              Back to calculator
            </button>
          </div>
        </section>
      )}

      {/* ── Step 3: Results ───────────────────────────────────────────── */}
      {step === 3 && (
        <section className="lp-section-container py-12 md:py-16" ref={resultsRef}>
          <div className="max-w-3xl mx-auto">
            {/* Total waste card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Your Estimated Annual Waste
              </p>
              <p className="text-5xl md:text-6xl font-bold text-primary mb-1 tabular-nums">
                {fmt(results.totalWaste)}
              </p>
              <p className="text-gray-400 text-sm">
                per year lost to manual HR and payroll operations
              </p>

              <div className="mt-8">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  Where the money goes
                </h3>
                <div className="space-y-0">
                  {[
                    { label: "Payroll processing time", value: results.payrollTimeCost },
                    {
                      label: "Compliance admin time (BIR, SSS, PhilHealth, Pag-IBIG, DOLE)",
                      value: results.complianceTimeCost,
                    },
                    { label: "Error corrections", value: results.errorCost },
                    { label: "Redundant tool overhead", value: results.toolRedundancyCost },
                  ].map((item, i, arr) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between py-4 ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}
                    >
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-bold text-navy tabular-nums">
                        {fmt(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* YAHSHUA savings card */}
            <div
              className="rounded-2xl p-8 mb-5 print:border print:border-gray-200 print:bg-white"
              style={{ background: "hsl(var(--lp-surface))" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2 print:text-gray-500">
                    Annual savings with YAHSHUA
                  </p>
                  <p className="text-4xl font-bold text-primary tabular-nums print:text-green-700">
                    {fmt(results.yahshuaSavings)}
                  </p>
                  <p className="text-white/50 text-sm mt-2 print:text-gray-500">
                    That&apos;s 70% of your current waste recovered.
                  </p>
                </div>
                <div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2 print:text-gray-500">
                    Months until YAHSHUA pays for itself
                  </p>
                  <p className="text-4xl font-bold text-white tabular-nums print:text-black">
                    {results.monthsToROI}
                  </p>
                  <p className="text-white/50 text-sm mt-2 print:text-gray-500">
                    Based on {fmt(results.yahshuaMonthly)}/mo plan for {form.employees}{" "}
                    employees.
                  </p>
                </div>
              </div>
            </div>

            {/* Benchmark */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8 text-sm text-amber-900 leading-relaxed">
              Based on your inputs, a company with {form.employees} employees like yours is
              estimated to spend {fmt(benchmark)} per year on HR and payroll operations.
              YAHSHUA customers at your size typically recover 70% of that.
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn-primary lp-btn-glow flex-1 text-center py-4 text-base"
              >
                Book a Free Demo
              </a>
              <button
                onClick={() => window.print()}
                className="lp-btn-ghost-dark flex-1 py-4 text-base"
              >
                Download PDF Report
              </button>
            </div>

            {/* Recalculate link */}
            <div className="text-center mt-8 print:hidden">
              <button
                onClick={() => {
                  setStep(1);
                  setLead({ name: "", email: "", company: "" });
                }}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Start over with different numbers
              </button>
            </div>

            {/* Print footer */}
            <div className="calc-print-only hidden mt-12 pt-6 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
              <span>Generated by YAHSHUA HRIS &middot; yahshuahris.com</span>
              <span>This is an estimate. Actual results may vary.</span>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
