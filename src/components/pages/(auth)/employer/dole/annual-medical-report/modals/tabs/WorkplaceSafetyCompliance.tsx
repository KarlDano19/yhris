"use client";

import { useState } from "react";

import { ChevronDownIcon } from "@heroicons/react/24/solid";

function WorkplaceSafetyCompliance({
  register,
  handleSubmit,
  setSelectedTab,
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
}) {
  const [isImmunizationOpen, setIsImmunizationOpen] = useState(false);
  const [isOccupationalAccidentOpen, setIsOccupationalAccidentOpen] =
    useState(false);

  const toggleImmunizationOpen = () =>
    setIsImmunizationOpen(!isImmunizationOpen);
  const toggleOccupationalAccidentOpen = () =>
    setIsOccupationalAccidentOpen(!isOccupationalAccidentOpen);

  const onSubmit = handleSubmit(() => {
    setSelectedTab(7);
  });

  return (
    <form onSubmit={onSubmit}>
      <>
        <div className="pr-8">
          <div
            className="flex justify-start items-center mb-4"
            onClick={toggleOccupationalAccidentOpen}
          >
            <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
              a. Report of Occupational Accidents/Injuries:
              <span
                className={`ml-2 ${
                  isOccupationalAccidentOpen ? "rotate-180" : ""
                }`}
              >
                {/* Chevron icon */}
                <ChevronDownIcon className="h-5 w-5" />
              </span>
            </h1>
          </div>
          {isOccupationalAccidentOpen && (
            <>
              <div className="grid grid-cols-4 gap-4">
                <div>{""}</div>
                <div>
                  <h1 className="text-sm font-medium pl-14">Male</h1>
                </div>
                <div>
                  <h1 className="text-sm font-medium pl-14">Female</h1>
                </div>
                <div>
                  <h1 className="text-sm font-medium pl-14">
                    Total Number of Cases
                  </h1>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                      Contussion, bruises, hematoma
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`contusion_bruises_hematoma_male`)}
                      id={`contusion_bruises_hematoma_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`contusion_bruises_hematoma_female`)}
                      id={`contusion_bruises_hematoma_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`contusion_bruises_hematoma_total`)}
                      id={`contusion_bruises_hematoma_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Abrasions
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`abrasions_male`)}
                      id={`abrasions_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`abrasions_female`)}
                      id={`abrasions_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`abrasions_total`)}
                      id={`abrasions_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                      Cuts, Lacerations Punctures
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`cuts_lacerations_punctures_male`)}
                      id={`cuts_lacerations_punctures_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`cuts_lacerations_punctures_female`)}
                      id={`cuts_lacerations_punctures_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`cuts_lacerations_punctures_total`)}
                      id={`cuts_lacerations_punctures_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Avulsion
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`avulsion_male`)}
                      id={`avulsion_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`avulsion_female`)}
                      id={`avulsion_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`avulsion_total`)}
                      id={`avulsion_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                      Amputation, loss of body part
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`amputation_loss_body_part_male`)}
                      id={`amputation_loss_body_part_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`amputation_loss_body_part_female`)}
                      id={`amputation_loss_body_part_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`amputation_loss_body_part_total`)}
                      id={`amputation_loss_body_part_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Crushing Injury
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`crushing_injury_male`)}
                      id={`crushing_injury_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`crushing_injury_female`)}
                      id={`crushing_injury_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`crushing_injury_total`)}
                      id={`crushing_injury_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Spinal Injury
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`spinal_injury_male`)}
                      id={`spinal_injury_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`spinal_injury_female`)}
                      id={`spinal_injury_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`spinal_injury_total`)}
                      id={`spinal_injury_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Cranial Injury
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`cranial_injury_male`)}
                      id={`cranial_injury_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`cranial_injury_female`)}
                      id={`cranial_injury_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`cranial_injury_total`)}
                      id={`cranial_injury_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Sprain
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`sprain_male`)}
                      id={`sprain_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`sprain_female`)}
                      id={`sprain_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`sprain_total`)}
                      id={`sprain_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Dislocation/ Fracture
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`dislocation_fracture_male`)}
                      id={`dislocation_fracture_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`dislocation_fracture_female`)}
                      id={`dislocation_fracture_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`dislocation_fracture_total`)}
                      id={`dislocation_fracture_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Burns
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`burns_injury_male`)}
                      id={`burns_injury_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`burns_injury_female`)}
                      id={`burns_injury_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`burns_injury_total`)}
                      id={`burns_injury_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div
            className="flex justify-start items-center mb-4"
            onClick={toggleImmunizationOpen}
          >
            <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
              b. Immunization Program (Indicate number immunized)
              <span
                className={`ml-2 ${isImmunizationOpen ? "rotate-180" : ""}`}
              >
                <ChevronDownIcon className="h-5 w-5" />
              </span>
            </h1>
          </div>
          {isImmunizationOpen && (
            <>
              <div className="grid grid-cols-4 gap-4">
                <div>{""}</div>
                <div>
                  <h1 className="text-sm font-medium pl-14">Male</h1>
                </div>
                <div>
                  <h1 className="text-sm font-medium pl-14">Female</h1>
                </div>
                <div>
                  <h1 className="text-sm font-medium pl-14">
                    Total Number of Cases
                  </h1>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Tetanus Toxoid Injection
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`tetanus_toxoid_injection_male`)}
                      id={`tetanus_toxoid_injection_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`tetanus_toxoid_injection_female`)}
                      id={`tetanus_toxoid_injection_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`tetanus_toxoid_injection_total`)}
                      id={`tetanus_toxoid_injection_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                      Tetanus Antitoxin Injection
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`tetanus_antitoxin_injection_male`)}
                      id={`tetanus_antitoxin_injection_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`tetanus_antitoxin_injection_female`)}
                      id={`tetanus_antitoxin_injection_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`tetanus_antitoxin_injection_total`)}
                      id={`tetanus_antitoxin_injection_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                      Tetanus Globulin Injection
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`tetanus_globulin_injection_male`)}
                      id={`tetanus_globulin_injection_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`tetanus_globulin_injection_female`)}
                      id={`tetanus_globulin_injection_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`tetanus_globulin_injection_total`)}
                      id={`tetanus_globulin_injection_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Hepatitis B Vaccination
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`hepatitis_b_vaccination_male`)}
                      id={`hepatitis_b_vaccination_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`hepatitis_b_vaccination_female`)}
                      id={`hepatitis_b_vaccination_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`hepatitis_b_vaccination_female`)}
                      id={`hepatitis_b_vaccination_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Rabies Vaccination
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`rabies_vaccination_male`)}
                      id={`rabies_vaccination_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`rabies_vaccination_female`)}
                      id={`rabies_vaccination_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`rabies_vaccination_total`)}
                      id={`rabies_vaccination_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 pb-6">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                      Others
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="text"
                      {...register(`others_immunization_male`)}
                      id={`others_immunization_male`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`others_immunization_female`)}
                      id={`others_immunization_female`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register(`others_immunization_total`)}
                      id={`others_immunization_total`}
                      className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </>
      <hr />
      <div className="py-4 px-4 flex justify-between">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(5)}
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
