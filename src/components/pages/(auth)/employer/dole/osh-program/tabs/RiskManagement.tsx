"use client";

import { useFieldArray } from "react-hook-form";
import { MinusIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";

export default function RiskManagement({
  control,
  register,
  validationMessage,
}: {
  control: any;
  register: any;
  validationMessage?: string;
}) {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "emergency_and_disaster_preparedness",
  });

  // Initialize with an empty row if there are no fields
  useEffect(() => {
    if (fields.length === 0) {
      handleAddNewLine();
    }
  }, []);

  const handleAddNewLine = () => {
    append({
      task: "",
      hazard_identified: "",
      risk_description: "",
      priority: "",
      control_measures: ""
    });
  };

  return (
    <form>
      <div className="px-4 pt-4 pb-6">
        <div className={`${validationMessage ? '' : 'hidden'} rounded-md bg-red-50 p-4 mb-3`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {validationMessage || "You cannot proceed due to incomplete fields. Please review."}
              </h3>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Emergency and Disaster Preparedness
          </label>
        </div>
        <div className="mt-4 w-full">
          <table className="min-w-full divide-y divide-gray-300 text-center">
            <thead className="bg-[#D8E6FB] rounded-lg border-2 border-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                >
                  Task
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                >
                  Hazard Identified
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                >
                  Risk Description
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                >
                  Priority
                  <h1 className="text-sm text-gray-500 mt-2">
                    likelihood of injury and illness to occur (low, medium, high)
                  </h1>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                >
                  Control Measures
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                ></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fields.map((item, index) => (
                <tr
                  key={item.id}
                  className="cursor-pointer border-b border-gray-200"
                >
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                    <input
                      type="text"
                      {...register(
                        `emergency_and_disaster_preparedness.${index}.task`,
                        { required: true }
                      )}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                    <input
                      type="text"
                      {...register(
                        `emergency_and_disaster_preparedness.${index}.hazard_identified`,
                        { required: true }
                      )}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                    <input
                      type="text"
                      {...register(
                        `emergency_and_disaster_preparedness.${index}.risk_description`,
                        { required: true }
                      )}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                    <input
                      type="text"
                      {...register(
                        `emergency_and_disaster_preparedness.${index}.priority`,
                        { required: true }
                      )}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                    <input
                      type="text"
                      {...register(
                        `emergency_and_disaster_preparedness.${index}.control_measures`,
                        { required: true }
                      )}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        className="flex justify-center items-center rounded-md bg-red-600 p-2 text-white"
                        onClick={() => remove(index)}
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-start mt-4">
          <button
            type="button"
            onClick={handleAddNewLine}
            className="bg-savoy-blue text-white px-4 py-2 rounded-md"
          >
            Add new line
          </button>
        </div>
      </div>
    </form>
  );
}
