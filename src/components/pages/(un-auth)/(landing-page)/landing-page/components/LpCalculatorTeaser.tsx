import { ArrowRight } from "lucide-react";
import ScrollFadeIn from "./ScrollFadeIn";

const items = [
  { label: "Payroll processing time", color: "bg-red-400" },
  { label: "Compliance admin", color: "bg-orange-400" },
  { label: "Error corrections", color: "bg-yellow-400" },
  { label: "Redundant tools", color: "bg-amber-300" },
];

const LpCalculatorTeaser = () => {
  return (
    <section className="py-16 md:py-20" style={{ background: "hsl(var(--lp-surface))" }}>
      <div className="lp-section-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">

          {/* Left */}
          <ScrollFadeIn delay={0}>
            <span className="lp-section-label mb-4">Free Calculator</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              How much is manual HR<br className="hidden md:block" /> costing you every year?
            </h2>
            <p className="text-white/60 text-base max-w-md mb-8 leading-relaxed">
              Most Philippine businesses lose hundreds of thousands of pesos a year to payroll errors, compliance admin, and redundant tools. Find out your exact number in 2 minutes.
            </p>
            <a
              href="/hr-cost-calculator"
              className="lp-btn-primary lp-btn-glow inline-flex items-center gap-2 text-base px-8 py-4"
            >
              See what you&apos;re losing <ArrowRight className="w-4 h-4" />
            </a>
          </ScrollFadeIn>

          {/* Right — decorative cost breakdown preview */}
          <ScrollFadeIn delay={150}>
            <div
              className="rounded-2xl p-6 w-full lg:w-[300px]"
              style={{
                background: "hsl(var(--lp-surface-2))",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">
                Estimated annual waste
              </p>
              <p className="text-3xl font-bold text-primary mb-5">₱380,000+</p>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
                    <span className="text-sm text-white/60">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Recoverable with YAHSHUA</span>
                  <span className="font-bold text-green-400">70%</span>
                </div>
              </div>

              <p className="text-white/30 text-xs mt-4">
                Average estimate for a 50-person company. Calculate your actual number.
              </p>
            </div>
          </ScrollFadeIn>

        </div>
      </div>
    </section>
  );
};

export default LpCalculatorTeaser;
