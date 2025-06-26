"use client"
import Link from "next/link";
import { 
  ChartBarIcon, 
  StarIcon, 
  TrophyIcon, 
  CheckCircleIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";

const PerformanceManagementContent = () => {
  const features = [
    {
      icon: CalendarDaysIcon,
      title: "Scheduled Check-Ins",
      description: "Empower managers to set and track regular performance conversations ahead of time—ensuring consistency and meaningful engagement."
    },
    {
      icon: UserGroupIcon,
      title: "Employee Self-Evaluations",
      description: "Give employees a space to reflect on their own progress, encouraging ownership and alignment with team goals."
    },
    {
      icon: ClipboardDocumentCheckIcon,
      title: "Centralized Evaluation Records",
      description: "Keep all evaluations organized and accessible in one place—eliminating the risks of paper trails and scattered files."
    },
    {
      icon: AcademicCapIcon,
      title: "Development-Focused Reviews",
      description: "Turn performance reviews into opportunities for growth by focusing on clear feedback and future-focused conversations."
    }
  ];

  const reviewCycle = [
    {
      phase: "Setup Evaluation Template",
      description: "Customize evaluation forms to align with your company's roles, values, and performance criteria.",
      duration: "Initial Setup"
    },
    {
      phase: "Schedule Evaluations",
      description: "Automate evaluation schedules to ensure consistent and timely performance reviews.",
      duration: "Recurring"
    },
    {
      phase: "Conduct Evaluations",
      description: "Easily complete employee evaluations with structured forms and built-in rating systems.",
      duration: "As Scheduled"
    },
    {
      phase: "View Evaluation History",
      description: "Track employee performance trends through a centralized evaluation record system.",
      duration: "Ongoing"
    }
  ];

  const businessStory = {
    title: "Transforming Performance Reviews from Burden to Breakthrough",
    subtitle: "How Companies Transform Employee Development",
    challenge: "Companies relying on paper evaluations face outdated, hard-to-manage processes—often leading to delays, lost records, and low engagement. With limited budgets, they're stuck using inefficient methods or skipping performance reviews altogether.",
    solution: "YAHSHUA HRIS simplifies everything: a single intuitive platform to create, customize, manage, and store evaluations—no paperwork, no hassle.",
    results: [
      "Managers now hold timely, meaningful check‑ins scheduled in advance",
      "Employees actively self-evaluate and stay engaged",
      "HR gains full visibility over current and past evaluations",
      "Performance discussions shift from chores to growth opportunities"
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-savoy-blue/10 p-4 rounded-2xl">
            <ChartBarIcon className="h-12 w-12 text-savoy-blue" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-indigo-dye mb-6">
          Performance Management
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Elevate your team's performance with comprehensive evaluation tools, 
          continuous feedback systems, and data-driven insights for growth.
        </p>
      </div>

      {/* Business Story Section */}
      <div className="bg-gradient-to-br from-savoy-blue/5 to-indigo-50 rounded-2xl p-8 md:p-12 mb-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-dye mb-4">
            {businessStory.title}
          </h2>
          <p className="text-lg text-savoy-blue font-medium mb-2">
            {businessStory.subtitle}
          </p>
          <p className="text-xs text-gray-500 italic">
            *This is a fictional story for illustration purposes. Any resemblance to actual companies or persons is purely coincidental.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-lg font-semibold text-indigo-dye mb-3">The Challenge</h3>
            <p className="text-gray-600 mb-6">{businessStory.challenge}</p>
            
            <h3 className="text-lg font-semibold text-indigo-dye mb-3">The Solution</h3>
            <p className="text-gray-600">{businessStory.solution}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-indigo-dye mb-4">The Results</h3>
            <ul className="space-y-3">
              {businessStory.results.map((result, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{result}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-indigo-dye text-center mb-12">
          Comprehensive Performance Tools
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

      {/* Review Cycle Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-indigo-dye text-center mb-12">
          Performance Review Cycle
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewCycle.map((phase, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center relative">
              <div className="bg-savoy-blue text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-indigo-dye mb-3">
                {phase.phase}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {phase.description}
              </p>
              <div className="inline-block bg-savoy-blue/10 text-savoy-blue px-3 py-1 rounded-full text-xs font-medium">
                {phase.duration}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* CTA Section */}
      <div className="bg-gradient-to-r from-savoy-blue to-indigo-600 rounded-2xl p-12 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Transform Your Performance Management
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Unlock your team's potential with our comprehensive performance management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-[#FFC107] hover:bg-amber-600 text-black px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start 30 Day Free Trial
            </Link>
            <Link
              href="/use-cases"
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-medium transition-colors border border-white/30"
            >
              View All Use Cases
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceManagementContent;