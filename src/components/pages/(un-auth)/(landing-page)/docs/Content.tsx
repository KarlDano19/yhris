"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import Navigation from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/Navigation";
import LpFooter from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/LpFooter";
import ScrollToTop from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollToTop";

const tableOfContents = [
  { id: "getting-started", title: "Getting Started" },
  { id: "sign-up-options", title: "Sign Up Options" },
  { id: "yahshua-payroll-integration", title: "YAHSHUA Payroll Integration" },
  { id: "current-limitations", title: "Current Limitations" },
  { id: "group-companies", title: "Group Companies" },
  { id: "subscription-renewal", title: "Subscription Renewal" },
  { id: "data-sync", title: "Data Synchronization" },
];

const noteBox = (type: "info" | "warning" | "success" | "tip", title: string, content: React.ReactNode) => {
  const styles = {
    info:    { bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.25)",  text: "#1d4ed8" },
    warning: { bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.25)",  text: "#b45309" },
    success: { bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.2)",   text: "#15803d" },
    tip:     { bg: "rgba(255,193,7,0.08)",   border: "rgba(255,193,7,0.2)",    text: "#92400e" },
  }[type];
  return (
    <div className="rounded-xl p-5 mb-4" style={{ background: styles.bg, borderLeft: `3px solid ${styles.border}` }}>
      <p className="text-sm font-semibold mb-1.5" style={{ color: styles.text }}>{title}</p>
      <div className="text-sm text-gray-500 leading-relaxed">{content}</div>
    </div>
  );
};

const DocsContent = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const ids = tableOfContents.map((t) => t.id);
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Navigation />
      <div style={{ background: "hsl(var(--lp-page))" }}>
        <main className="min-h-screen pt-16">

          <div className="lp-section-container py-12">
            <div className="flex flex-col lg:flex-row gap-10">

              {/* Sidebar TOC */}
              <aside className="lg:w-64 shrink-0">
                <div className="sticky top-24 rounded-xl p-5" style={{ background: "hsl(var(--lp-surface))", border: "1px solid rgba(0,0,0,0.08)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Table of Contents</p>
                  <ul className="space-y-1">
                    {tableOfContents.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollTo(item.id)}
                          className="w-full text-left text-sm px-3 py-2 rounded-lg transition-colors"
                          style={activeSection === item.id ? {
                            background: "rgba(255,193,7,0.1)",
                            color: "hsl(var(--lp-primary))",
                            fontWeight: 600,
                          } : {
                            color: "#6b7280",
                          }}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="mb-12">
                  <span className="lp-section-label mb-4">DOCS</span>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                    YAHSHUA HRIS Documentation
                  </h1>
                  <p className="text-gray-500 text-base leading-relaxed">
                    Complete guide to getting started with YAHSHUA HRIS, from signup to full implementation.
                  </p>
                </div>

                {/* Quick Access Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-14">
                  {[
                    { label: "Quick Start", desc: "Get up and running with YAHSHUA HRIS in minutes", section: "getting-started", color: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", text: "#1d4ed8" },
                    { label: "Integration", desc: "Connect with your existing YAHSHUA Payroll account", section: "yahshua-payroll-integration", color: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)", text: "#15803d" },
                    { label: "Limitations", desc: "Current limitations and what's coming soon", section: "current-limitations", color: "rgba(255,193,7,0.08)", border: "rgba(255,193,7,0.2)", text: "#92400e" },
                  ].map((card) => (
                    <button
                      key={card.label}
                      onClick={() => scrollTo(card.section)}
                      className="text-left p-5 rounded-xl transition-all"
                      style={{ background: card.color, border: `1px solid ${card.border}` }}
                    >
                      <p className="text-sm font-bold mb-1.5" style={{ color: card.text }}>{card.label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{card.desc}</p>
                      <p className="text-xs font-semibold" style={{ color: card.text }}>Go to section →</p>
                    </button>
                  ))}
                </div>

                {/* Content Sections */}
                <div className="space-y-16">

                  {/* Getting Started */}
                  <section id="getting-started">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                      Getting Started
                    </h2>
                    <h3 className="text-base font-bold text-gray-700 mb-3">How to Login</h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">To access YAHSHUA HRIS, visit the login page and enter your credentials:</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-500 mb-8 pl-2">
                      <li>Go to the <Link href="/login" className="text-primary hover:underline">YAHSHUA HRIS login page</Link></li>
                      <li>Enter your email address</li>
                      <li>Enter your password</li>
                      <li>Click "Sign In" to access your dashboard</li>
                    </ol>
                    <h3 className="text-base font-bold text-gray-700 mb-3">First Time Setup</h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">After logging in for the first time, complete your profile setup:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-500 pl-2">
                      <li>Complete your company profile information</li>
                      <li>Set up your HR preferences and settings</li>
                      <li>Import existing employee data (optional)</li>
                    </ul>
                  </section>

                  {/* Sign Up Options */}
                  <section id="sign-up-options">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                      Sign Up Options
                    </h2>
                    <h3 className="text-base font-bold text-gray-700 mb-3">New User Registration</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-500 mb-8 pl-2">
                      <li>Visit the <Link href="/register" className="text-primary hover:underline">registration page</Link></li>
                      <li>Verify your account</li>
                      <li>Complete your company profile</li>
                      <li>Experience 30-day free trial</li>
                      <li>Choose your subscription plan</li>
                    </ol>
                    <h3 className="text-base font-bold text-gray-700 mb-4">Account Types</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {noteBox("info", "Employer Account", "Full access to all HR management features including employee management, YAHSHUA Payroll integration, compliance reporting, and administrative tools.")}
                      {noteBox("success", "Applicant Account", "Job seekers can create profiles, apply for positions, and track application status.")}
                    </div>
                  </section>

                  {/* YAHSHUA Payroll Integration */}
                  <section id="yahshua-payroll-integration">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                      YAHSHUA Payroll Integration
                    </h2>
                    {noteBox("warning", "Important Access Requirement", "Only the Owner account from YAHSHUA Payroll can log into YAHSHUA HRIS and sync employee records. Sub-users and superadmin accounts cannot directly access YAHSHUA HRIS yet.")}
                    <h3 className="text-base font-bold text-gray-700 mb-3 mt-6">Using Your YAHSHUA Payroll Account</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-500 mb-8 pl-2">
                      <li>Click "YAHSHUA Payroll" in the login options</li>
                      <li>Click Authorize and wait to be redirected to your YAHSHUA HRIS account</li>
                      <li>Enjoy the 30-day free trial as your first experience with YAHSHUA HRIS</li>
                      <li>To sync your employee records, tap on the sync icon in the dashboard</li>
                    </ol>
                    <h3 className="text-base font-bold text-gray-700 mb-4">Account Access Requirements</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {noteBox("success", "Can Access YAHSHUA HRIS", <ul className="list-disc list-inside space-y-1"><li>Owner account from YAHSHUA Payroll</li><li>Can sync employee records between systems</li><li>Can create user accounts for team members</li></ul>)}
                      {noteBox("warning", "Cannot Access YAHSHUA HRIS (Yet)", <ul className="list-disc list-inside space-y-1"><li>Sub-users from YAHSHUA Payroll</li><li>Superadmin accounts from YAHSHUA Payroll</li><li>Any non-owner accounts from YAHSHUA Payroll</li></ul>)}
                    </div>
                    {noteBox("tip", "Pro Tip", "Using your existing YAHSHUA Payroll Owner account saves time and ensures data consistency between your payroll and HR systems. Make sure you're logging in with the Owner account, not a sub-user or superadmin account.")}
                  </section>

                  {/* Current Limitations */}
                  <section id="current-limitations">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                      Current Limitations
                    </h2>
                    {noteBox("warning", "Important", "Please review these current limitations to understand the current scope of YAHSHUA HRIS integration and features.")}
                    <div className="space-y-6 mt-6">
                      {[
                        {
                          title: "Multiple Companies and Account Switching",
                          content: <>{noteBox("warning", "Not Available Yet", "If you have multiple companies in YAHSHUA Payroll, switching between them in YAHSHUA HRIS is not yet supported. This feature is currently in development.")}</>,
                        },
                        {
                          title: "User Access from YAHSHUA Payroll",
                          content: <>{noteBox("tip", "Owner Account Only", "Currently, only the Owner account from YAHSHUA Payroll can log into YAHSHUA HRIS and sync employee records. Sub-users from YAHSHUA Payroll cannot directly log in yet.")}{noteBox("info", "Current Workaround", <ol className="list-decimal list-inside space-y-1"><li>Owner logs into YAHSHUA HRIS and syncs employee records</li><li>Owner creates separate user accounts for sub-users</li><li>Sub-users get separate YAHSHUA HRIS credentials</li></ol>)}</>,
                        },
                        {
                          title: "Social Media Integration",
                          content: <>{noteBox("success", "Currently Available", <ul className="list-disc list-inside space-y-1"><li>Facebook integration</li><li>LinkedIn integration</li></ul>)}{noteBox("info", "Coming Soon", "Additional social media platforms are being evaluated for future integration.")}</>,
                        },
                        {
                          title: "Interview Booking Platforms",
                          content: <>{noteBox("success", "Currently Available", <ul className="list-disc list-inside space-y-1"><li>Email to Google Calendar invitation</li><li>Google Meet for video interviews</li></ul>)}{noteBox("info", "Coming Soon", <ul className="list-disc list-inside space-y-1"><li>Zoom integration</li><li>Microsoft Teams integration</li></ul>)}</>,
                        },
                        {
                          title: "Employee Kiosk Features",
                          content: <>{noteBox("tip", "In Development", <ul className="list-disc list-inside space-y-1"><li>Sending Notice to Explain (NTE) to employee kiosk</li><li>Receiving and responding to notices, memos, and policies</li><li>Employee evaluation submissions through kiosk</li></ul>)}</>,
                        },
                        {
                          title: "Performance Evaluation",
                          content: <>{noteBox("success", "Currently Available", "Direct evaluation system where managers can evaluate employees directly or direct employee self-evaluation from the template created.")}{noteBox("tip", "Coming Soon", <ul className="list-disc list-inside space-y-1"><li>Peer evaluation capabilities</li><li>Employee self-evaluation combined with manager evaluation</li><li>Multi-level evaluation scoring system</li></ul>)}</>,
                        },
                      ].map((item) => (
                        <div key={item.title} className="rounded-xl p-6" style={{ background: "hsl(var(--lp-surface))", border: "1px solid rgba(0,0,0,0.07)" }}>
                          <h3 className="text-base font-bold text-gray-700 mb-4">{item.title}</h3>
                          {item.content}
                        </div>
                      ))}
                    </div>
                    {noteBox("info", "Development Roadmap", "Our development team is actively working on these features. Check back regularly for updates, or contact our support team for specific timelines on features important to your business.")}
                  </section>

                  {/* Group Companies */}
                  <section id="group-companies">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                      Group Companies
                    </h2>
                    {noteBox("warning", "Current Limitation", "Group company management from YAHSHUA Payroll is not yet supported in YAHSHUA HRIS. This feature is planned for a future release.")}
                    <h3 className="text-base font-bold text-gray-700 mb-3 mt-6">What This Means</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-500 mb-6 pl-2">
                      <li>Each company entity requires a separate YAHSHUA HRIS subscription</li>
                      <li>Employee data cannot be consolidated across multiple companies yet</li>
                      <li>Reporting must be done individually for each company</li>
                      <li>User access is limited to single company scope</li>
                    </ul>
                    <h3 className="text-base font-bold text-gray-700 mb-3">Workaround Solutions</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-500 pl-2">
                      <li>Set up separate YAHSHUA HRIS accounts for each company</li>
                      <li>Use consistent naming conventions across companies</li>
                      <li>Export and consolidate reports manually when needed</li>
                      <li>Contact our support team for enterprise solutions</li>
                    </ul>
                  </section>

                  {/* Subscription Renewal */}
                  <section id="subscription-renewal">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                      Subscription Renewal
                    </h2>
                    <h3 className="text-base font-bold text-gray-700 mb-3">After Your Trial Expires</h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">When your 30-day trial ends, select a paid plan to continue using YAHSHUA HRIS:</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-500 mb-6 pl-2">
                      <li>Visit your account settings before trial expiration</li>
                      <li>Choose a subscription plan that fits your needs</li>
                      <li>Add a payment method</li>
                      <li>Confirm your subscription to avoid service interruption</li>
                    </ol>
                    {noteBox("warning", "Important", "Failure to pay after the trial or subscription ends will bring you to View Only mode.")}
                  </section>

                  {/* Data Sync */}
                  <section id="data-sync">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                      Data Synchronization
                    </h2>
                    <h3 className="text-base font-bold text-gray-700 mb-3">What Data is Synced</h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">The following employee data is synchronized between YAHSHUA Payroll and YAHSHUA HRIS:</p>
                    {noteBox("success", "Currently Synced", <ul className="list-disc list-inside space-y-1"><li>Employee personal basic information (name, ID, address, email, etc.)</li><li>Hired dates and contact details</li></ul>)}
                    {noteBox("success", "Now Available", <ul className="list-disc list-inside space-y-1"><li>Full compensation details</li><li>Performance review scores and ratings</li></ul>)}
                    <h3 className="text-base font-bold text-gray-700 mb-3 mt-6">Sync Frequency</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-500 mb-6 pl-2">
                      <li>Real-time for new employee additions</li>
                      <li>On-demand when you manually trigger a sync</li>
                    </ul>
                    {noteBox("info", "Future Enhancements", "We're continuously expanding data synchronization capabilities. More comprehensive integration between YAHSHUA Payroll and YAHSHUA HRIS is coming in future updates.")}
                  </section>

                </div>
              </div>
            </div>
          </div>
        </main>
        <LpFooter />
      </div>
      <ScrollToTop />
    </>
  );
};

export default DocsContent;
