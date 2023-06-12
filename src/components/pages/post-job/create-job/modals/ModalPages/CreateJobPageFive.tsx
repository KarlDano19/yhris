import { Dispatch, useState } from "react";

export default function CreateJobPageFive({
  watch,
  setValue,
  register,
  setPageNumber,
  getValues,
  isRangeBenefitsAdded,
}: {
  watch: any;
  setValue: any;
  register: any;
  setPageNumber: Dispatch<number>;
  getValues: any;
  isRangeBenefitsAdded: boolean;
}) {
  const [manualInputFocus, setManualInputFocus] = useState(false);
  const [fileProps, setFileProps] = useState<{
    fileName?: string;
    fileSize?: number;
  }>({});

  return (
    <>
      <div className="px-4 pb-6">
        {/* start */}
        <div className="sm:col-span-4 mt-4">
          <label
            htmlFor="country"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Post as
            <span className="text-red-600">*</span>
          </label>
          {!getValues("postAs") && (
            <span className="text-red-600 text-sm mt-2">
              This field is required
            </span>
          )}
          <div className={`flex flex-col space-y-2 ml-2 mt-2 ${ manualInputFocus ? "border-2 border-blue-700" : ""}`}>
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                className="form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900"
                value="text"
                name="radioGroup"
                {...register("postAs", { required: true })}
                onClick={() => setManualInputFocus(false)}
              />
              <span className="ml-2 text-sm font-medium leading-6 text-gray-900">
                Text
              </span>
            </label>

            <label className="inline-flex items-start">
              <input
                type="radio"
                className="form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900"
                value="poster"
                name="radioGroup"
                {...register("postAs", { required: true })}
                onClick={() => setManualInputFocus(false)}
              />
              <span className="ml-2 text-sm font-medium leading-6 text-gray-900">
                Poster
                <span className="block mt-0 font-normal text-gray-400">
                  Please make sure that you have set-up your hiring poster
                  template in the brand kit.
                </span>
              </span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900"
                value="upload"
                name="radioGroup"
                {...register("postAs", { required: true })}
                onClick={() => setManualInputFocus(false)}
              />
              <span className="ml-2 text-sm font-medium leading-6 text-gray-900">
                Upload
              </span>
            </label>
            <label
            htmlFor="postAsUpload"
            className="block ml-7 text-sm font-normal text-gray-400 border w-fit p-2.5 border-gray-400 rounded-md cursor-pointer"
          >
            Upload Jpeg or PNG...
          </label>
          {fileProps.fileName && (
            <div className="ml-9 mt-2">
              <p className="block text-sm font-medium leading-6 text-gray-900">
                <span>{fileProps.fileName}</span> /
                <span className="ml-1">{`${(fileProps?.fileSize
                  ? fileProps.fileSize / 1024 / 1024
                  : 0
                ).toFixed(2)} MB`}</span>
              </p>
              <button
                type="button"
                className="underline text-savoy-blue text-sm"
                onClick={() => {
                  setValue("postAsUpload", null);
                  setFileProps({});
                }}
              >
                Remove File
              </button>
            </div>
          )}
          <div className="mt-2">
            <input
              id="postAsUpload"
              {...register("postAsUpload", {
                required: false,
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
      </div>
      <hr />
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
          onClick={() => {
            const postAs = getValues("postAs");
            if ((postAs && postAs !== "upload") || (postAs === "upload" && fileProps.fileName)) {
              setPageNumber(6);
            } else {
              setManualInputFocus(true);
            }
          }}
        >
          Next
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => {
            if(isRangeBenefitsAdded) {
              setPageNumber(3)
            } else {
              setPageNumber(4)
            }
          }}
        >
          Back
        </button>
      </div>
    </>
  );
}
