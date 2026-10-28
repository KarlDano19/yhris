"use client";
import { ReactNode } from "react";

interface ScrollFadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

const ScrollFadeIn = ({ children, className = "" }: ScrollFadeInProps) => {
  return <div className={className}>{children}</div>;
};

export default ScrollFadeIn;
