import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const th = { padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" } as const;
const tableWrap = { overflowX: "auto", marginBottom: "1.5rem" } as const;
const table = { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" } as const;
const rowStyle = (i: number) => ({ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" });

const Employee201FileArticle = () => {
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
                What Belongs in an Employee 201 File, and How Long You Are Required to Keep It
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                The law does not hand you a checklist for a 201 file, but it does set clocks on the records inside it. Here is what to put in, what the rules say about keeping it, and where privacy law pushes back.
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
                A 201 file is an employee&apos;s record folder: hiring papers, government IDs, contracts, evaluations, and separation documents. DOLE rules do not prescribe a standard 201 file, but they require employment records such as payrolls and time records to be kept at least three years from the last entry, and tax law requires books of accounts to be kept five years.
              </p>

              {/* Callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Three years is a floor, not a schedule.</strong> The Labor Code gives employees three years to file money claims, so records that would defend a claim are worth keeping at least that long. Privacy law pulls the other way, so decide on a retention period, write it down, and delete or anonymize when it ends.
                </p>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2.5rem" }}>
                Most employers learn how complete their 201 files are during a DOLE inspection, a claim, or an audit. By then, a missing contract or an unsigned standards sheet is hard to recreate.
              </p>

              {/* H2: What belongs */}
              <h2 style={h2}>What Belongs in an Employee 201 File</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                There is no statutory list, so this is standard HR practice. The first three groups are the ones that settle most disputes.
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Group</th>
                      <th style={{ ...th, textAlign: "left" }}>Typical contents</th>
                      <th style={{ ...th, textAlign: "left" }}>Why it matters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { g: "Hiring", c: "Application, resume, interview notes, job offer, background and medical clearances", w: "Shows what the employee was hired to do and on what terms." },
                      { g: "Employment terms", c: "Signed contract, job description, regularization standards, policy acknowledgments", w: "Proves the start date, the role, and that standards were explained at hiring." },
                      { g: "Government registration", c: "TIN, SSS, PhilHealth, and Pag-IBIG numbers, tax and contribution forms", w: "Supports remittances and the employee's tax and benefit records." },
                      { g: "Pay and attendance", c: "Payroll entries, time records, leave records, loan and deduction authorizations", w: "Payrolls and time records are among the records DOLE rules require employers to keep." },
                      { g: "Performance and discipline", c: "Evaluations, commendations, memos, notices to explain, and decisions", w: "Shows the process followed if the employment later ends." },
                      { g: "Separation", c: "Resignation or termination papers, clearance, quitclaim, final pay computation", w: "Closes the file and supports the final pay record." },
                    ].map((row, i) => (
                      <tr key={i} style={rowStyle(i)}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.g}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.c}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.w}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem" }}>
                Keep medical results and other sensitive documents in a restricted part of the file, with access limited to the people who need them. Collect only what the role requires.
              </p>

              {/* H2: What the rules require */}
              <h2 style={h2}>How Long You Must Keep It: What the Rules Say</h2>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Record</th>
                      <th style={{ ...th, textAlign: "left" }}>Source</th>
                      <th style={{ ...th, textAlign: "left" }}>Minimum period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { r: "Employment records required by DOLE rules (payrolls, daily time records, production records for output-based workers)", s: "Omnibus Rules Implementing the Labor Code, Book III, Rule X, Section 12", p: "At least 3 years from the date of the last entry in the record" },
                      { r: "Records that defend a money claim by an employee", s: "Article 306 of the Labor Code (formerly Article 291)", p: "Money claims prescribe in 3 years, so keep the supporting records at least that long" },
                      { r: "Books of accounts and other accounting records", s: "Section 235 of the Tax Code, as amended by RA 11976 (Ease of Paying Taxes Act)", p: "5 years, counted from the day after the filing deadline of the return for that taxable year" },
                      { r: "Personal data of employees and applicants", s: "Data Privacy Act of 2012", p: "No longer than necessary for the purpose it was collected, for legal claims, or as the law requires" },
                    ].map((row, i) => (
                      <tr key={i} style={rowStyle(i)}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.r}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.s}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "1rem" }}>
                The practical reading is that the longest applicable period governs each record. A payroll register supports both your DOLE records and your accounting entries, so it is generally kept for the longer period. Ask your accountant which of your payroll records form part of your books.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                The DOLE rules also say employment records are kept in or about the workplace, meaning the main or branch office where the employee is regularly assigned, and they make it unlawful to put a false statement in a required record. Those rules were written before cloud systems, so if you keep records electronically or centrally, confirm with DOLE how that works with your branches.
              </p>

              {/* H2: Privacy */}
              <h2 style={h2}>Where Privacy Law Pushes Back</h2>
              <p style={{ marginBottom: "1rem" }}>
                A 201 file is full of personal data, including some sensitive data such as health information and government ID numbers. Under the Data Privacy Act, processing must follow three principles: transparency, legitimate purpose, and proportionality. Two things follow in practice:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Do not keep everything forever.</strong> Once a retention period ends and no claim or legal obligation needs the record, delete it or remove anything that identifies the person.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Protect what you keep.</strong> Employers must apply reasonable and appropriate organizational, physical, and technical security measures, which includes limiting who can open a file.</li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                The National Privacy Commission&apos;s guidance on employment records lists factors employers should weigh when choosing a retention period (NPC Advisory Opinion 2017-24). That is why a written retention schedule matters: it shows you chose each period for a reason.
              </p>

              {/* H2: Checklist */}
              <h2 style={h2}>A 201 File Checklist for HR</h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Standardize the checklist.</strong> Use one list per hire, covering the six groups above, and tick it off in the first week.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Get the signed standards and contract on day one,</strong> especially for probationary hires (see our guide to{" "}
                  <Link href="/blog/probationary-to-regular-employee-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>probationary to regular employees</Link>).
                </li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Restrict sensitive documents.</strong> Medical and ID records go in a separate section, visible only to named HR staff.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Write a retention schedule.</strong> List each record type, the period you keep it, and the reason. Start from the longest rule that applies.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Close the file at separation.</strong> Add the clearance, quitclaim, and final pay record (see{" "}
                  <Link href="/blog/final-pay-computation-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>final pay computation</Link>
                  ), then start the retention clock.
                </li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Log what you destroy.</strong> When a period ends, record what was deleted, when, and by whom.</li>
              </ol>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  Keep every employee&apos;s file in one place.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  YAHSHUA HRIS keeps each employee&apos;s 201 file in one place, from hire date to present, so the contract, the signed standards, and the records you will need later are on file together. YAHSHUA Payroll is included.
                </p>
                <Link href="/blog/payroll-registration-checklist-philippines" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See the payroll setup checklist for new employers <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is a 201 file?
                </h3>
                <p>
                  A 201 file is the folder of records an employer keeps for each employee, from the application and contract to evaluations and separation papers. It is standard HR practice rather than a form prescribed by law, but the records inside it, such as payrolls and time records, are covered by DOLE record-keeping rules.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What documents go in an employee 201 file?
                </h3>
                <p>
                  Typically the application and resume, signed contract and job description, government ID numbers and registration forms, payroll, time, and leave records, performance evaluations and disciplinary records, and separation documents such as clearance, quitclaim, and final pay computation. Keep sensitive items like medical results in a restricted section.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How long must employers keep employee records in the Philippines?
                </h3>
                <p>
                  DOLE rules require employment records to be preserved for at least three years from the date of the last entry. Books of accounts and other accounting records must be kept five years under the Tax Code as amended by the Ease of Paying Taxes Act. Because employees have three years to file money claims, many employers keep records that defend such claims at least that long.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Should an employer keep a 201 file after the employee resigns?
                </h3>
                <p>
                  Yes, for the required period. Add the clearance, quitclaim, and final pay record, then keep the required records at least three years from the last entry. After the retention period ends and no claim or legal obligation needs them, delete the records or remove anything that identifies the person.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Does the Data Privacy Act apply to 201 files?
                </h3>
                <p>
                  Yes. Employers are personal information controllers for employee data. Processing must follow transparency, legitimate purpose, and proportionality, personal data should not be kept longer than necessary, and employers must apply reasonable security measures such as limiting who can open a file.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published October 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Based on the Omnibus Rules Implementing the Labor Code (Book III, Rule X, Sections 6, 7, 10, 11, 12, and 13), Article 306 of the Labor Code, Section 235 of the Tax Code as amended by Republic Act No. 11976, the Data Privacy Act of 2012 (RA 10173) and its implementing rules, and NPC Advisory Opinion 2017-24. This article is general information. Retention rules differ by record and can change, so do your own due diligence and confirm the current rules with DOLE, the BIR, and the National Privacy Commission, or with counsel if you choose, before setting a retention schedule. It does not constitute legal advice.
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
                  <Link href="/blog/probationary-to-regular-employee-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Probationary to Regular: The 6-Month Regularization Timeline →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/final-pay-computation-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Final Pay Computation for Resigned Employees →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/dole-compliance-requirements-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    DOLE Compliance Requirements for Philippine Employers →
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
              Still keeping employee files in folders?
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Book a free demo and see how YAHSHUA HRIS and Payroll keeps employee records in one place.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=employee_201_file"
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

export default Employee201FileArticle;
