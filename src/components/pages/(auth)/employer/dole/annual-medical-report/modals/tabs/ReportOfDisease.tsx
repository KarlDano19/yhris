"use client";

import { useState } from "react";

import { AutoCalculateTotals } from "./components/report-of-disease/AutoCalculateTotals";
import ToggleSection from "./components/ToggleSection";

// Consultation/ Treatments
import Skin from "./components/report-of-disease/tabs/consultation-treatments/Skin";
import Head from "./components/report-of-disease/tabs/consultation-treatments/Head";
import Eyes from "./components/report-of-disease/tabs/consultation-treatments/Eyes";
import MountENT from "./components/report-of-disease/tabs/consultation-treatments/MountENT";
import Respiratory from "./components/report-of-disease/tabs/consultation-treatments/Respiratory";
import Heart from "./components/report-of-disease/tabs/consultation-treatments/Heart";
import Gastrointestinal from "./components/report-of-disease/tabs/consultation-treatments/Gastrointestinal";
import Genitourinary from "./components/report-of-disease/tabs/consultation-treatments/Genitourinary";
import Reproductive from "./components/report-of-disease/tabs/consultation-treatments/Reproductive";
import Neurological from "./components/report-of-disease/tabs/consultation-treatments/Neurological";
import Lymphatic from "./components/report-of-disease/tabs/consultation-treatments/Lymphatic";
import Infection from "./components/report-of-disease/tabs/consultation-treatments/Infection";

// Disease due to Physical Environment
import DiseaseDueToVibration from "./components/report-of-disease/tabs/physical-environment/DiseaseDueToVibration";
import DiseaseDueToTemperature from "./components/report-of-disease/tabs/physical-environment/DiseaseDueToTemperature";
import DiseaseDueToRadiation from "./components/report-of-disease/tabs/physical-environment/DiseaseDueToRadiation";

import classNames from "@/helpers/classNames";
import DiseaseDueToPressure from "./components/report-of-disease/tabs/physical-environment/DiseaseDueToPressure";

function ReportOfDisease({
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
  watch
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
  watch: any;
}) {
  const [isSkinOpen, setIsSkinOpen] = useState(true);
  const [isHeadOpen, setIsHeadOpen] = useState(false);
  const [isEyesOpen, setIsEyesOpen] = useState(false);
  const [isRespiratoryOpen, setIsRespiratoryOpen] = useState(false);
  const [isHeartOpen, setIsHeartOpen] = useState(false);
  const [isGastrointestinalOpen, setIsGastrointestinalOpen] = useState(false);
  const [isGenitourinaryOpen, setIsGenitourinaryOpen] = useState(false);
  const [isReproductiveOpen, setIsReproductiveOpen] = useState(false);
  const [isNeurologicalOpen, setIsNeurologicalOpen] = useState(false);
  const [isLymphaticOpen, setIsLymphaticOpen] = useState(false);
  const [isMountENTOpen, setIsMountENTOpen] = useState(false);
  const [isInfectionOpen, setIsInfectionOpen] = useState(false);
  const [isDiseaseDueToPressureOpen, setIsDiseaseDueToPressureOpen] =
    useState(false);
  const [isDiseaseDueToRadiationOpen, setIsDiseaseDueToRadiationOpen] =
    useState(false);
  const [isDiseaseDueToTemperatureOpen, setIsDiseaseDueToTemperatureOpen] =
    useState(false);
  const [isDiseaseDueToVibrationOpen, setIsDiseaseDueToVibrationOpen] =
    useState(false);
  const [isDiseaseOpen, setIsDiseaseOpen] = useState(true);
  const [isPhysicalEnvironmentOpen, setIsPhysicalEnvironmentOpen] =
    useState(false);

  const toggleSkinOpen = () => setIsSkinOpen(!isSkinOpen);
  const toggleHeadOpen = () => setIsHeadOpen(!isHeadOpen);
  const toggleEyesOpen = () => setIsEyesOpen(!isEyesOpen);
  const toggleMountENTOpen = () => setIsMountENTOpen(!isMountENTOpen);
  const toggleRespiratoryOpen = () => setIsRespiratoryOpen(!isRespiratoryOpen);
  const toggleHeartOpen = () => setIsHeartOpen(!isHeartOpen);
  const toggleGastrointestinalOpen = () =>
    setIsGastrointestinalOpen(!isGastrointestinalOpen);
  const toggleGenitourinaryOpen = () =>
    setIsGenitourinaryOpen(!isGenitourinaryOpen);
  const toggleReproductiveOpen = () =>
    setIsReproductiveOpen(!isReproductiveOpen);
  const toggleNeurologicalOpen = () =>
    setIsNeurologicalOpen(!isNeurologicalOpen);
  const toggleLymphaticOpen = () => setIsLymphaticOpen(!isLymphaticOpen);
  const toggleInfectionOpen = () => setIsInfectionOpen(!isInfectionOpen);
  const toggleDiseaseDueToPressureOpen = () =>
    setIsDiseaseDueToPressureOpen(!isDiseaseDueToPressureOpen);
  const toggleDiseaseDueToRadiationOpen = () =>
    setIsDiseaseDueToRadiationOpen(!isDiseaseDueToRadiationOpen);
  const toggleDiseaseDueToTemperatureOpen = () =>
    setIsDiseaseDueToTemperatureOpen(!isDiseaseDueToTemperatureOpen);
  const toggleDiseaseDueToVibrationOpen = () =>
    setIsDiseaseDueToVibrationOpen(!isDiseaseDueToVibrationOpen);

  const toggleDiseaseOpen = () => {
    setIsDiseaseOpen(!isDiseaseOpen);
    setIsPhysicalEnvironmentOpen(false); 
  };

  const togglePhysicalEnvironmentOpen = () => {
    setIsPhysicalEnvironmentOpen(!isPhysicalEnvironmentOpen);
    setIsDiseaseOpen(false); 
  };

  const onSubmit = handleSubmit(() => {
    setSelectedTab(6);
  });
  
  return (
    <form onSubmit={onSubmit}>
      {/* Include the AutoCalculateTotals component */}
      <AutoCalculateTotals watch={watch} setValue={setValue} />
      
      <div className="flex flex-row gap-2 md:gap-4 px-4 md:pl-6 pt-4">
        <div
          className={classNames(
            "px-3 md:px-4 py-2 rounded-md text-sm",
            isDiseaseOpen
              ? "bg-savoy-blue text-white"
              : "bg-white text-gray-500"
          )}
          onClick={toggleDiseaseOpen}
        >
          Consultation/ Treatments
        </div>
        <div
          className={classNames(
            "px-3 md:px-4 py-2 rounded-md text-sm",
            isPhysicalEnvironmentOpen
              ? "bg-savoy-blue text-white"
              : "bg-white text-gray-500"
          )}
          onClick={togglePhysicalEnvironmentOpen}
        >
          Disease due to Physical Environment
        </div>
      </div>
      <div className="gap-6 mt-4 px-4 md:pl-6 mb-6">
        {isDiseaseOpen && (
          <div className="pr-0 md:pr-8">
            <label
              htmlFor="purpose_of_wem_request"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Number of consultations/treatments for the following diseases:
            </label>

            {/* Skin */}
            <ToggleSection 
              title="Skin" 
              isOpen={isSkinOpen} 
              onToggle={toggleSkinOpen}
            >
              <Skin register={register} setValue={setValue} watch={watch} />
            </ToggleSection>
            
            {/* Head */}
            <ToggleSection 
              title="Head" 
              isOpen={isHeadOpen} 
              onToggle={toggleHeadOpen}
            >
              <Head register={register} setValue={setValue} watch={watch} />
            </ToggleSection>
            
            {/* Eyes */}
            <ToggleSection 
              title="Eyes" 
              isOpen={isEyesOpen} 
              onToggle={toggleEyesOpen}
            >
              <Eyes register={register} setValue={setValue} watch={watch} />
            </ToggleSection>

            {/* Mount & ENT */}
            <ToggleSection 
              title="Mount & ENT" 
              isOpen={isMountENTOpen} 
              onToggle={toggleMountENTOpen}
            >
              <MountENT register={register} setValue={setValue} watch={watch} />
            </ToggleSection>
          
            {/* Respiratory */}
            <ToggleSection 
              title="Respiratory" 
              isOpen={isRespiratoryOpen} 
              onToggle={toggleRespiratoryOpen}
            >
              <Respiratory register={register} setValue={setValue} watch={watch} />
            </ToggleSection>

            {/* Heart and Blood Vessel */}
            <ToggleSection 
              title="Heart and Blood Vessel" 
              isOpen={isHeartOpen} 
              onToggle={toggleHeartOpen}
            >
              <Heart register={register} setValue={setValue} watch={watch} />
            </ToggleSection>
              
            {/* Gastrointestinal */}
            <ToggleSection 
              title="Gastrointestinal" 
              isOpen={isGastrointestinalOpen} 
              onToggle={toggleGastrointestinalOpen}
            >
              <Gastrointestinal register={register} setValue={setValue} watch={watch} />
            </ToggleSection>

            {/* Genito Urinary */}
            <ToggleSection 
              title="Genito Urinary" 
              isOpen={isGenitourinaryOpen} 
              onToggle={toggleGenitourinaryOpen}
            >
              <Genitourinary register={register} setValue={setValue} watch={watch} />
            </ToggleSection>

            {/* Reproductive */}
            <ToggleSection 
              title="Reproductive" 
              isOpen={isReproductiveOpen} 
              onToggle={toggleReproductiveOpen}
            >
              <Reproductive register={register} setValue={setValue} watch={watch} />
            </ToggleSection>

            {/* Neuromuscular/ Skeletal/ Joints */}
            <ToggleSection 
              title="Neuromuscular/ Skeletal/ Joints" 
              isOpen={isNeurologicalOpen} 
              onToggle={toggleNeurologicalOpen}
            >
              <Neurological register={register} setValue={setValue} watch={watch} />
            </ToggleSection>

            {/* Lymphatic and Immune System */}
            <ToggleSection 
              title="Lymphatic and Immune System" 
              isOpen={isLymphaticOpen} 
              onToggle={toggleLymphaticOpen}
            >
              <Lymphatic register={register} setValue={setValue} watch={watch} />
            </ToggleSection>

            {/* Infectious Diseases */}
            <ToggleSection 
              title="Infectious Diseases" 
              isOpen={isInfectionOpen} 
              onToggle={toggleInfectionOpen}
            >
              <Infection register={register} setValue={setValue} watch={watch} />
            </ToggleSection>

          </div>
        )}
      
        {isPhysicalEnvironmentOpen && (
          <div className="pr-0 md:pr-8">
            {/* Diseases due to Noise and vibration */}
            <ToggleSection 
              title="a. Diseases due to Noise and vibration" 
              isOpen={isDiseaseDueToVibrationOpen} 
              onToggle={toggleDiseaseDueToVibrationOpen}
            >
              <DiseaseDueToVibration register={register} setValue={setValue} watch={watch} />
            </ToggleSection>

            {/* Diseases due to Temperature And Humidity abnormalities */}
            <ToggleSection 
              title="b. Diseases due to Temperature And Humidity abnormalities:" 
              isOpen={isDiseaseDueToTemperatureOpen} 
              onToggle={toggleDiseaseDueToTemperatureOpen}
            >
              <DiseaseDueToTemperature register={register} setValue={setValue} watch={watch} />
            </ToggleSection>

            {/* Diseases due to Pressure */}
            <ToggleSection 
              title="c. Diseases due to Pressure Abnormalities:" 
              isOpen={isDiseaseDueToPressureOpen} 
              onToggle={toggleDiseaseDueToPressureOpen}
            >
              <DiseaseDueToPressure register={register} setValue={setValue} watch={watch}/>
            </ToggleSection>

            {/* Diseases due to radiation */}
            <ToggleSection 
              title="d. Diseases due to radiation:" 
              isOpen={isDiseaseDueToRadiationOpen} 
              onToggle={toggleDiseaseDueToRadiationOpen}
            >
              <DiseaseDueToRadiation register={register} setValue={setValue} watch={watch}/>
            </ToggleSection>

            {/* TOTAL NUMBER */}
            <div className="mt-6 border-t-2 border-gray-300 pt-4">
              <div className="hidden md:grid md:grid-cols-4 gap-4">
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
              <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
                <div className="flex justify-start items-center pl-6">
                  <div className="grid-item">
                    <h1 className="block text-sm font-bold text-center items-start leading-6 text-gray-900">
                      TOTAL NUMBER
                    </h1>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2 flex flex-row items-center">
                    <input
                      type="number"
                      {...register(`physical_environment_total_male`)}
                      id={`physical_environment_total_male`}
                      readOnly
                      min={0}
                      className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 font-bold"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="number"
                      {...register(`physical_environment_total_female`)}
                      id={`physical_environment_total_female`}
                      readOnly
                      min={0}
                      className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 font-bold"
                    />
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mt-2">
                    <input
                      type="number"
                      {...register(`physical_environment_total`)}
                      id={`physical_environment_total`}
                      readOnly
                      min={0}
                      className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 font-bold"
                    />
                  </div>
                </div>
              </div>
              {/* Mobile layout for TOTAL NUMBER */}
              <div className="pl-7 block md:hidden mb-6">
                <h2 className="font-bold mb-2 text-sm">TOTAL NUMBER</h2>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                      type="number"
                      value={watch("physical_environment_total_male") || ""}
                      readOnly
                      min={0}
                      className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                      type="number"
                      value={watch("physical_environment_total_female") || ""}
                      readOnly
                      min={0}
                      className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                      type="number"
                      value={watch("physical_environment_total") || ""}
                      readOnly
                      min={0}
                      className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <hr />
      <div className="py-4 px-4 flex justify-between">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-8 md:px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(4)}
        >
          Back
        </button>
        <button
          type="submit"
          className="w-auto rounded-md bg-savoy-blue px-8 md:px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default ReportOfDisease;
