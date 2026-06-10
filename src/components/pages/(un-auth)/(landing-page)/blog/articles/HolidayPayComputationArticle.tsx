import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const HolidayPayComputationArticle = () => {
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
                Philippine Holiday Pay Computation: A Complete Employer Guide
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                DOLE is clear on holiday pay rules — and non-compliance is treated as a wage violation, not an oversight. This guide covers the correct pay rates for regular and special holidays, common computation mistakes, and what employers need to handle before the next payroll closes.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>June 2026</span>
                <span>·</span>
                <span>6 min read</span>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Article Body */}
        <article className="py-16">
          <div className="lp-section-container max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none" style={{ color: "#374151", lineHeight: "1.8" }}>

              {/* Definition block — AEO: self-contained answer */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>What is holiday pay in the Philippines?</strong> Holiday pay is a mandatory benefit under the Philippine Labor Code requiring employers to compensate employees at a premium rate on declared regular and special non-working holidays. Rates vary depending on the holiday type and whether the employee works or not. Non-compliance is treated as a wage violation by DOLE.
                </p>
              </div>

              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2rem" }}>
                Every time DOLE issues a holiday pay advisory, Philippine business owners face the same pressure: get the computation right before the next payroll closes. For most MSMEs, this means manually checking which employees worked, what schedule they were on, and applying the correct multiplier — without an integrated system to do it automatically.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                This guide walks through the correct holiday pay rates under the Philippine Labor Code, the most common employer mistakes, and what compliance actually looks like in practice.
              </p>

              {/* H2 */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Regular Holidays vs Special Non-Working Holidays: The Difference That Changes the Rate
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                The Philippine Labor Code distinguishes between two types of public holidays, and the computation rules are different for each.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#111827" }}>Regular holidays</strong> include Independence Day (June 12), Rizal Day, Christmas Day, New Year&apos;s Day, Araw ng Kagitingan, Labor Day, National Heroes Day, Bonifacio Day, and Eid al-Fitr and Eid al-Adha (when proclaimed). Employees are entitled to pay even if they do not work.
              </p>
              <p style={{ marginBottom: "2rem" }}>
                <strong style={{ color: "#111827" }}>Special non-working holidays</strong> follow a "no work, no pay" principle — employees receive no compensation if they do not report, unless the employer has a more favorable policy.
              </p>

              {/* H2 */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Holiday Pay Rates: The Complete Computation Table
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                The following rates apply to rank-and-file employees under the Philippine Labor Code. &quot;Daily rate&quot; refers to the employee&apos;s regular daily basic pay.
              </p>

              {/* Regular holiday table */}
              <p style={{ fontWeight: "700", color: "#111827", marginBottom: "0.75rem" }}>Regular Holidays</p>
              <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Scenario</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Pay Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { scenario: "Employee does NOT work", rate: "100% of daily rate (paid holiday)" },
                      { scenario: "Employee WORKS on the holiday", rate: "200% of daily rate (basic pay + 100% premium)" },
                      { scenario: "Employee works on rest day that falls on a regular holiday", rate: "260% of daily rate" },
                      { scenario: "Employee works overtime on a regular holiday", rate: "200% + 30% of hourly rate per overtime hour" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.scenario}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(var(--lp-primary))", fontWeight: "600" }}>{row.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Special non-working holiday table */}
              <p style={{ fontWeight: "700", color: "#111827", marginBottom: "0.75rem" }}>Special Non-Working Holidays</p>
              <div style={{ overflowX: "auto", marginBottom: "2.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Scenario</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Pay Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { scenario: "Employee does NOT work", rate: "No pay (no work, no pay rule applies)" },
                      { scenario: "Employee WORKS on the special holiday", rate: "130% of daily rate" },
                      { scenario: "Employee works on rest day that falls on a special holiday", rate: "150% of daily rate" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.scenario}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(var(--lp-primary))", fontWeight: "600" }}>{row.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* H2 */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Most Common Holiday Pay Mistakes Philippine Employers Make
              </h2>

              <p style={{ marginBottom: "1rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Mistake 1: Not paying non-working employees on regular holidays.</strong> On a regular holiday, employees who do not report to work are still entitled to 100% of their daily rate. "No work, no pay" applies to special non-working holidays only — not regular holidays.
              </p>

              <p style={{ marginBottom: "1rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Mistake 2: Applying the wrong rate to rest day holidays.</strong> When a regular holiday falls on an employee&apos;s rest day and they work, the rate is 260% — not 200%. Many payroll processors miss this distinction.
              </p>

              <p style={{ marginBottom: "1rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Mistake 3: Computing holiday pay on gross pay instead of basic daily rate.</strong> Holiday pay rates apply to the basic daily rate only — not the employee&apos;s total compensation including allowances, overtime, or premium pay.
              </p>

              <p style={{ marginBottom: "2.5rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Mistake 4: Not documenting the computation for audit purposes.</strong> DOLE expects employers to maintain payroll records that show how holiday pay was computed per employee. If a labor complaint is filed, undocumented computations work against the employer.
              </p>

              {/* H2: YAKAP */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                DOLE Labor Advisory No. 10-2026: The YAKAP Program
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Alongside holiday pay obligations, DOLE issued Labor Advisory No. 10-2026 under the YAKAP program, encouraging employers to support onsite PhilHealth registration drives for employees.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                The advisory encourages companies to allow employees to participate in YAKAP registration activities and to treat the time as an excused absence — meaning employees should not be docked pay or marked absent for attending.
              </p>
              <p style={{ marginBottom: "2rem", color: "#6b7280", fontSize: "0.9rem", padding: "1rem 1.25rem", background: "#f9fafb", borderRadius: "8px" }}>
                Note: Specific implementation details and scope of DOLE Labor Advisory No. 10-2026 may vary. Review the official advisory or consult your DOLE regional office for guidance specific to your workplace.
              </p>

              {/* H2 */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                What Happens When Systems Are Not Built for This
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                For an MSME running on spreadsheets or disconnected HR tools, every holiday advisory becomes a manual scramble: check which employees worked, verify their schedule type, apply the correct multiplier per employee, ensure the computation is in the payroll run, and document it for audit.
              </p>
              <p style={{ marginBottom: "2rem" }}>
                Two separate compliance obligations — holiday pay and attendance excusing — with no guarantee the records talk to each other. DOLE&apos;s enforcement posture is hardening. Compliance is no longer just a best practice; it is an area of active scrutiny.
              </p>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS computes Philippine holiday pay automatically — correct rate, every employee, every time.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Built for Philippine compliance. Regular holidays, special holidays, rest day premiums — the system applies the right multiplier based on each employee&apos;s actual attendance and work schedule. No manual lookups. No payroll errors.
                </p>
                <a href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  Book a free demo <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* FAQ — AEO structured Q&A */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Are employees paid if they do not work on a regular holiday in the Philippines?
                </h3>
                <p>
                  Yes. On a regular holiday, all covered employees are entitled to 100% of their regular daily rate even if they do not report to work. This is different from special non-working holidays, where the "no work, no pay" rule applies unless the company policy provides otherwise.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the holiday pay rate for employees working on a regular holiday?
                </h3>
                <p>
                  Employees who work on a regular holiday receive 200% of their regular daily rate — their basic pay for the day plus an additional 100% premium. If the holiday falls on their rest day and they work, the rate increases to 260%.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the difference between a regular holiday and a special non-working holiday?
                </h3>
                <p>
                  Regular holidays are fixed under the law (e.g., Independence Day, Christmas, Rizal Day) and employees are paid even if they do not work. Special non-working holidays (e.g., EDSA People Power Anniversary, All Saints&apos; Day) follow "no work, no pay" — employees only receive pay if they report.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How should holiday pay be computed for employees on flexible work schedules?
                </h3>
                <p>
                  For employees on flexible or compressed workweek arrangements, holiday pay computation depends on the specific DOLE-approved schedule. The applicable daily rate is based on the equivalent daily rate in the arrangement, not the standard 8-hour rate. Review the specific arrangement against current DOLE guidelines or consult your HR counsel.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the penalty for not paying the correct holiday pay?
                </h3>
                <p>
                  Non-compliance with holiday pay rules is treated as a wage violation by DOLE. Employees may file a money claim before the NLRC or DOLE, and employers can be assessed back pay for the underpaid amount. DOLE labor inspections actively check payroll records for holiday pay compliance.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Do contractual and part-time employees receive holiday pay?
                </h3>
                <p>
                  Yes, provided they are covered employees under the Labor Code. Contractual and project-based employees on a daily or hourly rate are entitled to holiday pay. Part-time employees receive holiday pay proportionate to their regular schedule. Employees paid purely on commission may be exempt under certain conditions — consult DOLE guidelines for commission-based arrangements.
                </p>
              </div>

              {/* Author / Last updated */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Last updated June 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  This article reflects the Philippine Labor Code and current DOLE advisories. For legal advice specific to your workplace, consult a licensed labor law practitioner or your DOLE regional office.
                </p>
              </div>

            </div>
          </div>
        </article>

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

export default HolidayPayComputationArticle;
