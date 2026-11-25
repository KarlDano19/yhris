import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import { pagibigFaqs } from "@/lib/blogFaqs";

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const th = { padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" } as const;
const tableWrap = { overflowX: "auto", marginBottom: "1.5rem" } as const;
const table = { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" } as const;
const link = { color: "hsl(var(--lp-primary))", fontWeight: 600 } as const;

// Pag-IBIG: employee 1% up to PHP 1,500 and 2% above; employer 2%; salary base capped at PHP 10,000 (HDMF Circular No. 460).
const peso = (n: number) => "₱" + n.toLocaleString("en-US");
const EMPLOYEE_CAP = 10000;
const share = (salary: number, rate: number) => Math.min(salary, EMPLOYEE_CAP) * rate;

const salaryRows = [
  { label: "₱1,500 and below", salary: 1500, empRate: 0.01, empLabel: "1%" },
  { label: "₱3,000", salary: 3000, empRate: 0.02, empLabel: "2%" },
  { label: "₱5,000", salary: 5000, empRate: 0.02, empLabel: "2%" },
  { label: "₱8,000", salary: 8000, empRate: 0.02, empLabel: "2%" },
  { label: "₱10,000", salary: 10000, empRate: 0.02, empLabel: "2%" },
  { label: "₱15,000", salary: 15000, empRate: 0.02, empLabel: "2% of ₱10,000" },
  { label: "₱25,000", salary: 25000, empRate: 0.02, empLabel: "2% of ₱10,000" },
  { label: "₱50,000 and above", salary: 50000, empRate: 0.02, empLabel: "2% of ₱10,000" },
].map((r) => {
  const e = share(r.salary, r.empRate);
  const er = share(r.salary, 0.02);
  return { ...r, e: peso(e), er: peso(er), total: peso(e + er) };
});

const PagibigContributionTable2026Article = () => {
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
                Pag-IBIG Contribution Table 2026: Rate, ₱10,000 Cap and Employer Share
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Pag-IBIG contribution table 2026: the employee pays 2% of monthly compensation and the employer pays 2%, on a salary base capped at ₱10,000. That makes the maximum ₱200 from the employee and ₱200 from the employer, ₱400 a month in total. The cap has been ₱10,000 since February 2024. The employer remittance schedule changed in August 2026.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>November 2026</span>
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
              src="/blog/pagibig-contribution-table-2026-philippines.png"
              alt="Pag-IBIG contribution table 2026 for Philippine employers"
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

              {/* Verification callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Last verified: November 25, 2026.</strong> The rates and the ₱10,000 cap come from Republic Act No. 9679 and HDMF Circular No. 460 (signed January 15, 2024, effective February 2024). The remittance schedule comes from HDMF Circular No. 499, series of 2026, effective August 21, 2026. We found no newer circular that changes the rates or the cap. Confirm against the current Pag-IBIG issuance before you change payroll settings.
                </p>
              </div>

              {/* H2: Table */}
              <h2 style={h2}>Pag-IBIG Contribution Table 2026 by Salary</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Employees earning more than ₱1,500 a month contribute 2% of their monthly compensation, and employees earning ₱1,500 or less contribute 1%. The employer contributes 2% at every salary level. Both shares are computed on a base of at most ₱10,000, so everyone earning ₱10,000 or more has the same ₱200 deducted. Searchers also write it as the Pagibig contribution table, and it is the same schedule.
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Monthly compensation</th>
                      <th style={{ ...th, textAlign: "left" }}>Employee rate</th>
                      <th style={{ ...th, textAlign: "right" }}>Employee share</th>
                      <th style={{ ...th, textAlign: "right" }}>Employer share (2%)</th>
                      <th style={{ ...th, textAlign: "right" }}>Total credited</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryRows.map((row, i) => (
                      <tr key={row.label} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.label}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.empLabel}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.e}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.er}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem" }}>
                The ₱1,500 row uses the 1% employee rate, so the employee pays ₱15 and the employer pays ₱30. For the other two government contributions on the same payroll run, see the{" "}
                <Link href="/blog/sss-contribution-table-2026-philippines" style={link}>SSS contribution table for 2026</Link> and the{" "}
                <Link href="/blog/philhealth-contribution-table-2026-philippines" style={link}>PhilHealth contribution table for 2026</Link>.
              </p>

              {/* H2: Compute */}
              <h2 style={h2}>How to Compute the Pag-IBIG Contribution</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Cap the monthly compensation at ₱10,000, then apply 2% for the employee and 2% for the employer. The most common mistake is applying 2% to the full salary. Three examples:
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Case</th>
                      <th style={{ ...th, textAlign: "left" }}>Base used</th>
                      <th style={{ ...th, textAlign: "right" }}>Employee share</th>
                      <th style={{ ...th, textAlign: "right" }}>Employer share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { c: "₱35,000 monthly salary", b: "₱10,000 (the cap)", e: "₱200", r: "₱200" },
                      { c: "₱8,000 monthly salary", b: "₱8,000", e: "₱160", r: "₱160" },
                      { c: "₱1,200 monthly pay", b: "₱1,200", e: "₱12 (1%)", r: "₱24 (2%)" },
                    ].map((row, i) => (
                      <tr key={row.c} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.c}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.b}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.e}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem" }}>
                For a team of 50 employees who all earn ₱10,000 or more, the employer share is 50 × ₱200 = ₱10,000 a month (₱120,000 a year), and the same ₱10,000 is deducted from employees, so ₱20,000 is remitted each month.
              </p>

              {/* H2: Who pays */}
              <h2 style={h2}>Who Pays the Pag-IBIG Contribution</h2>
              <p style={{ marginBottom: "1rem" }}>
                Coverage is mandatory for employees covered by the SSS or the GSIS, and for their employers, under Section 6 of Republic Act No. 9679. The employer deducts the employee share from pay and adds its own 2% counterpart.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                The employer share is the employer&apos;s own cost. Section 7 of the law says the employer cannot deduct it, directly or indirectly, from the employee&apos;s compensation, so a payslip that shows ₱400 withheld for Pag-IBIG on a ₱10,000 or higher salary is wrong. Members may contribute more than ₱200 on their own. The employer&apos;s counterpart stays at the fixed computation, though an employer may choose to match a higher amount.
              </p>

              {/* H2: Compensation */}
              <h2 style={h2}>What Counts as Monthly Compensation</h2>
              <p style={{ marginBottom: "2.5rem" }}>
                Circular No. 460 defines the Fund Salary broadly, as the remuneration or earnings of the employee, however designated, that can be expressed in money, whether fixed or computed on a time, task, piece or commission basis. In practice the exact definition rarely changes the result, because once an employee&apos;s pay reaches ₱10,000 the contribution is already at the ₱200 maximum. It matters only for employees paid below ₱10,000 a month, where the 2% applies to their actual pay.
              </p>

              {/* H2: Due dates */}
              <h2 style={h2}>When Is the Pag-IBIG Remittance Due in 2026?</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                HDMF Circular No. 499, series of 2026, took effect on August 21, 2026 and replaced the remittance schedule in HDMF Circular No. 275. The new due dates depend on the first letter of the employer&apos;s name and fall in the month after the period covered:
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Employer name starts with</th>
                      <th style={{ ...th, textAlign: "left" }}>Pay on</th>
                      <th style={{ ...th, textAlign: "left" }}>Example: November 2026 contributions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { d: "A to F", w: "1st to 7th of the following month", x: "December 1 to 7, 2026" },
                      { d: "G to N", w: "5th to 11th of the following month", x: "December 5 to 11, 2026" },
                      { d: "O to Z, numbers and special characters", w: "9th to 15th of the following month", x: "December 9 to 15, 2026" },
                    ].map((row, i) => (
                      <tr key={row.d} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.d}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.w}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.x}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "1rem" }}>
                Many guides still show the old schedule under Circular No. 275 (A to D on the 10th to 14th, E to L on the 15th to 19th, and so on). Circular No. 499 amends and supersedes it, so check the date against the table above and against the Statement of Account in your Virtual Pag-IBIG for Employers account. If the due date falls on a non-working day or a day when work is suspended, the employer remits on the next working day.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Circular No. 499 also makes the Electronic Submission of Remittance Schedule (eSRS) mandatory for all registered employers, through Virtual Pag-IBIG for Employers. Employers submit the schedule with each employee&apos;s salary details and pay through an accredited collecting partner. For six months from the effectivity date, until about late February 2027 unless Pag-IBIG extends it, employers may still pay over the counter at Pag-IBIG branches. After that, the employer must get a Payment Reference Number from eSRS before paying.
              </p>
              <p style={{ marginBottom: "2.5rem", fontSize: "0.9rem", color: "#6b7280" }}>
                The A to F and G to N windows are as Pag-IBIG announced them, reported by the Philippine Information Agency. The O to Z window is from a legal update summarizing Circular No. 499. Confirm all three in your Virtual Pag-IBIG account.
              </p>

              {/* H2: Late */}
              <h2 style={h2}>What Happens If You Pay Late</h2>
              <p style={{ marginBottom: "1rem" }}>
                Circular No. 499 charges a penalty of 1/10 of 1% per day of delay on the amount due, starting the day after the due date until the day of full payment. That is about 3% a month. Late payment does not cancel the member&apos;s benefits: the employer stays liable, and the member keeps their rights under the Pag-IBIG Fund law.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Delinquent employers should ask their Pag-IBIG branch to compute the arrears, then pay the amount and the penalty through an accredited collecting partner. The penalty rates and worked costs for all three agencies are in our{" "}
                <Link href="/blog/sss-philhealth-pagibig-late-remittance-penalties" style={link}>guide to SSS, PhilHealth and Pag-IBIG late remittance penalties</Link>.
              </p>

              {/* H2: Checklist */}
              <h2 style={h2}>Pag-IBIG Payroll Checklist for 2026</h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.5rem" }}>Set the employee rate to 2% (1% for pay of ₱1,500 or less), the employer rate to 2%, and the salary base cap to ₱10,000.</li>
                <li style={{ marginBottom: "0.5rem" }}>Deduct only the employee share. Never take the employer&apos;s 2% from the employee.</li>
                <li style={{ marginBottom: "0.5rem" }}>Enroll in eSRS through Virtual Pag-IBIG for Employers if you have not yet.</li>
                <li style={{ marginBottom: "0.5rem" }}>Look up your window by the first letter of your registered employer name and put it on the payroll calendar.</li>
                <li style={{ marginBottom: "0.5rem" }}>Reconcile the remittance schedule with the payroll register before you pay, and keep the payment confirmation.</li>
                <li style={{ marginBottom: "0.5rem" }}>Register every new hire with Pag-IBIG at onboarding. The steps are in our <Link href="/blog/new-hire-onboarding-checklist-philippines" style={link}>new hire onboarding checklist</Link>.</li>
              </ol>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS comes with YAHSHUA One Payroll, which computes SSS, PhilHealth and Pag-IBIG contributions.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Book a free demo and ask how it handles the ₱10,000 cap and rate changes across your payroll runs.
                </p>
                <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See how YAHSHUA handles contributions <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
              {pagibigFaqs.map((f, i) => (
                <div key={f.q} style={{ marginBottom: i === pagibigFaqs.length - 1 ? "3rem" : "2rem" }}>
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
                  Sources: Republic Act No. 9679 (Home Development Mutual Fund Law of 2009), Sections 6, 7 and 23;{" "}
                  <a href="https://www.pagibigfund.gov.ph/document/pdf/circulars/provident/Circular%20No.%20460%20-%20Guidelines%20on%20the%20Pag-IBIG%20Fund's%20Implementation%20of%20Increase%20in%20the%20MFS%20Effective%20February%202024.pdf" target="_blank" rel="noopener noreferrer">HDMF Circular No. 460</a>;{" "}
                  <a href="https://pia.gov.ph/news/pag-ibig-fund-calls-on-employers-to-shift-to-digital-remittances-via-esrs" target="_blank" rel="noopener noreferrer">Philippine Information Agency, Pag-IBIG Fund calls on employers to shift to digital remittances via eSRS</a>;{" "}
                  <a href="https://www.grantthornton.com.ph/technical-alerts/outsourcing-alert/2026/digitalization-of-employer-transactions-and-remittances-through-virtual-pag-ibig-via-the-electronic-submission-of-remittance-schedule-esrs-facility" target="_blank" rel="noopener noreferrer">Grant Thornton Philippines, HDMF Circular No. 499 summary</a>;{" "}
                  <a href="https://gselawfirm.com/wp-content/uploads/2026/09/GSE-Legal-Updates-Issue-8-s.-2026-August.pdf" target="_blank" rel="noopener noreferrer">GSE Law, Legal Updates August 2026</a>. Verified November 25, 2026. This article does not constitute legal or tax advice.
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
                  <Link href="/blog/philhealth-contribution-table-2026-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    PhilHealth Contribution Table 2026 →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/sss-philhealth-pagibig-late-remittance-penalties" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    SSS, PhilHealth and Pag-IBIG Late Remittance Penalties →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/payroll-registration-checklist-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Philippine Business Payroll Setup Checklist →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/q4-payroll-compliance-deadlines-philippines-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Your Q4 Compliance Countdown →
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
              Keep every statutory contribution on the right rate.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Book a free demo and ask how YAHSHUA HRIS and Payroll handles SSS, PhilHealth and Pag-IBIG for your team.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=pagibig_contribution_2026"
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

export default PagibigContributionTable2026Article;
