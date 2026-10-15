import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollFadeIn";
import { YAHSHUA_PRICING, calculateMonthly } from "@/lib/yahshuaPricing";

const DEMO_URL = "https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=blog&utm_campaign=hris_pricing_2026";

// Single source for the visible FAQ and the FAQPage schema in page.tsx
export const hrisPricingFaqs = [
  {
    q: "How much does an HRIS cost in the Philippines in 2026?",
    a: "For a 100-employee company, published list prices work out to roughly ₱5,400 to ₱40,000 a month for HR and payroll software, depending on scope. Lean attendance and payroll tools start around ₱5,400 at 100 employees (Timekeep), a flat all-in-one plan such as YAHSHUA HRIS is ₱7,000, GreatDay HR's starter is about ₱7,700, and dollar-priced suites such as PayrollHero come to about ₱40,000 once payroll is added. Sprout Solutions does not publish a price.",
  },
  {
    q: "Is HRIS priced per employee or flat?",
    a: "Both exist. Many tools charge per employee per month (for example ₱49 to ₱77 per employee for lean tools and ₱149 to ₱219 for WORKSPHR's higher plans). Others charge a flat monthly fee up to a headcount cap and a small fee beyond it: YAHSHUA HRIS is ₱7,000 a month for up to 100 employees, then ₱60 per additional employee. A flat plan costs less per head as you grow; a per-employee plan costs less if you stay small.",
  },
  {
    q: "Does Sprout Solutions publish its pricing?",
    a: "No. Sprout uses custom, quote-based pricing for its HRIS and payroll software. It lists prices only for outsourced Payroll Starter bundles, which are a different service from software you run yourself. To compare Sprout, you need to request a quote for your headcount and modules.",
  },
  {
    q: "What costs are not included in the monthly price?",
    a: "Common extras are one-time setup or implementation fees, add-on modules, minimum license counts, VAT (12%), and exchange-rate movement for dollar-priced plans. Examples from published pages: YAHSHUA HRIS has a one-time ₱35,000 setup fee, WORKSPHR lists ₱15,000 to ₱45,000 implementation fees (waived on contract lock-in), GreatDay's starter requires 50 licenses, and PayrollHero lists payroll at $3.00 and leave management at $2.00 per employee as add-ons.",
  },
  {
    q: "Does YAHSHUA HRIS charge per employee?",
    a: "Not up to 100 employees. The plan is ₱7,000 a month flat for up to 100 employees, then ₱60 per additional employee per month, plus a one-time ₱35,000 setup fee that covers implementation, data migration, and onboarding training. Prices exclude 12% VAT. YAHSHUA Payroll is included, and a free plan for job posting and applicant screening is available.",
  },
  {
    q: "Is YAHSHUA HRIS the cheapest HRIS in the Philippines?",
    a: "No. At 100 employees, lean attendance and payroll tools such as Timekeep cost less per month, and in year one the ₱35,000 setup fee makes YAHSHUA HRIS costlier than GreatDay's starter. YAHSHUA's flat price is cheaper per month than GreatDay's starter above about 91 employees, and it includes hiring, onboarding, performance, DOLE compliance, and payroll in one plan. Choose on scope and total cost, not on the subscription line alone.",
  },
  {
    q: "How should I estimate an HRIS budget for my company?",
    a: "Multiply your headcount by the per-employee rate or read your flat tier, add one-time setup and implementation, add the modules you actually need, then add 12% VAT. Compare year-one and year-two totals, because setup fees weigh heavily in year one.",
  },
];

const employeeCounts = [50, 100, 200, 300];
const peso = (n: number) => "₱" + Math.round(n).toLocaleString("en-US");

// Published list prices checked on each vendor's own pricing page, October 2026
const timekeep = (n: number) => 999 + Math.max(0, n - 10) * 49;                 // ₱999 for 10, then ₱49 each
const greatday = (n: number) => 77 * Math.max(n, 50);                          // ₱77 per employee, 50-license starter
const worksphrGrowth = (n: number) => 149 * n;                                 // ₱149 per employee per month
const PESO_PER_USD = 62;                                                       // indicative
const payrollhero = (n: number) => 6.5 * PESO_PER_USD * n;                     // $3.50 + $3.00 payroll add-on

const monthlyRows: string[][] = [
  ["Timekeep (payroll, attendance, leave)", ...employeeCounts.map((n) => peso(timekeep(n)))],
  ["YAHSHUA HRIS and Payroll", ...employeeCounts.map((n) => peso(calculateMonthly(n)))],
  ["GreatDay HR (Basic Starter)", ...employeeCounts.map((n) => peso(greatday(n)))],
  ["WORKSPHR (Growth plan)", ...employeeCounts.map((n) => peso(worksphrGrowth(n)))],
  ["PayrollHero (HRIS + payroll, USD list price)", ...employeeCounts.map((n) => "about " + peso(payrollhero(n)))],
  ["Sprout Solutions", "Quote", "Quote", "Quote", "Quote"],
];

const yearOneRows: string[][] = [
  ["Timekeep", peso(timekeep(100) * 12), "None listed", peso(timekeep(100) * 12)],
  ["GreatDay HR (Basic Starter)", peso(greatday(100) * 12), "None listed", peso(greatday(100) * 12)],
  ["YAHSHUA HRIS and Payroll", peso(calculateMonthly(100) * 12), peso(YAHSHUA_PRICING.setupFee), peso(calculateMonthly(100) * 12 + YAHSHUA_PRICING.setupFee)],
  ["WORKSPHR (Growth plan)", peso(worksphrGrowth(100) * 12), "Not published for Growth", peso(worksphrGrowth(100) * 12) + " plus setup"],
  ["PayrollHero (HRIS + payroll)", "about " + peso(payrollhero(100) * 12), "None listed", "about " + peso(payrollhero(100) * 12)],
];

const publishedRows: string[][] = [
  ["Timekeep", "₱999 a month for 10 employees, then ₱49 per additional employee; all features included", "Payroll, attendance, schedules, leave, compliance", "Published"],
  ["GreatDay HR", "₱77 per employee a month (Basic Starter); 50-license minimum", "HRIS and payroll; GreatDay says prices are changing", "Published for the starter; higher tiers by quote"],
  ["YAHSHUA HRIS and Payroll", "₱7,000 a month flat for up to 100 employees, then ₱60 per employee; ₱35,000 one-time setup; VAT excluded", "HRIS, hiring, performance, DOLE module, payroll included", "Published"],
  ["WORKSPHR", "₱79 (Starter, up to 25 employees), ₱149 (Growth), ₱219 (Pro) per employee a month; implementation ₱15,000 (Starter) or ₱45,000 (Pro), waived on contract lock-in; VAT excluded", "HR and payroll", "Published"],
  ["PayrollHero", "$3.50 per employee a month for HRIS, timekeeping, attendance, and scheduling; payroll add-on $3.00; leave add-on $2.00", "Billed in US dollars on its global pricing page", "Published"],
  ["Sprout Solutions", "Custom quote; only outsourced Payroll Starter bundles list prices", "Software pricing varies by modules and size", "Not published"],
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

const HrisPricingPhilippinesArticle = () => {
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
                Buyer&apos;s Guide
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-6" style={{ lineHeight: "1.25" }}>
                HRIS Pricing in the Philippines 2026: What a 100-Employee Company Actually Pays
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Published prices for the main Philippine HR and payroll tools, the monthly and year-one cost at 50 to 300 employees, the fees that hide outside the subscription, and how to choose.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "1.5rem" }}>
                <span>By YAHSHUA HRIS Team</span>
                <span>·</span>
                <span>October 2026</span>
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
              src="/blog/hris-pricing-philippines-2026.png"
              alt="HRIS pricing in the Philippines 2026 guide"
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
                In 2026, a 100-employee Philippine company pays roughly ₱5,400 to ₱40,000 a month for HR and payroll software, depending on scope. Lean attendance and payroll tools start near ₱5,400, a flat all-in-one plan such as YAHSHUA HRIS is ₱7,000, GreatDay HR&apos;s starter is about ₱7,700, and dollar-priced suites reach about ₱40,000 once payroll is added. Sprout Solutions publishes no price at all.
              </p>

              {/* Disclosure */}
              <div style={{ ...box, marginBottom: "2.5rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                  <strong style={{ color: "hsl(38, 92%, 38%)" }}>Disclosure:</strong> we make YAHSHUA HRIS. We show our numbers the same way as everyone else&apos;s and say where we are not the cheapest. Every price below comes from the vendor&apos;s own pricing page, checked in October 2026. Prices change, so confirm before you buy.
                </p>
              </div>

              {/* Models */}
              <h2 style={h2}>Four Ways HRIS Vendors Charge</h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem", listStyleType: "disc" }}>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Per employee per month.</strong> The bill rises with headcount. Cheapest if you stay small, and it never gets cheaper per head.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Flat tier with a cap.</strong> One monthly price up to a headcount, then a small per-head fee. Cheaper per head as you grow.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Per module.</strong> Core HR, payroll, leave, and recruitment priced separately, so the real cost depends on what you switch on.</li>
                <li style={{ marginBottom: "0.75rem" }}><strong style={{ color: "#111827" }}>Quote only.</strong> No published price; you get a number after a sales call, usually based on headcount and modules.</li>
              </ul>

              {/* Published prices */}
              <h2 style={h2}>Published Prices, October 2026</h2>
              <Table head={["Vendor", "Published price", "Scope and notes", "Price transparency"]} rows={publishedRows} />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                Sources: each vendor&apos;s pricing page. GreatDay&apos;s starter price was confirmed in September 2026 and GreatDay notes that prices are changing. PayrollHero&apos;s page is its global, US-dollar page; it says Philippine pricing may differ. These tools are not like for like: compare what is included, not only the price.
              </p>

              {/* Monthly cost */}
              <h2 style={h2}>Monthly Cost at 50, 100, 200, and 300 Employees</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Subscription only, before VAT and one-time fees, using each vendor&apos;s published list price.
              </p>
              <Table head={["Vendor", "50 employees", "100 employees", "200 employees", "300 employees"]} rightCols={[1, 2, 3, 4]} rows={monthlyRows} />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1.5rem" }}>
                How each row is computed: Timekeep ₱999 plus ₱49 for every employee above 10. YAHSHUA ₱7,000 up to 100 employees, then ₱60 per additional employee. GreatDay ₱77 per employee with a 50-license minimum. WORKSPHR Growth ₱149 per employee (check plan limits with the vendor). PayrollHero $3.50 plus $3.00 payroll at an indicative ₱62 to the dollar.
              </p>
              <div style={{ ...box, marginBottom: "2.5rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>Reading the table</p>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.9rem" }}>
                  <li>Under about 90 employees, a per-employee tool such as GreatDay&apos;s starter costs less per month than YAHSHUA&apos;s flat plan.</li>
                  <li>Above about 91 employees, the flat plan is cheaper than GreatDay&apos;s starter, and the gap widens with every hire.</li>
                  <li>Lean tools like Timekeep cost less at every size shown, with a narrower published scope.</li>
                </ul>
              </div>

              {/* Year one */}
              <h2 style={h2}>Year-One Cost at 100 Employees</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Setup fees change the ranking in the first year.
              </p>
              <Table head={["Vendor", "12 months of subscription", "One-time fees", "Year-one total"]} rightCols={[1, 2, 3]} rows={yearOneRows} />
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2.5rem" }}>
                In year one, YAHSHUA&apos;s ₱35,000 setup fee puts it above GreatDay&apos;s starter at 100 employees. From year two, with no setup fee, ₱7,000 a month is cheaper than ₱7,700. The setup fee covers implementation, data migration, and onboarding training. WORKSPHR&apos;s implementation fee for the Growth plan is not published; its Starter and Pro fees are ₱15,000 and ₱45,000, and are waived on an eligible contract commitment.
              </p>

              {/* Hidden costs */}
              <h2 style={h2}>What the Monthly Price Usually Leaves Out</h2>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Setup and implementation.</strong> One-time fees range from none to ₱45,000 in the published prices above. Ask whether data migration and training are included.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Add-on modules.</strong> PayrollHero&apos;s payroll ($3.00) and leave management ($2.00) are priced on top of its $3.50 base, nearly doubling the per-employee cost.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>Minimum licenses.</strong> GreatDay&apos;s starter requires 50 licenses, so a 30-person company still pays for 50.
              </p>
              <p style={mistake}>
                <strong style={{ color: "#111827" }}>VAT.</strong> YAHSHUA and WORKSPHR prices exclude 12% VAT. Add it to every comparison unless the vendor says it is included.
              </p>
              <p style={{ ...mistake, marginBottom: "2.5rem" }}>
                <strong style={{ color: "#111827" }}>Currency.</strong> Dollar-priced plans move with the exchange rate. A ₱62 rate is assumed here; every ₱1 change shifts a 100-employee bill by hundreds of pesos.
              </p>

              {/* Mid CTA */}
              <div style={{ background: "#FFFBF0", border: "1px solid rgba(255,193,7,0.25)", borderRadius: "16px", padding: "2rem", marginBottom: "3rem" }}>
                <p style={{ color: "#111827", fontWeight: "600", marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                  Want your exact number?
                </p>
                <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  Tell us your headcount and we will price it with VAT and setup so you can compare it against any quote you already have.
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

              {/* Questions */}
              <h2 style={{ ...h2, marginTop: "2.5rem" }}>Eight Questions to Ask Any Vendor</h2>
              <ol style={{ paddingLeft: "1.5rem", marginBottom: "2.5rem" }}>
                <li style={{ marginBottom: "0.75rem" }}>What is the total in year one and year two for my headcount, with VAT?</li>
                <li style={{ marginBottom: "0.75rem" }}>Is there a setup or implementation fee, and does it include data migration and training?</li>
                <li style={{ marginBottom: "0.75rem" }}>Is payroll included, or is it an add-on? What about leave, attendance, and recruitment?</li>
                <li style={{ marginBottom: "0.75rem" }}>Is there a minimum number of licenses or a minimum contract term?</li>
                <li style={{ marginBottom: "0.75rem" }}>What happens to the price when I pass the next headcount tier?</li>
                <li style={{ marginBottom: "0.75rem" }}>Are SSS, PhilHealth, Pag-IBIG, and BIR tables updated automatically, and at no extra charge?</li>
                <li style={{ marginBottom: "0.75rem" }}>Does it cover DOLE reporting, such as the WAIR and annual medical report?</li>
                <li style={{ marginBottom: "0.75rem" }}>Can I leave, and can I export my data?</li>
              </ol>

              {/* How to choose */}
              <h2 style={h2}>How to Choose by Company Size</h2>
              <p style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#111827" }}>Under about 25 employees:</strong> a per-employee or lean tool is almost always the cheaper choice. A flat plan up to 100 employees pays for headcount you do not have yet.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#111827" }}>About 25 to 90 employees:</strong> compare total cost and scope. Per-employee tools win on price, so the decision turns on whether you need hiring, performance, onboarding files, and DOLE compliance in the same system.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                <strong style={{ color: "#111827" }}>About 90 employees and up:</strong> flat or tiered pricing starts to win, and the cost of running payroll, HR, and compliance in separate tools becomes the bigger number. For the compliance side of that cost, see our guide on <Link href="/blog/philippine-payroll-errors-msme" style={link}>what payroll errors cost</Link> and our <Link href="/blog/philippine-compliance-hris-2026" style={link}>one-system compliance guide</Link>.
              </p>

              {/* YAHSHUA section */}
              <h2 style={h2}>Where YAHSHUA HRIS Fits</h2>
              <p style={{ marginBottom: "1rem" }}>
                YAHSHUA HRIS is ₱{YAHSHUA_PRICING.basePrice.toLocaleString("en-US")} a month flat for up to {YAHSHUA_PRICING.employeeCap} employees, ₱{YAHSHUA_PRICING.excessRatePerEmployee} per additional employee, plus a one-time ₱{YAHSHUA_PRICING.setupFee.toLocaleString("en-US")} setup fee covering implementation, data migration, and onboarding training. YAHSHUA Payroll is included, with BIR, SSS, PhilHealth, and Pag-IBIG computations, payslips, and bank disbursement. A guided DOLE module, job posting and applicant screening, onboarding and 201 files, attendance and leave, and performance evaluations are part of the same plan. A free plan for job posting and applicant screening is available. Prices exclude 12% VAT, and there is no long-term contract.
              </p>
              <p style={{ marginBottom: "2.5rem", fontSize: "0.9rem" }}>
                See the <Link href="/pricing" style={link}>pricing page</Link>, or the side-by-side pages for <Link href="/vs-sprout" style={link}>Sprout</Link> and <Link href="/vs-greatday" style={link}>GreatDay</Link>. Our <Link href="/how-we-compare" style={link}>comparison hub</Link> lists the claims we have verified and the date we checked them.
              </p>

              {/* FAQ */}
              <h2 style={{ ...h2, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
              {hrisPricingFaqs.map((f, i) => (
                <div key={f.q} style={{ marginBottom: i === hrisPricingFaqs.length - 1 ? "3rem" : "2rem" }}>
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
                  Sources: vendor pricing pages checked October 15, 2026: <a href="https://www.yahshuahris.com/pricing" target="_blank" rel="noopener noreferrer">YAHSHUA HRIS</a>, <a href="https://greatdayhr.ph/pricing" target="_blank" rel="noopener noreferrer">GreatDay HR</a>, <a href="https://worksphr.com/pricing" target="_blank" rel="noopener noreferrer">WORKSPHR</a>, <a href="https://www.timekeep.ph/pricing" target="_blank" rel="noopener noreferrer">Timekeep</a>, <a href="https://payrollhero.com/pricing" target="_blank" rel="noopener noreferrer">PayrollHero</a>, and <a href="https://sprout.ph" target="_blank" rel="noopener noreferrer">Sprout Solutions</a>. Vendors change prices without notice; confirm with each vendor before you decide. VAT is 12% where not stated otherwise.
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
                  <Link href="/blog/philippine-compliance-hris-2026" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    Philippine Compliance 2026: One System, Not Five Checklists →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/philippine-payroll-errors-msme" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    What Philippine Payroll Errors Actually Cost MSMEs →
                  </Link>
                </li>
                <li>
                  <Link href="/blog/dole-osh-reports-deadlines-wair-aedr-amr" className="text-sm font-semibold" style={{ color: "hsl(var(--lp-primary))" }}>
                    DOLE Safety Report Deadlines: WAIR, AEDR, and AMR →
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
              See the price for your headcount, not ours.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Book a 30-minute demo and we will quote your exact headcount with VAT and setup, then show you HR, payroll, and DOLE compliance in one system.
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

export default HrisPricingPhilippinesArticle;
