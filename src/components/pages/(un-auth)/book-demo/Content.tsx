"use client";

import Navigation from "../(landing-page)/landing-page/components/Navigation";
import LpFooter from "../(landing-page)/landing-page/components/LpFooter";

const CALENDLY_URL = "https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026";

const BENEFITS = [
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    text: "Live walkthrough tailored to your team size and industry",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    text: "See DOLE compliance tools and automated payroll in action",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    text: "Get your questions answered by our HR specialists",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    text: "30-minute session, no commitment required",
  },
];

const BookDemoContent = () => {
  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--lp-page))" }}>
      <Navigation />

      <main className="pt-28 pb-20">
        <div className="lp-section-container">

          {/* Header */}
          <div className="text-center mb-14">
            <span className="lp-section-label justify-center mb-4">
              Book a Demo
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              See YAHSHUA HRIS{" "}
              <span style={{ color: "hsl(var(--lp-primary))" }}>in action</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Pick a time that works for you and our team will walk you through everything.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">

            {/* Benefits panel */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: "hsl(var(--lp-surface))",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h2 className="text-xl font-semibold text-white mb-2">
                What to expect
              </h2>
              <p className="text-white/50 text-sm mb-8">
                A focused, no-pressure session designed around your needs.
              </p>

              <ul className="space-y-5">
                {BENEFITS.map((b, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: "hsl(var(--lp-primary) / 0.15)",
                        color: "hsl(var(--lp-primary))",
                      }}
                    >
                      {b.icon}
                    </span>
                    <span className="text-white/70 text-sm leading-relaxed pt-1.5">
                      {b.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA panel */}
            <div
              className="rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-6"
              style={{
                background: "hsl(var(--lp-surface))",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "hsl(var(--lp-primary) / 0.15)" }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="hsl(var(--lp-primary))" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Pick your time slot
                </h2>
                <p className="text-white/50 text-sm max-w-xs mx-auto">
                  Choose a date and time that works for you. The whole thing takes 30 minutes.
                </p>
              </div>

              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn-primary lp-btn-glow w-full text-center"
                style={{ background: "hsl(var(--lp-primary))", color: "hsl(var(--lp-primary-foreground))" }}
              >
                Book a Demo
              </a>

              <p className="text-white/30 text-xs">
                No credit card required. No commitment.
              </p>
            </div>

          </div>
        </div>
      </main>

      <LpFooter />
    </div>
  );
};

export default BookDemoContent;
