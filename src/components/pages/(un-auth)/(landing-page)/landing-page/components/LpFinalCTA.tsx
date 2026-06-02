"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import ScrollFadeIn from "./ScrollFadeIn";
import AnimatedHeadline from "./AnimatedHeadline";

const DEMO_CALENDAR_URL =
  "https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026";

const isValidEmail = (val: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

const LpFinalCTA = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleBookDemo = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    const url = `${DEMO_CALENDAR_URL}&email=${encodeURIComponent(email.trim())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    // Non-blocking — fire and forget
    fetch('/api/capture-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    }).catch(() => {});
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
              <div className="flex flex-col items-center max-w-[500px] mx-auto">
                <div className="flex flex-col sm:flex-row items-start gap-2 w-full">
                  <div className="flex-1 w-full">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleBookDemo()}
                      placeholder="Enter work email"
                      className="w-full px-5 py-3.5 text-sm outline-none rounded-[10px] transition-all duration-200"
                      style={{
                        color: 'hsl(213 32% 18%)',
                        border: error ? '1px solid rgba(239,68,68,0.6)' : '1px solid hsl(213 32% 18% / 0.15)',
                        background: '#ffffff',
                        boxShadow: error
                          ? '0 0 0 3px rgba(239,68,68,0.1)'
                          : '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    />
                  </div>
                  <button
                    onClick={handleBookDemo}
                    className="lp-btn-primary lp-btn-glow gap-2 text-sm whitespace-nowrap w-full sm:w-auto"
                  >
                    Book a Free Demo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {error && (
                  <p className="text-xs mt-2 font-medium self-start" style={{ color: 'rgba(239,68,68,0.9)' }}>
                    {error}
                  </p>
                )}
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
