"use client"
import Link from "next/link";
import { 
  UserPlusIcon, 
  DocumentCheckIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

const EmployeeOnboardingContent = () => {
  const features = [
    {
      icon: DocumentCheckIcon,
      title: "Digital Document Management",
      description: "Streamline document collection with digital forms, e-signatures, and automated reminders for missing paperwork."
    },
    {
      icon: ClockIcon,
      title: "Automated Workflows",
      description: "Set up custom onboarding workflows that automatically trigger tasks, notifications, and approvals at the right time."
    },
    {
      icon: CheckCircleIcon,
      title: "Compliance Tracking",
      description: "Ensure all regulatory requirements are met with built-in compliance checklists and audit trails."
    },
    {
      icon: ChartBarIcon,
      title: "Progress Monitoring",
      description: "Track onboarding progress in real-time with dashboards and reports for HR teams and managers."
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Pre-boarding Setup",
      description: "Send welcome emails, digital forms, and access credentials before the first day."
    },
    {
      step: "2",
      title: "First Day Experience",
      description: "Guide new hires through orientation, workspace setup, and initial introductions."
    },
    {
      step: "3",
      title: "Training & Integration",
      description: "Deliver role-specific training modules and facilitate team introductions."
    },
    {
      step: "4",
      title: "30-60-90 Day Check-ins",
      description: "Automated follow-ups to ensure successful integration and address any concerns."
    }
  ];

  const metrics = [
    { label: "Reduction in Onboarding Time", value: "50%" },
    { label: "Improved New Hire Satisfaction", value: "85%" },
    { label: "Faster Time to Productivity", value: "40%" },
    { label: "Compliance Rate", value: "99%" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-savoy-blue/10 p-4 rounded-2xl">
            <UserPlusIcon className="h-12 w-12 text-savoy-blue" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-indigo-dye mb-6">
          Employee Onboarding
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transform your new hire experience with our comprehensive onboarding platform. 
          Reduce administrative burden while creating memorable first impressions.
        </p>
      </div>

      {/* Metrics Section */}
      <div className="grid md:grid-cols-4 gap-6 mb-20">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-savoy-blue mb-2">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-indigo-dye text-center mb-12">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <div className="bg-savoy-blue/10 p-3 rounded-lg mr-4 flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-savoy-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-dye mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Process Flow Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-indigo-dye text-center mb-12">
          Onboarding Process
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                <div className="flex items-center mb-4">
                  <div className="bg-savoy-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto hidden lg:block" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-indigo-dye mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-savoy-blue to-indigo-600 rounded-2xl p-12 text-white mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Why Choose Our Onboarding Solution?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-[#FFC107] mr-3 flex-shrink-0 mt-0.5" />
                <span>Reduce administrative workload by 70%</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-[#FFC107] mr-3 flex-shrink-0 mt-0.5" />
                <span>Ensure 100% compliance with labor regulations</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-[#FFC107] mr-3 flex-shrink-0 mt-0.5" />
                <span>Create consistent onboarding experiences</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-[#FFC107] mr-3 flex-shrink-0 mt-0.5" />
                <span>Improve new hire retention by 25%</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
            <p className="mb-6 opacity-90">
              Join thousands of companies that have transformed their onboarding process.
            </p>
            <div className="space-y-3">
              <Link
                href="/register"
                className="block w-full bg-[#FFC107] hover:bg-amber-600 text-black px-6 py-3 rounded-lg text-center font-medium transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href="/use-cases"
                className="block w-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg text-center font-medium transition-colors border border-white/30"
              >
                View All Use Cases
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOnboardingContent;