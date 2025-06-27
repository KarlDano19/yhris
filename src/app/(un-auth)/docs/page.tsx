"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/pages/(un-auth)/landing-page/Navigation";
import { ChevronRightIcon, DocumentTextIcon, BookOpenIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "getting-started",
        "sign-up-options", 
        "yahshua-payroll-integration",
        "current-limitations",
        "group-companies",
        "subscription-renewal",
        "data-sync"
      ];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tableOfContents = [
    { id: "getting-started", title: "Getting Started", level: 1 },
    { id: "sign-up-options", title: "Sign Up Options", level: 1 },
    { id: "yahshua-payroll-integration", title: "YAHSHUA Payroll Integration", level: 1 },
    { id: "current-limitations", title: "Current Limitations", level: 1 },
    { id: "group-companies", title: "Group Companies", level: 1 },
    { id: "subscription-renewal", title: "Subscription Renewal", level: 1 },
    { id: "data-sync", title: "Data Synchronization", level: 1 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <Navigation />
      
      {/* Navigation Breadcrumb */}
      <div className="bg-white/70 backdrop-blur-md border-b border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/landing-page" className="text-indigo-600 hover:text-indigo-800">
              Home
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Documentation</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-indigo-dye mb-4">Table of Contents</h3>
              <ul className="space-y-2">
                {tableOfContents.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left w-full text-sm transition-colors ${
                        activeSection === item.id
                          ? "text-[#FFC107] font-medium"
                          : "text-gray-600 hover:text-indigo-600"
                      } ${item.level === 2 ? "pl-4" : ""}`}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8 lg:p-12">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-indigo-dye mb-4">
                  YAHSHUA HRIS Documentation
                </h1>
                <p className="text-xl text-gray-600">
                  Complete guide to getting started with YAHSHUA HRIS - from signup to full implementation
                </p>
              </div>

              {/* Quick Access Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <DocumentTextIcon className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Quick Start</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Get up and running with YAHSHUA HRIS in minutes
                  </p>
                  <button 
                    onClick={() => scrollToSection("getting-started")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Get Started →
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <BookOpenIcon className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Integration</h3>
                  <p className="text-green-700 text-sm mb-4">
                    Connect with your existing YAHSHUA Payroll account
                  </p>
                  <button 
                    onClick={() => scrollToSection("yahshua-payroll-integration")}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Learn More →
                  </button>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
                  <QuestionMarkCircleIcon className="h-8 w-8 text-amber-600 mb-3" />
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">Limitations</h3>
                  <p className="text-amber-700 text-sm mb-4">
                    Current limitations and what's coming soon
                  </p>
                  <button 
                    onClick={() => scrollToSection("current-limitations")}
                    className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                  >
                    View Limitations →
                  </button>
                </div>
              </div>

              {/* Content Sections */}
              <div className="prose prose-lg max-w-none">
                {/* Getting Started */}
                <section id="getting-started" className="mb-12">
                  <h2 className="text-3xl font-bold text-indigo-dye mb-6">Getting Started</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">How to Login</h3>
                  <p className="text-gray-600 mb-4">
                    To access YAHSHUA HRIS, visit our login page and enter your credentials:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
                    <li>Go to the <Link href="/login" className="text-indigo-600 hover:underline">YAHSHUA HRIS login page</Link></li>
                    <li>Enter your email address</li>
                    <li>Enter your password</li>
                    <li>Click "Sign In" to access your dashboard</li>
                  </ol>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">First Time Setup</h3>
                  <p className="text-gray-600 mb-4">
                    After logging in for the first time, you'll need to complete your profile setup:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                    <li>Complete your company profile information</li>
                    <li>Set up your HR preferences and settings</li>
                    <li>Configure your employee data structure</li>
                    <li>Import existing employee data (optional)</li>
                  </ul>
                </section>

                {/* Sign Up Options */}
                <section id="sign-up-options" className="mb-12">
                  <h2 className="text-3xl font-bold text-indigo-dye mb-6">Sign Up Options</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">New User Registration</h3>
                  <p className="text-gray-600 mb-4">
                    If you're new to YAHSHUA HRIS, you can create a new account:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
                    <li>Visit our <Link href="/register" className="text-indigo-600 hover:underline">registration page</Link></li>
                    <li>Fill in your business information</li>
                    <li>Choose your subscription plan</li>
                    <li>Verify your email address</li>
                    <li>Complete your profile setup</li>
                  </ol>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Types</h3>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-indigo-800 mb-2">Employer Account</h4>
                    <p className="text-gray-600 text-sm">
                      Full access to all HR management features including employee management, 
                      payroll integration, compliance reporting, and administrative tools.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-green-800 mb-2">Applicant Account</h4>
                    <p className="text-gray-600 text-sm">
                      Job seekers can create profiles, apply for positions, and track application status.
                    </p>
                  </div>
                </section>

                {/* YAHSHUA Payroll Integration */}
                <section id="yahshua-payroll-integration" className="mb-12">
                  <h2 className="text-3xl font-bold text-indigo-dye mb-6">YAHSHUA Payroll Integration</h2>
                  
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                    <h4 className="font-semibold text-orange-800 mb-2">⚠️ Important Access Requirement</h4>
                    <p className="text-orange-700 text-sm">
                      Only the Owner account from YAHSHUA Payroll can log into YAHSHUA HRIS and sync employee records. 
                      Sub-users and superadmin accounts cannot directly access YAHSHUA HRIS yet.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Using Your YAHSHUA Payroll Account</h3>
                  <p className="text-gray-600 mb-4">
                    If you're already using YAHSHUA Payroll, you can integrate with YAHSHUA HRIS using your Owner account:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
                    <li>Use the same email address from your YAHSHUA Payroll <strong>Owner account</strong></li>
                    <li>During registration, select "I have a YAHSHUA Payroll account"</li>
                    <li>Enter your YAHSHUA Payroll Owner credentials for verification</li>
                    <li>Your employee data will be automatically synchronized</li>
                    <li>Configure additional HRIS-specific settings</li>
                  </ol>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Access Requirements</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Can Access YAHSHUA HRIS</h4>
                      <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                        <li>Owner account from YAHSHUA Payroll</li>
                        <li>Can sync employee records between systems</li>
                        <li>Can create user accounts for team members in YAHSHUA HRIS</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">🚫 Cannot Access YAHSHUA HRIS (Yet)</h4>
                      <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                        <li>Sub-users from YAHSHUA Payroll</li>
                        <li>Superadmin accounts from YAHSHUA Payroll</li>
                        <li>Any non-owner accounts from YAHSHUA Payroll</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Setting Up Team Access</h3>
                  <p className="text-gray-600 mb-4">
                    If your team members need access to YAHSHUA HRIS, here's the current process:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
                    <li>Owner logs into YAHSHUA HRIS with their YAHSHUA Payroll credentials</li>
                    <li>Owner syncs employee records from YAHSHUA Payroll</li>
                    <li>Owner creates separate user accounts in YAHSHUA HRIS for team members</li>
                    <li>Team members receive separate login credentials for YAHSHUA HRIS</li>
                    <li>Team members log in using their new YAHSHUA HRIS credentials (not their YAHSHUA Payroll credentials)</li>
                  </ol>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <h4 className="font-semibold text-blue-800 mb-2">🔄 Coming Soon</h4>
                    <p className="text-blue-700 text-sm">
                      We're working on allowing sub-users from YAHSHUA Payroll to directly log into YAHSHUA HRIS 
                      using their existing credentials. This will eliminate the need for separate accounts.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tip</h4>
                    <p className="text-yellow-700 text-sm">
                      Using your existing YAHSHUA Payroll Owner account saves time and ensures data consistency 
                      between your payroll and HR systems. Make sure you're logging in with the Owner account, 
                      not a sub-user or superadmin account.
                    </p>
                  </div>
                </section>

                {/* Current Limitations */}
                <section id="current-limitations" className="mb-12">
                  <h2 className="text-3xl font-bold text-indigo-dye mb-6">Current Limitations</h2>
                  
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                    <h4 className="font-semibold text-orange-800 mb-2">⚠️ Important</h4>
                    <p className="text-orange-700 text-sm">
                      Please review these current limitations to understand the current scope of YAHSHUA HRIS integration and features.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Multiple Companies */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Multiple Companies & Account Switching</h3>
                      <div className="bg-red-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-red-800 mb-2">🚫 Not Available Yet</h4>
                        <p className="text-red-700 text-sm mb-2">
                          If you have multiple companies in YAHSHUA Payroll, switching between them in YAHSHUA HRIS is not yet supported.
                        </p>
                        <p className="text-red-700 text-sm">
                          This feature is currently in development and coming soon.
                        </p>
                      </div>
                    </div>

                    {/* User Access */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">User Access from YAHSHUA Payroll</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">👤 Owner Account Only</h4>
                        <p className="text-yellow-700 text-sm mb-2">
                          Currently, only the Owner account (not superadmin) from YAHSHUA Payroll can log into YAHSHUA HRIS and sync employee records.
                        </p>
                        <p className="text-yellow-700 text-sm">
                          Sub-users from YAHSHUA Payroll cannot directly log into YAHSHUA HRIS yet.
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">💡 Current Workaround</h4>
                        <ol className="list-decimal list-inside space-y-1 text-blue-700 text-sm">
                          <li>Owner logs into YAHSHUA HRIS and syncs employee records</li>
                          <li>Owner creates separate user accounts in YAHSHUA HRIS for sub-users</li>
                          <li>Sub-users get separate login credentials for YAHSHUA HRIS</li>
                        </ol>
                        <p className="text-blue-700 text-sm mt-2">
                          Direct sub-user integration is coming soon.
                        </p>
                      </div>
                    </div>

                    {/* Social Media Integration */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Social Media Integration</h3>
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-green-800 mb-2">✅ Currently Available</h4>
                        <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                          <li>Facebook integration</li>
                          <li>LinkedIn integration</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">🔄 Coming Soon</h4>
                        <p className="text-blue-700 text-sm">
                          Additional social media platforms are being evaluated for future integration.
                        </p>
                      </div>
                    </div>

                    {/* Interview Booking */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Interview Booking Platforms</h3>
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-green-800 mb-2">✅ Currently Available</h4>
                        <p className="text-green-700 text-sm mb-2">
                          Interview booking is currently available through:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                          <li>Email → Google Calendar invitation</li>
                          <li>Google Meet for video interviews</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">🔄 Coming Soon</h4>
                        <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                          <li>Zoom integration</li>
                          <li>Microsoft Teams integration</li>
                        </ul>
                      </div>
                    </div>

                    {/* Employee Kiosk Features */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Employee Kiosk Features</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">🔄 In Development</h4>
                        <p className="text-yellow-700 text-sm mb-2">
                          The following employee kiosk features are currently under development for existing YAHSHUA Payroll users:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                          <li>Sending Notice to Explain (NTE) to employee kiosk</li>
                          <li>Receiving employee responses via kiosk</li>
                          <li>Employee evaluation submissions through kiosk</li>
                        </ul>
                      </div>
                    </div>

                    {/* Performance Evaluation */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Evaluation</h3>
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-green-800 mb-2">✅ Currently Available</h4>
                        <p className="text-green-700 text-sm">
                          Direct evaluation system where managers can evaluate employees directly.
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">🔄 Coming Soon</h4>
                        <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                          <li>Peer evaluation capabilities</li>
                          <li>Employee self-evaluation combined with manager evaluation</li>
                          <li>Multi-level evaluation scoring system</li>
                          <li>Employee kiosk evaluation submissions (for YAHSHUA Payroll users)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mt-8">
                    <h4 className="font-semibold text-indigo-800 mb-2">🚀 Development Roadmap</h4>
                    <p className="text-indigo-700 text-sm">
                      Our development team is actively working on these features. Check back regularly for updates, 
                      or contact our support team for specific timelines on features important to your business.
                    </p>
                  </div>
                </section>

                {/* Group Companies */}
                <section id="group-companies" className="mb-12">
                  <h2 className="text-3xl font-bold text-indigo-dye mb-6">Group Companies</h2>
                  
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                    <h4 className="font-semibold text-orange-800 mb-2">⚠️ Current Limitation</h4>
                    <p className="text-orange-700 text-sm">
                      Group company management from YAHSHUA Payroll is not yet supported in YAHSHUA HRIS. 
                      This feature is planned for a future release.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">What This Means</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                    <li>Each company entity requires a separate YAHSHUA HRIS subscription</li>
                    <li>Employee data cannot be consolidated across multiple companies yet</li>
                    <li>Reporting must be done individually for each company</li>
                    <li>User access is limited to single company scope</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Workaround Solutions</h3>
                  <p className="text-gray-600 mb-4">
                    While we work on group company support, consider these approaches:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                    <li>Set up separate YAHSHUA HRIS accounts for each company</li>
                    <li>Use consistent naming conventions across companies</li>
                    <li>Export and consolidate reports manually when needed</li>
                    <li>Contact our support team for enterprise solutions</li>
                  </ul>
                </section>

                {/* Subscription Renewal */}
                <section id="subscription-renewal" className="mb-12">
                  <h2 className="text-3xl font-bold text-indigo-dye mb-6">Subscription Renewal</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">After Your Trial Expires</h3>
                  <p className="text-gray-600 mb-4">
                    When your 30-day trial ends, you'll need to select a paid plan to continue using YAHSHUA HRIS:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
                    <li>Visit your account settings before trial expiration</li>
                    <li>Choose a subscription plan that fits your needs</li>
                    <li>Add payment method</li>
                    <li>Confirm your subscription to avoid service interruption</li>
                  </ol>

                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Important</h4>
                    <p className="text-red-700 text-sm">
                      Failure to pay after the trial or subscription ends will bring you to View Only mode.
                    </p>
                  </div>
                </section>

                {/* Data Sync */}
                <section id="data-sync" className="mb-12">
                  <h2 className="text-3xl font-bold text-indigo-dye mb-6">Data Synchronization</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">What Data is Synced</h3>
                  <p className="text-gray-600 mb-4">
                    Currently, the following employee data is synchronized between YAHSHUA Payroll and YAHSHUA HRIS:
                  </p>
                  
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Currently Synced</h4>
                    <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                      <li>Employee personal information (name, contact details, etc.)</li>
                      <li>Job titles and department assignments</li>
                      <li>Employment start dates</li>
                      <li>Basic compensation information</li>
                      <li>Employment status (active, inactive)</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-blue-800 mb-2">🔄 Coming Soon</h4>
                    <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                      <li>Detailed payroll history and earnings statements</li>
                      <li>Time and attendance data</li>
                      <li>Tax information and deductions</li>
                      <li>Benefits enrollment and eligibility</li>
                      <li>Performance review scores and ratings</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Sync Frequency</h3>
                  <p className="text-gray-600 mb-4">
                    Data synchronization occurs:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                    <li>Automatically every 24 hours for basic employee information</li>
                    <li>Real-time for new employee additions</li>
                    <li>On-demand when you manually trigger a sync</li>
                    <li>During payroll processing cycles</li>
                  </ul>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <h4 className="font-semibold text-blue-800 mb-2">🚀 Future Enhancements</h4>
                    <p className="text-blue-700 text-sm">
                      We're continuously expanding data synchronization capabilities. More comprehensive 
                      integration between YAHSHUA Payroll and YAHSHUA HRIS is coming in future updates.
                    </p>
                  </div>
                </section>

                {/* Get Help Section */}
                {/* <section className="bg-indigo-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-4">Need Additional Help?</h3>
                  <p className="text-indigo-700 mb-4">
                    If you have questions not covered in this guide, our support team is here to help:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="mailto:marketing@abba.works" 
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-center"
                    >
                      Contact Support
                    </a>
                    <Link 
                      href="/landing-page#contact" 
                      className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors text-center"
                    >
                      View Contact Info
                    </Link>
                  </div>
                </section> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;