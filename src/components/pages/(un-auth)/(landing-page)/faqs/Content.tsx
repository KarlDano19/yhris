"use client";

import React, { useState } from "react";

import PostJobModal from "./modals/PostJobModal";
import ScreenApplicantsModal from "./modals/ScreenApplicantsModal";
import OrientModal from "./modals/OrientModal";
import ManageModal from "./modals/ManageModal";
import TrainModal from "./modals/TrainModal";
import PayrollModal from "./modals/PayrollModal";
import EmployeeSeparationModal from "./modals/EmployeeSeparationModal";
import EmployeeKitModal from "./modals/EmployeeKitModal";
import DoleModal from "./modals/DoleModal";
import SettingsModal from "./modals/SettingsModal";

import ScrollToTop from "@/components/pages/(un-auth)/(landing-page)/landing-page/components/ScrollToTop";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import SettingsLogo from "@/svg/SettingsLogo";
import AddPostLogo from "@/svg/AddPostLogo";
import ScreenApplicantsLogo from "@/svg/ScreenApplicantsLogo";
import OrientLogo from "@/svg/OrientLogo";
import ManageLogo from "@/svg/ManageLogo";
import TrainLogo from "@/svg/TrainLogo";
import PayrollLogo from "@/svg/PayrollLogo";
import EmployeeSeparationLogo from "@/svg/EmployeeSeparationLogo";
import EmployeeKitLogo from "@/svg/EmployeeKitLogo";
import DoleLogo from "@/svg/DoleLogo";

const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isScreenApplicantsModalOpen, setIsScreenApplicantsModalOpen] = useState(false);
  const [isOrientModalOpen, setIsOrientModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isEmployeeSeparationModalOpen, setIsEmployeeSeparationModalOpen] = useState(false);
  const [isEmployeeKitModalOpen, setIsEmployeeKitModalOpen] = useState(false);
  const [isDoleModalOpen, setIsDoleModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleToggle = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      id: 1,
      question: "How does it work?",
      answer: (
        <p>
          YAHSHUA HRIS simplifies human resource processes by offering a centralized platform for all essential HR functions. Through the dashboard, you can post jobs, screen applicants, manage employees, oversee training, handle payroll, and ensure compliance with labor laws. Each feature is designed to make HR tasks efficient, saving you time and reducing manual work.
        </p>
      ),
    },
    {
      id: 2,
      question: "Is it secure?",
      answer: (
        <p>
          Yes, YAHSHUA HRIS prioritizes data security. We integrate proper and preventive cybersecurity measures into our systems and stay updated on the latest cyberattacks. Additionally, we have a Data Protection Officer (DPO) in our company and adhere to the Data Privacy Act (Republic Act 10173) to ensure compliance with privacy laws.
        </p>
      ),
    },
    {
      id: 3,
      question: "What are the features?",
      answer: (
        <ul className="list-disc pl-5">
          <li>Post a Job: Create and publish job listings.</li>
          <li>Screen Applicants: Review and shortlist job candidates.</li>
          <li>Orient: Simplify the onboarding process for new employees.</li>
          <li>Manage: Track and manage employee information and performance.</li>
          <li>Train: Facilitate employee development through training programs.</li>
          <li>Payroll: Automate and manage salary disbursement and deductions.</li>
          <li>Employee Separation: Efficiently manage employee exits.</li>
          <li>DOLE Compliance: Ensure alignment with the Department of Labor and Employment (DOLE) regulations.</li>
          <li>Employee Kit: Provide employees with essential resources and documents.</li>
        </ul>
      ),
    },
    {
      id: 4,
      question: "What are the benefits?",
      answer: (
        <ul className="list-disc pl-5">
          <li>Efficiency: Automates tedious HR tasks, freeing up time for more strategic initiatives.</li>
          <li>Accuracy: Reduces human error, particularly in payroll and compliance.</li>
          <li>Compliance: Helps ensure adherence to local labor laws, including DOLE regulations.</li>
          <li>Centralized Management: Provides a one-stop solution for all HR tasks, making it easier to oversee employee lifecycles.</li>
          <li>Scalability: Designed to grow with your organization, handling everything from small teams to large enterprises.</li>
        </ul>
      ),
    },
  ];

  const featureCards = [
    { logo: <AddPostLogo />, label: "Post a Job", desc: "Create and manage job postings.", onClick: () => setIsPostJobModalOpen(true), tutorialUrl: "https://youtu.be/iqurBHuLFgk", hasTutorial: true },
    { logo: <ScreenApplicantsLogo />, label: "Screen Applicants", desc: "Review and evaluate job applications.", onClick: () => setIsScreenApplicantsModalOpen(true), tutorialUrl: "https://youtu.be/TiQ1NNdTbSQ", hasTutorial: true },
    { logo: <OrientLogo />, label: "Orient", desc: "Onboard and orient new employees.", onClick: () => setIsOrientModalOpen(true), tutorialUrl: "https://youtu.be/zNAUFdsaA2c", hasTutorial: true },
    { logo: <ManageLogo />, label: "Manage", desc: "Manage employee information and records.", onClick: () => setIsManageModalOpen(true), hasTutorial: false },
    { logo: <TrainLogo />, label: "Train", desc: "Access training resources and programs.", onClick: () => setIsTrainModalOpen(true), hasTutorial: false },
    { logo: <PayrollLogo />, label: "Payroll", desc: "Manage payroll and compensation.", onClick: () => setIsPayrollModalOpen(true), hasTutorial: false },
    { logo: <EmployeeSeparationLogo />, label: "Employee Separation", desc: "Handle employee exits and separations.", onClick: () => setIsEmployeeSeparationModalOpen(true), hasTutorial: false },
    { logo: <EmployeeKitLogo />, label: "Employee Kit", desc: "Access employee resources and tools.", onClick: () => setIsEmployeeKitModalOpen(true), hasTutorial: false },
    { logo: <DoleLogo />, label: "DOLE", desc: "Access DOLE-related information and compliance.", onClick: () => setIsDoleModalOpen(true), hasTutorial: false },
    { logo: <SettingsLogo />, label: "Settings", desc: "Configure system settings and preferences.", onClick: () => setIsSettingsModalOpen(true), hasTutorial: false },
  ];

  return (
    <>
      <div style={{ background: "#ffffff" }}>
        <main className="min-h-screen pt-16">

          {/* Hero */}
          <section className="pt-24 pb-16 relative overflow-hidden lp-dot-grid-light lp-hero-glow" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }} />
            <div className="lp-section-container text-center relative z-10">
              <span className="lp-section-label justify-center mb-5">FAQS</span>
              <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-bold leading-tight text-gray-900 mb-5 tracking-tight">
                Frequently Asked <span className="text-primary">Questions</span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
                Everything you need to know about YAHSHUA HRIS and how it can simplify your HR operations.
              </p>
            </div>
          </section>

          {/* FAQ accordion */}
          <section className="py-16" style={{ background: "#ffffff" }}>
            <div className="lp-section-container max-w-3xl mx-auto">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  className="w-full px-4 py-3 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
                  style={{ background: "#ffffff", border: "1px solid rgba(255,193,7,0.25)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="divide-y rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(255,193,7,0.2)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                {faqs
                  .filter((faq) => faq.question.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((faq) => {
                    const isOpen = activeIndex === faq.id;
                    return (
                      <div key={faq.id} style={{ borderColor: "rgba(255,193,7,0.12)" }}>
                        <button
                          className="w-full flex items-center justify-between py-5 px-6 text-left gap-4 transition-colors duration-200"
                          style={{ background: isOpen ? "rgba(255,193,7,0.04)" : "transparent" }}
                          onClick={() => handleToggle(faq.id)}
                          aria-expanded={isOpen}
                        >
                          <span className="text-sm font-semibold text-gray-800">{faq.question}</span>
                          {isOpen ? (
                            <MinusIcon className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <PlusIcon className="h-4 w-4 text-gray-400 shrink-0" />
                          )}
                        </button>
                        <div className="grid transition-all duration-200 ease-in-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                          <div className="overflow-hidden">
                            <div className="text-sm text-gray-500 leading-relaxed px-6 pb-5">{faq.answer}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {searchTerm && !faqs.some((faq) => faq.question.toLowerCase().includes(searchTerm.toLowerCase())) && (
                  <p className="text-center text-gray-400 py-8 text-sm px-6">No matching questions found.</p>
                )}
              </div>
            </div>
          </section>

          {/* Feature cards */}
          <section className="py-16" style={{ background: "#FFFBF0", borderTop: "1px solid rgba(255,193,7,0.15)" }}>
            <div className="lp-section-container">
              <div className="text-center mb-10">
                <span className="lp-section-label justify-center mb-4">EXPLORE BY FEATURE</span>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Browse tutorials and guides by module.</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {featureCards.map((card) => (
                  <div
                    key={card.label}
                    className="lp-light-card p-5 cursor-pointer flex flex-col items-center text-center gap-3"
                    onClick={card.onClick}
                  >
                    <div className="flex justify-center items-center w-12 h-12">{card.logo}</div>
                    <p className="text-sm font-semibold text-gray-800">{card.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                    {card.hasTutorial ? (
                      <button
                        className="text-xs text-primary border rounded-md px-2.5 py-1 transition-all hover:bg-primary hover:text-navy"
                        style={{ borderColor: "rgba(255,193,7,0.3)" }}
                        onClick={(e) => { e.stopPropagation(); window.open((card as any).tutorialUrl, "_blank"); }}
                      >
                        Watch Tutorial
                      </button>
                    ) : (
                      <span className="text-xs text-gray-300 border rounded-md px-2.5 py-1 cursor-not-allowed"
                        style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                        Coming Soon
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
      </div>

      {isPostJobModalOpen && <PostJobModal isOpen={isPostJobModalOpen} setIsOpen={setIsPostJobModalOpen} />}
      {isScreenApplicantsModalOpen && <ScreenApplicantsModal isOpen={isScreenApplicantsModalOpen} setIsOpen={setIsScreenApplicantsModalOpen} />}
      {isOrientModalOpen && <OrientModal isOpen={isOrientModalOpen} setIsOpen={setIsOrientModalOpen} />}
      {isManageModalOpen && <ManageModal isOpen={isManageModalOpen} setIsOpen={setIsManageModalOpen} />}
      {isTrainModalOpen && <TrainModal isOpen={isTrainModalOpen} setIsOpen={setIsTrainModalOpen} />}
      {isPayrollModalOpen && <PayrollModal isOpen={isPayrollModalOpen} setIsOpen={setIsPayrollModalOpen} />}
      {isEmployeeSeparationModalOpen && <EmployeeSeparationModal isOpen={isEmployeeSeparationModalOpen} setIsOpen={setIsEmployeeSeparationModalOpen} />}
      {isEmployeeKitModalOpen && <EmployeeKitModal isOpen={isEmployeeKitModalOpen} setIsOpen={setIsEmployeeKitModalOpen} />}
      {isDoleModalOpen && <DoleModal isOpen={isDoleModalOpen} setIsOpen={setIsDoleModalOpen} />}
      {isSettingsModalOpen && <SettingsModal isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} />}
    </>
  );
};

export default FaqPage;
