"use client";

import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";

import CustomDatePicker from "@/components/CustomDatePicker";
import useGetEmployeeItems from "@/components/hooks/useGetEmployeeItems";

import { XCircleIcon } from "@heroicons/react/24/solid";
import SelectChevronDown from "@/svg/SelectChevronDown";

function MonitoringAndHazardInfo({
  control,
  register,
  handleSubmit,
  setSelectedTab,
  getValues,
  watch,
  errors,
  setError,
  clearErrors,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  getValues: any;
  watch: any;
  errors: any;
  setError: any;
  clearErrors: any;
}) {
  const onValid = (data: any) => {
    if (!data.conducting_internal_wem) {
      setError("conducting_internal_wem", {
        type: "manual",
        message: "Please select Conducting Internal WEM."
      });
      return;
    }
    if (!data.hazards_purpose_of_wem_request || (Array.isArray(data.hazards_purpose_of_wem_request) && data.hazards_purpose_of_wem_request.length === 0)) {
      setError("hazards_purpose_of_wem_request", {
        type: "manual",
        message: "Please select at least one Purpose of WEM Request (Hazards)."
      });
      return;
    }
    if (!data.chemical_hazards || (Array.isArray(data.chemical_hazards) && data.chemical_hazards.length === 0)) {
      setError("chemical_hazards", {
        type: "manual",
        message: "Please select at least one Chemical Hazard."
      });
      return;
    }
    if (!data.ventilation) {
      setError("ventilation", {
        type: "manual",
        message: "Please select at least one Ventilation."
      });
      return;
    }
    setSelectedTab(4);
  };

  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const { data: employeeData } = useGetEmployeeItems();

  // Watch chemical hazards for conditional rendering
  const chemicalHazards = watch("chemical_hazards");

  useEffect(() => {
    if (employeeData) {
      setEmployeeItems(employeeData);
    }
  }, [employeeData]);

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <div className="px-4 pt-4 pb-6">
        <div className={`hidden rounded-md bg-red-50 p-4 mb-3`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                You cannot proceed due to incomplete fields. Please review.
              </h3>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
          <div className="border-r-0 md:border-r md:border-slate-300 pr-0 md:pr-6 space-y-6 pl-0 md:pl-6">
            <div className="mb-2">
              <h1 className="text-lg font-semibold">Monitoring Capability</h1>
            </div>
            <div>
              <label
                htmlFor="wem_internal_monitoring_capability"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                WEM Internal Monitoring Capability
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("wem_internal_monitoring_capability", { required: true })}
                  id="wem_internal_monitoring_capability"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="wem_equipment_owned_by_company"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                WEM Equipment Owned by Company
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("wem_equipment_owned_by_company", { required: true })}
                  id="wem_equipment_owned_by_company"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="conducting_internal_wem"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Conducting Internal WEM
                <span className="text-red-600">*</span>
              </label>
              {errors.conducting_internal_wem && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.conducting_internal_wem.message || "Please select Conducting Internal WEM."}
                </p>
              )}
              <div className="relative mt-2">
                <div className="space-y-2">
                  <div>
                    <input
                      type="radio"
                      {...register("conducting_internal_wem", { required: true })}
                      id="conducting_internal_wem_yes"
                      value="yes"
                    />
                    <label htmlFor="conducting_internal_wem_yes" className="ml-2">
                      Yes
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      {...register("conducting_internal_wem", { required: true })}
                      id="conducting_internal_wem_no"
                      value="no"
                    />
                    <label htmlFor="conducting_internal_wem_no" className="ml-2">
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="date_of_internal_monitoring"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Date of Internal Monitoring
              </label>
              <div className="relative mt-2">
                <Controller
                  control={control}
                  name="date_of_internal_monitoring"
                  render={({ field }) => (
                    <CustomDatePicker
                      id="date_of_internal_monitoring"
                      placeholder={"mm/dd/yyyy"}
                      className={
                        "block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                      }
                      selected={field.value ? new Date(field.value) : null}
                      pickerOnChange={(date: any) => field.onChange(date)}
                      inputOnChange={(value: any) => field.onChange(value)}
                      required={true}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="pr-0 md:pr-6 space-y-6">
            <div className="mb-2">
              <h1 className="text-lg font-semibold">Hazards</h1>
            </div>
            <div>
              <div className="gap-6 mt-4">
                <div>
                  <label
                    htmlFor="hazards_purpose_of_wem_request"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Purpose of WEM Request
                    <span className="text-red-600">*</span>
                  </label>
                  {errors.hazards_purpose_of_wem_request && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.hazards_purpose_of_wem_request.message || "Please select at least one Purpose of WEM Request (Hazards)."}
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="relative mt-2 flex gap-2">
                      <input
                        type="checkbox"
                        {...register("hazards_purpose_of_wem_request", { required: true })}
                        id="hazards_purpose_of_wem_request"
                        value="noise"
                      />
                      <label htmlFor="purpose_of_wem_request" className="ml-2">
                        Noise
                      </label>
                    </div>
                    <div className="relative mt-2 flex gap-2">
                      <input
                        type="checkbox"
                        {...register("hazards_purpose_of_wem_request", { required: true })}
                        id="hazards_purpose_of_wem_request"
                        value="illumination"
                      />
                      <label htmlFor="purpose_of_wem_request" className="ml-2">
                        Illumination
                      </label>
                    </div>
                    <div className="relative mt-2 flex gap-2">
                      <input
                        type="checkbox"
                        {...register("hazards_purpose_of_wem_request", { required: true })}
                        id="hazards_purpose_of_wem_request"
                        value="vibration"
                      />
                      <label htmlFor="purpose_of_wem_request" className="ml-2">
                       Vibration
                      </label>
                    </div>
                    <div className="relative mt-2 flex gap-2">
                      <input
                        type="checkbox"
                        {...register("hazards_purpose_of_wem_request", { required: true })}
                        id="hazards_purpose_of_wem_request"
                        value="heat"
                      />
                      <label htmlFor="purpose_of_wem_request" className="ml-2">
                        Heat
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="chemical_hazards"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Chemical Hazards
                    <span className="text-red-600">*</span>
                  </label>
                  {errors.chemical_hazards && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.chemical_hazards.message || "Please select at least one Chemical Hazard."}
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="relative mt-2 flex gap-2">
                      <input
                        type="checkbox"
                        {...register("chemical_hazards", { required: true })}
                        id="dust"
                        value="Dust"
                      />
                      <label htmlFor="dust" className="ml-2">
                        Dust
                      </label>
                    </div>
                    <div className="relative mt-2 flex gap-2">
                      <input
                        type="checkbox"
                        {...register("chemical_hazards", { required: true })}
                        id="organic_solvents"
                        value="Organic Solvents"
                      />
                      <label htmlFor="organic_solvents" className="ml-2">
                        Organic Solvents
                      </label>
                    </div>
                    <div className="relative mt-2 flex gap-2">
                      <input
                        type="checkbox"
                        {...register("chemical_hazards", { required: true })}
                        id="heavy_metals"
                        value="Heavy Metals"
                      />
                      <label htmlFor="chemical_hazards" className="ml-2">
                       Heavy Metals
                      </label>
                    </div>
                    <div className="relative mt-2 flex gap-2">
                      <input
                        type="checkbox"
                        {...register("chemical_hazards", { required: true })}
                        id="acids"
                        value="Acids"
                      />
                      <label htmlFor="acids" className="ml-2">
                        Acids
                      </label>
                    </div>
                    <div className="relative mt-2 flex gap-2">
                      <input
                        type="checkbox"
                        {...register("chemical_hazards", { required: true })}
                        id="gases"
                        value="Gases"
                      />
                      <label htmlFor="gases" className="ml-2">
                       Gases
                      </label>
                    </div>
                    <div className="relative mt-2 flex gap-2">
                      <input
                        type="checkbox"
                        id="chemical_hazards_other"
                        value="Other"
                        checked={chemicalHazards && Array.isArray(chemicalHazards) && chemicalHazards.some((value: string) => value.startsWith("Other"))}
                        onChange={(e) => {
                          const currentValues = getValues("chemical_hazards") || [];
                          
                          if (e.target.checked) {
                            // Add "Other" if not already present
                            if (!currentValues.some((value: string) => value.startsWith("Other"))) {
                              const newValues = [...currentValues, "Other"];
                              const event = {
                                target: {
                                  name: "chemical_hazards",
                                  value: newValues
                                }
                              };
                              register("chemical_hazards").onChange(event);
                            }
                          } else {
                            // Remove "Other" if present
                            const newValues = currentValues.filter((value: string) => !value.startsWith("Other"));
                            const event = {
                              target: {
                                name: "chemical_hazards",
                                value: newValues
                              }
                            };
                            register("chemical_hazards").onChange(event);
                          }
                        }}
                      />
                      {/* Show label when unchecked, show input when checked */}
                      {(() => {
                        const hasOther = chemicalHazards?.some((value: string) => value.startsWith("Other"));
                        
                        if (hasOther) {
                          // Show input field when checked
                          const otherValue = chemicalHazards.find((value: string) => value.startsWith("Other"));
                          const specification = otherValue?.includes(":") ? otherValue.split(":")[1].trim() : "";
                          
                          return (
                            <input
                              type="text"
                              id="chemical_hazards_other_specify"
                              className="ml-2 w-40 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                              defaultValue={specification}
                              onChange={(e) => {
                                const currentValues = getValues("chemical_hazards") || [];
                                const otherIndex = currentValues.findIndex((value: string) => value.startsWith("Other"));
                                
                                if (otherIndex !== -1) {
                                  const newValues = [...currentValues];
                                  newValues[otherIndex] = `Other: ${e.target.value}`;
                                  register("chemical_hazards").onChange({
                                    target: { name: "chemical_hazards", value: newValues }
                                  });
                                }
                              }}
                            />
                          );
                        } else {
                          // Show label when unchecked
                          return (
                            <label htmlFor="chemical_hazards_other" className="ml-2 flex items-center">
                              Other
                            </label>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="ventilation"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ventilation
                <span className="text-red-600">*</span>
              </label>
              {errors.ventilation && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.ventilation.message || "Please select at least one Ventilation."}
                </p>
              )}
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("ventilation")}
                  id="ventilation"
                  value="General Ventilation"
                />
                <label htmlFor="general_ventilation" className="ml-2">
                  General Ventilation
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("ventilation")}
                  id="ventilation"
                  value="Local Exhaust Ventilation"
                />
                <label htmlFor="local_exhaust_ventilation" className="ml-2">
                  Local Exhaust Ventilation
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-between py-4 px-4">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(2)}
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

export default MonitoringAndHazardInfo;
