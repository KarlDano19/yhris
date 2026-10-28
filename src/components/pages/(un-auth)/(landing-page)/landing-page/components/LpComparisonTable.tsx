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
  if (type === "x") return <X className="w-3.5 h-3.5 text-red-400 shrink-0" strokeWidth={2.5} />;
  return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" strokeWidth={2} />;
};

const LpComparisonTable = () => {
  return (
    <section className="py-28 md:py-36" style={{ background: "#FFFBF0" }}>
      <div className="lp-section-container">
        <ScrollFadeIn className="text-center mb-16">
          <span className="lp-section-label justify-center mb-5">HOW WE COMPARE</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight text-gray-900 tracking-tight">
            Why settle for less when you can get it all?
          </h2>
        </ScrollFadeIn>

        <ScrollFadeIn className="max-w-[900px] mx-auto">
          {/* Desktop table */}
          <div
            className="hidden md:block rounded-xl overflow-hidden"
            style={{
              borderTop: "3px solid hsl(43, 100%, 51%)",
              borderLeft: "1px solid rgba(255,193,7,0.35)",
              borderRight: "1px solid rgba(255,193,7,0.35)",
              borderBottom: "1px solid rgba(255,193,7,0.35)",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.11)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(255,193,7,0.12)" }}>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-widest w-[35%]">
                    Feature
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs uppercase tracking-widest w-[30%]">
                    Others
                  </th>
                  <th
                    className="text-left px-6 py-4 font-bold text-xs uppercase tracking-widest w-[35%]"
                    style={{ background: "hsl(43, 100%, 51%)" }}
                  >
                    <span className="text-white">YAHSHUA</span>{" "}
                    <span className="text-white">HRIS</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "#ffffff" : "rgba(255,250,235,0.6)",
                      borderTop: "1px solid rgba(255,193,7,0.14)",
                    }}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">{row.feature}</td>
                    <td className="px-6 py-4 text-gray-400">
                      <span className="inline-flex items-center gap-2">
                        <OtherIcon type={row.others.icon} />
                        {row.others.text}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 font-semibold text-gray-800"
                      style={{
                        background: i % 2 === 0
                          ? "rgba(255,193,7,0.07)"
                          : "rgba(255,193,7,0.11)",
                      }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(255,193,7,0.2)" }}
                        >
                          <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                        </span>
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
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  borderTop: "3px solid hsl(43, 100%, 51%)",
                  borderLeft: "1px solid rgba(255,193,7,0.3)",
                  borderRight: "1px solid rgba(255,193,7,0.3)",
                  borderBottom: "1px solid rgba(255,193,7,0.3)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  background: "#ffffff",
                }}
              >
                <div className="px-5 pt-4 pb-3">
                  <p className="text-sm font-bold text-gray-900 mb-3">{row.feature}</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <OtherIcon type={row.others.icon} />
                      <span className="text-xs text-gray-400">{row.others.text}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="px-5 py-3 flex items-center gap-2"
                  style={{ background: "rgba(255,193,7,0.09)", borderTop: "1px solid rgba(255,193,7,0.15)" }}
                >
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,193,7,0.25)" }}
                  >
                    <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                  </span>
                  <span className="text-xs font-semibold text-gray-800">{row.yahshua}</span>
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
