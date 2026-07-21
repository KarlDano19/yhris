import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <li style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.875rem" }}>
    <CheckCircle2 style={{ width: "1.1rem", height: "1.1rem", color: "hsl(38, 92%, 45%)", flexShrink: 0, marginTop: "0.2rem" }} />
    <span style={{ color: "#374151", lineHeight: "1.7" }}>{children}</span>
  </li>
);

const StepBox = ({ number, title, time, children }: { number: number; title: string; time?: string; children: React.ReactNode }) => (
  <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
      <div style={{
        width: "2rem", height: "2rem", borderRadius: "50%", flexShrink: 0,
        background: "hsl(38, 92%, 45%)", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: "700", fontSize: "0.875rem"
      }}>
        {number}
      </div>
      <div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", margin: 0 }}>{title}</h3>
        {time && <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{time}</span>}
      </div>
    </div>
    {children}
  </div>
);

const PayrollRegistrationChecklistArticle = () => {
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
                The Philippine Business Payroll Setup Checklist: Registering with BIR, SSS, PhilHealth, and Pag-IBIG
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                A step-by-step registration checklist for Philippine business owners and finance leads setting up payroll for the first time. Covers every government agency, the correct sequence, the forms you need, and the deadlines that apply from day one.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>July 2026</span>
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
              src="/blog/payroll-registration-checklist.png"
              alt="Philippine Business Payroll Setup Checklist: BIR, SSS, PhilHealth, Pag-IBIG Registration"
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

              {/* Important note callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Sequence matters:</strong> Pag-IBIG registration requires a stamped copy of your SSS Employment Report (Form R-1A). Register with SSS before Pag-IBIG or your Pag-IBIG application will be held up.
                </p>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2rem" }}>
                Philippine law requires every employer to register with four government agencies before processing the first payroll: the Bureau of Internal Revenue (BIR), the Social Security System (SSS), the Philippine Health Insurance Corporation (PhilHealth), and the Home Development Mutual Fund (Pag-IBIG). Missing any of these registrations means every payroll run is non-compliant, and retroactive penalties apply from the date the first employee started work, not from the date you discovered the gap.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                This checklist covers each registration in the correct order, the exact forms and documents required, and the timelines DOLE, SSS, PhilHealth, and Pag-IBIG enforce.
              </p>

              {/* Before you start */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Before You Start: Documents to Prepare for All Four Agencies
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                These documents are required across multiple registrations. Gather them before going to any agency to avoid repeat trips.
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "2.5rem" }}>
                <CheckItem>DTI Certificate of Business Name Registration (for sole proprietors) or SEC Certificate of Incorporation (for corporations and OPCs)</CheckItem>
                <CheckItem>Mayor&apos;s Permit or Business Permit from your local government unit (LGU)</CheckItem>
                <CheckItem>Barangay Business Clearance</CheckItem>
                <CheckItem>Contract of Lease or Certificate of Land Title for your principal business address</CheckItem>
                <CheckItem>Valid government-issued ID of the business owner or authorized signatory</CheckItem>
                <CheckItem>Company TIN (secured from BIR first — required by SSS, PhilHealth, and Pag-IBIG)</CheckItem>
                <CheckItem>Official company email address (used for account creation and correspondence with all agencies)</CheckItem>
              </ul>

              {/* Step 1: BIR */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.25rem" }}>
                The Registration Checklist
              </h2>

              <StepBox number={1} title="BIR Registration" time="Processing time: 1 to 3 business days">
                <p style={{ marginBottom: "1rem", color: "#374151" }}>
                  BIR registration is the first step because the Tax Identification Number (TIN) and Certificate of Registration (COR, Form 2303) are required by SSS, PhilHealth, and Pag-IBIG. You cannot complete any of the other registrations without them.
                </p>
                <p style={{ marginBottom: "0.75rem", fontWeight: "600", color: "#111827" }}>Forms to file:</p>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem", listStyleType: "disc", color: "#374151" }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong>BIR Form 1901</strong> — for sole proprietors and professionals</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong>BIR Form 1903</strong> — for corporations, partnerships, and other juridical entities</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong>BIR Form 0605</strong> — payment form for the ₱500 annual registration fee</li>
                </ul>
                <p style={{ marginBottom: "0.75rem", fontWeight: "600", color: "#111827" }}>Fees:</p>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem", listStyleType: "disc", color: "#374151" }}>
                  <li style={{ marginBottom: "0.5rem" }}>₱500 annual registration fee (renewable every January 31)</li>
                  <li style={{ marginBottom: "0.5rem" }}>₱100 documentary stamp tax (affixed to Form 2303)</li>
                  <li style={{ marginBottom: "0.5rem" }}>₱15 certification fee</li>
                  <li style={{ marginBottom: "0.5rem" }}>~₱400 for books of account (4 books: cash receipts, disbursements, ledger, general journal)</li>
                </ul>
                <p style={{ marginBottom: "0.75rem", fontWeight: "600", color: "#111827" }}>What you receive:</p>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem", listStyleType: "disc", color: "#374151" }}>
                  <li style={{ marginBottom: "0.5rem" }}>Certificate of Registration (Form 2303) with your TIN</li>
                  <li style={{ marginBottom: "0.5rem" }}>Authority to Print (ATP) official receipts and invoices</li>
                  <li style={{ marginBottom: "0.5rem" }}>Registered books of account (stamped by BIR)</li>
                </ul>
                <div style={{ background: "rgba(255,193,7,0.05)", borderLeft: "3px solid rgba(255,193,7,0.5)", borderRadius: "0 8px 8px 0", padding: "0.875rem 1rem", fontSize: "0.9rem" }}>
                  <strong style={{ color: "#111827" }}>Where to go:</strong> Your Revenue District Office (RDO) with jurisdiction over your business address. Bring original and photocopy of all documents.
                </div>
              </StepBox>

              {/* Step 2: SSS */}
              <StepBox number={2} title="SSS Employer Registration" time="Processing time: 3 to 7 business days">
                <p style={{ marginBottom: "1rem", color: "#374151" }}>
                  SSS employer registration is done online through the My.SSS portal. There is no physical form submission for the initial employer registration. You will also need to file Form R-1A (Employment Report) to register each employee, and the stamped copy of R-1A is required by Pag-IBIG.
                </p>
                <p style={{ marginBottom: "0.75rem", fontWeight: "600", color: "#111827" }}>Steps:</p>
                <ol style={{ paddingLeft: "1.25rem", marginBottom: "1rem", color: "#374151" }}>
                  <li style={{ marginBottom: "0.6rem" }}>Go to <strong>sss.gov.ph</strong>, click &quot;Create a My.SSS account&quot;, and select &quot;Employer&quot;</li>
                  <li style={{ marginBottom: "0.6rem" }}>Fill out the Employer Information online form with your business details matching your BIR registration exactly</li>
                  <li style={{ marginBottom: "0.6rem" }}>Provide the Authorized Signatory details (not required for sole proprietors)</li>
                  <li style={{ marginBottom: "0.6rem" }}>Submit and wait for validation by the SSS servicing branch</li>
                  <li style={{ marginBottom: "0.6rem" }}>Upon approval, set your account password via the link sent to your company email</li>
                  <li style={{ marginBottom: "0.6rem" }}>File <strong>SS Form R-1A</strong> (Employment Report) for each employee within 30 days of their start date</li>
                  <li style={{ marginBottom: "0.6rem" }}>Get the stamped copy of R-1A. You will need this for Pag-IBIG registration</li>
                </ol>
                <div style={{ background: "rgba(255,193,7,0.05)", borderLeft: "3px solid rgba(255,193,7,0.5)", borderRadius: "0 8px 8px 0", padding: "0.875rem 1rem", fontSize: "0.9rem" }}>
                  <strong style={{ color: "#111827" }}>Deadline:</strong> Employers must report newly hired employees via Form R-1A within the first 10 days of the month following the quarter in which the employee was hired. In practice, file as early as possible to avoid remittance mismatches.
                </div>
              </StepBox>

              {/* Step 3: PhilHealth */}
              <StepBox number={3} title="PhilHealth Employer Registration" time="Processing time: 1 to 3 business days">
                <p style={{ marginBottom: "1rem", color: "#374151" }}>
                  PhilHealth employer registration can be done online via the Electronic Premium Remittance System (EPRS) or in person at any PhilHealth office. Employers must also report each new employee within 30 days of their first day of work.
                </p>
                <p style={{ marginBottom: "0.75rem", fontWeight: "600", color: "#111827" }}>Forms to file:</p>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem", listStyleType: "disc", color: "#374151" }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong>PhilHealth Employer Registration Form (ER1)</strong> — for initial employer registration</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong>PhilHealth ER2 Form (Report of Employee-Members)</strong> — to register each employee</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong>PhilHealth Member Registration Form (PMRF)</strong> — for employees who do not yet have a PhilHealth Identification Number (PIN)</li>
                </ul>
                <p style={{ marginBottom: "0.75rem", fontWeight: "600", color: "#111827" }}>Documents required:</p>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem", listStyleType: "disc", color: "#374151" }}>
                  <li style={{ marginBottom: "0.5rem" }}>DTI or SEC certificate</li>
                  <li style={{ marginBottom: "0.5rem" }}>BIR Certificate of Registration (Form 2303)</li>
                  <li style={{ marginBottom: "0.5rem" }}>Mayor&apos;s Permit</li>
                  <li style={{ marginBottom: "0.5rem" }}>Valid ID of authorized signatory</li>
                </ul>
                <div style={{ background: "rgba(255,193,7,0.05)", borderLeft: "3px solid rgba(255,193,7,0.5)", borderRadius: "0 8px 8px 0", padding: "0.875rem 1rem", fontSize: "0.9rem" }}>
                  <strong style={{ color: "#111827" }}>Deadline:</strong> New employees must be reported to PhilHealth within 30 days from their first day of work. Late registration does not eliminate the obligation to remit premiums from the employee&apos;s actual start date.
                </div>
              </StepBox>

              {/* Step 4: Pag-IBIG */}
              <StepBox number={4} title="Pag-IBIG (HDMF) Employer Registration" time="Processing time: 3 to 5 business days">
                <p style={{ marginBottom: "1rem", color: "#374151" }}>
                  Pag-IBIG employer registration is done in person at the Pag-IBIG Fund branch with jurisdiction over your principal business address. Unlike SSS and PhilHealth, Pag-IBIG cannot be registered online at the initial employer level. The stamped SSS Form R-1A is a required attachment, which is why SSS must be completed first.
                </p>
                <p style={{ marginBottom: "0.75rem", fontWeight: "600", color: "#111827" }}>Documents required:</p>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem", listStyleType: "disc", color: "#374151" }}>
                  <li style={{ marginBottom: "0.5rem" }}>Duly received or stamped SSS Form R-1A (Employment Report)</li>
                  <li style={{ marginBottom: "0.5rem" }}>DTI or SEC certificate of registration</li>
                  <li style={{ marginBottom: "0.5rem" }}>BIR Certificate of Registration (Form 2303)</li>
                  <li style={{ marginBottom: "0.5rem" }}>Mayor&apos;s Permit</li>
                  <li style={{ marginBottom: "0.5rem" }}>Valid ID of authorized signatory</li>
                </ul>
                <p style={{ marginBottom: "0.75rem", fontWeight: "600", color: "#111827" }}>What you receive:</p>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem", listStyleType: "disc", color: "#374151" }}>
                  <li style={{ marginBottom: "0.5rem" }}>Pag-IBIG Certificate of Registration (COR)</li>
                  <li style={{ marginBottom: "0.5rem" }}>Electronic Employer&apos;s Data Form (EDF)</li>
                </ul>
                <div style={{ background: "rgba(255,193,7,0.05)", borderLeft: "3px solid rgba(255,193,7,0.5)", borderRadius: "0 8px 8px 0", padding: "0.875rem 1rem", fontSize: "0.9rem" }}>
                  <strong style={{ color: "#111827" }}>Note:</strong> The Electronic Submission of Remittance Schedule (eSRS) for online remittance can only be activated after your first premium contribution has been remitted. Plan for at least one manual over-the-counter remittance before going fully digital.
                </div>
              </StepBox>

              {/* Remittance deadlines */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                Monthly Remittance Deadlines After Registration
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Registration is only the first step. Once active, remittances must be filed and paid every month. Missing a single month triggers penalties from day one of the delay.
              </p>
              <div style={{ overflowX: "auto", marginBottom: "2.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Agency</th>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Deadline</th>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Basis</th>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.875rem", color: "#6b7280", fontWeight: "600" }}>Late Penalty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        agency: "SSS",
                        deadline: "11th–20th of the following month (staggered by last digit of SSS employer number)",
                        basis: "Last digit of SSS employer number",
                        penalty: "3% per month on unpaid amount"
                      },
                      {
                        agency: "PhilHealth",
                        deadline: "Last day of the month following the payroll period (staggered)",
                        basis: "Last digit of PhilHealth employer number",
                        penalty: "3% per month surcharge on unpaid premiums"
                      },
                      {
                        agency: "Pag-IBIG",
                        deadline: "10th–end of the following month (staggered by first letter of company name)",
                        basis: "A–D: 10th–14th, E–L: 15th–19th, M–Q: 20th–24th, R–Z/Numeral: 25th–end of month",
                        penalty: "1/10 of 1% per day of delay"
                      },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 0.875rem", color: "#111827", fontWeight: "600", verticalAlign: "top" }}>{row.agency}</td>
                        <td style={{ padding: "0.75rem 0.875rem", color: "#374151", verticalAlign: "top" }}>{row.deadline}</td>
                        <td style={{ padding: "0.75rem 0.875rem", color: "#6b7280", fontSize: "0.8rem", verticalAlign: "top" }}>{row.basis}</td>
                        <td style={{ padding: "0.75rem 0.875rem", color: "#dc2626", fontWeight: "600", verticalAlign: "top" }}>{row.penalty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* BIR annual renewal */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                The Annual BIR Registration Renewal (January 31 Every Year)
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                BIR registration must be renewed every year by January 31. The renewal fee is ₱500, paid using BIR Form 0605 at any authorized agent bank. Failure to renew on time carries a ₱1,000 penalty per year. The Certificate of Registration (Form 2303) must be displayed prominently at your place of business at all times.
              </p>
              <p style={{ marginBottom: "2.5rem", padding: "1rem 1.25rem", borderLeft: "3px solid rgba(255,193,7,0.5)", background: "rgba(255,193,7,0.05)", borderRadius: "0 8px 8px 0" }}>
                <strong style={{ color: "#111827" }}>Common oversight:</strong> Many businesses pay the annual BIR renewal fee but forget to have their books of account re-stamped. BIR inspectors check for both. Books of account must be registered and stamped before the first entry of the new year.
              </p>

              {/* Summary checklist */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.25rem" }}>
                Complete Payroll Setup Checklist at a Glance
              </h2>
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.2)", borderRadius: "14px", padding: "1.5rem", marginBottom: "3rem" }}>
                <p style={{ fontWeight: "700", color: "#111827", marginBottom: "1rem" }}>Before first payroll:</p>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
                  <CheckItem>DTI or SEC business registration secured</CheckItem>
                  <CheckItem>Barangay clearance and Mayor&apos;s Permit in hand</CheckItem>
                  <CheckItem>BIR Form 1901 or 1903 filed at your RDO</CheckItem>
                  <CheckItem>₱500 annual BIR registration fee paid (Form 0605)</CheckItem>
                  <CheckItem>BIR Certificate of Registration (Form 2303) received and displayed</CheckItem>
                  <CheckItem>Books of account purchased and stamped by BIR</CheckItem>
                  <CheckItem>Authority to Print (ATP) secured for official receipts</CheckItem>
                  <CheckItem>SSS employer account created at My.SSS (sss.gov.ph)</CheckItem>
                  <CheckItem>All employees reported to SSS via Form R-1A within the deadline</CheckItem>
                  <CheckItem>Stamped copy of SSS Form R-1A secured (needed for Pag-IBIG)</CheckItem>
                  <CheckItem>PhilHealth employer registration completed (ER1 form)</CheckItem>
                  <CheckItem>All employees reported to PhilHealth via ER2 form within 30 days</CheckItem>
                  <CheckItem>PMRFs filed for employees without existing PhilHealth PIN</CheckItem>
                  <CheckItem>Pag-IBIG employer registration filed at your servicing branch (with SSS R-1A attached)</CheckItem>
                  <CheckItem>Pag-IBIG Certificate of Registration received</CheckItem>
                  <CheckItem>All employees&apos; Pag-IBIG MID numbers collected and recorded</CheckItem>
                </ul>
                <p style={{ fontWeight: "700", color: "#111827", marginBottom: "1rem" }}>After first payroll:</p>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: 0 }}>
                  <CheckItem>SSS contributions deducted and remittance schedule confirmed by employer number</CheckItem>
                  <CheckItem>PhilHealth premiums deducted and remittance schedule confirmed</CheckItem>
                  <CheckItem>Pag-IBIG contributions deducted and first manual remittance filed</CheckItem>
                  <CheckItem>Pag-IBIG eSRS (Electronic Submission of Remittance Schedule) activated after first remittance</CheckItem>
                  <CheckItem>Payslips issued to all employees showing each government deduction as a separate line item</CheckItem>
                </ul>
              </div>

              {/* YAHSHUA CTA */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS handles every government deduction from the first payroll run.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Once your agency registrations are complete, YAHSHUA applies the current SSS, PhilHealth, and Pag-IBIG rates automatically, generates the correct deduction line items on every payslip, and produces remittance summaries formatted for each agency. No manual tables. No ceiling errors.
                </p>
                <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See how payroll compliance works in YAHSHUA HRIS <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  In what order should a Philippine employer register with government agencies?
                </h3>
                <p>
                  Register with BIR first to get your TIN and Certificate of Registration, then SSS (online via My.SSS), then PhilHealth, then Pag-IBIG last. Pag-IBIG requires a stamped copy of your SSS Form R-1A as part of its application, so SSS must be completed and the R-1A must be received before filing with Pag-IBIG.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  How much does it cost to register with BIR as a new employer in the Philippines?
                </h3>
                <p>
                  The initial BIR registration costs ₱500 for the annual registration fee (paid via Form 0605), ₱100 for the documentary stamp tax attached to the Certificate of Registration, and ₱15 for the certification fee. Books of account cost approximately ₱400 at bookstores. The Authority to Print (ATP) official receipts costs between ₱3,000 and ₱5,000 at accredited printers. The total out-of-pocket cost for BIR registration is typically between ₱4,000 and ₱6,000. The ₱500 annual fee renews every January 31.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  When must a Philippine employer register new employees with SSS, PhilHealth, and Pag-IBIG?
                </h3>
                <p>
                  For PhilHealth, new employees must be reported within 30 days from their first day of work using the ER2 form. For SSS, the Employment Report (Form R-1A) must be filed within the first 10 days of the month following the quarter in which the employee was hired. For Pag-IBIG, the employee&apos;s MID number and contribution must be included in the immediately applicable month following the hiring date. In practice, file all three as close to the hiring date as possible to avoid remittance gaps.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Can SSS, PhilHealth, and Pag-IBIG registrations be done online?
                </h3>
                <p>
                  SSS employer registration is fully online via the My.SSS portal at sss.gov.ph. PhilHealth employer registration can be completed online through the EPRS (Electronic Premium Remittance System) or in person. Pag-IBIG initial employer registration must be done in person at the Pag-IBIG branch with jurisdiction over your principal business address. Once your first Pag-IBIG remittance has been filed, you can activate the Electronic Submission of Remittance Schedule (eSRS) for subsequent online remittances.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What happens if an employer starts paying salaries before completing government registrations?
                </h3>
                <p>
                  Penalties apply from the date the first employee started work, not from the date the employer discovers the gap. For SSS, this means a 3% monthly penalty on all unpaid contributions from the employee&apos;s start date. For PhilHealth, a 3% monthly surcharge applies. For Pag-IBIG, the penalty is 1/10 of 1% per day of delay. In addition, the employer-officer responsible for payroll can face personal liability for unpaid SSS contributions under RA 11199 (Social Security Act of 2018), with penalties up to ₱20,000 and imprisonment of up to 12 years for willful non-remittance.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  What is the BIR Annual Registration Fee and when is it due?
                </h3>
                <p>
                  The BIR Annual Registration Fee is ₱500, paid every January 31 using BIR Form 0605. It renews the Certificate of Registration (Form 2303) for the current year. Failure to pay by January 31 incurs a ₱1,000 penalty. The Certificate of Registration must be displayed at the place of business at all times and must show the current year&apos;s registration.
                </p>
              </div>

              {/* Author / Last updated */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published July 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Registration requirements in this article reflect BIR Form 1901 (October 2025 revision), SSS My.SSS online employer registration process, PhilHealth EPRS, and HDMF branch registration requirements as of July 2026. Requirements and fees are subject to change. Verify with the issuing agency before filing. This article does not constitute legal or tax advice.
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
              Registration done. Now run payroll without the manual work.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS applies current SSS, PhilHealth, and Pag-IBIG rates automatically, generates compliant payslips, and produces remittance summaries for all three agencies on every payroll cycle.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=payroll_registration_checklist"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white transition-all hover:gap-3"
              style={{ background: "hsl(38, 92%, 45%)" }}
            >
              Book a demo <ArrowRight className="w-4 h-4" />
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

export default PayrollRegistrationChecklistArticle;
