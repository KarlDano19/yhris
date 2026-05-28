"use client";
import { useEffect, useState, useRef } from "react";

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const LpScrollZoom = ({ children }: { children?: React.ReactNode }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [marginTop, setMarginTop] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const hero = el.previousElementSibling as HTMLElement | null;
    const heroHeight = hero ? hero.offsetHeight : 0;
    setMarginTop(heroHeight);

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(1, scrolled / scrollable));
    };

    const handleResize = () => {
      const h = hero ? hero.offsetHeight : 0;
      setMarginTop(h);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const radius = easeInOut(progress) * 75;

  return (
    <>
      <section
        ref={sectionRef}
        className="pointer-events-none"
        style={{ height: "140vh", marginTop: `-${marginTop}px`, position: "relative", zIndex: 20 }}
      >
        <div
          className="sticky top-0 overflow-hidden pointer-events-none"
          style={{ height: "100vh", background: "transparent" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `circle(${radius}% at 50% 50%)`,
              background: "hsl(var(--lp-surface))",
              willChange: "clip-path",
            }}
          />
        </div>
      </section>

      <div style={{ background: "hsl(var(--lp-surface))", marginTop: "-35vh", position: "relative", zIndex: 25 }}>
        {children}
      </div>
    </>
  );
};

export default LpScrollZoom;
