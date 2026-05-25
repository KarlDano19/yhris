import Link from "next/link";
import ScrollFadeIn from "./ScrollFadeIn";
import AnimatedHeadline from "./AnimatedHeadline";

const LpFinalCTA = () => {
  return (
    <section id="demo" className="py-28 md:py-36" style={{ background: '#ffffff' }}>
      <div className="lp-section-container">
        <ScrollFadeIn className="text-center">
          <span className="lp-section-label justify-center mb-6">GET STARTED</span>
          <AnimatedHeadline className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-5 leading-tight tracking-tight">
            Your HR team is doing too much manually. Let&apos;s fix that.
          </AnimatedHeadline>
          <ScrollFadeIn delay={100}>
            <p className="text-gray-500 text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed">
              See how YAHSHUA HRIS works for your team. Free demo, no commitment, no credit card required.
            </p>
          </ScrollFadeIn>
          <ScrollFadeIn delay={200}>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3Lq9wzoc89Sa_fVYXCXWkbS1MyNFXJTNKQtD_EfjnQ0Pyc5K5v7LpJ0u9fmTsXdOJ7yBUp1_JH"
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn-primary lp-btn-glow text-base px-9 py-4"
              >
                Book a Free Demo
              </a>
              <Link
                href="/features"
                className="text-base px-9 py-4 rounded-xl font-semibold transition-colors duration-200"
                style={{ background: '#fff', border: '1px solid #D1D5DB', color: '#374151' }}
              >
                Explore Features
              </Link>
            </div>
          </ScrollFadeIn>
        </ScrollFadeIn>
      </div>
    </section>
  );
};

export default LpFinalCTA;
