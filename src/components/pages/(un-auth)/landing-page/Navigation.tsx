"use client"
import { useState, useEffect, useRef } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import MainLogo from "@/svg/MainLogo";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUseCasesOpen, setIsUseCasesOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const pathname = usePathname();
  const useCasesDropdownRef = useRef<HTMLDivElement>(null);
  const docsDropdownRef = useRef<HTMLDivElement>(null);
  const getStartedDropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (useCasesDropdownRef.current && !useCasesDropdownRef.current.contains(event.target as Node)) {
        setIsUseCasesOpen(false);
      }
      if (docsDropdownRef.current && !docsDropdownRef.current.contains(event.target as Node)) {
        setIsDocsOpen(false);
      }
      if (getStartedDropdownRef.current && !getStartedDropdownRef.current.contains(event.target as Node)) {
        setIsGetStartedOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Helper function to create proper navigation links
  const getNavLink = (section: string) => {
    if (pathname === '/landing-page') {
      return `#${section}`;
    }
    return `/landing-page#${section}`;
  };

  // Use cases items
  const useCaseItems = [
    { href: "/use-cases/employee-onboarding", label: "Employee Onboarding" },
    { href: "/use-cases/performance-management", label: "Performance Management" },
    { href: "/use-cases/employee-documentation", label: "Employee Documentation" }
  ];

  return (
    <nav className="fixed top-4 left-4 right-4 z-[9999] mb-8">
      <div className="bg-white/70 backdrop-blur-xl rounded-full shadow-lg shadow-black/5 border border-white/30 max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center h-16 px-4 lg:px-6">
          <div className="flex-shrink-0">
            <Link href="/landing-page" className="flex items-center space-x-2">
              <div className="h-6 w-auto">
                <MainLogo />
              </div>
            </Link>
          </div>
          
          <div className="hidden xl:block">
            <div className="ml-8 lg:ml-10 flex items-baseline space-x-5 lg:space-x-7 safari-nav-container">
              <Link href="/features" className="text-indigo-dye hover:text-[#FFC107] px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap">
                Features
              </Link>
              <div className="relative" ref={useCasesDropdownRef}>
                <button
                  onClick={() => setIsUseCasesOpen(!isUseCasesOpen)}
                  className="text-indigo-dye hover:text-[#FFC107] px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center"
                >
                  Use Cases
                  <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${isUseCasesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isUseCasesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 py-2 z-50">
                    <Link
                      href="/use-cases/employee-onboarding"
                      className="block px-4 py-2 text-sm text-indigo-dye hover:bg-gray-100/50 hover:text-[#FFC107] transition-colors"
                      onClick={() => setIsUseCasesOpen(false)}
                    >
                      Employee Onboarding
                    </Link>
                    <Link
                      href="/use-cases/performance-management"
                      className="block px-4 py-2 text-sm text-indigo-dye hover:bg-gray-100/50 hover:text-[#FFC107] transition-colors"
                      onClick={() => setIsUseCasesOpen(false)}
                    >
                      Performance Management
                    </Link>
                  </div>
                )}
              </div>
              <div className="relative" ref={docsDropdownRef}>
                <button
                  onClick={() => setIsDocsOpen(!isDocsOpen)}
                  className="text-indigo-dye hover:text-[#FFC107] px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center"
                >
                  Docs
                  <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${isDocsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDocsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 py-2 z-50">
                    <Link
                      href="/docs"
                      className="block px-4 py-2 text-sm text-indigo-dye hover:bg-gray-100/50 hover:text-[#FFC107] transition-colors"
                      onClick={() => setIsDocsOpen(false)}
                    >
                      Get Setup in YAHSHUA HRIS
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/how-we-compare" className="hidden lg:block text-indigo-dye hover:text-[#FFC107] px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap">
                How We Compare to Others
              </Link>
              <Link href="/landing-page/pricing" className="text-indigo-dye hover:text-[#FFC107] px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap">
                Pricing
              </Link>
            </div>
          </div>

          <div className="hidden xl:flex items-center space-x-4">
            <Link 
              href="/jobs" 
              className="text-indigo-dye hover:text-[#FFC107] px-4 py-2 text-sm font-medium transition-colors border border-indigo-dye hover:border-[#FFC107] rounded-full"
            >
              Find Jobs
            </Link>
            <div className="relative" ref={getStartedDropdownRef}>
              <button
                onClick={() => setIsGetStartedOpen(!isGetStartedOpen)}
                className="bg-[#FFC107] hover:bg-amber-600 text-black px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-lg flex items-center"
              >
                Get Started
                <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${isGetStartedOpen ? 'rotate-180' : ''}`} />
              </button>
              {isGetStartedOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 py-2 z-50">
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-sm text-indigo-dye hover:bg-gray-100/50 hover:text-[#FFC107] transition-colors"
                    onClick={() => setIsGetStartedOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-indigo-dye hover:bg-gray-100/50 hover:text-[#FFC107] transition-colors"
                    onClick={() => setIsGetStartedOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-indigo-dye hover:text-[#FFC107] p-2 rounded-full hover:bg-gray-100/50 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Separate pill-shaped container */}
      {isMenuOpen && (
        <div className="xl:hidden mt-2">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 max-w-screen-2xl mx-auto">
            <div className="px-4 py-4 space-y-1">
              <Link href="/features" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-4 py-2 text-base font-medium rounded-lg transition-colors">
                Features
              </Link>
              <div className="space-y-1">
                <div className="text-indigo-dye px-4 py-2 text-base font-medium">Use Cases</div>
                <Link href="/use-cases/employee-onboarding" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-6 py-2 text-sm font-medium rounded-lg transition-colors">
                  Employee Onboarding
                </Link>
                <Link href="/use-cases/performance-management" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-6 py-2 text-sm font-medium rounded-lg transition-colors">
                  Performance Management
                </Link>
              </div>
              <div className="space-y-1">
                <div className="text-indigo-dye px-4 py-2 text-base font-medium">Docs</div>
                <Link href="/docs" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-6 py-2 text-sm font-medium rounded-lg transition-colors">
                  Get Setup in YAHSHUA HRIS
                </Link>
              </div>
              <Link href="/how-we-compare" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-4 py-2 text-base font-medium rounded-lg transition-colors">
                How We Compare to Others
              </Link>
              <Link href="/landing-page/pricing" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-4 py-2 text-base font-medium rounded-lg transition-colors">
                Pricing
              </Link>
              <div className="pt-3 mt-3 border-t border-gray-200/50 space-y-1">
                <Link href="/jobs" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-4 py-2 text-base font-medium rounded-lg transition-colors border border-indigo-dye hover:border-[#FFC107] rounded-lg">
                  Find Jobs
                </Link>
                <Link href="/register" className="bg-[#FFC107] hover:bg-amber-600 text-black block px-4 py-2 rounded-lg text-base font-medium transition-colors">
                  Sign Up
                </Link>
                <Link href="/login" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-4 py-2 text-base font-medium rounded-lg transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;