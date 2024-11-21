"use client";

import React, { useState } from "react";

import SettingsLogo from "@/svg/SettingsLogo";
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

import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
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
  const [isScreenApplicantsModalOpen, setIsScreenApplicantsModalOpen] =
    useState(false);
  const [isOrientModalOpen, setIsOrientModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isEmployeeSeparationModalOpen, setIsEmployeeSeparationModalOpen] =
    useState(false);
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
          YAHSHUA HRIS simplifies human resource processes by offering a
          centralized platform for all essential HR functions. Through the
          dashboard, you can post jobs, screen applicants, manage employees,
          oversee training, handle payroll, and ensure compliance with labor
          laws. Each feature is designed to make HR tasks efficient, saving you
          time and reducing manual work.
        </p>
      ),
    },
    {
      id: 2,
      question: "Is it secure?",
      answer: (
        <p>
          Yes, YAHSHUA HRIS prioritizes data security. We integrate proper and
          preventive cybersecurity measures into our systems and stay updated on
          the latest cyberattacks. Additionally, we have a Data Protection
          Officer (DPO) in our company and adhere to the Data Privacy Act
          (Republic Act 10173) to ensure compliance with privacy laws.
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
          <li>
            Manage: Track and manage employee information and performance.
          </li>
          <li>
            Train: Facilitate employee development through training programs.
          </li>
          <li>
            Payroll: Automate and manage salary disbursement and deductions.
          </li>
          <li>Employee Separation: Efficiently manage employee exits.</li>
          <li>
            DOLE Compliance: Ensure alignment with the Department of Labor and
            Employment (DOLE) regulations.
          </li>
          <li>
            Employee Kit: Provide employees with essential resources and
            documents.
          </li>
        </ul>
      ),
    },
    {
      id: 4,
      question: "What are the benefits?",
      answer: (
        <ul className="list-disc pl-5">
          <li>
            Efficiency: Automates tedious HR tasks, freeing up time for more
            strategic initiatives.
          </li>
          <li>
            Accuracy: Reduces human error, particularly in payroll and
            compliance.
          </li>
          <li>
            Compliance: Helps ensure adherence to local labor laws, including
            DOLE regulations.
          </li>
          <li>
            Centralized Management: Provides a one-stop solution for all HR
            tasks, making it easier to oversee employee lifecycles.
          </li>
          <li>
            Scalability: Designed to grow with your organization, handling
            everything from small teams to large enterprises.
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="mb-8">
        <h1 className="text-4xl text-center text-gray-800">
          Frequently Asked Questions
        </h1>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full p-2 border border-yellow-500 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        {faqs
          .filter((faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((faq) => (
            <div key={faq.id} className="border border-yellow-500 rounded">
              <div
                className="flex justify-between items-center p-4 cursor-pointer bg-white hover:bg-gray-100"
                onClick={() => handleToggle(faq.id)}
              >
                <h2 className="font-semibold">{faq.question}</h2>
                {activeIndex === faq.id ? (
                  <MinusIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <PlusIcon className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              {activeIndex === faq.id && (
                <div className="p-4 bg-gray-50">{faq.answer}</div>
              )}
            </div>
          ))}
        {/* No matching questions found */}
        {searchTerm &&
          !faqs.some((faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase())
          ) && <p className="text-center">No matching questions found.</p>}
      </div>
      <>
        <div className="category-cards pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Post a Job card */}
            <div
              className="bg-white border border-yellow-500 rounded-lg shadow-md p-4 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => setIsPostJobModalOpen(true)}
            >
              <div className="flex justify-center items-center pt-4">
                <AddPostLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-6">
                <div className="header font-semibold">Post a Job</div>
                <div className="description text-center">
                  Create and manage job postings.
                </div>
                <div className="extra content mt-2">
                  <div className="extra content mt-2">
                    <button
                      className="text-blue-500 border-2 border-blue-500 rounded-md px-2 py-1 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      onClick={() =>
                        window.open("https://youtu.be/iqurBHuLFgk", "_blank")
                      }
                    >
                      <i className="youtube icon"></i>
                      Watch Tutorial
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Screen Applicants card */}
            <div
              className="bg-white border border-yellow-500 rounded-lg shadow-md p-4 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => setIsScreenApplicantsModalOpen(true)}
            >
              <div className="flex justify-center items-center pt-4">
                <ScreenApplicantsLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-6">
                <div className="header font-semibold">Screen Applicants</div>
                <div className="description text-center">
                  Review and evaluate job applications.
                </div>
                <div className="extra content mt-2">
                  <div className="extra content mt-2">
                    <button
                      className="text-blue-500 border-2 border-blue-500 rounded-md px-2 py-1 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      onClick={() =>
                        window.open("https://youtu.be/TiQ1NNdTbSQ", "_blank")
                      }
                    >
                      <i className="youtube icon"></i>
                      Watch Tutorial
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Orient card */}
            <div
              className="bg-white border border-yellow-500 rounded-lg shadow-md p-4 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => setIsOrientModalOpen(true)}
            >
              <div className="flex justify-center items-center pt-4">
                <OrientLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">Orient</div>
                <div className="description text-center">
                  Onboard and orient new employees.
                </div>
                <div className="extra content mt-2">
                  <div className="extra content mt-2">
                    <div className="extra content mt-2">
                      <button
                        className="text-blue-500 border-2 border-blue-500 rounded-md px-2 py-1 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                        onClick={() =>
                          window.open("https://youtu.be/zNAUFdsaA2c", "_blank")
                        }
                      >
                        <i className="youtube icon"></i>
                        Watch Tutorial
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Manage card */}
            <div
              className="bg-white border border-yellow-500 rounded-lg shadow-md p-4 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => setIsManageModalOpen(true)}
            >
              <div className="flex justify-center items-center pt-4">
                <ManageLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">Manage</div>
                <div className="description text-center">
                  Manage employee information and records.
                </div>
                <div className="extra content mt-2">
                  <button
                    className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1"
                    disabled
                  >
                    <i className="youtube icon"></i>
                    Watch Tutorial
                  </button>
                </div>
              </div>
            </div>

            {/* Train card */}
            <div
              className="bg-white border border-yellow-500 rounded-lg shadow-md p-4 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => setIsTrainModalOpen(true)}
            >
              <div className="flex justify-center items-center pt-4">
                <TrainLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">Train</div>
                <div className="description text-center">
                  Access training resources and programs.
                </div>
                <div className="extra content mt-2">
                  <button
                    className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1"
                    disabled
                  >
                    <i className="youtube icon"></i>
                    Watch Tutorial
                  </button>
                </div>
              </div>
            </div>

            {/* Payroll card */}
            <div
              className="bg-white border border-yellow-500 rounded-lg shadow-md p-4 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => setIsPayrollModalOpen(true)}
            >
              <div className="flex justify-center items-center pt-4">
                <PayrollLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">Payroll</div>
                <div className="description text-center">
                  Manage payroll and compensation.
                </div>
                <div className="extra content mt-2">
                  <button
                    className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1"
                    disabled
                  >
                    <i className="youtube icon"></i>
                    Watch Tutorial
                  </button>
                </div>
              </div>
            </div>

            {/* Employee Separation card */}
            <div
              className="bg-white border border-yellow-500 rounded-lg shadow-md p-4 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => setIsEmployeeSeparationModalOpen(true)}
            >
              <div className="flex justify-center items-center pt-4">
                <EmployeeSeparationLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-8">
                <div className="header font-semibold">Employee Separation</div>
                <div className="description text-center">
                  Handle employee exits and separations.
                </div>
                <div className="extra content mt-2">
                  <button
                    className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1"
                    disabled
                  >
                    <i className="youtube icon"></i>
                    Watch Tutorial
                  </button>
                </div>
              </div>
            </div>

            {/* Employee Kit card */}
            <div
              className="bg-white border border-yellow-500 rounded-lg shadow-md p-4 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => setIsEmployeeKitModalOpen(true)}
            >
              <div className="flex justify-center items-center">
                <EmployeeKitLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">Employee Kit</div>
                <div className="description text-center">
                  Access employee resources and tools.
                </div>
                <div className="extra content mt-2">
                  <button
                    className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1"
                    disabled
                  >
                    <i className="youtube icon"></i>
                    Watch Tutorial
                  </button>
                </div>
              </div>
            </div>

            {/* DOLE card */}
            <div
              className="bg-white border border-yellow-500 rounded-lg shadow-md p-4 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => setIsDoleModalOpen(true)}
            >
              <div className="flex justify-center items-center">
                <DoleLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">DOLE</div>
                <div className="description text-center">
                  Access DOLE-related information and compliance.
                </div>
                <div className="extra content mt-2">
                  <button
                    className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1"
                    disabled
                  >
                    <i className="youtube icon"></i>
                    Watch Tutorial
                  </button>
                </div>
              </div>
            </div>

            {/* Settings card */}
            <div
              className="bg-white border border-yellow-500 rounded-lg shadow-md p-4 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => setIsSettingsModalOpen(true)}
            >
              <div className="flex justify-center items-center pt-4">
                <SettingsLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-6">
                <div className="header font-semibold">Settings</div>
                <div className="description text-center">
                  Configure system settings and preferences.
                </div>
                <div className="extra content mt-2">
                  <button
                    className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1"
                    disabled
                  >
                    <i className="youtube icon"></i>
                    Watch Tutorial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>

      {isPostJobModalOpen && (
        <PostJobModal
          isOpen={isPostJobModalOpen}
          setIsOpen={setIsPostJobModalOpen}
        />
      )}
      {isScreenApplicantsModalOpen && (
        <ScreenApplicantsModal
          isOpen={isScreenApplicantsModalOpen}
          setIsOpen={setIsScreenApplicantsModalOpen}
        />
      )}
      {isOrientModalOpen && (
        <OrientModal
          isOpen={isOrientModalOpen}
          setIsOpen={setIsOrientModalOpen}
        />
      )}
      {isManageModalOpen && (
        <ManageModal
          isOpen={isManageModalOpen}
          setIsOpen={setIsManageModalOpen}
        />
      )}
      {isTrainModalOpen && (
        <TrainModal isOpen={isTrainModalOpen} setIsOpen={setIsTrainModalOpen} />
      )}
      {isPayrollModalOpen && (
        <PayrollModal
          isOpen={isPayrollModalOpen}
          setIsOpen={setIsPayrollModalOpen}
        />
      )}
      {isEmployeeSeparationModalOpen && (
        <EmployeeSeparationModal
          isOpen={isEmployeeSeparationModalOpen}
          setIsOpen={setIsEmployeeSeparationModalOpen}
        />
      )}
      {isEmployeeKitModalOpen && (
        <EmployeeKitModal
          isOpen={isEmployeeKitModalOpen}
          setIsOpen={setIsEmployeeKitModalOpen}
        />
      )}
      {isDoleModalOpen && (
        <DoleModal isOpen={isDoleModalOpen} setIsOpen={setIsDoleModalOpen} />
      )}
      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          setIsOpen={setIsSettingsModalOpen}
        />
      )}
    </div>
  );
};

export default FaqPage;
