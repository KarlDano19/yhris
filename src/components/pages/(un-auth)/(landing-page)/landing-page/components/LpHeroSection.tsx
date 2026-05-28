"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import ScrollFadeIn from "./ScrollFadeIn";
import LpHeroDashboard from "./LpHeroDashboard";

const DEMO_CALENDAR_URL =
  "https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026";

const LpHeroSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleBookDemo = () => {
    if (!email.trim()) return;
    const url = `${DEMO_CALENDAR_URL}&email=${encodeURIComponent(email.trim())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <section className="relative pt-32 pb-0 md:pt-44 md:pb-0 overflow-hidden lp-hero-glow" style={{ background: '#ffffff', zIndex: 15 }}>

      <div className="lp-section-container relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-center">

          {/* Left */}
          <div className="max-w-xl">
            <ScrollFadeIn delay={0}>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 text-xs font-semibold"
                style={{
                  background: 'rgba(255,193,7,0.1)',
                  border: '1px solid rgba(255,193,7,0.35)',
                  color: 'hsl(38 92% 40%)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(38 92% 40%)' }} />
                Simplifying HR in One Place
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={80}>
              <h1
                className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold mb-6 tracking-tight"
                style={{ color: 'hsl(213 32% 18%)' }}
              >
                <span className="block mb-3">
                  The Only HRIS Your<br className="hidden md:block" /> HR Team Will
                </span>
                <span style={{ color: 'hsl(var(--lp-primary))' }}>Ever Need.</span>
              </h1>
            </ScrollFadeIn>

            <ScrollFadeIn delay={160}>
              <p
                className="text-base md:text-lg leading-relaxed max-w-[460px] mb-10"
                style={{ color: 'hsl(213 25% 42%)' }}
              >
                Hiring, attendance, payroll sync, DOLE compliance, and performance. All in one place, no more chasing records across five different tools.
              </p>
            </ScrollFadeIn>

            {submitted ? (
              <div
                className="flex items-center gap-3 px-5 py-4 rounded-[10px] max-w-[500px]"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#16a34a' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#15803d' }}>Booking calendar opened!</p>
                  <p className="text-xs mt-0.5" style={{ color: '#4ade80', opacity: 0.8 }}>
                    <span style={{ color: '#166534' }}>Pick a time slot that works for you.</span>{" "}
                    <button onClick={() => setSubmitted(false)} className="underline" style={{ color: '#15803d' }}>
                      Try a different email
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-2 max-w-[500px]">
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
          </div>

          {/* Right — Animated Dashboard */}
          <ScrollFadeIn delay={320} className="lg:justify-self-end w-full">
            <div className="relative w-full mx-auto lg:ml-20">
              {/* Glow behind dashboard */}
              <div
                className="absolute -inset-6 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(53,95,208,0.1) 0%, rgba(255,193,7,0.06) 50%, transparent 75%)' }}
              />
              <div className="lp-hero-float relative">
                <LpHeroDashboard />
              </div>
            </div>
          </ScrollFadeIn>

        </div>
      </div>
    </section>
  );
};

export default LpHeroSection;
