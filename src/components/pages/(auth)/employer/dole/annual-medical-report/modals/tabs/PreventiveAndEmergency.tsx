"use client";

import { useState, useEffect, useRef } from "react";
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
  const otherCheckboxARef = useRef<HTMLInputElement>(null);
  const otherCheckboxDRef = useRef<HTMLInputElement>(null);

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
    } else if (Array.isArray(d) && d.includes("other details") && !dOther) {
      setError("conduct_inspection_of_workplace_other_specification", {
        type: "manual",
        message: "Section (d): Please specify 'Other'."
      });
      hasError = true;
    }
    if (hasError) return;
    setSelectedTab(3);
  };

  // Watch form values
  const occupationalHealthServicesBy = watch("occupational_health_services_by");
  const occupationalHealthServicesByOther = watch("occupational_health_services_by_other_specification");
  const occupationalHealthServicesAsService = watch("occupational_health_services_as_a_service");
  const employerEngagesServices = watch("employer_engages_the_services_of");
  const conductInspection = watch("conduct_inspection_of_workplace");
  const conductInspectionOther = watch("conduct_inspection_of_workplace_other_specification");

  // Sync local state with form data
  useEffect(() => {
    if (Array.isArray(occupationalHealthServicesBy) && occupationalHealthServicesBy.includes("Other")) {
      setIsOtherCheckedA(true);
      // Manually set the checkbox checked state
      if (otherCheckboxARef.current) {
        otherCheckboxARef.current.checked = true;
      }
    } else if (occupationalHealthServicesByOther) {
      setIsOtherCheckedA(true);
      if (otherCheckboxARef.current) {
        otherCheckboxARef.current.checked = true;
      }
    } else {
      setIsOtherCheckedA(false);
      if (otherCheckboxARef.current) {
        otherCheckboxARef.current.checked = false;
      }
    }
  }, [occupationalHealthServicesBy, occupationalHealthServicesByOther]);

  useEffect(() => {
    if (Array.isArray(conductInspection) && conductInspection.includes("other details")) {
      setIsOtherCheckedD(true);
      // Manually set the checkbox checked state
      if (otherCheckboxDRef.current) {
        otherCheckboxDRef.current.checked = true;
      }
    } else if (conductInspectionOther) {
      setIsOtherCheckedD(true);
      if (otherCheckboxDRef.current) {
        otherCheckboxDRef.current.checked = true;
      }
    } else {
      setIsOtherCheckedD(false);
      if (otherCheckboxDRef.current) {
        otherCheckboxDRef.current.checked = false;
      }
    }
  }, [conductInspection, conductInspectionOther]);

  // Clear errors on change
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
                id="occupational_health_services_establishment"
                value="establishment/undertaking"
              />
              <label htmlFor="occupational_health_services_establishment" className="ml-1 text-sm md:text-base">
                the establishment/undertaking
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("occupational_health_services_by")}
                id="occupational_health_services_government"
                value="government authority/institution"
              />
              <label htmlFor="occupational_health_services_government" className="ml-2 text-sm md:text-base">
                government authority/institution
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("occupational_health_services_by")}
                id="occupational_health_services_by_other"
                value="Other"
                ref={otherCheckboxARef}
                onChange={(e) => {
                  setIsOtherCheckedA(e.target.checked);
                  // If unchecking and there's text, clear the text field
                  if (!e.target.checked && occupationalHealthServicesByOther) {
                    // This will be handled by the form reset or manual clearing
                  }
                }}
              />
              {!isOtherCheckedA ? (
                <label htmlFor="occupational_health_services_by_other" className="ml-2 text-sm md:text-base">
                  other bodies/groups/institution (specify)
                  <span className="text-gray-500"></span>
                </label>
              ) : (
                <div className="flex items-center gap-2 col-span-1 md:col-span-3">
                  <input
                    type="text"
                    {...register(
                      "occupational_health_services_by_other_specification",
                      {
                        required: isOtherCheckedA,
                      }
                    )}
                    placeholder="Please specify"
                    className="ml-2 border-b p-2 border-gray-300 w-56"
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
                id="occupational_health_services_solely"
                value="solely for the workers of the establishment/undertaking"
              />
              <label
                htmlFor="occupational_health_services_solely"
                className="ml-1 text-sm md:text-base"
              >
                solely for the workers of the establishment/undertaking
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("occupational_health_services_as_a_service")}
                id="occupational_health_services_common"
                value="common to a number of establishments/undertakings"
              />
              <label
                htmlFor="occupational_health_services_common"
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
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center mb-2">
              <div></div>
              <div className="text-sm font-medium text-gray-900 text-center">Address</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("employer_engages_the_services_of")}
                  id="employer_engages_osh_consultant"
                  value="Occupational Health Consultant (OSH Consultant)"
                />
                <label
                  htmlFor="employer_engages_osh_consultant"
                  className="text-sm md:text-base flex-1"
                >
                  Occupational Health Consultant (OSH Consultant)
                </label>
              </div>
              <input
                type="text"
                {...register("occupational_health_consultant_address")}
                className="border-b border-gray-300 px-2 py-1 w-full"
                placeholder="Enter address"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("employer_engages_the_services_of")}
                  id="employer_engages_physician"
                  value="Occupational health physician"
                />
                <label
                  htmlFor="employer_engages_physician"
                  className="text-sm md:text-base flex-1"
                >
                  Occupational health physician
                </label>
              </div>
              <input
                type="text"
                {...register("occupational_health_physician_address")}
                className="border-b border-gray-300 px-2 py-1 w-full"
                placeholder="Enter address"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("employer_engages_the_services_of")}
                  id="employer_engages_dentist"
                  value="Occupational health dentist"
                />
                <label
                  htmlFor="employer_engages_dentist"
                  className="text-sm md:text-base flex-1"
                >
                  Occupational health dentist
                </label>
              </div>
              <input
                type="text"
                {...register("occupational_health_dentist_address")}
                className="border-b border-gray-300 px-2 py-1 w-full"
                placeholder="Enter address"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("employer_engages_the_services_of")}
                  id="employer_engages_nurse"
                  value="Occupational health nurse"
                />
                <label
                  htmlFor="employer_engages_nurse"
                  className="text-sm md:text-base flex-1"
                >
                  Occupational health nurse
                </label>
              </div>
              <input
                type="text"
                {...register("occupational_health_nurse_address")}
                className="border-b border-gray-300 px-2 py-1 w-full"
                placeholder="Enter address"
              />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("conduct_inspection_of_workplace")}
                id="conduct_inspection_of_workplace"
                value="once every month"
              />
              <label htmlFor="conduct_inspection_of_workplace" className="ml-1 text-sm md:text-base">
                once every month
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("conduct_inspection_of_workplace")}
                id="conduct_inspection_of_workplace"
                value="once every three (3) months"
              />
              <label htmlFor="conduct_inspection_of_workplace" className="ml-2 text-sm md:text-base">
                once every three (3) months
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("conduct_inspection_of_workplace")}
                id="conduct_inspection_of_workplace"
                value="once every two (2) months"
              />
              <label htmlFor="conduct_inspection_of_workplace" className="ml-2 text-sm md:text-base">
                once every two (2) months
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("conduct_inspection_of_workplace")}
                id="conduct_inspection_of_workplace"
                value="once every six (6) months"
              />
              <label htmlFor="conduct_inspection_of_workplace" className="ml-2 text-sm md:text-base">
                once every six (6) months
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("conduct_inspection_of_workplace")}
                id="conduct_inspection_of_workplace_other"
                value="other details"
                ref={otherCheckboxDRef}
                onChange={(e) => {
                  setIsOtherCheckedD(e.target.checked);
                  // If unchecking and there's text, clear the text field
                  if (!e.target.checked && conductInspectionOther) {
                    // This will be handled by the form reset or manual clearing
                  }
                }}
              />
              {!isOtherCheckedD ? (
                <label htmlFor="conduct_inspection_of_workplace_other" className="ml-2 text-sm md:text-base">
                  other details
                  <span className="text-gray-500"></span>
                </label>
              ) : (
                <div className="flex items-center gap-2 col-span-1 md:col-span-3">
                  <input
                    type="text"
                    {...register(
                      "conduct_inspection_of_workplace_other_specification",
                      { required: isOtherCheckedD }
                    )}
                    placeholder="Please specify"
                    className="ml-2 border-b p-2 border-gray-300 w-56"
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
