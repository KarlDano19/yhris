"use client";

import React, { useState } from "react";

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
import SettingsLogo from "@/svg/SettingsLogo";

const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggle = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleOpenModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const faqs = [
    {
      id: 1,
      question: "How does it work?",
      answer: (
        <p>
          YAHSHUA HRIS simplifies human resource processes by offering a centralized platform for all essential HR functions. Through the dashboard, you can post jobs, screen applicants, manage employees, oversee training, handle payroll, and ensure compliance with labor laws. Each feature is designed to make HR tasks efficient, saving you time and reducing manual work.
        </p>
      )
    },
    {
      id: 2,
      question: "Is it secure?",
      answer: (
        <p>
          Yes, YAHSHUA HRIS prioritizes data security. We integrate proper and preventive cybersecurity measures into our systems and stay updated on the latest cyberattacks. Additionally, we have a Data Protection Officer (DPO) in our company and adhere to the Data Privacy Act (Republic Act 10173) to ensure compliance with privacy laws.
        </p>
      )
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
      )
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
      )
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
          .filter(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(faq => (
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
                <div className="p-4 bg-gray-50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        {/* No matching questions found */}
        {searchTerm && !faqs.some(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase())) && (
          <p className="text-center">No matching questions found.</p>
        )}
      </div>
      <>
        <div className="category-cards pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Post a Job card */}
            <div className="bg-white border border-yellow-500 rounded-lg shadow-md p-4">
              <div className="flex justify-center items-center pt-4">
                <AddPostLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-6">
                <div className="header font-semibold">Post a Job</div>
                <div className="description text-center">Create and manage job postings.</div>
                <div className="extra content mt-2">
                    <a
                    href="https://youtu.be/iqurBHuLFgk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 border-2 border-blue-500 rounded-md px-2 py-1"
                    >
                    <i className="youtube icon"></i>
                    Watch Tutorial
                    </a>
                </div>
              </div>
            </div>

            {/* Screen Applicants card */}
            <div className="bg-white border border-yellow-500 rounded-lg shadow-md p-4">
            <div className="flex justify-center items-center pt-4">
                <ScreenApplicantsLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-6">
                <div className="header font-semibold">Screen Applicants</div>
                <div className="description text-center">
                    Review and evaluate job applications.
                </div>
                <div className="extra content mt-2">
                    <a
                    href="https://youtu.be/TiQ1NNdTbSQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 border-2 border-blue-500 rounded-md px-2 py-1"
                    >
                    <i className="youtube icon"></i>
                    Watch Tutorial
                    </a>
                </div>

              </div>
            </div>

            {/* Orient card */}
            <div className="bg-white border border-yellow-500 rounded-lg shadow-md p-4">
            <div className="flex justify-center items-center pt-4">
                <OrientLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">Orient</div>
                <div className="description text-center">
                    Onboard and orient new employees.
                </div>
                <div className="extra content mt-2">
                    <a
                    href="https://youtu.be/zNAUFdsaA2c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 border-2 border-blue-500 rounded-md px-2 py-1"
                    >
                    <i className="youtube icon"></i>
                    Watch Tutorial
                    </a>
                </div>

              </div>
            </div>

            {/* Manage card */}
            <div className="bg-white border border-yellow-500 rounded-lg shadow-md p-4">
            <div className="flex justify-center items-center pt-4">
                <ManageLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">Manage</div>
                <div className="description text-center">
                    Manage employee information and records.
                </div>
                <div className="extra content mt-2">
                    <button className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1" disabled>
                    <i className="youtube icon"></i>
                    Watch Tutorial
                    </button>
                </div>

              </div>
            </div>

            {/* Train card */}
            <div className="bg-white border border-yellow-500 rounded-lg shadow-md p-4">
            <div className="flex justify-center items-center pt-4">
                <TrainLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">Train</div>
                <div className="description text-center">
                    Access training resources and programs.
                </div>
                <div className="extra content mt-2">
                    <button className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1" disabled>
                    <i className="youtube icon"></i>
                    Watch Tutorial
                    </button>
                </div>

              </div>
            </div>

            {/* Payroll card */}
            <div className="bg-white border border-yellow-500 rounded-lg shadow-md p-4">
            <div className="flex justify-center items-center pt-4">
                <PayrollLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">Payroll</div>
                <div className="description text-center">
                    Manage payroll and compensation.
                </div>
                <div className="extra content mt-2">
                    <button className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1" disabled>
                    <i className="youtube icon"></i>
                    Watch Tutorial
                    </button>
                </div>

              </div>
            </div>

            {/* Employee Separation card */}
            <div className="bg-white border border-yellow-500 rounded-lg shadow-md p-4">
            <div className="flex justify-center items-center pt-4">
                <EmployeeSeparationLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-8">
                <div className="header font-semibold">Employee Separation</div>
                <div className="description text-center">
                    Handle employee exits and separations.
                </div>
                <div className="extra content mt-2">
                    <button className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1" disabled>
                    <i className="youtube icon"></i>
                    Watch Tutorial
                    </button>
                </div>

              </div>
            </div>

            {/* Employee Kit card */}
            <div className="bg-white border border-yellow-500 rounded-lg shadow-md p-4">
            <div className="flex justify-center items-center">
                <EmployeeKitLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">Employee Kit</div>
                <div className="description text-center">
                    Access employee resources and tools.
                </div>
                <div className="extra content mt-2">
                    <button className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1" disabled>
                    <i className="youtube icon"></i>
                    Watch Tutorial
                    </button>
                </div>

              </div>
            </div>

            {/* DOLE card */}
            <div className="bg-white border border-yellow-500 rounded-lg shadow-md p-4">
            <div className="flex justify-center items-center">
                <DoleLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-4">
                <div className="header font-semibold">DOLE</div>
                <div className="description text-center">
                    Access DOLE-related information and compliance.
                </div>
                <div className="extra content mt-2">
                    <button className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1" disabled>
                    <i className="youtube icon"></i>
                    Watch Tutorial
                    </button>
                </div>
              </div>
            </div>

            {/* Settings card */}
            <div className="bg-white border border-yellow-500 rounded-lg shadow-md p-4">
            <div className="flex justify-center items-center pt-4">
                <SettingsLogo />
              </div>
              <div className="flex flex-col justify-center items-center space-y-2 px-4 py-6">
                <div className="header font-semibold">Settings</div>
                <div className="description text-center">
                    Configure system settings and preferences.
                </div>
                <div className="extra content mt-2">
                    <button className="text-gray-400 cursor-not-allowed border-2 border-blue-500 rounded-md px-2 py-1" disabled>
                    <i className="youtube icon"></i>
                    Watch Tutorial
                    </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
            <h2 className="text-xl font-semibold mb-4">More Information</h2>
            <p>{modalContent}</p>
            <button
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqPage;