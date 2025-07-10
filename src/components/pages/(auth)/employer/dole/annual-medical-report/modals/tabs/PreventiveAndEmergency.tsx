"use client";

import { useState, useEffect } from "react";
// eslint-disable-next-line react-hooks/exhaustive-deps

function PreventiveAndEmergency({
  register,
  handleSubmit,
  setSelectedTab,
  watch,
  errors,
  setError,
  clearErrors,
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  watch: any;
  errors: any;
  setError: any;
  clearErrors: any;
}) {
  const [isOtherCheckedA, setIsOtherCheckedA] = useState(false);
  const [isOtherCheckedD, setIsOtherCheckedD] = useState(false);

  // Helper to check if a checkbox group is filled
  const isChecked = (val: any) => Array.isArray(val) ? val.length > 0 : !!val;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const a = watch("occupational_health_services_by");
    const aOther = watch("occupational_health_services_by_other_specification");
    const b = watch("occupational_health_services_as_a_service");
    const c = watch("employer_engages_the_services_of");
    const d = watch("conduct_inspection_of_workplace");
    const dOther = watch("conduct_inspection_of_workplace_other_specification");

    let hasError = false;
    // a. validation
    if (!isChecked(a)) {
      setError("occupational_health_services_by", {
        type: "manual",
        message: "Please select at least one option."
      });
      hasError = true;
    } else if (Array.isArray(a) && a.includes("Other") && !aOther) {
      setError("occupational_health_services_by_other_specification", {
        type: "manual",
        message: "Please specify 'Other'."
      });
      hasError = true;
    }
    // b. validation
    if (!isChecked(b)) {
      setError("occupational_health_services_as_a_service", {
        type: "manual",
        message: "Please select at least one option."
      });
      hasError = true;
    }
    // c. validation
    if (!isChecked(c)) {
      setError("employer_engages_the_services_of", {
        type: "manual",
        message: "Please select at least one option."
      });
      hasError = true;
    }
    // d. validation
    if (!isChecked(d)) {
      setError("conduct_inspection_of_workplace", {
        type: "manual",
        message: "Please select at least one option."
      });
      hasError = true;
    } else if (Array.isArray(d) && d.includes("Other") && !dOther) {
      setError("conduct_inspection_of_workplace_other_specification", {
        type: "manual",
        message: "Section (d): Please specify 'Other'."
      });
      hasError = true;
    }
    if (hasError) return;
    setSelectedTab(3);
  };

  // Clear errors on change
  const occupationalHealthServicesBy = watch("occupational_health_services_by");
  const occupationalHealthServicesByOther = watch("occupational_health_services_by_other_specification");
  const occupationalHealthServicesAsService = watch("occupational_health_services_as_a_service");
  const employerEngagesServices = watch("employer_engages_the_services_of");
  const conductInspection = watch("conduct_inspection_of_workplace");
  const conductInspectionOther = watch("conduct_inspection_of_workplace_other_specification");

  useEffect(() => {
    if (isChecked(occupationalHealthServicesBy)) {
      clearErrors("occupational_health_services_by");
    }
  }, [occupationalHealthServicesBy, clearErrors]);
  useEffect(() => {
    if (occupationalHealthServicesByOther) {
      clearErrors("occupational_health_services_by_other_specification");
    }
  }, [occupationalHealthServicesByOther, clearErrors]);
  useEffect(() => {
    if (isChecked(occupationalHealthServicesAsService)) {
      clearErrors("occupational_health_services_as_a_service");
    }
  }, [occupationalHealthServicesAsService, clearErrors]);
  useEffect(() => {
    if (isChecked(employerEngagesServices)) {
      clearErrors("employer_engages_the_services_of");
    }
  }, [employerEngagesServices, clearErrors]);
  useEffect(() => {
    if (isChecked(conductInspection)) {
      clearErrors("conduct_inspection_of_workplace");
    }
  }, [conductInspection, clearErrors]);
  useEffect(() => {
    if (conductInspectionOther) {
      clearErrors("conduct_inspection_of_workplace_other_specification");
    }
  }, [conductInspectionOther, clearErrors]);

  return (
    <form onSubmit={onSubmit}>
      <div className="gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label
            htmlFor="occupational_health_services_by"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            a. Occupational health services is organized/provided by:
            <span className="text-red-600">*</span>
          </label>
          {errors.occupational_health_services_by && (
            <p className="text-xs text-red-600 mt-1">
              {errors.occupational_health_services_by.message || "Section (a) is required."}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("occupational_health_services_by")}
                id="occupational_health_services_by"
                value="establishment/undertaking"
              />
              <label htmlFor="occupational_health_services_by" className="ml-1 text-sm md:text-base">
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
              <label htmlFor="occupational_health_services_by" className="ml-2 text-sm md:text-base">
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
              <label htmlFor="occupational_health_services_by" className="ml-2 text-sm md:text-base">
                other bodies/groups/institution (specify)
                <span className="text-gray-500"></span>
              </label>
            </div>
            {isOtherCheckedA && (
              <div className="relative mt-2 flex items-center gap-2 col-span-1 md:col-span-3">
                <input
                  type="text"
                  {...register(
                    "occupational_health_services_by_other_specification",
                    {
                      required: isOtherCheckedA,
                    }
                  )}
                  placeholder="Please specify"
                  className="border-b p-2 border-gray-300 w-full"
                />
                {errors.occupational_health_services_by_other_specification && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.occupational_health_services_by_other_specification.message || "Section (a): Please specify 'Other'."}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label
            htmlFor="occupational_health_services_as_a_service"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            b. Occupational health services as described above, is
            organized/provided as a Service:
            <span className="text-red-600">*</span>
          </label>
          {errors.occupational_health_services_as_a_service && (
            <p className="text-xs text-red-600 mt-1">
              {errors.occupational_health_services_as_a_service.message || "Section (b) is required."}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("occupational_health_services_as_a_service")}
                id="occupational_health_services_as_a_service"
                value="solely for the workers of the establishment/undertaking"
              />
              <label
                htmlFor="occupational_health_services_as_a_service"
                className="ml-1 text-sm md:text-base"
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
                className="ml-2 text-sm md:text-base"
              >
                common to a number of establishments/undertakings
                <span className="text-gray-500"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label
            htmlFor="employer_engages_the_services_of"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            c. The employer engages the services of:
            <span className="text-red-600">*</span>
          </label>
          {errors.employer_engages_the_services_of && (
            <p className="text-xs text-red-600 mt-1">
              {errors.employer_engages_the_services_of.message || "Section (c) is required."}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("employer_engages_the_services_of")}
                id="employer_engages_the_services_of"
                value="Occupational Health Consultant (OSH Consultant)"
              />
              <label
                htmlFor="employer_engages_the_services_of"
                className="ml-1 text-sm md:text-base"
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
                className="ml-2 text-sm md:text-base"
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
                className="ml-2 text-sm md:text-base"
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
                className="ml-2 text-sm md:text-base"
              >
                Occupational health nurse
                <span className="text-gray-500"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label
            htmlFor="conduct_inspection_of_workplace"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            d. The occupational health physician/practitioner/nurse/personnel
            conducts an inspection of the workplace:
            <span className="text-red-600">*</span>
          </label>
          {errors.conduct_inspection_of_workplace && (
            <p className="text-xs text-red-600 mt-1">
              {errors.conduct_inspection_of_workplace.message || "Section (d) is required."}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("conduct_inspection_of_workplace")}
                id="conduct_inspection_of_workplace"
                value="the establishment/undertaking"
              />
              <label htmlFor="conduct_inspection_of_workplace" className="ml-1 text-sm md:text-base">
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
              <label htmlFor="conduct_inspection_of_workplace" className="ml-2 text-sm md:text-base">
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
              <label htmlFor="conduct_inspection_of_workplace" className="ml-2 text-sm md:text-base">
                other bodies/groups/institution (specify)
                <span className="text-gray-500"></span>
              </label>
            </div>
            {isOtherCheckedD && (
              <div className="relative mt-2 flex items-center gap-2 col-span-1 md:col-span-3">
                <input
                  type="text"
                  {...register(
                    "conduct_inspection_of_workplace_other_specification",
                    { required: isOtherCheckedD }
                  )}
                  placeholder="Please specify"
                  className="border-b p-2 border-gray-300 w-full"
                />
                {errors.conduct_inspection_of_workplace_other_specification && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.conduct_inspection_of_workplace_other_specification.message || "Section (d): Please specify 'Other'."}
                  </p>
                )}
              </div>
            )}
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
