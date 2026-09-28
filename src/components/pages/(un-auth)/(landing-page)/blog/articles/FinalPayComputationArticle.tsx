import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const FinalPayComputationArticle = () => {
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
                Final Pay Computation for Resigned Employees: What DOLE&apos;s Labor Advisory Actually Requires
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Employers must release a resigned employee&apos;s final pay within 30 days of separation under DOLE Labor Advisory No. 06-20, and it is not the same 30 days as the employee&apos;s resignation notice. Here is exactly what has to be in that final pay, and what does not.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>September 2026</span>
                <span>·</span>
                <span>7 min read</span>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Featured Image */}
        <div className="lp-section-container max-w-3xl mx-auto pt-10 pb-0">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "360px" }}>
            <Image
              src="/blog/final-pay-computation.png"
              alt="Final Pay Computation for Resigned Employees"
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
                Under DOLE Labor Advisory No. 06, Series of 2020, an employer must release a resigned employee&apos;s final pay within 30 calendar days from the date of separation, unless a more favorable company policy or agreement applies. Final pay includes unpaid salary, pro-rated 13th month pay, and unused leave conversion, but generally not separation pay, since separation pay is not owed for a voluntary resignation unless company policy or a CBA says otherwise.
              </p>

              {/* Disambiguation callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Two different &ldquo;30 days,&rdquo; two different directions.</strong> Under Article 300 of the Labor Code, an employee must give the employer at least 30 days&apos; written notice before resigning. Separately, under DOLE Labor Advisory No. 06-20, the employer must release the employee&apos;s final pay within 30 days after separation. One clock is the employee&apos;s notice going in; the other is the employer&apos;s payout deadline going out. They are frequently conflated in casual explainer content.
                </p>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2.5rem" }}>
                Before 2020, there was no specific legal deadline for releasing a departing employee&apos;s final pay, only a vague standard of &ldquo;reasonable time,&rdquo; which in practice sometimes stretched to months. Labor Advisory No. 06, Series of 2020, &ldquo;Guidelines on the Payment of Final Pay and Issuance of Certificate of Employment,&rdquo; issued by DOLE on January 31, 2020, fixed that with a specific 30-day window. It applies to every mode of separation: resignation, termination for cause, retrenchment, redundancy, closure, disease, retirement, completion of contract, and death, across all private-sector employers regardless of size.
              </p>

              {/* H2: What counts */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                What Actually Counts as &ldquo;Final Pay&rdquo;
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Final pay, also called last pay or back pay, is the sum of all wages and monetary benefits due an employee regardless of why they left. For a resigned employee, it typically includes:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}>Unpaid earned salary up to the last day actually worked</li>
                <li style={{ marginBottom: "0.5rem" }}>Cash conversion of unused Service Incentive Leave (5 days per year under Article 95, for employees with at least one year of service, subject to standard exemptions)</li>
                <li style={{ marginBottom: "0.5rem" }}>Cash conversion of any additional unused vacation or sick leave the company policy or CBA already treats as convertible</li>
                <li style={{ marginBottom: "0.5rem" }}>Pro-rated 13th month pay under Presidential Decree 851</li>
                <li style={{ marginBottom: "0.5rem" }}>Any pro-rated bonuses or commissions already earned and demandable under company policy</li>
                <li style={{ marginBottom: "0.5rem" }}>Tax refund from the final withholding tax reconciliation, if the employee was overwithheld for the year</li>
                <li style={{ marginBottom: "0.5rem" }}>Return of any cash bond or deposit held by the employer</li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                Two items on many generic &ldquo;final pay&rdquo; checklists usually do not apply to a straightforward resignation: separation pay and retirement pay. Separation pay under Articles 298-299 of the Labor Code is owed for authorized-cause terminations (retrenchment, redundancy, closure, disease), not for an employee who chose to leave, unless a company policy, employment contract, or CBA specifically extends it to resignations. Retirement pay under Article 302 (RA 7641) only applies if the employee separately meets the age and service requirements to retire. Including either by default overstates what a resigning employee is legally owed.
              </p>

              {/* H2: worked example */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                A Worked Example
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                An employee earning ₱30,000/month resigns effective October 15, having worked from January 1 with 3 unused SIL days and no other convertible leave:
              </p>
              <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Component</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Computation</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { c: "Unpaid salary (Oct 1-15)", calc: "₱30,000 ÷ 2", amt: "₱15,000" },
                      { c: "Pro-rated 13th month pay", calc: "(₱30,000 × 9.5 months) ÷ 12", amt: "₱23,750" },
                      { c: "Unused SIL conversion", calc: "(₱30,000 ÷ 26) × 3 days", amt: "₱3,462" },
                      { c: "Total final pay (before deductions)", calc: "", amt: "₱42,212" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i === 3 ? "rgba(255,193,7,0.06)" : (i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent") }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: i === 3 ? "700" : "500" }}>{row.c}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#6b7280", fontSize: "0.85rem" }}>{row.calc}</td>
                        <td style={{ padding: "0.75rem 1rem", color: i === 3 ? "hsl(38, 92%, 38%)" : "#374151", fontWeight: i === 3 ? "700" : "400", textAlign: "right" }}>{row.amt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem", fontSize: "0.9rem", color: "#6b7280" }}>
                From this total, the employer still nets out authorized deductions (unreturned assets, salary advances, outstanding loan balances) and applies the year-end withholding tax reconciliation, which can either add a refund or subtract an amount owed, before arriving at the amount actually released.
              </p>

              {/* H2: clearance */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Clearance and the &ldquo;No Clearance, No Final Pay&rdquo; Rule
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Requiring clearance before releasing final pay is standard practice and has been upheld by the Supreme Court (Milan v. NLRC, Solid Mills, Inc., G.R. No. 202961, February 4, 2015), which recognized an employer&apos;s right to withhold final pay until company property is returned, without treating it as a reduction of the employee&apos;s benefits.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                That right is not unlimited. Clearance procedures need to be reasonable, applied consistently, and documented, not used as an open-ended excuse to delay past the 30-day window. If a payroll cutoff falls after day 30, the employer is still expected to make a special run rather than wait for the next regular cycle.
              </p>

              {/* H2: COE */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Certificate of Employment: A Separate 3-Day Clock
              </h2>
              <p style={{ marginBottom: "2.5rem" }}>
                The same advisory also requires employers to issue a Certificate of Employment within 3 calendar days of an employee&apos;s request, free of charge and without any prejudicial remarks about the reason for separation. This applies even to current employees requesting one before they resign, and it runs on its own clock, independent of the 30-day final pay deadline.
              </p>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS tracks the 30-day final pay clock automatically.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  From the moment an offboarding is initiated, YAHSHUA HRIS computes pro-rated 13th month pay and unused leave conversion, and flags the release deadline, so final pay does not slip past the DOLE 30-day window.
                </p>
                <Link href="/blog/dole-compliance-requirements-philippines" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See the full DOLE compliance checklist for employers <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How many days does an employer have to release final pay after resignation?
                </h3>
                <p>
                  30 calendar days from the date of separation, under DOLE Labor Advisory No. 06, Series of 2020, unless a more favorable company policy, individual agreement, or CBA provides a shorter period.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Is separation pay included in final pay for a resigned employee?
                </h3>
                <p>
                  Generally, no. Separation pay under the Labor Code applies to authorized-cause terminations such as retrenchment, redundancy, closure, or disease, not to an employee who resigns voluntarily, unless a company policy, employment contract, or CBA specifically extends it to resignations.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What happens if an employer misses the 30-day deadline?
                </h3>
                <p>
                  The employee can file a complaint with the DOLE Regional, Provincial, or Field Office with jurisdiction over the workplace. Case law generally treats a late release beyond 30 days, without a documented, reasonable justification like an unresolved clearance issue, as grounds for a money claim.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Can an employer withhold final pay until company property is returned?
                </h3>
                <p>
                  Yes. The Supreme Court in Milan v. NLRC upheld an employer&apos;s right to require clearance, including the return of company property, before releasing final pay. The clearance process still needs to be reasonable and documented, not used to delay payment indefinitely.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How is pro-rated 13th month pay calculated for a resigned employee?
                </h3>
                <p>
                  Total basic salary actually earned from January 1 (or the employee&apos;s start date, if later) through the last day worked, divided by 12. It is based only on basic salary and excludes allowances or overtime unless company policy includes them.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published September 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Based on DOLE Labor Advisory No. 06, Series of 2020 (&ldquo;Guidelines on the Payment of Final Pay and Issuance of Certificate of Employment,&rdquo; issued January 31, 2020), Articles 94-96, 295 (formerly 285), 298-299, and 302 of the Labor Code as renumbered, Presidential Decree 851, and Milan v. NLRC, Solid Mills, Inc. (G.R. No. 202961, February 4, 2015). Rules on clearance, deductions, and deadlines can vary by company policy and CBA. Verify current requirements with DOLE or legal counsel before finalizing payroll decisions. This article does not constitute legal advice.
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
                  <Link href="/blog/dole-compliance-requirements-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    DOLE Compliance Requirements for Employers →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/13th-month-pay-computation-philippines-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    13th Month Pay Computation 2026: Formula and Calculator →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/sss-contribution-table-2026-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    2026 SSS, PhilHealth, and Pag-IBIG Contribution Rates →
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
              Stop computing final pay by hand at the last minute.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS calculates pro-rated 13th month pay and leave conversion automatically the moment offboarding starts, and tracks the 30-day release deadline for you.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=final_pay_computation"
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

export default FinalPayComputationArticle;
