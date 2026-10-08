import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

// Single source for the visible FAQ and the FAQPage schema in page.tsx
export const overtimeFaqs = [
  {
    q: "How is overtime pay computed in the Philippines?",
    a: "Divide the daily rate by 8 to get the hourly rate, then multiply by the overtime rate for the day and by the overtime hours. On an ordinary working day the rate is 125% (Labor Code Article 87). At the NCR minimum of ₱755 a day, one overtime hour is ₱94.375 × 125% = ₱117.97.",
  },
  {
    q: "What is the overtime rate on a rest day or holiday?",
    a: "Overtime on a rest day or special non-working day is 169% of the hourly rate (130% × 130%). On a regular holiday it is 260% (200% × 130%), and on a regular holiday that falls on a rest day it is 338% (260% × 130%). These multipliers come from DOLE's Handbook on Workers' Statutory Monetary Benefits.",
  },
  {
    q: "Who is not entitled to overtime pay?",
    a: "Labor Code Article 82 excludes government employees, managerial employees and members of the managerial staff, field personnel whose hours cannot be determined with reasonable certainty, dependent family members of the employer, domestic workers, persons in the personal service of another, and workers paid by results under DOLE rules. Coverage depends on actual duties, not job title.",
  },
  {
    q: "Can undertime be offset against overtime?",
    a: "No. Under Labor Code Article 88, undertime on one day cannot be offset by overtime on another day. An employee who leaves 2 hours early on Monday and works 2 hours late on Tuesday is owed 2 hours of overtime pay for Tuesday, and Monday's undertime is deducted separately.",
  },
  {
    q: "Can an employer require overtime?",
    a: "Generally no, but Labor Code Article 89 lets an employer require overtime when the country is at war or a national or local emergency has been declared; to prevent loss of life or property during an actual or impending disaster; for urgent work on machines or equipment to avoid serious loss; to prevent loss or damage to perishable goods; and to finish work started before the eighth hour when stopping would seriously obstruct or prejudice the business. Required overtime is still paid at the overtime rate.",
  },
  {
    q: "How do you compute overtime for a monthly-paid employee?",
    a: "Convert the monthly salary to a daily rate first: monthly salary × 12 ÷ the annual factor for the work schedule (commonly 261 for a 5-day week or 313 for a 6-day week). Divide the daily rate by 8 for the hourly rate, then apply the overtime rate. A ₱30,000 monthly salary on a 5-day week works out to a ₱1,379.31 daily rate and ₱172.41 hourly rate, so 2 hours of ordinary overtime is ₱431.03.",
  },
  {
    q: "Is overtime pay taxable?",
    a: "For minimum wage earners, overtime pay is exempt from income tax along with their holiday pay, night shift differential, and hazard pay. For everyone else, overtime pay is taxable compensation and does not count toward the ₱90,000 exemption for 13th month pay and other benefits.",
  },
];

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const th = { textAlign: "left" as const, padding: "0.6rem 0.75rem", color: "#6b7280", fontWeight: "600" };
const td = { padding: "0.6rem 0.75rem", color: "#374151", verticalAlign: "top" as const };
const box = { background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "1.25rem" } as const;
const mistake = { marginBottom: "1rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" } as const;
const link = { color: "hsl(var(--lp-primary))", fontWeight: 600 } as const;

const Table = ({ head, rows, rightCols = [] }: { head: string[]; rows: string[][]; rightCols?: number[] }) => (
  <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
          {head.map((h, j) => <th key={h} style={rightCols.includes(j) ? { ...th, textAlign: "right" } : th}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
            {r.map((c, j) => <td key={j} style={rightCols.includes(j) ? { ...td, textAlign: "right", whiteSpace: "nowrap" } : (j === 0 ? { ...td, color: "#111827", fontWeight: 500 } : td)}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const OvertimePayComputationArticle = () => {
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
                Overtime Pay Computation in the Philippines (2026): Rates, Formula, and ₱755 Examples
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Every overtime rate from ordinary days to double holidays, the formula for daily-paid and monthly-paid employees, peso amounts at the new NCR minimum wage, and the rules on who is covered.
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

        {/* Featured Image */}
        <div className="lp-section-container max-w-3xl mx-auto pt-10 pb-0">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "360px" }}>
            <Image
              src="/blog/overtime-pay-computation-2026.png"
              alt="Overtime pay computation in the Philippines 2026 guide"
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
                Overtime pay in the Philippines is the hourly rate (daily rate ÷ 8) multiplied by the overtime rate for the day: 125% on an ordinary working day, 169% on a rest day or special non-working day, and 260% on a regular holiday. At the Metro Manila minimum of ₱755 a day, that is ₱117.97, ₱159.49, and ₱245.38 per overtime hour.
              </p>

              {/* Formula callout */}
              <div style={{ ...box, marginBottom: "2.5rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>The formula</strong>
                </p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827", fontWeight: 600 }}>
                  Overtime pay = (daily rate ÷ 8) × overtime rate × overtime hours
                </p>
              </div>

              {/* H2: Rates */}
              <h2 style={h2}>Overtime Rates by Type of Day</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Labor Code Article 87 sets overtime at the regular rate plus at least 25% on ordinary days, and the rate for the first 8 hours plus at least 30% on rest days and holidays. DOLE&apos;s handbook turns that into these multipliers of the hourly rate:
              </p>
              <Table
                head={["Overtime worked on", "Overtime rate", "Night shift overtime"]}
                rightCols={[1, 2]}
                rows={[
                  ["Ordinary working day", "125%", "137.5%"],
                  ["Rest day", "169%", "185.9%"],
                  ["Special non-working day", "169%", "185.9%"],
                  ["Special non-working day on a rest day", "195%", "214.5%"],
                  ["Regular holiday", "260%", "286%"],
                  ["Regular holiday on a rest day", "338%", "371.8%"],
                  ["Double regular holiday", "390%", "429%"],
                ]}
              />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                Night shift overtime covers overtime hours between 10:00 PM and 6:00 AM and adds the 10% night shift differential. Source: DOLE Bureau of Working Conditions, Handbook on Workers&apos; Statutory Monetary Benefits. For the first 8 hours on these days, see our <Link href="/blog/philippine-holiday-pay-computation-guide" style={link}>holiday pay guide</Link> and <Link href="/blog/night-differential-holiday-pay-philippines" style={link}>night differential guide</Link>.
              </p>

              {/* H2: Peso table */}
              <h2 style={h2}>Overtime Pay per Hour at the 2026 NCR Minimum Wage</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Wage Order NCR-28 set the Metro Manila minimum at ₱755 a day (₱718 for the lower category) from September 26, 2026. Per overtime hour:
              </p>
              <Table
                head={["Overtime on", "₱755 daily rate", "₱718 daily rate"]}
                rightCols={[1, 2]}
                rows={[
                  ["Ordinary working day (125%)", "₱117.97", "₱112.19"],
                  ["Ordinary day, night shift (137.5%)", "₱129.77", "₱123.41"],
                  ["Rest day or special day (169%)", "₱159.49", "₱151.68"],
                  ["Special day on a rest day (195%)", "₱184.03", "₱175.01"],
                  ["Regular holiday (260%)", "₱245.38", "₱233.35"],
                  ["Regular holiday on a rest day (338%)", "₱318.99", "₱303.36"],
                  ["Double regular holiday (390%)", "₱368.06", "₱350.03"],
                ]}
              />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                Computed from the unrounded hourly rates of ₱94.375 and ₱89.75. For other regions, start from the daily rate in our <Link href="/blog/minimum-wage-philippines-2026-by-region" style={link}>minimum wage by region guide</Link>.
              </p>

              {/* H2: Worked examples */}
              <h2 style={h2}>Worked Examples</h2>
              <div style={box}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>Example 1: 3 hours of overtime on an ordinary day</p>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>A Metro Manila employee on ₱755 a day works 11 hours on a Tuesday. Overtime: ₱94.375 × 125% × 3 hours = <strong>₱353.91</strong>, on top of the ₱755 daily wage.</p>
              </div>
              <div style={box}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>Example 2: 10 hours on Bonifacio Day</p>
                <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem" }}>The same employee works 10 hours on Monday, November 30, 2026, a regular holiday that is not their rest day.</p>
                <Table
                  head={["Item", "Amount"]}
                  rightCols={[1]}
                  rows={[
                    ["First 8 hours: ₱755 × 200%", "₱1,510.00"],
                    ["Overtime: ₱94.375 × 260% × 2 hours", "₱490.75"],
                    ["Total for the day", "₱2,000.75"],
                  ]}
                />
              </div>
              <div style={box}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>Example 3: 10 hours on a rest day</p>
                <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem" }}>The employee is called in for 10 hours on their scheduled rest day.</p>
                <Table
                  head={["Item", "Amount"]}
                  rightCols={[1]}
                  rows={[
                    ["First 8 hours: ₱755 × 130%", "₱981.50"],
                    ["Overtime: ₱94.375 × 169% × 2 hours", "₱318.99"],
                    ["Total for the day", "₱1,300.49"],
                  ]}
                />
              </div>
              <div style={{ ...box, marginBottom: "2.5rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>Example 4: a monthly-paid employee</p>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>An employee earns ₱30,000 a month on a Monday-to-Friday schedule. Daily rate: ₱30,000 × 12 ÷ 261 = ₱1,379.31. Hourly rate: ₱172.41. Two hours of ordinary-day overtime: ₱172.41 × 125% × 2 = <strong>₱431.03</strong>.</p>
              </div>

              {/* H2: Monthly-paid */}
              <h2 style={h2}>Daily Rate for Monthly-Paid Employees</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Overtime always starts from a daily rate. For monthly-paid employees, convert with the annual factor that matches the work schedule:
              </p>
              <Table
                head={["Work schedule", "Daily rate formula"]}
                rows={[
                  ["Monday to Friday (5-day week)", "Monthly salary × 12 ÷ 261"],
                  ["Monday to Saturday (6-day week)", "Monthly salary × 12 ÷ 313"],
                  ["Paid for every calendar day, including rest days", "Monthly salary × 12 ÷ 365"],
                ]}
              />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                The factor should reflect the days the salary actually pays for, including paid holidays. Use the same factor consistently for overtime, holiday pay, and absences.
              </p>

              {/* H2: Rules */}
              <h2 style={h2}>Overtime Rules Employers Get Wrong</h2>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Offsetting undertime.</strong> Undertime on one day cannot cancel overtime on another (Labor Code Article 88). Giving an employee time off later in the week does not remove the obligation to pay overtime premiums.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Applying 125% on rest days and holidays.</strong> Overtime on those days builds on that day&apos;s premium rate, so it is 169%, 260%, or 338%, not 125%.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Treating job titles as exemptions.</strong> Only employees who are actually managerial, managerial staff, or field personnel under Article 82 are excluded. A supervisor title alone does not remove overtime entitlement.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Forcing overtime outside emergencies.</strong> Article 89 lists the situations where an employer can require overtime, such as preventing loss of life or property or serious loss of perishable goods. Outside them, overtime is voluntary.
              </p>
              <p style={{ ...mistake, marginBottom: "2.5rem" }}>
                <strong style={{ color: "#111827" }}>Keeping the old daily rate.</strong> When a wage order raises the minimum, overtime rates rise with it from the effective date. In Metro Manila, overtime from September 26, 2026 is computed on ₱755, not ₱695. See our <Link href="/blog/ncr-minimum-wage-2026" style={link}>NCR minimum wage guide</Link>.
              </p>

              {/* H2: Tax */}
              <h2 style={h2}>Is Overtime Pay Taxable?</h2>
              <p style={{ marginBottom: "2.5rem" }}>
                For minimum wage earners, no: their overtime pay, holiday pay, night shift differential, and hazard pay are exempt from income tax along with the statutory minimum wage. For other employees, overtime pay is taxable compensation and is not part of the ₱90,000 exemption for 13th month pay and other benefits. It flows into the December <Link href="/blog/year-end-tax-annualization-philippines-2026" style={link}>year-end tax annualization</Link>.
              </p>

              {/* CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA Payroll is included in every YAHSHUA HRIS plan.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Overtime, holiday, and night differential computed from attendance and the employee&apos;s current daily rate, with HR and payroll synced in real time.
                </p>
                <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See what is included <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
              {overtimeFaqs.map((f, i) => (
                <div key={f.q} style={{ marginBottom: i === overtimeFaqs.length - 1 ? "3rem" : "2rem" }}>
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
                  Sources: <a href="https://lawphil.net/statutes/presdecs/pd1974/pd_442_1974.html" target="_blank" rel="noopener noreferrer">Labor Code of the Philippines</a>, Articles 82 to 90 and 94; <a href="https://bwc.dole.gov.ph/wp-content/uploads/2024/10/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf" target="_blank" rel="noopener noreferrer">DOLE Handbook on Workers&apos; Statutory Monetary Benefits</a>; Wage Order No. NCR-28; the TRAIN Law (RA 10963) on minimum wage earner exemptions. Verified October 8, 2026. This article does not constitute legal advice.
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
                    Metro Manila Minimum Wage 2026: NCR-28 Rates →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/philippine-holiday-pay-computation-guide" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Holiday Pay Computation Guide →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/night-differential-holiday-pay-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Night Differential and Holiday Pay Stacking →
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
              Stop computing overtime by hand.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS and Payroll applies the right rate for every type of day, so holiday season payroll comes out right the first time.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=overtime_pay_2026"
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

export default OvertimePayComputationArticle;
