import React from "react";

interface HeadProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const Head: React.FC<HeadProps> = ({ register, setValue, watch }) => {
  // Get values for mobile inputs
  const tension_headache_male = watch ? watch("tension_headache_male") : "";
  const tension_headache_female = watch ? watch("tension_headache_female") : "";
  const tension_headache_total = watch ? watch("tension_headache_total") : "";
  
  const others_head_male = watch ? watch("others_head_male") : "";
  const others_head_female = watch ? watch("others_head_female") : "";
  const others_head_total = watch ? watch("others_head_total") : "";

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
      
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Tension headache</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={tension_headache_male || ""}
              onChange={(e) => setValue && setValue("tension_headache_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={tension_headache_female || ""}
              onChange={(e) => setValue && setValue("tension_headache_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={tension_headache_total || ""}
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
      
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Others</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={others_head_male || ""}
              onChange={(e) => setValue && setValue("others_head_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={others_head_female || ""}
              onChange={(e) => setValue && setValue("others_head_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={others_head_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Head;
