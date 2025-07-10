import React from "react";

interface DiseaseDueToRadiationProps {
  register: any;
  setValue: any;
  watch: any;
}

const DiseaseDueToRadiation: React.FC<DiseaseDueToRadiationProps> = ({ register, setValue, watch }) => {
  // Watch all radiation disease fields
  const cataractRadiationMale = watch("cataract_radiation_male") || 0;
  const cataractRadiationFemale = watch("cataract_radiation_female") || 0;
  const cataractRadiationTotal = watch("cataract_radiation_total") || 0;
  
  const keratitisMale = watch("keratitis_male") || 0;
  const keratitisFemale = watch("keratitis_female") || 0;
  const keratitisTotal = watch("keratitis_total") || 0;
  
  const burnsMale = watch("burns_male") || 0;
  const burnsFemale = watch("burns_female") || 0;
  const burnsTotal = watch("burns_total") || 0;
  
  const radiationRelatedCancersMale = watch("radiation_related_cancers_male") || 0;
  const radiationRelatedCancersFemale = watch("radiation_related_cancers_female") || 0;
  const radiationRelatedCancersTotal = watch("radiation_related_cancers_total") || 0;

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

    {/* Cataract - Desktop Layout */}
    <div className="hidden md:grid grid-cols-4 gap-6 pb-6">
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

    {/* Cataract - Mobile Layout */}
    <div className="md:hidden space-y-4 p-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Cataract</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Male</label>
            <input
              type="number"
              value={cataractRadiationMale}
              onChange={(e) => setValue("cataract_radiation_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Female</label>
            <input
              type="number"
              value={cataractRadiationFemale}
              onChange={(e) => setValue("cataract_radiation_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Total Number of Cases</label>
            <input
              type="number"
              value={cataractRadiationTotal}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Keratitis - Desktop Layout */}
    <div className="hidden md:grid grid-cols-4 gap-6 pb-6">
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

    {/* Keratitis - Mobile Layout */}
    <div className="md:hidden space-y-4 p-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Keratitis</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Male</label>
            <input
              type="number"
              value={keratitisMale}
              onChange={(e) => setValue("keratitis_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Female</label>
            <input
              type="number"
              value={keratitisFemale}
              onChange={(e) => setValue("keratitis_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Total Number of Cases</label>
            <input
              type="number"
              value={keratitisTotal}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Burns - Desktop Layout */}
    <div className="hidden md:grid grid-cols-4 gap-6 pb-6">
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

    {/* Burns - Mobile Layout */}
    <div className="md:hidden space-y-4 p-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Burns</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Male</label>
            <input
              type="number"
              value={burnsMale}
              onChange={(e) => setValue("burns_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Female</label>
            <input
              type="number"
              value={burnsFemale}
              onChange={(e) => setValue("burns_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Total Number of Cases</label>
            <input
              type="number"
              value={burnsTotal}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Radiation-related cancers - Desktop Layout */}
    <div className="hidden md:grid grid-cols-4 gap-6 pb-6">
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

    {/* Radiation-related cancers - Mobile Layout */}
    <div className="md:hidden space-y-4 p-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Radiation-related cancers</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Male</label>
            <input
              type="number"
              value={radiationRelatedCancersMale}
              onChange={(e) => setValue("radiation_related_cancers_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Female</label>
            <input
              type="number"
              value={radiationRelatedCancersFemale}
              onChange={(e) => setValue("radiation_related_cancers_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Total Number of Cases</label>
            <input
              type="number"
              value={radiationRelatedCancersTotal}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default DiseaseDueToRadiation;
