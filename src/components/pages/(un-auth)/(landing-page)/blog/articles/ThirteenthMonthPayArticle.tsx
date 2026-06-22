import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const ThirteenthMonthPayArticle = () => {
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
                Start Tracking 13th Month Pay Now — Or Pay For It in November
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Philippine employers are legally required to pay 13th month pay by December 24 each year. Most businesses compute it in November. The ones that don&apos;t scramble are the ones that track it every payroll run.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>June 2026</span>
                <span>·</span>
                <span>6 min read</span>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

          {/* Featured Image */}
          <div className="lp-section-container max-w-3xl mx-auto pt-10 pb-0">
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "360px" }}>
              <Image
                src="/blog/start-tracking-13th-month.png"
                alt="Start Tracking 13th Month Pay Now"
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

              {/* Definition block — AEO: self-contained answer */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>What is 13th month pay?</strong> 13th month pay is a mandatory cash benefit under Presidential Decree No. 851, requiring Philippine employers to pay all rank-and-file employees an amount equivalent to one-twelfth (1/12) of their total basic salary earned during the calendar year. It must be paid no later than December 24.
                </p>
              </div>

              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2rem" }}>
                13th month pay is governed by Presidential Decree No. 851, signed on December 16, 1975, and remains one of the most actively enforced labor benefits in the Philippines. Under Section 9 of the PD 851 Implementing Rules, non-payment is treated as a money claims case and processed under the Rules of the National Labor Relations Commission — meaning employees can file against an employer with no upper limit on the amount recoverable.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Employers are also required to submit a compliance report on 13th month pay distribution to their DOLE Regional Office after each December 24 payment. This report captures the total amount granted, number of workers covered, and average amount per employee. Failure to file this report is a separate compliance exposure from the payment itself.
              </p>

              {/* H2 */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Who Is Entitled to 13th Month Pay?
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Under PD 851, all rank-and-file employees of private-sector employers are entitled to 13th month pay, regardless of their designation, employment status (regular, contractual, project-based), or method of payment — provided they have worked at least one month during the calendar year.
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}>Full-year employees receive 1/12 of their total basic salary for the year</li>
                <li style={{ marginBottom: "0.5rem" }}>Mid-year hires receive a prorated amount based on months worked</li>
                <li style={{ marginBottom: "0.5rem" }}>Employees who resign or are separated before December are entitled to the proportionate amount for the months they worked</li>
                <li style={{ marginBottom: "0.5rem" }}>Managerial employees are not covered under PD 851, though some companies extend the benefit as policy</li>
              </ul>

              {/* H2 */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                How to Compute 13th Month Pay
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                The formula is straightforward:
              </p>

              {/* Formula block */}
              <div style={{ background: "#f9fafb", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem", fontFamily: "monospace", fontSize: "0.95rem", color: "#111827" }}>
                13th Month Pay = Total Basic Salary Earned for the Year ÷ 12
              </div>

              <p style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#111827" }}>What counts as basic salary:</strong> Basic salary only — the fixed monthly rate before overtime, bonuses, allowances, or premium pay. It does not include:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}>Overtime pay</li>
                <li style={{ marginBottom: "0.5rem" }}>Cost-of-living allowances (COLA)</li>
                <li style={{ marginBottom: "0.5rem" }}>Profit-sharing payments</li>
                <li style={{ marginBottom: "0.5rem" }}>Cash equivalent of unused vacation and sick leave (unless provided by company policy)</li>
                <li style={{ marginBottom: "0.5rem" }}>Premium pay on rest days and special holidays</li>
              </ul>
              <p style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#111827" }}>Unpaid absences reduce the amount.</strong> 13th month pay is based on actual basic salary earned. If an employee was on unpaid leave for several weeks, that period is excluded from the computation.
              </p>

              {/* Example box */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600", color: "#111827", fontSize: "0.95rem" }}>Example</p>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  An employee earns ₱20,000/month basic salary and took 10 unpaid leave days during the year (equivalent to ₱9,091 in unpaid deductions). Total basic salary earned for the year: ₱240,000 − ₱9,091 = ₱230,909. 13th month pay = ₱230,909 ÷ 12 = <strong>₱19,242</strong>.
                </p>
              </div>

              {/* H2 */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Common 13th Month Pay Computation Mistakes
              </h2>

              <p style={{ marginBottom: "1rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Mistake 1: Including non-basic pay in the computation.</strong> Overtime pay, COLA, night differential, holiday premiums, and cash equivalents of leave conversions do not form part of basic salary. Including them inflates the amount and produces a non-compliant payslip if challenged at the NLRC.
              </p>

              <p style={{ marginBottom: "1rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Mistake 2: Not prorating for resigned or newly hired employees.</strong> An employee who worked only 3 months is entitled to 3/12 of their annual basic salary. Employers who skip the proration — or include it in final pay without computing it — are exposed to money claims before the NLRC.
              </p>

              <p style={{ marginBottom: "1rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Mistake 3: Not adjusting for mid-year salary increases.</strong> 13th month pay is based on actual basic salary earned per month, not a flat annual rate. If an employee received a raise in July, the first half of the year uses the old rate and the second half uses the new rate. Many employers apply one rate to the full year.
              </p>

              <p style={{ marginBottom: "2.5rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Mistake 4: Not filing the DOLE compliance report.</strong> After paying 13th month pay, employers must submit a compliance report to their DOLE Regional Office. The report captures establishment name, total employees covered, amount per employee, and total amount disbursed. Not filing this report is a separate compliance gap from the payment itself.
              </p>

              {/* H2 */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Cash Flow Exposure: What the Numbers Look Like
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                For a business with 30 rank-and-file employees at an average basic salary of ₱20,000 per month, the total 13th month obligation is ₱600,000 — payable by December 24. For 50 employees at the same average: ₱1,000,000. These are fixed liabilities that accrue from January 1 regardless of whether they are tracked.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                The computation must accurately reflect actual basic salary, account for unpaid absences, and be documented in a way that survives both a DOLE inspection and a BIR audit. Both agencies can request payroll records and 13th month computations independently.
              </p>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS tracks 13th month pay automatically — every payroll run, all year.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Built specifically for Philippine businesses. Every cut-off, the system accrues what is owed. See your total 13th month liability anytime. Walk into November with a number you already know.
                </p>
                <a href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  Book a free demo <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* FAQ — AEO: structured Q&A */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  When is the deadline for 13th month pay in the Philippines?
                </h3>
                <p>
                  13th month pay must be paid no later than December 24 of each year. Employers may pay it in two tranches — at least half before October 31 and the balance before December 24 — though full payment before December 24 is the minimum legal requirement.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Is 13th month pay taxable in the Philippines?
                </h3>
                <p>
                  Under the TRAIN Law, 13th month pay is tax-exempt up to ₱90,000 per year. The combined amount of 13th month pay and other bonuses (such as productivity bonuses) above ₱90,000 is subject to income tax withholding.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Does 13th month pay include overtime and allowances?
                </h3>
                <p>
                  No. 13th month pay is computed on basic salary only. Overtime pay, COLA, night differential, commissions, and cash equivalents of leave conversions are excluded from the computation — unless the employer&apos;s company policy explicitly includes them.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What happens if an employee resigns before December?
                </h3>
                <p>
                  An employee who resigns or is separated (for any reason other than serious misconduct) before December 24 is still entitled to 13th month pay proportionate to the months they worked during the calendar year. This must be included in their final pay.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Are contractual and project-based employees entitled to 13th month pay?
                </h3>
                <p>
                  Yes. All rank-and-file employees — regardless of employment status, whether regular, contractual, project-based, or probationary — are entitled to 13th month pay once they have worked at least one month in the calendar year.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the penalty for non-payment of 13th month pay?
                </h3>
                <p>
                  Under Section 9 of the PD 851 Implementing Rules, non-payment is treated as a money claims case processed under the Rules of the National Labor Relations Commission. The employer is liable for the full unpaid amount for all affected employees. DOLE can also assess administrative penalties and employers may face fines or imprisonment under Article 303 of the Labor Code for willful violations. There is no cap on the recoverable amount per employee.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Do employers need to file any report with DOLE after paying 13th month pay?
                </h3>
                <p>
                  Yes. Employers must submit a 13th month pay compliance report to their DOLE Regional Office after distribution. The report must include the establishment name and address, total number of employees covered, amount granted per employee, and the total amount disbursed. This is a separate obligation from the payment itself — missing it is a compliance gap even if payment was made on time.
                </p>
              </div>

              {/* Author / Last updated */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Last updated June 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  This article reflects current DOLE and BIR requirements under Philippine law. For advice specific to your business, consult a licensed labor law practitioner.
                </p>
              </div>

            </div>
          </div>
        </article>

        {/* End CTA */}
        <section className="py-16" style={{ background: "#FFFBF0", borderTop: "1px solid rgba(255,193,7,0.2)" }}>
          <div className="lp-section-container max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "hsl(38, 92%, 38%)" }}>YAHSHUA HRIS</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ lineHeight: "1.3" }}>
              Stop computing 13th month pay in November.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS accrues what&apos;s owed every payroll run — from January. See your total 13th month liability anytime. Walk into December with a number you already know, not one you&apos;re scrambling to compute.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=13th_month"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white transition-all hover:gap-3"
              style={{ background: "hsl(38, 92%, 45%)" }}
            >
              See how 13th month tracking works in YAHSHUA <ArrowRight className="w-4 h-4" />
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

export default ThirteenthMonthPayArticle;
