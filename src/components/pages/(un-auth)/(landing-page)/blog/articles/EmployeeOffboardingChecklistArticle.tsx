import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const h3 = { fontSize: "1.15rem", fontWeight: "700", color: "#111827", marginTop: "2rem", marginBottom: "0.75rem" } as const;
const th = { padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" } as const;
const tableWrap = { overflowX: "auto", marginBottom: "1.5rem" } as const;
const table = { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" } as const;
const rowStyle = (i: number) => ({ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" });
const link = { color: "hsl(var(--lp-primary))", fontWeight: 600 } as const;

const Tag = ({ required }: { required: boolean }) => (
  <span style={{ marginLeft: "0.4rem", fontSize: "0.75rem", fontWeight: 600, color: required ? "hsl(38, 92%, 38%)" : "#9ca3af" }}>
    {required ? "Required" : "Good practice"}
  </span>
);

const EmployeeOffboardingChecklistArticle = () => {
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
                Employee Offboarding Checklist for Philippine Employers: From Resignation to Final Pay
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Offboarding runs on a few hard deadlines and a lot of good practice. Here is the checklist, with the legal clocks marked so you can tell which steps the rules require and which are simply sensible.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>November 2026</span>
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
              src="/blog/employee-offboarding-checklist-philippines.png"
              alt="Employee offboarding checklist guide for Philippine employers"
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
                An offboarding checklist for Philippine employers runs on three legal clocks: 30 days&apos; written notice from a resigning employee (Labor Code Art. 300), a Certificate of Employment within 3 days of the employee&apos;s request, and final pay within 30 days of separation (DOLE Labor Advisory 06-20). BIR Form 2316 is due on the day of the last payment of compensation.
              </p>

              {/* Callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Notice and final pay are different clocks.</strong> The 30-day notice is what the employee owes before resigning. The 30-day final pay period starts at separation, after the last day of work. Mixing the two up is the most common offboarding error.
                </p>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2.5rem" }}>
                Most offboarding problems are not legal disputes. They are a missing clearance sign-off, a final pay that goes out late, or a Certificate of Employment nobody remembered to prepare. One checklist, owned by HR and run the same way every time, prevents most of them.
              </p>

              {/* H2: Legal clocks */}
              <h2 style={h2}>The Legal Clocks in an Employee Exit</h2>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Step</th>
                      <th style={{ ...th, textAlign: "left" }}>Deadline</th>
                      <th style={{ ...th, textAlign: "left" }}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: "Resignation notice", d: "Employee gives written notice at least one month (30 days) before the last day. The employer may waive or shorten it.", r: "Labor Code Art. 300(a), formerly Art. 285; Hechanova & Co., Inc. v. Matorre, G.R. No. 198261 (Oct. 16, 2013)" },
                      { s: "Certificate of Employment (COE)", d: "Within 3 days from the employee's request", r: "DOLE Labor Advisory No. 06, Series of 2020" },
                      { s: "Final pay", d: "Within 30 days from the date of separation, unless a more favorable company policy or agreement applies", r: "DOLE Labor Advisory No. 06, Series of 2020" },
                      { s: "BIR Form 2316", d: "On the day the last payment of compensation is made, when employment ends before year-end", r: "RR No. 2-98 Sec. 2.83.1, as amended by RR No. 11-2018" },
                    ].map((row, i) => (
                      <tr key={i} style={rowStyle(i)}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.s}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.d}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem" }}>
                Final pay is usually the last payment of compensation, so for most exits the Form 2316 is due the day final pay is released. Plan the year-to-date tax computation before that date, not after it.
              </p>

              {/* H2: Checklist */}
              <h2 style={h2}>Offboarding Checklist by Stage</h2>
              <p style={{ marginBottom: "1rem" }}>
                Items tagged Required come from the rules above. The rest are good practice, so adapt them to your company.
              </p>

              <h3 style={h3}>Before the last day</h3>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Receive the resignation in writing.</strong> Log the date received and the intended last day.<Tag required /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Decide on the notice period and confirm it in writing.</strong> Accept the full 30 days, shorten it, or waive it. State the agreed last day so nobody disputes when the final pay clock starts.<Tag required={false} /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Plan the handover.</strong> List open tasks, files, client contacts, and any accounts or passwords the employee holds.<Tag required={false} /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Pull the leave balance, loans, and advances.</strong> Having these early lets you compute final pay before the last day.<Tag required={false} /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Schedule the clearance sign-offs and exit interview.</strong><Tag required={false} /></li>
              </ol>

              <h3 style={h3}>On the last day</h3>
              <ol start={6} style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Collect company property.</strong> Laptop, ID, keys, uniform. Record each item returned, because a clearance hold is only as strong as its paperwork.<Tag required={false} /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Remove system access.</strong> Email, HRIS and payroll accounts, shared drives, and building access. Reassign ownership of files and mailboxes.<Tag required={false} /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Collect the clearance sign-offs</strong> from each department.<Tag required={false} /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Hold the exit interview</strong> and file the notes.<Tag required={false} /></li>
              </ol>

              <h3 style={h3}>After the last day</h3>
              <ol start={10} style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Compute final pay.</strong> Typically unpaid salary, pro-rated 13th month pay, convertible unused leave, and any tax refund, less lawful deductions. See our guide to{" "}
                  <Link href="/blog/final-pay-computation-philippines" style={link}>final pay computation</Link>.<Tag required />
                </li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Release final pay within 30 days of separation.</strong><Tag required /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Issue the COE within 3 days of the request.</strong> The employee can ask before leaving, so have a template ready.<Tag required /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Issue BIR Form 2316</strong> on the day of the last payment of compensation, after the year-to-date tax computation.<Tag required /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Close the 201 file.</strong> Add the resignation letter, clearance, final pay computation and proof of payment, COE, and a copy of the 2316, then start the retention clock.<Tag required={false} /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Update your systems.</strong> End-date the employee, stop recurring pay, and archive the record.<Tag required={false} /></li>
              </ol>
              <p style={{ marginBottom: "2.5rem" }}>
                Labeling each step Required or Good practice helps when a manager asks why a step exists. The deadlines are not negotiable, and the rest can follow your own policy.
              </p>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  Keep the exit paperwork with the rest of the file.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  YAHSHUA HRIS keeps each employee&apos;s 201 file in one place, so the contract, leave records, and clearance papers are together when someone leaves. YAHSHUA Payroll is included and computes SSS, PhilHealth, Pag-IBIG, and BIR withholding and generates payslips.
                </p>
                <Link href="/blog/final-pay-computation-philippines" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See how final pay is computed <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* H2: Resignation vs termination */}
              <h2 style={h2}>Resignation vs Termination: What Changes</h2>
              <p style={{ marginBottom: "1rem" }}>
                The checklist above is written for a resignation. The other exits change the front end, not the back end.
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Resignation.</strong> The employee serves 30 days&apos; written notice under Article 300(a). The employee may leave without notice for the just causes in Article 300(b), such as serious insult or inhuman and unbearable treatment by the employer. An employer who received no notice may hold the employee liable for damages.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Dismissal for just cause.</strong> The employer generally has to follow procedural due process, the twin-notice rule: a notice to explain, then a notice of decision.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Authorized causes</strong> such as redundancy, retrenchment, or closure. The Labor Code requires written notice to the employee and to DOLE at least one month before the effective date, and separation pay depends on the cause.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Retirement.</strong> See our guide to{" "}
                  <Link href="/blog/retirement-pay-law-ra-7641-philippines" style={link}>retirement pay under RA 7641</Link>.
                </li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                In each case the final pay, COE, and Form 2316 clocks generally still apply once employment ends. For a dismissal, take extra care and confirm the procedure before you act.
              </p>

              {/* H2: Clearance */}
              <h2 style={h2}>Clearance: What You Can Hold and What You Should Not</h2>
              <p style={{ marginBottom: "1rem" }}>
                Requiring clearance before releasing final pay is accepted practice. In <em>Milan v. NLRC</em> (G.R. No. 202961, February 4, 2015), the Supreme Court recognized an employer&apos;s right to require clearance procedures.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Because DOLE&apos;s advisory sets 30 days from separation, keep the clearance process reasonable, documented, and finished well inside that window. Do not tie the COE to clearance: its 3 days run from the employee&apos;s request. The full treatment is in our{" "}
                <Link href="/blog/final-pay-computation-philippines" style={link}>final pay guide</Link>.
              </p>

              {/* H2: Records */}
              <h2 style={h2}>Records to Keep After Offboarding</h2>
              <p style={{ marginBottom: "2.5rem" }}>
                Closing a file is not the same as discarding it. DOLE rules require employment records such as payrolls and time records to be preserved at least three years from the last entry, and the Data Privacy Act limits keeping personal data longer than necessary. What to keep, for how long, and where privacy law pushes back is covered in our guide to the{" "}
                <Link href="/blog/employee-201-file-philippines" style={link}>employee 201 file</Link>.
              </p>

              {/* H2: Mistakes */}
              <h2 style={h2}>Common Offboarding Mistakes</h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Starting the final pay clock at the notice date.</strong> The 30 days run from separation.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Waiving notice verbally.</strong> If you shorten the notice, put the agreed last day in writing.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Leaving Form 2316 until January.</strong> For someone who leaves mid-year it is due when the last compensation is paid.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Leaving access open.</strong> Accounts that stay active after the last day are a data privacy risk.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Not recording property returns.</strong> Without a record, a clearance hold is hard to defend.</li>
              </ul>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How long does an employer have to release final pay in the Philippines?
                </h3>
                <p>
                  Within 30 days from the date of separation or termination, under DOLE Labor Advisory No. 06, Series of 2020, unless a more favorable company policy, individual agreement, or CBA applies. The 30 days start at separation, not at the resignation notice.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How many days&apos; notice must an employee give before resigning?
                </h3>
                <p>
                  At least one month (30 days) in advance, in writing, under Article 300 of the Labor Code. The employer may waive or shorten the period, and the employee may leave without notice for the just causes in Article 300(b), such as serious insult or inhuman and unbearable treatment by the employer. An employer who received no notice may hold the employee liable for damages.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Can an employer withhold final pay until the employee completes clearance?
                </h3>
                <p>
                  Employers may require a reasonable clearance process. The Supreme Court recognized this right in Milan v. NLRC (G.R. No. 202961, February 4, 2015). Keep the process documented and finish it well within the 30-day final pay period, because DOLE&apos;s advisory sets 30 days from separation.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  When must an employer issue a Certificate of Employment?
                </h3>
                <p>
                  Within 3 days from the employee&apos;s request, under DOLE Labor Advisory No. 06, Series of 2020. The clock runs from the request, and the employee can ask before leaving.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  When must a resigning employee receive BIR Form 2316?
                </h3>
                <p>
                  On the day the last payment of compensation is made, if employment ends before the close of the calendar year, under Revenue Regulations No. 2-98 as amended by RR No. 11-2018. Employees still employed at year-end receive it by January 31 of the following year.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published November 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Based on Articles 298 to 300 of the Labor Code, DOLE Labor Advisory No. 06, Series of 2020, Revenue Regulations No. 2-98 as amended by RR No. 11-2018, Milan v. NLRC (G.R. No. 202961), and Hechanova &amp; Co., Inc. v. Matorre (G.R. No. 198261). This article is general information. Rules and advisories can change, so do your own due diligence and confirm the current requirements with DOLE and the BIR, or with counsel if you choose, before applying them to a specific separation. It does not constitute legal advice.
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
                  <Link href="/blog/employee-201-file-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    What Belongs in an Employee 201 File, and How Long to Keep It →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/retirement-pay-law-ra-7641-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Retirement Pay Law (RA 7641) in the Philippines →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/dole-compliance-requirements-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    DOLE Compliance Requirements Every Philippine Employer Must Know in 2026 →
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
              Still tracking exits in spreadsheets and email threads?
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Book a free demo and see how YAHSHUA HRIS and Payroll keeps employee records in one place.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=employee_offboarding_checklist"
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

export default EmployeeOffboardingChecklistArticle;
