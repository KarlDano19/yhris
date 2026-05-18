"use client"

import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  DocumentTextIcon,
  ClockIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

const UseCasesSection = () => {
  const useCases = [
    {
      icon: BuildingOfficeIcon,
      title: "Small to Medium Enterprises (SMEs)",
      description: "Perfect for growing businesses that need comprehensive employee data management without the complexity. YAHSHUA HRIS provides all essential HR functions including payroll integration, job posting automation, and DOLE compliance reporting.",
      benefits: [
        "Streamlined employee data synchronization",
        "Automated payroll processing with YAHSHUA Payroll features",
        "Multi-platform job posting (Facebook, LinkedIn, YAHSHUA Jobs)",
        "Built-in DOLE compliance and reporting"
      ]
    },
    {
      icon: UserGroupIcon,
      title: "HR Departments & Teams",
      description: "Empower your HR team with comprehensive tools for complete employee lifecycle management. From recruitment through retirement, manage all HR processes with advanced YAHSHUA payroll features and employee data synchronization.",
      benefits: [
        "Complete applicant screening and onboarding workflows",
        "Advanced employee performance evaluation system",
        "Seamless employee data sync with existing payroll systems",
        "Comprehensive benefits design and management"
      ]
    },
    {
      icon: ChartBarIcon,
      title: "Performance Management Use Cases",
      description: "Transform your performance management with structured evaluation processes, goal tracking, and development planning. Our use cases documentation provides detailed implementation guides for various performance scenarios.",
      benefits: [
        "Structured performance evaluation templates",
        "Goal setting and progress tracking",
        "Employee development planning",
        "Performance analytics and reporting"
      ]
    },
    {
      icon: DocumentTextIcon,
      title: "Compliance & Documentation",
      description: "Ensure 100% DOLE compliance with comprehensive documentation management. Access detailed use cases docs for various compliance scenarios and automated reporting features.",
      benefits: [
        "Digital personnel movement documentation",
        "Comprehensive employee separation processing"
      ]
    },
    {
      icon: CurrencyDollarIcon,
      title: "Payroll Integration Use Cases",
      description: "Discover powerful YAHSHUA Payroll features through real-world use cases. Seamlessly sync employee data between HR and payroll systems for accurate, efficient payroll processing.",
      benefits: [
        "Real-time employee data synchronization",
        "Automated payroll calculations and processing",
        "Integration with existing accounting systems",
        "Detailed payroll reporting and analytics"
      ]
    },
    {
      icon: ArrowPathIcon,
      title: "Workflow Automation",
      description: "Streamline HR workflows with intelligent automation. From job posting across multiple platforms to employee onboarding, our system automates repetitive tasks while maintaining compliance.",
      benefits: [
        "Multi-platform job posting automation",
        "Automated applicant screening workflows",
        "Digital onboarding and document management",
        "Intelligent task routing and approvals"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-indigo-dye mb-6">
            YAHSHUA HRIS Use Cases: Real-World Applications
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Explore comprehensive use cases and documentation for YAHSHUA HRIS implementation. 
            Discover how our YAHSHUA payroll features, employee data management, and job posting 
            automation transform businesses across the Philippines. Access detailed use cases docs 
            and implementation guides for every business scenario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 bg-[#FFC107]/10 rounded-lg flex items-center justify-center mb-6">
                <useCase.icon className="w-7 h-7 text-[#FFC107]" />
              </div>
              
              <h3 className="text-xl font-semibold text-indigo-dye mb-4">
                {useCase.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {useCase.description}
              </p>
              
              <ul className="space-y-3">
                {useCase.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <div className="w-2 h-2 bg-[#FFC107] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-indigo-dye to-[#355FD0] rounded-2xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Implement YAHSHUA HRIS in Your Business?
          </h3>
          <p className="text-lg mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of Philippine businesses already using YAHSHUA HRIS for complete payroll management, 
            employee data synchronization, and automated job posting. Start your free trial today and discover 
            why our YAHSHUA payroll features are trusted by businesses nationwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register" 
              className="bg-[#FFC107] hover:bg-amber-600 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Sign up now for free!
            </a>
            <a 
              href="/use-cases" 
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-dye px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              View Use Cases Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;