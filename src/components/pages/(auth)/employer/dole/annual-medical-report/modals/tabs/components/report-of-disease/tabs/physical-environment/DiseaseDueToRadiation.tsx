import React from "react";

interface DiseaseDueToRadiationProps {
  register: any;
}

const DiseaseDueToRadiation: React.FC<DiseaseDueToRadiationProps> = ({ register }) => {
  return (
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
  );
};

export default DiseaseDueToRadiation;
