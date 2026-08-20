import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const NightDifferentialHolidayStackingArticle = () => {
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
                Night Differential and Holiday Pay: How the Rates Actually Stack
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                A night-shift employee working a regular holiday that also happens to be their rest day is not earning 200%, or even 260%. Getting this multiplier wrong is the single most common payroll error at multi-branch and shift-based Philippine employers. Here is the exact stacking math DOLE and the Labor Code require.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>August 2026</span>
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
              src="/blog/night-differential-holiday-stacking.png"
              alt="Night Differential and Holiday Pay: How the Rates Actually Stack"
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

              {/* Definition block */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Does night differential stack on top of holiday pay in the Philippines?</strong> Yes. Under Article 86 of the Labor Code, the 10% night shift differential applies to whatever rate is already in effect for that hour, including holiday and rest day premiums. The night differential is calculated on top of the stacked rate, not on the employee&apos;s base wage alone.
                </p>
              </div>

              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2rem" }}>
                Our <Link href="/blog/philippine-holiday-pay-computation-guide" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>holiday pay computation guide</Link> covers the base rates: 100% unworked, 200% worked, 260% on a rest day. Those numbers are correct for a single-shift, daytime workforce. They are incomplete for any multi-branch operation running night shifts, 24/7 retail, or BPO seats, where holidays, rest days, night hours, and overtime routinely collide on the same shift.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                This guide covers only that overlap: what happens when night differential meets a holiday, a rest day, overtime, or more than one of these at once.
              </p>

              {/* H2 */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                The Rule Everyone Gets Wrong: Multiplicative, Not Additive
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Article 86 of the Labor Code (Presidential Decree No. 442, as renumbered by Republic Act No. 10151) entitles covered employees to a night shift differential of not less than 10% of their regular wage for every hour worked between 10:00 PM and 6:00 AM.
              </p>
              <p style={{ marginBottom: "1rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>The error:</strong> Adding a flat 10% of the employee&apos;s basic daily rate on top of the holiday rate, instead of applying 10% to the holiday rate itself. On a regular holiday, that mistake underpays the employee by roughly 10% of their entire holiday premium, not just 10% of their base pay.
              </p>
              <p style={{ marginBottom: "2rem" }}>
                Correct approach: night differential is 10% of <em>whatever rate is already active for that hour</em>. If the hour falls on a regular holiday paid at 200%, night differential adds 10% of that 200% rate, for an effective 220%.
              </p>

              {/* H2: stacking table */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Regular Holiday Stacking Table
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                All rates below are expressed as a percentage of the employee&apos;s basic daily (or hourly) rate.
              </p>
              <div style={{ overflowX: "auto", marginBottom: "2.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Scenario</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Effective Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: "Regular holiday, worked", r: "200%" },
                      { s: "Regular holiday + rest day", r: "260%" },
                      { s: "Regular holiday + night shift", r: "220%" },
                      { s: "Regular holiday + rest day + night shift", r: "286%" },
                      { s: "Regular holiday + overtime", r: "260% of hourly rate" },
                      { s: "Regular holiday + rest day + overtime", r: "338% of hourly rate" },
                      { s: "Regular holiday + night shift + overtime", r: "286% of hourly rate" },
                      { s: "Regular holiday + rest day + night shift + overtime", r: "371.8% of hourly rate" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.s}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(var(--lp-primary))", fontWeight: "600" }}>{row.r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* H2: double holiday */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Double Regular Holiday Stacking Table
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                A double holiday occurs when two regular holidays are proclaimed on the same calendar date (for example, when a movable religious holiday coincides with a fixed civil holiday). This is rare, but the premium compounds sharply when it happens.
              </p>
              <div style={{ overflowX: "auto", marginBottom: "2.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Scenario</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Effective Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: "Double regular holiday, worked", r: "300%" },
                      { s: "Double regular holiday + rest day", r: "390%" },
                      { s: "Double regular holiday + night shift", r: "330%" },
                      { s: "Double regular holiday + rest day + night shift", r: "429%" },
                      { s: "Double regular holiday + overtime", r: "390% of hourly rate" },
                      { s: "Double regular holiday + rest day + overtime", r: "507% of hourly rate" },
                      { s: "Double regular holiday + night shift + overtime", r: "429% of hourly rate" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.s}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(var(--lp-primary))", fontWeight: "600" }}>{row.r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* H2: special non-working */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Special Non-Working Day Stacking Table
              </h2>
              <div style={{ overflowX: "auto", marginBottom: "2.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Scenario</th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Effective Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: "Special non-working day, worked", r: "130%" },
                      { s: "Special non-working day + rest day", r: "150%" },
                      { s: "Special non-working day + night shift", r: "143%" },
                      { s: "Special non-working day + rest day + night shift", r: "165%" },
                      { s: "Double special non-working day + rest day", r: "195%" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.s}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(var(--lp-primary))", fontWeight: "600" }}>{row.r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2rem" }}>
                Unworked special non-working days remain governed by the &quot;no work, no pay&quot; principle, unless a company policy or CBA provides otherwise.
              </p>

              {/* H2: worked example */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Worked Example: A Night-Shift Employee on a Regular Holiday Rest Day
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                An employee with an hourly basic rate of ₱120 is scheduled for an 8-hour night shift (10:00 PM to 6:00 AM) on a regular holiday that also falls on their rest day.
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}>Regular holiday + rest day rate: ₱120 × 260% = ₱312 per hour</li>
                <li style={{ marginBottom: "0.5rem" }}>Night differential on that stacked rate: ₱312 × 10% = ₱31.20 per hour</li>
                <li style={{ marginBottom: "0.5rem" }}>Effective hourly rate: ₱312 + ₱31.20 = ₱343.20 (equivalent to the 286% figure in the table above)</li>
                <li style={{ marginBottom: "0.5rem" }}>Total for the 8-hour shift: ₱343.20 × 8 = ₱2,745.60</li>
              </ul>
              <p style={{ marginBottom: "2rem" }}>
                Applying the additive shortcut instead (₱120 × 260% + ₱120 × 10% = ₱312 + ₱12 = ₱324 per hour) underpays this employee by ₱19.20 every hour of that shift: ₱153.60 for the night alone, repeated every time the schedule recurs.
              </p>

              {/* H2: government sector */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Private Sector vs. Government Sector: Different Rate, Different Hours
              </h2>
              <p style={{ marginBottom: "2rem" }}>
                Article 86 applies to private-sector employees: 10%, for hours worked between 10:00 PM and 6:00 AM. Government and public sector employees follow separate civil service rules: a 20% night differential for hours worked between 6:00 PM and 6:00 AM, a wider 12-hour window. Applying the government rate or window to a private-sector payroll (or vice versa) is a common source of confusion in mixed-workforce organizations, such as hospitals and schools with both plantilla and contractual staff.
              </p>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS stacks night differential, holiday, rest day, and overtime rates automatically and correctly, every payroll run.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Multi-branch and shift-based teams don&apos;t have to maintain a lookup table or trust a spreadsheet formula. The system applies the right multiplicative rate based on each employee&apos;s actual schedule, holiday classification, and clock-in data.
                </p>
                <a href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  Book a free demo <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* FAQ */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Is night differential added to holiday pay or computed separately?
                </h3>
                <p>
                  Night differential is added on top of the applicable holiday rate, not computed separately on the base wage. If an hour falls under a 200% regular holiday rate, the 10% night differential applies to that 200% rate, producing an effective 220%, not 210%.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the effective rate for working a night shift on a regular holiday that is also a rest day?
                </h3>
                <p>
                  286% of the basic hourly rate: the 260% regular holiday-plus-rest-day rate, with a 10% night differential applied on top of that stacked figure.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What happens when two regular holidays fall on the same date?
                </h3>
                <p>
                  This is a double regular holiday. An employee who works receives 300% of their daily rate for the first eight hours, rising to 390% if it also falls on their rest day, and higher still with night shift or overtime premiums layered on top.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Is the night differential rate the same for government employees?
                </h3>
                <p>
                  No. Private-sector employees receive a minimum 10% night differential for hours worked between 10:00 PM and 6:00 AM under Article 86 of the Labor Code. Government and public sector employees follow separate civil service rules, typically a 20% differential for hours between 6:00 PM and 6:00 AM.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Where can I find the base holiday pay rates before overlap premiums are applied?
                </h3>
                <p>
                  See our <Link href="/blog/philippine-holiday-pay-computation-guide" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>Philippine Holiday Pay Computation Guide</Link> for the base 100%/200%/260% regular holiday rates and 130%/150% special non-working day rates before night differential or overtime are layered on.
                </p>
              </div>

              {/* Author / Last updated */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Last updated August 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  This article reflects Article 86 of the Philippine Labor Code and current DOLE Labor Advisories on holiday pay. For legal advice specific to your workplace, consult a licensed labor law practitioner or your DOLE regional office.
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
              Stop stacking rates by hand for every shift.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS applies the correct multiplicative rate (night differential, holiday, rest day, and overtime) automatically, based on each employee&apos;s real schedule and attendance.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=night_differential_holiday"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white transition-all hover:gap-3"
              style={{ background: "hsl(38, 92%, 45%)" }}
            >
              See how payroll works in YAHSHUA <ArrowRight className="w-4 h-4" />
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

export default NightDifferentialHolidayStackingArticle;
