"use client";

import { useEffect, useState } from "react";

import { Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import CustomDatePicker from "@/components/CustomDatePicker";
import DrawSignatureModal from "../DrawSignatureModal";
import DrawNotedBySignatureModal from "../DrawNotedBySignature";

import { ChevronDownIcon } from "@heroicons/react/24/solid";


interface CachedProfileData {
  name: string;
  type_of_industry: string;
  city: string;
}

function WorkplaceSafetyCompliance({
  control,
  register,
  onSubmit,
  setSelectedTab,
  setValue,
}: {
  name_of_safety_officer?: string[];
  control: any;
  register: any;
  onSubmit: any;
  setSelectedTab: any;
  setValue: any;
}) {
  const queryClient = useQueryClient();

  const [isChemicalHazardsOpen, setIsChemicalHazardsOpen] = useState(false);
  const [isPhysicalHazardsOpen, setIsPhysicalHazardsOpen] = useState(false);
  const [isErgonomicHazardsOpen, setIsErgonomicHazardsOpen] = useState(false);
  const [isBiologicalHazardsOpen, setIsBiologicalHazardsOpen] = useState(false);
    useState(false);

  const toggleChemicalHazardsOpen = () =>
    setIsChemicalHazardsOpen(!isChemicalHazardsOpen);
  const togglePhysicalHazardsOpen = () =>
    setIsPhysicalHazardsOpen(!isPhysicalHazardsOpen);
  const toggleErgonomicHazardsOpen = () =>
    setIsErgonomicHazardsOpen(!isErgonomicHazardsOpen);
  const toggleBiologicalHazardsOpen = () =>
    setIsBiologicalHazardsOpen(!isBiologicalHazardsOpen);

  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [drawNotedBySignatureModal, setDrawNotedBySignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [notedSignatureUrl, setNotedSignatureUrl] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [notedAttachmentExist, setNotedAttachmentExist] = useState(false);
  const [attachmentExist, setAttachmentExist] = useState(false);

  const toggleDrawSignatureModal = () => {
    setDrawSignatureModal(!drawSignatureModal);
  };

  const toggleDrawNotedBySignatureModal = () => {
    setDrawNotedBySignatureModal(!drawNotedBySignatureModal);
  };

  useEffect(() => {
    if (notedSignatureUrl) {
      setValue("noted_signature", notedSignatureUrl);
    } else {
      setNotedSignatureUrl("");
    }
    if (!drawNotedBySignatureModal && notedSignatureUrl) {
      setNotedSignatureUrl("");
    }
  }, [notedSignatureUrl, setValue, drawNotedBySignatureModal]);

  useEffect(() => {
    if (signatureUrl) {
      setValue("signature", signatureUrl);
    } else {
      setSignatureUrl("");
    }
    if (!drawSignatureModal && signatureUrl) {
      setSignatureUrl("");
    }
  }, [signatureUrl, setValue, drawSignatureModal,]);

  useEffect(() => {
    if (fileUrl) {
      setValue("policy_and_program_on_safety_and_health", fileUrl);
    } else {
      setFileUrl("");
    }
  }, [fileUrl, setValue]);

  return (
    <form onSubmit={onSubmit}>
      <>
        <div className="pr-8">
          <div className="grid grid-cols-3 gap-4 pt-10">
            <div>{""}</div>
            <div>
              <h1 className="text-sm font-medium">Substances and Sources</h1>
            </div>
            <div>
              <h1 className="text-sm font-medium">No. of Workers Exposed</h1>
            </div>
          </div>
          <div
            className="flex justify-start items-center mb-4"
            onClick={toggleChemicalHazardsOpen}
          >
            <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
              a. Chemical Hazards:
              <span
                className={`ml-2 ${
                  isChemicalHazardsOpen ? "rotate-180" : ""
                }`}
              >
                {/* Chevron icon */}
                <ChevronDownIcon className="h-5 w-5" />
              </span>
            </h1>
          </div>
          {isChemicalHazardsOpen && (
            <>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Dust (Ex. Silica dust)
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`dust_sources`)}
                      id={`dust_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`dust_workers_exposed`)}
                      id={`dust_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Liquids (Ex. Mercury)
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`liquids_sources`)}
                      id={`liquids_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`liquids_workers_exposed`)}
                      id={`liquids_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                      Mist/ Fumes/ Vapors (Ex. Mist from paint)
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`mist_fumes_vapors_sources`)}
                      id={`mist_fumes_vapors_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`mist_fumes_vapors_workers_exposed`)}
                      id={`mist_fumes_vapors_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Gas (Ex. CO, H2S)
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`gas_sources`)}
                      id={`gas_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`gas_workers_exposed`)}
                      id={`gas_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div
            className="flex justify-start items-center mb-4"
            onClick={togglePhysicalHazardsOpen}
          >
            <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
              b. Physical Hazards:
              <span
                className={`ml-2 ${isPhysicalHazardsOpen ? "rotate-180" : ""}`}
              >
                <ChevronDownIcon className="h-5 w-5" />
              </span>
            </h1>
          </div>
          {isPhysicalHazardsOpen && (
            <>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Noise
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`noise_sources`)}
                      id={`noise_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`noise_workers_exposed`)}
                      id={`noise_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Temperature/ Humidity
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`temperature_humidity_sources`)}
                      id={`temperature_humidity_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`temperature_humidity_workers_exposed`)}
                      id={`temperature_humidity_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Pressure
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`pressure_sources`)}
                      id={`pressure_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`pressure_workers_exposed`)}
                      id={`pressure_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Illumination
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`illumination_sources`)}
                      id={`illumination_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`illumination_workers_exposed`)}
                      id={`illumination_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Radiation Ultraviolet/ Microwave
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`radiation_ultraviolet_microwave_sources`)}
                      id={`radiation_ultraviolet_microwave_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`radiation_ultraviolet_microwave_workers_exposed`)}
                      id={`radiation_ultraviolet_microwave_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Vibration
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`vibration_sources`)}
                      id={`vibration_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`vibration_workers_exposed`)}
                      id={`vibration_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Others
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`others_sources`)}
                      id={`others_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`others_workers_exposed`)}
                      id={`others_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div
            className="flex justify-start items-center mb-4"
            onClick={toggleErgonomicHazardsOpen}
          >
            <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
              b. Ergonomic Stress:
              <span
                className={`ml-2 ${isErgonomicHazardsOpen ? "rotate-180" : ""}`}
              >
                <ChevronDownIcon className="h-5 w-5" />
              </span>
            </h1>
          </div>
          {isErgonomicHazardsOpen && (
            <>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Exhausting Physical Work
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`exhausting_physical_work_sources`)}
                      id={`exhausting_physical_work_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`exhausting_physical_work_workers_exposed`)}
                      id={`exhausting_physical_work_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Prolonged Standing
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`prolonged_standing_sources`)}
                      id={`prolonged_standing_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`prolonged_standing_workers_exposed`)}
                      id={`prolonged_standing_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Excessive Mental Effort
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`excessive_mental_effort_sources`)}
                      id={`excessive_mental_effort_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`excessive_mental_effort_workers_exposed`)}
                      id={`excessive_mental_effort_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Unfavorable Work Posture
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`unfavorable_work_posture_sources`)}
                      id={`unfavorable_work_posture_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`unfavorable_work_posture_workers_exposed`)}
                      id={`unfavorable_work_posture_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Static/ Monotonous Work
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`static_monotonous_work_sources`)}
                      id={`static_monotonous_work_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`static_monotonous_work_workers_exposed`)}
                      id={`static_monotonous_work_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Others
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`others_sources`)}
                      id={`others_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`others_workers_exposed`)}
                      id={`others_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div
            className="flex justify-start items-center mb-4"
            onClick={toggleBiologicalHazardsOpen}
          >
            <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
              b. Biological Hazards:
              <span
                className={`ml-2 ${isBiologicalHazardsOpen ? "rotate-180" : ""}`}
              >
                <ChevronDownIcon className="h-5 w-5" />
              </span>
            </h1>
          </div>
          {isBiologicalHazardsOpen && (
            <>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Viral
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`viral_sources`)}
                      id={`viral_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`viral_workers_exposed`)}
                      id={`viral_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Bacterial
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`bacterial_sources`)}
                      id={`bacterial_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`bacterial_workers_exposed`)}
                      id={`bacterial_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Fungal
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`fungal_sources`)}
                      id={`fungal_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`fungal_workers_exposed`)}
                      id={`fungal_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Parasitic
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`parasitic_sources`)}
                      id={`parasitic_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`parasitic_workers_exposed`)}
                      id={`parasitic_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Others
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`others_sources`)}
                      id={`others_sources`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`others_workers_exposed`)}
                      id={`others_workers_exposed`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="grid grid-cols-3 gap-6 mt-4 pl-6 pr-6 mb-4">
            <div>
              <label
                htmlFor="prepared_by"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Submitted By
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("prepared_by", { required: true })}
                  id="prepared_by"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="draw_signature"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Draw Signature
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <button
                  type="button"
                  className="w-full rounded-md bg-white border border-savoy-blue px-14 py-1.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={toggleDrawSignatureModal}
                >
                  Draw
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="signature"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Upload Signature
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  id="signature"
                  {...register("signature")}
                  onChange={(e) => {
                    e.target.value ? setSignatureUrl("") : null;
                    e.target.value ? setAttachmentExist(true) : null;
                  }}
                  type="file"
                  className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
                />
                {attachmentExist ? (
                  <button
                    type="button"
                    className="underline text-savoy-blue text-sm"
                    onClick={() => {
                      setValue("signature", "");
                      setAttachmentExist(false);
                    }}
                  >
                    Remove Attachment
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-4 pl-6 pr-6 mb-4">
            <div>
              <label
                htmlFor="noted_by"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Noted By
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("noted_by", { required: true })}
                  id="noted_by"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="draw_signature"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Draw Signature
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <button
                  type="button"
                  className="w-full rounded-md bg-white border border-savoy-blue px-14 py-1.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={toggleDrawNotedBySignatureModal}
                >
                  Draw
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="signature"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Upload Signature
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  id="noted_signature"
                  {...register("noted_signature")}
                  onChange={(e) => {
                    e.target.value ? setNotedSignatureUrl("") : null;
                    e.target.value ? setNotedAttachmentExist(true) : null;
                  }}
                  type="file"
                  className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
                />
                {notedAttachmentExist ? (
                  <button
                    type="button"
                    className="underline text-savoy-blue text-sm"
                    onClick={() => {
                      setValue("noted_signature", "");
                      setNotedAttachmentExist(false);
                    }}
                  >
                    Remove Attachment
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-4 pl-6 pr-6 mb-4">
              <div>
                <label
                  htmlFor="date_of_report"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Date of Report
                </label>
                <div className="relative mt-2">
                  <Controller
                    control={control}
                    name="date_of_report"
                    render={({ field }) => (
                      <CustomDatePicker
                        id="date_of_report"
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
      </>
      {drawSignatureModal && (
        <DrawSignatureModal
          isOpen={drawSignatureModal}
          setIsOpen={setDrawSignatureModal}
          setSignatureUrl={setSignatureUrl}
        />
      )}
      {drawNotedBySignatureModal && (
        <DrawNotedBySignatureModal
          isOpen={drawNotedBySignatureModal}
          setIsOpen={setDrawNotedBySignatureModal}
          setNotedSignatureUrl={setNotedSignatureUrl}
        />
      )}
      <hr />
      <div className="py-4 px-4 flex justify-between">
      <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(7)}
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

export default WorkplaceSafetyCompliance;
