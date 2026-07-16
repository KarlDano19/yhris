import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const SssContributionTable2026Article = () => {
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
                2026 Philippine Statutory Contribution Changes: SSS, PhilHealth and Pag-IBIG Rates Every Employer Must Update Now
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                SSS raised its total rate to 15% and expanded the salary ceiling to ₱35,000. PhilHealth finalized at 5% with a ₱100,000 ceiling. Pag-IBIG holds at ₱400 maximum monthly. If your payroll system has not been updated for all three, you are calculating deductions incorrectly on every payroll run.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>July 2026</span>
                <span>·</span>
                <span>10 min read</span>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Featured Image */}
        <div className="lp-section-container max-w-3xl mx-auto pt-10 pb-0">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "360px" }}>
            <Image
              src="/blog/sss-contribution-2026.png"
              alt="2026 Philippine Statutory Contribution Changes: SSS, PhilHealth and Pag-IBIG"
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

              {/* Living hub callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Living reference page:</strong> This page is updated in place whenever SSS, PhilHealth, or Pag-IBIG changes its rates or ceilings. Last verified: July 2026. All rates and figures should be confirmed against the issuing agency&apos;s official circular before updating your payroll system.
                </p>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2rem" }}>
                Every Philippine employer with at least one employee is legally required to remit monthly contributions to SSS, PhilHealth, and Pag-IBIG. These are not optional deductions. Failure to remit on time, or remitting the wrong amount, exposes the employer to penalties, surcharges, and in some cases personal liability for the employer-officer who signed off on payroll.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                In 2026, SSS implemented a rate increase to 15% and raised the maximum monthly salary credit (MSC) from ₱30,000 to ₱35,000. PhilHealth maintained its 5% rate, which became the final scheduled rate under the Universal Health Care Act (RA 11223). Pag-IBIG contribution rates remain unchanged. This guide covers the current rates for all three, with contribution tables and computation examples.
              </p>

              {/* Quick reference table */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                2026 Statutory Contribution Rates at a Glance
              </h2>
              <div style={{ overflowX: "auto", marginBottom: "2.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Agency</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Total Rate</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Employer Share</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Employee Share</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Salary Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { agency: "SSS", total: "15%", employer: "10% + EC", employee: "5%", cap: "₱35,000 MSC" },
                      { agency: "PhilHealth", total: "5%", employer: "2.5%", employee: "2.5%", cap: "₱100,000" },
                      { agency: "Pag-IBIG", total: "4%", employer: "2%", employee: "2%", cap: "₱10,000 (max ₱400/mo)" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "600" }}>{row.agency}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(var(--lp-primary))", fontWeight: "700" }}>{row.total}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.employer}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.employee}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.cap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ===================== SSS ===================== */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                SSS Contribution Table 2026
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                The Social Security System (SSS) contribution rate in 2026 is <strong>15% of the Monthly Salary Credit (MSC)</strong>. The employer pays 10% and the employee pays 5%. The employer also pays a separate flat Employees&apos; Compensation (EC) premium of ₱10 for MSC at or below ₱14,500, or ₱30 for MSC above ₱14,500.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                The MSC minimum is ₱5,000 and the MSC maximum is ₱35,000 in 2026, up from ₱30,000 in 2025. This means employees who earn more than ₱35,000 per month have their contribution capped at the ₱35,000 MSC level.
              </p>

              {/* SSS rate table */}
              <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Monthly Salary</th>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>MSC</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Employee (5%)</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Employer (10%)</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>EC</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { salary: "₱5,000 and below", msc: "₱5,000", ee: "₱250", er: "₱500", ec: "₱10", total: "₱760" },
                      { salary: "₱10,000", msc: "₱10,000", ee: "₱500", er: "₱1,000", ec: "₱10", total: "₱1,510" },
                      { salary: "₱15,000", msc: "₱15,000", ee: "₱750", er: "₱1,500", ec: "₱30", total: "₱2,280" },
                      { salary: "₱20,000", msc: "₱20,000", ee: "₱1,000", er: "₱2,000", ec: "₱30", total: "₱3,030" },
                      { salary: "₱25,000", msc: "₱25,000", ee: "₱1,250 *", er: "₱2,530 *", ec: "₱30", total: "₱3,810 *" },
                      { salary: "₱35,000 and above", msc: "₱35,000", ee: "₱1,750 *", er: "₱3,530 *", ec: "₱30", total: "₱5,310 *" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151" }}>{row.salary}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", fontWeight: "600" }}>{row.msc}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", textAlign: "right" }}>{row.ee}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", textAlign: "right" }}>{row.er}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", textAlign: "right" }}>{row.ec}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#111827", fontWeight: "700", textAlign: "right" }}>{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "2rem" }}>
                * Rows marked with an asterisk include Mandatory Provident Fund (MPF) contributions on the portion of MSC above ₱20,000. These are illustrative computations based on the 15% rate structure. Verify exact amounts against the official SSS contribution schedule for your MSC bracket.
              </p>

              {/* H3: Mandatory Provident Fund */}
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
                What is the SSS Mandatory Provident Fund (MPF)?
              </h3>
              <p style={{ marginBottom: "1rem" }}>
                The Mandatory Provident Fund (MPF), also called WISP (Workers&apos; Investment and Savings Program), is an additional savings component that applies to employees whose MSC exceeds ₱20,000. It is not a separate contribution on top of the 15% rate. Rather, the 15% rate is split between two funds: the regular SS fund covers the first ₱20,000 of MSC, and the MPF covers the portion above ₱20,000 up to the ₱35,000 MSC ceiling.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                In practice, employees earning above ₱20,000 per month will see two SS-related deductions on their payslip: regular SS and MPF. The MPF portion is credited to a provident fund account that earns dividends and is paid out on retirement, total disability, or death, similar to SSS retirement benefits.
              </p>
              <p style={{ marginBottom: "2rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Example:</strong> An employee with an MSC of ₱25,000 pays 5% on ₱20,000 (₱1,000 regular SS) plus 5% on ₱5,000 (₱250 MPF), for a total employee deduction of ₱1,250 per month. The employer pays 10% on each portion, plus the ₱30 EC premium.
              </p>

              {/* H3: What changed from 2025 */}
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
                What Changed from 2025 to 2026
              </h3>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Rate increase.</strong> The total SSS contribution rate moved from 14% in 2025 (employer 9.5%, employee 4.5%) to 15% in 2026 (employer 10%, employee 5%).</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Higher MSC ceiling.</strong> The maximum MSC increased from ₱30,000 to ₱35,000. Employees earning above ₱30,000 now contribute on a higher salary base, increasing both deductions and employer cost.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>MPF ceiling expanded.</strong> With the MSC ceiling raised to ₱35,000, the maximum MPF-eligible portion rose from ₱10,000 (₱30,000 minus ₱20,000) to ₱15,000 (₱35,000 minus ₱20,000).</li>
              </ul>

              {/* ===================== PhilHealth ===================== */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                PhilHealth Contribution Rate 2026
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                The PhilHealth premium contribution rate in 2026 is <strong>5% of the member&apos;s monthly basic salary</strong>, shared equally between employer and employee at 2.5% each. This rate applies to all employed members in both private and government sectors.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                The salary floor is ₱10,000, meaning members earning below ₱10,000 pay a fixed minimum premium of ₱500 per month. The salary ceiling is ₱100,000, meaning members earning ₱100,000 or more pay a fixed maximum of ₱5,000 per month. Salaries above ₱100,000 do not increase the premium further.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                According to PhilHealth&apos;s official advisory released May 6, 2025, the 5% rate is the final scheduled adjustment under Republic Act No. 11223 (the Universal Health Care Act). No further increases are scheduled under the current law.
              </p>

              {/* PhilHealth rate table */}
              <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Monthly Basic Salary</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Rate</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Employee (2.5%)</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Employer (2.5%)</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Total Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { salary: "₱10,000 and below", rate: "Fixed", ee: "₱250", er: "₱250", total: "₱500" },
                      { salary: "₱15,000", rate: "5%", ee: "₱375", er: "₱375", total: "₱750" },
                      { salary: "₱20,000", rate: "5%", ee: "₱500", er: "₱500", total: "₱1,000" },
                      { salary: "₱40,000", rate: "5%", ee: "₱1,000", er: "₱1,000", total: "₱2,000" },
                      { salary: "₱75,000", rate: "5%", ee: "₱1,875", er: "₱1,875", total: "₱3,750" },
                      { salary: "₱100,000 and above", rate: "Fixed", ee: "₱2,500", er: "₱2,500", total: "₱5,000" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151" }}>{row.salary}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", textAlign: "right" }}>{row.rate}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", textAlign: "right" }}>{row.ee}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", textAlign: "right" }}>{row.er}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#111827", fontWeight: "700", textAlign: "right" }}>{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PhilHealth rate history */}
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
                PhilHealth Rate History Under RA 11223 (2020 to 2026)
              </h3>
              <p style={{ marginBottom: "1rem" }}>
                The 5% rate reached in 2024 has been maintained through 2026 and is now the final ceiling under the law. Many payroll systems that were not updated in 2024 are still running at 4.5%, which is a remittance shortfall that compounds monthly.
              </p>
              <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Year</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Rate</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Salary Ceiling</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Max Monthly Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { year: "2020", rate: "3.00%", ceiling: "₱60,000", max: "₱1,800" },
                      { year: "2021", rate: "3.50%", ceiling: "₱70,000", max: "₱2,450" },
                      { year: "2022", rate: "4.00%", ceiling: "₱80,000", max: "₱3,200" },
                      { year: "2023", rate: "4.50%", ceiling: "₱90,000", max: "₱4,050" },
                      { year: "2024", rate: "5.00%", ceiling: "₱100,000", max: "₱5,000" },
                      { year: "2025", rate: "5.00%", ceiling: "₱100,000", max: "₱5,000" },
                      { year: "2026", rate: "5.00%", ceiling: "₱100,000", max: "₱5,000" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i >= 5 ? "rgba(255,193,7,0.06)" : (i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)") }}>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", fontWeight: i >= 5 ? "600" : "400" }}>{row.year} {i >= 5 ? "(current)" : ""}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: i >= 5 ? "hsl(38, 92%, 38%)" : "#374151", fontWeight: i >= 5 ? "700" : "400", textAlign: "right" }}>{row.rate}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", textAlign: "right" }}>{row.ceiling}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", textAlign: "right" }}>{row.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "2.5rem" }}>
                Source: RA 11223 (Universal Health Care Act) premium schedule. PhilHealth advisory released May 6, 2025, via the Philippine Information Agency.
              </p>

              {/* ===================== Pag-IBIG ===================== */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Pag-IBIG Contribution Table 2026
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Pag-IBIG Fund (HDMF) contribution rates are unchanged in 2026. The employer always contributes 2% of the employee&apos;s monthly salary. The employee contributes 1% for salaries at or below ₱1,500, or 2% for salaries above ₱1,500. Contributions are capped at a Fund Salary (FS) of ₱10,000, meaning the maximum monthly deduction is ₱200 for the employee and ₱200 for the employer, regardless of actual salary.
              </p>

              {/* Pag-IBIG table */}
              <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Monthly Salary</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Employee Share</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Employer Share</th>
                      <th style={{ textAlign: "right", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Total Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { salary: "₱1,500 and below", ee: "1% of salary", er: "2% of salary", total: "3% of salary" },
                      { salary: "₱1,501 to ₱10,000", ee: "2% of salary", er: "2% of salary", total: "4% of salary" },
                      { salary: "Above ₱10,000 (capped)", ee: "₱200 (max)", er: "₱200 (max)", total: "₱400 (max)" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151" }}>{row.salary}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", textAlign: "right" }}>{row.ee}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#374151", textAlign: "right" }}>{row.er}</td>
                        <td style={{ padding: "0.6rem 0.875rem", color: "#111827", fontWeight: "700", textAlign: "right" }}>{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Common payroll error:</strong> Some payroll systems apply the 2% Pag-IBIG rate to the employee&apos;s full gross salary instead of capping the base at ₱10,000. For an employee earning ₱40,000, the correct employee deduction is ₱200, not ₱800 (2% of ₱40,000). Over-deducting Pag-IBIG is a compliance error and the excess must be refunded to the employee.
              </p>
              <p style={{ marginBottom: "2rem" }}>
                Employers remit contributions on or before the 10th day of the following month. Late remittance carries a penalty of 1/10 of 1% per day of delay.
              </p>

              {/* ===================== What to update ===================== */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                What Employers Need to Update Now
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                The SSS rate change and ceiling increase took effect in January 2026. If your payroll system has been running on 2025 settings, you have been under-deducting and under-remitting SSS contributions since January. Here is the checklist:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Update SSS rate to 15% (employee 5%, employer 10%).</strong> If you are still on 14% (employee 4.5%, employer 9.5%), you have a shortfall that accrues penalties on top of the unpaid amount. Correct it in the current payroll period and remit the difference for prior months.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Update the MSC ceiling to ₱35,000.</strong> Employees earning between ₱30,000 and ₱35,000 are now contributing on a higher base. If your system still caps at ₱30,000, those employees are being under-deducted.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Verify PhilHealth is at 5% with a ₱100,000 ceiling.</strong> The 5% rate has been in effect since January 2024. If your system is at 4.5%, you have had a two-year shortfall to correct.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Check the Pag-IBIG cap logic.</strong> Confirm your system applies the 2% rate only up to ₱10,000 of salary, not to the full gross. Both over-deduction and under-deduction are compliance problems.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Check your payslip format.</strong> SSS payslip deductions should now show two line items for employees earning above ₱20,000: regular SS and MPF. A single combined SSS line is acceptable but some agencies prefer the split.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Verify remittance schedules.</strong> SSS, PhilHealth, and Pag-IBIG each have different remittance deadlines based on the last digit of your company&apos;s registration number. Confirm the current schedule with each agency as these are subject to change.</li>
              </ul>

              {/* YAHSHUA HRIS CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS automatically applies the current SSS, PhilHealth, and Pag-IBIG rates on every payroll run.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  No manual rate tables to update. No ceiling errors. When SSS or PhilHealth changes rates, the system is updated before your next payroll cycle. Contributions are computed, deducted, and logged automatically, with a remittance summary ready for submission.
                </p>
                <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See how YAHSHUA handles statutory compliance <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* ===================== FAQ ===================== */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the SSS contribution rate in 2026?
                </h3>
                <p>
                  The SSS contribution rate in 2026 is 15% of the Monthly Salary Credit (MSC). The employer pays 10% and the employee pays 5%. The employer also pays an Employees&apos; Compensation (EC) premium of ₱10 (for MSC at or below ₱14,500) or ₱30 (for MSC above ₱14,500). This is up from 14% in 2025, when the employer share was 9.5% and the employee share was 4.5%.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the maximum SSS contribution in 2026?
                </h3>
                <p>
                  The maximum SSS contribution in 2026 corresponds to the maximum Monthly Salary Credit of ₱35,000. At this level, the employer pays ₱3,530 (including the ₱30 EC premium) and the employee pays ₱1,750, for a combined monthly total of ₱5,280. Employees earning more than ₱35,000 do not pay more than this amount.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the SSS Mandatory Provident Fund (MPF) in 2026?
                </h3>
                <p>
                  The SSS Mandatory Provident Fund (MPF), also known as WISP, is a savings component that applies to SSS members whose MSC exceeds ₱20,000. It is not an additional charge on top of the 15% rate. Instead, the 15% contribution is split: the regular SS fund covers the MSC up to ₱20,000, and the MPF covers the portion above ₱20,000 up to the ₱35,000 ceiling. For employees earning above ₱20,000, both regular SS and MPF deductions will appear as separate lines on the payslip. The MPF earns dividends and is paid out on retirement or total disability.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the PhilHealth contribution rate in 2026?
                </h3>
                <p>
                  The PhilHealth contribution rate in 2026 is 5% of the member&apos;s monthly basic salary, shared equally between employer and employee at 2.5% each. The salary floor is ₱10,000 (minimum premium: ₱500/month) and the ceiling is ₱100,000 (maximum premium: ₱5,000/month). This is the final scheduled rate under Republic Act 11223 (Universal Health Care Act) and is not expected to increase further under the current law.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the Pag-IBIG contribution rate in 2026?
                </h3>
                <p>
                  The Pag-IBIG (HDMF) contribution rate in 2026 is 2% of monthly salary for the employer, and 1% to 2% for the employee depending on salary level. Employees earning ₱1,500 or below pay 1%, while those earning above ₱1,500 pay 2%. Contributions are capped at a Fund Salary of ₱10,000, meaning the maximum deduction is ₱200 for the employee and ₱200 for the employer, totaling ₱400 per month regardless of the employee&apos;s actual salary.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What are the penalties for not remitting SSS, PhilHealth, or Pag-IBIG contributions?
                </h3>
                <p>
                  For SSS, employers who fail to remit contributions on time are liable for a 3% monthly penalty on the unpaid amount, plus a 3% annual interest on delinquent accounts. Willful non-remittance can lead to criminal charges against responsible officers, with penalties of up to ₱20,000 in fines and up to 12 years of imprisonment under RA 11199 (Social Security Act of 2018). For PhilHealth, late payment carries a 3% per month surcharge on unpaid premiums. For Pag-IBIG, the penalty is 1/10 of 1% per day of delay. In all three cases, the employer-officer who authorized or failed to remit payroll can be held personally liable, not just the company.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  When are statutory contribution remittances due in 2026?
                </h3>
                <p>
                  SSS remittance deadlines are staggered by the last digit of the employer&apos;s SSS registration number, generally falling between the 10th and 29th of the month following the applicable payroll period. PhilHealth remittances are due by the last day of the month following the payroll cutoff, with deadlines also staggered by registration number. Pag-IBIG remittances are due on or before the 10th day of the following month. Exact schedules for each agency should be verified against the agency&apos;s current remittance calendar, as deadlines shift when they fall on weekends or holidays.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Can an employer voluntarily contribute more than the required Pag-IBIG amount?
                </h3>
                <p>
                  Yes. Both employers and employees may voluntarily contribute more than the required minimum Pag-IBIG amount. Additional voluntary contributions are credited to the member&apos;s Pag-IBIG savings account, earn dividends, and increase loan eligibility. The standard cap of ₱200 employee or ₱200 employer applies only to mandatory contributions. Any amount above the mandatory minimum must be declared as a voluntary contribution at the time of remittance.
                </p>
              </div>

              {/* Author / Last updated */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Last updated July 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Contribution rates in this article are based on official SSS circulars, the PhilHealth advisory released via the Philippine Information Agency (May 6, 2025), and HDMF contribution schedules current as of July 2026. Verify all rates and ceilings against the issuing agency before updating your payroll system. This article does not constitute legal or tax advice.
                </p>
              </div>

            </div>
          </div>
        </article>

        {/* End CTA */}
        <section className="py-16" style={{ background: "#FFFBF0", borderTop: "1px solid rgba(255,193,7,0.2)" }}>
          <div className="lp-section-container max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "hsl(38, 92%, 38%)" }}>YAHSHUA HRIS</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ lineHeight: "1.3" }}>
              Stop updating SSS, PhilHealth, and Pag-IBIG rates manually every year.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS automatically computes SSS, PhilHealth, and Pag-IBIG contributions on every payroll run using the current rates and ceilings. No manual tables, no ceiling errors, no missed updates.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=sss_contribution_2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white transition-all hover:gap-3"
              style={{ background: "hsl(38, 92%, 45%)" }}
            >
              See how YAHSHUA handles payroll compliance <ArrowRight className="w-4 h-4" />
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

export default SssContributionTable2026Article;
