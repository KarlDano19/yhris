"use client"

import { 
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CalculatorIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

const PayrollFeaturesSection = () => {
  const payrollFeatures = [
    {
      icon: CurrencyDollarIcon,
      title: "Advanced Payroll Processing",
      description: "Experience seamless payroll management with YAHSHUA payroll features designed for Philippine businesses. Automated calculations, tax compliance, and comprehensive reporting.",
      details: [
        "Automated salary calculations with overtime and holiday pay",
        "SSS, PhilHealth, and Pag-IBIG automatic computations",
        "13th month pay and bonus calculations",
        "Comprehensive payroll reports and analytics"
      ]
    },
    {
      icon: ArrowPathIcon,
      title: "Employee Data Synchronization",
      description: "Seamlessly sync employee data between HRIS and payroll systems. Real-time updates ensure accuracy and eliminate data entry errors.",
      details: [
        "Real-time employee data sync across all modules",
        "Automatic updates for salary changes and adjustments",
        "Centralized employee information management",
        "Data integrity validation and error prevention"
      ]
    },
    {
      icon: DocumentChartBarIcon,
      title: "Comprehensive Reporting Suite",
      description: "Generate detailed payroll reports, compliance documents, and analytics. Access government-required reports with one-click generation.",
      details: [
        "BIR Form 2316 (Certificate of Compensation Payment)",
        "SSS, PhilHealth, and Pag-IBIG contribution reports",
        "Payroll register and summary reports",
        "Custom reporting with advanced filters"
      ]
    },
    {
      icon: ShieldCheckIcon,
      title: "DOLE & Government Compliance",
      description: "Ensure 100% compliance with Philippine labor laws and government requirements. Built-in compliance checks and automated reporting.",
      details: [
        "DOLE Rule 1020 full compliance",
        "Automatic tax table updates",
        "Government contribution compliance monitoring",
        "Labor standards compliance checking"
      ]
    },
    {
      icon: ClockIcon,
      title: "Time & Attendance Integration",
      description: "Integrate time tracking with payroll processing. Accurate attendance monitoring directly impacts payroll calculations.",
      details: [
        "Biometric time tracking integration",
        "Overtime and undertime calculations",
        "Leave management with payroll impact",
        "Shift differential and night premium calculations"
      ]
    },
    {
      icon: CalculatorIcon,
      title: "Flexible Compensation Management",
      description: "Handle complex compensation structures with ease. Support for various pay structures, allowances, and deductions.",
      details: [
        "Multiple pay frequencies (monthly, bi-monthly, weekly)",
        "Flexible allowance and deduction management",
        "Commission and incentive calculations",
        "Pro-rated salary computations"
      ]
    }
  ];

  const complianceHighlights = [
    {
      title: "BIR Compliance",
      items: ["Withholding Tax Tables", "Form 2316 Generation", "Alpha List Reporting"]
    },
    {
      title: "SSS Compliance", 
      items: ["Contribution Calculations", "R3 & R5 Reports", "Loan Tracking"]
    },
    {
      title: "PhilHealth Compliance",
      items: ["Premium Calculations", "RF-1 Generation", "Dependent Management"]
    },
    {
      title: "Pag-IBIG Compliance",
      items: ["Contribution Management", "MCRF Generation", "Loan Processing"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-indigo-dye mb-6">
            YAHSHUA Payroll Features: Complete Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover the comprehensive YAHSHUA payroll features that streamline your payroll operations. 
            From automated calculations to government compliance, our payroll system seamlessly integrates 
            with employee data management to provide a complete HRIS solution for Philippine businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {payrollFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-blue-700" />
              </div>
              
              <h3 className="text-xl font-semibold text-indigo-dye mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <ul className="space-y-3">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-blue-100 mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-indigo-dye text-center mb-8">
            Government Compliance Made Simple
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            YAHSHUA payroll features include comprehensive government compliance tools. 
            Stay compliant with all Philippine government requirements while managing employee data effortlessly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {complianceHighlights.map((compliance, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="w-8 h-8 text-blue-700" />
                </div>
                <h4 className="text-lg font-semibold text-indigo-dye mb-3">
                  {compliance.title}
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {compliance.items.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-center">
                      <CheckCircleIcon className="w-3 h-3 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-indigo-dye mb-6">
            Why Choose YAHSHUA Payroll Features?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FFC107] mb-2">100%</div>
              <div className="text-gray-600">Government Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FFC107] mb-2">Real-time</div>
              <div className="text-gray-600">Employee Data Sync</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FFC107] mb-2">24/7</div>
              <div className="text-gray-600">Support & Training</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PayrollFeaturesSection;