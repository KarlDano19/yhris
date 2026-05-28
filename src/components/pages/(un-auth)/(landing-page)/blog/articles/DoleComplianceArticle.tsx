import Link from "next/link";

import { ArrowLeft, ArrowRight } from "lucide-react";

import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const DoleComplianceArticle = () => {
  return (
    <div style={{ background: 'hsl(var(--lp-page))' }}>
        <main className="min-h-screen pt-16">

          {/* Hero */}
          <section className="pt-20 pb-12 relative overflow-hidden lp-dot-grid lp-hero-glow" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--lp-page)))' }} />
            <div className="lp-section-container relative z-10 max-w-3xl mx-auto">
              <ScrollFadeIn>
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-6"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                  DOLE Compliance
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white mb-6" style={{ lineHeight: '1.25' }}>
                  DOLE Compliance Requirements Every Philippine Employer Must Know in 2026
                </h1>
                <p className="text-white/50 text-lg leading-relaxed mb-8">
                  A practical breakdown of mandatory DOLE reports under the updated DO 252-25, including WAIR monthly submissions, the Annual Medical Report, OSH documentation, and what the new penalty rules mean for your business.
                </p>
                <div className="flex items-center gap-4 text-sm text-white/30" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem' }}>
                  <span>By YAHSHUA HRIS Team</span>
                  <span>·</span>
                  <span>April 2026</span>
                  <span>·</span>
                  <span>7 min read</span>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* Article Body */}
          <article className="py-16">
            <div className="lp-section-container max-w-3xl mx-auto">
              <div className="prose prose-invert prose-lg max-w-none"
                style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' }}>

                  {/* Regulatory update callout */}
                  <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                      <strong style={{ color: '#34d399' }}>Regulatory update:</strong> DOLE Department Order No. 252-25 took effect on May 16, 2025, replacing the previous DO 198-18. This guide reflects the updated requirements under DO 252-25.
                    </p>
                  </div>

                  {/* Intro */}
                  <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.75)', marginBottom: '2rem' }}>
                    DOLE compliance refers to a Philippine employer&apos;s obligation to meet the reporting, documentation, and safety requirements set by the Department of Labor and Employment. For most businesses, this includes monthly work accident reports, an annual medical report, an annual OSH summary, and ongoing occupational safety documentation. Under DO 252-25, which replaced DO 198-18 in May 2025, penalties for non-compliance are significantly stricter, with willful violations now carrying a daily fine of P100,000.
                  </p>

                  <p style={{ marginBottom: '2.5rem' }}>
                    This guide covers the core DOLE requirements in 2026, when each report is due, and what changed under the new rules.
                  </p>

                  {/* H2: What Changed */}
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginTop: '3rem', marginBottom: '1rem' }}>
                    What Changed Under DO 252-25
                  </h2>
                  <p style={{ marginBottom: '1rem' }}>
                    DOLE Department Order No. 252-25, the Revised Implementing Rules and Regulations of Republic Act 11058, took effect on May 16, 2025. It expands the scope of OSH requirements and tightens enforcement in three key ways.
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', listStyleType: 'disc' }}>
                    <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#ffffff' }}>Broader coverage.</strong> DO 252-25 now covers residences converted into workplaces (relevant for remote and home-based work arrangements), GOCCs without an original charter, economic zone enterprises, and contracting and subcontracting setups in both private and public sectors.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#ffffff' }}>Stricter penalties.</strong> The new order introduces progressive fines for repeat violations and a P100,000 daily fine for willful non-compliance. This is a significant escalation from the previous penalty structure.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#ffffff' }}>Streamlined enforcement.</strong> DOLE labor inspectors now have clearer authority to issue immediate work stoppage orders in cases of imminent danger, with less procedural delay than under the old rules.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#ffffff' }}>Updated OSH personnel requirements.</strong> Safety officer competency standards have been raised, with specialized training now required for high-risk industries and emerging hazards.</li>
                  </ul>

                  {/* H2: Core DOLE Reports */}
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginTop: '3rem', marginBottom: '1rem' }}>
                    The DOLE Reports Every Employer Must Submit in 2026
                  </h2>
                  <p style={{ marginBottom: '2rem' }}>
                    The following reports are mandatory for most private-sector employers in the Philippines. These are the documents a DOLE inspector will request first during an inspection visit.
                  </p>

                  {/* Deadline table */}
                  <div style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                          <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Report</th>
                          <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Deadline</th>
                          <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Filed With</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { report: "Employer's Work Accident/Illness Report (WAIR)", deadline: "30th of every month", filed: "DOLE regional office" },
                          { report: "Annual Work Accident/Illness Exposure Data", deadline: "January 30", filed: "DOLE regional office" },
                          { report: "Annual Establishment Report on Wages (AERW)", deadline: "January 31", filed: "DOLE ERS portal" },
                          { report: "Annual Medical Report (AMR)", deadline: "March 31", filed: "DOLE regional office" },
                          { report: "Annual OSH Report", deadline: "January 31", filed: "DOLE regional office" },
                          { report: "OSH Committee Meeting Minutes", deadline: "Ongoing, retained on site", filed: "Kept on file, produced on inspection" },
                        ].map((row, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                            <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.75)' }}>{row.report}</td>
                            <td style={{ padding: '0.75rem 1rem', color: 'hsl(var(--lp-primary))', fontWeight: '600', whiteSpace: 'nowrap' }}>{row.deadline}</td>
                            <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.45)' }}>{row.filed}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* H3: WAIR */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginTop: '2.5rem', marginBottom: '0.75rem' }}>
                    1. Employer&apos;s Work Accident and Illness Report (WAIR)
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Under DO 252-25, the WAIR must be submitted to DOLE by the 30th of every month, regardless of whether any accidents or illnesses occurred during that period. This is a critical change many employers are not aware of: a zero-incident month still requires a submission.
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Covers all work-related injuries, illnesses, and near-miss incidents occurring on company premises or during work activities</li>
                    <li style={{ marginBottom: '0.5rem' }}>Must include the nature of the incident, body part affected, number of lost workdays, and corrective actions taken</li>
                    <li style={{ marginBottom: '0.5rem' }}>Filed with the DOLE regional office covering your workplace location</li>
                    <li style={{ marginBottom: '0.5rem' }}>Can be submitted online via the DOLE Online Compliance Portal at reports.dole.gov.ph</li>
                  </ul>
                  <p style={{ marginBottom: '2rem', padding: '1rem 1.25rem', borderLeft: '3px solid rgba(255,193,7,0.5)', background: 'rgba(255,193,7,0.05)', borderRadius: '0 8px 8px 0' }}>
                    <strong style={{ color: '#ffffff' }}>Common mistake:</strong> Many employers only file WAIR when an incident occurs. Under the current rules, monthly submission is required even with zero incidents. Missing months are treated as non-compliance during inspections.
                  </p>

                  {/* H3: Annual Medical Report */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginTop: '2.5rem', marginBottom: '0.75rem' }}>
                    2. Annual Medical Report (AMR)
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    The Annual Medical Report (AMR), using form DOLE-BWC-HSD-OH-47-A, summarizes all preventive and curative health services provided to employees during the calendar year. It is due on or before March 31 of the following year.
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Includes establishment data, occupational health personnel details, and a summary of all medical examinations conducted (pre-employment, annual, transfer, and separation)</li>
                    <li style={{ marginBottom: '0.5rem' }}>Must capture disease statistics for both occupational and non-occupational illnesses recorded during the year</li>
                    <li style={{ marginBottom: '0.5rem' }}>Failure to submit carries fines ranging from P20,000 to P50,000 per day until the violation is corrected</li>
                    <li style={{ marginBottom: '0.5rem' }}>Requires sign-off from the company&apos;s designated occupational health personnel</li>
                  </ul>

                  {/* H3: EC Logbook */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginTop: '2.5rem', marginBottom: '0.75rem' }}>
                    3. Employee Compensation (EC) Logbook
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    The EC Logbook is a running record of all work-related accidents and illnesses, maintained continuously and updated as incidents occur. Unlike the WAIR, it is not submitted to DOLE but must be accessible on-site during inspections.
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Every incident must be recorded chronologically as it occurs, not in batches at end of month</li>
                    <li style={{ marginBottom: '0.5rem' }}>Contains employee details, incident description, injury type, medical treatment received, and return-to-work date</li>
                    <li style={{ marginBottom: '0.5rem' }}>Must be retained for at least three years</li>
                    <li style={{ marginBottom: '0.5rem' }}>Supports Employee Compensation claims filed with SSS or GSIS</li>
                  </ul>

                  {/* H3: Annual OSH Report */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginTop: '2.5rem', marginBottom: '0.75rem' }}>
                    4. Annual OSH Report and Work Accident/Illness Exposure Data
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Two annual OSH reports are due by January 30 to 31 each year: the Annual OSH Report (summarizing all safety activities, hazards identified, and corrective actions taken during the year) and the Annual Work Accident/Illness Exposure Data (a statistical summary of all workplace incidents).
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Must be signed by the designated OSH officer registered with DOLE</li>
                    <li style={{ marginBottom: '0.5rem' }}>Businesses with 10 or more workers are required to have a designated safety officer on record with DOLE</li>
                    <li style={{ marginBottom: '0.5rem' }}>High-risk industries (construction, manufacturing, mining) face stricter officer competency requirements under DO 252-25</li>
                  </ul>

                  {/* H3: OSH Committee Minutes */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginTop: '2.5rem', marginBottom: '0.75rem' }}>
                    5. OSH Committee Meeting Minutes
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Employers with 20 or more workers must establish a Health and Safety Committee and hold regular meetings. Meeting minutes must be documented and retained on-site.
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', listStyleType: 'disc' }}>
                    <li style={{ marginBottom: '0.5rem' }}>High-risk workplaces: meetings required at least once a month</li>
                    <li style={{ marginBottom: '0.5rem' }}>Low-risk workplaces: meetings required at least once a quarter</li>
                    <li style={{ marginBottom: '0.5rem' }}>Minutes must document attendance, topics discussed, action items, and person responsible for each item</li>
                    <li style={{ marginBottom: '0.5rem' }}>Under DO 252-25, inspectors place greater weight on evidence of active, ongoing OSH activity rather than documentation that appears assembled only before inspection</li>
                  </ul>

                  {/* H2: Penalties */}
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginTop: '3rem', marginBottom: '1rem' }}>
                    Penalties for Non-Compliance in 2026
                  </h2>
                  <p style={{ marginBottom: '1rem' }}>
                    DO 252-25 introduced a progressive penalty structure. The specific fines depend on the nature of the violation and how many times a business has been cited, but the key numbers to know are:
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
                    <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#ffffff' }}>Willful non-compliance:</strong> P100,000 per day until the violation is corrected</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#ffffff' }}>Failure to submit the Annual Medical Report:</strong> P20,000 to P50,000 per day</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#ffffff' }}>Repeat violations:</strong> Progressive fines that increase with each subsequent offense</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#ffffff' }}>Imminent danger situations:</strong> DOLE can issue immediate work stoppage orders without the procedural delays that existed under the old rules</li>
                  </ul>
                  <p style={{ marginBottom: '2.5rem' }}>
                    In 2025, DOLE inspected over 33,000 establishments nationwide covering 3.7 million workers. The inspection program is active and expanding. Businesses should treat compliance as an ongoing process, not a pre-inspection scramble.
                  </p>

                  {/* H2: How to Stay Audit-Ready */}
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginTop: '3rem', marginBottom: '1rem' }}>
                    How to Stay Audit-Ready Without Drowning in Paperwork
                  </h2>
                  <p style={{ marginBottom: '1rem' }}>
                    The businesses that pass DOLE inspections without stress are not the ones with the most resources. They are the ones with the best documentation systems. Here is what audit-ready compliance looks like in practice.
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#ffffff' }}>Submit WAIR every month, not just after incidents.</strong> Set a recurring reminder for the 25th of each month to prepare and submit the monthly WAIR via reports.dole.gov.ph, even if the report shows zero incidents.
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#ffffff' }}>Build a compliance calendar with all submission deadlines.</strong> January 30 (Annual Work Accident/Illness Exposure Data), January 31 (Annual OSH Report and AERW), and March 31 (Annual Medical Report) should all be on a shared HR calendar with reminders set at least two weeks in advance.
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#ffffff' }}>Centralize incident records from day one.</strong> Every workplace incident, however minor, should be logged immediately in a system that stores it digitally and timestamps it automatically. This eliminates gaps in your EC Logbook and makes monthly WAIR preparation straightforward rather than a manual exercise.
                  </p>
                  <p style={{ marginBottom: '2.5rem' }}>
                    <strong style={{ color: '#ffffff' }}>Generate reports from your existing HR data, not from scratch.</strong> DOLE-format reports should not be rebuilt manually each submission period. An HRIS that generates these reports directly from your incident and employee data removes manual error and saves the hours typically lost to formatting.
                  </p>

                  {/* YAHSHUA HRIS CTA callout */}
                  <div style={{ background: 'hsl(var(--lp-surface))', border: '1px solid rgba(255,193,7,0.2)', borderRadius: '16px', padding: '2rem', marginBottom: '3rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                      YAHSHUA HRIS generates all required DOLE reports from your existing HR data.
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                      Work Accident Reports, EC Logbooks, OSH annual reports. Generated in minutes, formatted correctly, ready to submit. No rebuilding spreadsheets from scratch before every inspection.
                    </p>
                    <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                      See how DOLE compliance works in YAHSHUA HRIS <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* FAQ */}
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginTop: '3rem', marginBottom: '1.5rem' }}>
                    Frequently Asked Questions
                  </h2>

                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                      What is DOLE DO 252-25 and does it apply to my business?
                    </h3>
                    <p>
                      DO 252-25 is DOLE&apos;s revised implementing rules for Republic Act 11058, which took effect on May 16, 2025. It applies to all private-sector establishments in the Philippines, including those with remote or home-based workers, economic zone enterprises, and contracting setups. If you have employees, DO 252-25 applies to you.
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                      Do I need to submit a WAIR even if no accidents happened last month?
                    </h3>
                    <p>
                      Yes. Under current DOLE rules, the Employer&apos;s Work Accident and Illness Report must be submitted by the 30th of every month, regardless of whether any incidents occurred during the reporting period. A zero-incident report is still a required submission.
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                      What is the Annual Medical Report and who needs to file it?
                    </h3>
                    <p>
                      The Annual Medical Report (form DOLE-BWC-HSD-OH-47-A) summarizes all health services provided to employees during the calendar year. It is due by March 31 of the following year. All covered workplaces are required to submit it. Failure to file carries fines of P20,000 to P50,000 per day until corrected.
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                      What happens if a Philippine employer fails a DOLE inspection under the new rules?
                    </h3>
                    <p>
                      Inspectors issue a Notice of Results listing all deficiencies. Under DO 252-25, willful non-compliance carries a daily fine of P100,000 until corrected, and repeat violations face progressively higher penalties. In cases of imminent danger, DOLE can issue an immediate work stoppage order with less procedural delay than under the previous rules.
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                      Can DOLE reports be submitted online?
                    </h3>
                    <p>
                      Yes. DOLE maintains an Online Compliance Portal at reports.dole.gov.ph for submitting mandatory reports digitally. Digital records are accepted by DOLE provided they are accessible, accurately dated, and can be produced on demand during inspections.
                    </p>
                  </div>

                  <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
                      Are small businesses covered by DO 252-25?
                    </h3>
                    <p>
                      Yes. While specific OSH requirements (such as the mandatory Health and Safety Committee) only apply at 20 or more workers, all private-sector employers are covered by DOLE labor standards and OSH reporting requirements. Work accident reporting is mandatory regardless of company size.
                    </p>
                  </div>

                  {/* Author / Last updated */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '2rem', marginTop: '2rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
                      Written by <strong style={{ color: 'rgba(255,255,255,0.5)' }}>YAHSHUA HRIS Team</strong> · Last updated April 2026
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      This article reflects requirements under DOLE Department Order No. 252-25 (effective May 16, 2025). For legal advice specific to your workplace, consult a licensed labor law practitioner or your DOLE regional office.
                    </p>
                  </div>

              </div>
            </div>
          </article>

          {/* Back to blog */}
          <section className="py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
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

export default DoleComplianceArticle;
