import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

// Single source for the visible FAQ and the FAQPage schema in page.tsx
export const annualizationFaqs = [
  {
    q: "What is year-end tax annualization?",
    a: "It is the employer's recomputation of each employee's income tax for the whole calendar year, done in the last payroll of December. The employer compares the tax actually due for the year with the tax already withheld from January to November, then withholds the difference in December or refunds any excess.",
  },
  {
    q: "When do employers have to annualize withholding tax?",
    a: "In the last payroll of December, or in the last month of employment for anyone who leaves during the year, under RR 2-98 as amended by RR No. 11-2018. Any over-withheld tax is refunded to the employee by January 25 of the following year.",
  },
  {
    q: "How do you compute the annualized tax?",
    a: "Add the employee's gross compensation for the year, subtract non-taxable items (employee SSS, PhilHealth, and Pag-IBIG shares, union dues, 13th month pay and other benefits up to ₱90,000, and de minimis benefits within their ceilings), apply the graduated tax table to the result, then subtract the tax already withheld from January to November. The difference is what to withhold in December, or refund if negative.",
  },
  {
    q: "What happens if too much tax was withheld?",
    a: "The employer refunds the excess to the employee by January 25 of the following year. Over-withholding usually happens when an employee earned less late in the year than the monthly withholding assumed, for example after unpaid leave.",
  },
  {
    q: "What happens if too little tax was withheld?",
    a: "The employer deducts the shortfall from the employee's last pay of the year. Under-withholding is common when a large December bonus pushes 13th month pay and other benefits past the ₱90,000 tax-exempt ceiling.",
  },
  {
    q: "Are minimum wage earners covered by annualization?",
    a: "Their statutory minimum wage is exempt from income tax, and so are their holiday pay, overtime pay, night shift differential, and hazard pay, under the Tax Code as amended by the TRAIN Law. They still receive a BIR Form 2316 showing their compensation.",
  },
  {
    q: "How is annualization done for an employee with a previous employer this year?",
    a: "The new employer includes the compensation and tax withheld shown on the previous employer's certified BIR Form 2316, which the employee must provide. Because the employee had two employers in the year, they do not qualify for substituted filing (RR No. 11-2018) and must file their own annual income tax return (BIR Form 1700) by April 15 of the following year, attaching the 2316s.",
  },
  {
    q: "What is substituted filing?",
    a: "Employees who earn purely compensation income from only one employer for the whole year, and whose tax was withheld correctly, do not file BIR Form 1700. The employer's filing of their signed BIR Form 2316 and the certified list of qualified employees stands in for their annual return (RR 2-98 Section 2.83.4, as amended by RR No. 11-2018).",
  },
];

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const th = { textAlign: "left" as const, padding: "0.6rem 0.75rem", color: "#6b7280", fontWeight: "600" };
const td = { padding: "0.6rem 0.75rem", color: "#374151", verticalAlign: "top" as const };
const box = { background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "1.25rem" } as const;
const mistake = { marginBottom: "1rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" } as const;

const Table = ({ head, rows, rightCols = [] }: { head: string[]; rows: string[][]; rightCols?: number[] }) => (
  <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
          {head.map((h, j) => <th key={h} style={rightCols.includes(j) ? { ...th, textAlign: "right" } : th}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
            {r.map((c, j) => <td key={j} style={rightCols.includes(j) ? { ...td, textAlign: "right", whiteSpace: "nowrap" } : (j === 0 ? { ...td, color: "#111827", fontWeight: 500 } : td)}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const YearEndAnnualizationArticle = () => {
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
                Year-End Tax Annualization 2026: How to Compute It, Plus BIR Form 2316 and 1604-C Deadlines
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                A step-by-step guide to recomputing employees&apos; 2026 income tax in the December payroll, with worked examples, the special cases that trip employers up, and the January and February filings that follow.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>October 2026</span>
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
              src="/blog/year-end-tax-annualization-2026.png"
              alt="Year-end tax annualization 2026 guide for Philippine employers"
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
                Year-end tax annualization is the employer&apos;s recomputation of each employee&apos;s income tax for the full calendar year, done in the last payroll of December. The tax due for 2026 is compared with the tax withheld from January to November; the difference is withheld in December, or refunded to the employee by January 25, 2027.
              </p>

              {/* Key dates callout */}
              <div style={{ ...box, marginBottom: "2.5rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Key dates for the 2026 tax year</strong>
                </p>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.9rem", color: "#374151" }}>
                  <li>Last December 2026 payroll: run the annualization</li>
                  <li>January 25, 2027: refund any over-withheld tax</li>
                  <li>January 31, 2027 (a Sunday, so the next working day): BIR Form 2316 to employees; BIR Form 1604-C with alphalist to the BIR</li>
                  <li>February 28, 2027 (a Sunday, so the next working day): signed 2316 copies and the substituted filing list to the BIR</li>
                </ul>
              </div>

              {/* H2: Steps */}
              <h2 style={h2}>How to Compute Year-End Annualization, Step by Step</h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2rem" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Add up gross compensation for January to December.</strong> Include basic pay, overtime, holiday pay, night differential, allowances, commissions, 13th month pay, and bonuses. Add compensation from a previous employer this year, taken from that employer&apos;s certified BIR Form 2316.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Subtract non-taxable compensation</strong> (list below): employee SSS, PhilHealth, and Pag-IBIG shares, union dues, 13th month pay and other benefits up to ₱90,000, and de minimis benefits within their ceilings.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Apply the annual tax table</strong> to the remaining taxable compensation to get the tax due for the year.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Subtract the tax already withheld</strong> from January to November, including tax withheld by a previous employer.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Settle the difference.</strong> If positive, withhold it from the last December pay. If negative, refund it by January 25, 2027.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Record the results</strong> on each employee&apos;s BIR Form 2316 and in the alphalist attached to BIR Form 1604-C.</li>
              </ol>

              {/* H2: Tax table */}
              <h2 style={h2}>2026 Annual Income Tax Table</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                The graduated rates in effect since January 1, 2023 under the TRAIN Law still apply for 2026.
              </p>
              <Table
                head={["Annual taxable compensation", "Tax due"]}
                rows={[
                  ["₱250,000 or less", "0"],
                  ["Over ₱250,000 to ₱400,000", "15% of the excess over ₱250,000"],
                  ["Over ₱400,000 to ₱800,000", "₱22,500 + 20% of the excess over ₱400,000"],
                  ["Over ₱800,000 to ₱2,000,000", "₱102,500 + 25% of the excess over ₱800,000"],
                  ["Over ₱2,000,000 to ₱8,000,000", "₱402,500 + 30% of the excess over ₱2,000,000"],
                  ["Over ₱8,000,000", "₱2,202,500 + 35% of the excess over ₱8,000,000"],
                ]}
              />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                Source: BIR, graduated income tax rates effective January 1, 2023 and onwards (RMC No. 34-2025, Annex A).
              </p>

              {/* H2: Non-taxable */}
              <h2 style={h2}>What Is Not Taxable</h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}>Employee shares of SSS, PhilHealth, and Pag-IBIG contributions, and union dues (RR No. 11-2018).</li>
                <li style={{ marginBottom: "0.5rem" }}>13th month pay and other benefits, such as mid-year and year-end bonuses, up to ₱90,000 combined. Only the amount above ₱90,000 is taxable.</li>
                <li style={{ marginBottom: "0.5rem" }}>De minimis benefits within their own ceilings. Any excess joins the ₱90,000 pool; see our <Link href="/blog/de-minimis-benefits-2026-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>de minimis benefits guide</Link>.</li>
                <li style={{ marginBottom: "0.5rem" }}>For minimum wage earners: the statutory minimum wage plus their holiday pay, overtime pay, night shift differential, and hazard pay.</li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                For 2026, the employee shares are 5% of the Monthly Salary Credit for SSS (up to a ₱35,000 credit), 2.5% of monthly basic salary for PhilHealth (up to a ₱100,000 salary), and up to ₱200 a month for Pag-IBIG. Our <Link href="/blog/sss-contribution-table-2026-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>2026 contribution tables</Link> have the full brackets.
              </p>

              {/* H2: Worked examples */}
              <h2 style={h2}>Worked Examples</h2>
              <div style={box}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>Example 1: same salary all year, no extra bonus</p>
                <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem" }}>An employee earns ₱40,000 a month in basic pay for all of 2026, plus ₱40,000 in 13th month pay. Monthly employee contributions: SSS ₱1,750, PhilHealth ₱1,000, Pag-IBIG ₱200, a total of ₱2,950.</p>
                <Table
                  head={["Item", "Amount"]}
                  rightCols={[1]}
                  rows={[
                    ["Basic pay (₱40,000 × 12)", "₱480,000.00"],
                    ["Less employee contributions (₱2,950 × 12)", "(₱35,400.00)"],
                    ["13th month pay (within ₱90,000, not taxable)", "₱0.00"],
                    ["Taxable compensation", "₱444,600.00"],
                    ["Tax due: ₱22,500 + 20% × ₱44,600", "₱31,420.00"],
                    ["Withheld January to November (₱2,618.40 × 11)", "₱28,802.40"],
                    ["To withhold in December", "₱2,617.60"],
                  ]}
                />
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>With no changes during the year, the December withholding is close to a normal month.</p>
              </div>
              <div style={{ ...box, marginBottom: "2.5rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>Example 2: the same employee gets a ₱70,000 year-end bonus</p>
                <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem" }}>13th month pay (₱40,000) plus the bonus (₱70,000) is ₱110,000, which is ₱20,000 over the ₱90,000 ceiling. That ₱20,000 becomes taxable.</p>
                <Table
                  head={["Item", "Amount"]}
                  rightCols={[1]}
                  rows={[
                    ["Taxable compensation (₱444,600 + ₱20,000)", "₱464,600.00"],
                    ["Tax due: ₱22,500 + 20% × ₱64,600", "₱35,420.00"],
                    ["Withheld January to November", "₱28,802.40"],
                    ["To withhold in December", "₱6,617.60"],
                  ]}
                />
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>The bonus adds ₱4,000 of tax, all collected in December. Telling employees in advance avoids surprise at a smaller December net pay.</p>
              </div>

              {/* H2: Special cases */}
              <h2 style={h2}>Special Cases</h2>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>New hire with a previous employer in 2026.</strong> Collect the previous employer&apos;s certified BIR Form 2316 and include that compensation and tax withheld in your annualization (RR No. 11-2018). Anyone with two employers in the same year does not qualify for substituted filing, so tell the employee they must file BIR Form 1700 by April 15, 2027.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Employee who resigns before December.</strong> Annualize in the last month of employment and issue BIR Form 2316 with the last pay. Their prorated 13th month pay is part of final pay; see our <Link href="/blog/final-pay-computation-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>final pay guide</Link>.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Minimum wage earners.</strong> No income tax on the statutory minimum wage or on their holiday, overtime, night differential, and hazard pay. If a wage order raised their rate mid-year, as NCR-28 did in Metro Manila on September 26, 2026, they stay exempt as long as they are paid the statutory minimum.
              </p>
              <p style={{ ...mistake, marginBottom: "2.5rem" }}>
                <strong style={{ color: "#111827" }}>Employees with other income.</strong> Anyone with business or professional income, other income not subject to final tax, or more than one employer during the year (at the same time or one after another) is not eligible for substituted filing and files their own annual return.
              </p>

              {/* H2: Filings */}
              <h2 style={h2}>BIR Form 2316, 1604-C, and Substituted Filing</h2>
              <Table
                head={["Filing", "What it is", "Deadline (2026 tax year)"]}
                rows={[
                  ["BIR Form 2316", "Certificate of compensation and tax withheld, signed by employer and employee", "To employees by January 31, 2027 (Sunday, so the next working day), or with the last pay for leavers"],
                  ["BIR Form 1604-C with alphalist", "Annual information return of tax withheld on compensation", "January 31, 2027 (Sunday, so the next working day)"],
                  ["2316 copies and substituted filing list", "Signed duplicate 2316s and the certified list of employees qualified for substituted filing", "February 28, 2027 (Sunday, so the next working day)"],
                  ["BIR Form 1601-C for December", "Monthly remittance of tax withheld, including the December adjustment", "January 15, 2027 for manual filers; eFPS by group schedule"],
                ]}
              />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                Since 2024, the 2316 copies submitted to the BIR need both the employer&apos;s and the employee&apos;s signatures. The BIR sometimes extends these deadlines by circular, so check its advisories in January.
              </p>

              {/* H2: Mistakes */}
              <h2 style={h2}>Common Annualization Mistakes</h2>
              <p style={mistake}><strong style={{ color: "#111827" }}>Forgetting a new hire&apos;s previous employer.</strong> Annualizing only your own payroll understates the year&apos;s tax and leaves a balance on the employee&apos;s own return.</p>
              <p style={mistake}><strong style={{ color: "#111827" }}>Ignoring the ₱90,000 ceiling.</strong> A generous December bonus can push 13th month pay and other benefits over the ceiling; the excess is taxable.</p>
              <p style={mistake}><strong style={{ color: "#111827" }}>Using the wrong contribution amounts.</strong> Only the employee shares are deducted, at the 2026 rates, not the employer shares.</p>
              <p style={{ ...mistake, marginBottom: "2.5rem" }}><strong style={{ color: "#111827" }}>Missing the January 25 refund.</strong> Over-withheld tax belongs to the employee and must be returned by January 25.</p>

              {/* CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA Payroll is included in every YAHSHUA HRIS plan.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Automated BIR, SSS, PhilHealth, and Pag-IBIG computations, payslips, and bank disbursement, with HR and payroll synced in real time so year-end figures come from one record.
                </p>
                <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See what is included <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
              {annualizationFaqs.map((f, i) => (
                <div key={f.q} style={{ marginBottom: i === annualizationFaqs.length - 1 ? "3rem" : "2rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published October 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Sources: <a href="https://bir-cdn.bir.gov.ph/local/pdf/RR%20No.%2011-2018.pdf" target="_blank" rel="noopener noreferrer">RR No. 11-2018</a> (amending RR 2-98) on withholding, annualization, non-taxable compensation, and substituted filing; <a href="https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2034-2025%20Annex%20A.pdf" target="_blank" rel="noopener noreferrer">BIR graduated tax rates, 2023 onwards</a>; the TRAIN Law (RA 10963); SSS, PhilHealth, and Pag-IBIG (HDMF Circular No. 460) 2026 contribution rules. Verified October 1, 2026. This article does not constitute tax advice; consult a tax professional for your situation.
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
                  <Link href="/blog/q4-payroll-compliance-deadlines-philippines-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Q4 2026 Payroll Deadlines: Your Compliance Countdown →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/13th-month-pay-computation-philippines-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    13th Month Pay Computation 2026: Formula and Calculator →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/de-minimis-benefits-2026-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    De Minimis Benefits 2026: New BIR Ceilings →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/philippine-payroll-errors-msme" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    What Philippine Payroll Errors Actually Cost MSMEs →
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
              Close the 2026 payroll year with numbers you trust.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS and Payroll keeps compensation, benefits, and statutory deductions in one system, so December annualization starts from clean records.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=year_end_annualization_2026"
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

export default YearEndAnnualizationArticle;
