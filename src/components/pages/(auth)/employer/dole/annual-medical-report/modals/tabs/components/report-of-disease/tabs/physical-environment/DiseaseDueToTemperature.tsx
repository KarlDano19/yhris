import React from "react";

interface DiseaseDueToTemperatureProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const DiseaseDueToTemperature: React.FC<DiseaseDueToTemperatureProps> = ({ register, setValue, watch }) => {
  // Get values for mobile inputs
  const heat_stroke_male = watch ? watch("heat_stroke_male") : "";
  const heat_stroke_female = watch ? watch("heat_stroke_female") : "";
  const heat_stroke_total = watch ? watch("heat_stroke_total") : "";
  const heat_cramps_male = watch ? watch("heat_cramps_male") : "";
  const heat_cramps_female = watch ? watch("heat_cramps_female") : "";
  const heat_cramps_total = watch ? watch("heat_cramps_total") : "";
  const dehydration_male = watch ? watch("dehydration_male") : "";
  const dehydration_female = watch ? watch("dehydration_female") : "";
  const dehydration_total = watch ? watch("dehydration_total") : "";
  const heat_exhaustion_male = watch ? watch("heat_exhaustion_male") : "";
  const heat_exhaustion_female = watch ? watch("heat_exhaustion_female") : "";
  const heat_exhaustion_total = watch ? watch("heat_exhaustion_total") : "";
  const others_heat_male = watch ? watch("others_heat_male") : "";
  const others_heat_female = watch ? watch("others_heat_female") : "";
  const others_heat_total = watch ? watch("others_heat_total") : "";
  const decompression_sickness_male = watch ? watch("decompression_sickness_male") : "";
  const decompression_sickness_female = watch ? watch("decompression_sickness_female") : "";
  const decompression_sickness_total = watch ? watch("decompression_sickness_total") : "";
  const air_embolism_male = watch ? watch("air_embolism_male") : "";
  const air_embolism_female = watch ? watch("air_embolism_female") : "";
  const air_embolism_total = watch ? watch("air_embolism_total") : "";
  const bends_disease_male = watch ? watch("bends_disease_male") : "";
  const bends_disease_female = watch ? watch("bends_disease_female") : "";
  const bends_disease_total = watch ? watch("bends_disease_total") : "";
  const barotrauma_male = watch ? watch("barotrauma_male") : "";
  const barotrauma_female = watch ? watch("barotrauma_female") : "";
  const barotrauma_total = watch ? watch("barotrauma_total") : "";
  const hypoxia_male = watch ? watch("hypoxia_male") : "";
  const hypoxia_female = watch ? watch("hypoxia_female") : "";
  const hypoxia_total = watch ? watch("hypoxia_total") : "";
  const altitude_sickness_male = watch ? watch("altitude_sickness_male") : "";
  const altitude_sickness_female = watch ? watch("altitude_sickness_female") : "";
  const altitude_sickness_total = watch ? watch("altitude_sickness_total") : "";

  return (
    <>
    {/* Desktop header - hidden on mobile */}
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
    {/* Desktop layout - hidden on mobile */}
    <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Heat stroke</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={heat_stroke_male || ""}
            onChange={(e) => setValue && setValue("heat_stroke_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={heat_stroke_female || ""}
            onChange={(e) => setValue && setValue("heat_stroke_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={heat_stroke_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
    {/* Desktop layout - hidden on mobile */}
    <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Heat cramps</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={heat_cramps_male || ""}
            onChange={(e) => setValue && setValue("heat_cramps_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={heat_cramps_female || ""}
            onChange={(e) => setValue && setValue("heat_cramps_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={heat_cramps_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
    {/* Desktop layout - hidden on mobile */}
    <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Dehydration</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={dehydration_male || ""}
            onChange={(e) => setValue && setValue("dehydration_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={dehydration_female || ""}
            onChange={(e) => setValue && setValue("dehydration_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={dehydration_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
    {/* Desktop layout - hidden on mobile */}
    <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Heat exhaustion</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={heat_exhaustion_male || ""}
            onChange={(e) => setValue && setValue("heat_exhaustion_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={heat_exhaustion_female || ""}
            onChange={(e) => setValue && setValue("heat_exhaustion_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={heat_exhaustion_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
    {/* Desktop layout - hidden on mobile */}
    <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Others</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={others_heat_male || ""}
            onChange={(e) => setValue && setValue("others_heat_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={others_heat_female || ""}
            onChange={(e) => setValue && setValue("others_heat_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={others_heat_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
    {/* Desktop Cold Temperature header - hidden on mobile */}
    <div className="gap-4 pl-6 pt-4 pb-4 hidden md:block">
      <h1 className="text-lg font-medium ">Cold Temperature</h1>
    </div>
    {/* Mobile Cold Temperature header - hidden on desktop */}
    <div className="pl-7 block md:hidden pt-4 pb-4">
      <h1 className="text-lg font-medium">Cold Temperature</h1>
    </div>
    {/* Desktop layout - hidden on mobile */}
    <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Decompression sickness</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={decompression_sickness_male || ""}
            onChange={(e) => setValue && setValue("decompression_sickness_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={decompression_sickness_female || ""}
            onChange={(e) => setValue && setValue("decompression_sickness_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={decompression_sickness_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
    {/* Desktop layout - hidden on mobile */}
    <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Air embolism</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={air_embolism_male || ""}
            onChange={(e) => setValue && setValue("air_embolism_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={air_embolism_female || ""}
            onChange={(e) => setValue && setValue("air_embolism_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={air_embolism_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
    {/* Desktop layout - hidden on mobile */}
    <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Bends Disease</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={bends_disease_male || ""}
            onChange={(e) => setValue && setValue("bends_disease_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={bends_disease_female || ""}
            onChange={(e) => setValue && setValue("bends_disease_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={bends_disease_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
    {/* Desktop layout - hidden on mobile */}
    <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Barotrauma</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={barotrauma_male || ""}
            onChange={(e) => setValue && setValue("barotrauma_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={barotrauma_female || ""}
            onChange={(e) => setValue && setValue("barotrauma_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={barotrauma_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
    {/* Desktop layout - hidden on mobile */}
    <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Hypoxia</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={hypoxia_male || ""}
            onChange={(e) => setValue && setValue("hypoxia_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={hypoxia_female || ""}
            onChange={(e) => setValue && setValue("hypoxia_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={hypoxia_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
    {/* Desktop layout - hidden on mobile */}
    <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Altitude sickness</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={altitude_sickness_male || ""}
            onChange={(e) => setValue && setValue("altitude_sickness_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={altitude_sickness_female || ""}
            onChange={(e) => setValue && setValue("altitude_sickness_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={altitude_sickness_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
  </>
  );
};

export default DiseaseDueToTemperature;
