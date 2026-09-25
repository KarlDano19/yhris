import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

// Single source for the visible FAQ and the FAQPage schema in page.tsx
export const minimumWageByRegionFaqs = [
  {
    q: "What is the minimum wage in the Philippines in 2026?",
    a: "There is no single national minimum wage. As of September 26, 2026, daily minimum wages for private-sector workers range from ₱401 (agriculture and small retail in BARMM provinces) to ₱755 (non-agriculture in Metro Manila under Wage Order NCR-28). Each region's rate is set by its own wage board.",
  },
  {
    q: "Is there a national minimum wage in the Philippines?",
    a: "No. Under the Wage Rationalization Act (RA 6727), minimum wages are set region by region by Regional Tripartite Wages and Productivity Boards, with BARMM setting its own through the Bangsamoro wage board. Each board issues its own wage orders on its own schedule.",
  },
  {
    q: "Which region has the highest minimum wage in the Philippines?",
    a: "The National Capital Region: ₱755 per day for non-agriculture workers from September 26, 2026 under Wage Order NCR-28. The next highest are Central Luzon and CALABARZON, where non-agriculture rates reach ₱600 per day in their highest-paying areas.",
  },
  {
    q: "What is the minimum wage in Cebu in 2026?",
    a: "Under Wage Order ROVII-26, effective October 4, 2025, the minimum wage is ₱540 per day in Class A areas of Expanded Metro Cebu (the cities of Carcar, Cebu, Danao, Lapu-Lapu, Mandaue, Naga, and Talisay, and the municipalities of Compostela, Consolacion, Cordova, Liloan, Minglanilla, and San Fernando) and ₱500 per day everywhere else in Central Visayas. The Central Visayas wage board has been reviewing rates, so check for a newer order before payroll changes.",
  },
  {
    q: "What is the minimum wage in Davao in 2026?",
    a: "Under Wage Order RB XI-24, the minimum wage in the Davao Region is ₱540 per day for non-agriculture and ₱525 per day for agriculture, after the second tranche took effect on September 1, 2026. There are no separate city or province tiers.",
  },
  {
    q: "What is the minimum wage in Cagayan de Oro in 2026?",
    a: "Under Wage Order RX-24, the minimum wage in Cagayan de Oro is ₱500 per day, the Category I rate for Northern Mindanao, after the second tranche took effect on May 1, 2026. Retail and service establishments with 10 or fewer workers pay the Category II rate of ₱485 per day, even inside Cagayan de Oro.",
  },
  {
    q: "Which rate applies if an employee lives in a different region?",
    a: "The rate follows where the employee works, not where they live. A worker who lives in Bulacan but reports to an office in Makati is paid the NCR rate. For multi-branch employers, each branch pays the rate of its own region, and in some regions its own province, city, or municipality class.",
  },
  {
    q: "Are small businesses exempt from the minimum wage?",
    a: "Some can be. Barangay Micro Business Enterprises registered under RA 9178 with a valid certificate are exempt from the minimum wage law. Retail and service establishments with 10 or fewer workers can apply to their regional wage board for exemption from a specific wage order, but they are only exempt once the board approves the application.",
  },
];

const cell = { padding: "0.6rem 0.75rem", color: "#374151" } as const;
const head = { textAlign: "left" as const, padding: "0.6rem 0.75rem", color: "#6b7280", fontWeight: "600" };

const MinimumWageByRegionArticle = () => {
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
                Minimum Wage in the Philippines 2026 by Region: A Multi-Branch Employer&apos;s Guide
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Every region&apos;s current daily minimum wage, the wage order behind it, when it took effect, and the changes already scheduled. Built for employers who run payroll across more than one region.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>Rates as of September 26, 2026</span>
                <span>·</span>
                <span>9 min read</span>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Featured Image */}
        <div className="lp-section-container max-w-3xl mx-auto pt-10 pb-0">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "360px" }}>
            <Image
              src="/blog/minimum-wage-by-region-2026.png"
              alt="Minimum wage in the Philippines 2026 by region"
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
                The Philippines has no single national minimum wage. As of September 26, 2026, the daily minimum wage for private-sector workers ranges from ₱401 in BARMM provinces to ₱755 in Metro Manila, set separately by each region&apos;s wage board. The rate an employee is owed depends on where they work, and in several regions on the province, city class, or size of the establishment.
              </p>

              {/* Callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Three things change the rate you owe:</strong> the region where the employee works (not where they live), how the establishment is classified (non-agriculture, agriculture, or small retail and service), and in some regions the specific province, city, or municipality class. Two scheduled increases take effect December 1, 2026, in Bicol and BARMM.
                </p>
              </div>

              {/* H2: Summary table */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Minimum Wage by Region, as of September 26, 2026
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Daily rates for private-sector workers. &ldquo;Non-agriculture&rdquo; shows the range across the region&apos;s tiers; &ldquo;lowest rate&rdquo; is the lowest category in the region, usually agriculture or small retail and service.
              </p>
              <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={head}>Region</th>
                      <th style={head}>Wage order</th>
                      <th style={{ ...head, textAlign: "right" }}>Non-agriculture</th>
                      <th style={{ ...head, textAlign: "right" }}>Lowest rate</th>
                      <th style={head}>In effect since</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { r: "NCR (Metro Manila)", wo: "NCR-28", na: "₱755", low: "₱718", since: "Sep 26, 2026" },
                      { r: "CAR (Cordillera)", wo: "CAR-24", na: "₱505", low: "₱505", since: "Dec 30, 2025" },
                      { r: "Region I (Ilocos)", wo: "RB 1-24", na: "₱480 to ₱505", low: "₱480", since: "Nov 19, 2025" },
                      { r: "Region II (Cagayan Valley)", wo: "RTWPB 2-24", na: "₱500", low: "₱500", since: "Nov 5, 2025" },
                      { r: "Region III (Central Luzon)", wo: "RBIII-26", na: "₱560 to ₱600", low: "₱515", since: "Apr 16, 2026" },
                      { r: "Region IV-A (CALABARZON)", wo: "IVA-22", na: "₱525 to ₱600", low: "₱508", since: "Apr 1, 2026" },
                      { r: "MIMAROPA (IV-B)", wo: "RB-MIMAROPA-13", na: "₱455", low: "₱455", since: "Jan 1, 2026" },
                      { r: "Region V (Bicol)", wo: "RBV-23", na: "₱455", low: "₱455", since: "Apr 8, 2026" },
                      { r: "Region VI (Western Visayas)", wo: "RBVI-29", na: "₱525 to ₱550", low: "₱520", since: "Nov 19, 2025" },
                      { r: "Region VII (Central Visayas)", wo: "ROVII-26", na: "₱500 to ₱540", low: "₱500", since: "Oct 4, 2025" },
                      { r: "Region VIII (Eastern Visayas)", wo: "RB VIII-25", na: "₱470", low: "₱440", since: "Jun 1, 2026" },
                      { r: "Region IX (Zamboanga Peninsula)", wo: "RIX-24", na: "₱464", low: "₱451", since: "Jun 1, 2026" },
                      { r: "Region X (Northern Mindanao)", wo: "RX-24", na: "₱485 to ₱500", low: "₱485", since: "May 1, 2026" },
                      { r: "Region XI (Davao)", wo: "RB XI-24", na: "₱540", low: "₱525", since: "Sep 1, 2026" },
                      { r: "Region XII (SOCCSKSARGEN)", wo: "RB XII-25", na: "₱460", low: "₱443", since: "Dec 15, 2025" },
                      { r: "Region XIII (Caraga)", wo: "RXIII-20", na: "₱475", low: "₱475", since: "May 1, 2026" },
                      { r: "BARMM", wo: "BARMM-05", na: "₱411 to ₱436", low: "₱401", since: "Aug 6, 2026" },
                    ].map((row, i) => (
                      <tr key={row.r} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ ...cell, color: "#111827", fontWeight: 500 }}>{row.r}</td>
                        <td style={{ ...cell, color: "#6b7280", whiteSpace: "nowrap" }}>{row.wo}</td>
                        <td style={{ ...cell, color: "hsl(38, 92%, 38%)", fontWeight: 700, textAlign: "right", whiteSpace: "nowrap" }}>{row.na}</td>
                        <td style={{ ...cell, textAlign: "right", whiteSpace: "nowrap" }}>{row.low}</td>
                        <td style={{ ...cell, color: "#6b7280", whiteSpace: "nowrap" }}>{row.since}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "2.5rem" }}>
                &ldquo;In effect since&rdquo; is the date of the latest tranche now in effect. Negros Island Region: its new wage board has not issued a wage order yet, so Negros Occidental still follows Region VI and Negros Oriental and Siquijor follow Region VII. Source: NWPC regional wage pages and wage order texts. Confirm at nwpc.dole.gov.ph before changing payroll.
              </p>

              {/* H2: Scheduled changes */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Changes Already Scheduled, and Regions Under Review
              </h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>December 1, 2026, Bicol:</strong> the second tranche of RBV-23 raises the regional rate from ₱455 to ₱480.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>December 1, 2026, BARMM:</strong> the second tranche of BARMM-05 adds ₱25 to every category, bringing the range to ₱426 to ₱461.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>NCR:</strong> the earlier order NCR-27, including a ₱25 increase once set for January 20, 2027, never took effect because of court injunctions and is before the courts. See our <Link href="/blog/ncr-minimum-wage-2026" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>NCR minimum wage guide</Link> for the full timeline.</li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                Several wage boards are also reviewing rates, which usually leads to a new order within weeks or months: Western Visayas (public hearings in October 2026), Central Visayas, Eastern Visayas, Northern Mindanao, SOCCSKSARGEN, and Ilocos have all held hearings or consultations in August and September 2026. Treat those regions&apos; rates as likely to change before year-end.
              </p>

              {/* H2: Details by region */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Regions With Area or Size Tiers
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                These regions set different rates within the same region. They are where multi-branch payroll most often goes wrong.
              </p>

              <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#111827", marginTop: "2rem", marginBottom: "0.75rem" }}>Central Luzon (Region III)</h3>
              <p style={{ marginBottom: "1.5rem" }}>
                Bataan, Bulacan, Nueva Ecija, Pampanga, Tarlac, and Zambales: ₱600 non-agriculture, ₱590 retail and service, ₱570 agriculture. Aurora: ₱560 non-agriculture, ₱545 agriculture, ₱515 retail and service.
              </p>

              <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#111827", marginTop: "2rem", marginBottom: "0.75rem" }}>CALABARZON (Region IV-A)</h3>
              <p style={{ marginBottom: "1.5rem" }}>
                Non-agriculture is ₱600 in the Extended Metropolitan Area and component cities, ₱550 in 1st class municipalities (₱600 in Rosario, Cavite), and ₱525 in 2nd to 5th class municipalities. Agriculture is ₱525, or ₱508 in 2nd to 5th class municipalities. Retail and service establishments with 10 or fewer workers pay ₱508 in all areas.
              </p>

              <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#111827", marginTop: "2rem", marginBottom: "0.75rem" }}>Central Visayas (Region VII)</h3>
              <p style={{ marginBottom: "1.5rem" }}>
                One rate for all sectors, split by area. Class A, Expanded Metro Cebu, is ₱540: the cities of Carcar, Cebu, Danao, Lapu-Lapu, Mandaue, Naga, and Talisay, and the municipalities of Compostela, Consolacion, Cordova, Liloan, Minglanilla, and San Fernando. All other areas, including Bohol, Negros Oriental, and Siquijor, are ₱500.
              </p>

              <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#111827", marginTop: "2rem", marginBottom: "0.75rem" }}>Northern Mindanao (Region X)</h3>
              <p style={{ marginBottom: "1.5rem" }}>
                Category I is ₱500: the cities of Cagayan de Oro, Iligan, Malaybalay, Valencia, Gingoog, El Salvador, and Ozamiz, and the municipalities of Tagoloan, Villanueva, Jasaan, Opol, Maramag, Quezon, Manolo Fortich, and Lugait. Category II is ₱485 for all other areas. Retail and service establishments with 10 or fewer workers pay ₱485 even inside Category I cities, including Cagayan de Oro.
              </p>

              <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#111827", marginTop: "2rem", marginBottom: "0.75rem" }}>BARMM</h3>
              <p style={{ marginBottom: "1.5rem" }}>
                Cotabato City, Lamitan City, and Marawi City: ₱436 non-agriculture and ₱411 agriculture and retail. Maguindanao del Norte, Maguindanao del Sur, Lanao del Sur (except Marawi), Basilan (except Lamitan), Tawi-Tawi, and the Special Geographic Area: ₱411 non-agriculture and ₱401 agriculture and retail. Each rises by ₱25 on December 1, 2026.
              </p>

              <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#111827", marginTop: "2rem", marginBottom: "0.75rem" }}>Size-based tiers elsewhere</h3>
              <p style={{ marginBottom: "2.5rem" }}>
                Ilocos pays ₱505 to non-agriculture employers with 10 or more workers and ₱480 to those with fewer. Western Visayas pays ₱550 to non-agriculture employers with more than 10 workers, ₱525 to those with 10 or fewer, and ₱520 in agriculture. Eastern Visayas pays ₱470 to non-agriculture and larger retail, and ₱440 to retail and service with 1 to 10 workers, cottage industries, and agriculture. NCR&apos;s lower ₱718 rate covers retail and service with 15 or fewer workers and manufacturing with fewer than 10.
              </p>

              {/* H2: Multi-branch rules */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Five Rules Multi-Branch Employers Get Wrong
              </h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2rem" }}>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>The rate follows the workplace.</strong> Pay each employee the rate of the branch where they report, not their home address and not your head office&apos;s region.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Classify each branch, not the company.</strong> A 12-person retail branch in Cagayan de Oro and a 40-person office in the same city owe different rates. Headcount and industry tiers apply per establishment.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Track tranches, not just orders.</strong> Many orders raise rates in two steps months apart. Set a payroll reminder for every scheduled tranche, like December 1, 2026 in Bicol and BARMM.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Recompute everything built on the daily rate.</strong> Overtime, holiday pay, night differential, and the 13th month pay running total all move when the daily rate changes. See our <Link href="/blog/night-differential-holiday-pay-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>night differential and holiday pay guide</Link> for the multipliers.
                </li>
                <li style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#111827" }}>Check wage distortion after every increase.</strong> When the floor rises, employees just above it can end up earning nearly the same as new hires. Article 124 of the Labor Code requires employers to address wage distortion caused by a wage order.
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
              {minimumWageByRegionFaqs.map((f, i) => (
                <div key={f.q} style={{ marginBottom: i === minimumWageByRegionFaqs.length - 1 ? "3rem" : "2rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                    {f.q}
                  </h3>
                  <p>{f.a}</p>
                </div>
              ))}

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published September 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Rates verified on September 25, 2026 against the National Wages and Productivity Commission&apos;s regional wage pages and the text of each wage order, with DOLE, PIA, and PNA announcements as cross-checks. Wage boards issue new orders often, so confirm current rates at nwpc.dole.gov.ph before updating payroll. This article does not constitute legal advice.
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
                  <Link href="/blog/ncr-minimum-wage-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    NCR Minimum Wage 2026: ₱755 Under Wage Order NCR-28 →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/night-differential-holiday-pay-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Night Differential and Holiday Pay Stacking Rules →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/philippine-holiday-pay-computation-guide" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Philippine Holiday Pay Computation Guide →
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
              Running payroll in more than one region?
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS keeps your payroll compliant with current minimum wage floors, recomputes dependent pay items automatically, and flags any employee falling below the applicable rate for your region.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=minimum_wage_by_region_2026"
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

export default MinimumWageByRegionArticle;
