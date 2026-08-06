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
                NCR Minimum Wage 2026: New Rates Under Wage Order No. 27 Are Now in Effect
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                The first tranche of the NCR wage increase took effect July 25, 2026. Non-agriculture workers now earn a minimum of ₱755 per day. A second tranche of ₱25 follows on January 20, 2027. Here is what every Metro Manila employer needs to update in payroll now.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>July 2026</span>
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
              alt="NCR Minimum Wage 2026: Wage Order No. 27"
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

              {/* Quick reference callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Wage Order No. NCR-27 at a glance:</strong>
                </p>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.9rem", color: "#374151" }}>
                  <li>Non-Agriculture: ₱695 → <strong>₱755/day</strong> (July 25, 2026), then ₱780/day (January 20, 2027)</li>
                  <li>Agriculture / Service-Retail ≤15 workers / Manufacturing &lt;10 workers: ₱658 → <strong>₱718/day</strong> (July 25, 2026), then ₱743/day (January 20, 2027)</li>
                  <li>Total increase upon full implementation: ₱85/day</li>
                </ul>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2rem" }}>
                Wage Order No. NCR-27 was issued by the Regional Tripartite Wages and Productivity Board-National Capital Region (RTWPB-NCR) on June 23, 2026, and published in The Philippine Star on July 9, 2026. Under the Wage Rationalization Act (RA 6727), wage orders take effect 15 days after publication. That placed the effective date at July 25, 2026 — not July 19, which had been the initial announcement before the publication date was finalized.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                If your payroll has not been updated since July 25, every affected employee has been receiving less than the legal minimum for each cycle that has run. This article covers the new rates by sector, what payroll computations are affected, and the checklist to bring your payroll into compliance immediately.
              </p>

              {/* H2: New Rates */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                New NCR Minimum Wage Rates Under Wage Order No. 27
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                The wage order delivers the increase in two tranches. The first is already in effect. The second follows in January 2027.
              </p>

              <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Sector</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Previous Rate</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>July 25, 2026</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Jan 20, 2027</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Total Increase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { sector: "Non-Agriculture", prev: "₱695", t1: "₱755", t2: "₱780", total: "+₱85" },
                      { sector: "Agriculture (Plantation and Non-Plantation)", prev: "₱658", t1: "₱718", t2: "₱743", total: "+₱85" },
                      { sector: "Service/Retail (≤15 workers)", prev: "₱658", t1: "₱718", t2: "₱743", total: "+₱85" },
                      { sector: "Manufacturing (<10 regular workers)", prev: "₱658", t1: "₱718", t2: "₱743", total: "+₱85" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.sector}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.prev}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(38, 92%, 38%)", fontWeight: "700", textAlign: "right" }}>{row.t1}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151", textAlign: "right" }}>{row.t2}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "600", textAlign: "right" }}>{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "2.5rem" }}>
                Source: NWPC official rates. NCR covers Caloocan, Las Piñas, Makati, Malabon, Mandaluyong, Manila, Marikina, Muntinlupa, Navotas, Parañaque, Pasay, Pasig, Quezon City, San Juan, Taguig, Valenzuela, and Pateros. Verify current rates at nwpc.dole.gov.ph before updating payroll.
              </p>

              {/* H2: Who is covered */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Who Is Covered and Who Is Not
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Wage Order No. NCR-27 applies to all private-sector workers in the National Capital Region, but the rate that applies depends on how the employer&apos;s establishment is classified.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#111827" }}>Non-agriculture rate (₱755):</strong> Applies to most Metro Manila employers, including offices, retail establishments with more than 15 workers, and manufacturing companies with 10 or more regular employees. If your business does not fall into the lower-rate categories below, this is your applicable floor.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#111827" }}>Lower rate (₱718):</strong> Applies to agricultural establishments, service and retail establishments employing 15 workers or fewer, and manufacturing establishments regularly employing fewer than 10 workers. The worker count that matters is the regular employee headcount, not the total including contractual or project-based workers.
              </p>
              <p style={{ marginBottom: "2rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Kasambahay (domestic workers) are not covered by this order.</strong> Household helpers in NCR are covered by a separate instrument: Wage Order No. NCR-DW-06, which set the monthly minimum wage for domestic workers at ₱7,800, effective February 7, 2026. If you employ a kasambahay, confirm you are on the correct instrument.
              </p>

              {/* H2: What payroll computations change */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                What Payroll Computations Change When the Daily Rate Changes
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                The minimum wage increase is to the basic daily wage. Because several other statutory pay items are computed as a percentage of the daily rate, a wage floor increase cascades through your entire payroll structure.
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#111827" }}>Overtime pay.</strong> Ordinary day overtime is 125% of the hourly rate. Rest day overtime is 130% on rest days, 200% on regular holidays. All of these are computed from the daily rate, so the peso amount of overtime increases when the base wage increases.
                </li>
                <li style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#111827" }}>Holiday pay.</strong> Regular holiday pay for non-worked days is 100% of the daily rate. Worked regular holidays are 200%. Special non-working holidays worked are 130%. These are all floor computations from the daily rate.
                </li>
                <li style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#111827" }}>Night differential.</strong> Night differential of at least 10% applies to hours worked between 10:00 PM and 6:00 AM. The 10% base is the regular hourly rate, which is now higher for minimum wage earners.
                </li>
                <li style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#111827" }}>13th month pay running total.</strong> 13th month pay is 1/12 of total basic salary earned during the calendar year. If an employee was earning ₱695/day from January to July 24 and ₱755/day from July 25 onward, their 13th month pay base changes for the remaining payroll cycles. This needs to be reflected in your year-to-date computation.
                </li>
                <li style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#111827" }}>SSS and PhilHealth contributions.</strong> If the wage increase moves an employee into a higher SSS Monthly Salary Credit (MSC) bracket or a higher PhilHealth computation base, contribution amounts increase accordingly. Verify the updated bracket for each affected employee.
                </li>
              </ul>

              {/* H2: Employer checklist */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Employer Payroll Update Checklist
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                If you have not updated your payroll since July 25, work through this checklist before the next payroll cycle closes.
              </p>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2rem" }}>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Confirm your sector classification.</strong> Determine whether your establishment falls under the non-agriculture rate (₱755) or the lower rate (₱718) based on your actual regular employee headcount and industry type.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Update the daily basic wage for all affected employees to the applicable floor.</strong> If any employee is already earning above the new minimum, no update is required for that employee. The wage order sets a floor, not a uniform rate.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Recompute any payroll cycles that ran after July 25 at the old rate.</strong> Those cycles are short-paying affected workers. Compute the shortfall and include it in the next payroll as a correction.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Update overtime, holiday pay, and night differential formulas or inputs</strong> that use the daily rate as a base. In a system that computes these from the daily rate automatically, updating the base wage is sufficient. In a manual or spreadsheet setup, verify each formula.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Adjust the 13th month pay year-to-date tracker</strong> to use the new daily rate from July 25 forward. Do not apply the higher rate retroactively to January.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Set a calendar reminder for January 20, 2027,</strong> when the second tranche of ₱25 takes effect. Non-agriculture will move to ₱780/day and the lower category to ₱743/day.
                </li>
              </ol>

              {/* CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS flags minimum wage compliance automatically.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  When the NCR wage order takes effect, the system flags employees whose basic pay falls below the applicable floor, recomputes dependent items like overtime and holiday pay from the updated rate, and adjusts the 13th month running total going forward. No manual formula changes required.
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
                  What is the new NCR minimum wage in 2026?
                </h3>
                <p>
                  Under Wage Order No. NCR-27, the minimum daily wage for non-agriculture workers in Metro Manila is ₱755 effective July 25, 2026. Workers in agriculture, service and retail establishments with 15 workers or fewer, and manufacturing establishments with fewer than 10 regular workers receive ₱718 per day. A second tranche of ₱25 takes effect on January 20, 2027, bringing the non-agriculture floor to ₱780 and the lower category to ₱743.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  When did the NCR wage increase take effect?
                </h3>
                <p>
                  The first tranche of the increase took effect on July 25, 2026. This is 15 days after the wage order was published in The Philippine Star on July 9, 2026, as required under the Wage Rationalization Act (RA 6727). An earlier announcement of July 19 was corrected once the publication date was finalized. The second tranche takes effect on January 20, 2027.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Which wage order covers the 2026 NCR minimum wage increase?
                </h3>
                <p>
                  Wage Order No. NCR-27, issued by the Regional Tripartite Wages and Productivity Board-National Capital Region (RTWPB-NCR) on June 23, 2026. It grants a total increase of ₱85 per day delivered in two tranches. DOLE Secretary Tolentino described it as the highest daily wage increase in NCR history.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Does the NCR minimum wage increase apply to all workers?
                </h3>
                <p>
                  Wage Order No. NCR-27 applies to private-sector workers in the National Capital Region. Kasambahay (household helpers) are covered by a separate instrument: Wage Order No. NCR-DW-06, which set the monthly minimum wage for domestic workers in NCR at ₱7,800, effective February 7, 2026. Government employees are not covered by RTWPB wage orders.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Does a minimum wage increase affect overtime and holiday pay?
                </h3>
                <p>
                  Yes. Overtime pay, holiday pay, and night differential are all computed as a percentage of the daily rate. When the daily minimum wage increases, the peso amount of these premium pays increases for workers at or near the minimum. Overtime on ordinary days is 125% of the hourly rate, regular holiday pay for hours worked is 200%, and rest day overtime on a regular holiday is 260%. All of these must be recomputed using the updated daily rate effective July 25.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What happens if an employer does not comply with the NCR minimum wage order?
                </h3>
                <p>
                  Non-compliance with a wage order is a violation of the Wage Rationalization Act (RA 6727). DOLE labor inspectors can conduct inspections and issue compliance orders requiring employers to pay the wage differential from the effective date of the order. Continued non-compliance can result in criminal penalties under RA 6727: a fine of not less than ₱25,000 nor more than ₱100,000, imprisonment of not less than two years nor more than four years, or both, at the court&apos;s discretion. The responsible officers of the employing company can be held personally liable.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published July 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Rates and dates in this article are sourced from the NWPC official wage schedule (nwpc.dole.gov.ph) and RTWPB-NCR Wage Order No. NCR-27, verified as of July 2026. Confirm current rates at the NWPC website before updating payroll. This article does not constitute legal advice.
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
