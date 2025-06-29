"use client"
import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, UserPlusIcon, ChartBarIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const useCases = [
  {
    id: "employee-onboarding",
    title: "Employee Onboarding",
    description: "Streamline your new hire process with automated workflows and digital documentation",
    icon: UserPlusIcon,
    benefits: [
      "Faster applicant filtering and assessment",
      "Streamlined interview scheduling",
      "Centralized requirements setup",
      "Digital contract sending and signing",
      "Team introductions via email",
      "System enrollment with onboarding email"
    ],
    href: "/use-cases/employee-onboarding"
  },
  {
    id: "performance-management",
    title: "Performance Management",
    description: "Enhance employee performance with comprehensive evaluation and feedback systems",
    icon: ChartBarIcon,
    benefits: [
      "Customizable evaluation templates",
      "Centralized performance history",
      "Scheduled reviews with deadline tracking",
      "Evaluation assignment and monitoring",
      "Performance tracking (coming soon)",
      "Completion monitoring (coming soon)"
    ],
    href: "/use-cases/performance-management"
  }
];

const UseCasesContent = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<string>("");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-indigo-dye mb-6">
          HRIS Use Cases
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover how our HRIS platform can transform your human resource management 
          across different business scenarios and requirements.
        </p>
      </div>

      {/* Dropdown Section */}
      <div className="mb-16">
        <div className="max-w-md mx-auto">
          <label htmlFor="use-case-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select a Use Case to Explore
          </label>
          <div className="relative">
            <select
              id="use-case-select"
              value={selectedUseCase}
              onChange={(e) => setSelectedUseCase(e.target.value)}
              className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:border-transparent appearance-none bg-white"
            >
              <option value="">Choose a use case...</option>
              {useCases.map((useCase) => (
                <option key={useCase.id} value={useCase.id}>
                  {useCase.title}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {selectedUseCase && (
            <div className="mt-4">
              <Link
                href={useCases.find(uc => uc.id === selectedUseCase)?.href || "#"}
                className="block w-full bg-savoy-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center font-medium transition-colors"
              >
                Explore {useCases.find(uc => uc.id === selectedUseCase)?.title}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {useCases.map((useCase) => {
          const IconComponent = useCase.icon;
          return (
            <div
              key={useCase.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="bg-savoy-blue/10 p-3 rounded-lg">
                  <IconComponent className="h-8 w-8 text-savoy-blue" />
                </div>
                <h3 className="text-xl font-bold text-indigo-dye ml-4">
                  {useCase.title}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {useCase.description}
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-indigo-dye mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link
                href={useCase.href}
                className="block w-full bg-savoy-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center font-medium transition-colors"
              >
                Learn More
              </Link>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center bg-gradient-to-r from-savoy-blue to-indigo-600 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your HR Processes?
        </h2>
        <p className="text-xl opacity-90 mb-8">
          Start your journey with our comprehensive HRIS platform today.
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
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UseCasesContent;