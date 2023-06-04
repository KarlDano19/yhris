import { Dispatch, useEffect, useState } from "react";
import {
  LinkedIn,
  Facebook,
  Instagram,
  Twitter,
  Indeed,
} from "@/svg/SocialMedia";

export default function CreateJobPageSeven({
  watch,
  setValue,
  register,
  setPageNumber,
  setIsCreateJobPageEightModalOpen,
  setParentOpen,
  onSubmit,
}: {
  watch: any;
  setValue: any;
  register: any;
  setPageNumber: Dispatch<number>;
  setIsCreateJobPageEightModalOpen: Dispatch<boolean>;
  setParentOpen: Dispatch<boolean>;
  onSubmit: any;
}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [manualInputFocus, setManualInputFocus] = useState(false);

  const handleRadioChange = (value: string) => {
    setSelectedOptions((prevOptions) => {
      // Check if the value already exists in the array
      if (prevOptions.includes(value)) {
        // Deselect the option by removing it from the array
        return prevOptions.filter((option) => option !== value);
      } else {
        // Select the option by adding it to the array
        return [...prevOptions, value];
      }
    });
  };

  useEffect(() => {
    if (selectedOptions.length > 0) {
      setValue("postIn", selectedOptions);
    }
  }, [selectedOptions, setValue]);
  return (
    <>
      <div className="px-4 pb-6">
        {/* start */}
        <div className="sm:col-span-4 mt-4">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Post in (you may select multiple platforms):
          </label>
          <div className={`flex flex-col space-y-2 ml-2 mt-2 ${ manualInputFocus ? "border-2 border-blue-700" : ""}`}>
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                className="form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900"
                name="linkedIn"
                onChange={() => handleRadioChange("LinkedIn")}
                onClick={() => setManualInputFocus(false)}
              />
              <span className="flex items-center ml-2 text-sm font-medium leading-6 text-gray-900">
                <LinkedIn /> <span className="ml-2">LinkedIn</span>
              </span>
            </label>

            <label className="inline-flex items-start mr-4">
              <input
                type="radio"
                className="form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900"
                name="facebook"
                onChange={() => handleRadioChange("Facebook")}
                onClick={() => setManualInputFocus(false)}
              />
              <span className="flex items-center ml-2 text-sm font-medium leading-6 text-gray-900">
                <Facebook />
                <span className="ml-2">Facebook</span>
              </span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900"
                name="instagram"
                onChange={() => handleRadioChange("Instagram")}
                onClick={() => setManualInputFocus(false)}
              />
              <span className="flex items-center ml-2 text-sm font-medium leading-6 text-gray-900">
                <Instagram />
                <span className="ml-2">Instagram</span>
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900"
                name="twitter"
                onChange={() => handleRadioChange("Twitter")}
                onClick={() => setManualInputFocus(false)}
              />
              <span className="flex items-center ml-2 text-sm font-medium leading-6 text-gray-900">
                <Twitter />
                <span className="ml-2">Twitter</span>
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900"
                name="indeed"
                onChange={() => handleRadioChange("Indeed")}
                onClick={() => setManualInputFocus(false)}
              />
              <span className="flex items-center ml-2 text-sm font-medium leading-6 text-gray-900">
                <Indeed />
                <span className="ml-2">Indeed</span>
              </span>
            </label>
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
          onClick={() => {
            if(selectedOptions.length > 0) {
              setParentOpen(false);
              setIsCreateJobPageEightModalOpen(true);
              onSubmit();
            } else {
              setManualInputFocus(true);
            }
          }}
        >
          Share
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => setPageNumber(6)}
        >
          Back
        </button>
      </div>
    </>
  );
}
