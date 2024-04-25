"use client";
import Image from "next/image";
import jobIllustration from "@/assets/find-job-illustration.svg";

import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/solid";
import CardProfile from "./CardProfile";
import CardRecentApp from "./CardRecentApp";
import FileCaseIcon from "@/svg/FileCaseIcon";
import { useState, useEffect } from "react";
import JobDetailsModal from "./modals/JobDetailsModal";
import JobDetails from "./JobDetails";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "./modals/ConfirmModal";
import SuccessPopAlert from "@/components/SuccessPopAlert";
import SavedModal from "../edit-profile/modals/SavedModal";
import useFindJobs from "./hooks/useFindJobs";



const Content = () => {
  const [hasJob, setJob] = useState(false);
  const [isJobView, setIsJobView] = useState(false);
  const [isJobModal, setJobModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<any>();
  const [confirmModalOpen, setConfirmModal] = useState(false);
  const [openSuccessAlert, setSuccessAlert] = useState(false);
  const [openSavedModal, setSavedModal] = useState(false);

  const { data, isLoading } = useFindJobs("Front", "Manila");

  const openJobDetails = (jobId: any) => {
    setSelectedJobId(jobId);
    setIsJobView(true);
    setJobModal(true);
  };

  const closeJobDetails = () => {
    setIsJobView(false);
  };

  const closeJobModal = () => {
    setJobModal(false);
  };

  useEffect(() => {
    const showSuccessAlert = sessionStorage.getItem("showSuccessOnLoad");
    const showSavedModal = sessionStorage.getItem("showSavedModal");

    if (showSuccessAlert) {
      setSuccessAlert(true);
      sessionStorage.removeItem("showSuccessOnLoad");
    } else if (showSavedModal) {
      setSavedModal(true);
      sessionStorage.removeItem("showSavedModal");
    }
  }, []);

  return (
    <>
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}
      >
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-6 gap-x-6 lg:px-4 py-8">
          <div className="md:col-span-3 lg:col-span-2">
            <CardProfile />
            <CardRecentApp />
          </div>
          <div className="md:col-span-5 lg:col-span-4 bg-white border border-gray-300 h-auto rounded-md shadow pt-7 mt-8 md:mt-0">
            <form
              className="px-5"
              onSubmit={(e) => {
                e.preventDefault();
                setJob(true);
              }}
            >
              <h4 className="text-lg md:text-2xl text-indigo-dye font-bold md:font-semibold">
                Find a job that&#39;s right for you!
              </h4>
              <div className="lg:flex lg:justify-between mt-5">
                <div className="flex justify-around rounded-md p-3 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-black w-full lg:w-[48%]">
                  <label
                    htmlFor="what"
                    className="font-semibold text-indigo-dye text-sm"
                  >
                    What
                  </label>
                  <input
                    type="text"
                    name="what"
                    id="what"
                    className="bg-gray-100 w-56 mx-3 md:px-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none text-xs leading-[22px]"
                    placeholder="Enter job title, company, or keywords"
                    required
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex justify-around rounded-md p-3 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-black w-full lg:w-[48%] mt-3 lg:mt-0">
                  <label
                    htmlFor="where"
                    className="font-semibold text-indigo-dye text-sm"
                  >
                    Where
                  </label>
                  <input
                    type="text"
                    name="where"
                    id="where"
                    className="bg-gray-100 w-56 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none text-xs leading-[22px] ml-3 md:ml-0"
                    placeholder="Town, City, Province, Country"
                    required
                  />
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="flex justify-center mt-4 lg:mt-6">
                <button
                  type="submit"
                  className="rounded-md bg-savoy-blue px-24 lg:px-32 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Find Jobs
                </button>
              </div>
            </form>
            {hasJob ? (
              <div>
                <p className="text-[#6F829B] text-sm text-center mt-3 pb-5 border-b border-gray-300">
                  Jobs available: {!isLoading ? data?.length : "0"}
                </p>
                <div className="lg:flex">
                  <div className="lg:w-[46%]">
                    <div className="px-5 py-6 grid md:grid-cols-2 lg:grid-cols-1 md:gap-x-4 lg:gap-x-0 gap-y-4">
                      {!isLoading
                        ? data?.map((job: any) => (
                            <div
                              key={job.id}
                              className={`${
                                isJobView && selectedJobId === job.id
                                  ? "border-savoy-blue"
                                  : "border-gray-300"
                              } card border rounded-md p-4 cursor-pointer md:h-[265px] lg:h-[220px]`}
                              onClick={() => openJobDetails(job.id)}
                            >
                              <div className="text-xs text-red-500 h-4 block">
                                {job.isNew ? "NEW" : ""}
                              </div>
                              <div className="flex md:flex-col lg:flex-row mt-2">
                                <span className="mt-1 ml-1">
                                  <FileCaseIcon className="h-6 w-6" />
                                </span>
                                <div className="ml-6 md:ml-0 lg:ml-6 mt-0 md:mt-2 lg:mt-0">
                                  <h5 className="text-lg lg:text-xl font-semibold text-indigo-dye">
                                    {job.title}
                                  </h5>
                                  <h6 className="text-indigo-dye text-sm font-medium mt-1">
                                    {job.company}
                                  </h6>
                                  <h6 className="text-indigo-dye text-sm">
                                    {job.location}
                                  </h6>
                                  <button
                                    type="submit"
                                    className="rounded-md bg-savoy-blue mt-5 mb-4 md:mb-0 lg:mb-4 w-full py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setConfirmModal(true);
                                    }}
                                  >
                                    Apply Now!
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        : "Loading job...."}
                    </div>
                  </div>
                  <div className="lg:border-l lg:border-gray-300 px-5 py-6 lg:w-[54%] hidden lg:block">
                    <div
                      className={`${
                        isJobView ? "" : "hidden"
                      } card border border-gray-300 rounded-md`}
                    >
                      <div className="flex justify-end px-3 mt-2">
                        <button onClick={closeJobDetails}>
                          <XMarkIcon className="h-5 w-5 text-indigo-dye" />
                        </button>
                      </div>
                      <JobDetails jobId={selectedJobId} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Image
                className="mx-auto mt-8"
                src={jobIllustration}
                width={0}
                height={0}
                alt="Find job illustration"
              />
            )}
          </div>
        </div>
        <JobDetailsModal
          open={isJobModal}
          onClose={closeJobModal}
          jobId={selectedJobId}
        />
        <ConfirmModal
          open={confirmModalOpen}
          onClose={() => setConfirmModal(false)}
        />
      </div>
      <SuccessPopAlert
        message="Successfully set-up profile."
        open={openSuccessAlert}
        onClose={() => setSuccessAlert(false)}
      />
      <SavedModal open={openSavedModal} onClose={() => setSavedModal(false)} />
    </>
  );
};

export default Content;
