"use client";

interface AnimatedHeadlineProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

const AnimatedHeadline = ({ children, className = "" }: AnimatedHeadlineProps) => {
  return <div className={className}>{children}</div>;
};

export default AnimatedHeadline;
