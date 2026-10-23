import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const th = { padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" } as const;
const tableWrap = { overflowX: "auto", marginBottom: "1.5rem" } as const;
const table = { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" } as const;

const RetirementPayArticle = () => {
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
                DOLE Compliance
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-6" style={{ lineHeight: "1.25" }}>
                Retirement Pay Law (RA 7641): What Every Philippine Employer Must Set Aside
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                RA 7641 sets a floor of 22.5 days of pay for every year of service, not the 15 days many employers assume. Here is who qualifies, how to compute it with peso examples, who is exempt, and how to plan for it before the first retirement lands.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>October 2026</span>
                <span>·</span>
                <span>7 min read</span>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Article Body */}
        <article className="py-16">
          <div className="lp-section-container max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none" style={{ color: "#374151", lineHeight: "1.8" }}>

              {/* Direct-answer opener */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "1.5rem", fontWeight: 500 }}>
                Under RA 7641, a private-sector employee who retires at 60 or older with at least five years of service with the employer is owed at least 22.5 days of pay for every year of service, unless the company&apos;s retirement plan pays more. Retirement is optional at 60 and compulsory at 65.
              </p>

              {/* Misconception callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>&ldquo;One-half month salary&rdquo; is not 15 days.</strong> The law defines it as 15 days of salary, plus the cash equivalent of 5 days of service incentive leave, plus one-twelfth of the 13th month pay (2.5 days). That adds up to 22.5 days per year of service. Computing it as 15 days understates every retirement payout by a third.
                </p>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2.5rem" }}>
                Republic Act 7641, enacted on December 9, 1992, amended what is now Article 302 of the Labor Code (formerly Article 287). It applies when a company has no retirement plan, or when its plan or collective bargaining agreement pays less than the law requires. Because the amount is based on the employee&apos;s latest salary and every year of service, the liability grows with each raise, and it is easy to ignore until someone turns 60.
              </p>

              {/* H2: Who is covered */}
              <h2 style={h2}>Who Qualifies for Retirement Pay</h2>
              <p style={{ marginBottom: "1rem" }}>
                An employee qualifies when both conditions are met:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Age:</strong> at least 60 (optional retirement). At 65, retirement is compulsory.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Service:</strong> at least five years with the same employer. Years worked elsewhere do not count unless a plan or agreement recognizes them.</li>
              </ul>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Employee type</th>
                      <th style={{ ...th, textAlign: "left" }}>Optional retirement</th>
                      <th style={{ ...th, textAlign: "left" }}>Compulsory retirement</th>
                      <th style={{ ...th, textAlign: "left" }}>Minimum service</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: "Most private-sector employees", o: "Age 60", c: "Age 65", s: "5 years" },
                      { t: "Underground mine workers", o: "Age 50", c: "Age 60", s: "5 years as an underground mine worker" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.t}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.o}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.c}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#111827" }}>Who is exempt:</strong> government employees, and employees of retail, service, and agricultural establishments regularly employing not more than 10 workers. The exemption is limited to those three kinds of business. A small manufacturer or a small construction firm is not exempt just because it has few employees.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                <strong style={{ color: "#111827" }}>Plans and agreements come first.</strong> If a company retirement plan, CBA, or established company practice pays more than the law, the better benefit applies. RA 7641 is a floor, not a ceiling, and the law says nothing in it deprives an employee of benefits under other laws, policies, or practices.
              </p>

              {/* H2: Formula */}
              <h2 style={h2}>How to Compute Retirement Pay</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Retirement pay is the daily rate on the employee&apos;s latest salary, multiplied by 22.5 days, multiplied by the years of service. A fraction of at least six months counts as one whole year. The 22.5 days break down like this, using a daily rate of ₱1,000 (for example, ₱26,000 a month when payroll divides by 26):
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Component, per year of service</th>
                      <th style={{ ...th, textAlign: "right" }}>Days</th>
                      <th style={{ ...th, textAlign: "right" }}>Amount at ₱1,000/day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { c: "Salary", d: "15", a: "₱15,000" },
                      { c: "Cash equivalent of service incentive leave", d: "5", a: "₱5,000" },
                      { c: "One-twelfth of the 13th month pay", d: "2.5", a: "₱2,500" },
                      { c: "Total per year of service", d: "22.5", a: "₱22,500" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i === 3 ? "rgba(255,193,7,0.06)" : (i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent") }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: i === 3 ? "700" : "500" }}>{row.c}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.d}</td>
                        <td style={{ padding: "0.75rem 1rem", color: i === 3 ? "hsl(38, 92%, 38%)" : "#374151", fontWeight: i === 3 ? "700" : "400", textAlign: "right" }}>{row.a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "1.5rem" }}>
                Worked examples at the same ₱1,000 daily rate, showing how the six-month rule changes the answer:
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Actual service</th>
                      <th style={{ ...th, textAlign: "right" }}>Credited years</th>
                      <th style={{ ...th, textAlign: "left" }}>Computation</th>
                      <th style={{ ...th, textAlign: "right" }}>Retirement pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: "5 years", y: "5", c: "22.5 × ₱1,000 × 5", p: "₱112,500" },
                      { s: "12 years 5 months", y: "12", c: "22.5 × ₱1,000 × 12", p: "₱270,000" },
                      { s: "12 years 7 months", y: "13", c: "22.5 × ₱1,000 × 13", p: "₱292,500" },
                      { s: "20 years", y: "20", c: "22.5 × ₱1,000 × 20", p: "₱450,000" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.s}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.y}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#6b7280", fontSize: "0.85rem" }}>{row.c}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(38, 92%, 38%)", fontWeight: "700", textAlign: "right" }}>{row.p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem", fontSize: "0.9rem", color: "#6b7280" }}>
                Use the daily rate your payroll uses for the employee&apos;s latest salary. The divisor (26, or another factor) depends on the company&apos;s pay basis, so confirm it before you compute. Two months of service is the entire difference between ₱270,000 and ₱292,500 in the table above.
              </p>

              {/* H2: Retirement vs final pay */}
              <h2 style={h2}>Retirement Pay Is Not the Same as Final Pay</h2>
              <p style={{ marginBottom: "1rem" }}>
                A retiring employee is owed both, and they are different amounts. Final pay is everything else due at separation: unpaid salary, pro-rated 13th month pay, and unused leave conversion. Retirement pay under Article 302 is one more line in that total, and DOLE Labor Advisory No. 06-20 requires the whole final pay to be released within 30 days of separation. Our guide to{" "}
                <Link href="/blog/final-pay-computation-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>final pay computation</Link>{" "}
                covers the other components and the clearance rules.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Retirement pay is also different from separation pay. Separation pay is owed when the employer ends the job for an authorized cause such as redundancy or closure. Retirement pay is owed because the employee reached retirement age with enough service.
              </p>

              {/* H2: Tax */}
              <h2 style={h2}>Is Retirement Pay Taxable?</h2>
              <p style={{ marginBottom: "1rem" }}>
                Possibly not, but that is a separate question from whether the employee is owed it. Under Section 32(B)(6)(a) of the National Internal Revenue Code (RA 4917), retirement benefits received under a reasonable private benefit plan maintained by the employer are exempt from income tax if the employee is at least 50 years old, has served the same employer for at least 10 years, and has not availed of the exemption before.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Practitioners differ on how this applies when an employer pays only the statutory minimum without a BIR-approved plan, and if the conditions are not met the amount is taxable compensation. Confirm the treatment with the BIR or a tax professional before the first payout, and keep the documents that prove age, service, and one-time use.
              </p>

              {/* H2: Planning */}
              <h2 style={h2}>What to Set Aside, and When</h2>
              <p style={{ marginBottom: "1rem" }}>
                The cost is predictable, which makes it easy to plan. Four steps:
              </p>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>List who is approaching 60.</strong> Flag every employee within five years of age 60 who has, or will have, five years of service. Note the dates they hit 60 (optional) and 65 (compulsory).</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Estimate each liability.</strong> Daily rate × 22.5 × credited years. Because the law uses the latest salary, every raise lifts the amount for all prior years, so refresh the estimate whenever pay changes.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Check your plan or CBA.</strong> Whichever pays more governs. If you have neither, the statutory formula is the default.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Decide how to fund it.</strong> Options include a cash reserve or a BIR-approved retirement plan. Ask your accountant how the obligation should be measured and recorded under PAS 19 (Employee Benefits).</li>
              </ol>
              <p style={{ marginBottom: "2.5rem" }}>
                Not complying is an offense under the Labor Code&apos;s penal provisions, and an unpaid retirement claim can be taken to DOLE or the NLRC as a money claim.
              </p>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS keeps offboarding in one workflow.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Manage clearance forms, quitclaims, and final pay documentation through one structured workflow, with every step tracked. YAHSHUA Payroll is included.
                </p>
                <Link href="/blog/final-pay-computation-philippines" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See what goes into final pay <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How is retirement pay computed in the Philippines?
                </h3>
                <p>
                  Multiply the employee&apos;s latest daily rate by 22.5 days, then by the years of service, counting a fraction of at least six months as one full year. The 22.5 days are 15 days of salary, 5 days of service incentive leave, and 2.5 days for one-twelfth of the 13th month pay.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  At what age can an employee retire under RA 7641?
                </h3>
                <p>
                  Retirement is optional at 60 and compulsory at 65, with at least five years of service with the employer. Underground mine workers can retire optionally at 50 and must retire at 60, after at least five years as underground mine workers.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Is an employee with less than five years of service entitled to retirement pay?
                </h3>
                <p>
                  Not under RA 7641, which requires at least five years of service with the employer. A company retirement plan, CBA, or established practice can still grant a benefit, and the employee remains entitled to final pay items such as unpaid salary and pro-rated 13th month pay.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Do small businesses have to pay retirement pay?
                </h3>
                <p>
                  Only some are exempt. Retail, service, and agricultural establishments regularly employing not more than 10 workers are exempt. Other small businesses, such as a small manufacturer, are covered even with fewer than 10 employees.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Is retirement pay taxable?
                </h3>
                <p>
                  It depends. Benefits received under a reasonable private plan are income tax exempt if the employee is at least 50, has served the same employer for at least 10 years, and has not availed of the exemption before. If those conditions are not met, the amount is taxable. Confirm the treatment with the BIR or a tax professional before paying out.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published October 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Based on Article 302 (formerly Article 287) of the Labor Code as amended by Republic Act 7641 (December 9, 1992) and Republic Act 8558 (February 26, 1998), the DOLE Bureau of Working Conditions Handbook on Workers&apos; Statutory Monetary Benefits, DOLE Labor Advisory No. 06, Series of 2020, Section 32(B)(6)(a) of the National Internal Revenue Code, and Republic Act 4917. Peso examples are illustrative and use a daily rate of ₱1,000. Company plans, CBAs, and tax rulings can change the result. Verify with DOLE, the BIR, or legal counsel before computing or paying retirement benefits. This article does not constitute legal or tax advice.
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
                  <Link href="/blog/13th-month-pay-computation-philippines-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    13th Month Pay Computation 2026: Formula and Calculator →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/dole-compliance-requirements-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    DOLE Compliance Requirements for Employers →
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
              Planning ahead for retirements?
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Book a free demo and ask how YAHSHUA HRIS and Payroll handles employee records and separation for your team.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=retirement_pay"
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

export default RetirementPayArticle;
