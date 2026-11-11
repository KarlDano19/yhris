import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const h2 = { fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" } as const;
const h3 = { fontSize: "1.15rem", fontWeight: "700", color: "#111827", marginTop: "2rem", marginBottom: "0.75rem" } as const;
const th = { padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" } as const;
const tableWrap = { overflowX: "auto", marginBottom: "1.5rem" } as const;
const table = { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" } as const;
const rowStyle = (i: number) => ({ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" });
const link = { color: "hsl(var(--lp-primary))", fontWeight: 600 } as const;

const Tag = ({ required }: { required: boolean }) => (
  <span style={{ marginLeft: "0.4rem", fontSize: "0.75rem", fontWeight: 600, color: required ? "hsl(38, 92%, 38%)" : "#9ca3af" }}>
    {required ? "Required" : "Good practice"}
  </span>
);

const NewHireOnboardingChecklistArticle = () => {
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
                Operations Playbook
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-6" style={{ lineHeight: "1.25" }}>
                New Hire Onboarding Checklist for Philippine Employers: Government IDs and Documents
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                A new hire triggers four government registrations, each with its own clock, plus a stack of documents you may or may not need. Here is the checklist, with the required steps marked apart from the good-practice ones.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>November 2026</span>
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
              src="/blog/new-hire-onboarding-checklist-philippines.png"
              alt="New hire onboarding checklist guide for Philippine employers"
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
                Onboarding a new hire in the Philippines means four government registrations: SSS and PhilHealth, each reported within 30 days of hiring, Pag-IBIG membership, and a BIR TIN, applied for within 10 days of employment if the employee has none. Add a signed contract with probation standards, and collect only the documents you actually need.
              </p>

              {/* Callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Most employees already have these numbers.</strong> Ask for the existing TIN, SSS, PhilHealth, and Pag-IBIG numbers before day one, and register only what is missing. A person should hold one TIN, so a second application for someone who already has one causes problems later.
                </p>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2.5rem" }}>
                Onboarding mistakes tend to surface months later: a contribution that was never started, a payroll run with a missing TIN, or a probationary employee with no signed standards. This checklist front-loads those items so they are done in the first week, not found in an audit.
              </p>

              {/* H2: Government registrations */}
              <h2 style={h2}>The Four Government Registrations for a New Hire</h2>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Agency</th>
                      <th style={{ ...th, textAlign: "left" }}>What to do</th>
                      <th style={{ ...th, textAlign: "left" }}>Deadline</th>
                      <th style={{ ...th, textAlign: "left" }}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { a: "SSS", w: "Require the employee to register and present an SS number, then report the hire with the Employment Report (SS Form R-1A)", d: "Within 30 days from the hiring date", s: "SSS employer guidance (sss.gov.ph)" },
                      { a: "PhilHealth", w: "Report the new hire on the Report of Employee-Members (Form ER2)", d: "Within 30 days from the employee's assumption of work", s: "PhilHealth, Reporting Your Employees" },
                      { a: "Pag-IBIG", w: "Enroll the employee as a member with the Member's Data Form (MDF), which asks for one valid ID", d: "Confirm the timing with Pag-IBIG", s: "Pag-IBIG Member's Data Form" },
                      { a: "BIR", w: "An employee with no TIN registers with BIR Form 1902. Employers typically file it for the new hire.", d: "Within 10 days from the date of employment", s: "BIR Form 1902 and RDO service guide" },
                    ].map((row, i) => (
                      <tr key={i} style={rowStyle(i)}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.a}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.w}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.d}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem" }}>
                Agencies revise their forms and portals often, so confirm the current steps with each one. If your business itself is not yet registered, start with our{" "}
                <Link href="/blog/payroll-registration-checklist-philippines" style={link}>payroll registration checklist for new employers</Link>.
              </p>

              {/* H2: Checklist */}
              <h2 style={h2}>New Hire Onboarding Checklist by Stage</h2>
              <p style={{ marginBottom: "1rem" }}>
                Items tagged Required come from the rules above or from the Labor Code. The rest are good practice, so adapt them to your company.
              </p>

              <h3 style={h3}>Before day one</h3>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Get the contract signed.</strong> Include the job description, start date, and pay terms. For a probationary hire, the standards for regularization must be made known at the time of engagement under Article 296 of the Labor Code (see{" "}
                  <Link href="/blog/probationary-to-regular-employee-philippines" style={link}>probationary to regular employees</Link>).<Tag required />
                </li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Send a privacy notice</strong> that says which documents you collect and why.<Tag required={false} /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Ask for existing numbers.</strong> TIN, SSS, PhilHealth, and Pag-IBIG numbers, so you know what still needs registering.<Tag required={false} /></li>
              </ol>

              <h3 style={h3}>In the first week</h3>
              <ol start={4} style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Report the hire to SSS</strong> with Form R-1A, within 30 days of the hiring date.<Tag required /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Report the hire to PhilHealth</strong> with Form ER2, within 30 days from the employee&apos;s assumption of work.<Tag required /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Enroll the employee in Pag-IBIG</strong> using the Member&apos;s Data Form if the employee has no MID number.<Tag required /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>File BIR Form 1902</strong> within 10 days of employment, only if the employee has no TIN.<Tag required /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Collect the previous employer&apos;s BIR Form 2316</strong> from anyone hired mid-year.<Tag required /></li>
              </ol>

              <h3 style={h3}>In the first month</h3>
              <ol start={9} style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "decimal" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Set up payroll.</strong> Pay rate, pay schedule, deductions, and bank details, before the first cutoff.<Tag required={false} /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Open the 201 file</strong> and file every signed document in it (see{" "}
                  <Link href="/blog/employee-201-file-philippines" style={link}>what belongs in an employee 201 file</Link>).<Tag required={false} />
                </li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Hold orientation.</strong> Collect the signed handbook acknowledgment, and issue equipment and system access.<Tag required={false} /></li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Calendar the end of probation</strong> and the evaluation dates, if the employee is probationary.<Tag required={false} /></li>
              </ol>
              <p style={{ marginBottom: "2.5rem" }}>
                The required items cluster in the first week because that is when the 10-day and 30-day clocks are running. Put the hire date on a shared calendar and count from it.
              </p>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  Start every new hire&apos;s file on day one.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  YAHSHUA HRIS keeps each employee&apos;s 201 file in one place, from hire date to present, so the contract and signed documents are together from the start. YAHSHUA One Payroll is included and computes SSS, PhilHealth, Pag-IBIG, and BIR withholding and generates payslips.
                </p>
                <Link href="/use-cases/employee-onboarding" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See onboarding in YAHSHUA HRIS <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* H2: Documents */}
              <h2 style={h2}>Documents to Collect From a New Hire</h2>
              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ ...th, textAlign: "left" }}>Document</th>
                      <th style={{ ...th, textAlign: "left" }}>Why you ask</th>
                      <th style={{ ...th, textAlign: "left" }}>Basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { d: "TIN (existing card or number)", w: "Needed for withholding tax on compensation", b: "BIR rules" },
                      { d: "SSS, PhilHealth, and Pag-IBIG numbers", w: "Needed to report the hire and remit contributions", b: "Agency rules" },
                      { d: "Previous employer's BIR Form 2316, for mid-year hires", w: "Supports the year-end tax computation for earlier pay in the same year", b: "RR No. 11-2018" },
                      { d: "Signed contract, job description, and probation standards", w: "Proves the terms and the start date", b: "Art. 296 for probation standards, otherwise practice" },
                      { d: "Application, resume, and one valid government ID", w: "Confirms identity and work history", b: "Practice" },
                      { d: "NBI or police clearance, diploma, certificates from previous employers", w: "Role-specific background checks", b: "Practice" },
                      { d: "Medical results", w: "Only where the role calls for it", b: "Practice, keep restricted" },
                      { d: "Bank account details", w: "Crediting salary", b: "Practice" },
                      { d: "Emergency contact and beneficiaries", w: "Emergencies and benefit claims", b: "Practice" },
                    ].map((row, i) => (
                      <tr key={i} style={rowStyle(i)}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.d}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.w}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#374151" }}>{row.b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* H2: Privacy */}
              <h2 style={h2}>How Much Can You Ask For? The Data Privacy Limit</h2>
              <p style={{ marginBottom: "1rem" }}>
                Under the Data Privacy Act, collecting employee data must follow three principles: transparency, legitimate purpose, and proportionality. In practice:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Ask only for what the role and the registrations need.</strong> A document you cannot explain a use for is a document to leave out.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Tell new hires what you collect and why,</strong> before you collect it.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Restrict the sensitive items.</strong> Government-issued numbers such as SSS and TIN, and medical results, are generally treated as sensitive personal information, so limit who can open them.</li>
              </ul>
              <p style={{ marginBottom: "2.5rem" }}>
                How long to keep what you collect is covered in our{" "}
                <Link href="/blog/employee-201-file-philippines" style={link}>employee 201 file guide</Link>.
              </p>

              {/* H2: Mistakes */}
              <h2 style={h2}>Common Onboarding Mistakes</h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Missing the 30-day reporting windows.</strong> The SSS and PhilHealth clocks start at hiring, not at the first payroll.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Registering a second TIN.</strong> Ask for the existing number first.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Skipping the probation standards.</strong> Without signed standards, a probationary hire is hard to defend as probationary.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Forgetting the previous 2316.</strong> A mid-year hire without it makes year-end tax harder to compute.</li>
                <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#111827" }}>Over-collecting documents.</strong> Every extra copy is something you must protect and later delete.</li>
              </ul>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What documents does an employer need from a new hire in the Philippines?
                </h3>
                <p>
                  At minimum, a valid government ID, the employee&apos;s TIN, SSS, PhilHealth, and Pag-IBIG numbers, and a signed employment contract. Mid-year hires should also give a certified copy of BIR Form 2316 from the previous employer. Other documents, such as an NBI clearance, diploma, or medical results, depend on the role and your policy, and should be limited to what you actually need.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How soon must an employer report a new employee to SSS?
                </h3>
                <p>
                  Within 30 days from the hiring date. SSS directs employers to require new employees to register and present their SS numbers, then report them for coverage using the Employment Report (SS Form R-1A) through My.SSS.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  When must a new employee register for a TIN?
                </h3>
                <p>
                  An employee with no TIN registers with the BIR using Form 1902 within 10 days from the date of employment, and employers typically file it for the new hire. An employee who already has a TIN should not apply for a new one. Give the employer the existing number.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How soon must an employer report a new hire to PhilHealth?
                </h3>
                <p>
                  Within 30 days from the employee&apos;s assumption of work, using the PhilHealth Report of Employee-Members (Form ER2).
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What should an employer collect from an employee hired in the middle of the year?
                </h3>
                <p>
                  A copy of the employee&apos;s BIR Form 2316 from the previous employer, duly certified by that employer. Under Revenue Regulations No. 11-2018, the employee furnishes it to the new employer when there are successive employments in the same taxable year.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published November 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Based on SSS employer guidance, PhilHealth&apos;s guidance on reporting employees (Form ER2), the Pag-IBIG Member&apos;s Data Form, BIR Form 1902 and the BIR&apos;s registration guidance, Revenue Regulations No. 11-2018, Article 296 of the Labor Code, and the Data Privacy Act of 2012 (RA 10173). This article is general information. Agency forms, portals, and deadlines change, so do your own due diligence and confirm the current requirements with SSS, PhilHealth, Pag-IBIG, and the BIR, or with counsel if you choose, before applying them to a specific hire. It does not constitute legal advice.
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
                  <Link href="/blog/employee-201-file-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    What Belongs in an Employee 201 File, and How Long to Keep It →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/probationary-to-regular-employee-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Probationary to Regular: The 6-Month Regularization Timeline →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/payroll-registration-checklist-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Philippine Payroll Registration Checklist →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/dole-compliance-requirements-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    DOLE Compliance Requirements Every Philippine Employer Must Know in 2026 →
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
              Still onboarding with folders and checklists in a spreadsheet?
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Book a free demo and see how YAHSHUA HRIS and Payroll keeps employee records in one place.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=new_hire_onboarding_checklist"
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

export default NewHireOnboardingChecklistArticle;
