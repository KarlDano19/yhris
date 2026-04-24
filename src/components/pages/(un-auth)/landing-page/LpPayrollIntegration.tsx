import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ScrollFadeIn from "./ScrollFadeIn";

const LpPayrollIntegration = () => {
  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      {/* Subtle section divider glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(100,120,255,0.04), transparent)' }} />

      <div className="lp-section-container relative z-10">
        <ScrollFadeIn className="text-center mb-16">
          <span className="lp-section-label justify-center mb-5">PAYROLL INTEGRATION</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-5 leading-tight text-white tracking-tight">
            YAHSHUA HRIS is synced<br className="hidden md:inline" /> with YAHSHUA Payroll.
          </h2>
          <p className="text-white/45 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Your HR data flows directly into payroll. No manual exports, no duplicate entry, no mismatches between what HR records and what payroll processes.
          </p>
        </ScrollFadeIn>

        <ScrollFadeIn delay={150}>
          <div className="w-full rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 60px rgba(0,0,0,0.5)' }}>
            <video
              src="/HRISxPAYROLL.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto block"
            />
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={300} className="text-center mt-12">
          <Link href="/payroll-integration" className="lp-btn-ghost gap-2 text-sm">
            Learn More About the Integration <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default LpPayrollIntegration;
