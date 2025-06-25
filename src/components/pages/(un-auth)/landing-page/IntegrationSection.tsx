"use client"

import Link from "next/link";
import Image from "next/image";

import { ArrowPathIcon, CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

import MainLogo from "@/svg/MainLogo";

import ypoLogo from "@/assets/landing-page-images/ypo-logo.png";

const IntegrationSection = () => {
  const integrationFeatures = [
    "Real-time employee data synchronization",
    "Distribute memos and policies directly",
    "Unified employee records management",
    "Document distribution via email",
    "Reduced manual data entry and errors",
    "Seamless workflow integration"
  ];

  return (
    <section id="integration" className="py-20 bg-gradient-to-br from-blue-900/5 via-slate-50 to-yellow-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-800/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-yellow-200/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-blue-700/25 to-yellow-300/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-indigo-dye mb-6">
            Seamless Integration
            <br />
            <span className="text-[#FFC107]">YAHSHUA HRIS</span> + <span className="text-blue-700">YAHSHUA Payroll</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Sync employee data with YAHSHUA Payroll and send Personnel Movement Forms, memos, policies, and other documents 
            directly to employees. Streamlined document distribution and data management in one unified system.
          </p>
          
          {/* Logo Integration Visual */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow min-w-[280px]">
              <div className="flex flex-col items-center">
                <MainLogo />
                <p className="text-sm font-medium text-indigo-dye mt-2">YAHSHUA HRIS</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-1 mb-2">
                <ArrowRightIcon className="w-6 h-6 text-blue-700" />
                <ArrowLeftIcon className="w-6 h-6 text-[#FFC107]" />
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-700 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#FFC107] rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-blue-700 rounded-full animate-pulse delay-300"></div>
              </div>
              <p className="text-xs font-medium text-gray-500 mt-2">Real-time Sync</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow min-w-[280px]">
              <div className="flex items-center justify-center gap-3">
                <Image 
                  src={ypoLogo} 
                  alt="YAHSHUA Payroll Online" 
                  width={60} 
                  height={60}
                  className="object-contain flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-blue-800">YAHSHUA</span>
                  <span className="text-lg font-bold text-blue-800">Payroll</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#FFC107]/10 rounded-lg flex items-center justify-center mr-4">
                  <ArrowPathIcon className="w-6 h-6 text-[#FFC107]" />
                </div>
                <h3 className="text-2xl font-bold text-indigo-dye">
                  Unified Workflow
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Sync employee data with YAHSHUA Payroll and distribute important documents like Personnel Movement Forms, 
                memos, and policies directly to employees via email.
              </p>

              <div className="space-y-4">
                {integrationFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 relative z-10">
              <h4 className="text-xl font-semibold text-indigo-dye mb-4">How It Works</h4>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#FFC107] text-black rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-indigo-dye mb-1">Employee Onboarding</h5>
                    <p className="text-gray-600 text-sm">Create employee profile in YAHSHUA HRIS with all necessary information</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#FFC107] text-black rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-indigo-dye mb-1">Automatic Sync</h5>
                    <p className="text-gray-600 text-sm">Employee data automatically syncs to YAHSHUA Payroll in real-time</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#FFC107] text-black rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-indigo-dye mb-1">Payroll Ready</h5>
                    <p className="text-gray-600 text-sm">Employee is immediately ready for payroll processing with accurate data</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-[#FFC107]/20 to-amber-400/20 rounded-2xl transform rotate-3 -z-10"></div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-indigo-dye mb-4">
              Ready to Streamline Your HR Operations?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Join companies using YAHSHUA HRIS for employee data sync and document distribution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="bg-[#FFC107] hover:bg-amber-600 text-black px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                Start Free Trial
              </Link>
              <Link 
                href="#contact" 
                className="border-2 border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-black px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;