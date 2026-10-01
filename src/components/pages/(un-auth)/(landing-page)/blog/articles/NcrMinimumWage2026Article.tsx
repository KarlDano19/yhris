import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const NcrMinimumWage2026Article = () => {
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
                NCR Minimum Wage 2026: ₱755/Day Under Wage Order NCR-28, Effective September 26
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Metro Manila&apos;s minimum wage rises to ₱755 per day on September 26, 2026 under Wage Order No. NCR-28. The earlier ₱85 order, NCR-27, never took effect because of court injunctions. Here is what applies, from when, and what to change in payroll.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>Updated September 25, 2026</span>
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
              src="/blog/ncr-minimum-wage-2026.png"
              alt="NCR Minimum Wage 2026: Wage Order NCR-28"
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

              {/* Direct-answer opener, for snippet extraction */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "1.5rem", fontWeight: 500 }}>
                From September 26, 2026, the minimum wage in Metro Manila is ₱755 per day for non-agriculture workers, and ₱718 per day for agriculture, service and retail establishments with 15 or fewer workers, and manufacturing establishments with fewer than 10 regular workers, under Wage Order No. NCR-28. The rate is the same in every NCR city, including Manila, Quezon City, Makati, Taguig, and Pasig, because one regional wage order covers all of Metro Manila.
              </p>

              {/* Status callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>What happened to the ₱85 increase (Wage Order NCR-27)?</strong>
                </p>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  NCR-27 would have raised the minimum wage by ₱60 on July 25, 2026 and another ₱25 on January 20, 2027. It never took effect. The Pasig Regional Trial Court (Branch 152) issued a status quo ante order on July 24, 2026, followed by a temporary restraining order and a writ of preliminary injunction, in cases filed by employers. The wage board then issued NCR-28, a separate single ₱60 increase, &ldquo;without prejudicing the pending legal proceedings.&rdquo; Until September 25, 2026, the NCR-26 rates of ₱695 and ₱658 remained the floor.
                </p>
              </div>

              {/* H2: Rates */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                NCR Minimum Wage Rates Under Wage Order NCR-28
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                NCR-28 is a single tranche. There is no second increase scheduled under this order.
              </p>

              <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Sector</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Until Sept 25, 2026 (NCR-26)</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>From Sept 26, 2026 (NCR-28)</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Increase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { sector: "Non-Agriculture", prev: "₱695", now: "₱755" },
                      { sector: "Agriculture (Plantation and Non-Plantation)", prev: "₱658", now: "₱718" },
                      { sector: "Service/Retail (15 workers or fewer)", prev: "₱658", now: "₱718" },
                      { sector: "Manufacturing (fewer than 10 regular workers)", prev: "₱658", now: "₱718" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.sector}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#9ca3af", textAlign: "right" }}>{row.prev}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(38, 92%, 38%)", fontWeight: "700", textAlign: "right" }}>{row.now}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "600", textAlign: "right" }}>+₱60</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "2.5rem" }}>
                Source: DOLE and NWPC. NCR covers Caloocan, Las Piñas, Makati, Malabon, Mandaluyong, Manila, Marikina, Muntinlupa, Navotas, Parañaque, Pasay, Pasig, Quezon City, San Juan, Taguig, Valenzuela, and Pateros. Verify current rates at nwpc.dole.gov.ph before updating payroll.
              </p>

              {/* H2: Timeline */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                NCR Wage Order Timeline, 2025 to 2026
              </h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>July 18, 2025:</strong> Wage Order NCR-26 takes effect, setting ₱695 (non-agriculture) and ₱658 (lower category).</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>June 23, 2026:</strong> The regional wage board issues NCR-27, an ₱85 increase in two tranches (₱60 on July 25, 2026 and ₱25 on January 20, 2027).</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>July 24, 2026:</strong> The Pasig RTC issues a status quo ante order, later followed by a temporary restraining order and a writ of preliminary injunction. NCR-27 does not take effect on July 25.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>August 28, 2026:</strong> The Supreme Court orders the parties to comment on the labor groups&apos; petition to set aside the lower-court orders.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>September 7, 2026:</strong> The wage board approves NCR-28, a single ₱60 increase, in a 4-3 vote.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>September 11, 2026:</strong> NCR-28 is published.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>September 26, 2026:</strong> NCR-28 takes effect: ₱755 and ₱718 per day.</li>
              </ul>

              {/* H2: Who is covered */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Who Is Covered and Who Is Not
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Wage Order No. NCR-28 applies to private-sector workers in the National Capital Region, but the rate that applies depends on how the employer&apos;s establishment is classified. The rate follows where the employee works, not where they live.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#111827" }}>Non-agriculture rate (₱755):</strong> Applies to most Metro Manila employers, including offices, retail and service establishments with more than 15 workers, and manufacturing companies with 10 or more regular employees. If your business does not fall into the lower-rate categories below, this is your applicable floor.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#111827" }}>Lower rate (₱718):</strong> Applies to agricultural establishments, service and retail establishments employing 15 workers or fewer, and manufacturing establishments regularly employing fewer than 10 workers.
              </p>
              <p style={{ marginBottom: "2rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Kasambahay (domestic workers) are not covered by this order.</strong> Household helpers in NCR are covered by a separate instrument: Wage Order No. NCR-DW-06, which set the monthly minimum wage for domestic workers at ₱7,800, effective February 7, 2026. If you employ a kasambahay, confirm you are on the correct instrument.
              </p>

              {/* H2: What payroll computations change */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                What Payroll Computations Change When the Daily Rate Changes
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                The increase is to the basic daily wage. Because several other statutory pay items are computed from the daily rate, a wage floor increase cascades through payroll.
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#111827" }}>Overtime pay.</strong> Ordinary-day overtime is 125% of the hourly rate. Work on a rest day is paid at 130% of the daily rate, and work on a regular holiday at 200%. All are computed from the daily rate, so their peso amounts rise with the base wage.
                </li>
                <li style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#111827" }}>Holiday pay.</strong> An unworked regular holiday is paid at 100% of the daily rate, a worked regular holiday at 200%, and a worked special non-working day at 130%.
                </li>
                <li style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#111827" }}>Night differential.</strong> At least 10% of the regular hourly rate for hours worked between 10:00 PM and 6:00 AM. The base is now higher for minimum wage earners.
                </li>
                <li style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#111827" }}>13th month pay running total.</strong> 13th month pay is 1/12 of total basic salary earned during the calendar year. An employee earning ₱695/day through September 25 and ₱755/day from September 26 has a higher base for the remaining cycles of 2026. Do not apply the new rate to earlier months.
                </li>
                <li style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#111827" }}>SSS and PhilHealth contributions.</strong> If the increase moves an employee into a higher SSS Monthly Salary Credit bracket or PhilHealth computation base, contributions rise accordingly.
                </li>
              </ul>

              {/* H2: Employer checklist */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Employer Payroll Checklist for NCR-28
              </h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2rem" }}>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Confirm your sector classification.</strong> Decide whether your establishment falls under the non-agriculture rate (₱755) or the lower rate (₱718) based on your regular employee headcount and industry.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Update the daily basic wage effective September 26, 2026</strong> for every employee below the new floor. Employees already above it need no change; the wage order sets a floor, not a uniform rate.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Split cycles that straddle September 26.</strong> For a September 16 to 30 cutoff, pay the NCR-26 rate for September 16 to 25 and the NCR-28 rate for September 26 to 30.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Update overtime, holiday pay, and night differential inputs</strong> that use the daily rate. In a system that computes them from the daily rate, updating the base wage is enough. In a spreadsheet, check each formula.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Adjust the 13th month pay year-to-date tracker</strong> to use the new rate from September 26 forward only.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Review wage distortion.</strong> Employees earning just above the old minimum may now earn nearly the same as new minimum wage earners. Article 124 of the Labor Code requires employers to address wage distortion caused by a wage order.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Keep records and watch the NCR-27 case.</strong> As of September 25, 2026, no directive requires retroactive payment for July 25 to September 25, and NCR-27&apos;s additional ₱25 is unresolved. Both could change depending on the court outcome.
                </li>
              </ol>

              {/* CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS flags minimum wage compliance automatically.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  When a wage order takes effect, the system flags employees whose basic pay falls below the applicable floor, recomputes dependent items like overtime and holiday pay from the updated rate, and adjusts the 13th month running total going forward.
                </p>
                <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See how YAHSHUA handles wage order updates <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the NCR minimum wage in 2026?
                </h3>
                <p>
                  From September 26, 2026, the NCR minimum wage is ₱755 per day for non-agriculture workers and ₱718 per day for agriculture, service and retail establishments with 15 or fewer workers, and manufacturing establishments with fewer than 10 regular workers, under Wage Order No. NCR-28. Before September 26, the NCR-26 rates of ₱695 and ₱658 applied.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Is the minimum wage the same in Manila, Quezon City, and Makati?
                </h3>
                <p>
                  Yes. One wage order, Wage Order No. NCR-28, sets the minimum wage for all 17 local government units in Metro Manila: Caloocan, Las Piñas, Makati, Malabon, Mandaluyong, Manila, Marikina, Muntinlupa, Navotas, Parañaque, Pasay, Pasig, Quezon City, San Juan, Taguig, Valenzuela, and the municipality of Pateros. Non-agriculture workers earn ₱755 per day from September 26, 2026 in every one of them. The rate follows where the employee works, not where they live: a worker who lives in Bulacan but reports to an office in Makati is covered by the NCR rate.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What happened to Wage Order NCR-27 and the ₱85 increase?
                </h3>
                <p>
                  NCR-27, issued June 23, 2026, granted ₱85 in two tranches but never took effect. The Pasig Regional Trial Court issued a status quo ante order on July 24, 2026, followed by a temporary restraining order and a writ of preliminary injunction, in cases filed by employers. Labor groups have asked the Supreme Court to set those orders aside. The wage board then issued NCR-28, a separate single ₱60 increase effective September 26, 2026, without prejudice to the pending case.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Will the NCR minimum wage go up by ₱25 in January 2027?
                </h3>
                <p>
                  Not under NCR-28, which is a single tranche. The ₱25 January 2027 increase was part of NCR-27, and whether it is ever implemented depends on the outcome of the court cases. As of September 25, 2026, no further NCR increase is scheduled.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Do employers owe back pay for July 25 to September 25, 2026?
                </h3>
                <p>
                  As of September 25, 2026, no DOLE directive requires retroactive payment for that period, because NCR-27 was restrained before it took effect. That could change depending on how the courts rule on NCR-27, so keep accurate payroll records for the period.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Does the NCR minimum wage increase apply to all workers?
                </h3>
                <p>
                  Wage Order No. NCR-28 applies to private-sector workers in the National Capital Region. Kasambahay (household helpers) are covered by a separate instrument: Wage Order No. NCR-DW-06, which set the monthly minimum wage for domestic workers in NCR at ₱7,800, effective February 7, 2026. Government employees are not covered by regional wage orders.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Does a minimum wage increase affect overtime and holiday pay?
                </h3>
                <p>
                  Yes. Overtime pay, holiday pay, and night differential are computed from the daily rate, so their peso amounts rise for workers at or near the minimum. Ordinary-day overtime is 125% of the hourly rate, a worked regular holiday is 200% of the daily rate, and work on a rest day is 130%. Recompute these using the updated daily rate from September 26, 2026.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What happens if an employer does not comply with the NCR minimum wage order?
                </h3>
                <p>
                  Non-compliance with a wage order is a violation of the Wage Rationalization Act (RA 6727). DOLE labor inspectors can conduct inspections and issue compliance orders requiring employers to pay the wage differential from the effective date of the order. Continued non-compliance can result in criminal penalties under RA 8188, which amended RA 6727&apos;s penalty provisions: a fine of not less than ₱25,000 nor more than ₱100,000, imprisonment of not less than two years nor more than four years, or both, at the court&apos;s discretion. RA 8188 also requires the employer to pay double the unpaid wage increase (double indemnity). The responsible officers of the employing company can be held personally liable.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published July 2026 · Updated September 25, 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Based on Wage Order No. NCR-28 (approved September 7, 2026, published September 11, 2026, effective September 26, 2026), DOLE and NWPC announcements, and reporting by the Philippine News Agency and The Philippine Star on the NCR-27 injunction and the Supreme Court petition. Status verified as of September 25, 2026. The NCR-27 case is pending, so confirm current rates at nwpc.dole.gov.ph before updating payroll. This article does not constitute legal advice.
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
                  <Link href="/blog/minimum-wage-philippines-2026-by-region" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Minimum Wage in the Philippines 2026 by Region →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/night-differential-holiday-pay-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Night Differential and Holiday Pay Stacking Rules →
                  </Link>
                </li>
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
              Stop tracking wage order changes manually.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS keeps your payroll compliant with current minimum wage floors, recomputes dependent pay items automatically, and flags any employee falling below the applicable rate for your region.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=ncr_minimum_wage_2026"
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

export default NcrMinimumWage2026Article;
