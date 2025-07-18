"use client"

import Link from "next/link";
import { ArrowRightIcon, BriefcaseIcon, BuildingOfficeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const NewHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Modern floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-indigo-200">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Trusted by 1000+ Philippine businesses
          </div> */}
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-6 leading-tight">
            Your Complete
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">HR Solution</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Whether you're looking for your next career opportunity or need complete HR management for your business, 
            YAHSHUA HRIS connects talent with opportunity while streamlining HR operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Job Seekers Section */}
          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:border-amber-200/50 transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:from-amber-400/30 group-hover:to-orange-400/30 transition-all duration-300">
              <BriefcaseIcon className="w-8 h-8 text-amber-500" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-dye mb-4 text-center">
              Looking for a Job?
            </h2>
            
            <p className="text-gray-600 mb-6 text-center leading-relaxed">
              Find opportunities from companies across the Philippines. Our platform connects you with employers 
              who post jobs across multiple platforms including LinkedIn and Facebook.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-[#FFC107] rounded-full mr-3"></div>
                <span>Browse jobs from verified employers</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-[#FFC107] rounded-full mr-3"></div>
                <span>Apply directly through the platform</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-[#FFC107] rounded-full mr-3"></div>
                <span>Track your application status</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                href="/jobs" 
                className="group bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Browse Jobs
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* HRIS Users Section */}
          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:border-indigo-200/50 transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:from-indigo-400/30 group-hover:to-blue-400/30 transition-all duration-300">
              <BuildingOfficeIcon className="w-8 h-8 text-indigo-600" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-dye mb-4 text-center">
              Need an HRIS System?
            </h2>
            
            <p className="text-gray-600 mb-6 text-center leading-relaxed">
              Complete HR management solution for Philippine businesses. From recruitment to retirement, 
              manage your entire workforce with DOLE compliance built-in.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-indigo-dye rounded-full mr-3"></div>
                <span>Complete employee data management</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-indigo-dye rounded-full mr-3"></div>
                <span>Automated job posting across platforms</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-indigo-dye rounded-full mr-3"></div>
                <span>Built-in DOLE compliance reporting</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                href="/register" 
                className="group bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 mb-20 max-w-6xl mx-auto">
          <div className="text-center group px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:from-amber-400/30 group-hover:to-orange-400/30 transition-all duration-300">
              <BriefcaseIcon className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Multi-Platform Reach</h3>
            <p className="text-slate-600 text-base leading-relaxed">Jobs posted to LinkedIn, Facebook, and YAHSHUA Jobs Portal</p>
          </div>
          
          <div className="text-center group px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:from-green-400/30 group-hover:to-emerald-400/30 transition-all duration-300">
              <BuildingOfficeIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">DOLE Compliant</h3>
            <p className="text-slate-600 text-base leading-relaxed">Built-in compliance with Philippine labor regulations</p>
          </div>
          
          <div className="text-center group px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:from-indigo-400/30 group-hover:to-blue-400/30 transition-all duration-300">
              <UserGroupIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Complete Solution</h3>
            <p className="text-slate-600 text-base leading-relaxed">From hiring to retirement - manage entire employee lifecycle</p>
          </div>
        </div>
      </div>

      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-indigo-dye rounded-full flex justify-center">
          <div className="w-1 h-3 bg-indigo-dye rounded-full mt-2"></div>
        </div>
      </div> */}
    </section>
  );
};

export default NewHeroSection;