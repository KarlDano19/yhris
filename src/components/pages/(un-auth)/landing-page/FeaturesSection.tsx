"use client"

import { 
  BriefcaseIcon, 
  UserPlusIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon, 
  GiftIcon, 
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  KeyIcon,
  ClockIcon,
  FolderIcon,
  UserIcon,
  AcademicCapIcon,
  DocumentDuplicateIcon
} from "@heroicons/react/24/outline";

const FeaturesSection = () => {
  const features = [
    {
      icon: BriefcaseIcon,
      title: "Job Posting & Management",
      description: "Create job postings and launch across LinkedIn, Facebook, and YAHSHUA Jobs Portal. View and manage job posting history with status tracking.",
      highlights: ["Multi-platform posting", "Job posting history", "Status tracking"]
    },
    {
      icon: UserPlusIcon,
      title: "Applicant Screening & Onboarding",
      description: "Filter and assess applicants efficiently. Document onboarding process with contract sending, team introductions, and system enrollment via email.",
      highlights: ["Requirements setup", "Interview scheduling", "Digital onboarding"]
    },
    {
      icon: GiftIcon,
      title: "Benefits Design & Management",
      description: "Design your company's benefits and send them to employees via email. Streamline employee perks with structured templates.",
      highlights: ["Custom benefits design", "Email distribution", "Benefits templates"]
    },
    {
      icon: UserIcon,
      title: "Employee Management",
      description: "Securely store all employee information from hire date. Automatic syncing capability for existing YAHSHUA Payroll users.",
      highlights: ["Secure data storage", "YAHSHUA Payroll sync", "Employee profiles"]
    },
    {
      icon: ChartBarIcon,
      title: "Performance Evaluations",
      description: "Keep history of performance evaluations with scores and review details. Create custom evaluation templates tailored to your business needs.",
      highlights: ["Evaluation history", "Customize templates", "Performance tracking"]
    },
    {
      icon: ClockIcon,
      title: "Evaluation Scheduling",
      description: "Ensure reviews happen on time. Assign evaluations, set deadlines, and track completion—all in one place.",
      highlights: ["Digital scheduling", "Deadline tracking", "Completion monitoring"]
    },
    {
      icon: FolderIcon,
      title: "Personnel Movement",
      description: "Document employee movements like regularization or job appointments with approval notes and signatures.",
      highlights: ["Movement tracking", "Approver signatures", "Digital records"]
    },
    {
      icon: DocumentDuplicateIcon,
      title: "Employee Separation",
      description: "Process and document offboarding procedures from clearance forms to quitclaims with comprehensive workflow management.",
      highlights: ["Centralized request for clearance", "Quitclaim processing", "Offboarding workflow"]
    },
    {
      icon: ShieldCheckIcon,
      title: "DOLE Compliance Suite",
      description: "Complete DOLE compliance including compensation logbooks, establishment registration, work accident reports, safety policies, and annual reporting.",
      highlights: ["Access to Rule 1020", "Accident/illness reporting", "Health and Safety documentation"]
    },
    {
      icon: AcademicCapIcon,
      title: "Training & Development",
      description: "Comprehensive training management with evaluation templates, scheduling, and progress tracking for employee development.",
      highlights: ["Training programs", "Progress tracking", "Custom curricula"]
    },
    {
      icon: ArrowPathIcon,
      title: "YAHSHUA Payroll Integration",
      description: "Seamlessly sync employee data with YAHSHUA Payroll. Send memos, NTEs, policies, Personnel Movement Form and other documents directly to employees.",
      highlights: ["Employee data sync", "Document distribution"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-indigo-dye mb-6">
            YAHSHUA HRIS: Employee Data & Job Posting Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage your human resources from recruitment to retirement. 
            Built specifically for Philippine businesses with local compliance in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const isPayrollIntegration = feature.title === "YAHSHUA Payroll Integration";
            return (
              <div 
                key={index}
                className={`rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border ${
                  isPayrollIntegration 
                    ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" 
                    : "bg-white border-gray-100"
                }`}
              >
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${
                  isPayrollIntegration 
                    ? "bg-blue-700/10" 
                    : "bg-[#FFC107]/10"
                }`}>
                  <feature.icon className={`w-7 h-7 ${
                    isPayrollIntegration 
                      ? "text-blue-700" 
                      : "text-[#FFC107]"
                  }`} />
                </div>
                
                <h3 className={`text-xl font-semibold mb-4 ${
                  isPayrollIntegration 
                    ? "text-blue-800" 
                    : "text-indigo-dye"
                }`}>
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <div className={`w-1.5 h-1.5 rounded-full mr-3 ${
                        isPayrollIntegration 
                          ? "bg-blue-700" 
                          : "bg-[#FFC107]"
                      }`}></div>
                      {highlight}
                    </li>
                  ))}
                </ul>

                {isPayrollIntegration && (
                  <a 
                    href="/yahshua-payroll" 
                    className="inline-flex items-center px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    Learn More About YAHSHUA Payroll
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-indigo-dye mb-4">
              Why Choose YAHSHUA HRIS?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="text-xl font-bold text-[#FFC107] mb-2">Facebook, LinkedIn, and YAHSHUA Jobs</div>
                <div className="text-gray-600">Job posting automation</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#FFC107] mb-2">Be 100% DOLE Compliant</div>
                <div className="text-gray-600">With Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#FFC107] mb-2">Complete 100% DOLE Reports</div>
                <div className="text-gray-600">Ready to Submit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FFC107] mb-2">Excellent</div>
                <div className="text-gray-600">Support Response</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;