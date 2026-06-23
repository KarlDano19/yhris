"use client";

import { useState } from "react";

import { Check, ChevronDown } from "lucide-react";

import { useRouter } from "next/navigation";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

interface LpPricingContentProps {
  isLoggedIn: boolean;
}

const BASE_PRICE = 7000;

const formatPHP = (price: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

const faqs = [
  { q: "Is there really no credit card required for the free plan?", a: "Correct. The Freemium plan is free forever with no payment information needed. You can post jobs and screen applicants without spending anything." },
  { q: "What happens when I go over 100 employees?", a: "For teams above 100 employees, we put together a custom quote based on your exact headcount. Book a call and we will get you a number quickly." },
  { q: "Can I upgrade from Freemium to the full plan anytime?", a: "Yes. You can upgrade at any time from within your account. All your existing data carries over instantly." },
  { q: "Is VAT included in the pricing shown?", a: "For up to 100 employees, VAT is excluded. For over 100 employees, the calculator includes 12% VAT in the total shown." },
  { q: "Does YAHSHUA HRIS include payroll?", a: "Yes. Payroll is built into every YAHSHUA HRIS plan at no extra charge. Automated calculations, BIR, SSS, PhilHealth, and Pag-IBIG filing, payslip generation, and bank disbursement are all included in your subscription." },
  { q: "Can I see the full platform before subscribing?", a: "Yes. Book a free demo and we will walk you through YAHSHUA HRIS and the built-in payroll tools in full. You can also request a trial period during your demo call." },
];

const LpPricingContent = ({ isLoggedIn }: LpPricingContentProps) => {
  const router = useRouter();
  const [employeeCount, setEmployeeCount] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isOverBase = employeeCount > 100;

  const handlePaidCTA = () => {
    if (isOverBase) {
      window.open("https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026", "_blank");
      return;
    }
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
                <p className="text-[11px] text-gray-400 text-center mb-5">Prices verified: June 2026</p>
                <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-bold text-gray-900 mb-5">
                  <span className="block mb-3">Straightforward pricing.</span>
                  <span className="text-primary">No surprises.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
                  One plan. Complete HR management with payroll built in. No long-term contracts. Cancel anytime.
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
                        <p className="text-gray-400">Upgrade anytime to unlock the complete HR suite</p>
                      </div>

                      <div className="mt-auto">
                        <button
                          onClick={() => router.push("/register")}
                          className="w-full py-3 text-sm font-semibold text-gray-700 rounded-lg transition-opacity hover:opacity-80"
                          style={{ background: "#f3f4f6", border: "1px solid rgba(0,0,0,0.12)" }}
                        >
                          Start Free Plan
                        </button>
                      </div>
                    </div>
                  </article>
                </ScrollFadeIn>

                {/* Paid HRIS */}
                <ScrollFadeIn delay={120}>
                  <article className="rounded-xl border-2 border-primary overflow-hidden h-full flex flex-col shadow-lg shadow-primary/10">
                    <div className="bg-primary px-8 py-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70 mb-2">Recommended</p>
                      <h2 className="text-xl font-bold text-navy mb-1">YAHSHUA HRIS</h2>
                      <p className="text-sm text-navy/70">Now with payroll built in.</p>
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

                      {!isOverBase ? (
                        <div className="mb-6">
                          <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-4xl font-bold text-gray-900">{formatPHP(BASE_PRICE)}</span>
                            <span className="text-gray-400">/month</span>
                          </div>
                          <p className="text-xs text-primary font-semibold">Up to 100 employees</p>
                          <p className="text-xs text-gray-400 mt-0.5">VAT excluded</p>
                        </div>
                      ) : (
                        <div className="rounded-lg p-5 mb-6 text-center" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.08)" }}>
                          <p className="text-sm font-semibold text-gray-800 mb-1">100+ employees?</p>
                          <p className="text-xs text-gray-500">We will put together a custom quote for your team size.</p>
                        </div>
                      )}

                      <div className="mb-6 space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 mb-3">HRIS</p>
                          <ul className="space-y-3">
                            {[
                              "Employee management and 201 files",
                              "Job posting and recruitment",
                              "Leave, attendance, and time tracking",
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
                          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 mb-3">Payroll — built in</p>
                          <ul className="space-y-3">
                            {[
                              "Automated payroll processing",
                              "BIR, SSS, PhilHealth, Pag-IBIG filing",
                              "One-click bank disbursement",
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
                          {isOverBase ? "Get a Custom Quote" : "Get Started"}
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

          {/* Per-employee pricing table */}
          <section className="py-20" style={{ background: "#ffffff" }}>
            <div className="lp-section-container">
              <ScrollFadeIn className="text-center mb-12">
                <span className="lp-section-label justify-center mb-5">PRICING</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Simple, flat pricing.</h2>
                <p className="text-gray-500 text-base max-w-md mx-auto">
                  One price for up to 100 employees. Bigger team? We will work out a custom rate.
                </p>
              </ScrollFadeIn>

              <ScrollFadeIn delay={100}>
                <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
                  {[
                    { range: "Up to 100 employees", rate: "₱7,000", sub: "flat monthly rate" },
                    { range: "100+ employees", rate: "Custom", sub: "contact us for a quote" },
                  ].map((tier, i) => (
                    <div key={i} className="lp-light-card p-6 text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 mb-3">{tier.range}</p>
                      <p className="text-3xl font-bold text-primary mb-1">{tier.rate}</p>
                      <p className="text-xs text-gray-400">{tier.sub}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-400 mt-6">
                  <a href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026" target="_blank" rel="noopener noreferrer" className="text-gray-600 font-semibold hover:text-primary transition-colors">Book a call</a>{" "}
                  and we will put together a quote for your team.
                </p>
              </ScrollFadeIn>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20" style={{ background: "#FFFBF0" }}>
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
