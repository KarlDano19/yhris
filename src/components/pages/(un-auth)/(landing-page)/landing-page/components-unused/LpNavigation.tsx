"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Jobs", href: "#jobs" },
  { label: "Support", href: "#support" },
];

const LpNavigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-sm border-b border-[hsl(var(--lp-border))]" : ""
      }`}
    >
      <div className="lp-section-container h-full flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Image src="/logo.png" alt="YAHSHUA HRIS" width={32} height={32} className="rounded-lg object-cover" />
          <span className="font-bold text-lg text-navy">
            YAHSHUA <span className="font-medium">HRIS</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[hsl(var(--lp-muted-foreground))] hover:text-navy transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a href="#demo" className="hidden md:inline-flex lp-btn-primary text-sm py-2.5 px-5">
          Request a Demo
        </a>

        <button
          className="md:hidden p-2 text-navy"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[hsl(var(--lp-border))] px-5 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm font-medium text-[hsl(var(--lp-muted-foreground))] hover:text-navy"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="#demo" className="lp-btn-primary text-sm py-2.5 px-5 w-full text-center">
            Request a Demo
          </a>
        </div>
      )}
    </nav>
  );
};

export default LpNavigation;
