"use client"

import Link from "next/link";
import { 
  UserPlusIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  ChartBarIcon,
  BriefcaseIcon,
  ArrowPathIcon,
  GiftIcon,
  CogIcon
} from "@heroicons/react/24/outline";

const HRISUserSection = () => {
  const features = [
    {
      icon: BriefcaseIcon,
      title: "Job Posting & Management",
      description: "Create job postings and launch across LinkedIn, Facebook, and YAHSHUA Jobs Portal. View and manage job posting history with status tracking."
    },
    {
      icon: UserPlusIcon,
      title: "Applicant Screening & Onboarding",
      description: "Filter and assess applicants efficiently. Document onboarding process with contract sending, team introductions, and system enrollment via email."
    },
    {
      icon: DocumentTextIcon,
      title: "Employee Management",
      description: "Securely store all employee information from hire date. Automatic syncing capability for existing YAHSHUA Payroll users."
    },
    {
      icon: ChartBarIcon,
      title: "Performance Evaluations",
      description: "Keep history of performance evaluations with scores and review details. Create custom evaluation templates tailored to your business needs."
    },
    {
      icon: ShieldCheckIcon,
      title: "DOLE Compliance Suite",
      description: "Complete DOLE compliance including compensation logbooks, establishment registration, work accident reports, safety policies, and annual reporting."
    },
    {
      icon: GiftIcon,
      title: "Benefits Design & Management",
      description: "Design your company's benefits and send them to employees via email. Streamline employee perks with structured templates."
    },
    {
      icon: CogIcon,
      title: "Personnel Movement",
      description: "Document employee movements like regularization or job appointments with approval notes and signatures."
    },
    {
      icon: ArrowPathIcon,
      title: "YAHSHUA Payroll Integration",
      description: "Seamlessly sync employee data with YAHSHUA Payroll. Send memos, NTEs, policies, Personnel Movement Form and other documents directly to employees."
    }
  ];

  return (
    <section id="hris-users" className="py-20 bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 via-transparent to-blue-100/20"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-indigo-200/50">
            <ShieldCheckIcon className="w-4 h-4 mr-2" />
            Trusted by HR professionals
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6">
            For HR Managers & Business Owners
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto">
            Complete HR management solution built specifically for Philippine businesses. 
            From recruitment to retirement, manage your entire workforce with DOLE compliance built-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const isPayrollIntegration = feature.title === "YAHSHUA Payroll Integration";
            return (
              <div 
                key={index}
                className={`group rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border transform hover:scale-105 ${
                  isPayrollIntegration 
                    ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300" 
                    : "bg-white/90 backdrop-blur-sm border-white/20 hover:border-indigo-200/50"
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${
                  isPayrollIntegration 
                    ? "bg-gradient-to-br from-blue-400/20 to-blue-500/20 group-hover:from-blue-400/30 group-hover:to-blue-500/30" 
                    : "bg-gradient-to-br from-indigo-400/20 to-blue-400/20 group-hover:from-indigo-400/30 group-hover:to-blue-400/30"
                }`}>
                  <feature.icon className={`w-6 h-6 ${
                    isPayrollIntegration 
                      ? "text-blue-600" 
                      : "text-indigo-600"
                  }`} />
                </div>
                
                <h3 className={`text-lg font-semibold mb-3 ${
                  isPayrollIntegration 
                    ? "text-blue-800" 
                    : "text-slate-800"
                }`}>
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center group">
              <div className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Multi-Platform Posting</div>
              <div className="text-slate-600">Facebook, LinkedIn, and YAHSHUA Jobs</div>
            </div>
            <div className="text-center group">
              <div className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors">100% DOLE Compliant</div>
              <div className="text-slate-600">With Confidence</div>
            </div>
            <div className="text-center group">
              <div className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Complete DOLE Reports</div>
              <div className="text-slate-600">Ready to Submit</div>
            </div>
            <div className="text-center group">
              <div className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">Excellent Support</div>
              <div className="text-slate-600">Response Time</div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Ready to Transform Your HR Operations?
            </h3>
            <p className="text-slate-600 mb-8 max-w-3xl mx-auto">
              Join thousands of Philippine businesses using YAHSHUA HRIS for complete employee management, 
              automated job posting, and DOLE compliance. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Sign up now for free!
              </Link>
              <Link 
                href="/features" 
                className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
              >
                See All Features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HRISUserSection;