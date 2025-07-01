"use client";

import { useState, useEffect } from "react";

import classNames from "@/helpers/classNames";

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

  // Auto-calculate totals

  // Watch all fields
  const watchedValues = watch();
  
  useEffect(() => {
    // Helper function to calculate totals
    const calculateTotal = (baseFieldName: string) => {
      const maleValue = Number(watchedValues[`${baseFieldName}_male`]) || 0;
      const femaleValue = Number(watchedValues[`${baseFieldName}_female`]) || 0;
      setValue(`${baseFieldName}_total`, maleValue + femaleValue);
    };

    // List of all base field names
    const fieldNames = [
      // Skin
      'allergy',
      'dermatoses',
      'infection_as_folliculitis_abscess_paronychia',
      'others_skin',
      
      // Head
      'tension_headache',
      'others_head',
      
      // Eyes
      'cataract',
      'error_of_refraction',
      'bacterial_viral_conjunctivities',
      'others_eyes',
      
      // Mouth & ENT
      'gingivitis',
      'herpes_labiales_nasalis',
      'otitis_media_externa',
      'deafness',
      'meniere_s_syndrome_vertigo',
      'rhinitis_colds',
      'nasal_polyps',
      'sinusitis',
      'tonsillapharyngitis',
      'laryngitis',
      'others_ent',

      // Respiratory
      'bronchitis',
      'bronchial_asthma',
      'pneumonia',
      'tuberculosis',
      'pneumoconiosis',
      'others_respiratory',

      // Heart and Blood Vessels
      'hypertension',
      'hypotension',
      'angina_pectoria',
      'myocardial_infarction',
      'vascular_disturbance',
      'others_heart',

      // Gastrointestinal
      'gastroenteritis_diarhea',
      'amoebiasis',
      'gastritis_hyperacidity',
      'appendicitis',
      'infectious_hepatitis',
      'liver_cirrhosis',
      'hepatic_abscess',
      'cancer_hepatic_gastric',
      'ulcer',
      'others_gastrointestinal',

      // Genito Urinary
      'urinary_tract_infection',
      'stones',
      'cancer',
      'others_genitourinary',

      // Reproductive
      'dysmenorrhea',
      'infection_cervicitis_vaginitis',
      'abortion_spontaneous_threatened',
      'hyperemesis_gravidarum',
      'uterine_tumors',
      'cervical_polyp_cancer',
      'ovarian_cyst_tumors',
      'sexually_transmitted_diseases',
      'hermia_inguinal_femoral',
      'others_reproductive',

      // Neuromuscular / Skeletal / Joints
      'peripheral_neuritis',
      'torticollis',
      'arthritis',
      'others_skeletal',

      // Lymphatic and Immune System
      'anemia',
      'leukemia',
      'cerebrovascular_accident',
      'lymphadenitis',
      'lymphoma',

      // Infectious Diseases
      'influenza',
      'typhoid_fever',
      'cholera',
      'measles',
      'tetanus',
      'malaria',
      'schistosomiasis',
      'herpes_zoster',
      'chicken_pox',
      'german_measles',
      'rabies',
      'others_infectious',

      // Diseases due to Noise and Vibration
      'deafness_noise_induced',
      'white_fingers_disease',
      'musculo_skeletal_disturbances',
      'fatigue',

      // Diseases due to Temperature And Humidity abnormalities
      'heat_stroke',
      'heat_cramps',
      'dehydration',
      'heat_exhaustion',
      'others_heat',

      // Diseases due to Radiation
      'decompression_sickness',
      'air_embolism',
      'bends_disease',
      'barotrauma',
      'hypoxia',
      'altitude_sickness',
      'cataract_radiation',
      'keratitis',
      'burns',
      'radiation_related_cancers',
    ];

    // Calculate totals for all fields
    fieldNames.forEach(calculateTotal);
    
  }, [watch, setValue, watchedValues]);

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-row gap-4 pl-6 pt-4">
        <div
          className={classNames(
            "px-4 py-2 rounded-md",
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
            "px-4 py-2 rounded-md",
            isPhysicalEnvironmentOpen
              ? "bg-savoy-blue text-white"
              : "bg-white text-gray-500"
          )}
          onClick={togglePhysicalEnvironmentOpen}
        >
          Disease due to Physical Environment
        </div>
      </div>
      <div className="gap-6 mt-4 pl-6 mb-6 flex flex-row">
        {isDiseaseOpen && (
          <div className="pr-8">
            <label
              htmlFor="purpose_of_wem_request"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Number of consultations/treatments for the following diseases:
              <span className="text-red-600">*</span>
            </label>
            <div
              className="flex justify-start items-center mb-4 pt-6"
              onClick={toggleSkinOpen}
            >
              <h1 className="text-sm font-bold pl-10 flex flex-row items-center">
                Skin
                <span className="ml-2 cursor-pointer">
                  {isSkinOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isSkinOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        allergy
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`allergy_male`)}
                        id={`allergy_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`allergy_female`)}
                        id={`allergy_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`allergy_total`)}
                        id={`allergy_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        dermatoses
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`dermatoses_male`)}
                        id={`dermatoses_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`dermatoses_female`)}
                        id={`dermatoses_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`dermatoses_total`)}
                        id={`dermatoses_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        infection as folliculitis abscess/paro nychia
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(
                          `infection_as_folliculitis_abscess_paronychia_male`
                        )}
                        id={`infection_as_folliculitis_abscess_paronychia_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(
                          `infection_as_folliculitis_abscess_paronychia_female`
                        )}
                        id={`infection_as_folliculitis_abscess_paronychia_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(
                          `infection_as_folliculitis_abscess_paronychia_total`
                        )}
                        id={`infection_as_folliculitis_abscess_paronychia_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_skin_male`)}
                        id={`others_skin_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_skin_female`)}
                        id={`others_skin_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_skin_total`)}
                        id={`others_skin_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleHeadOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                Head
                <span className="ml-2 cursor-pointer">
                  {isHeadOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isHeadOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Tension headache
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`tension_headache_male`)}
                        id={`tension_headache_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`tension_headache_female`)}
                        id={`tension_headache_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`tension_headache_total`)}
                        id={`tension_headache_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_head_male`)}
                        id={`others_head_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_head_female`)}
                        id={`others_head_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_head_total`)}
                        id={`others_head_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleEyesOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                Eyes
                <span className="ml-2 cursor-pointer">
                  {isEyesOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isEyesOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        cataract
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`cataract_male`)}
                        id={`cataract_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cataract_female`)}
                        id={`cataract_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cataract_total`)}
                        id={`cataract_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        error of refraction
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`error_of_refraction_male`)}
                        id={`error_of_refraction_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`error_of_refraction_female`)}
                        id={`error_of_refraction_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`error_of_refraction_total`)}
                        id={`error_of_refraction_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        bacterial/viral conjunctivities
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`bacterial_viral_conjunctivities_male`)}
                        id={`bacterial_viral_conjunctivities_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`bacterial_viral_conjunctivities_female`)}
                        id={`bacterial_viral_conjunctivities_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`bacterial_viral_conjunctivities_total`)}
                        id={`bacterial_viral_conjunctivities_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_eyes_male`)}
                        id={`others_eyes_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_eyes_female`)}
                        id={`others_eyes_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_eyes_total`)}
                        id={`others_eyes_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleMountENTOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                Mount & ENT
                <span className="ml-2 cursor-pointer">
                  {isMountENTOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isMountENTOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Gingivitis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`gingivitis_male`)}
                        id={`gingivitis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`gingivitis_female`)}
                        id={`gingivitis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`gingivitis_total`)}
                        id={`gingivitis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Herpes labiales/ nasalis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`herpes_labiales_nasalis_male`)}
                        id={`herpes_labiales_nasalis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`herpes_labiales_nasalis_female`)}
                        id={`herpes_labiales_nasalis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`herpes_labiales_nasalis_total`)}
                        id={`herpes_labiales_nasalis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Otitis media/ Externa
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`otitis_media_externa_male`)}
                        id={`otitis_media_externa_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`otitis_media_externa_female`)}
                        id={`otitis_media_externa_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`otitis_media_externa_total`)}
                        id={`otitis_media_externa_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Deafness
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`deafness_male`)}
                        id={`deafness_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`deafness_female`)}
                        id={`deafness_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`deafness_total`)}
                        id={`deafness_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Meniere&apos;s syndrome/ Vertigo
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`meniere_s_syndrome_vertigo_male`)}
                        id={`meniere_s_syndrome_vertigo_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`meniere_s_syndrome_vertigo_female`)}
                        id={`meniere_s_syndrome_vertigo_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`meniere_s_syndrome_vertigo_total`)}
                        id={`meniere_s_syndrome_vertigo_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Rhinitis/ Colds
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`rhinitis_colds_male`)}
                        id={`rhinitis_colds_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`rhinitis_colds_female`)}
                        id={`rhinitis_colds_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`rhinitis_colds_total`)}
                        id={`rhinitis_colds_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Nasal polyps
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`nasal_polyps_male`)}
                        id={`nasal_polyps_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`nasal_polyps_female`)}
                        id={`nasal_polyps_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`nasal_polyps_total`)}
                        id={`nasal_polyps_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Sinusitis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`sinusitis_male`)}
                        id={`sinusitis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`sinusitis_female`)}
                        id={`sinusitis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`sinusitis_total`)}
                        id={`sinusitis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Tonsillapharyngitis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`tonsillapharyngitis_male`)}
                        id={`tonsillapharyngitis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`tonsillapharyngitis_female`)}
                        id={`tonsillapharyngitis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`tonsillapharyngitis_total`)}
                        id={`tonsillapharyngitis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Laryngitis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`laryngitis_male`)}
                        id={`laryngitis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`laryngitis_female`)}
                        id={`laryngitis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`laryngitis_total`)}
                        id={`laryngitis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_ent_male`)}
                        id={`others_ent_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_ent_female`)}
                        id={`others_ent_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_ent_total`)}
                        id={`others_ent_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleRespiratoryOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                Respiratory
                <span className="ml-2 cursor-pointer">
                  {isRespiratoryOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isRespiratoryOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Bronchitis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`bronchitis_male`)}
                        id={`bronchitis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`bronchitis_female`)}
                        id={`bronchitis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`bronchitis_total`)}
                        id={`bronchitis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Bronchial Asthma
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`bronchial_asthma_male`)}
                        id={`bronchial_asthma_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`bronchial_asthma_female`)}
                        id={`bronchial_asthma_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`bronchial_asthma_total`)}
                        id={`bronchial_asthma_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Pneumonia
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`pneumonia_male`)}
                        id={`pneumonia_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`pneumonia_female`)}
                        id={`pneumonia_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`pneumonia_total`)}
                        id={`pneumonia_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Tuberculosis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`tuberculosis_male`)}
                        id={`tuberculosis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`tuberculosis_female`)}
                        id={`tuberculosis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`tuberculosis_total`)}
                        id={`tuberculosis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Pneumoconiosis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`pneumoconiosis_male`)}
                        id={`pneumoconiosis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`pneumoconiosis_female`)}
                        id={`pneumoconiosis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`pneumoconiosis_total`)}
                        id={`pneumoconiosis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_respiratory_male`)}
                        id={`others_respiratory_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_respiratory_female`)}
                        id={`others_respiratory_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_respiratory_total`)}
                        id={`others_respiratory_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleHeartOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                Heart and Blood Vessel
                <span className="ml-2 cursor-pointer">
                  {isHeartOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isHeartOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Hypertension
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`hypertension_male`)}
                        id={`hypertension_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hypertension_female`)}
                        id={`hypertension_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hypertension_total`)}
                        id={`hypertension_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Hypotension
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`hypotension_male`)}
                        id={`hypotension_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hypotension_female`)}
                        id={`hypotension_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hypotension_total`)}
                        id={`hypotension_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Angina Pectoria
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`angina_pectoria_male`)}
                        id={`angina_pectoria_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`angina_pectoria_female`)}
                        id={`angina_pectoria_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`angina_pectoria_total`)}
                        id={`angina_pectoria_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Myocardial Infarction
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`myocardial_infarction_male`)}
                        id={`myocardial_infarction_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`myocardial_infarction_female`)}
                        id={`myocardial_infarction_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`myocardial_infarction_total`)}
                        id={`myocardial_infarction_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Vascular Disturbance
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`vascular_disturbance_male`)}
                        id={`vascular_disturbance_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`vascular_disturbance_female`)}
                        id={`vascular_disturbance_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`vascular_disturbance_total`)}
                        id={`vascular_disturbance_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_heart_male`)}
                        id={`others_heart_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_heart_female`)}
                        id={`others_heart_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_heart_total`)}
                        id={`others_heart_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleGastrointestinalOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                Gastrointestinal
                <span className="ml-2 cursor-pointer">
                  {isGastrointestinalOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isGastrointestinalOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Gastroenteritis/ Diarhea
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`gastroenteritis_diarhea_male`)}
                        id={`gastroenteritis_diarhea_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`gastroenteritis_diarhea_female`)}
                        id={`gastroenteritis_diarhea_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`gastroenteritis_diarhea_total`)}
                        id={`gastroenteritis_diarhea_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Amoebiasis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`amoebiasis_male`)}
                        id={`amoebiasis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`amoebiasis_female`)}
                        id={`amoebiasis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`amoebiasis_total`)}
                        id={`amoebiasis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Gastritis/ Hyperacidity
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`gastritis_hyperacidity_male`)}
                        id={`gastritis_hyperacidity_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`gastritis_hyperacidity_female`)}
                        id={`gastritis_hyperacidity_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`gastritis_hyperacidity_total`)}
                        id={`gastritis_hyperacidity_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Appendicitis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`appendicitis_male`)}
                        id={`appendicitis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`appendicitis_female`)}
                        id={`appendicitis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`appendicitis_total`)}
                        id={`appendicitis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Infectious Hepatitis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`infectious_hepatitis_male`)}
                        id={`infectious_hepatitis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`infectious_hepatitis_female`)}
                        id={`infectious_hepatitis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`infectious_hepatitis_total`)}
                        id={`infectious_hepatitis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Liver Cirrhosis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`liver_cirrhosis_male`)}
                        id={`liver_cirrhosis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`liver_cirrhosis_female`)}
                        id={`liver_cirrhosis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`liver_cirrhosis_total`)}
                        id={`liver_cirrhosis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Hepatic Abscess
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hepatic_abscess_male`)}
                        id={`hepatic_abscess_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hepatic_abscess_female`)}
                        id={`hepatic_abscess_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hepatic_abscess_total`)}
                        id={`hepatic_abscess_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Cancer (hepatic/ gastric)
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cancer_hepatic_gastric_male`)}
                        id={`cancer_hepatic_gastric_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cancer_hepatic_gastric_female`)}
                        id={`cancer_hepatic_gastric_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cancer_hepatic_gastric_total`)}
                        id={`cancer_hepatic_gastric_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Ulcer
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`ulcer_male`)}
                        id={`ulcer_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`ulcer_female`)}
                        id={`ulcer_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`ulcer_total`)}
                        id={`ulcer_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_gastrointestinal_male`)}
                        id={`others_gastrointestinal_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_gastrointestinal_female`)}
                        id={`others_gastrointestinal_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_gastrointestinal_total`)}
                        id={`others_gastrointestinal_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleGenitourinaryOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                Genito Urinary
                <span className="ml-2 cursor-pointer">
                  {isGenitourinaryOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isGenitourinaryOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Urinary Tract Infection
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`urinary_tract_infection_male`)}
                        id={`urinary_tract_infection_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`urinary_tract_infection_female`)}
                        id={`urinary_tract_infection_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`urinary_tract_infection_total`)}
                        id={`urinary_tract_infection_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Stones
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`stones_male`)}
                        id={`stones_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`stones_female`)}
                        id={`stones_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`stones_total`)}
                        id={`stones_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Cancer
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`cancer_male`)}
                        id={`cancer_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cancer_female`)}
                        id={`cancer_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cancer_total`)}
                        id={`cancer_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_genitourinary_male`)}
                        id={`others_genitourinary_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_genitourinary_female`)}
                        id={`others_genitourinary_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_genitourinary_total`)}
                        id={`others_genitourinary_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleReproductiveOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                Reproductive
                <span className="ml-2 cursor-pointer">
                  {isReproductiveOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isReproductiveOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Dysmenorrhea
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`dysmenorrhea_male`)}
                        id={`dysmenorrhea_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`dysmenorrhea_female`)}
                        id={`dysmenorrhea_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`dysmenorrhea_total`)}
                        id={`dysmenorrhea_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Infection (Cervicitis/ Vaginitis)
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`infection_cervicitis_vaginitis_male`)}
                        id={`infection_cervicitis_vaginitis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`infection_cervicitis_vaginitis_female`)}
                        id={`infection_cervicitis_vaginitis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`infection_cervicitis_vaginitis_total`)}
                        id={`infection_cervicitis_vaginitis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Abortion (Spontaneous/ Threatened)
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`abortion_spontaneous_threatened_male`)}
                        id={`abortion_spontaneous_threatened_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`abortion_spontaneous_threatened_female`)}
                        id={`abortion_spontaneous_threatened_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`abortion_spontaneous_threatened_total`)}
                        id={`abortion_spontaneous_threatened_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Hyperemesis Gravidarum
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`hyperemesis_gravidarum_male`)}
                        id={`hyperemesis_gravidarum_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hyperemesis_gravidarum_female`)}
                        id={`hyperemesis_gravidarum_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hyperemesis_gravidarum_total`)}
                        id={`hyperemesis_gravidarum_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Uterine Tumors
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`uterine_tumors_male`)}
                        id={`uterine_tumors_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`uterine_tumors_female`)}
                        id={`uterine_tumors_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`uterine_tumors_total`)}
                        id={`uterine_tumors_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Cervical Polyp/ Cancer
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`cervical_polyp_cancer_male`)}
                        id={`cervical_polyp_cancer_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cervical_polyp_cancer_female`)}
                        id={`cervical_polyp_cancer_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cervical_polyp_cancer_total`)}
                        id={`cervical_polyp_cancer_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Ovarian Cyst/ Tumors
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`ovarian_cyst_tumors_male`)}
                        id={`ovarian_cyst_tumors_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`ovarian_cyst_tumors_female`)}
                        id={`ovarian_cyst_tumors_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`ovarian_cyst_tumors_total`)}
                        id={`ovarian_cyst_tumors_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Sexually Transmitted Diseases
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`sexually_transmitted_diseases_male`)}
                        id={`sexually_transmitted_diseases_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`sexually_transmitted_diseases_female`)}
                        id={`sexually_transmitted_diseases_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`sexually_transmitted_diseases_total`)}
                        id={`sexually_transmitted_diseases_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Hermia (Inguinal / Femoral)
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`hermia_inguinal_femoral_male`)}
                        id={`hermia_inguinal_femoral_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hermia_inguinal_femoral_female`)}
                        id={`hermia_inguinal_femoral_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hermia_inguinal_femoral_total`)}
                        id={`hermia_inguinal_femoral_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_reproductive_male`)}
                        id={`others_reproductive_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_reproductive_female`)}
                        id={`others_reproductive_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_reproductive_total`)}
                        id={`others_reproductive_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleNeurologicalOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                Neuromuscular/ Skeletal/ Joints
                <span className="ml-2 cursor-pointer">
                  {isNeurologicalOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isNeurologicalOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Peripheral Neuritis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`peripheral_neuritis_male`)}
                        id={`peripheral_neuritis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`peripheral_neuritis_female`)}
                        id={`peripheral_neuritis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`peripheral_neuritis_total`)}
                        id={`peripheral_neuritis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Torticollis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`torticollis_male`)}
                        id={`torticollis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`torticollis_female`)}
                        id={`torticollis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`torticollis_total`)}
                        id={`torticollis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Athritis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`arthritis_male`)}
                        id={`arthritis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`arthritis_female`)}
                        id={`arthritis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`arthritis_total`)}
                        id={`arthritis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_skeletal_male`)}
                        id={`others_skeletal_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_skeletal_female`)}
                        id={`others_skeletal_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_skeletal_total`)}
                        id={`others_skeletal_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleLymphaticOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                Lymphatic and Immune System
                <span className="ml-2 cursor-pointer">
                  {isLymphaticOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isLymphaticOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Anemia
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`anemia_male`)}
                        id={`anemia_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`anemia_female`)}
                        id={`anemia_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`anemia_total`)}
                        id={`anemia_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Leukemia
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`leukemia_male`)}
                        id={`leukemia_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`leukemia_female`)}
                        id={`leukemia_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`leukemia_total`)}
                        id={`leukemia_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Cerebrovascular Accident
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`cerebrovascular_accident_male`)}
                        id={`cerebrovascular_accident_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cerebrovascular_accident_female`)}
                        id={`cerebrovascular_accident_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cerebrovascular_accident_total`)}
                        id={`cerebrovascular_accident_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Lymphadenitis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`lymphadenitis_male`)}
                        id={`lymphadenitis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`lymphadenitis_female`)}
                        id={`lymphadenitis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`lymphadenitis_total`)}
                        id={`lymphadenitis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Lymphoma
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`lymphoma_male`)}
                        id={`lymphoma_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`lymphoma_female`)}
                        id={`lymphoma_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`lymphoma_total`)}
                        id={`lymphoma_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleInfectionOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                Infectious Diseases
                <span className="ml-2 cursor-pointer">
                  {isInfectionOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isInfectionOpen && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div>{""}</div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Male</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">Female</h1>
                  </div>
                  <div>
                    <h1 className="text-sm font-medium text-center">
                      Total Number of Cases
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Influenza
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`influenza_male`)}
                        id={`influenza_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`influenza_female`)}
                        id={`influenza_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`influenza_total`)}
                        id={`influenza_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Typhoid/ Paratyphoid Fever
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`typhoid_fever_male`)}
                        id={`typhoid_fever_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`typhoid_fever_female`)}
                        id={`typhoid_fever_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`typhoid_fever_total`)}
                        id={`typhoid_fever_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Cholera
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`cholera_male`)}
                        id={`cholera_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cholera_female`)}
                        id={`cholera_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cholera_total`)}
                        id={`cholera_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Measles
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`measles_male`)}
                        id={`measles_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`measles_female`)}
                        id={`measles_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`measles_total`)}
                        id={`measles_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Tetanus
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`tetanus_male`)}
                        id={`tetanus_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`tetanus_female`)}
                        id={`tetanus_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`tetanus_total`)}
                        id={`tetanus_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Malaria
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`malaria_male`)}
                        id={`malaria_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`malaria_female`)}
                        id={`malaria_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`malaria_total`)}
                        id={`malaria_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Schistosomiasis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`schistosomiasis_male`)}
                        id={`schistosomiasis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`schistosomiasis_female`)}
                        id={`schistosomiasis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`schistosomiasis_total`)}
                        id={`schistosomiasis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Herpes Zoster
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`herpes_zoster_male`)}
                        id={`herpes_zoster_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`herpes_zoster_female`)}
                        id={`herpes_zoster_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`herpes_zoster_total`)}
                        id={`herpes_zoster_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Chicken Pox
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`chicken_pox_male`)}
                        id={`chicken_pox_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`chicken_pox_female`)}
                        id={`chicken_pox_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`chicken_pox_total`)}
                        id={`chicken_pox_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        German Measles
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`german_measles_male`)}
                        id={`german_measles_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`german_measles_female`)}
                        id={`german_measles_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`german_measles_total`)}
                        id={`german_measles_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Rabies
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`rabies_male`)}
                        id={`rabies_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`rabies_female`)}
                        id={`rabies_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`rabies_total`)}
                        id={`rabies_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_infectious_male`)}
                        id={`others_infectious_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_infectious_female`)}
                        id={`others_infectious_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_infectious_total`)}
                        id={`others_infectious_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {isPhysicalEnvironmentOpen && (
        <>
          <div className="pr-8">
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleDiseaseDueToVibrationOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                a. Diseases due to Noise and vibration
                <span className="ml-2 cursor-pointer">
                  {isDiseaseDueToVibrationOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isDiseaseDueToVibrationOpen && (
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
                        Deafness (noise induced)
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`deafness_noise_induced_male`)}
                        id={`deafness_noise_induced_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`deafness_noise_induced_female`)}
                        id={`deafness_noise_induced_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`deafness_noise_induced_total`)}
                        id={`deafness_noise_induced_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        White fingers disease
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`white_fingers_disease_male`)}
                        id={`white_fingers_disease_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`white_fingers_disease_female`)}
                        id={`white_fingers_disease_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`white_fingers_disease_total`)}
                        id={`white_fingers_disease_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Musculo-skeletal disturbances
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`musculo_skeletal_disturbances_male`)}
                        id={`musculo_skeletal_disturbances_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`musculo_skeletal_disturbances_female`)}
                        id={`musculo_skeletal_disturbances_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`musculo_skeletal_disturbances_total`)}
                        id={`musculo_skeletal_disturbances_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Fatigue
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`fatigue_male`)}
                        id={`fatigue_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`fatigue_female`)}
                        id={`fatigue_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`fatigue_total`)}
                        id={`fatigue_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleDiseaseDueToTemperatureOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                b. Diseases due to Temperature And Humidity abnormalities:
                <span className="ml-2 cursor-pointer">
                  {isDiseaseDueToTemperatureOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isDiseaseDueToTemperatureOpen && (
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
                        Heat stroke
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`heat_stroke_male`)}
                        id={`heat_stroke_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`heat_stroke_female`)}
                        id={`heat_stroke_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`heat_stroke_total`)}
                        id={`heat_stroke_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Heat cramps
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`heat_cramps_male`)}
                        id={`heat_cramps_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`heat_cramps_female`)}
                        id={`heat_cramps_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`heat_cramps_total`)}
                        id={`heat_cramps_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Dehydration
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`dehydration_male`)}
                        id={`dehydration_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`dehydration_female`)}
                        id={`dehydration_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`dehydration_total`)}
                        id={`dehydration_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Heat exhaustion
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`heat_exhaustion_male`)}
                        id={`heat_exhaustion_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`heat_exhaustion_female`)}
                        id={`heat_exhaustion_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`heat_exhaustion_total`)}
                        id={`heat_exhaustion_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                        type="number"
                        {...register(`others_heat_male`)}
                        id={`others_heat_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_heat_female`)}
                        id={`others_heat_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`others_heat_total`)}
                        id={`others_heat_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="gap-4 pl-6 pt-4 pb-4">
                  <h1 className="text-lg font-medium ">Cold Temperature</h1>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Decompression sickness
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`decompression_sickness_male`)}
                        id={`decompression_sickness_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`decompression_sickness_female`)}
                        id={`decompression_sickness_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`decompression_sickness_total`)}
                        id={`decompression_sickness_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Air embolism
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`air_embolism_male`)}
                        id={`air_embolism_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`air_embolism_female`)}
                        id={`air_embolism_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`air_embolism_total`)}
                        id={`air_embolism_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Bends Disease
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`bends_disease_male`)}
                        id={`bends_disease_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`bends_disease_female`)}
                        id={`bends_disease_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`bends_disease_total`)}
                        id={`bends_disease_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Barotrauma
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`barotrauma_male`)}
                        id={`barotrauma_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`barotrauma_female`)}
                        id={`barotrauma_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`barotrauma_total`)}
                        id={`barotrauma_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Hypoxia
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`hypoxia_male`)}
                        id={`hypoxia_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hypoxia_female`)}
                        id={`hypoxia_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`hypoxia_total`)}
                        id={`hypoxia_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Altitude sickness
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`altitude_sickness_male`)}
                        id={`altitude_sickness_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`altitude_sickness_female`)}
                        id={`altitude_sickness_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`altitude_sickness_total`)}
                        id={`altitude_sickness_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-start items-center mb-4"
              onClick={toggleDiseaseDueToRadiationOpen}
            >
              <h1 className="text-sm font-bold pl-10 pt-4 flex flex-row items-center">
                c. Diseases due to radiation:
                <span className="ml-2 cursor-pointer">
                  {isDiseaseDueToRadiationOpen ? 
                    <span className="text-red-600 font-medium">hide</span> : 
                    <span className="text-green-600 font-medium">show</span>
                  }
                </span>
              </h1>
            </div>
            {isDiseaseDueToRadiationOpen && (
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
                        Cataract
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`cataract_radiation_male`)}
                        id={`cataract_radiation_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cataract_radiation_female`)}
                        id={`cataract_radiation_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`cataract_radiation_total`)}
                        id={`cataract_radiation_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                        Keratitis
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`keratitis_male`)}
                        id={`keratitis_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`keratitis_female`)}
                        id={`keratitis_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`keratitis_total`)}
                        id={`keratitis_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Burns
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`burns_male`)}
                        id={`burns_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`burns_female`)}
                        id={`burns_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`burns_total`)}
                        id={`burns_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 pb-6">
                  <div className="flex justify-start items-center pl-6">
                    <div className="grid-item">
                      <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                        Radiation-related cancers
                      </h1>
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2 flex flex-row items-center">
                      <input
                        type="number"
                        {...register(`radiation_related_cancers_male`)}
                        id={`radiation_related_cancers_male`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`radiation_related_cancers_female`)}
                        id={`radiation_related_cancers_female`}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="grid-item">
                    <div className="mt-2">
                      <input
                        type="number"
                        {...register(`radiation_related_cancers_total`)}
                        id={`radiation_related_cancers_total`}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
      <hr />
      <div className="py-4 px-4 flex justify-between">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(4)}
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

export default ReportOfDisease;
