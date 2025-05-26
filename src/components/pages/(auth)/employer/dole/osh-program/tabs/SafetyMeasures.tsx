"use client";

import { useEffect, useState, useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import dynamic from "next/dynamic";
import { Controller } from "react-hook-form";

import { QUILL_FORMATS, QUILL_MODULES } from "@/helpers/constants";

import { XCircleIcon } from "@heroicons/react/24/solid";

import ClipIcon from "@/svg/ClipIcon";

export default function SafetyMeasures({
  control,
  register,
  setValue,
  watch,
  validationMessage,
  safetySignageUrl,
  setSafetySignageUrl,
  safetySignageAttachmentExist,
  setSafetySignageAttachmentExist,
}: {
  control: any;
  register: any;
  setValue: any;
  watch: any;
  validationMessage?: string;
  safetySignageUrl: string;
  setSafetySignageUrl: (url: string) => void;
  safetySignageAttachmentExist: boolean;
  setSafetySignageAttachmentExist: (exists: boolean) => void;
}) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [previousSignageFile, setPreviousSignageFile] = useState<string>("");

  useEffect(() => {
    if (safetySignageUrl) {
      setValue("signature", safetySignageUrl);
    } else {
      setSafetySignageUrl("");
    }
    if (!drawSignatureModal && safetySignageUrl) {
      setSafetySignageUrl("");
    }
  }, [safetySignageUrl, setValue, drawSignatureModal]);

  // Add effect to track previous signage file
  useEffect(() => {
    const currentSignage = watch("safety_signage");
    if (typeof currentSignage === "string" && currentSignage !== previousSignageFile) {
      setPreviousSignageFile(currentSignage);
    }
  }, [watch("safety_signage")]);

  const {
    fields: ppeFields,
    append: ppeAppend,
    remove: ppeRemove,
  } = useFieldArray({
    control,
    name: "ppe",
  });

  const {
    fields: drillsFields,
    append: drillsAppend,
    remove: drillsRemove,
  } = useFieldArray({
    control,
    name: "drills",
  });

  return (
    <form>
      <div className="px-4 pt-4 pb-6">
        {validationMessage && (
          <div className="rounded-md bg-red-50 p-4 mb-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {validationMessage}
                </h3>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="sm:col-span-4 mt-4 mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Provision and use of PPE
              <h1 className="text-sm text-gray-500 mt-2">
                Issuance of PPE shall be supplemented by training on the
                application, use, handling, cleaning and maintenance.
              </h1>
            </label>
            <div className="mt-4 w-3/4">
              <table className="min-w-full divide-y divide-gray-300 text-center">
                <thead className="bg-[#D8E6FB] rounded-lg border-2 border-gray-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                    >
                      PPE Provided
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                    >
                      No. Of Workers
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ppeFields.map((item, index) => (
                    <tr
                      key={item.id}
                      className="cursor-pointer border-b border-gray-200"
                    >
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                        <input
                          type="text"
                          {...register(`ppe.${index}.ppe_provided`)}
                          id={`ppe.${index}.ppe_provided`}
                          className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                        <input
                          type="number"
                          {...register(`ppe.${index}.no_of_workers`)}
                          id={`ppe.${index}.no_of_workers`}
                          className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-start mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent any default action
                  ppeAppend({ id: ppeAppend.length }); // Add new line
                }}
                className="bg-savoy-blue text-white px-4 py-2 rounded-md"
              >
                Add new line
              </button>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Safety Signage
          </label>
          <h1 className="text-sm text-gray-500 mt-2">
            The safety signages include warning to workers and employees and the
            public about the hazards within the workplace.
          </h1>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-6 w-1/2">
          <div>
            <div className="relative mt-2">
              <label
                htmlFor="safety_signage"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Type of Safety Signage (Kindly attach picture)
              </label>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative mt-2">
              <input
                id="safety_signage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setValue("safety_signage", file);
                    setValue("previous_safety_signage", previousSignageFile);
                    setSafetySignageUrl("");
                    setSafetySignageAttachmentExist(true);
                  }
                }}
                className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
              <div className="flex items-center gap-4 mt-2">
                {safetySignageAttachmentExist && (
                  <button
                    type="button"
                    className="underline text-savoy-blue text-sm"
                    onClick={() => {
                      setValue("safety_signage", "");
                      setValue("previous_safety_signage", previousSignageFile);
                      setSafetySignageUrl("");
                      setSafetySignageAttachmentExist(false);
                    }}
                  >
                    Remove Attachment
                  </button>
                )}
                {previousSignageFile && !safetySignageAttachmentExist && (
                  <button
                    type="button"
                    className="bg-savoy-blue text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => {
                      window.open(`${process.env.NEXT_PUBLIC_API_URL}/media/oshprogram/signage/${previousSignageFile.split('/').pop()}`, '_blank');
                    }}
                  >
                    View Safety Signage
                  </button>
                )}
              </div>
              {safetySignageUrl && !safetySignageAttachmentExist && (
                <div className="mt-2">
                  <img 
                    src={safetySignageUrl} 
                    alt="Safety Signage" 
                    className="max-w-xs rounded-md shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="sm:col-span-4 mt-4 mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Dust control and management and regulation
              <h1 className="text-sm text-gray-500 mt-2">
                Dust control and management and regulation on activities such as
                building of temporary structures and lifting and operation of
                electrical, mechanical, communications system and other
                requirements.
              </h1>
              <h1 className="text-sm text-gray-500 mt-2">
                Kindly attach dust control procedures, plans on temporary
                structures, permits applicable for the operation of electrical,
                mechanical, communications systems and other requirements.
              </h1>
            </label>
            <div className="mt-4 w-full">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-[#D8E6FB] rounded-lg border-2 border-gray-200 text-cente">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                    >
                      Facilities
                    </th>
                    <th
                      scope="col"
                      colSpan={2}
                      className="px-3py-3.5 text-sm font-semibold text-gray-900"
                    >
                      Provided
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                    >
                      Remarks
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                    ></th>
                  </tr>
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                    ></th>
                    <th
                      scope="col"
                      className="px-3 col-span-2 py-3.5 text-sm font-semibold text-gray-900"
                    >
                      Yes
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                    ></th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="cursor-pointer border-b border-gray-200">
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      Adequate supply of drinking water
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="adequate_supply_of_drinking_water"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="adequate_supply_yes"
                                checked={value === true}
                                onChange={() => onChange(value === true ? undefined : true)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="adequate_supply_of_drinking_water"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="adequate_supply_no"
                                checked={value === false}
                                onChange={() => onChange(value === false ? undefined : false)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        type="text"
                        {...register(
                          `adequate_supply_of_drinking_water_remarks`
                        )}
                        id={`adequate_supply_of_drinking_water_remarks`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        id={`adequate_supply_of_drinking_water_file`}
                        {...register(`adequate_supply_of_drinking_water_file`)}
                        type="file"
                        className="hidden rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                      <label
                        htmlFor={`adequate_supply_of_drinking_water_file`}
                        className="cursor-pointer items-center"
                      >
                        <ClipIcon />
                      </label>
                    </td>
                  </tr>
                  <tr className="cursor-pointer border-b border-gray-200">
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      Adequate sanitary and washing facilities
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="adequate_sanitary_and_washing_facilities"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="adequate_sanitary_yes"
                                checked={value === true}
                                onChange={() => onChange(value === true ? undefined : true)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="adequate_sanitary_and_washing_facilities"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="adequate_sanitary_no"
                                checked={value === false}
                                onChange={() => onChange(value === false ? undefined : false)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        type="text"
                        {...register(
                          `adequate_sanitary_and_washing_facilities_remarks`
                        )}
                        id={`adequate_sanitary_and_washing_facilities_remarks`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        id={`adequate_sanitary_and_washing_facilities_file`}
                        {...register(
                          `adequate_sanitary_and_washing_facilities_file`
                        )}
                        type="file"
                        className="hidden rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                      <label
                        htmlFor={`adequate_sanitary_and_washing_facilities_file`}
                        className="cursor-pointer items-center"
                      >
                        <ClipIcon />
                      </label>
                    </td>
                  </tr>
                  <tr className="cursor-pointer border-b border-gray-200">
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      Suitable living accommodation (if applicable)
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="suitable_living_accommodation"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="suitable_living_yes"
                                checked={value === true}
                                onChange={() => onChange(value === true ? undefined : true)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="suitable_living_accommodation"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="suitable_living_no"
                                checked={value === false}
                                onChange={() => onChange(value === false ? undefined : false)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        type="text"
                        {...register(`suitable_living_accommodation_remarks`)}
                        id={`suitable_living_accommodation_remarks`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        id={`suitable_living_accommodation_file`}
                        {...register(`suitable_living_accommodation_file`)}
                        type="file"
                        className="hidden rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                      <label
                        htmlFor={`suitable_living_accommodation_file`}
                        className="cursor-pointer items-center"
                      >
                        <ClipIcon />
                      </label>
                    </td>
                  </tr>
                  <tr className="cursor-pointer border-b border-gray-200">
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      Separate sanitary, washing and sleeping facilities (if
                      applicable)
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="separate_sanitary_washing_and_sleeping_facilities"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="separate_sanitary_yes"
                                checked={value === true}
                                onChange={() => onChange(value === true ? undefined : true)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="separate_sanitary_washing_and_sleeping_facilities"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="separate_sanitary_no"
                                checked={value === false}
                                onChange={() => onChange(value === false ? undefined : false)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        type="text"
                        {...register(
                          `separate_sanitary_washing_and_sleeping_facilities_remarks`
                        )}
                        id={`separate_sanitary_washing_and_sleeping_facilities_remarks`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        id={`separate_sanitary_washing_and_sleeping_facilities_file`}
                        {...register(
                          `separate_sanitary_washing_and_sleeping_facilities_file`
                        )}
                        type="file"
                        className="hidden rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                      <label
                        htmlFor={`separate_sanitary_washing_and_sleeping_facilities_file`}
                        className="cursor-pointer items-center"
                      >
                        <ClipIcon />
                      </label>
                    </td>
                  </tr>
                  <tr className="cursor-pointer border-b border-gray-200">
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      Lactation station (in consonance with DOLE D.O. 143-15)
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="lactation_station"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="lactation_station_yes"
                                checked={value === true}
                                onChange={() => onChange(value === true ? undefined : true)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="lactation_station"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="lactation_station_no"
                                checked={value === false}
                                onChange={() => onChange(value === false ? undefined : false)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        type="text"
                        {...register(`lactation_station_remarks`)}
                        id={`lactation_station_remarks`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        id={`lactation_station_file`}
                        {...register(`lactation_station_file`)}
                        type="file"
                        className="hidden rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                      <label
                        htmlFor={`lactation_station_file`}
                        className="cursor-pointer items-center"
                      >
                        <ClipIcon />
                      </label>
                    </td>
                  </tr>
                  <tr className="cursor-pointer border-b border-gray-200">
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      Ramps, railings, and the like
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="ramps_railings_and_like"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="ramps_railings_yes"
                                checked={value === true}
                                onChange={() => onChange(value === true ? undefined : true)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="ramps_railings_and_like"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="ramps_railings_no"
                                checked={value === false}
                                onChange={() => onChange(value === false ? undefined : false)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        type="text"
                        {...register(`ramps_railings_and_like_remarks`)}
                        id={`ramps_railings_and_like_remarks`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        id={`ramps_railings_and_like_file`}
                        {...register(`ramps_railings_and_like_file`)}
                        type="file"
                        className="hidden rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                      <label
                        htmlFor={`ramps_railings_and_like_file`}
                        className="cursor-pointer items-center"
                      >
                        <ClipIcon />
                      </label>
                    </td>
                  </tr>
                  <tr className="cursor-pointer border-b border-gray-200">
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      Other workers' welfare facilities as prescribed by OSHS
                      and other related issuances
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="other_workers_welfare_facilities"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="other_workers_yes"
                                checked={value === true}
                                onChange={() => onChange(value === true ? undefined : true)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center">
                        <Controller
                          control={control}
                          name="other_workers_welfare_facilities"
                          defaultValue={undefined}
                          render={({ field: { value, onChange, ...field } }) => (
                            <>
                              <input
                                type="checkbox"
                                id="other_workers_no"
                                checked={value === false}
                                onChange={() => onChange(value === false ? undefined : false)}
                                className="w-4 h-4"
                                {...field}
                              />
                            </>
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        type="text"
                        {...register(
                          `other_workers_welfare_facilities_remarks`
                        )}
                        id={`other_workers_welfare_facilities_remarks`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        id={`other_workers_welfare_facilities_file`}
                        {...register(`other_workers_welfare_facilities_file`)}
                        type="file"
                        className="hidden rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                      <label
                        htmlFor={`other_workers_welfare_facilities_file`}
                        className="cursor-pointer items-center"
                      >
                        <ClipIcon />
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
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
        <div className="mt-4 flex flex-row">
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-gray-900 pl-4"
          >
            Written Emergency and Disaster Program?
          </label>
          <div className="grid grid-cols-4 gap-10 pl-4">
            <div className="relative pl-4 flex gap-2">
              <input
                type="checkbox"
                {...register(`written_emergency_and_disaster_program`)}
                id={`written_emergency_and_disaster_program`}
                value="Yes"
              />
              <label htmlFor="safety_officer_level_1" className="ml-2 ">
                Yes
              </label>
            </div>
            <div className="relative pl-4 flex gap-2">
              <input
                type="checkbox"
                {...register(`written_emergency_and_disaster_program`)}
                id={`written_emergency_and_disaster_program`}
                value="No"
              />
              <label htmlFor="safety_officer_level_1" className="ml-2 ">
                No
              </label>
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
                  Type of Drills (fire, earthquake)
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                >
                  Responsible person/position
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {drillsFields.map((field, index) => (
                <tr
                  className="cursor-pointer border-b border-gray-200"
                  key={field.id}
                >
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                    <input
                      type="text"
                      {...register(`drills.${index}.type_of_drills`)}
                      id={`drills.${index}.type_of_drills`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                    <input
                      type="text"
                      {...register(`drills.${index}.date`)}
                      id={`drills.${index}.date`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                    <input
                      type="text"
                      {...register(
                        `drills.${index}.responsible_person_position`
                      )}
                      id={`drills.${index}.responsible_person_position`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-start mt-4">
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent any default action
              drillsAppend({ id: drillsAppend.length }); // Add new line
            }}
            className="bg-savoy-blue text-white px-4 py-2 rounded-md"
          >
            Add new line
          </button>
        </div>
        <div className="mt-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Solid Waste Management System
          </label>
        </div>
        <div className="mt-4 flex flex-row">
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-gray-900 pl-4"
          >
            Written Pollution Control Program?
          </label>
          <div className="grid grid-cols-4 gap-10 pl-4">
            <div className="relative pl-4 flex gap-2 mb-6">
              <input
                type="checkbox"
                {...register(`written_pollution_control_program`)}
                id={`written_pollution_control_program`}
                value="Yes"
              />
              <label
                htmlFor="written_pollution_control_program"
                className="ml-2 mt-0.5"
              >
                Yes
              </label>
            </div>
            <div className="relative pl-4 flex gap-2 mb-6">
              <input
                type="checkbox"
                {...register(`written_pollution_control_program`)}
                id={`written_pollution_control_program`}
                value="No"
              />
              <label
                htmlFor="written_pollution_control_program"
                className="ml-2 mt-0.5"
              >
                No
              </label>
            </div>
          </div>
          <div className="flex flex-row whitespace-nowrap gap-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900 pl-4"
            >
              Name of Pollution Control Officer
            </label>
            <input
              type="text"
              {...register("polution_control_officer")}
              id="companypolution_control_officer_name"
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 mb-4"
            />
          </div>
        </div>
        <div className="sm:col-span-4 mt-4">
          <div className="mt-2 h-72 mb-12">
            <textarea
              rows={4}
              {...register("waste_management_system_message")}
              id="waste_management_system_message"
              hidden
            />
            <ReactQuill
              onChange={(value) =>
                setValue("waste_management_system_message", value)
              }
              formats={QUILL_FORMATS}
              modules={QUILL_MODULES}
              style={{
                height: "100%",
                padding: "5px 8px !important",
              }}
              value={watch("waste_management_system_message")}
            />
          </div>
        </div>
        <div className="mt-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Compliance with Reportorial Government Requirements
          </label>
          <h1 className="text-sm text-gray-500 mt-2">
            Please refer to Accident/Incident/Injury investigation recording and
            reporting
          </h1>
        </div>
        <div className="mt-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Control and management of hazards
          </label>
          <h1 className="text-sm text-gray-500 mt-2">
            Please Refer to accomplished to HIRAC
          </h1>
        </div>
        <div className="sm:col-span-4 mt-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Prohibited Acts and Penalties/sanctions for violations on OSH
          </label>
          <div className="mt-2 h-72 mb-12">
            <textarea
              rows={4}
              {...register("prohibited_acts_and_penalties_message")}
              id="prohibited_acts_and_penalties_message"
              hidden
            />
            <ReactQuill
              onChange={(value) =>
                setValue("prohibited_acts_and_penalties_message", value)
              }
              formats={QUILL_FORMATS}
              modules={QUILL_MODULES}
              style={{
                height: "100%",
                padding: "5px 8px !important",
              }}
              value={watch("prohibited_acts_and_penalties_message")}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
