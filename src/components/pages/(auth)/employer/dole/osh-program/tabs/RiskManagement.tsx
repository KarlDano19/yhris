"use client";

import { useEffect, useRef } from "react";

import { useFieldArray } from "react-hook-form";
import { MinusIcon, XCircleIcon } from "@heroicons/react/24/solid";

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
  
  // Ref for the table container to enable scrolling
  const tableContainerRef = useRef<HTMLDivElement>(null);

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
    
    // Auto-scroll to the bottom of the page after a short delay to ensure DOM update
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <form>
      <div className="px-4 pt-4 pb-6 mb-24">
        <div className="mt-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Emergency and Disaster Preparedness
          </label>
        </div>
        <div
          className="mt-4 w-full overflow-x-auto"
          ref={tableContainerRef}
        >
          <table className="min-w-full divide-y divide-gray-300 text-center">
            <thead className="bg-[#D8E6FB] rounded-lg border-2 border-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900 w-32 min-w-32"
                >
                  Task
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900 w-40 min-w-40"
                >
                  Hazard Identified
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900 w-40 min-w-40"
                >
                  Risk Description
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900 w-48 min-w-48"
                >
                  Priority
                  <h1 className="text-sm text-gray-500 mt-2">
                    likelihood of injury and illness to occur (low, medium, high)
                  </h1>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900 w-40 min-w-40"
                >
                  Control Measures
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900 w-16 min-w-16"
                ></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fields.map((item, index) => (
                <tr
                  key={item.id}
                  className="cursor-pointer border-b border-gray-200"
                >
                  <td className="px-3 py-5 text-sm text-gray-500 border-2 border-gray-200 w-32 min-w-32">
                    <input
                      type="text"
                      {...register(
                        `emergency_and_disaster_preparedness.${index}.task`,
                        { required: true }
                      )}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 truncate"
                    />
                  </td>
                  <td className="px-3 py-5 text-sm text-gray-500 border-2 border-gray-200 w-40 min-w-40">
                    <input
                      type="text"
                      {...register(
                        `emergency_and_disaster_preparedness.${index}.hazard_identified`,
                        { required: true }
                      )}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 truncate"
                    />
                  </td>
                  <td className="px-3 py-5 text-sm text-gray-500 border-2 border-gray-200 w-40 min-w-40">
                    <input
                      type="text"
                      {...register(
                        `emergency_and_disaster_preparedness.${index}.risk_description`,
                        { required: true }
                      )}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 truncate"
                    />
                  </td>
                  <td className="px-3 py-5 text-sm text-gray-500 border-2 border-gray-200 w-48 min-w-48">
                    <input
                      type="text"
                      {...register(
                        `emergency_and_disaster_preparedness.${index}.priority`,
                        { required: true }
                      )}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 truncate"
                    />
                  </td>
                  <td className="px-3 py-5 text-sm text-gray-500 border-2 border-gray-200 w-40 min-w-40">
                    <input
                      type="text"
                      {...register(
                        `emergency_and_disaster_preparedness.${index}.control_measures`,
                        { required: true }
                      )}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 truncate"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200 w-16 min-w-16">
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
            className="bg-savoy-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add new line
          </button>
        </div>
      </div>
    </form>
  );
}
