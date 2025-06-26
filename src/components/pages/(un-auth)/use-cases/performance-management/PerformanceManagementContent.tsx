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
      icon: UserGroupIcon,
      title: "360-Degree Feedback",
      description: "Collect comprehensive feedback from peers, supervisors, and direct reports for holistic performance evaluation."
    },
    {
      icon: ClipboardDocumentCheckIcon,
      title: "Goal Setting & Tracking",
      description: "Set SMART goals, track progress in real-time, and align individual objectives with company goals."
    },
    {
      icon: CalendarDaysIcon,
      title: "Continuous Performance Reviews",
      description: "Move beyond annual reviews with ongoing check-ins, feedback sessions, and performance conversations."
    },
    {
      icon: AcademicCapIcon,
      title: "Development Planning",
      description: "Create personalized development plans with skill assessments, training recommendations, and career pathing."
    }
  ];

  const reviewCycle = [
    {
      phase: "Goal Setting",
      description: "Establish clear, measurable objectives aligned with organizational priorities.",
      duration: "Quarterly"
    },
    {
      phase: "Continuous Feedback",
      description: "Regular check-ins, peer feedback, and real-time performance tracking.",
      duration: "Ongoing"
    },
    {
      phase: "Formal Review",
      description: "Comprehensive evaluation with 360-degree feedback and performance ratings.",
      duration: "Semi-Annual"
    },
    {
      phase: "Development Planning",
      description: "Create growth plans, identify training needs, and set career goals.",
      duration: "Annual"
    }
  ];

  const metrics = [
    { label: "Employee Engagement Increase", value: "35%" },
    { label: "Goal Achievement Rate", value: "78%" },
    { label: "Time Saved on Reviews", value: "60%" },
    { label: "Retention Improvement", value: "25%" }
  ];

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

      {/* Performance Analytics Section */}
      <div className="bg-white rounded-2xl shadow-lg p-12 mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-indigo-dye mb-6">
              Data-Driven Insights
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <TrophyIcon className="h-6 w-6 text-[#FFC107] mr-3" />
                <span className="text-gray-600">Performance analytics dashboard</span>
              </div>
              <div className="flex items-center">
                <StarIcon className="h-6 w-6 text-[#FFC107] mr-3" />
                <span className="text-gray-600">Employee recognition system</span>
              </div>
              <div className="flex items-center">
                <ChartBarIcon className="h-6 w-6 text-[#FFC107] mr-3" />
                <span className="text-gray-600">Competency mapping and tracking</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-[#FFC107] mr-3" />
                <span className="text-gray-600">Automated performance reporting</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-savoy-blue/10 to-indigo-100 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-indigo-dye mb-4">
              Performance Insights at a Glance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Top Performers</span>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  15% of team
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Goals on Track</span>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  78% completion
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Development Plans</span>
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  92% active
                </div>
              </div>
            </div>
          </div>
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
              Start Free Trial
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