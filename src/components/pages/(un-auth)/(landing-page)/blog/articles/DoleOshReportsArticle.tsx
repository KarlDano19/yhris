import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const DEMO_URL = "https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=dole_osh_reports";

// Single source for the visible FAQ and the FAQPage schema in page.tsx
export const doleOshReportsFaqs = [
  {
    q: "What is the deadline of submission of the WAIR?",
    a: "The Employer's Work Accident/Illness Report (WAIR) is due on the 30th of every month under DOLE Department Order No. 252-25. It must be submitted even in a month with no accident, reportable illness, or dangerous occurrence.",
  },
  {
    q: "Do we still submit a WAIR if there were no accidents?",
    a: "Yes. DO 252-25 requires the WAIR every month regardless of whether any accident, reportable work-related illness, or dangerous occurrence happened. A zero-incident month still needs a submitted report.",
  },
  {
    q: "What is the deadline for the Annual Work Accident/Illness Exposure Data Report (AEDR)?",
    a: "January 30 of the following year, again regardless of whether any incident occurred. For the 2026 data, the AEDR is due January 30, 2027, which is a Saturday, so plan to submit online before then.",
  },
  {
    q: "What is the deadline for the Annual Medical Report (AMR)?",
    a: "March 31 following the reporting year. For 2026, the AMR is due March 31, 2027.",
  },
  {
    q: "When must a fatal or major accident be reported to DOLE?",
    a: "Within 24 hours. DO 252-25 requires employers to report accidents, disabling injuries, imminent dangers, and dangerous occurrences to the DOLE office with jurisdiction over the workplace within 24 hours, and a fatality or permanent total disability must be reported to the DOLE Regional Office within 24 hours from occurrence. This is separate from the monthly WAIR.",
  },
  {
    q: "Where are the WAIR, AEDR, and AMR submitted?",
    a: "Through the DOLE Online Compliance Portal or the DOLE regional office with jurisdiction over the establishment, as provided in DO 252-25.",
  },
  {
    q: "What is the penalty for not submitting the WAIR, AEDR, or AMR?",
    a: "The administrative fine for failing to prepare, keep, and submit these reports is ₱1,000 for the first offense, ₱2,000 for the second, and ₱3,000 for the third (DO 252-25, Section 42). The fines are imposed daily until the violation is corrected, and the total penalty may not exceed ₱100,000 per day. Violations that result in death or serious injury can carry additional penalties.",
  },
  {
    q: "Does DO 252-25 apply to small businesses?",
    a: "Yes. DO 252-25 covers all establishments, projects, and work sites regardless of industry or location, including economic zones and contracting or subcontracting arrangements. It took effect on May 16, 2025 and replaced DO 198-18.",
  },
  {
    q: "Is the AERW the same as these safety reports?",
    a: "No. The Annual Establishment Report on Wages (AERW) is a wage report, not an OSH report. Its submission window is set each year: the 2025 report was open from May 15 to August 31, 2026 under Labor Advisory No. 08-26. It does not have a fixed January date.",
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

const DoleOshReportsArticle = () => {
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
                DOLE Safety Report Deadlines: WAIR, AEDR, and AMR Under DO 252-25
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                When each report is due, where it is filed, what to do within 24 hours of a serious accident, and what a missed submission costs. With the dates for the rest of 2026 and early 2027.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>October 2026</span>
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
              src="/blog/dole-safety-report-deadlines-2026.png"
              alt="DOLE safety report deadlines WAIR, AEDR, and AMR guide"
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
                Under DOLE Department Order No. 252-25, in effect since May 16, 2025, Philippine employers submit three safety reports: the Work Accident/Illness Report (WAIR) on the 30th of every month, the Annual Work Accident/Illness Exposure Data Report (AEDR) by January 30, and the Annual Medical Report (AMR) by March 31. All three are required even when nothing happened, and each missed submission can be fined ₱1,000, ₱2,000, or ₱3,000 for a first, second, or third offense, imposed daily until corrected.
              </p>

              {/* Deadlines table */}
              <h2 style={h2}>The Three Reports and Their Deadlines</h2>
              <Table
                head={["Report", "What it covers", "Deadline", "Required if no incident?"]}
                rows={[
                  ["WAIR", "Employer's Work Accident/Illness Report", "30th of every month", "Yes"],
                  ["AEDR", "Annual Work Accident/Illness Exposure Data", "January 30", "Yes"],
                  ["AMR", "Annual Medical Report", "March 31", "Yes"],
                ]}
              />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1.5rem" }}>
                All three are submitted through the DOLE Online Compliance Portal or the DOLE regional office with jurisdiction over your establishment. Source: DO 252-25, the Revised Implementing Rules of RA 11058.
              </p>

              {/* Mid-article demo CTA */}
              <div style={{ ...box, marginBottom: "2.5rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>
                  Tired of tracking the 30th by hand?
                </p>
                <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem" }}>
                  YAHSHUA HRIS generates your WAIR and Annual Medical Report directly from your HR data, and its guided DOLE module walks your team through OSH reports.
                </p>
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
                  style={{ color: "hsl(38, 92%, 38%)" }}
                >
                  Book a free demo <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Upcoming dates */}
              <h2 style={h2}>Your Next Deadlines, October 2026 to March 2027</h2>
              <Table
                head={["Date", "Day", "What is due"]}
                rows={[
                  ["October 30, 2026", "Friday", "WAIR"],
                  ["November 30, 2026", "Monday (Bonifacio Day)", "WAIR"],
                  ["December 30, 2026", "Wednesday (Rizal Day)", "WAIR"],
                  ["January 30, 2027", "Saturday", "WAIR and AEDR for 2026"],
                  ["March 31, 2027", "Wednesday", "AMR for 2026"],
                ]}
              />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                November 30 and December 30 are regular holidays and January 30 is a Saturday. Because the portal accepts online submissions, the safest habit is to file a few days early rather than rely on a next-working-day extension. Confirm any extension with your DOLE regional office.
              </p>

              {/* 24-hour rule */}
              <h2 style={h2}>Serious Accidents Cannot Wait for the 30th</h2>
              <p style={{ marginBottom: "1rem" }}>
                The WAIR is a monthly report, but DO 252-25 also requires employers to report accidents, disabling injuries, imminent dangers, and dangerous occurrences to the DOLE office with jurisdiction over the workplace <strong>within 24 hours</strong>. A fatality or permanent total disability must be reported to the DOLE Regional Office within 24 hours from occurrence.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Do not confuse the two.</strong> The 24-hour notice tells DOLE about a serious event as it happens. The monthly WAIR is the routine record that follows. Filing one does not replace the other.
              </p>

              {/* Penalties */}
              <h2 style={{ ...h2, marginTop: "2.5rem" }}>What a Missed Report Costs</h2>
              <Table
                head={["Violation", "1st offense", "2nd offense", "3rd offense"]}
                rightCols={[1, 2, 3]}
                rows={[
                  ["Failure to prepare, keep, and submit the WAIR, AEDR, or AMR", "₱1,000", "₱2,000", "₱3,000"],
                ]}
              />
              <p style={{ marginBottom: "1rem" }}>
                Under Section 42 of DO 252-25, these administrative fines are imposed daily until the violation is corrected, and the total penalty may not exceed ₱100,000 per day. Willful violations of OSH standards, and violations that result in death or serious injury, can carry far heavier penalties. The same order also lists fines for other gaps, such as having no first aider or no safety officer.
              </p>
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                Our broader <Link href="/blog/dole-compliance-requirements-philippines" style={link}>DOLE compliance guide</Link> covers the EC logbook, OSH program, and inspection process.
              </p>

              {/* Who is covered */}
              <h2 style={h2}>Who Has to File</h2>
              <p style={{ marginBottom: "2.5rem" }}>
                DO 252-25 applies to all establishments, projects, and work sites regardless of industry or location, including enterprises in economic zones and contracting or subcontracting arrangements. The order does not limit coverage by industry or location. If you are unsure whether a requirement applies to your business, confirm with your DOLE regional office.
              </p>

              {/* Mistakes */}
              <h2 style={h2}>Common Mistakes</h2>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Filing only after an incident.</strong> The WAIR is due every month, including months with no accident or illness. A skipped zero-incident month is still a missed report.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Mixing up the AEDR and the AMR.</strong> The AEDR (January 30) is about accident and illness data. The AMR (March 31) summarizes the health services provided to employees. They have different deadlines and different content.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Treating the AERW as an OSH report.</strong> The wage report (AERW) has its own yearly window; the 2025 report was open from May 15 to August 31, 2026 (Labor Advisory No. 08-26). It is not one of the three safety reports above.
              </p>
              <p style={{ ...mistake, marginBottom: "2.5rem" }}>
                <strong style={{ color: "#111827" }}>Waiting for the 30th.</strong> With November 30 and December 30 falling on holidays and January 30 on a Saturday, last-day filing is risky.
              </p>

              {/* Routine */}
              <h2 style={h2}>A Simple Monthly Routine</h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Log incidents as they happen,</strong> with the date, person, and nature of the event, so the month-end report is a summary and not a reconstruction.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Prepare the WAIR by the 25th.</strong> Review the month&apos;s log with your safety officer or HR lead.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Submit before the 30th</strong> through the Online Compliance Portal and save the confirmation.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Mark January 30 and March 31</strong> on the shared HR calendar with reminders two weeks ahead.</li>
              </ol>

              {/* CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  See how the DOLE module handles this for you.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  YAHSHUA HRIS includes a guided DOLE module in every plan, from company registration to OSH reports, so your records and your reports come from the same system.
                </p>
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
                  style={{ color: "hsl(38, 92%, 38%)" }}
                >
                  Book a free demo <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
              {doleOshReportsFaqs.map((f, i) => (
                <div key={f.q} style={{ marginBottom: i === doleOshReportsFaqs.length - 1 ? "3rem" : "2rem" }}>
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
                  Sources: <a href="https://dole.gov.ph/php_assets/uploads/2025/05/Department-Order-252-25.pdf" target="_blank" rel="noopener noreferrer">DOLE Department Order No. 252-25</a> (Revised IRR of RA 11058), including Section 42 on administrative fines; <a href="https://bwc.dole.gov.ph/timely-submission-of-osh-compliance-reports-strengthens-dole-policies-and-worker-protection" target="_blank" rel="noopener noreferrer">DOLE Bureau of Working Conditions advisory on OSH reports</a>; <a href="https://dole.gov.ph/php_assets/uploads/2026/05/Labor-Advisory-No.-08-26-2025-Annual-Establishment-Report-on-Wages-AERW.pdf" target="_blank" rel="noopener noreferrer">Labor Advisory No. 08-26</a> on the AERW. Verified October 15, 2026. This article does not constitute legal advice; confirm your obligations with DOLE.
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
                  <Link href="/blog/dole-compliance-requirements-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    DOLE Compliance Requirements Every Philippine Employer Must Know →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/q4-payroll-compliance-deadlines-philippines-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Q4 2026 Payroll Deadlines: Your Compliance Countdown →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/philippine-compliance-hris-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Philippine Compliance 2026: One System, Not Five Checklists →
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
              Never scramble for the 30th again.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS and Payroll keeps your incident records, employee data, and DOLE reports in one system, so every deadline starts from clean records.
            </p>
            <a
              href={DEMO_URL}
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

export default DoleOshReportsArticle;
