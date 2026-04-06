"use client"
import Link from "next/link";
import { 
  CheckCircleIcon, 
  XMarkIcon, 
  RocketLaunchIcon,
  UsersIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ClockIcon,
  StarIcon,
  BoltIcon,
  TrophyIcon
} from "@heroicons/react/24/outline";

const CompetitorsContent = () => {
  const valuePropositions = [
    {
      title: "Multi-Channel Job Posting",
      problem: "Time consuming job posting with limited reach",
      solution: "Launch hiring campaigns across LinkedIn, Facebook, and YAHSHUA Jobs with 1-3 steps. Experience centralized application management without platform switching.",
      icon: RocketLaunchIcon,
      metrics: "80% faster job posting, 3x wider reach"
    },
    {
      title: "Ready Talent Pool Access",
      problem: "No readily available talents to replace lost talent",
      solution: "Screen Applicants module maintains detailed applicant history and qualified candidate pools. Fill vacancies immediately with one-click access to pre-screened talent.",
      icon: UsersIcon,
      metrics: "50% faster hiring, 90% vacancy fill rate"
    },
    {
      title: "Complete Hiring-to-Offboarding Automation",
      problem: "Time consuming processing from hiring to offboarding",
      solution: "Comprehensive suite: Screen, Orient, Manage, Train, Evaluate, and Separate. Fully automated workflow from recruitment to departure.",
      icon: BoltIcon,
      metrics: "70% time savings, 95% process efficiency"
    },
    {
      title: "DOLE Compliance Made Simple",
      problem: "Penalty for Non-compliance with DOLE requirements",
      solution: "Guided DOLE Module tour covering company registration to annual reports. Automated compliance for your specific business type.",
      icon: ShieldCheckIcon,
      metrics: "100% compliance rate, zero penalties"
    },
    {
      title: "Secure Employee Records Management",
      problem: "Loss of important employee records",
      solution: "Organized Employee Management module with secure storage, Data Privacy compliance, and instant accessibility of all employment documents.",
      icon: DocumentTextIcon,
      metrics: "Zero record loss, 90% faster retrieval"
    },
    {
      title: "Professional HR Expertise Built-In",
      problem: "Incapable of doing professional HR work",
      solution: "DOLE-compliant recruitment to offboarding experience ensuring labor standards compliance throughout the entire employee lifecycle.",
      icon: TrophyIcon,
      metrics: "Professional-grade HR operations"
    },
    {
      title: "Effective Performance Evaluation System",
      problem: "Unable to conduct effective employee performance evaluation",
      solution: "Evaluation module with standard templates, custom forms, and scheduling tools for accurate, consistent assessments and employee movement decisions.",
      icon: StarIcon,
      metrics: "100% evaluation accuracy, custom flexibility"
    },
    {
      title: "Enhanced Business Professional Image",
      problem: "Lack of professional HR presence",
      solution: "YAHSHUA Jobs elevates your business image with automated, secure, and professional HR platform that applicants recognize and trust.",
      icon: ClockIcon,
      metrics: "Enhanced industry status, improved perception"
    }
  ];

  const comparisonFeatures = [
    {
      category: "Job Posting & Recruitment",
      features: [
        {
          feature: "Multi-platform job posting",
          yahshua: true,
          competitors: false,
          yahshuaDetail: "LinkedIn, Facebook, YAHSHUA Jobs in 1-3 steps"
        },
        {
          feature: "Centralized application management",
          yahshua: true,
          competitors: false,
          yahshuaDetail: "No platform switching required"
        },
        {
          feature: "Ready talent pool access",
          yahshua: true,
          competitors: false,
          yahshuaDetail: "One-click access to pre-screened candidates"
        }
      ]
    },
    {
      category: "Compliance & Documentation",
      features: [
        {
          feature: "DOLE compliance automation",
          yahshua: true,
          competitors: false,
          yahshuaDetail: "Guided tours and automatic report generation"
        },
        {
          feature: "Philippine labor law compliance",
          yahshua: true,
          competitors: true,
          yahshuaDetail: "Built-in DOLE module with guided compliance"
        },
        {
          feature: "Secure document management",
          yahshua: true,
          competitors: true,
          yahshuaDetail: "Data Privacy Act compliant storage"
        }
      ]
    },
    {
      category: "Employee Lifecycle Management",
      features: [
        {
          feature: "Complete hiring-to-offboarding automation",
          yahshua: true,
          competitors: false,
          yahshuaDetail: "Screen, Orient, Manage, Train, Evaluate, Separate"
        },
        {
          feature: "Custom performance evaluation forms",
          yahshua: true,
          competitors: true,
          yahshuaDetail: "Tailored to specific employees, positions, departments"
        },
        {
          feature: "Employee self-service portal",
          yahshua: true,
          competitors: true,
          yahshuaDetail: "Comprehensive self-service capabilities"
        }
      ]
    },
    {
      category: "Business Enhancement",
      features: [
        {
          feature: "Professional image enhancement",
          yahshua: true,
          competitors: false,
          yahshuaDetail: "Elevates business perception in industry"
        },
        {
          feature: "Industry-specific solutions",
          yahshua: true,
          competitors: false,
          yahshuaDetail: "Tailored for Philippine business requirements"
        },
        {
          feature: "SME-focused design",
          yahshua: true,
          competitors: true,
          yahshuaDetail: "Built specifically for small-medium enterprises"
        }
      ]
    }
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-indigo-dye mb-6">
          YAHSHUA HRIS vs Competitors
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
          Discover why YAHSHUA HRIS is the superior choice for Philippine businesses. 
          Compare our comprehensive HR solutions designed specifically for local compliance and business growth.
        </p>
        <div className="bg-gradient-to-r from-savoy-blue to-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Why Choose YAHSHUA HRIS?</h2>
          <p className="text-lg opacity-90">
            Built for Philippine businesses with DOLE compliance, multi-channel recruiting, 
            and complete automation from hiring to offboarding.
          </p>
        </div>
      </div>

      {/* Value Propositions Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-indigo-dye text-center mb-12">
          Our Value Propositions
        </h2>
        <div className="grid lg:grid-cols-2 gap-8">
          {valuePropositions.map((prop, index) => {
            const IconComponent = prop.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start mb-6">
                  <div className="bg-savoy-blue/10 p-3 rounded-lg mr-4 flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-savoy-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-dye mb-2">
                      {prop.title}
                    </h3>
                    <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
                      <p className="text-sm text-red-700">
                        <strong>Problem:</strong> {prop.problem}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                  <p className="text-sm text-green-700">
                    <strong>YAHSHUA Solution:</strong> {prop.solution}
                  </p>
                </div>
                
                <div className="bg-savoy-blue/10 rounded-lg p-3">
                  <p className="text-sm font-medium text-savoy-blue">
                    📊 {prop.metrics}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-indigo-dye text-center mb-12">
          Feature-by-Feature Comparison
        </h2>
        <div className="space-y-8">
          {comparisonFeatures.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-savoy-blue to-indigo-600 text-white p-6">
                <h3 className="text-xl font-bold">{category.category}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Feature</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">YAHSHUA HRIS</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Competitors</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">YAHSHUA Advantage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {category.features.map((item, featureIndex) => (
                      <tr key={featureIndex} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {item.feature}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.yahshua ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-500 mx-auto" />
                          ) : (
                            <XMarkIcon className="h-6 w-6 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.competitors ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-500 mx-auto" />
                          ) : (
                            <XMarkIcon className="h-6 w-6 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.yahshuaDetail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industries and Target Market */}
      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-indigo-dye mb-6">
            Who We Serve Best
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-savoy-blue pl-4">
              <h4 className="font-semibold text-indigo-dye">Small to Medium Enterprises (SMEs)</h4>
              <p className="text-gray-600 text-sm">Cost-effective solutions with enterprise-grade features</p>
            </div>
            <div className="border-l-4 border-savoy-blue pl-4">
              <h4 className="font-semibold text-indigo-dye">Philippine-Based Companies</h4>
              <p className="text-gray-600 text-sm">Built-in DOLE compliance and local labor law expertise</p>
            </div>
            <div className="border-l-4 border-savoy-blue pl-4">
              <h4 className="font-semibold text-indigo-dye">Growing Businesses</h4>
              <p className="text-gray-600 text-sm">Scalable solutions that grow with your business</p>
            </div>
            <div className="border-l-4 border-savoy-blue pl-4">
              <h4 className="font-semibold text-indigo-dye">BPO & Call Centers</h4>
              <p className="text-gray-600 text-sm">High-volume recruitment and employee management</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-savoy-blue/10 to-indigo-100 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-indigo-dye mb-6">
            Key Differentiators
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-indigo-dye">DOLE Compliance Automation</h4>
                <p className="text-gray-600 text-sm">Guided compliance with automatic report generation</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-indigo-dye">Multi-Channel Recruitment</h4>
                <p className="text-gray-600 text-sm">Post to LinkedIn, Facebook, and YAHSHUA Jobs simultaneously</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-indigo-dye">Complete Lifecycle Automation</h4>
                <p className="text-gray-600 text-sm">From screening to offboarding in one platform</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-indigo-dye">Ready Talent Pool</h4>
                <p className="text-gray-600 text-sm">One-click access to pre-screened candidates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-savoy-blue to-indigo-600 rounded-2xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Experience the YAHSHUA Difference?
        </h2>
        <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
          Join hundreds of Philippine businesses that have chosen YAHSHUA HRIS for superior 
          HR management, DOLE compliance, and business growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-[#FFC107] hover:bg-amber-600 text-black px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Start 30 Day Free Trial
          </Link>
          <Link
            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3Lq9wzoc89Sa_fVYXCXWkbS1MyNFXJTNKQtD_EfjnQ0Pyc5K5v7LpJ0u9fmTsXdOJ7yBUp1_JH"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-medium transition-colors border border-white/30"
          >
            Schedule Demo
          </Link>
          <Link
            href="/use-cases"
            className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-medium transition-colors border border-white/30"
          >
            View Use Cases
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompetitorsContent;