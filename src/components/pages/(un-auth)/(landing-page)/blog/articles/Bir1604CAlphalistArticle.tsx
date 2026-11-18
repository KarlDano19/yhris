import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import { bir1604cFaqs } from "@/lib/blogFaqs";

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const th = { padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" } as const;
const tableWrap = { overflowX: "auto", marginBottom: "1.5rem" } as const;
const table = { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" } as const;
const link = { color: "hsl(var(--lp-primary))", fontWeight: 600 } as const;

const Bir1604CAlphalistArticle = () => {
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
                Statutory Compliance
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-6" style={{ lineHeight: "1.25" }}>
                BIR Form 1604-C and the Alphalist: Your January 2027 Filing Checklist
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                BIR Form 1604-C is the Annual Information Return of Income Taxes Withheld on Compensation, and the alphalist of employees is its attachment. For compensation paid in 2026, both are due on or before January 31, 2027. That date is a Sunday, so plan to submit by Friday, January 29. Missing the alphalist costs ₱1,000 for each failure, up to ₱25,000 a year.
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

        {/* Article Body */}
        <article className="py-16">
          <div className="lp-section-container max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none" style={{ color: "#374151", lineHeight: "1.8" }}>

              {/* Verification callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Last verified: November 18, 2026.</strong> The dates here follow the standing deadlines in the Tax Code and Revenue Memorandum Circular No. 55-2026, issued May 26, 2026. Check the BIR website for the current alphalist module and any advisory before you file.
                </p>
              </div>

              {/* H2: What is it */}
              <h2 style={h2}>What Is BIR Form 1604-C?</h2>
              <p style={{ marginBottom: "1rem" }}>
                Every employer or withholding agent that withholds tax on compensation files BIR Form 1604-C once a year. It summarizes the income tax withheld from employees during the year. The alphalist is the attachment: a list of each employee with the compensation paid and the tax withheld, which should agree with each employee&apos;s BIR Form 2316.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                The three annual information returns share the same logic and differ by the kind of withholding they report:
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Form</th>
                      <th style={{ ...th, textAlign: "left" }}>Reports</th>
                      <th style={{ ...th, textAlign: "left" }}>Due for 2026</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { f: "BIR Form 1604-C", r: "Tax withheld on compensation", d: "January 31, 2027" },
                      { f: "BIR Form 1604-F", r: "Income payments subject to final withholding tax", d: "January 31, 2027" },
                      { f: "BIR Form 1604-E", r: "Creditable (expanded) income taxes withheld", d: "March 1, 2027" },
                    ].map((row, i) => (
                      <tr key={row.f} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.f}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.r}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem" }}>
                The alphalist is due on the same date as the return it supports. This summary of Revenue Memorandum Circular No. 55-2026 comes from PwC Philippines.
              </p>

              {/* H2: When */}
              <h2 style={h2}>When Is the BIR Form 1604-C Due for 2026?</h2>
              <p style={{ marginBottom: "1rem" }}>
                On or before <strong style={{ color: "#111827" }}>January 31, 2027</strong>. That is a Sunday. Grant Thornton&apos;s FY2026 tax calendar lists deadlines that land on a weekend as the last day for filing, e-filing and e-payment, for example Saturday, October 31, 2026. Treat Sunday, January 31 as the last possible day and aim for Friday, January 29, so a portal problem or a validation error does not decide the deadline for you.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                A sensible working timeline:
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>When</th>
                      <th style={{ ...th, textAlign: "left" }}>What</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { w: "December 2026 payroll", t: "Annualize withholding tax in the last payroll of the year, or in the last month of employment" },
                      { w: "Early January 2027", t: "Reconcile the 12 monthly BIR Form 1601-C returns with the payroll register and build the alphalist" },
                      { w: "By January 29, 2027", t: "Validate the file with the BIR module and submit the return and alphalist" },
                      { w: "By January 31, 2027", t: "Legal deadline. Give each employee a BIR Form 2316, or earlier on the last payment of wages" },
                    ].map((row, i) => (
                      <tr key={row.w} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.w}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.t}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem" }}>
                The December BIR Form 1601-C also falls in January. Its schedule is in our{" "}
                <Link href="/blog/q4-payroll-compliance-deadlines-philippines-2026" style={link}>Q4 compliance countdown</Link>, and the annualization step is explained in the{" "}
                <Link href="/blog/year-end-tax-annualization-philippines-2026" style={link}>year-end tax annualization guide</Link>.
              </p>

              {/* H2: What goes in */}
              <h2 style={h2}>What Goes Into the Alphalist of Employees</h2>
              <p style={{ marginBottom: "1rem" }}>
                BIR Form 1604-C carries two alphalists: the alphalist of employees and the alphalist of minimum wage earners. According to the BIR&apos;s published alphalist format, each employee line shows:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}>Taxpayer Identification Number and name</li>
                <li style={{ marginBottom: "0.5rem" }}>Compensation for the year, split into non-taxable (exempt) and taxable parts</li>
                <li style={{ marginBottom: "0.5rem" }}>The previous employer&apos;s figures for employees who joined during the year</li>
                <li style={{ marginBottom: "0.5rem" }}>Tax due for the year, tax withheld from January to November, and the year-end adjustment</li>
                <li style={{ marginBottom: "0.5rem" }}>The 5% tax credit under the Personal Equity and Retirement Account (PERA) Act, which the revised format added</li>
                <li style={{ marginBottom: "0.5rem" }}>Whether the employee qualified for substituted filing</li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                For minimum wage earners, the format has a separate schedule that lists the exempt items: overtime pay, night shift differential, hazard pay, 13th month pay and other benefits, de minimis benefits, and the employee share of SSS, GSIS, PhilHealth and Pag-IBIG contributions and union dues. For the benefits that qualify as de minimis, see our guide to{" "}
                <Link href="/blog/de-minimis-benefits-2026-philippines" style={link}>de minimis benefits in 2026</Link>.
              </p>

              {/* H2: How to submit */}
              <h2 style={h2}>How to Submit the Alphalist to the BIR</h2>
              <p style={{ marginBottom: "1rem" }}>
                Revenue Memorandum Circular No. 55-2026 lists three ways to submit an alphalist, according to the PwC summary:
              </p>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.5rem" }}>As an attachment in the Electronic Filing and Payment System (eFPS).</li>
                <li style={{ marginBottom: "0.5rem" }}>Through electronic submission (eSubmission) to esubmission@bir.gov.ph.</li>
                <li style={{ marginBottom: "0.5rem" }}>By email to the dedicated BIR email addresses, using the data entry module.</li>
              </ol>
              <p style={{ marginBottom: "2.5rem" }}>
                Validate the file first with the Alphalist Data Entry and Validation Module, which you download from the BIR website. The BIR has moved the alphalist deadline before when a new module version came out late, for example to March 17, 2024 for the 2023 alphalist, but that was a one-off extension. Do not plan around one.
              </p>

              {/* H2: Penalties */}
              <h2 style={h2}>Penalties for a Late or Missing Alphalist</h2>
              <p style={{ marginBottom: "1rem" }}>
                Section 250 of the Tax Code charges ₱1,000 for each failure to file, keep or supply a required information return, statement or list. The total for all such failures in a calendar year is capped at ₱25,000. The penalty does not apply when the failure is due to reasonable cause and not willful neglect.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Revenue Memorandum Order No. 7-2015, as PwC summarizes it, treats two cases as willful failure that cannot be compromised: not submitting the annual alphalist for at least two consecutive years, and submitting it in the wrong format. PwC also notes that the BIR keeps strengthening its data matching, so the alphalist has to agree with the returns you filed during the year.
              </p>

              {/* H2: Checklist */}
              <h2 style={h2}>Year-End Checklist for the BIR Form 1604-C</h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.5rem" }}>Reconcile the compensation and tax withheld on the 12 monthly BIR Form 1601-C returns with the payroll register and the books.</li>
                <li style={{ marginBottom: "0.5rem" }}>Annualize every employee&apos;s withholding tax in December, or in the last month of employment for leavers.</li>
                <li style={{ marginBottom: "0.5rem" }}>Collect the previous employer&apos;s BIR Form 2316 from every employee who joined mid-year.</li>
                <li style={{ marginBottom: "0.5rem" }}>Check each TIN and name, and separate the minimum wage earners.</li>
                <li style={{ marginBottom: "0.5rem" }}>Issue BIR Form 2316 to each employee by January 31, or on the last payment of wages for leavers, as in the{" "}
                  <Link href="/blog/employee-offboarding-checklist-philippines" style={link}>offboarding checklist</Link>.</li>
                <li style={{ marginBottom: "0.5rem" }}>Validate the alphalist with the BIR module, submit by January 29, and keep the acknowledgement.</li>
              </ol>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS comes with YAHSHUA One Payroll, which computes BIR withholding tax, SSS, PhilHealth and Pag-IBIG contributions.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Book a free demo and ask what year-end tax reports your team can export for the BIR Form 1604-C.
                </p>
                <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See how YAHSHUA handles year-end payroll <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
              {bir1604cFaqs.map((f, i) => (
                <div key={f.q} style={{ marginBottom: i === bir1604cFaqs.length - 1 ? "3rem" : "2rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published November 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Sources:{" "}
                  <a href="https://www.pwc.com/ph/en/tax/tax-publications/taxwise-or-otherwise/2026/rmc-no-55-2026-every-tax-return-has-a-story.html" target="_blank" rel="noopener noreferrer">PwC Philippines, RMC No. 55-2026</a>;{" "}
                  <a href="https://bir-cdn.bir.gov.ph/local/pdf/1604C%20Alphalist%20Format%20-%20final.pdf" target="_blank" rel="noopener noreferrer">BIR 1604-C alphalist format</a>;{" "}
                  <a href="https://www.grantthornton.com.ph/contentassets/92857c319d754f769858c999d2d00c04/tax-calendar-2026.pdf" target="_blank" rel="noopener noreferrer">Grant Thornton tax calendar FY2026</a>;{" "}
                  <a href="https://www.grantthornton.com.ph/alerts-and-publications/technical-alerts/tax-alert/2023/availability-of-the-revised-format-for-alphalist-of-employees" target="_blank" rel="noopener noreferrer">Grant Thornton on RMC No. 160-2022</a>; Section 250 of the National Internal Revenue Code. Verified November 18, 2026. This article does not constitute legal or tax advice.
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
                  <Link href="/blog/year-end-tax-annualization-philippines-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Year-End Tax Annualization for Philippine Employers →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/q4-payroll-compliance-deadlines-philippines-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Your Q4 Compliance Countdown →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/employee-offboarding-checklist-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Employee Offboarding Checklist: From Resignation to Final Pay →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/de-minimis-benefits-2026-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    De Minimis Benefits 2026: New BIR Ceilings →
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
              Get year-end payroll ready before January.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Book a free demo and ask how YAHSHUA HRIS and Payroll handles BIR withholding tax for your team.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=bir_1604c_alphalist_2026"
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

export default Bir1604CAlphalistArticle;
