"use client";

import {
  Dispatch,
  Fragment,
  useRef,
  useEffect,
  useState,
  useMemo,
} from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import CustomDatePicker from "@/components/CustomDatePicker";
import useGetEmployeeItems from "@/components/hooks/useGetEmployeeItems";

import { XCircleIcon } from "@heroicons/react/24/solid";
import SelectChevronDown from "@/svg/SelectChevronDown";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { QUILL_FORMATS, QUILL_MODULES } from "@/helpers/constants";

export default function DiscussionDetails({
  control,
  register,
  handleSubmit,
  setValue,
  watch,
  setSelectedTab,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setValue: any;
  watch: any;
  setSelectedTab: any;
}) {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
  const onSubmit = handleSubmit(() => {
    setSelectedTab(3);
  });

  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const { data: employeeData } = useGetEmployeeItems();

  useEffect(() => {
    if (employeeData) {
      setEmployeeItems(employeeData);
    }
  }, [employeeData]);

  return (
    <form onSubmit={onSubmit}>
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
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Discussion Details</h1>
        </div>
        <div className="sm:col-span-4 mt-4">
          <div className="mt-2 h-72 mb-12">
            <textarea
              rows={4}
              {...register("message", { required: true })}
              id="message"
              hidden
            />
            <ReactQuill
              onChange={(value) => setValue("message", value)}
              formats={QUILL_FORMATS}
              modules={QUILL_MODULES}
              style={{ height: "100%", padding: "5px 8px !important" }}
              value={watch("message")}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="py-4 px-4 text-right">
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
