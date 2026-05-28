"use client"
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import MainLogo from "@/svg/MainLogo";

const dropdownStyle = {
  background: 'rgba(8,12,30,0.97)',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(20px)',
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const pathname = usePathname();
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const getStartedDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) setIsResourcesOpen(false);
      if (getStartedDropdownRef.current && !getStartedDropdownRef.current.contains(event.target as Node)) setIsGetStartedOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-4 left-4 right-4 z-[9999]">
      {/* Main bar */}
      <div className="rounded-full max-w-screen-2xl mx-auto"
        style={{ background: 'rgba(5,9,26,0.80)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <div className="flex justify-between items-center h-16 px-4 lg:px-6">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-6 w-auto"><MainLogo /></div>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden xl:block">
            <div className="ml-8 lg:ml-10 flex items-baseline space-x-5 lg:space-x-7">
              <Link href="/features" className="text-white/60 hover:text-white px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap">
                Features
              </Link>

              {/* Resources */}
              <div className="relative" ref={resourcesDropdownRef}>
                <button onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className="text-white/60 hover:text-white px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center">
                  Resources
                  <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isResourcesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl shadow-lg py-2 z-50" style={dropdownStyle}>
                    <p className="px-4 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">Use Cases</p>
                    <Link href="/use-cases/employee-onboarding" className="block px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setIsResourcesOpen(false)}>
                      Employee Onboarding
                    </Link>
                    <Link href="/use-cases/performance-management" className="block px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setIsResourcesOpen(false)}>
                      Performance Management
                    </Link>
                    <div className="my-2 mx-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                    <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">Docs</p>
                    <Link href="/docs" className="block px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setIsResourcesOpen(false)}>
                      Get Setup in YAHSHUA HRIS
                    </Link>
                    <div className="my-2 mx-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                    <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">Blog</p>
                    <Link href="/blog" className="block px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setIsResourcesOpen(false)}>
                      HR Insights &amp; Guides
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/pricing" className="text-white/60 hover:text-white px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap">
                Pricing
              </Link>
            </div>
          </div>

          {/* Desktop right CTAs */}
          <div className="hidden xl:flex items-center space-x-3">
            <Link href="/jobs" className="text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition-colors border border-white/15 hover:border-white/30 rounded-full">
              Find Jobs
            </Link>
            <div className="relative" ref={getStartedDropdownRef}>
              <button onClick={() => setIsGetStartedOpen(!isGetStartedOpen)}
                className="bg-primary hover:brightness-110 text-navy px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center shadow-lg"
                style={{ boxShadow: '0 2px 12px rgba(255,193,7,0.3)' }}>
                Get Started
                <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${isGetStartedOpen ? 'rotate-180' : ''}`} />
              </button>
              {isGetStartedOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 rounded-2xl shadow-lg py-2 z-50" style={dropdownStyle}>
                  <Link href="/register" className="block px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setIsGetStartedOpen(false)}>
                    Sign Up
                  </Link>
                  <Link href="/login" className="block px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setIsGetStartedOpen(false)}>
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="xl:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="xl:hidden mt-2">
          <div className="rounded-2xl max-w-screen-2xl mx-auto" style={{ background: 'rgba(5,9,26,0.97)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
            <div className="px-4 py-4 space-y-1">
              <Link href="/features" className="text-white/60 hover:text-white hover:bg-white/5 block px-4 py-2 text-base font-medium rounded-lg transition-colors">Features</Link>
              <div className="space-y-1">
                <div className="text-white/30 px-4 py-2 text-xs uppercase tracking-widest font-semibold">Resources</div>
                <Link href="/use-cases/employee-onboarding" className="text-white/60 hover:text-white hover:bg-white/5 block px-6 py-2 text-sm font-medium rounded-lg transition-colors">Employee Onboarding</Link>
                <Link href="/use-cases/performance-management" className="text-white/60 hover:text-white hover:bg-white/5 block px-6 py-2 text-sm font-medium rounded-lg transition-colors">Performance Management</Link>
                <Link href="/docs" className="text-white/60 hover:text-white hover:bg-white/5 block px-6 py-2 text-sm font-medium rounded-lg transition-colors">Get Setup in YAHSHUA HRIS</Link>
                <Link href="/blog" className="text-white/60 hover:text-white hover:bg-white/5 block px-6 py-2 text-sm font-medium rounded-lg transition-colors">HR Insights &amp; Guides</Link>
              </div>
              <Link href="/pricing" className="text-white/60 hover:text-white hover:bg-white/5 block px-4 py-2 text-base font-medium rounded-lg transition-colors">Pricing</Link>
              <div className="pt-3 mt-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Link href="/jobs" className="text-white/60 hover:text-white hover:bg-white/5 block px-4 py-2 text-base font-medium rounded-lg transition-colors border border-white/15">Find Jobs</Link>
                <Link href="/register" className="bg-primary text-navy block px-4 py-2 rounded-lg text-base font-semibold transition-colors hover:brightness-110">Sign Up</Link>
                <Link href="/login" className="text-white/60 hover:text-white hover:bg-white/5 block px-4 py-2 text-base font-medium rounded-lg transition-colors">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
