import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const th = { padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" } as const;
const tableWrap = { overflowX: "auto", marginBottom: "1.5rem" } as const;
const table = { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" } as const;

const ProbationaryToRegularArticle = () => {
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
                Probationary to Regular: Getting the 6-Month Regularization Timeline Right in Payroll
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Miss the six-month mark, or skip one conversation on day one, and an employee can become regular without anyone deciding it. Here is how to count the days, what the law requires you to tell new hires, and what a probationary employee is already owed.
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
                Probationary employment in the Philippines cannot exceed six months from the day the employee started working, and the safe way to count it is 180 calendar days. An employee who is allowed to keep working after that becomes a regular employee by law, and one whose regularization standards were never explained at hiring is treated as regular from the start.
              </p>

              {/* Callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Probationary does not mean fewer benefits.</strong> From the first day, a probationary employee is owed at least the minimum wage and is covered by SSS, PhilHealth, and Pag-IBIG. They also earn 13th month pay once they have worked a month. What probation changes is how and when the employment can end, not what the employee is paid.
                </p>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2.5rem" }}>
                Article 296 of the Labor Code (formerly Article 281) is three sentences long, and most regularization disputes come down to one of them. Payroll teams feel it too, because the employee&apos;s status, benefits, and records all depend on a date that someone has to calculate correctly.
              </p>

              {/* H2: The rule */}
              <h2 style={h2}>What Article 296 Actually Says</h2>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Rule</th>
                      <th style={{ ...th, textAlign: "left" }}>What it means for you</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { r: "Probation cannot exceed six months from the date the employee started working", m: "Unless an apprenticeship agreement sets a longer period. Count from day one of work, not from the contract date." },
                      { r: "It can end for just cause, or if the employee fails to qualify under reasonable standards made known at the time of engagement", m: "The standards must be told to the employee at hiring. Telling them later does not count." },
                      { r: "An employee allowed to work after the probationary period is a regular employee", m: "No evaluation, signature, or regularization letter is needed. Continuing to work past the period is enough." },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.r}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* H2: Counting */}
              <h2 style={h2}>How to Count the 180 Days</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Philippine labor sources treat the six-month limit as 180 calendar days. Count the employee&apos;s first day of work as day 1, so day 180 is the start date plus 179 days. The employee becomes regular the day after.
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>First day of work</th>
                      <th style={{ ...th, textAlign: "left" }}>Day 180 (last day of probation)</th>
                      <th style={{ ...th, textAlign: "left" }}>Regular from</th>
                      <th style={{ ...th, textAlign: "left" }}>Six calendar months would say</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: "January 5, 2026", d: "July 3, 2026", r: "July 4, 2026", c: "July 5, 2026" },
                      { s: "March 2, 2026", d: "August 28, 2026", r: "August 29, 2026", c: "September 2, 2026" },
                      { s: "July 1, 2026", d: "December 27, 2026", r: "December 28, 2026", c: "January 1, 2027" },
                      { s: "October 1, 2026", d: "March 29, 2027", r: "March 30, 2027", c: "April 1, 2027" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.s}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(38, 92%, 38%)", fontWeight: "700" }}>{row.d}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.r}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#9ca3af" }}>{row.c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem", fontSize: "0.9rem", color: "#6b7280" }}>
                Counting six calendar months lands two to five days later than counting 180 days, depending on the start date. That gap is where employers slip: an evaluation scheduled for &ldquo;the end of month six&rdquo; can fall after the employee is already regular. Anchor every deadline to day 180, not to a month.
              </p>

              {/* H2: Standards */}
              <h2 style={h2}>The Standards Trap: Tell Them on Day One</h2>
              <p style={{ marginBottom: "1rem" }}>
                The most common way employers lose a regularization case is not missing the six months. It is never explaining what the employee has to achieve. The Implementing Rules of the Labor Code say that if the employer fails to inform a probationary employee of the standards for regularization at the time of engagement, the employee is deemed regular. The Supreme Court applied this in{" "}
                <em>Abbott Laboratories, Philippines v. Alcaraz</em> (G.R. No. 192571), which also held that an employer meets the requirement when it makes reasonable efforts to tell the employee what is expected during the trial period.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                In practice, that means a written document handed over on or before the first day of work, signed by the employee, that states:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}>That the employment is probationary, and the exact start date and end date (day 180)</li>
                <li style={{ marginBottom: "0.5rem" }}>The specific, measurable standards for the role, such as targets, attendance expectations, or competencies</li>
                <li style={{ marginBottom: "0.5rem" }}>How and when performance will be evaluated, and by whom</li>
              </ul>

              {/* H2: Benefits */}
              <h2 style={h2}>What a Probationary Employee Is Already Owed</h2>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Benefit</th>
                      <th style={{ ...th, textAlign: "left" }}>Probationary employees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { b: "Minimum wage", p: "Yes, from the first day. The rate depends on the region and sector where they work." },
                      { b: "SSS, PhilHealth, Pag-IBIG", p: "Yes. Coverage and contributions apply as soon as the employee starts." },
                      { b: "13th month pay", p: "Yes, once they have worked at least one month, pro-rated for the time served." },
                      { b: "Overtime, holiday pay, night differential", p: "Yes, where the work and the employee qualify for them under the Labor Code." },
                      { b: "Service incentive leave (5 days)", p: "Only after one year of service, so generally not during a six-month probation." },
                      { b: "Company benefits such as HMO or vacation leave credits", p: "Set by your policy, not by law. Many companies start them at regularization, so state this in the contract." },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.b}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem" }}>
                That is why regularization is rarely a payroll computation problem. Statutory pay does not change on day 181. What changes is the employee&apos;s security of tenure, and any company benefits your policy ties to regular status.
              </p>

              {/* H2: Extension */}
              <h2 style={h2}>Can You Extend Probation?</h2>
              <p style={{ marginBottom: "1rem" }}>
                As a rule, no. The six-month cap is the law, and an employee kept on past it is regular. The Supreme Court has accepted longer periods only in narrow situations: apprenticeship agreements, special laws such as the rules for teaching personnel in private schools, and an extension the employee agreed to as a second chance to meet the standards (<em>Mariwasa Manufacturing v. Leogardo</em>, G.R. No. 74246).
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                If you think you need an extension, the employer carries the burden of proving it was valid. At a minimum, get it in writing, signed by the employee, for a fixed period, and before day 180 arrives. A unilateral or back-dated extension is unlikely to hold. Unless you are sure you fall within an exception, treat day 180 as final.
              </p>

              {/* H2: Ending */}
              <h2 style={h2}>If the Employee Does Not Qualify</h2>
              <p style={{ marginBottom: "2.5rem" }}>
                You can end probationary employment for a just cause, or because the employee failed to meet the standards you told them about at hiring. Evaluate against those documented standards, decide, and notify the employee in writing before day 180. Once day 180 passes and the employee is still working, they are regular, and ending the employment now requires a just or authorized cause with the full due process that applies to regular employees. If an employee is separated, the final pay rules still apply; see our guide to{" "}
                <Link href="/blog/final-pay-computation-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>final pay computation</Link>.
              </p>

              {/* H2: Checklist */}
              <h2 style={h2}>A Payroll and HR Checklist</h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Record the first day of work</strong> and calculate day 180 on the day you hire, not later.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>File the signed standards</strong> in the employee&apos;s record on or before day one.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Schedule the evaluation around day 150,</strong> leaving 30 days to decide and notify.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Make the decision in writing before day 180,</strong> and confirm regular status or end the employment.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Update the employee&apos;s status and any policy-based benefits</strong> from day 181. Statutory pay does not change.</li>
              </ol>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  Keep the dates and the signed standards in one place.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  YAHSHUA HRIS keeps each employee&apos;s 201 file in one place, from hire date to present, so the start date and the signed standards are on record when you need them. YAHSHUA Payroll is included.
                </p>
                <Link href="/blog/payroll-registration-checklist-philippines" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See the payroll setup checklist for new employers <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How long can probationary employment last in the Philippines?
                </h3>
                <p>
                  Up to six months from the day the employee started working, which is safest to count as 180 calendar days. The only general exception is an apprenticeship agreement that sets a longer period.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What happens if a probationary employee keeps working after six months?
                </h3>
                <p>
                  They become a regular employee by operation of law under Article 296 of the Labor Code. No evaluation, signature, or regularization letter is required for this to happen.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Can an employer extend the probationary period?
                </h3>
                <p>
                  Generally no. Courts have accepted longer periods only in narrow cases, such as apprenticeship, special laws for teaching personnel, or a documented extension the employee agreed to. The employer must prove the exception applies, so an extension should be written, signed, for a fixed period, and made before day 180.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Are probationary employees entitled to 13th month pay and government benefits?
                </h3>
                <p>
                  Yes. They are owed at least the minimum wage, are covered by SSS, PhilHealth, and Pag-IBIG from the start, and receive pro-rated 13th month pay once they have worked at least one month. Service incentive leave applies only after one year of service.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What if the employer never told the employee the regularization standards?
                </h3>
                <p>
                  Under the Implementing Rules of the Labor Code, an employee who was not informed of the standards for regularization at the time of engagement is deemed a regular employee. Employers meet the requirement when they make reasonable efforts to tell the employee what is expected during the trial period, so put the standards in writing on or before day one.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published October 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Based on Article 296 (formerly Article 281) of the Labor Code, Section 6(d), Rule I, Book VI of its Implementing Rules, <em>Abbott Laboratories, Philippines v. Alcaraz</em> (G.R. No. 192571), <em>Mariwasa Manufacturing, Inc. v. Leogardo</em> (G.R. No. 74246, January 26, 1989), and Presidential Decree 851 on 13th month pay. The day-180 dates above count the first day of work as day 1 and are illustrations, not legal advice; courts decide each case on its facts. Verify with DOLE or legal counsel before regularizing, extending, or ending a probationary employment. This article does not constitute legal advice.
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
                  <Link href="/blog/payroll-registration-checklist-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Philippine Business Payroll Setup Checklist →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/13th-month-pay-computation-philippines-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    13th Month Pay Computation 2026: Formula and Calculator →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/final-pay-computation-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Final Pay Computation for Resigned Employees →
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
              Hiring this quarter?
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Book a free demo and ask how YAHSHUA HRIS and Payroll handles employee records from the first day of work.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=probationary_regular"
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

export default ProbationaryToRegularArticle;
