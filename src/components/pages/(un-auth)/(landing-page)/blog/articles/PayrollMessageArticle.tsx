import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const PayrollMessageArticle = () => {
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
                Payroll & HR
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-6" style={{ lineHeight: "1.25" }}>
                Your Payroll Is a Message to Your Team
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Accurate, on-time payroll is not an administrative function. It is one of the most consistent, recurring acts of leadership a business owner performs — and your employees are reading it every single cycle.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>June 2026</span>
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
                src="/blog/payroll-message.png"
                alt="Your Payroll Is a Message to Your Team"
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

              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2rem" }}>
                Every payday, your employees are reading something.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Not the payslip. Not the breakdown of deductions. They are reading you — what you think of them, whether you see them, whether you meant what you said when you hired them.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                A payroll that is late says: you were not our priority this week. A payroll with errors says: we do not track your compensation carefully enough to get it right. A payroll that is correct, on time, every single cycle — that says something else entirely. It says: we are paying attention. We honor what we owe you.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                That is what payroll really is. It is not an administrative function. It is one of the most consistent, recurring acts of leadership a business owner performs.
              </p>

              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                The Weight Behind the Number
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                A lot of business owners in the Philippines did not start their company to spend three days processing payroll. They started because they had something to build — a service to offer, a product to sell, a community to serve.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                And then the headcount grew, and suddenly payroll became a project.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Gather timesheets. Cross-reference attendance. Compute mandatory contributions — SSS at 15% of the Monthly Salary Credit (employer 10%, employee 5%), PhilHealth at 5% of monthly basic salary (split equally, minimum ₱500, maximum ₱5,000 per month), Pag-IBIG at 2% each up to a fund salary of ₱10,000. Apply the correct BIR withholding table under the TRAIN Law. Apply the holiday rates. Catch the late entries. Track the loans. Run the gross pay. Net it down. Generate the payslips. Remit contributions by the 10th of the following month. File the BIR returns on schedule.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                In a growing business, this process can consume days. And every hour your HR officer or Finance Manager spends chasing payroll data is an hour they are not spending on your people — on onboarding, on coaching, on building the workplace culture that keeps your best employees from leaving. That is the hidden cost nobody puts on a spreadsheet.
              </p>

              {/* Contribution rates reference */}
              <div style={{ background: "rgba(255,193,7,0.04)", border: "1px solid rgba(255,193,7,0.2)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ fontWeight: "700", color: "#111827", marginBottom: "1rem", fontSize: "0.95rem" }}>2026 Mandatory Contribution Rates (Philippines)</p>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                        <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "#6b7280", fontWeight: "600" }}>Contribution</th>
                        <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "#6b7280", fontWeight: "600" }}>Employer</th>
                        <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "#6b7280", fontWeight: "600" }}>Employee</th>
                        <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "#6b7280", fontWeight: "600" }}>Remittance deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "SSS", employer: "10% of MSC", employee: "5% of MSC", deadline: "10th of following month" },
                        { name: "PhilHealth", employer: "2.5% (min ₱250, max ₱2,500)", employee: "2.5% (min ₱250, max ₱2,500)", deadline: "10th of following month" },
                        { name: "Pag-IBIG", employer: "2% (max ₱200)", employee: "2% (max ₱200)", deadline: "10th of following month" },
                        { name: "BIR withholding", employer: "Withheld and remitted", employee: "Per TRAIN Law graduated table", deadline: "Per BIR filing schedule" },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", background: i % 2 === 0 ? "rgba(255,193,7,0.02)" : "transparent" }}>
                          <td style={{ padding: "0.5rem 0.75rem", fontWeight: "600", color: "#111827" }}>{row.name}</td>
                          <td style={{ padding: "0.5rem 0.75rem", color: "#374151" }}>{row.employer}</td>
                          <td style={{ padding: "0.5rem 0.75rem", color: "#374151" }}>{row.employee}</td>
                          <td style={{ padding: "0.5rem 0.75rem", color: "#6b7280" }}>{row.deadline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ margin: "0.75rem 0 0", fontSize: "0.8rem", color: "#9ca3af" }}>SSS MSC ceiling: ₱35,000. PhilHealth ceiling: ₱100,000 monthly basic salary. Pag-IBIG max fund salary: ₱10,000.</p>
              </div>

              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                When Payroll Becomes a Source of Stress for Your Employees
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Salary delays hurt more than people say out loud.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                When an employee does not receive their pay on time, they do not file a formal complaint on day one. They absorb it. They cover the gap — a borrowed amount from a family member, a deferred bill, a quiet conversation with a spouse about making it through the week. They show up the next day and say nothing.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                But something changes. The trust shifts. The loyalty calculates itself differently. And when the next opportunity comes — the recruiter's message, the competitor's offer — the employee who was inconvenienced once too often says yes.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Payroll errors carry the same weight, even when they are eventually corrected. Because what an employee registers is not the correction. It is the fact that the error happened.
              </p>
              <p style={{ marginBottom: "2.5rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                One Philippine business we worked with had accumulated over ₱480,000 in payroll errors before they realized how deep the problem ran. No single month felt catastrophic. No single mistake looked dramatic. It was a quiet accumulation — slightly wrong computations, missed holiday rates, deductions applied to the wrong period — building across months until someone ran the audit.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                That is what payroll stress looks like from the inside: not a crisis, but a slow erosion.
              </p>

              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                What Accurate, Automated Payroll Actually Gives You
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                When payroll works the way it should, you stop thinking about it.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                That is the gift. Not the feature. Not the dashboard. The fact that on payday, everything is already done.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Every SSS contribution computed at the correct rate. Every PhilHealth deduction on the right schedule. Every BIR withholding table applied accurately. Every holiday premium factored in. Every payslip generated and distributed. Contribution remittances ready by the 10th — not scrambled together at the last minute, but already in order because the system was already running.
              </p>
              <p style={{ marginBottom: "2.5rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                One of our clients — a business that had been running payroll manually for years — told us their three-day payroll process was down to hours within weeks of onboarding. The same payroll. The same number of employees. Dramatically less time. Zero compliance errors. What did that give their HR team? Presence — the kind of presence that only exists when you are not drowning in computation.
              </p>

              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Built for Philippine Compliance. From Day One.
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                YAHSHUA HRIS was not built somewhere else and adapted for the Philippines. It was built here, for this — for the SSS contribution schedules your HR team checks every quarter, for the BIR withholding tables that update with every regulatory change, for the DOLE holiday rate tables that determine whether a payday is compliant or a liability.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Philippine compliance is not a feature we added. It is the foundation we built on.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                And because every contribution, every filing, every rate table is automated inside the platform, your team is not responsible for keeping up with every regulatory update that comes out of SSS, PhilHealth, Pag-IBIG, or BIR. The system handles it. Your people focus on your people.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Clients like Del Monte Philippines have experienced what this looks like at scale — accurate payroll, automated compliance, and an HR team that has been freed to do more than manage a process.
              </p>

              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                The Message You Want to Send
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Every business owner has said some version of the same thing: my people are my most important asset.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                Payroll is how you prove it. Not in a speech. Not in a mission statement on the wall. In the consistent, reliable, on-time, accurate act of honoring what you owe.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                If your current payroll process is costing your team three days every cycle — if there is stress, if there are errors, if compliance is something you are managing instead of something that is managed for you — now is the right time to change that. Not because the tool matters. But because your people do.
              </p>

              {/* FAQ */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What are the mandatory payroll contributions in the Philippines in 2026?
                </h3>
                <p>
                  Philippine employers must remit four mandatory contributions every payroll cycle: SSS at 15% of the Monthly Salary Credit (employer 10%, employee 5%; MSC ceiling ₱35,000), PhilHealth at 5% of monthly basic salary split equally (ceiling ₱100,000 monthly salary, max contribution ₱5,000), Pag-IBIG at 2% each up to a fund salary of ₱10,000 (max ₱200 each), and BIR income tax withheld per the TRAIN Law graduated table. All contributions except BIR are remitted by the 10th of the following month.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What happens if a Philippine employer misses payroll contribution remittance deadlines?
                </h3>
                <p>
                  Late SSS remittances carry a penalty of 3% per month on the unremitted amount. PhilHealth imposes a 2% monthly surcharge on late payments. Pag-IBIG charges 1/10 of 1% per day of delay plus a service fee. BIR late filing penalties include a 25% surcharge on the tax due plus 12% annual interest. Repeated non-remittance can result in criminal charges against responsible officers under each agency&apos;s enabling law.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the most common payroll error among Philippine MSMEs?
                </h3>
                <p>
                  The most common errors are applying incorrect holiday pay multipliers (especially for rest days that fall on regular holidays, which require 260% not 200%), miscalculating contributions when an employee receives a mid-year salary increase, and using gross pay instead of basic salary as the base for 13th month computation. Each of these errors is invisible on a per-cycle basis but accumulates into significant underpayments or overpayments over a full year.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How does payroll automation reduce compliance risk in the Philippines?
                </h3>
                <p>
                  Payroll automation eliminates manual rate lookups and formula errors by maintaining up-to-date contribution tables (SSS, PhilHealth, Pag-IBIG) and BIR withholding schedules inside the system. When contribution rates change — as SSS did each year from 2019 to 2025 under RA 11199 — an automated system updates the computation immediately. Manual payroll requires HR to identify the change, update spreadsheet formulas, and verify the results before the next payroll run, leaving a window for errors.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Is YAHSHUA HRIS built specifically for Philippine payroll compliance?
                </h3>
                <p>
                  Yes. YAHSHUA HRIS was built for Philippine businesses from the ground up. SSS, PhilHealth, Pag-IBIG, BIR, DOLE holiday rates, and 13th month pay are all computed natively inside the platform — not as add-ons or workarounds. Rate tables are maintained and updated as regulations change, so employers do not need to manually track every SSS or PhilHealth circular.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Last updated June 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Contribution rates reflect SSS, PhilHealth, and Pag-IBIG schedules current as of June 2026. For the most current rates, consult the official circulars from each agency.
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
              Stop spending three days on payroll every cut-off.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              SSS, PhilHealth, Pag-IBIG, BIR — computed correctly, every run, with contribution tables maintained inside the platform. Your HR team should be talking to people, not chasing numbers.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=payroll_automation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white transition-all hover:gap-3"
              style={{ background: "hsl(38, 92%, 45%)" }}
            >
              See payroll automation in YAHSHUA <ArrowRight className="w-4 h-4" />
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

export default PayrollMessageArticle;
