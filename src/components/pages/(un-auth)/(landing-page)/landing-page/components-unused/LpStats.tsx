import ScrollFadeIn from "./ScrollFadeIn";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { to: 500, suffix: "+", label: "Companies", description: "Philippine businesses trust YAHSHUA HRIS" },
  { to: 50, suffix: "K+", label: "Employees Managed", description: "Active employee records across all clients" },
  { to: 98, suffix: "%", label: "Customer Satisfaction", description: "Based on post-onboarding surveys" },
  { to: 100, suffix: "%", label: "DOLE-Ready Reports", description: "Generated directly from your HR data" },
];

const LpStats = () => {
  return (
    <section className="py-16 md:py-20" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="lp-section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
          {stats.map((s, i) => (
            <ScrollFadeIn key={s.label} delay={i * 80}>
              <div className="px-8 py-10 text-center" style={{ background: 'hsl(var(--lp-surface))' }}>
                <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tabular-nums">
                  <AnimatedCounter to={s.to} suffix={s.suffix} duration={1800} />
                </p>
                <p className="text-sm font-semibold text-primary mb-1">{s.label}</p>
                <p className="text-xs text-gray-400 leading-relaxed hidden md:block">{s.description}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LpStats;
