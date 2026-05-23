import { Users, ShieldCheck, Zap } from "lucide-react";
import ScrollFadeIn from "./ScrollFadeIn";
import AnimatedHeadline from "./AnimatedHeadline";

const pillars = [
  {
    icon: Users,
    title: "One System, Full Lifecycle",
    body: "From the moment a candidate applies to the day an employee exits, every record, request, and document lives in one place. No more switching tools.",
  },
  {
    icon: ShieldCheck,
    title: "DOLE Compliance, Done for You",
    body: "Generate the exact reports DOLE requires: accident forms, EC logbooks, OSH minutes. No digging through files or building spreadsheets from scratch.",
  },
  {
    icon: Zap,
    title: "HR Automation",
    body: "Automate evaluations, leave approvals, payroll syncing, and compliance reporting to reduce manual work.",
  },
];

const LpValueProposition = () => {
  return (
    <section className="py-28 md:py-36">
      <div className="lp-section-container">
        <ScrollFadeIn className="text-center mb-20">
          <span className="lp-section-label justify-center mb-5">WHY YAHSHUA HRIS</span>
          <AnimatedHeadline className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-5 leading-tight text-gray-900 tracking-tight">
            Your team deserves better than a folder full of Excel files.
          </AnimatedHeadline>
          <p className="text-gray-500 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            YAHSHUA HRIS replaces the patchwork of spreadsheets, email threads, and disconnected tools your HR team is surviving on right now.
          </p>
        </ScrollFadeIn>

        <div className="grid md:grid-cols-3 gap-5 max-w-[1080px] mx-auto">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <ScrollFadeIn key={p.title} delay={i * 100}>
                <div className="lp-dark-card p-8 h-full group">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6"
                    style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.15)' }}>
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold mb-3 text-gray-900">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.body}</p>
                </div>
              </ScrollFadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LpValueProposition;
