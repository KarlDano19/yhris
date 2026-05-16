import { Check, X, AlertTriangle } from "lucide-react";
import ScrollFadeIn from "./ScrollFadeIn";

const rows = [
  { feature: "Built-in recruitment / ATS", others: { text: "Separate tool required", icon: "x" }, yahshua: "Included" },
  { feature: "Job posting to social media", others: { text: "Not available", icon: "x" }, yahshua: "Facebook, LinkedIn, YAHSHUA Jobs" },
  { feature: "Payroll integration", others: { text: "Manual export or separate system", icon: "warn" }, yahshua: "Real-time auto-sync" },
  { feature: "DOLE compliance reports", others: { text: "Limited or manual", icon: "warn" }, yahshua: "Full suite built-in" },
  { feature: "GDPR / SOC2 / ISO 27001", others: { text: "Partial or none", icon: "warn" }, yahshua: "All three certified" },
  { feature: "Unlimited users", others: { text: "Per-seat billing", icon: "x" }, yahshua: "All plans" },
];

const OtherIcon = ({ type }: { type: string }) => {
  if (type === "x") return <X className="w-3.5 h-3.5 text-red-400 shrink-0" strokeWidth={2} />;
  return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" strokeWidth={2} />;
};

const LpComparisonTable = () => {
  return (
    <section className="py-28 md:py-36">
      <div className="lp-section-container">
        <ScrollFadeIn className="text-center mb-16">
          <span className="lp-section-label justify-center mb-5">HOW WE COMPARE</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight text-gray-900 tracking-tight">
            Why settle for less when you can get it all?
          </h2>
        </ScrollFadeIn>

        <ScrollFadeIn delay={150} className="max-w-[900px] mx-auto">
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'hsl(var(--lp-surface-2))' }}>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-widest">Feature</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-400 text-xs uppercase tracking-widest">Others</th>
                  <th className="text-left px-5 py-4 font-bold text-xs uppercase tracking-widest">
                    <span className="text-primary">YAHSHUA</span> <span className="text-gray-500">HRIS</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={{
                    background: i % 2 === 0 ? 'hsl(var(--lp-surface))' : 'transparent',
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                  }}>
                    <td className="px-5 py-4 font-medium text-gray-700">{row.feature}</td>
                    <td className="px-5 py-4 text-gray-400">
                      <span className="inline-flex items-center gap-2">
                        <OtherIcon type={row.others.icon} />
                        {row.others.text}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      <span className="inline-flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0" strokeWidth={2.5} />
                        {row.yahshua}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card layout */}
          <div className="md:hidden space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: 'hsl(var(--lp-surface))', border: '1px solid rgba(0,0,0,0.07)' }}>
                <p className="text-sm font-semibold text-gray-900 mb-3">{row.feature}</p>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start gap-2">
                    <OtherIcon type={row.others.icon} />
                    <span className="text-xs text-gray-400">{row.others.text}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-xs text-gray-600">{row.yahshua}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default LpComparisonTable;
