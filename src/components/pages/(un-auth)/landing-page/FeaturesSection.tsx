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
  ArrowPathIcon
} from "@heroicons/react/24/outline";

const FeaturesSection = () => {
  const features = [
    {
      icon: BriefcaseIcon,
      title: "Job Posting & Recruitment",
      description: "Create once, post everywhere. Distribute job postings across 50+ platforms with one click. Advanced applicant tracking and screening tools.",
      highlights: ["Multi-platform posting", "ATS integration", "Candidate screening"]
    },
    {
      icon: UserPlusIcon,
      title: "Employee Onboarding & Offboarding",
      description: "Streamlined processes for welcoming new hires and managing departures. Automated workflows ensure nothing falls through the cracks.",
      highlights: ["Digital onboarding", "Exit interviews", "Document automation"]
    },
    {
      icon: DocumentTextIcon,
      title: "Memos & Policy Creation",
      description: "Generate professional memos and company policies with our intuitive builder. Ensure consistent communication across your organization.",
      highlights: ["Template library", "Digital signatures", "Version control"]
    },
    {
      icon: ExclamationTriangleIcon,
      title: "Employee Issue Management",
      description: "Handle employee concerns, grievances, and disciplinary actions with proper documentation and workflow management.",
      highlights: ["Case tracking", "Escalation workflows", "Compliance reporting"]
    },
    {
      icon: GiftIcon,
      title: "Benefits Design & Management",
      description: "Create, manage, and track employee benefits packages. From health insurance to retirement plans, keep everything organized.",
      highlights: ["Benefits calculator", "Enrollment management", "Cost analysis"]
    },
    {
      icon: ChartBarIcon,
      title: "Performance Evaluations",
      description: "Comprehensive performance management system with customizable evaluation forms, 360-degree feedback, and goal tracking.",
      highlights: ["Custom evaluations", "360 feedback", "Goal setting"]
    },
    {
      icon: ShieldCheckIcon,
      title: "DOLE Compliance",
      description: "Stay compliant with Philippine labor laws. Automated reporting and documentation aligned with Department of Labor regulations.",
      highlights: ["Automated reporting", "Legal compliance", "Audit trails"]
    },
    {
      icon: CogIcon,
      title: "Standardized Processes",
      description: "Implement consistent HR processes across your organization with customizable workflows and approval systems.",
      highlights: ["Workflow automation", "Approval chains", "Process templates"]
    },
    {
      icon: ArrowPathIcon,
      title: "YAHSHUA Payroll Integration",
      description: "Seamlessly sync with YAHSHUA Payroll for unified HR and payroll management. Single source of truth for employee data.",
      highlights: ["Real-time sync", "Data consistency", "Unified reporting"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-indigo-dye mb-6">
            Complete HRIS Solution
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FFC107] mb-2">50+</div>
                <div className="text-gray-600">Job Board Integrations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FFC107] mb-2">100%</div>
                <div className="text-gray-600">DOLE Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FFC107] mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;