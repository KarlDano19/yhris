import Link from "next/link";
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
                It is June. Your business is running. Payroll goes out on time. And somewhere in the back of your mind, you know November is coming.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                For most Philippine business owners, the 13th month pay conversation happens exactly once a year — in late October, when the panic sets in. The math is not complicated. The problem is the timing: you are doing in two stressful weeks what should have been happening automatically since January.
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
                The Cash Flow Problem Nobody Plans For
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                13th month pay is not a surprise. The obligation is fixed by law. What catches businesses off guard is the cash flow reality.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                For a business with 30 employees at an average monthly basic salary of ₱20,000, the 13th month obligation is ₱600,000 — payable by December 24. If that money has not been set aside, or at minimum tracked, the number can feel like a wall appearing out of nowhere.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Beyond cash, there is compliance risk. The computation must accurately reflect actual basic salary, account for absences correctly, and be documented in a way that survives a BIR audit. Getting this wrong does not go unnoticed.
              </p>

              {/* H2 */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Why Most Businesses Do Not Track This Monthly
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Most businesses do not track 13th month pay monthly because the tools they use were not designed to do it automatically. When payroll runs on spreadsheets, the focus is on getting the current cut-off right — 13th month accruals are a separate calculation nobody has time for in the moment.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                By the time November arrives, the spreadsheet that was supposed to help has become the source of the most stress.
              </p>

              {/* H2 */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                The Right Approach: Accrual From Day One
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                When an employee&apos;s basic pay processes in June, their 13th month entitlement for June should be calculated and recorded in the same moment. No separate step. No November scramble.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                This is what integrated HR and payroll looks like in practice. You open the system in June and see exactly what your 13th month liability is today — updated with every payroll run, visible at any time, ready for cash flow planning.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                When November comes, you are not computing — you are confirming.
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

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the penalty for non-payment of 13th month pay?
                </h3>
                <p>
                  Failure to pay 13th month pay is a violation of PD 851 and constitutes non-payment of a legal benefit. DOLE can assess penalties, and employees may file a money claim before the National Labor Relations Commission (NLRC). The employer is liable for the unpaid benefit plus any applicable damages.
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
