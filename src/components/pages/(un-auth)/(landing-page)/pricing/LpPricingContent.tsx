"use client";

import { useState } from "react";

import { Check, ChevronDown } from "lucide-react";

import { useRouter } from "next/navigation";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

interface LpPricingContentProps {
  isLoggedIn: boolean;
}

const calculatePrice = (employees: number) => {
  const basePrice = 4000;
  if (employees <= 100) return basePrice;
  let additionalPrice = 0;
  let remaining = employees - 100;
  if (remaining > 0) { const t1 = Math.min(remaining, 150); additionalPrice += t1 * 39; remaining -= t1; }
  if (remaining > 0) { const t2 = Math.min(remaining, 250); additionalPrice += t2 * 37; remaining -= t2; }
  if (remaining > 0) { additionalPrice += remaining * 35; }
  return basePrice + additionalPrice;
};

const withVAT = (price: number) => price + price * 0.12;

const formatPHP = (price: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

const faqs = [
  { q: "Is there really no credit card required for the free plan?", a: "Correct. The Freemium plan is free forever with no payment information needed. You can post jobs and screen applicants without spending anything." },
  { q: "What happens when I go over 100 employees?", a: "Your monthly cost increases based on tiered rates: ₱39 per employee for 101 to 250, ₱37 for 251 to 500, and ₱35 for 500 and above. The calculator above shows your exact cost." },
  { q: "Can I upgrade from Freemium to the full plan anytime?", a: "Yes. You can upgrade at any time from within your account. All your existing data carries over instantly." },
  { q: "Is VAT included in the pricing shown?", a: "For up to 100 employees, VAT is excluded. For over 100 employees, the calculator includes 12% VAT in the total shown." },
  { q: "Do you offer a trial of the full HRIS plan?", a: "Yes. Book a free demo and we will walk you through the full platform. You can also request a trial period during your demo call." },
];

const LpPricingContent = ({ isLoggedIn }: LpPricingContentProps) => {
  const router = useRouter();
  const [employeeCount, setEmployeeCount] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const base = calculatePrice(employeeCount);
  const total = employeeCount > 100 ? withVAT(base) : base;

  const handlePaidCTA = () => {
    const params = new URLSearchParams({ additional_employee_slot: String(Math.max(0, employeeCount - 100)) });
    if (isLoggedIn) {
      router.push(`/checkout/hris/?${params}`);
    } else {
      const redirect = new URLSearchParams({ redirect: `/checkout/hris/?${params}` });
      router.push(`/login?${redirect}`);
    }
  };

  return (
    <div style={{ background: '#ffffff' }}>
        <main className="min-h-screen pt-16">

          {/* Hero */}
          <section className="pt-24 pb-16 relative overflow-hidden lp-dot-grid-light lp-hero-glow" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }} />
            <div className="lp-section-container text-center relative z-10">
              <ScrollFadeIn>
                <span className="lp-section-label justify-center mb-5">PRICING</span>
                <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-bold text-gray-900 mb-5">
                  <span className="block mb-3">Straightforward pricing.</span>
                  <span className="text-primary">No surprises.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
                  Start free and upgrade when you need the full HR suite. No long-term contracts. Cancel anytime.
                </p>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Plans */}
          <section className="py-20">
            <div className="lp-section-container">
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                {/* Freemium */}
                <ScrollFadeIn>
                  <article className="rounded-xl overflow-hidden h-full flex flex-col shadow-lg" style={{ border: '2px solid #355FD0' }}>
                    <div className="px-8 py-6" style={{ background: '#355FD0' }}>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-2 invisible select-none">placeholder</p>
                      <h2 className="text-xl font-bold text-white mb-1">YAHSHUA HRIS Freemium</h2>
                      <p className="text-sm text-white/70">Your simple hiring toolkit - always free</p>
                    </div>
                    <div className="px-8 py-6 flex flex-col flex-1 bg-white">
                      <div className="mb-6">
                        <p className="text-xs font-semibold text-primary mb-1">Introductory Price</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-gray-900">₱0</span>
                          <span className="text-gray-400">/month</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">No credit card required</p>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {["Post a Job in Multiple Platforms", "Screen Applicants in one place"].map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span className="text-gray-600">{f}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="rounded-lg p-4 mb-6 text-sm" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                        <p className="font-semibold text-[#355FD0] mb-2">Best for:</p>
                        <ul className="space-y-1 text-gray-500">
                          <li>Startups and Small Businesses</li>
                          <li>Exploring digital hiring solutions</li>
                          <li>Getting a feel for YAHSHUA HRIS</li>
                        </ul>
                      </div>

                      <div className="rounded-lg p-4 mb-6 text-sm" style={{ border: '1.5px dashed #355FD0' }}>
                        <p className="font-semibold text-[#355FD0] mb-1">Ready to grow?</p>
                        <p className="text-gray-500">Upgrade anytime to unlock the complete HR suite</p>
                      </div>

                      <div className="mt-auto">
                        <button
                          onClick={() => router.push("/register")}
                          className="w-full py-3 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
                          style={{ background: 'linear-gradient(90deg, #355FD0 0%, #06b6d4 100%)' }}
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
                      <p className="text-sm text-navy/70">Complete HR management suite</p>
                    </div>
                    <div className="px-8 py-6 flex flex-col flex-1" style={{ background: 'hsl(var(--lp-surface))' }}>

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
                          className="w-full px-4 py-3 text-center text-lg font-bold text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          style={{ border: '2px solid rgba(0,0,0,0.1)' }}
                          aria-label="Number of employees"
                        />
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-4xl font-bold text-gray-900">{formatPHP(total)}</span>
                          <span className="text-gray-400">/month</span>
                        </div>
                        <p className="text-xs text-primary font-semibold">Introductory price</p>
                        {employeeCount <= 100 && <p className="text-xs text-gray-400 mt-0.5">VAT excluded</p>}
                        {employeeCount > 100 && <p className="text-xs text-gray-400 mt-0.5">12% VAT included</p>}
                      </div>

                      {/* Breakdown for 100+ */}
                      {employeeCount > 100 && (
                        <div className="rounded-lg p-4 mb-6 text-xs space-y-1" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
                          <p className="font-semibold text-gray-700 mb-2">Pricing breakdown</p>
                          <div className="flex justify-between text-gray-500">
                            <span>Base (up to 100 employees)</span><span>₱4,000</span>
                          </div>
                          {employeeCount > 100 && employeeCount <= 250 && (
                            <div className="flex justify-between text-gray-500">
                              <span>{employeeCount - 100} employees x ₱39</span>
                              <span>₱{((employeeCount - 100) * 39).toLocaleString()}</span>
                            </div>
                          )}
                          {employeeCount > 250 && (
                            <div className="flex justify-between text-gray-500">
                              <span>150 employees x ₱39</span><span>₱{(150 * 39).toLocaleString()}</span>
                            </div>
                          )}
                          {employeeCount > 250 && employeeCount <= 500 && (
                            <div className="flex justify-between text-gray-500">
                              <span>{employeeCount - 250} employees x ₱37</span>
                              <span>₱{((employeeCount - 250) * 37).toLocaleString()}</span>
                            </div>
                          )}
                          {employeeCount > 500 && (
                            <>
                              <div className="flex justify-between text-gray-500">
                                <span>250 employees x ₱37</span><span>₱{(250 * 37).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-gray-500">
                                <span>{employeeCount - 500} employees x ₱35</span>
                                <span>₱{((employeeCount - 500) * 35).toLocaleString()}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between text-gray-500">
                            <span>12% VAT</span><span>₱{(base * 0.12).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold text-gray-900 pt-1" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                            <span>Monthly total</span><span>{formatPHP(total)}</span>
                          </div>
                        </div>
                      )}

                      <ul className="space-y-3 mb-6">
                        {[
                          "Employee management and 201 files",
                          "Job posting and recruitment",
                          "Leave, attendance, and time tracking",
                          "DOLE compliance reports",
                          "Performance management",
                          "Payroll sync with YAHSHUA Payroll",
                        ].map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span className="text-gray-600">{f}</span>
                          </li>
                        ))}
                      </ul>

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

          {/* Per-employee pricing table */}
          <section className="py-20" style={{ background: 'hsl(var(--lp-surface))' }}>
            <div className="lp-section-container">
              <ScrollFadeIn className="text-center mb-12">
                <span className="lp-section-label justify-center mb-5">SCALING PRICING</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Grows with your team, not against it.</h2>
                <p className="text-gray-500 text-base max-w-md mx-auto">
                  The more employees you add, the lower the per-person rate. No per-seat spikes.
                </p>
              </ScrollFadeIn>

              <ScrollFadeIn delay={100}>
                <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  {[
                    { range: "Up to 100", rate: "₱4,000", sub: "flat monthly base" },
                    { range: "101 to 250", rate: "₱39", sub: "per employee/month" },
                    { range: "251 to 500", rate: "₱37", sub: "per employee/month" },
                  ].map((tier, i) => (
                    <div key={i} className="lp-dark-card p-6 text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 mb-3">{tier.range}</p>
                      <p className="text-3xl font-bold text-primary mb-1">{tier.rate}</p>
                      <p className="text-xs text-gray-400">{tier.sub}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-400 mt-6">
                  500+ employees: ₱35/employee per month.{" "}
                  <a href="#demo" className="text-gray-600 font-semibold hover:text-primary transition-colors">Talk to us</a>{" "}
                  for enterprise pricing.
                </p>
              </ScrollFadeIn>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20">
            <div className="lp-section-container">
              <ScrollFadeIn className="text-center mb-12">
                <span className="lp-section-label justify-center mb-5">PRICING FAQS</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Common questions about pricing.</h2>
              </ScrollFadeIn>
              <ScrollFadeIn delay={100}>
                <div className="max-w-[640px] mx-auto divide-y divide-black/10" style={{ borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  {faqs.map((item, i) => {
                    const isOpen = openFaq === i;
                    return (
                      <div key={i}>
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          className="w-full flex items-center justify-between py-5 text-left gap-4"
                          aria-expanded={isOpen}
                        >
                          <span className="text-sm font-semibold text-gray-700">{item.q}</span>
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
          <section className="py-24" style={{ background: 'hsl(var(--lp-surface))' }}>
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
