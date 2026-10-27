import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const th = { padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" } as const;
const tableWrap = { overflowX: "auto", marginBottom: "1.5rem" } as const;
const table = { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" } as const;
const rowStyle = (i: number) => ({ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" });

const EmployeeVsContractorArticle = () => {
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
                Employee vs. Independent Contractor: How DOLE Classification Rules Affect Your Payroll Risk
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Calling a worker a contractor does not make them one. Here is how Philippine courts and DOLE tell the difference, what changes when the worker is actually supplied by an agency, and what a wrong call costs on payroll.
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
                In the Philippines, a worker is an employee or an independent contractor based on how the work is actually done, not on the contract label. Courts apply the four-fold test (hiring, wages, power to dismiss, and control over how the work is done) together with economic dependence, and the company that calls someone a contractor must prove it.
              </p>

              {/* Callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>The contract label does not decide it.</strong> In <em>Ditiangkin v. Lazada E-Services Philippines</em> (G.R. No. 246892, September 21, 2022), delivery riders signed &ldquo;Independent Contractor Agreements&rdquo; and were paid a daily service fee. The Supreme Court still held that they were regular employees and ordered their reinstatement with full backwages.
                </p>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2.5rem" }}>
                Classification is a payroll question as much as a legal one. An employee is owed minimum wage, 13th month pay, and government contributions, and a contractor is not. Get it wrong, and the bill arrives all at once, for every month the worker was on the wrong side of the line.
              </p>

              {/* H2: Tests */}
              <h2 style={h2}>The Tests Courts Use</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Philippine courts look for an employer-employee relationship using the four-fold test. If one is not enough to settle it, they also weigh economic reality, meaning whether the worker depends on the company for continued work in that line of business.
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Test</th>
                      <th style={{ ...th, textAlign: "left" }}>The question</th>
                      <th style={{ ...th, textAlign: "left" }}>Points to employment when</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: "Selection and engagement", q: "Who picked and hired the worker?", p: "The company recruited, interviewed, or onboarded the worker directly." },
                      { t: "Payment of wages", q: "Who pays, and how?", p: "The company pays a fixed daily or monthly amount, not a price for a finished result." },
                      { t: "Power to dismiss", q: "Who can end the arrangement?", p: "The company can remove the worker or end the contract at will." },
                      { t: "Power of control", q: "Who decides how the work is done?", p: "The company has the right to direct the means and methods, not just the result." },
                      { t: "Economic dependence", q: "Does the worker rely on this company to earn a living in this line of work?", p: "The worker has no real business of their own and depends on the company for work." },
                    ].map((row, i) => (
                      <tr key={i} style={rowStyle(i)}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.t}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.q}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem" }}>
                Control is the most important factor. The test is the <em>right</em> to control, so a company does not have to supervise the worker every day. It is enough that it could. Rules about the quality of the result do not count as control, but rules about schedules, methods, and supervision do.
              </p>

              {/* H2: At a glance */}
              <h2 style={h2}>Employee vs. Independent Contractor at a Glance</h2>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Factor</th>
                      <th style={{ ...th, textAlign: "left" }}>Independent contractor</th>
                      <th style={{ ...th, textAlign: "left" }}>Employee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { f: "How the work is done", c: "Worker decides the method, answers only for the result", e: "Company directs the schedule, methods, and supervision" },
                      { f: "Business of their own", c: "Carries on a distinct, independent business, often with other clients", e: "Works only or mainly for one company" },
                      { f: "Skill", c: "Brings a unique skill or talent the company hired them for", e: "Does work that needs no special skill or that is routine to the company" },
                      { f: "Pay", c: "Quoted price per project or deliverable, invoiced", e: "Daily or monthly rate for time worked" },
                      { f: "Ending the engagement", c: "Governed by the contract terms", e: "Company can remove the worker, subject to security of tenure" },
                    ].map((row, i) => (
                      <tr key={i} style={rowStyle(i)}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.f}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.c}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.e}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem", fontSize: "0.9rem", color: "#6b7280" }}>
                These are signals, not a scorecard. Courts weigh the whole arrangement, and one strong sign of control can outweigh several signs of independence. In <em>Ditiangkin</em>, the Court noted that picking up and delivering goods needs no special skill, and that the riders were hired directly, paid by the company, and subject to its control.
              </p>

              {/* H2: Two kinds */}
              <h2 style={h2}>Two Different Kinds of &ldquo;Contractor&rdquo;</h2>
              <p style={{ marginBottom: "1rem" }}>
                The Supreme Court recognizes two types of contractor, and they follow different rules:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Independent contractors with unique skills or talent.</strong> A two-party relationship between your company and an individual. The four-fold and economic dependence tests above decide whether it is real.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Legitimate job contractors.</strong> A three-party relationship where an agency supplies workers to you. Articles 106 to 109 of the Labor Code and DOLE Department Order No. 174, Series of 2017 (DO 174-17) decide whether it is legal.</li>
              </ul>

              {/* H2: DO 174 */}
              <h2 style={h2}>If an Agency Supplies the Workers: DO 174-17</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Manpower and outsourcing arrangements are generally lawful only when the contractor is a genuine one. DO 174-17 draws the line between legitimate job contracting and prohibited labor-only contracting. The requirements below summarize the order as issued in 2017, and DOLE can amend them, so treat this as a starting point and confirm the current rules with DOLE.
              </p>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Requirement</th>
                      <th style={{ ...th, textAlign: "left" }}>What a legitimate contractor must show</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { r: "Substantial capital", d: "At least ₱5,000,000 in paid-up capital (corporation, partnership, or cooperative) or net worth (sole proprietorship), plus investment in tools, equipment, and work premises." },
                      { r: "Control over the workers", d: "The contractor, not you, hires, supervises, and directs its own employees." },
                      { r: "DOLE registration", d: "A certificate of registration from the DOLE regional office. The registration fee is ₱100,000 and the certificate is valid for two years." },
                    ].map((row, i) => (
                      <tr key={i} style={rowStyle(i)}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.r}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "1rem" }}>
                DO 174-17 prohibits labor-only contracting, which it describes in two situations:
              </p>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.5rem" }}>The contractor has no substantial capital or investment in tools, equipment, and premises, <strong style={{ color: "#111827" }}>and</strong> its workers do work directly related to your main business.</li>
                <li style={{ marginBottom: "0.5rem" }}>The contractor does not exercise the right of control over how its workers do their work.</li>
              </ol>
              <p style={{ marginBottom: "2.5rem" }}>
                The consequence depends on the case. In a legitimate arrangement, you can still be jointly and severally liable with the contractor for its workers&apos; wages if the contractor fails to pay them (Article 106). Where the arrangement is found to be labor-only, the contractor is generally treated as your agent and you can be held responsible to the workers as if you employed them directly. Whether an arrangement falls on one side of the line depends on its facts, so do your own due diligence on each contractor before you sign.
              </p>

              {/* H2: Payroll cost */}
              <h2 style={h2}>What Misclassification Costs on Payroll</h2>
              <p style={{ marginBottom: "1rem" }}>
                If a worker is found to be an employee, the question becomes what you did not pay and did not remit while they were treated as a contractor:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}>Minimum wage, overtime, holiday pay, and night differential where they apply</li>
                <li style={{ marginBottom: "0.5rem" }}>
                  13th month pay (see our{" "}
                  <Link href="/blog/13th-month-pay-computation-philippines-2026" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>13th month pay guide</Link>)
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  SSS, PhilHealth, and Pag-IBIG contributions, with the penalties for late remittance (see{" "}
                  <Link href="/blog/sss-philhealth-pagibig-late-remittance-penalties" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>late remittance penalties</Link>)
                </li>
                <li style={{ marginBottom: "0.5rem" }}>Security of tenure, so ending the relationship becomes a dismissal that needs a valid cause</li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                In <em>Ditiangkin</em>, ending the riders&apos; engagement was held to be illegal dismissal, and the Court ordered reinstatement and full backwages, with separation pay in addition if reinstatement was no longer feasible. Once a worker is confirmed as an employee, the usual hiring rules apply to them, including the probationary and regularization rules in our guide to{" "}
                <Link href="/blog/probationary-to-regular-employee-philippines" style={{ color: "hsl(var(--lp-primary))", fontWeight: 600 }}>probationary to regular employees</Link>.
              </p>

              {/* H2: Checklist */}
              <h2 style={h2}>A Classification Checklist for HR and Payroll</h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Ask who controls the how.</strong> If your managers set the schedule, the method, and the supervision, treat the worker as an employee, whatever the contract says.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Write a results-based service agreement</strong> for real independent contractors: the deliverable, the price, the timeline, and who supplies the tools.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Check the work itself.</strong> Routine work that needs no special skill and sits at the core of your business is hard to defend as independent.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Do your due diligence on every agency.</strong> Ask for the DOLE certificate of registration and proof of capital, and confirm both are current with DOLE before the service agreement is signed.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Keep records and review yearly.</strong> The company bears the burden of proof, so file the contract, invoices, and registration proof, and re-check each arrangement once a year.</li>
              </ol>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  Once a worker is an employee, the records and the pay follow.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  YAHSHUA HRIS keeps each employee&apos;s 201 file in one place, from hire date to present. YAHSHUA Payroll, included with HRIS, computes SSS, PhilHealth, Pag-IBIG, and BIR withholding and generates payslips.
                </p>
                <Link href="/blog/payroll-registration-checklist-philippines" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See the payroll setup checklist for new employers <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How do you tell an employee from an independent contractor in the Philippines?
                </h3>
                <p>
                  Courts apply the four-fold test: who selected and engaged the worker, who pays the wages, who can dismiss, and who has the right to control how the work is done. Control is the most important factor. They also consider economic dependence, meaning whether the worker relies on the company for continued work in that line of business.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Does a signed independent contractor agreement make someone a contractor?
                </h3>
                <p>
                  No. The label does not decide the relationship. In Ditiangkin v. Lazada E-Services Philippines (G.R. No. 246892, September 21, 2022), riders who signed independent contractor agreements were held to be regular employees, and the Court held that the company bears the burden of proving that a worker is an independent contractor.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is labor-only contracting?
                </h3>
                <p>
                  It is a prohibited arrangement under DOLE Department Order No. 174-17. It exists when the contractor has no substantial capital or investment in tools, equipment, and premises and its workers do work directly related to the principal&apos;s main business, or when the contractor does not exercise the right of control over its workers. The principal is then responsible to the workers as if it employed them directly.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How much capital must a legitimate contractor have under DO 174-17?
                </h3>
                <p>
                  As issued in 2017, DO 174-17 requires at least ₱5,000,000 in paid-up capital for a corporation, partnership, or cooperative, or in net worth for a sole proprietorship. The contractor must also be registered with the DOLE regional office, with a ₱100,000 registration fee and a certificate valid for two years. DOLE can amend these figures, so confirm the current requirements with DOLE and check your contractor&apos;s registration yourself.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What happens if a contractor is reclassified as an employee?
                </h3>
                <p>
                  The company becomes liable for what an employee is owed, including minimum wage, 13th month pay, and SSS, PhilHealth, and Pag-IBIG contributions, and ending the relationship becomes a dismissal that needs a valid cause. If the dismissal is illegal, the remedy is reinstatement with full backwages, or separation pay in addition to backwages if reinstatement is no longer feasible.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published October 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Based on Articles 106 to 109 of the Labor Code, DOLE Department Order No. 174, Series of 2017, <em>Francisco v. NLRC</em> (G.R. No. 170087, August 31, 2006), and <em>Ditiangkin v. Lazada E-Services Philippines, Inc.</em> (G.R. No. 246892, September 21, 2022). This article is general information. Classification is decided case by case on the facts, and DOLE rules change, so do your own due diligence and confirm the current rules with DOLE, or with counsel if you choose, before classifying a worker or engaging an agency. It does not constitute legal advice.
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
                  <Link href="/blog/probationary-to-regular-employee-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Probationary to Regular: The 6-Month Regularization Timeline →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/dole-compliance-requirements-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    DOLE Compliance Requirements for Philippine Employers →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/sss-philhealth-pagibig-late-remittance-penalties" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    SSS, PhilHealth, and Pag-IBIG Late Remittance Penalties →
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
              Bringing contractors onto payroll?
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Book a free demo and ask how YAHSHUA HRIS and Payroll handles employee records and pay from the first day of work.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=employee_vs_contractor"
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

export default EmployeeVsContractorArticle;
