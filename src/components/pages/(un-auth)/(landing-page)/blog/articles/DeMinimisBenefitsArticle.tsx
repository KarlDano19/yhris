import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";

const DeMinimisBenefitsArticle = () => {
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
                BIR&apos;s New Tax-Free Benefit Limits (RR No. 29-2025): What Changed in De Minimis Benefits
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Effective January 6, 2026, the BIR raised the tax-exempt ceilings on 10 categories of de minimis benefits under Revenue Regulations No. 29-2025. Here is exactly what went up, what stayed the same, and how the excess-over-ceiling rule actually works.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>September 2026</span>
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
              src="/blog/de-minimis-benefits-2026.png"
              alt="BIR's New Tax-Free Benefit Limits (RR No. 29-2025)"
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
                Revenue Regulations No. 29-2025, issued by the BIR on December 22, 2025 and effective January 6, 2026, raised the non-taxable ceilings on 10 categories of de minimis benefits, including rice subsidy (₱2,000 to ₱2,500/month), clothing allowance (₱7,000 to ₱8,000/year), and employee achievement awards (₱10,000 to ₱12,000/year). These are increases to existing ceilings, not new benefit categories.
              </p>

              {/* Disambiguation callout */}
              <div style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>De minimis ceilings and the ₱90,000 cap are two different limits.</strong> Each de minimis benefit has its own ceiling under RR 29-2025 and is fully tax-exempt within it, separate from the ₱90,000 annual cap on 13th month pay and other bonuses. They only interact when a de minimis benefit exceeds its own ceiling: the excess is reclassified into &ldquo;other benefits&rdquo; and then competes for room under that ₱90,000 cap, covered in detail below.
                </p>
              </div>

              {/* Intro */}
              <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "2.5rem" }}>
                De minimis benefits are facilities or privileges of relatively small value that employers give employees to promote health, goodwill, contentment, or efficiency, exempt from income tax, withholding tax on compensation, and fringe benefit tax as long as they stay within the BIR&apos;s prescribed limits. RR No. 29-2025 amends RR No. 2-98 (as previously amended) to update those ceilings for the first time since 2018&apos;s RR No. 11-2018, reflecting years of inflation the old limits had not kept pace with.
              </p>

              {/* H2: comparison table */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                What Changed: Old Ceiling vs New Ceiling
              </h2>
              <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Benefit</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>Old Ceiling</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#6b7280", fontWeight: "600" }}>New Ceiling</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { b: "Monetized unused vacation leave (private sector)", old: "10 days/year", now: "12 days/year" },
                      { b: "Medical cash allowance to dependents", old: "₱1,500/semester", now: "₱2,000/semester" },
                      { b: "Rice subsidy", old: "₱2,000/month", now: "₱2,500/month" },
                      { b: "Uniform and clothing allowance", old: "₱7,000/year", now: "₱8,000/year" },
                      { b: "Actual medical assistance", old: "₱10,000/year", now: "₱12,000/year" },
                      { b: "Laundry allowance", old: "₱300/month", now: "₱400/month" },
                      { b: "Employee achievement awards", old: "₱10,000/year", now: "₱12,000/year" },
                      { b: "Christmas and major anniversary gifts", old: "₱5,000/year", now: "₱6,000/year" },
                      { b: "Meal allowance, OT/night shift (minimum wage earners)", old: "25% of basic min. wage", now: "30% of basic min. wage" },
                      { b: "CBA and productivity incentives (combined)", old: "₱10,000/year", now: "₱12,000/year" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "rgba(255,193,7,0.03)" : "transparent" }}>
                        <td style={{ padding: "0.75rem 1rem", color: "#111827", fontWeight: "500" }}>{row.b}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#9ca3af", textAlign: "right" }}>{row.old}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(38, 92%, 38%)", fontWeight: "700", textAlign: "right" }}>{row.now}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginBottom: "2.5rem", fontSize: "0.9rem", color: "#6b7280" }}>
                Each ceiling applies independently. A ₱2,500/month rice subsidy fully used does not reduce how much clothing allowance or laundry allowance an employee can still receive tax-free.
              </p>

              {/* H2: what stayed the same */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                What Did Not Change
              </h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.5rem" }}>The de minimis list is still exclusive. Employers cannot invent a new tax-free category; anything not on the BIR&apos;s enumerated list is taxable compensation for rank-and-file employees, or a fringe benefit subject to fringe benefit tax for managerial and supervisory employees.</li>
                <li style={{ marginBottom: "0.5rem" }}>De minimis benefits are still not part of the basic salary used to compute 13th month pay.</li>
                <li style={{ marginBottom: "0.5rem" }}>De minimis benefits are still excluded from SSS, PhilHealth, and Pag-IBIG contribution computations.</li>
                <li style={{ marginBottom: "0.5rem" }}>The ₱90,000 annual cap on 13th month pay and other benefits is unchanged by RR No. 29-2025.</li>
              </ul>

              {/* H2: excess mechanic */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1rem" }}>
                What Happens When a Benefit Exceeds Its Ceiling
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                When a de minimis benefit exceeds its prescribed ceiling, only the excess loses its de minimis exemption. That excess does not become immediately taxable; it is folded into &ldquo;other benefits&rdquo; alongside 13th month pay, where it shares the same ₱90,000 annual exemption. Only the portion that pushes the combined total past ₱90,000 becomes taxable compensation, subject to withholding.
              </p>
              <div style={{ background: "#f9fafb", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2.5rem" }}>
                <p style={{ fontWeight: "600", color: "#111827", marginBottom: "0.75rem", fontSize: "0.95rem" }}>Illustration</p>
                <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>An employee receives a ₱9,000 annual clothing allowance (₱1,000 over the new ₱8,000 ceiling) and a ₱85,000 13th month pay, with no other benefits for the year.</p>
                <p style={{ marginBottom: "0", fontSize: "0.9rem" }}>The ₱1,000 excess folds into &ldquo;other benefits&rdquo;: ₱85,000 + ₱1,000 = ₱86,000, still under the ₱90,000 cap, so the entire amount remains exempt. If the 13th month pay had instead been ₱89,500, the same ₱1,000 excess would push the total to ₱90,500, and ₱500 of that would be taxable.</p>
              </div>

              {/* YAHSHUA CTA callout */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  YAHSHUA HRIS applies the updated ceilings automatically.
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Track each de minimis benefit against its current BIR ceiling, and let the system flag and fold any excess into the ₱90,000 other-benefits computation instead of tracking it in a separate spreadsheet.
                </p>
                <Link href="/blog/dole-compliance-requirements-philippines" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                  See the full DOLE and BIR compliance checklist <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* FAQ */}
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  When did the new de minimis benefit ceilings take effect?
                </h3>
                <p>
                  January 6, 2026, 15 days after Revenue Regulations No. 29-2025 was published, per the BIR&apos;s issuance dated December 22, 2025.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Is the rice subsidy now ₱2,500 per month?
                </h3>
                <p>
                  Yes. RR No. 29-2025 raised the tax-exempt rice subsidy ceiling from ₱2,000 to ₱2,500 per month.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Are de minimis benefits part of the ₱90,000 tax-exempt cap?
                </h3>
                <p>
                  No, not while they stay within their own ceilings. They only interact with the ₱90,000 cap on 13th month pay and other benefits when a specific de minimis benefit exceeds its individual ceiling; only that excess portion is added to the ₱90,000 bucket.
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Can an employer add new benefits to the de minimis list?
                </h3>
                <p>
                  No. The BIR&apos;s de minimis list is exclusive. A benefit not specifically enumerated under RR No. 2-98, as amended (including RR No. 29-2025), is taxable compensation for rank-and-file employees or a fringe benefit subject to fringe benefit tax for managerial and supervisory employees, regardless of how small its value.
                </p>
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
                  Do de minimis benefits affect SSS, PhilHealth, or Pag-IBIG contributions?
                </h3>
                <p>
                  No. De minimis benefits are excluded from the computation of SSS, PhilHealth, and Pag-IBIG contributions, and from the basic salary used to compute 13th month pay.
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "2rem", marginTop: "2rem" }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  Written by <strong style={{ color: "#6b7280" }}>YAHSHUA HRIS Team</strong> · Published September 2026
                </p>
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Based on BIR Revenue Regulations No. 29-2025 (issued December 22, 2025, effective January 6, 2026, amending RR No. 2-98 as amended by RR No. 11-2018), Revenue Memorandum Circular No. 50-2018 on the treatment of excess de minimis benefits, and Section 32(B)(6)(d) of the National Internal Revenue Code. Verify current ceilings and treatment with the BIR or a tax professional before finalizing payroll and compensation policy decisions. This article does not constitute tax or legal advice.
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
                  <Link href="/blog/dole-compliance-requirements-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    DOLE Compliance Requirements for Employers →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/final-pay-computation-philippines" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Final Pay Computation for Resigned Employees →
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
              Stop tracking de minimis ceilings in a separate spreadsheet.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              YAHSHUA HRIS applies the current BIR ceilings automatically and folds any excess into the ₱90,000 other-benefits computation for you.
            </p>
            <a
              href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=de_minimis_benefits"
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

export default DeMinimisBenefitsArticle;
