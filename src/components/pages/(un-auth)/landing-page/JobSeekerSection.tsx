"use client"

import Link from "next/link";
import { BriefcaseIcon, EyeIcon, ClockIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const JobSeekerSection = () => {
  const features = [
    {
      icon: BriefcaseIcon,
      title: "Browse Quality Jobs",
      description: "Access job opportunities from verified employers across the Philippines. Our platform connects you with companies that use our HR system for their hiring needs."
    },
    {
      icon: EyeIcon,
      title: "Direct Application Process",
      description: "Apply directly through our platform with a simple, streamlined process. No need to navigate multiple job boards - everything is in one place."
    },
    {
      icon: ClockIcon,
      title: "Application Tracking",
      description: "Track your application status in real-time. Get updates on your application progress and stay informed throughout the hiring process."
    },
    {
      icon: UserGroupIcon,
      title: "Connect with Employers",
      description: "Get matched with companies that value your skills. Our system helps employers find the right talent efficiently."
    }
  ];

  return (
    <section id="job-seekers" className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-orange-100/20"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm text-amber-600 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-amber-200/50">
            <BriefcaseIcon className="w-4 h-4 mr-2" />
            Perfect for job seekers
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6">
            For Job Seekers
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Find your next career opportunity with employers who use YAHSHUA HRIS. 
            Our platform makes job searching and application tracking simple and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-amber-200/50 transform hover:scale-105"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-lg flex items-center justify-center mb-6 group-hover:from-amber-400/30 group-hover:to-orange-400/30 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-amber-500" />
              </div>
              
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Ready to Find Your Next Job?
          </h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Browse available positions from companies across the Philippines. 
            Create your profile and start applying to jobs that match your skills and experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/jobs" 
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse Available Jobs
            </Link>
            <Link 
              href="/register" 
              className="border-2 border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Create Job Seeker Profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSeekerSection;