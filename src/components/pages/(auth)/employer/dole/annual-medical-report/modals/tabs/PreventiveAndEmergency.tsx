"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import CustomToast from "@/components/CustomToast";

function PreventiveAndEmergency({
  register,
  handleSubmit,
  setSelectedTab,
  watch,
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  watch: any;
}) {
  const [isOtherCheckedA, setIsOtherCheckedA] = useState(false);
  const [isOtherCheckedD, setIsOtherCheckedD] = useState(false);

  const onSubmit = handleSubmit(() => {
    // Use watch to get current values
    const a = watch("occupational_health_services_by");
    const aOther = watch("occupational_health_services_by_other_specification");
    const b = watch("occupational_health_services_as_a_service");
    const c = watch("employer_engages_the_services_of");
    const d = watch("conduct_inspection_of_workplace");
    const dOther = watch("conduct_inspection_of_workplace_other_specification");

    // Helper to check if a checkbox group is filled
    const isChecked = (val: any) => Array.isArray(val) ? val.length > 0 : !!val;

    // a. validation
    if (!isChecked(a)) {
      toast.custom(() => <CustomToast message="Section (a) is required." type="error" />);
      return;
    }
    if (Array.isArray(a) && a.includes("Other") && !aOther) {
      toast.custom(() => <CustomToast message="Section (a): Please specify 'Other'." type="error" />);
      return;
    }
    // b. validation
    if (!isChecked(b)) {
      toast.custom(() => <CustomToast message="Section (b) is required." type="error" />);
      return;
    }
    // c. validation
    if (!isChecked(c)) {
      toast.custom(() => <CustomToast message="Section (c) is required." type="error" />);
      return;
    }
    // d. validation
    if (!isChecked(d)) {
      toast.custom(() => <CustomToast message="Section (d) is required." type="error" />);
      return;
    }
    if (Array.isArray(d) && d.includes("Other") && !dOther) {
      toast.custom(() => <CustomToast message="Section (d): Please specify 'Other'." type="error" />);
      return;
    }
    setSelectedTab(3);
  });
  return (
    <form onSubmit={onSubmit}>
      <div className="gap-6 mt-4 pl-6 mb-6">
        <div>
          <label
            htmlFor="occupational_health_services_by"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            a. Occupational health services is organized/provided by:
            <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("occupational_health_services_by")}
                id="occupational_health_services_by"
                value="establishment/undertaking"
              />
              <label htmlFor="occupational_health_services_by" className="ml-1">
                the establishment/undertaking
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("occupational_health_services_by")}
                id="occupational_health_services_by"
                value="government authority/institution"
              />
              <label htmlFor="occupational_health_services_by" className="ml-2">
                government authority/institution
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("occupational_health_services_by")}
                id="occupational_health_services_by"
                value="Other"
                onChange={(e) => setIsOtherCheckedA(e.target.checked)}
              />
              <label htmlFor="occupational_health_services_by" className="ml-2">
                other bodies/groups/institution (specify)
                <span className="text-gray-500"></span>
              </label>
            </div>
            {isOtherCheckedA && (
              <div className="relative mt-2 flex items-center gap-2 col-span-3">
                <input
                  type="text"
                  {...register(
                    "occupational_health_services_by_other_specification",
                    {
                      required: isOtherCheckedA,
                    }
                  )}
                  placeholder="Please specify"
                  className="border-b p-2 border-gray-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 pl-6 mb-6">
        <div>
          <label
            htmlFor="occupational_health_services_as_a_service"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            b. Occupational health services as described above, is
            organized/provided as a Service:
            <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("occupational_health_services_as_a_service")}
                id="occupational_health_services_as_a_service"
                value="solely for the workers of the establishment/undertaking"
              />
              <label
                htmlFor="occupational_health_services_as_a_service"
                className="ml-1"
              >
                solely for the workers of the establishment/undertaking
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("occupational_health_services_as_a_service")}
                id="occupational_health_services_as_a_service"
                value="common to a number of establishments/undertakings"
              />
              <label
                htmlFor="occupational_health_services_as_a_service"
                className="ml-2"
              >
                common to a number of establishments/undertakings
                <span className="text-gray-500"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 pl-6 mb-6">
        <div>
          <label
            htmlFor="employer_engages_the_services_of"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            c. The employer engages the services of:
            <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("employer_engages_the_services_of")}
                id="employer_engages_the_services_of"
                value="Occupational Health Consultant (OSH Consultant)"
              />
              <label
                htmlFor="employer_engages_the_services_of"
                className="ml-1"
              >
                Occupational Health Consultant (OSH Consultant)
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("employer_engages_the_services_of")}
                id="employer_engages_the_services_of"
                value="Occupational health physician"
              />
              <label
                htmlFor="employer_engages_the_services_of"
                className="ml-2"
              >
                Occupational health physician
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("employer_engages_the_services_of")}
                id="employer_engages_the_services_of"
                value="Occupational health dentist"
              />
              <label
                htmlFor="employer_engages_the_services_of"
                className="ml-2"
              >
                Occupational health dentist
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("employer_engages_the_services_of")}
                id="employer_engages_the_services_of"
                value="Occupational health nurse"
              />
              <label
                htmlFor="employer_engages_the_services_of"
                className="ml-2"
              >
                Occupational health nurse
                <span className="text-gray-500"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 pl-6 mb-6">
        <div>
          <label
            htmlFor="conduct_inspection_of_workplace"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            d. The occupational health physician/practitioner/nurse/personnel
            conducts an inspection of the workplace:
            <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("conduct_inspection_of_workplace")}
                id="conduct_inspection_of_workplace"
                value="the establishment/undertaking"
              />
              <label htmlFor="conduct_inspection_of_workplace" className="ml-1">
                the establishment/undertaking
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("conduct_inspection_of_workplace")}
                id="conduct_inspection_of_workplace"
                value="government authority/institution"
              />
              <label htmlFor="conduct_inspection_of_workplace" className="ml-2">
                government authority/institution
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("conduct_inspection_of_workplace")}
                id="conduct_inspection_of_workplace"
                value="the establishment/undertaking"
              />
              <label htmlFor="conduct_inspection_of_workplace" className="ml-1">
                the establishment/undertaking
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("conduct_inspection_of_workplace")}
                id="conduct_inspection_of_workplace"
                value="government authority/institution"
              />
              <label htmlFor="conduct_inspection_of_workplace" className="ml-2">
                government authority/institution
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("conduct_inspection_of_workplace")}
                id="conduct_inspection_of_workplace"
                value="Other"
                onChange={(e) => setIsOtherCheckedD(e.target.checked)}
              />
              <label htmlFor="conduct_inspection_of_workplace" className="ml-2">
                other bodies/groups/institution (specify)
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              {isOtherCheckedD && (
                <div className="relative mt-2 flex items-center gap-2 col-span-3">
                  <input
                    type="text"
                    {...register(
                      "conduct_inspection_of_workplace_other_specification",
                      { required: isOtherCheckedD }
                    )}
                    placeholder="Please specify"
                    className="border-b p-2 border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="py-4 px-4 flex justify-between">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(1)}
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
  );
}

export default PreventiveAndEmergency;
