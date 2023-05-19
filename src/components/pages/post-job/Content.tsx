"use client";
import React, { useState } from "react";
import Link from "next/link";
import CreateJob from "@/svg/CreateJob";
import JobPostingHistory from "@/svg/JobPostingHistory";
import CreateJobModal from "./create-job/modals/CreateJobModal";

const menus = [
  {
    icon: <JobPostingHistory />,
    text: "Job Posting History",
    link: "/post-job/job-posting-history",
  },
];

const Content = () => {
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="p-2 md:p-8 lg:p-4">
        <h2 className="text-xl font-bold text-indigo-dye">Post a Job</h2>
        <div className="grid grid-cols-5 gap-6 mt-6">
          <button
            onClick={() => setIsCreateJobModalOpen(true)}
            className="bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none"
          >
            <CreateJob />
            <h3 className="text-indigo-dye font-semibold text-center">
              Create a Job
            </h3>
          </button>
          {menus.map((menu, index) => {
            return (
              <Link
                href={menu.link}
                key={index}
                className="bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80"
              >
                {menu.icon}
                <h3 className="text-indigo-dye font-semibold text-center">
                  {menu.text}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        setIsOpen={setIsCreateJobModalOpen}
      />
    </div>
  );
};

export default Content;
