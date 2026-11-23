"use client";

import { useState } from "react";

import { Check, ChevronDown } from "lucide-react";

import { useRouter } from "next/navigation";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import { YAHSHUA_PRICING, PRICING_LABELS, calculateMonthly, calculateVAT, calculateWithVAT } from "@/lib/yahshuaPricing";
import { trackEvent } from "@/lib/analytics";

interface LpPricingContentProps {
  isLoggedIn: boolean;
}

const BASE_PRICE = YAHSHUA_PRICING.basePrice;
const EXCESS_RATE = YAHSHUA_PRICING.excessRatePerEmployee;
const EMPLOYEE_CAP = YAHSHUA_PRICING.employeeCap;

const formatPHP = (price: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

const faqs = [
  { q: "Is there really no credit card required for the free plan?", a: "Correct. The Freemium plan is free forever with no payment information needed. You can post jobs and screen applicants without spending anything." },
  { q: `What happens when I go over ${EMPLOYEE_CAP} employees?`, a: `An additional ${PRICING_LABELS.excess} per employee per month is added on top of the ${PRICING_LABELS.base} base rate. The calculator above shows your exact monthly cost as you type.` },
  { q: "Is there a setup fee?", a: "No. There is no setup fee. Implementation, data migration, and onboarding training are included at no extra charge. You pay the monthly subscription only, and VAT is added on your invoice." },
  { q: "Can I upgrade from Freemium to the full plan anytime?", a: "Yes. You can upgrade at any time from within your account. All your existing data carries over instantly." },
  { q: "Is VAT included in the pricing shown?", a: "No. All prices shown are VAT excluded. The applicable VAT will be reflected in your invoice." },
  { q: "Does YAHSHUA HRIS come with YAHSHUA One Payroll?", a: "Yes. Every YAHSHUA HRIS plan comes with YAHSHUA One Payroll at no extra charge. It computes BIR withholding tax, SSS, PhilHealth, and Pag-IBIG contributions and generates payslips, all included in your subscription." },
  { q: "Is YAHSHUA HRIS a good fit for a company with fewer than 50 employees?", a: "It can be, if you want hiring, DOLE reports, performance evaluation, and payroll in one plan. The price is a flat PHP 7,000 a month (VAT excluded) for up to 100 employees, with no setup fee, and implementation, data migration, and onboarding training are free. That flat rate means a very small team can pay more per employee than under per-employee pricing. As of September 2026, GreatDay HR lists PHP 77 per employee with a 50-license minimum, about PHP 3,850 a month, which costs less below roughly 91 employees. You can try YAHSHUA HRIS first: the free plan covers job posting and applicant screening, and the 30-day trial covers all HRIS modules." },
  { q: "Can I see the full platform before subscribing?", a: "Yes. Sign up for the 30-day free trial of YAHSHUA HRIS, or book a free demo and we will walk you through YAHSHUA HRIS and the built-in payroll tools in full. After the 30 days, your account reverts to the Freemium plan unless you upgrade." },
];

const LpPricingContent = ({ isLoggedIn }: LpPricingContentProps) => {
  const router = useRouter();
  const [employeeCount, setEmployeeCount] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const monthly = calculateMonthly(employeeCount);
  const isOverBase = employeeCount > EMPLOYEE_CAP;

  const handlePaidCTA = () => {
    trackEvent("checkout_start_click", { cta_location: "pricing_paid_plan", logged_in: Boolean(isLoggedIn), page_path: "/pricing" });
    if (isLoggedIn) {
      router.push(`/checkout/hris/`);
    } else {
      router.push(`/login?${new URLSearchParams({ redirect: "/checkout/hris/" })}`);
    }
  };

  return (
    <div style={{ background: "#ffffff" }}>
        <main className="min-h-screen pt-16">

          {/* Hero */}
          <section className="pt-24 pb-16 relative overflow-hidden lp-dot-grid-light lp-hero-glow" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }} />
            <div className="lp-section-container text-center relative z-10">
              <ScrollFadeIn>
                <span className="lp-section-label justify-center mb-3">PRICING</span>
                <p className="text-[11px] text-gray-400 text-center mb-5">Prices verified: November 2026</p>
                <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-bold text-gray-900 mb-5">
                  <span className="block mb-3">Straightforward pricing.</span>
                  <span className="text-primary">No surprises.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
                  One plan. Complete HR management. YAHSHUA One Payroll included. No long-term contracts. Cancel anytime.
                </p>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Plans */}
          <section className="py-20" style={{ background: "#FFFBF0" }}>
            <div className="lp-section-container">
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                {/* Freemium */}
                <ScrollFadeIn>
                  <article className="rounded-xl overflow-hidden h-full flex flex-col shadow-lg" style={{ border: "1px solid rgba(0,0,0,0.1)" }}>
                    <div className="px-8 py-6" style={{ background: "#f3f4f6" }}>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-2 invisible select-none">placeholder</p>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">Freemium</h2>
                      <p className="text-sm text-gray-500">Your simple hiring toolkit - always free</p>
                    </div>
                    <div className="px-8 py-6 flex flex-col flex-1 bg-white">
                      <div className="mb-6">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Introductory Price</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-gray-900">₱0</span>
                          <span className="text-gray-400">/month</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">No credit card required</p>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {["Post a Job in Multiple Platforms", "Screen Applicants in one place"].map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm">
                            <Check className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span className="text-gray-600">{f}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="rounded-lg p-4 mb-6 text-sm" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)" }}>
                        <p className="font-semibold text-gray-700 mb-2">Best for:</p>
                        <ul className="space-y-1 text-gray-500">
                          <li>Startups and Small Businesses</li>
                          <li>Exploring digital hiring solutions</li>
                          <li>Getting a feel for YAHSHUA HRIS</li>
                        </ul>
                      </div>

                      <div className="rounded-lg p-4 mb-6 text-sm" style={{ border: "1.5px dashed rgba(0,0,0,0.15)" }}>
                        <p className="font-semibold text-gray-700 mb-1">Ready to grow?</p>
                        <p className="text-gray-400">Upgrade anytime to unlock YAHSHUA HRIS and YAHSHUA One Payroll</p>
                      </div>

                      <div className="mt-auto">
                        <button
                          onClick={() => {
                            trackEvent("start_free_click", { cta_location: "pricing_free_plan", cta_text: "Start Free Plan", page_path: "/pricing" });
                            router.push("/register");
                          }}
                          className="w-full py-3 text-sm font-semibold text-gray-700 rounded-lg transition-opacity hover:opacity-80"
                          style={{ background: "#f3f4f6", border: "1px solid rgba(0,0,0,0.12)" }}
                        >
                          Start Free Plan
                        </button>
                      </div>
                    </div>
                  </article>
                </ScrollFadeIn>

                {/* Paid */}
                <ScrollFadeIn delay={120}>
                  <article className="rounded-xl border-2 border-primary overflow-hidden h-full flex flex-col shadow-lg shadow-primary/10">
                    <div className="bg-primary px-8 py-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70 mb-2">Recommended</p>
                      <h2 className="text-xl font-bold text-navy mb-1">YAHSHUA HRIS</h2>
                      <p className="text-sm text-navy/70">Comes with YAHSHUA One Payroll.</p>
                    </div>
                    <div className="px-8 py-6 flex flex-col flex-1 bg-white">

                      {/* Calculator */}
                      <div className="mb-6">
                        <label htmlFor="employee-count" className="block text-sm font-semibold text-gray-700 mb-2">
                          How many employees?
                        </label>
                        <input
                          id="employee-count"
                          type="number"
                          min="1"
                          value={employeeCount}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (!isNaN(v) && v >= 1) setEmployeeCount(v);
                            else if (e.target.value === "") setEmployeeCount(1);
                          }}
                          className="w-full px-4 py-3 text-center text-lg font-bold text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          style={{ background: "#ffffff", border: "2px solid rgba(0,0,0,0.1)" }}
                          aria-label="Number of employees"
                        />
                      </div>

                      {/* Monthly price */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-4xl font-bold text-gray-900">{formatPHP(monthly)}</span>
                          <span className="text-gray-400">/month</span>
                        </div>
                        <p className="text-xs text-gray-400">VAT excluded</p>
                      </div>

                      {/* Monthly breakdown with VAT */}
                      <div className="rounded-lg p-4 mb-4 text-xs space-y-1" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.08)" }}>
                        <p className="font-semibold text-gray-700 mb-2">Monthly breakdown</p>
                        <div className="flex justify-between text-gray-500">
                          <span>Base (up to {EMPLOYEE_CAP} employees)</span><span>{formatPHP(BASE_PRICE)}</span>
                        </div>
                        {isOverBase && (
                          <div className="flex justify-between text-gray-500">
                            <span>{employeeCount - EMPLOYEE_CAP} employees x ₱{EXCESS_RATE}</span>
                            <span>{formatPHP((employeeCount - EMPLOYEE_CAP) * EXCESS_RATE)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-600 pt-1" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                          <span>Subtotal (VAT excl.)</span><span>{formatPHP(monthly)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>VAT (12%)</span><span>{formatPHP(calculateVAT(monthly))}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-800 pt-1" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                          <span>Total with VAT</span><span>{formatPHP(calculateWithVAT(monthly))}</span>
                        </div>
                      </div>

                      {/* Setup fee */}
                      <div className="rounded-lg p-4 mb-6 text-sm" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.08)" }}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-700">Setup fee</p>
                          <p className="font-bold text-gray-900">None</p>
                        </div>
                        <p className="text-xs text-gray-400">Implementation, data migration, and onboarding training are included</p>
                      </div>

                      <div className="mb-6 space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 mb-3">HRIS</p>
                          <ul className="space-y-3">
                            {[
                              "Employee management and 201 files",
                              "Job posting and recruitment",
                              "DOLE compliance reports",
                              "Performance management",
                            ].map((f) => (
                              <li key={f} className="flex items-start gap-3 text-sm">
                                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                                <span className="text-gray-600">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 mb-3">YAHSHUA One Payroll, included</p>
                          <ul className="space-y-3">
                            {[
                              "Automated payroll processing",
                              "BIR withholding tax, SSS, PhilHealth, Pag-IBIG computation",
                              "Attendance and overtime tracking, with the Timekeeper mobile app",
                              "Payslip generation",
                            ].map((f) => (
                              <li key={f} className="flex items-start gap-3 text-sm">
                                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                                <span className="text-gray-600">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <button onClick={handlePaidCTA} className="w-full lp-btn-primary lp-btn-glow py-3 text-sm">
                          Get Started
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-3">
                          No long-term contract. Cancel anytime.
                        </p>
                      </div>
                    </div>
                  </article>
                </ScrollFadeIn>
              </div>
            </div>
          </section>

          {/* Pricing breakdown table */}
          <section className="py-20" style={{ background: "#ffffff" }}>
            <div className="lp-section-container">
              <ScrollFadeIn className="text-center mb-12">
                <span className="lp-section-label justify-center mb-5">PRICING</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Grows with your team, not against it.</h2>
                <p className="text-gray-500 text-base max-w-md mx-auto">
                  Flat rate for up to 100 employees. A simple per-head fee above that.
                </p>
              </ScrollFadeIn>

              <ScrollFadeIn delay={100}>
                <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  {[
                    { range: "Up to 100 employees", rate: "₱7,000", sub: "flat monthly rate" },
                    { range: "101+ employees", rate: "₱60", sub: "per employee/month added" },
                    { range: "Setup fee", rate: "₱0", sub: "no one-time charge" },
                  ].map((tier, i) => (
                    <div key={i} className="lp-light-card p-6 text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 mb-3">{tier.range}</p>
                      <p className="text-3xl font-bold text-primary mb-1">{tier.rate}</p>
                      <p className="text-xs text-gray-400">{tier.sub}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-400 mt-6">
                  All prices are VAT excluded.{" "}
                  <a href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026" target="_blank" rel="noopener noreferrer" className="text-gray-600 font-semibold hover:text-primary transition-colors">Book a call</a>{" "}
                  if you have questions.
                </p>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Fit */}
          <section className="py-20" style={{ background: "#FFFBF0" }}>
            <div className="lp-section-container">
              <ScrollFadeIn className="text-center mb-12">
                <span className="lp-section-label justify-center mb-5">FIT</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Is it the right fit for your team?</h2>
                <p className="text-gray-500 text-base max-w-md mx-auto">
                  A straight answer, so you can decide before you book a demo.
                </p>
              </ScrollFadeIn>
              <ScrollFadeIn delay={100}>
                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <div className="lp-light-card p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 mb-4">Built for</p>
                    <ul className="space-y-3">
                      {[
                        "Philippine businesses that want hiring, DOLE reports, performance evaluation, and payroll in one published price.",
                        "HR and finance teams moving off spreadsheets for 201 files, DOLE filings, and payroll.",
                        "Teams near or above 100 employees, where the flat rate costs less than GreatDay HR's listed per-employee price (September 2026).",
                      ].map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span className="text-gray-600">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lp-light-card p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 mb-4">Another tool may suit you better if</p>
                    <ul className="space-y-3">
                      {[
                        "You need a dedicated HRIS mobile app. YAHSHUA HRIS runs in the browser and is mobile responsive. Mobile clock-in comes with YAHSHUA One Payroll through the Timekeeper mobile app.",
                        "You need earned wage access built in. Sprout Solutions lists it through ReadyWage (September 2026). Employees can request a cash advance in YAHSHUA, which HR approves.",
                        "You have fewer than about 90 employees and want the lowest per-employee price. GreatDay HR lists PHP 77 per employee with a 50-license minimum (September 2026).",
                      ].map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mt-2" />
                          <span className="text-gray-600">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20" style={{ background: "#ffffff" }}>
            <div className="lp-section-container">
              <ScrollFadeIn className="text-center mb-12">
                <span className="lp-section-label justify-center mb-5">PRICING FAQS</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Common questions about pricing.</h2>
              </ScrollFadeIn>
              <ScrollFadeIn delay={100}>
                <div className="max-w-[640px] mx-auto divide-y" style={{ borderTop: "1px solid rgba(0,0,0,0.08)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {faqs.map((item, i) => {
                    const isOpen = openFaq === i;
                    return (
                      <div key={i} style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          className="w-full flex items-center justify-between py-5 text-left gap-4"
                          aria-expanded={isOpen}
                        >
                          <span className="text-sm font-semibold text-gray-800">{item.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            strokeWidth={1.5}
                          />
                        </button>
                        <div className="grid transition-all duration-200 ease-in-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                          <div className="overflow-hidden">
                            <p className="text-sm text-gray-500 leading-relaxed pr-8 pb-5">{item.a}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-24" style={{ background: "#ffffff" }}>
            <div className="lp-section-container text-center">
              <ScrollFadeIn>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Not sure which plan is right for you?</h2>
                <p className="text-gray-500 text-base mb-8 max-w-sm mx-auto">
                  Book a free demo and we will help you figure out exactly what your team needs.
                </p>
                <a href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026"
                  target="_blank" rel="noopener noreferrer"
                  className="lp-btn-primary lp-btn-glow px-9 py-4 text-base">
                  Book a Free Demo
                </a>
              </ScrollFadeIn>
            </div>
          </section>

        </main>
    </div>
  );
};

export default LpPricingContent;
