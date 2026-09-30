import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import ThirteenthMonthCalculator from "./ThirteenthMonthCalculator";

// Single source for the visible FAQ and the FAQPage schema in page.tsx
export const thirteenthMonthFaqs = [
  {
    q: "How do you compute 13th month pay in the Philippines?",
    a: "Add up the total basic salary the employee actually earned from January 1 to December 31, then divide by 12. For an employee on the same ₱20,000 monthly basic salary all year with no unpaid absences, 13th month pay is ₱240,000 ÷ 12 = ₱20,000. Overtime, allowances, night differential, holiday pay, and COLA are left out unless the employer treats them as part of basic salary.",
  },
  {
    q: "When is the deadline for 13th month pay?",
    a: "13th month pay must be paid no later than December 24. Employers may pay half before the opening of the regular school year and the other half on or before December 24, as long as the full amount is paid by the deadline.",
  },
  {
    q: "Who is entitled to 13th month pay?",
    a: "All rank-and-file employees in the private sector who worked at least one month during the calendar year, regardless of position, employment status (regular, probationary, contractual, project-based), or how their wages are paid. Kasambahay are entitled under the Batas Kasambahay (RA 10361). Managerial employees are not covered by the law, though many employers extend it as policy.",
  },
  {
    q: "Is 13th month pay taxable?",
    a: "Up to ₱90,000 a year is tax-exempt under the TRAIN Law (NIRC Section 32(B)(7)(e), RR No. 11-2018). The ₱90,000 is shared with other bonuses and benefits such as a mid-year or productivity bonus. Only the combined amount above ₱90,000 is taxable.",
  },
  {
    q: "Does 13th month pay include overtime, allowances, or holiday pay?",
    a: "No. Under the Revised Guidelines on 13th month pay, basic salary excludes allowances not integrated into basic pay, the cash equivalent of unused vacation and sick leave, overtime, premium pay, night differential, holiday pay, and COLA. They are included only if an individual or collective agreement, company practice, or policy treats them as part of basic salary.",
  },
  {
    q: "What happens to 13th month pay when an employee resigns?",
    a: "An employee who resigns or is separated for any reason, including dismissal for just cause, is entitled to a proportionate 13th month pay for the basic salary earned that year. It is part of final pay, which DOLE Labor Advisory No. 06-20 says should be released within 30 days of separation.",
  },
  {
    q: "Does a mid-year salary increase change 13th month pay?",
    a: "Yes. 13th month pay is based on the basic salary actually earned each month, so the old rate applies to the months before the increase and the new rate after. For example, Metro Manila minimum wage earners were paid ₱695 per day until September 25, 2026 and ₱755 from September 26 under Wage Order NCR-28, so their 2026 13th month pay uses both rates.",
  },
  {
    q: "Do employers need to file a 13th month pay report with DOLE?",
    a: "Yes. Covered employers submit a 13th Month Pay Compliance Report through reports.dole.gov.ph by January 15 of the following year. The deadline for 2025 payments was January 15, 2026.",
  },
];

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const mistake = { marginBottom: "1rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" } as const;
const example = { background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "1.25rem" } as const;

const ThirteenthMonthPayComputationArticle = () => {
  return (
    <div style={{ background: "#ffffff" }}>
      <main className="min-h-screen pt-16">

        {/* Hero */}
        <section className="pt-20 pb-12 relative overflow-hidden lp-dot-grid-light lp-hero-glow" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }} />
          <div className="lp-section-container relative z-10 max-w-3xl mx-auto">
            <ScrollFadeIn>
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-6"
                style={{ background: "rgba(255,193,7,0.1)", color: "hsl(38, 92%, 38%)" }}>
                Payroll Compliance
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-6" style={{ lineHeight: "1.25" }}>
                13th Month Pay Computation 2026: The Formula, the Common Mistakes, and a Free Calculator
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                How to compute 13th month pay for monthly-paid, daily-paid, new, and resigned employees, including this year&apos;s mid-year wage order increases, with a calculator you can use right now.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>September 2026</span>
                <span>·</span>
                <span>9 min read</span>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Featured Image */}
        <div className="lp-section-container max-w-3xl mx-auto pt-10 pb-0">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "360px" }}>
            <Image
              src="/blog/start-tracking-13th-month.png"
              alt="13th month pay computation 2026 Philippines"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Article Body */}
        <article className="py-16">
          <div className="lp-section-container max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none" style={{ color: "#374151", lineHeight: "1.8" }}>

              {/* Direct-answer opener */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "1.5rem", fontWeight: 500 }}>
                13th month pay in the Philippines is one-twelfth of the total basic salary an employee actually earned from January 1 to December 31. Every rank-and-file private-sector employee who worked at least one month in the year is entitled to it, and it must be paid by December 24 under Presidential Decree No. 851.
              </p>

              {/* Formula */}
              <div style={{ background: "#f9fafb", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2rem", fontFamily: "monospace", fontSize: "0.95rem", color: "#111827" }}>
                13th Month Pay = Total Basic Salary Earned in the Calendar Year ÷ 12
              </div>

              <ThirteenthMonthCalculator />

              {/* H2: What counts as basic salary */}
              <h2 style={h2}>What Counts as Basic Salary</h2>
              <p style={{ marginBottom: "1rem" }}>
                Basic salary means all remuneration paid for services rendered, minus benefits that are not part of the regular or basic salary. Under the DOLE Revised Guidelines on 13th month pay, leave these out:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.4rem" }}>Overtime pay and premium pay for rest days and special days</li>
                <li style={{ marginBottom: "0.4rem" }}>Night differential</li>
                <li style={{ marginBottom: "0.4rem" }}>Holiday pay</li>
                <li style={{ marginBottom: "0.4rem" }}>Cost-of-living allowance (COLA) and other allowances not integrated into basic pay</li>
                <li style={{ marginBottom: "0.4rem" }}>The cash equivalent of unused vacation and sick leave</li>
                <li style={{ marginBottom: "0.4rem" }}>Profit-sharing payments and de minimis benefits</li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                The exception: if an employment contract, collective agreement, or established company practice treats any of these as part of basic salary, include them. Unpaid absences reduce the total, because 13th month pay is based on salary actually earned. See our <Link href="/blog/de-minimis-benefits-2026-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>de minimis benefits guide</Link> for which benefits stay outside the computation.
              </p>

              {/* H2: Worked examples */}
              <h2 style={h2}>Worked Examples</h2>

              <div style={example}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>Full year, same salary</p>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>₱20,000 monthly basic salary, January to December, no unpaid absences: ₱240,000 ÷ 12 = <strong>₱20,000</strong>.</p>
              </div>

              <div style={example}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>Unpaid absences</p>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>Same ₱20,000 salary, but 10 unpaid leave days at a ₱909 daily rate (₱9,091 deducted): (₱240,000 − ₱9,091) ÷ 12 = <strong>₱19,242</strong>.</p>
              </div>

              <div style={example}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>New hire in April</p>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>Started April 1 at ₱25,000 a month: 9 months × ₱25,000 = ₱225,000 ÷ 12 = <strong>₱18,750</strong>.</p>
              </div>

              <div style={example}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>Resigned in August</p>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>Last day August 31 at ₱30,000 a month: 8 months × ₱30,000 = ₱240,000 ÷ 12 = <strong>₱20,000</strong>, paid with final pay rather than in December.</p>
              </div>

              <div style={{ ...example, marginBottom: "2.5rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>Daily-paid worker with a mid-year wage increase (Metro Manila)</p>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>An NCR non-agriculture minimum wage earner working 26 days a month, paid ₱695/day until September 25, 2026 and ₱755/day from September 26 under Wage Order NCR-28:</p>
                <ul style={{ margin: "0 0 0.5rem 0", paddingLeft: "1.25rem", fontSize: "0.9rem" }}>
                  <li>January to August: 8 × 26 days × ₱695 = ₱144,560</li>
                  <li>September: 22 days × ₱695 + 4 days × ₱755 = ₱18,310</li>
                  <li>October to December: 3 × 26 days × ₱755 = ₱58,890</li>
                </ul>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>Total basic salary ₱221,760 ÷ 12 = <strong>₱18,480</strong>. Use actual days worked in real payroll; this example assumes a fixed 26 days for clarity. The <Link href="/blog/ncr-minimum-wage-2026" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>NCR minimum wage guide</Link> explains the NCR-28 change, and the <Link href="/blog/minimum-wage-philippines-2026-by-region" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>regional wage guide</Link> lists 2026 increases in other regions.</p>
              </div>

              {/* H2: Who is entitled */}
              <h2 style={h2}>Who Is Entitled, and Who Is Not</h2>
              <p style={{ marginBottom: "1rem" }}>
                PD 851 covers all rank-and-file employees of private-sector employers who worked at least one month in the calendar year, regardless of position, designation, employment status, or method of wage payment. That includes probationary, contractual, project-based, and seasonal staff, and workers paid by piece rate or on a fixed wage plus commission. Kasambahay are entitled under RA 10361.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Not covered: managerial employees, government employees, employers already paying a 13th month pay or its equivalent, and employees paid purely on commission, boundary, or task basis.
              </p>

              {/* H2: Mistakes */}
              <h2 style={h2}>Common 13th Month Pay Computation Mistakes</h2>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Mistake 1: Including non-basic pay.</strong> Overtime, COLA, night differential, holiday pay, and leave conversions are not basic salary unless company policy or an agreement makes them so. Including them overstates the amount; leaving out items your policy treats as basic understates it.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Mistake 2: Skipping proration for new hires and separated employees.</strong> An employee who worked three months is owed 3/12 of the basic salary earned, and a separated employee&apos;s share belongs in final pay regardless of why they left.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Mistake 3: Applying one rate to the whole year.</strong> Raises and wage order increases change the monthly basic salary. Use each month&apos;s actual rate. In 2026 this affects every region that raised its minimum wage mid-year.
              </p>
              <p style={{ ...mistake, marginBottom: "2.5rem" }}>
                <strong style={{ color: "#111827" }}>Mistake 4: Forgetting the DOLE compliance report.</strong> After paying, employers submit a 13th Month Pay Compliance Report at reports.dole.gov.ph by January 15 of the following year. Missing it is a separate gap from the payment itself.
              </p>

              {/* H2: Tax */}
              <h2 style={h2}>Is 13th Month Pay Taxable?</h2>
              <p style={{ marginBottom: "1rem" }}>
                Up to ₱90,000 a year of 13th month pay and other benefits is tax-exempt under the TRAIN Law. The ₱90,000 is one shared pool: a mid-year bonus, productivity bonus, or de minimis benefits above their own ceilings all count toward it.
              </p>
              <div style={{ ...example, marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>An employee receives ₱40,000 in 13th month pay and a ₱60,000 year-end bonus. Combined, ₱100,000: the first ₱90,000 is exempt and <strong>₱10,000</strong> is added to taxable compensation.</p>
              </div>

              {/* H2: Deadlines */}
              <h2 style={h2}>2026 Deadlines</h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>December 24, 2026:</strong> full 13th month pay released to current employees. If you pay in two halves, the first half goes out before the opening of the school year.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Within 30 days of separation:</strong> prorated 13th month pay for resigned or separated employees, as part of final pay (DOLE Labor Advisory No. 06-20). See our <Link href="/blog/final-pay-computation-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>final pay guide</Link>.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>January 15, 2027:</strong> 13th Month Pay Compliance Report due at reports.dole.gov.ph, following the pattern of January 15, 2026 for 2025 payments.</li>
              </ul>

              {/* H2: Cash flow */}
              <h2 style={h2}>Cash Flow: What the Numbers Look Like</h2>
              <p style={{ marginBottom: "2.5rem" }}>
                For 30 rank-and-file employees averaging ₱20,000 in monthly basic salary, the 13th month obligation is ₱600,000, all due by December 24. For 50 employees it is ₱1,000,000. The liability builds every payroll cycle from January 1 whether or not anyone is tracking it, which is why employers who accrue it monthly are not scrambling in November.
              </p>

              {/* CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS tracks 13th month pay automatically, every payroll run, all year.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Every cutoff, the system accrues what is owed. See your total 13th month liability anytime and walk into November with a number you already know.
                </p>
                <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See how YAHSHUA handles 13th month pay <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
              {thirteenthMonthFaqs.map((f, i) => (
                <div key={f.q} style={{ marginBottom: i === thirteenthMonthFaqs.length - 1 ? "3rem" : "2rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published September 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Based on Presidential Decree No. 851 and its implementing rules, the DOLE Revised Guidelines on the Implementation of the 13th Month Pay Law, Memorandum Order No. 28, RA 10361, DOLE Labor Advisory No. 06-20, NIRC Section 32(B)(7)(e) as amended by the TRAIN Law, and RR No. 11-2018. Verified September 25, 2026. DOLE usually issues a 13th month pay advisory late in the year, so check dole.gov.ph for 2026 guidance. This article does not constitute legal or tax advice.
                </p>
              </div>

            </div>
          </div>
        </article>

        {/* Related reading */}
        <section className="pb-16">
          <div className="lp-section-container max-w-3xl mx-auto">
            <div className="rounded-xl p-6" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Related Reading</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog/final-pay-computation-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Final Pay Computation for Resigned Employees →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/de-minimis-benefits-2026-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    De Minimis Benefits 2026: New BIR Ceilings →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/minimum-wage-philippines-2026-by-region" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Minimum Wage in the Philippines 2026 by Region →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* End CTA */}
        <section className="py-16" style={{ background: "#FFFBF0", borderTop: "1px solid rgba(255,193,7,0.2)" }}>
          <div className="lp-section-container max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "hsl(38, 92%, 38%)" }}>YAHSHUA HRIS</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ lineHeight: "1.3" }}>
              Start tracking 13th month pay now, or pay for it in November.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Built for Philippine businesses. Every cutoff, YAHSHUA HRIS accrues the 13th month pay owed, so your total liability is visible anytime, not just in November.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=13th_month_pay_2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white transition-all hover:gap-3"
              style={{ background: "hsl(38, 92%, 45%)" }}
            >
              Book a free demo <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Back to blog */}
        <section className="py-12" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="lp-section-container max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ThirteenthMonthPayComputationArticle;
