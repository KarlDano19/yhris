import React from "react";

interface SkinProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const Skin: React.FC<SkinProps> = ({ register, setValue, watch }) => {
  // Get values for mobile inputs
  const allergy_male = watch ? watch("allergy_male") : "";
  const allergy_female = watch ? watch("allergy_female") : "";
  const allergy_total = watch ? watch("allergy_total") : "";
  
  const dermatoses_male = watch ? watch("dermatoses_male") : "";
  const dermatoses_female = watch ? watch("dermatoses_female") : "";
  const dermatoses_total = watch ? watch("dermatoses_total") : "";
  
  const infection_as_folliculitis_abscess_paronychia_male = watch ? watch("infection_as_folliculitis_abscess_paronychia_male") : "";
  const infection_as_folliculitis_abscess_paronychia_female = watch ? watch("infection_as_folliculitis_abscess_paronychia_female") : "";
  const infection_as_folliculitis_abscess_paronychia_total = watch ? watch("infection_as_folliculitis_abscess_paronychia_total") : "";
  
  const others_skin_male = watch ? watch("others_skin_male") : "";
  const others_skin_female = watch ? watch("others_skin_female") : "";
  const others_skin_total = watch ? watch("others_skin_total") : "";

  return (
    <>
      {/* Desktop header - hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
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
      
      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-4 gap-6 pb-6">
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
      
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Allergy</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={allergy_male || ""}
              onChange={(e) => setValue && setValue("allergy_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={allergy_female || ""}
              onChange={(e) => setValue && setValue("allergy_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={allergy_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-4 gap-6 pb-6">
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
      
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Dermatoses</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={dermatoses_male || ""}
              onChange={(e) => setValue && setValue("dermatoses_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={dermatoses_female || ""}
              onChange={(e) => setValue && setValue("dermatoses_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={dermatoses_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-4 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
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
      
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Infection as folliculitis abscess/paro nychia</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={infection_as_folliculitis_abscess_paronychia_male || ""}
              onChange={(e) => setValue && setValue("infection_as_folliculitis_abscess_paronychia_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={infection_as_folliculitis_abscess_paronychia_female || ""}
              onChange={(e) => setValue && setValue("infection_as_folliculitis_abscess_paronychia_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={infection_as_folliculitis_abscess_paronychia_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-4 gap-6 pb-6">
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
      
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Others</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={others_skin_male || ""}
              onChange={(e) => setValue && setValue("others_skin_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={others_skin_female || ""}
              onChange={(e) => setValue && setValue("others_skin_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={others_skin_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Skin;
