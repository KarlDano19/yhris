"use client";
import { useEffect, useRef, useState, ReactNode, CSSProperties } from "react";

interface ScrollFadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

const ScrollFadeIn = ({
  children,
  className = "",
  delay = 0,
  duration = 700,
}: ScrollFadeInProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style: CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
    transform: visible ? "translateY(0px) scale(1)" : "translateY(56px) scale(0.97)",
    opacity: visible ? 1 : 0,
  };

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollFadeIn;
