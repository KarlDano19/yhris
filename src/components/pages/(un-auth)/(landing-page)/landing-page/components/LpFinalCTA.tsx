"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import ScrollFadeIn from "./ScrollFadeIn";
import AnimatedHeadline from "./AnimatedHeadline";

const DEMO_CALENDAR_URL =
  "https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026";

const LpFinalCTA = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleBookDemo = () => {
    if (!email.trim()) return;
    const url = `${DEMO_CALENDAR_URL}&email=${encodeURIComponent(email.trim())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

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
            {submitted ? (
              <div
                className="flex items-center gap-3 px-5 py-4 rounded-[10px] max-w-[500px] mx-auto"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#16a34a' }} />
                <div className="text-left">
                  <p className="text-sm font-semibold" style={{ color: '#15803d' }}>Booking calendar opened!</p>
                  <p className="text-xs mt-0.5">
                    <span style={{ color: '#166534' }}>Pick a time slot that works for you.</span>{" "}
                    <button onClick={() => setSubmitted(false)} className="underline" style={{ color: '#15803d' }}>
                      Try a different email
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-2 max-w-[500px] mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBookDemo()}
                  placeholder="Enter work email"
                  className="flex-1 w-full px-5 py-3.5 text-sm outline-none rounded-[10px]"
                  style={{
                    color: 'hsl(213 32% 18%)',
                    border: '1px solid hsl(213 32% 18% / 0.15)',
                    background: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                />
                <button
                  onClick={handleBookDemo}
                  disabled={!email.trim()}
                  className="lp-btn-primary lp-btn-glow gap-2 text-sm whitespace-nowrap w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Book a Free Demo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="mt-6">
              <Link href="/features" className="lp-btn-ghost-dark text-base px-9 py-4">
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
