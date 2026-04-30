"use client";
import { useScrollReveal } from "./hooks/useScrollReveal";

interface AnimatedCheckmarkProps {
  delay?: number;
  children: React.ReactNode;
}

const AnimatedCheckmark = ({ delay = 0, children }: AnimatedCheckmarkProps) => {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <li
      ref={ref}
      className={`flex items-start gap-3 text-sm transition-all duration-200 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span
        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
          visible ? "bg-primary/15 scale-100" : "bg-transparent scale-75"
        }`}
        style={{ transitionDelay: `${delay + 100}ms` }}
      >
        <svg
          className={`w-3 h-3 text-primary transition-all duration-300 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
          style={{ transitionDelay: `${delay + 200}ms` }}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 6l3 3 5-5" />
        </svg>
      </span>
      <span className="text-gray-600">{children}</span>
    </li>
  );
};

export default AnimatedCheckmark;
