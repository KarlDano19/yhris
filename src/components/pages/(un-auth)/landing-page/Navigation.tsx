"use client"
import { useState, useEffect, useRef } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import MainLogo from "@/svg/MainLogo";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUseCasesOpen, setIsUseCasesOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUseCasesOpen(false);
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

  const useCases = [
    { href: "/use-cases/employee-onboarding", label: "Employee Onboarding" },
    { href: "/use-cases/performance-management", label: "Performance Management" },
    { href: "/use-cases/employee-documentation", label: "Employee Documentation" }
  ];

  return (
    <nav className="fixed top-4 left-4 right-4 z-[9999] mb-8">
      <div className="bg-white/70 backdrop-blur-xl rounded-full shadow-lg shadow-black/5 border border-white/30 max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16 px-6 lg:px-8">
          <div className="flex-shrink-0">
            <Link href="/landing-page" className="flex items-center space-x-2">
              <div className="h-6 w-auto">
                <MainLogo />
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href={getNavLink("features")} className="text-indigo-dye hover:text-[#FFC107] px-3 py-2 text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href={getNavLink("integration")} className="text-indigo-dye hover:text-[#FFC107] px-3 py-2 text-sm font-medium transition-colors">
                Integration
              </Link>
              <Link href="/vs-sprout" className="text-indigo-dye hover:text-[#FFC107] px-3 py-2 text-sm font-medium transition-colors">
                How We Compare to Sprout
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUseCasesOpen(!isUseCasesOpen)}
                  className="text-indigo-dye hover:text-[#FFC107] px-3 py-2 text-sm font-medium transition-colors flex items-center"
                >
                  Use Cases
                  <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${isUseCasesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isUseCasesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 py-2 z-50">
                    <Link href="/use-cases" className="block px-4 py-2 text-sm text-indigo-dye hover:bg-gray-100/50 hover:text-[#FFC107] transition-colors">
                      All Use Cases
                    </Link>
                    <div className="border-t border-gray-200/50 my-1"></div>
                    {useCases.map((useCase) => (
                      <Link
                        key={useCase.href}
                        href={useCase.href}
                        className="block px-4 py-2 text-sm text-indigo-dye hover:bg-gray-100/50 hover:text-[#FFC107] transition-colors"
                        onClick={() => setIsUseCasesOpen(false)}
                      >
                        {useCase.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/jobs" className="text-indigo-dye hover:text-[#FFC107] px-3 py-2 text-sm font-medium transition-colors">
                Find Jobs
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-indigo-dye hover:text-[#FFC107] px-4 py-2 text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="bg-[#FFC107] hover:bg-amber-600 text-black px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-lg"
            >
              Get Started
            </Link>
          </div>

          <div className="md:hidden">
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
        <div className="md:hidden mt-2">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/30 max-w-7xl mx-auto">
            <div className="px-4 py-4 space-y-1">
              <Link href={getNavLink("features")} className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-4 py-2 text-base font-medium rounded-lg transition-colors">
                Features
              </Link>
              <Link href={getNavLink("integration")} className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-4 py-2 text-base font-medium rounded-lg transition-colors">
                Integration
              </Link>
              <Link href="/vs-sprout" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-4 py-2 text-base font-medium rounded-lg transition-colors">
                How We Compare to Sprout
              </Link>
              <Link href="/use-cases" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-4 py-2 text-base font-medium rounded-lg transition-colors">
                Use Cases
              </Link>
              <Link href="/jobs" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-4 py-2 text-base font-medium rounded-lg transition-colors">
                Find Jobs
              </Link>
              <div className="pt-3 mt-3 border-t border-gray-200/50 space-y-1">
                <Link href="/login" className="text-indigo-dye hover:text-[#FFC107] hover:bg-gray-100/50 block px-4 py-2 text-base font-medium rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="bg-[#FFC107] hover:bg-amber-600 text-black block px-4 py-2 rounded-lg text-base font-medium transition-colors">
                  Get Started
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