"use client";
import { useRef, useState, useEffect } from "react";

interface AnimatedHeadlineProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

const AnimatedHeadline = ({
  children,
  className = "",
  delay = 0,
  stagger = 45,
}: AnimatedHeadlineProps) => {
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
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = children.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block mr-[0.28em]"
          style={{
            transform: visible ? "translateY(0)" : "translateY(24px)",
            opacity: visible ? 1 : 0,
            transition: "transform 600ms cubic-bezier(0.23, 1, 0.32, 1), opacity 500ms ease",
            transitionDelay: `${delay + i * stagger}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default AnimatedHeadline;
