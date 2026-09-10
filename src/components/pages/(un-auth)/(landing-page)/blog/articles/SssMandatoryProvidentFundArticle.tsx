import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const SssMandatoryProvidentFundArticle = () => {
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
                Inside the SSS Mandatory Provident Fund (WISP): What It Is and How It Changes Your Payroll Math
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Above a ₱20,000 Monthly Salary Credit, part of every employee&apos;s SSS contribution stops going to the regular program and starts going to a separate, individually-tracked fund. Here is exactly how the split works, and why it is not the same thing as the SSS WISP Plus product being marketed alongside it.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>September 2026</span>
                <span>·</span>
                <span>8 min read</span>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Featured Image */}
        <div className="lp-section-container max-w-3xl mx-auto pt-10 pb-0">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "360px" }}>
            <Image
              src="/blog/sss-mandatory-provident-fund.png"
              alt="SSS Mandatory Provident Fund (WISP) Explained"
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
                The SSS Mandatory Provident Fund, officially the Workers&apos; Investment and Savings Program (WISP), automatically covers any SSS member whose Monthly Salary Credit (MSC) exceeds ₱20,000. For these employees, the 15% SSS contribution splits in two: the portion on the first ₱20,000 of MSC funds the regular SSS program, and the portion above ₱20,000 up to the ₱35,000 ceiling funds WISP instead.
              </p>

              {/* Definition callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>WISP, MPF, and Pension Booster are the same mandatory program.</strong> SSS markets WISP under the &ldquo;MySSS Pension Booster&rdquo; brand and it is commonly called the Mandatory Provident Fund. All three names refer to one program: the individually-tracked savings fund under Republic Act 11199 for members earning above ₱20,000 MSC. It is not the same product as the separate, voluntary WISP Plus, covered below.
                </p>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2rem" }}>
                WISP was mandatorily implemented in January 2021 under Republic Act 11199, the Social Security Act of 2018. Unlike the regular SSS program, which pools contributions to fund pensions for all members collectively, WISP gives each covered member an individually-tracked account that earns its own share of investment income. SSS itself describes it as a defined-contribution retirement savings program, distinct from the defined-benefit structure of the regular program.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                For payroll teams, the practical issue is that WISP is not an add-on line item. It changes how the existing 15% SSS contribution is allocated for any employee crossing the ₱20,000 MSC threshold, which as of 2026 covers a meaningful share of mid-level and senior staff.
              </p>

              {/* H2: Who is covered */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Who Is Automatically Enrolled in WISP
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Enrollment is automatic, not optional, for any SSS member who meets both conditions:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}>Has a Monthly Salary Credit that exceeds ₱20,000 in the regular SSS program, and</li>
                <li style={{ marginBottom: "0.5rem" }}>Has not filed a final claim (retirement, total disability, or death) under the regular SSS program</li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                This applies to private-sector employees, self-employed members, OFWs, and voluntary members alike. For employees, membership starts automatically on the first month WISP contributions are posted. No enrollment form is required, which is exactly why payroll teams sometimes discover the split after the fact rather than planning for it.
              </p>

              {/* H2: How the split works */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                How WISP Splits Your SSS Contribution
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                The total rate stays 15% of MSC either way. What changes is which fund receives which portion. The first ₱20,000 of MSC is always contributed to the regular SSS program. Any MSC above ₱20,000, up to the ₱35,000 ceiling, is contributed to WISP instead:
              </p>

              <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>MSC</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Total (15%)</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Regular SSS</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>WISP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { msc: "₱20,000", total: "₱3,000", regular: "₱3,000", wisp: "₱0" },
                      { msc: "₱25,000", total: "₱3,750", regular: "₱3,000", wisp: "₱750" },
                      { msc: "₱30,000", total: "₱4,500", regular: "₱3,000", wisp: "₱1,500" },
                      { msc: "₱35,000 (ceiling)", total: "₱5,250", regular: "₱3,000", wisp: "₱2,250" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.msc}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.total}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.regular}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(38, 92%, 38%)", fontWeight: "700", textAlign: "right" }}>{row.wisp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem", fontSize: "0.9rem", color: "#6b7280" }}>
                At the ₱35,000 ceiling, the standard 10% employer / 5% employee split still applies within each fund: of the ₱2,250 going to WISP, ₱1,500 is employer share and ₱750 is employee share.
              </p>

              {/* H2: How WISP funds are invested */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                How WISP Funds Are Invested and Earn Returns
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                WISP is not a passive holding account. SSS pools contributions and invests them, with earnings credited proportionately to each member&apos;s account. Per SSS&apos;s own disclosure, the fund follows a conservative allocation: a significant portion goes into risk-free government securities, with a modest 10 to 20 percent invested in blue-chip corporations, prioritizing principal preservation over yield.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Contributions posted in a given month start earning their share of investment income on the first day of the following month. SSS deducts a management fee, initially set at 1% per annum of the accumulated fund, from members&apos; accounts at each month-end. The payout, when it eventually comes, is tax-free: members receive the full accumulated value, principal plus investment income, with no tax on the earnings.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                SSS reported that its combined Pension Booster program, which includes both WISP and WISP Plus, delivered a 6.2% return in June 2026, giving a directional sense of recent performance. Because WISP&apos;s allocation is conservative by design, returns should be read as a supplement to the regular pension, not a replacement for retirement planning.
              </p>

              {/* H2: WISP vs WISP Plus */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                WISP vs WISP Plus: Do Not Confuse the Two
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                SSS launched a second, unrelated product in December 2022 with a nearly identical name: WISP Plus. The two are frequently confused online, including in some SSS-adjacent explainer content, so the distinction is worth stating plainly.
              </p>

              <div style={{ overflowX: "auto", marginBottom: "2.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Feature</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>WISP (mandatory)</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>WISP Plus (voluntary)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Who is covered", wisp: "Automatic if MSC exceeds ₱20,000", plus: "Any SSS member, regardless of MSC" },
                      { feature: "Enrollment", wisp: "Automatic, no application needed", plus: "Opt-in via My.SSS account" },
                      { feature: "Contribution", wisp: "Fixed, embedded in the 15% SSS rate", plus: "Flexible, from ₱500 per payment" },
                      { feature: "Employer share", wisp: "Yes, standard 10/5 split applies", plus: "No, member-funded only" },
                      { feature: "Early withdrawal", wisp: "Not allowed before a final SSS claim", plus: "Partial or full withdrawal allowed after a qualifying period" },
                      { feature: "Payout trigger", wisp: "Automatic with regular SSS final claim", plus: "Member-initiated withdrawal" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.feature}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.wisp}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.plus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* H2: Payout */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                When and How WISP Pays Out
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                WISP has no early withdrawal option. The accumulated fund, principal plus investment earnings, is released automatically when the member files a final claim under the regular SSS program: retirement, total disability, or death. There is no separate WISP claim process; SSS processes it alongside the regular benefit.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                This is the clearest practical difference from WISP Plus, which explicitly allows partial or full withdrawals after a qualifying membership period. An employee asking whether they can access their &ldquo;provident fund savings&rdquo; early is very likely asking about WISP Plus rules while actually being enrolled only in mandatory WISP, where the answer is no.
              </p>

              {/* H2: Payroll impact */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                What This Means for Payroll
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                The total SSS deduction on a payslip does not change because of WISP. An employee at ₱35,000 MSC still sees ₱1,750 deducted, the same figure they would see under a flat 15% calculation. What WISP changes is internal to SSS remittance reporting: the ₱20,000-to-₱35,000 portion of that contribution needs to be correctly attributed to WISP rather than the regular program in SSS&apos;s records.
              </p>
              <p style={{ marginBottom: "2rem" }}>
                For a payroll system, this means the SSS contribution calculation cannot simply apply 15% to the full MSC and remit it as one figure. It needs to compute the regular-program portion and the WISP portion separately, even though the employee-facing deduction amount is identical either way. Getting this wrong does not change what the employee pays, but it does create a mismatch between what payroll remits and how SSS expects it categorized.
              </p>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS applies the WISP split automatically.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  For employees above the ₱20,000 MSC threshold, YAHSHUA HRIS computes the regular SSS and WISP portions correctly on every payroll run, using the current MSC ceiling. No manual bracket lookups, no separate spreadsheet for higher-earning employees.
                </p>
                <Link href="/blog/sss-contribution-table-2026-philippines" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See the full 2026 SSS, PhilHealth, and Pag-IBIG contribution rates <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the SSS Mandatory Provident Fund?
                </h3>
                <p>
                  The SSS Mandatory Provident Fund is the common name for the Workers&apos; Investment and Savings Program (WISP), a mandatory, individually-tracked savings fund under Republic Act 11199 for SSS members whose Monthly Salary Credit exceeds ₱20,000. SSS also markets it under the &ldquo;MySSS Pension Booster&rdquo; brand.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  At what salary does WISP apply?
                </h3>
                <p>
                  WISP applies automatically once an employee&apos;s Monthly Salary Credit exceeds ₱20,000. Below that threshold, the full 15% SSS contribution goes to the regular program. Above it, contributions on the MSC portion up to the ₱35,000 ceiling go to WISP instead.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Is WISP the same as WISP Plus?
                </h3>
                <p>
                  No. WISP is mandatory, automatically applies above ₱20,000 MSC, and cannot be withdrawn before a final SSS claim (retirement, disability, or death). WISP Plus is a separate, voluntary program open to any SSS member regardless of salary, funded entirely by the member with no employer share, and allows partial or full withdrawal after a qualifying membership period.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Can an employee withdraw their WISP savings early?
                </h3>
                <p>
                  No. WISP funds are released only when the member files a final claim under the regular SSS program, meaning retirement, total disability, or death. There is no early or partial withdrawal option for mandatory WISP, unlike the voluntary WISP Plus program.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Does WISP change how much an employee pays in SSS contributions?
                </h3>
                <p>
                  No. The total SSS deduction stays 15% of MSC either way. WISP changes how that contribution is allocated internally between the regular SSS program and the WISP fund once MSC exceeds ₱20,000, not the total amount deducted from the employee&apos;s pay.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published September 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  WISP mechanics, eligibility, and investment allocation are based on SSS&apos;s official WISP program page (sss.gov.ph/wisp) and Republic Act 11199 (Social Security Act of 2018). Performance figures reference SSS public statements current as of June 2026. Contribution figures use the ₱35,000 MSC ceiling in effect for 2026. Verify current rules directly with SSS before making payroll or retirement planning decisions. This article does not constitute financial or legal advice.
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
                    2026 SSS, PhilHealth, and Pag-IBIG Contribution Rates →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/payroll-registration-checklist-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Philippine Payroll Registration Checklist →
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
              Stop tracking SSS brackets in a separate spreadsheet.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS computes the regular SSS and WISP split automatically for every employee above the MSC threshold, on every payroll run.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=sss_mpf_wisp"
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

export default SssMandatoryProvidentFundArticle;
