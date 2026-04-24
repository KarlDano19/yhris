import { ArrowRight } from "lucide-react";
import ScrollFadeIn from "./ScrollFadeIn";
import AnimatedHeadline from "./AnimatedHeadline";

const testimonials = [
  { quote: "We eliminated our third-party ATS the moment we saw YAHSHUA HRIS handle recruitment end-to-end.", author: "Maria R.", role: "HR Manager, Retail Chain" },
  { quote: "The payroll integration is seamless. Approved leave reflects in payroll automatically. No more manual entries.", author: "Ben C.", role: "Payroll Head, Logistics Company" },
  { quote: "The offline Timekeeper app is a game-changer for our field teams. No more attendance discrepancies.", author: "Jun T.", role: "Operations Head, Construction Firm" },
  { quote: "DOLE compliance used to take us days. YAHSHUA generates all the required reports in minutes.", author: "Ana P.", role: "HR Officer, Manufacturing Company" },
  { quote: "We post jobs to Facebook and LinkedIn directly from the HRIS. No more copying and pasting.", author: "Ricky M.", role: "Talent Acquisition, Food Distribution" },
  { quote: "Performance evaluations used to be a spreadsheet nightmare. Now everything is tracked in one place.", author: "Lyn S.", role: "HR Director, Trading Company" },
];

const doubled = [...testimonials, ...testimonials];

const TestimonialCard = ({ t }: { t: typeof testimonials[0] }) => (
  <div
    className="min-w-[300px] max-w-[340px] shrink-0 rounded-xl p-7"
    style={{ background: 'hsl(var(--lp-surface))', border: '1px solid rgba(255,255,255,0.07)' }}
  >
    <p className="text-sm text-white/50 leading-relaxed mb-6">
      &ldquo;{t.quote}&rdquo;
    </p>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0"
        style={{ background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.2)' }}>
        {t.author.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{t.author}</p>
        <p className="text-xs text-white/35">{t.role}</p>
      </div>
    </div>
  </div>
);

const LpTestimonials = () => {
  return (
    <section className="py-28 md:py-36 overflow-hidden">
      <ScrollFadeIn className="lp-section-container mb-12">
        <div className="text-center">
          <span className="lp-section-label justify-center mb-5">WHAT PEOPLE SAY</span>
          <AnimatedHeadline className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight text-white tracking-tight">
            HR teams across the Philippines switched. They haven&apos;t looked back since.
          </AnimatedHeadline>
        </div>
      </ScrollFadeIn>

      <ScrollFadeIn delay={150}>
        <div className="relative overflow-hidden">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, hsl(var(--lp-page)), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, hsl(var(--lp-page)), transparent)' }} />
          <div className="flex lp-testimonial-marquee gap-5 items-stretch">
            {doubled.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </ScrollFadeIn>

      <ScrollFadeIn delay={300} className="text-center mt-12">
        <a href="#" className="lp-btn-ghost gap-2 text-sm">
          Become Part of Our Thriving Community <ArrowRight className="w-4 h-4" />
        </a>
      </ScrollFadeIn>
    </section>
  );
};

export default LpTestimonials;
