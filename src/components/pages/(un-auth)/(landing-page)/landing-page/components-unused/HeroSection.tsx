"use client"

import Link from "next/link";

import { ArrowRightIcon, BoltIcon, GlobeAltIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-24">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-indigo-dye mb-6 mt-8 leading-tight">
            YAHSHUA HRIS: Complete 
            <br />
            <span className="text-[#FFC107]">Employee Data Management</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your business with YAHSHUA HRIS - the complete payroll and employee data management system. 
            Seamlessly sync employee data, automate job posting across platforms, and discover powerful payroll features with YAHSHUA Payroll.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/landing-page/pricing" 
              className="group bg-[#FFC107] hover:bg-amber-600 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Start Your 30 Day Free Trial
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#features" 
              className="text-indigo-dye hover:text-[#FFC107] px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-dye hover:border-[#FFC107] transition-colors"
            >
              See How It Works
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-20 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-[#FFC107]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BoltIcon className="w-6 h-6 text-[#FFC107]" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-dye mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Post jobs to multiple platforms in seconds, not hours</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-[#FFC107]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <GlobeAltIcon className="w-6 h-6 text-[#FFC107]" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-dye mb-2">DOLE Compliant</h3>
              <p className="text-gray-600">Built-in compliance with Philippine labor regulations</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-[#FFC107]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <UserGroupIcon className="w-6 h-6 text-[#FFC107]" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-dye mb-2">Complete HRIS</h3>
              <p className="text-gray-600">From hiring to retirement - manage entire employee lifecycle</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-indigo-dye rounded-full flex justify-center">
          <div className="w-1 h-3 bg-indigo-dye rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;