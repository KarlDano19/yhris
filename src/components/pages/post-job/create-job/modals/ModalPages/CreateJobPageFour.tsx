import { Dispatch, useState } from "react";

import SelectChevronDown from "@/svg/SelectChevronDownDummy";
import "react-quill/dist/quill.snow.css";
import { QUILL_FORMATS, QUILL_MODULES } from "@/helpers/constants";
import dynamic from "next/dynamic";

export default function CreateJobPageFour({
  setValue,
  getValues,
  register,
  setPageNumber,
}: {
  register: any;
  setValue: any;
  getValues: any;
  setPageNumber: Dispatch<number>;
}) {
  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
  const [fileProps, setFileProps] = useState<{
    fileName?: string;
    fileSize?: number;
  }>({});
  return (
    <>
      <div className="px-4 pb-6">
        <div className="sm:col-span-4 mt-4">
          <div>
            <label
              htmlFor="jobDescriptionFile"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Job Description
              <span className="text-red-600">*</span>
            </label>
            <p className="block text-sm leading-6 text-gray-400">
              Describe the responsibilities of this job, required work
              experience, skills, or education.
            </p>
            <div className="flex items-center">
              <label
                htmlFor="jobDescriptionFile"
                className="block mr-1 text-sm font-semibold leading-6 text-savoy-blue underline cursor-pointer"
              >
                Upload a PDF or DOCX
              </label>
              <label className="block text-sm font-medium leading-6 text-savoy-blue">
                or fill in the box below.
              </label>
            </div>
            {fileProps.fileName && (
              <>
                <p className="block text-sm font-medium leading-6 text-gray-900">
                  <span>{fileProps.fileName}</span> /
                  <span className="ml-1">{`${(fileProps?.fileSize
                    ? fileProps.fileSize / 1024 / 1024
                    : 0
                  ).toFixed(2)} MB`}</span>
                </p>
                <button
                  type="button"
                  className="underline text-savoy-blue"
                  onClick={() => {
                    setValue("jobDescriptionFile", null);
                    setFileProps({});
                  }}
                >
                  Remove File
                </button>
              </>
            )}
            <div className="mt-2">
              <input
                id="jobDescriptionFile"
                {...register("jobDescriptionFile", {
                  required: true,
                })}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fileName = e.target.files?.[0].name;
                    const fileSize = e.target.files?.[0].size;

                    setFileProps({
                      fileName: fileName,
                      fileSize: fileSize,
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="sm:col-span-4 mt-4">
          <div className="mt-2 h-72 mb-12">
            <textarea
              rows={4}
              {...register("jobDescription", { required: true })}
              id="jobDescription"
              hidden
            />
            <ReactQuill
              onChange={(value) => setValue("jobDescription", value)}
              formats={QUILL_FORMATS}
              modules={QUILL_MODULES}
              style={{ height: "100%" }}
              defaultValue={getValues("jobDescription")}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
          onClick={() => setPageNumber(5)}
          // onClick={() => onSubmit()}
        >
          Next
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => setPageNumber(3)}
        >
          Back
        </button>
      </div>
    </>
  );
}
