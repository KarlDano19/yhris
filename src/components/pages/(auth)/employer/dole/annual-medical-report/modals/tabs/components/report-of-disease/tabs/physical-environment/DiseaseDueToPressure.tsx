import React from "react";

interface DiseaseDueToPressureProps {
  register: any;
  setValue: any;
  watch: any;
}

const DiseaseDueToPressure: React.FC<DiseaseDueToPressureProps> = ({ register, setValue, watch }) => {
  // Watch all radiation disease fields
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
    {/* Desktop Header - Hidden on Mobile */}
    <div className="hidden md:grid grid-cols-4 gap-4">
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

export default DiseaseDueToPressure;
