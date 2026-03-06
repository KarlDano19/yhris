"use client";

import {
  useMemo,
} from "react";

import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";


import { QUILL_FORMATS, QUILL_MODULES } from "@/helpers/constants";


export default function DiscussionDetails({
  control,
  register,
  setValue,
  watch,
  setSelectedTab,
  errors,
  setError,
  clearErrors,
}: {
  control: any;
  register: any;
  setValue: any;
  watch: any;
  setSelectedTab: any;
  errors: any;
  setError: any;
  clearErrors: any;
}) {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const detailsValue = watch("details_of_meeting");
    const isEmpty = !detailsValue || detailsValue === "" || detailsValue === "<p><br></p>";
    if (isEmpty) {
      setError("details_of_meeting", { type: "manual", message: "Discussion Details is required." });
      return;
    }
    clearErrors("details_of_meeting");
    setSelectedTab(3);
  };


  return (
    <form onSubmit={onSubmit}>
      <div className="px-4 pt-4 pb-16 md:pb-6">
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Discussion Details<span className="text-red-600">*</span>
          </h1>
        </div>
        <div className="sm:col-span-4 mt-4">
          <div className="mt-2 h-72 mb-12">
            <textarea
              rows={4}
              {...register("details_of_meeting", { required: true })}
              id="details_of_meeting"
              hidden
            />
            <ReactQuill
              onChange={(value) => setValue("details_of_meeting", value)}
              formats={QUILL_FORMATS}
              modules={QUILL_MODULES}
              style={{ height: "100%", padding: "5px 8px !important" }}
              value={watch("details_of_meeting")}
            />
          </div>
          {errors?.details_of_meeting && <p className="text-xs text-red-600 mt-1">Discussion Details is required.</p>}
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
