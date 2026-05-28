"use client";
import { useEffect, useState, useRef } from "react";

const DARK_BG = "#0c1120";

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const LpDarkBlobTransition = ({ children }: { children?: React.ReactNode }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      // Section is 200vh tall; sticky div is 100vh, so scrollable = 100vh.
      // progress goes from 0 (section top at viewport top) to 1 (done scrolling).
      const scrollable = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(1, scrolled / Math.max(scrollable, 1)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const eased = easeInOut(progress);
  // 0% = fully hidden at start, 150% = completely fills viewport
  const radius = eased * 150;

  return (
    <>
      {/* Scroll-driver: 115vh tall → only 15vh of scroll triggers the animation,
          so the dark section appears almost immediately after the hero */}
      <section
        ref={sectionRef}
        className="pointer-events-none"
        style={{ height: "115vh", position: "relative", zIndex: 20 }}
      >
        <div
          className="sticky top-0 overflow-hidden pointer-events-none"
          style={{ height: "100vh" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `circle(${radius}% at 50% 100%)`,
              background: DARK_BG,
              willChange: "clip-path",
              transition: "clip-path 0.04s linear",
            }}
          />
        </div>
      </section>

      {/* Dark content: pulled up so it appears right as the blob finishes expanding */}
      <div
        style={{
          background: DARK_BG,
          marginTop: "-100vh",
          position: "relative",
          zIndex: 25,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default LpDarkBlobTransition;
