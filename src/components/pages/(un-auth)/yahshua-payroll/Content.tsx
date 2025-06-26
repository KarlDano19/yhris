"use client"
import Link from "next/link";
import Image from "next/image";
import { 
  ClockIcon, 
  ShieldCheckIcon, 
  CloudIcon, 
  UserGroupIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  CogIcon,
  DocumentTextIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import ypoLogo from "@/assets/landing-page-images/ypo-logo.png";

const YahshuaPayrollContent = () => {
  const payrollFeatures = [
    {
      icon: CloudIcon,
      title: "Cloud-Based Solution",
      description: "Hosted on Amazon Web Services (AWS) for maximum reliability and security. Access your payroll data anywhere, anytime.",
      highlights: ["AWS Hosting", "24/7 Availability", "Automatic Backups"]
    },
    {
      icon: UserGroupIcon,
      title: "Scalable for Any Business",
      description: "Supports businesses from 5 to 10,000 employees with unlimited users regardless of your pricing plan.",
      highlights: ["5-10,000 Employees", "Unlimited Users", "No User Limits"]
    },
    {
      icon: ShieldCheckIcon,
      title: "100% Labor Law Compliant",
      description: "Fully compliant with DOLE and Philippine labor laws. Stay updated with regulatory changes automatically.",
      highlights: ["DOLE Compliant", "Auto Updates", "Legal Protection"]
    },
    {
      icon: DevicePhoneMobileIcon,
      title: "Direct Bank & GCash Disbursement",
      description: "Disburse employee payroll directly to their bank accounts or via GCash for convenient and fast payments.",
      highlights: ["Bank Integration", "GCash Support", "Instant Payments"]
    },
    {
      icon: DocumentTextIcon,
      title: "Audit Trail & Logging",
      description: "Complete audit log and trailing to track all payroll activities for transparency and compliance.",
      highlights: ["Activity Tracking", "Full Transparency", "Compliance Ready"]
    },
    {
      icon: CogIcon,
      title: "Fully Customizable",
      description: "Customize the system to meet your specific business requirements with flexible configuration options.",
      highlights: ["Custom Workflows", "Flexible Setup", "Business Specific"]
    }
  ];

  const integrationApps = [
    {
      name: "ABBA Timekeeper App",
      description: "Facial recognition time tracking with offline capability and geo-location tracking",
      features: ["Facial Recognition", "Offline Capability", "Geo-location"]
    },
    {
      name: "ABBA Kiosk App",
      description: "Employee self-service portal for requests, profile management on Android, iOS, and Huawei",
      features: ["Self-Service Portal", "Multi-Platform", "Request Management"]
    },
    {
      name: "ABBA Approval App",
      description: "Manage and approve employee requests anytime, anywhere with mobile convenience",
      features: ["Mobile Approvals", "Request Management", "24/7 Access"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/landing-page" 
            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to YAHSHUA HRIS
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-300/30 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <Image 
                  src={ypoLogo} 
                  alt="YAHSHUA Payroll Online" 
                  width={120} 
                  height={120}
                  className="object-contain mx-auto"
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-blue-800 mb-6">
              YAHSHUA Payroll Online
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Next generation payroll business solution. Cloud-based, fully compliant, and designed for businesses of all sizes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="https://showcase.yahshuapayroll.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                View Live Demo
              </a>
              <Link 
                href="/register" 
                className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-blue-800 mb-6">
              Powerful Payroll Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for comprehensive payroll management, from processing to compliance and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {payrollFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100"
              >
                <div className="w-14 h-14 bg-blue-700/10 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-blue-700" />
                </div>
                
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-blue-700 rounded-full mr-3"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Apps Section */}
      <section className="py-20 bg-gradient-to-br from-blue-800/5 to-blue-600/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-blue-800 mb-6">
              Integrated Mobile Apps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete ecosystem of mobile applications that work seamlessly with YAHSHUA Payroll for maximum efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {integrationApps.map((app, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100"
              >
                <div className="flex items-center mb-4">
                  <DevicePhoneMobileIcon className="w-8 h-8 text-blue-700 mr-3" />
                  <h3 className="text-lg font-semibold text-blue-800">
                    {app.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {app.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {app.features.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HRIS Integration Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-[#FFC107] rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Perfect Integration with YAHSHUA HRIS
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Seamlessly connect your HR and Payroll processes. Employee data flows automatically from HRIS to Payroll, 
              eliminating duplicate entry and ensuring data consistency across your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/landing-page#integration" 
                className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Learn About Integration
              </Link>
              <Link 
                href="/register" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YahshuaPayrollContent;