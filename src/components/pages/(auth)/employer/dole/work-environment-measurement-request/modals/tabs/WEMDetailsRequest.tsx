"use client";

import { Controller } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import CustomDatePicker from "@/components/CustomDatePicker";

import { XCircleIcon } from "@heroicons/react/24/solid";

function WEMDetailsRequest({
  control,
  register,
  handleSubmit,
  setSelectedTab,
  getValues,
  watch,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  getValues: any;
  watch: any;
}) {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const data = getValues();
    // Validate required fields
    if (!data.purpose_of_wem_request || (Array.isArray(data.purpose_of_wem_request) && data.purpose_of_wem_request.length === 0)) {
      toast.custom(() => <CustomToast message="Please select at least one Purpose of WEM Request." type="error" />);
      const el = document.getElementById("purpose_of_wem_request");
      if (el) el.focus();
      return;
    }
    if (!data.wem_conducted_by || (Array.isArray(data.wem_conducted_by) && data.wem_conducted_by.length === 0)) {
      toast.custom(() => <CustomToast message="Please select at least one WEM Conducted By option." type="error" />);
      const el = document.getElementById("wem_conducted_by");
      if (el) el.focus();
      return;
    }
    if (!data.last_wem_date || data.last_wem_date === "") {
      toast.custom(() => <CustomToast message="Please select the Last WEM Date." type="error" />);
      const el = document.getElementById("last_wem_date");
      if (el) el.focus();
      return;
    }
    setSelectedTab(3);
  };

  return (
    <form onSubmit={handleNext}>
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
        <div className="mt-4 pl-6">
          <h1 className="text-lg font-semibold">WEM Details Request</h1>
        </div>
        <div className="gap-6 mt-4 pl-6">
          <div>
            <label
              htmlFor="purpose_of_wem_request"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Purpose of WEM Request
              <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("purpose_of_wem_request", { required: true })}
                  id="purpose_of_wem_request"
                  value="Workplace Improvement"
                />
                <label htmlFor="purpose_of_wem_request" className="ml-2">
                  Workplace Improvement
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("purpose_of_wem_request", { required: true })}
                  id="purpose_of_wem_request"
                  value="OSHS Compliance"
                />
                <label htmlFor="purpose_of_wem_request" className="ml-2">
                  OSHS Compliance
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("purpose_of_wem_request", { required: true })}
                  id="purpose_of_wem_request"
                  value="Client/Customer Requirement"
                />
                <label htmlFor="purpose_of_wem_request" className="ml-2">
                  Client/Customer Requirement
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("purpose_of_wem_request", { required: true })}
                  id="purpose_of_wem_request"
                  value="ISO Compliance"
                />
                <label htmlFor="purpose_of_wem_request" className="ml-2">
                  ISO Compliance
                </label>
              </div>
              <div className="relative mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("purpose_of_wem_request", { required: true })}
                  id="purpose_of_wem_request"
                  value="Required by Labor Inspector"
                />
                <label htmlFor="required_by_labor_inspector" className="ml-2">
                  Required by Labor Inspector
                  <span className="text-gray-500">
                    (attached notice of inspection report)
                  </span>
                </label>
              </div>
              <div className="relative flex gap-2 mt-6">
                <input
                  type="checkbox"
                  {...register("purpose_of_wem_request", { required: true })}
                  id="purpose_of_wem_request"
                  value="Others"
                />
                <label htmlFor="required_by_labor_inspector" className="ml-2">
                  Others
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-6 mt-4 pl-6">
          <div>
            <label
              htmlFor="wem_conducted_by"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              WEM Conducted By
              <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("wem_conducted_by", { required: true })}
                  id="wem_conducted_by"
                  value="OSHC"
                />
                <label htmlFor="wem_conducted_by" className="ml-2">
                  OSHC
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("wem_conducted_by", { required: true })}
                  id="wem_conducted_by"
                  value="None (New Client)"
                />
                <label htmlFor="wem_conducted_by" className="ml-2">
                  None (New Client)
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("wem_conducted_by", { required: true })}
                  id="wem_conducted_by"
                  value="Accredited Wem Officer"
                />
                <label htmlFor="wem_conducted_by" className="ml-2">
                  Accredited Wem Officer
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4 pl-6">
          <div>
            <label
              htmlFor="last_wem_date"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Last WEM Date
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <Controller
                control={control}
                name="last_wem_date"
                render={({ field }) => (
                  <CustomDatePicker
                    id="last_wem_date"
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
      </div>
      <hr />
      <div className="flex justify-between py-4 px-4">
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

export default WEMDetailsRequest;
