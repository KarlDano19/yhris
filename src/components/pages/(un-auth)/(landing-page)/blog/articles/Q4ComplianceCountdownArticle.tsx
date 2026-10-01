import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

// Single source for the visible FAQ and the FAQPage schema in page.tsx
export const q4CountdownFaqs = [
  {
    q: "When is the deadline for 13th month pay in 2026?",
    a: "December 24, 2026. Employees who leave before then get their prorated 13th month pay with their final pay instead. Employers then file the 13th Month Pay Compliance Report with DOLE by January 15 of the following year; the 2025 report was due January 15, 2026.",
  },
  {
    q: "What are the regular holidays and special days left in 2026?",
    a: "Under Proclamation No. 1006, s. 2025: All Saints' Day (November 1) and All Souls' Day (November 2) are special non-working days; Bonifacio Day (November 30) is a regular holiday; the Immaculate Conception (December 8) and Christmas Eve (December 24) are special non-working days; Christmas (December 25) and Rizal Day (December 30) are regular holidays; and December 31 is a special non-working day. Metro Manila also has special non-working days on November 16 to 18 for the ASEAN Summit (Proclamation No. 1447, s. 2026).",
  },
  {
    q: "How much is holiday pay on a regular holiday?",
    a: "Under DOLE Labor Advisory No. 12, s. 2025: an unworked regular holiday is paid at 100% of the daily wage, provided the employee worked or was on paid leave the day before; work on a regular holiday is paid at 200% for the first 8 hours; and work on a regular holiday that is also the employee's rest day is paid at 260%.",
  },
  {
    q: "Are employees paid on special non-working days?",
    a: "Not if they do not work, unless company policy, practice, or a collective agreement says otherwise. Work on a special non-working day is paid at 130% of the daily wage for the first 8 hours, or 150% if it is also the employee's rest day.",
  },
  {
    q: "When must employers do the year-end tax annualization?",
    a: "In the last payroll of December, or the last month of employment for anyone who leaves earlier, under RR 2-98 as amended by RR No. 11-2018. Tax still owed is deducted from the last pay of the year; any over-withheld tax is refunded to the employee by January 25 of the following year.",
  },
  {
    q: "When do employers give BIR Form 2316 to employees?",
    a: "By January 31 of the following year, or on the last pay for employees who leave earlier. January 31, 2027 is a Sunday, so the practical deadline is the next working day. Signed copies go to the BIR by February 28, which in 2027 also falls on a Sunday.",
  },
  {
    q: "When are SSS contributions due?",
    a: "Regular employers pay by the last day of the month after the contribution month (sss.gov.ph). October 2026 contributions are due November 30, which is Bonifacio Day, so payment moves to the next working day. Late payment carries a 2% monthly penalty under RA 11199.",
  },
];

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const th = { textAlign: "left" as const, padding: "0.6rem 0.75rem", color: "#6b7280", fontWeight: "600" };
const td = { padding: "0.6rem 0.75rem", color: "#374151", verticalAlign: "top" as const };
const tdDate = { ...td, color: "#111827", fontWeight: 600, whiteSpace: "nowrap" as const };

const Table = ({ head, rows }: { head: string[]; rows: string[][] }) => (
  <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
          {head.map((h) => <th key={h} style={th}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
            {r.map((c, j) => <td key={j} style={j === 0 ? tdDate : td}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Q4ComplianceCountdownArticle = () => {
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
                Payroll Compliance
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-6" style={{ lineHeight: "1.25" }}>
                Your Q4 Compliance Countdown: Every Payroll Deadline Between Now and December 24
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Holidays, wage increases, monthly remittances, year-end tax, and 13th month pay from October to December 2026, plus what is due the moment January starts.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>October 2026</span>
                <span>·</span>
                <span>8 min read</span>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Article Body */}
        <article className="py-16">
          <div className="lp-section-container max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none" style={{ color: "#374151", lineHeight: "1.8" }}>

              {/* Direct-answer opener */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "1.5rem", fontWeight: 500 }}>
                The biggest payroll deadline of the quarter is December 24, 2026, when 13th month pay must be released. Before then, Philippine employers also face eight national holidays and special days, minimum wage increases in Central Visayas (October 14), Bicol, and BARMM (December 1), monthly SSS, PhilHealth, Pag-IBIG, and BIR payments, and the year-end tax annualization in the last December payroll.
              </p>

              {/* Callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>New for Metro Manila:</strong> November 16 to 18, 2026 are special non-working days in NCR only, for the ASEAN Summit (Proclamation No. 1447, s. 2026). Work on those days is paid at 130%, or 150% on a rest day (DOLE Labor Advisory No. 16, s. 2026).
                </p>
              </div>

              {/* H2: Calendar */}
              <h2 style={h2}>Q4 2026 Payroll Deadline Calendar</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                National dates unless marked. Deadlines that fall on a weekend or holiday generally move to the next working day.
              </p>
              <Table
                head={["Date", "What is due or happening", "Applies to"]}
                rows={[
                  ["Oct 14", "Central Visayas minimum wage rises by ₱42: Class A (Expanded Metro Cebu) to ₱582, Class B to ₱542", "Employers in Region VII"],
                  ["Nov 1 (Sun), Nov 2", "All Saints' Day and All Souls' Day, special non-working days", "All employers"],
                  ["Nov 10", "BIR Form 1601-C for October (manual and eBIRForms filers)", "All employers"],
                  ["Nov 11 to 20", "PhilHealth premiums for October, by the last digit of the employer number", "All employers"],
                  ["Nov 16 to 18", "Special non-working days for the ASEAN Summit", "Metro Manila only"],
                  ["Nov 30", "Bonifacio Day, regular holiday", "All employers"],
                  ["Dec 1", "SSS contributions for October (Nov 30 deadline falls on a holiday); Bicol rate rises to ₱480; BARMM rates rise by ₱25", "All employers; Bicol and BARMM for wages"],
                  ["Dec 8", "Feast of the Immaculate Conception, special non-working day", "All employers"],
                  ["Dec 10", "BIR Form 1601-C for November (manual and eBIRForms filers)", "All employers"],
                  ["Dec 11 to 20", "PhilHealth premiums for November", "All employers"],
                  ["Dec 24", "13th month pay deadline; Christmas Eve, special non-working day", "All employers"],
                  ["Dec 25, Dec 30", "Christmas Day and Rizal Day, regular holidays", "All employers"],
                  ["Dec 31", "Last day of the year, special non-working day; SSS deadline for November contributions", "All employers"],
                  ["Last December payroll", "Year-end annualization of withholding tax", "All employers"],
                ]}
              />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                eFPS filers of BIR Form 1601-C file on a staggered schedule (the 11th to 15th, by industry group) and pay by the 15th; check the BIR monthly tax calendar for your group. Pag-IBIG remittances follow a schedule by the first letter of the employer&apos;s name (10th to month-end of the following month under HDMF Circular 275); confirm your window with Pag-IBIG.
              </p>

              {/* H2: Holiday pay */}
              <h2 style={h2}>Holiday Pay Rates for November and December</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                DOLE Labor Advisory No. 12, s. 2025 sets the 2026 rates. There is no double holiday and no regular holiday on a Sunday this quarter.
              </p>
              <Table
                head={["Situation", "Pay"]}
                rows={[
                  ["Regular holiday, not worked", "100% (if the employee worked or was on paid leave the day before)"],
                  ["Regular holiday, worked (first 8 hours)", "200%"],
                  ["Regular holiday, overtime", "Hourly rate × 200% × 130%"],
                  ["Regular holiday on a rest day, worked", "260%"],
                  ["Special day, not worked", "No work, no pay, unless policy, practice, or CBA says otherwise"],
                  ["Special day, worked (first 8 hours)", "130%"],
                  ["Special day on a rest day, worked", "150%"],
                ]}
              />
              <p style={{ marginBottom: "2.5rem" }}>
                Holiday pay is computed from the daily wage, so the wage increases above raise holiday pay too. Our <Link href="/blog/night-differential-holiday-pay-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>night differential and holiday pay guide</Link> covers night shifts and overtime on holidays.
              </p>

              {/* H2: Wage changes */}
              <h2 style={h2}>Minimum Wage Changes This Quarter</h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Central Visayas, October 14:</strong> +₱42, to ₱582 in Class A areas and ₱542 in Class B areas, including Bohol, Negros Oriental, and Siquijor.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Bicol, December 1:</strong> second tranche of Wage Order RBV-23, from ₱455 to ₱480.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>BARMM, December 1:</strong> second tranche of Wage Order BARMM-05, +₱25 in every category.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Metro Manila:</strong> ₱755 since September 26 under Wage Order NCR-28. The earlier NCR-27 order is still before the courts.</li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                Western Visayas holds public hearings in October, and several other boards are reviewing rates, so more orders may land before year-end. Every region&apos;s current rate is in our <Link href="/blog/minimum-wage-philippines-2026-by-region" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>minimum wage by region guide</Link>; Metro Manila details are in the <Link href="/blog/ncr-minimum-wage-2026" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>NCR minimum wage guide</Link>.
              </p>

              {/* H2: Monthly remittances */}
              <h2 style={h2}>Monthly Remittance Rules and Late Penalties</h2>
              <Table
                head={["Agency", "When it is due", "Late penalty"]}
                rows={[
                  ["SSS", "Last day of the month after the contribution month", "2% per month (RA 11199)"],
                  ["PhilHealth", "11th to 15th (employer number ending 0 to 4) or 16th to 20th (ending 5 to 9) of the following month", "Interest of at least 3% per month, compounded (RA 11223)"],
                  ["Pag-IBIG", "By first letter of the employer's name: A to D 10th to 14th, E to L 15th to 19th, M to Q 20th to 24th, R to Z 25th to month-end", "One-tenth of 1% per day (HDMF Circular 275)"],
                  ["BIR 1601-C", "10th of the following month for manual filers; December's return is due January 15", "Surcharge, interest, and compromise penalties under the Tax Code"],
                ]}
              />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                Older guides still quote a 3% SSS penalty or a digit-based SSS schedule; both are outdated. The current sss.gov.ph rule is the last day of the following month.
              </p>

              {/* H2: Annualization */}
              <h2 style={h2}>Year-End Tax Annualization</h2>
              <p style={{ marginBottom: "2.5rem" }}>
                In the last payroll of December, recompute each employee&apos;s income tax for the whole year, or at the last month of employment for anyone who left (RR 2-98 as amended by RR No. 11-2018). If too little was withheld, deduct the balance from the last pay of the year. If too much was withheld, refund the employee by January 25, 2027. Remember that 13th month pay and other benefits are tax-exempt only up to ₱90,000 combined, so a large December bonus can change the result. Our <Link href="/blog/year-end-tax-annualization-philippines-2026" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>year-end annualization guide</Link> walks through the computation with examples.
              </p>

              {/* H2: January */}
              <h2 style={h2}>What Is Due as Soon as January Starts</h2>
              <Table
                head={["Date", "What is due"]}
                rows={[
                  ["Jan 15, 2027", "13th Month Pay Compliance Report at reports.dole.gov.ph (expected date; it was January 15 in 2026); BIR Form 1601-C for December (manual filers)"],
                  ["Jan 11 to 20, 2027", "PhilHealth premiums for December; eFPS filing and payment of the December 1601-C"],
                  ["Jan 25, 2027", "Refunds of over-withheld tax from the annualization"],
                  ["Jan 31, 2027 (Sun)", "BIR Form 2316 to employees and BIR Form 1604-C with alphalist; next working day applies"],
                  ["Jan 31, 2027 (Sun)", "SSS contributions for December; next working day applies"],
                  ["Feb 28, 2027 (Sun)", "Signed 2316 copies to the BIR; next working day applies"],
                ]}
              />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                The BIR and DOLE sometimes extend these deadlines by circular. Check their advisories in January.
              </p>

              {/* H2: Checklist */}
              <h2 style={h2}>Q4 Payroll Checklist</h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem" }}>
                <li style={{ marginBottom: "0.75rem" }}>Update daily rates for branches in Central Visayas (October 14), Bicol, and BARMM (December 1).</li>
                <li style={{ marginBottom: "0.75rem" }}>Load the November and December holidays, including NCR&apos;s November 16 to 18, into payroll and timekeeping.</li>
                <li style={{ marginBottom: "0.75rem" }}>Compute 13th month pay from actual basic salary earned, using each month&apos;s real rate. Our <Link href="/blog/13th-month-pay-computation-philippines-2026" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>13th month pay calculator</Link> handles mid-year increases.</li>
                <li style={{ marginBottom: "0.75rem" }}>Release 13th month pay by December 24, and include prorated amounts in final pay for anyone who leaves.</li>
                <li style={{ marginBottom: "0.75rem" }}>Run the year-end annualization in the last December payroll and schedule any refunds before January 25.</li>
                <li style={{ marginBottom: "0.75rem" }}>Put the January dates on the calendar now: DOLE report, December remittances, 2316, and 1604-C.</li>
              </ol>

              {/* CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS tracks 13th month pay automatically, every payroll run, all year.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Every cutoff, the system accrues what is owed, and it flags employees whose basic pay falls below the applicable minimum wage when a wage order takes effect.
                </p>
                <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See how YAHSHUA handles year-end payroll <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
              {q4CountdownFaqs.map((f, i) => (
                <div key={f.q} style={{ marginBottom: i === q4CountdownFaqs.length - 1 ? "3rem" : "2rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published October 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Sources: <a href="https://pco.gov.ph/wp-content/uploads/2025/09/20250903-PROC-1006-FRM.pdf.pdf" target="_blank" rel="noopener noreferrer">Proclamation No. 1006, s. 2025</a>; <a href="https://www.pna.gov.ph/articles/1284634" target="_blank" rel="noopener noreferrer">Proclamation No. 1447, s. 2026</a>; DOLE Labor Advisories No. 12, s. 2025 and No. 16, s. 2026; <a href="https://bworldonline.com/the-nation/2026/09/27/782222/central-visayas-workers-to-get-p42-wage-increase-in-oct" target="_blank" rel="noopener noreferrer">DOLE on the Central Visayas wage order</a>; <a href="https://www.sss.gov.ph/pay-contribution" target="_blank" rel="noopener noreferrer">SSS</a>; <a href="https://www.philhealth.gov.ph/partners/employers/pay_procedures.php" target="_blank" rel="noopener noreferrer">PhilHealth</a>; BIR RR 2-98 as amended by RR No. 11-2018; RA 11199; RA 11223; HDMF Circular 275. Verified October 1, 2026. Confirm dates with each agency before filing. This article does not constitute legal or tax advice.
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
                  <Link href="/blog/13th-month-pay-computation-philippines-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    13th Month Pay Computation 2026: Formula and Calculator →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/minimum-wage-philippines-2026-by-region" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Minimum Wage in the Philippines 2026 by Region →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/sss-contribution-table-2026-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    2026 SSS, PhilHealth, and Pag-IBIG Contribution Rates →
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
              Close the payroll year without the December scramble.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS keeps your payroll compliant with current minimum wage floors, recomputes dependent pay items automatically, and accrues 13th month pay every cutoff.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=q4_compliance_2026"
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

export default Q4ComplianceCountdownArticle;
