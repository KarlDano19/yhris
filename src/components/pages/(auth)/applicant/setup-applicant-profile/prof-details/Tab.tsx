"use client";
import { useState } from "react";

import { useForm, useFormContext } from "react-hook-form";

import SuccessPopAlert from "@/components/SuccessPopAlert";
import AddProfModal from "../modals/AddProfModal";

import DropDownArrow from "@/svg/DropDownArrow";

function ProfDetailTab({
  register,
  handleSubmit,
  setCurrentTab,
}: {
  register: any;
  handleSubmit: any;
  setCurrentTab: any;
}) {
  const onSubmit = handleSubmit(() => {
    setCurrentTab(3);
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [openSuccessAlert, setSuccessAlert] = useState(false);

  return (
    <>
      <SuccessPopAlert
        message="Successfully added job."
        open={openSuccessAlert}
        onClose={() => setSuccessAlert(false)}
      />
      <form onSubmit={onSubmit}>
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-12">
            <div className="grid-item">
              <label
                htmlFor="education"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Education Level <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-2">
                <select
                  id="education"
                  {...register("education")}
                  className="rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  defaultValue="College Graduate"
                >
                  <option value={"College Graduate"}>College Graduate</option>
                  <option value={"Highschool Graduate"}>
                    Highschool Graduate
                  </option>
                </select>
                <div className="absolute right-3 top-[14px]">
                  <DropDownArrow />
                </div>
              </div>
            </div>
            <div className="grid-item mt-4 md:mt-0">
              <label
                htmlFor="course"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Course <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("course")}
                  id="course"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid-item mt-4 md:mt-0">
              <label
                htmlFor="year-graduated"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Year Graduated <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("yearGraduated")}
                  id="year-graduated"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <h6 className="text-indigo-dye md:col-span-3 text-sm font-semibold mt-6">
              Work Experience <span className="text-red-500">*</span>
            </h6>
            <div className="grid-item">
              <button
                type="button"
                className="rounded-md mt-4 md:mt-8 bg-[#65C979] px-10 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setModalOpen(true)}
              >
                Add a Job
              </button>
              <div className="mt-5">
                <input
                  type="text"
                  name="job"
                  id="job"
                  className="hidden rounded-md w-full border-0 px-3 py-1.5 bg-indigo-dye text-center text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  placeholder="Job 1"
                />
              </div>
            </div>
            <div className="grid-item mt-4 md:mt-0">
              <label
                htmlFor="skills"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Skills <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("skills")}
                  id="skills"
                  className="rounded-md w-full h-24 border-0  px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid-item mt-4 md:mt-0">
              <label
                htmlFor="hobbies"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Hobbies & Interests
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("hobbies")}
                  id="hobbies"
                  className="rounded-md w-full h-24 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid-item md:col-span-1 mt-4 md:mt-16">
              <label
                htmlFor="current-job"
                className="whitespace-nowrap text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Do you currently have a job?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-2">
                <select
                  id="current-job"
                  {...register("currentJob")}
                  className="rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  defaultValue="College Graduate"
                >
                  <option value={"Yes"}>Yes</option>
                  <option value={"No"}>No</option>
                </select>
                <div className="absolute right-3 top-[14px]">
                  <DropDownArrow />
                </div>
              </div>
            </div>
            <div className="grid-item md:col-span-2 mt-4 md:mt-16">
              <label
                htmlFor="apply-reason"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                If yes, why are you applying for a job?
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("applyReason")}
                  id="apply-reason"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <h6 className="text-indigo-dye md:col-span-3 text-sm font-semibold mt-6 mb-2">
              Expected Monthly Salary
            </h6>
            <div className="grid-item md:col-span-1">
              <label
                htmlFor="currency"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Currency
              </label>
              <div className="relative mt-2">
                <select
                  id="currency"
                  {...register("currency")}
                  className="rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  defaultValue="PHP"
                >
                  <option value={"PHP"}>PHP</option>
                  <option value={"USD"}>USD</option>
                </select>
                <div className="absolute right-3 top-[14px]">
                  <DropDownArrow />
                </div>
              </div>
            </div>
            <div className="grid-item mt-4 md:mt-0 md:col-span-2">
              <label
                htmlFor="salary-range"
                className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
              >
                Salary Range <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-x-12 relative">
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("salaryFrom")}
                    id="salary-range"
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                  <span className="absolute text-indigo-dye top-[13px] ml-4">
                    to
                  </span>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("salaryTo")}
                    id="to"
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between py-10">
          <button
            type="button"
            className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setCurrentTab(1)}
          >
            Back
          </button>
          <button
            type="submit"
            className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Next
          </button>
        </div>
      </form>
      <AddProfModal
        open={modalOpen}
        onSave={() => setSuccessAlert(true)}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export default ProfDetailTab;
