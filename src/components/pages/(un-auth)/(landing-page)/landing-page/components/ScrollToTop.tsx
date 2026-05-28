"use client";

import { useState, useEffect } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-8 z-50 w-10 h-10 rounded-full flex items-center justify-center bg-primary text-navy shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none"
      style={{ boxShadow: "0 2px 8px hsl(43 100% 51% / 0.35), 0 0 30px hsl(43 100% 51% / 0.2)" }}
    >
      <ArrowUpIcon className="w-4 h-4" strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTop;
