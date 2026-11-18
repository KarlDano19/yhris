import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import { philhealthFaqs } from "@/lib/blogFaqs";

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const th = { padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" } as const;
const tableWrap = { overflowX: "auto", marginBottom: "1.5rem" } as const;
const table = { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" } as const;
const link = { color: "hsl(var(--lp-primary))", fontWeight: 600 } as const;

const salaryRows = [
  { s: "₱10,000 and below", p: "₱500", e: "₱250", r: "₱250" },
  { s: "₱15,000", p: "₱750", e: "₱375", r: "₱375" },
  { s: "₱20,000", p: "₱1,000", e: "₱500", r: "₱500" },
  { s: "₱25,000", p: "₱1,250", e: "₱625", r: "₱625" },
  { s: "₱30,000", p: "₱1,500", e: "₱750", r: "₱750" },
  { s: "₱40,000", p: "₱2,000", e: "₱1,000", r: "₱1,000" },
  { s: "₱50,000", p: "₱2,500", e: "₱1,250", r: "₱1,250" },
  { s: "₱75,000", p: "₱3,750", e: "₱1,875", r: "₱1,875" },
  { s: "₱100,000 and above", p: "₱5,000", e: "₱2,500", r: "₱2,500" },
];

const PhilhealthContributionTable2026Article = () => {
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
                PhilHealth Contribution Table 2026: Rate, Floor, Ceiling and Employer Share
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                PhilHealth contribution table 2026: the premium is 5% of the monthly basic salary, shared equally, so the employer pays 2.5% and the employee pays 2.5%. The salary floor is ₱10,000 and the ceiling is ₱100,000, which makes the minimum premium ₱500 a month and the maximum ₱5,000. The rate is unchanged from 2025 and is the final scheduled rate under the Universal Health Care Act (RA 11223).
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
              src="/blog/philhealth-contribution-table-2026-philippines.png"
              alt="PhilHealth contribution table 2026: 5% rate, 10,000 floor and 100,000 ceiling"
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
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Last verified: November 18, 2026.</strong> The rate comes from the Philippine Information Agency&apos;s report of PhilHealth&apos;s May 6, 2026 advisory. The floor, ceiling and salary definition come from PhilHealth Advisory No. 2025-0002. Confirm figures against the current PhilHealth issuance before you change payroll settings.
                </p>
              </div>

              {/* H2: Table */}
              <h2 style={h2}>PhilHealth Contribution Table 2026 by Salary</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                For employed members, the monthly premium is 5% of the monthly basic salary, split evenly between the employee and the employer. A salary of ₱10,000 or below pays the fixed ₱500 minimum, and a salary of ₱100,000 or above pays the ₱5,000 maximum. Everything in between is 5% of the salary.
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Monthly basic salary</th>
                      <th style={{ ...th, textAlign: "right" }}>Total premium (5%)</th>
                      <th style={{ ...th, textAlign: "right" }}>Employee share (2.5%)</th>
                      <th style={{ ...th, textAlign: "right" }}>Employer share (2.5%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryRows.map((row, i) => (
                      <tr key={row.s} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.s}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.p}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.e}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem" }}>
                For a salary that is not in the table, multiply it by 5% and divide by two. The 2025 advisory sets the income floor at ₱10,000 and the income ceiling at ₱100,000, and the PIA report confirms the same figures for 2026. For the SSS side of the same payroll run, see the{" "}
                <Link href="/blog/sss-contribution-table-2026-philippines" style={link}>SSS contribution table for 2026</Link>.
              </p>

              {/* H2: Compute */}
              <h2 style={h2}>How to Compute the PhilHealth Premium</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Take the monthly basic salary, apply the floor and ceiling, multiply by 5%, then split the result in two. Three examples:
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Case</th>
                      <th style={{ ...th, textAlign: "left" }}>Salary used</th>
                      <th style={{ ...th, textAlign: "right" }}>Total premium</th>
                      <th style={{ ...th, textAlign: "right" }}>Each share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { c: "₱32,000 basic, plus ₱3,000 allowance and ₱2,000 overtime", s: "₱32,000 (basic only)", p: "₱1,600", e: "₱800" },
                      { c: "₱8,000 basic salary", s: "₱10,000 (the floor)", p: "₱500", e: "₱250" },
                      { c: "₱180,000 basic salary", s: "₱100,000 (the ceiling)", p: "₱5,000", e: "₱2,500" },
                    ].map((row, i) => (
                      <tr key={row.c} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.c}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.s}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.p}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.e}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* H2: What counts */}
              <h2 style={h2}>What Counts as Monthly Basic Salary</h2>
              <p style={{ marginBottom: "1rem" }}>
                PhilHealth Advisory No. 2025-0002 tells employers to use the monthly basic salary, which it defines as the fixed basic rate of the employee. The premium is not computed on:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}>Sales commissions</li>
                <li style={{ marginBottom: "0.5rem" }}>Overtime pay</li>
                <li style={{ marginBottom: "0.5rem" }}>Allowances</li>
                <li style={{ marginBottom: "0.5rem" }}>13th month pay</li>
                <li style={{ marginBottom: "0.5rem" }}>Bonuses and other gratuity payments</li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                The advisory also says that deductions for undertime, tardiness, leave without pay and absences are left out of the computation. In practice, the premium follows the fixed basic rate, not the pay actually received in a cutoff. That rule comes from the 2025 advisory, and the 2026 announcement keeps the same floor, ceiling and sharing, so check whether PhilHealth has issued a newer definition before you rely on it.
              </p>

              {/* H2: Who pays */}
              <h2 style={h2}>Who Pays the PhilHealth Premium</h2>
              <p style={{ marginBottom: "2.5rem" }}>
                For employed members, the premium is shared equally by the employee and the employer, so the employer deducts the employee half from salary and remits both halves. Self-paying members pay on their declared monthly income and carry the whole premium themselves, according to the PIA report on the 2026 advisory.
              </p>

              {/* H2: Due dates */}
              <h2 style={h2}>When Is the PhilHealth Remittance Due in 2026?</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Employers pay in the month after the applicable period. The window depends on the last digit of the PhilHealth Employer Number (PEN):
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>PEN ends in</th>
                      <th style={{ ...th, textAlign: "left" }}>Pay on</th>
                      <th style={{ ...th, textAlign: "left" }}>Example: November 2026 premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { d: "0 to 4", w: "11th to 15th of the following month", x: "December 11 to 15, 2026" },
                      { d: "5 to 9", w: "16th to 20th of the following month", x: "December 16 to 20, 2026" },
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
                PhilHealth requires every employer to use the Electronic Premium Remittance System (EPRS). The steps are:
              </p>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.5rem" }}>Update the employee master list in EPRS and check the preliminary remittance list.</li>
                <li style={{ marginBottom: "0.5rem" }}>Generate the Statement of Premium Account (SPA).</li>
                <li style={{ marginBottom: "0.5rem" }}>Pay the exact total amount due on the SPA through an accredited collecting agent. PhilHealth does not accept underpayments, overpayments or split payments.</li>
              </ol>
              <p style={{ marginBottom: "2.5rem" }}>
                PhilHealth Advisory No. 2026-0050 says EPRS Version 4.9.0 supports additional premium payment transactions from October 1, 2026, subject to approval of the request. Ask your PhilHealth account officer if you need one of those transactions.
              </p>

              {/* H2: Late or missed */}
              <h2 style={h2}>What Happens If You Pay Late or Missed Past Contributions</h2>
              <p style={{ marginBottom: "1rem" }}>
                Late remittance carries interest under PhilHealth&apos;s circulars. The penalty rates for all three agencies are in our{" "}
                <Link href="/blog/sss-philhealth-pagibig-late-remittance-penalties" style={link}>guide to SSS, PhilHealth and Pag-IBIG late remittance penalties</Link>.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                For arrears, PhilHealth Circular No. 2026-0001, effective January 24, 2026, offers a one-time waiver of interest on missed employer contributions from July 2013 to December 2024. Confirm that you qualify, and the application window, with your PhilHealth account information management specialist before you rely on it.
              </p>

              {/* H2: Checklist */}
              <h2 style={h2}>PhilHealth Payroll Checklist for 2026</h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.5rem" }}>Set the rate to 5%, the salary floor to ₱10,000 and the ceiling to ₱100,000.</li>
                <li style={{ marginBottom: "0.5rem" }}>Compute on the fixed monthly basic salary only. Leave out commissions, overtime, allowances, 13th month pay and bonuses.</li>
                <li style={{ marginBottom: "0.5rem" }}>Deduct half of the premium from the employee and add the employer half, which is 2.5% each.</li>
                <li style={{ marginBottom: "0.5rem" }}>Reconcile the EPRS master list with your payroll register before you generate the SPA.</li>
                <li style={{ marginBottom: "0.5rem" }}>Pay inside the window for your PEN and keep the SPA and the payment acknowledgement.</li>
              </ol>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS comes with YAHSHUA One Payroll, which computes SSS, PhilHealth and Pag-IBIG contributions.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Book a free demo and ask how it handles the floor, the ceiling and rate changes across your payroll runs.
                </p>
                <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See how YAHSHUA handles contributions <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
              {philhealthFaqs.map((f, i) => (
                <div key={f.q} style={{ marginBottom: i === philhealthFaqs.length - 1 ? "3rem" : "2rem" }}>
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
                  <a href="https://www.philhealth.gov.ph/advisories/2025/PA2025-0002.pdf" target="_blank" rel="noopener noreferrer">PhilHealth Advisory No. 2025-0002</a>;{" "}
                  <a href="https://pia.gov.ph/news/philhealth-sets-5-premium-contribution-rate-for-2026" target="_blank" rel="noopener noreferrer">Philippine Information Agency, PhilHealth sets 5% premium contribution rate for 2026</a>;{" "}
                  <a href="https://www.philhealth.gov.ph/partners/employers/pay_procedures.php" target="_blank" rel="noopener noreferrer">PhilHealth payment and reporting procedures for employers</a>;{" "}
                  <a href="https://eprs01.philhealth.gov.ph" target="_blank" rel="noopener noreferrer">PhilHealth EPRS advisories</a>; PhilHealth Circular No. 2026-0001; Republic Act No. 11223. Verified November 18, 2026. This article does not constitute legal or tax advice.
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
                  <Link href="/blog/sss-contribution-table-2026-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    SSS, PhilHealth and Pag-IBIG Contribution Tables for 2026 →
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
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=philhealth_contribution_2026"
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

export default PhilhealthContributionTable2026Article;
