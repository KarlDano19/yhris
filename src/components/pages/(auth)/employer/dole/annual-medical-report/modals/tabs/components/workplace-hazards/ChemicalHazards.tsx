import React from "react";

interface ChemicalHazardsProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const ChemicalHazards: React.FC<ChemicalHazardsProps> = ({ register, setValue, watch }) => {
  // Watch values for all fields
  const dust_sources = watch ? watch("dust_sources") : "";
  const dust_workers_exposed = watch ? watch("dust_workers_exposed") : "";
  const liquids_sources = watch ? watch("liquids_sources") : "";
  const liquids_workers_exposed = watch ? watch("liquids_workers_exposed") : "";
  const mist_fumes_vapors_sources = watch ? watch("mist_fumes_vapors_sources") : "";
  const mist_fumes_vapors_workers_exposed = watch ? watch("mist_fumes_vapors_workers_exposed") : "";
  const gas_sources = watch ? watch("gas_sources") : "";
  const gas_workers_exposed = watch ? watch("gas_workers_exposed") : "";
  const others_chemical_hazards_sources = watch ? watch("others_chemical_hazards_sources") : "";
  const others_chemical_hazards_workers_exposed = watch ? watch("others_chemical_hazards_workers_exposed") : "";

  return (
    <>
      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
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
              type="number"
              {...register(`dust_workers_exposed`)}
              id={`dust_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Dust (Ex. Silica dust)</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={dust_sources || ""}
              onChange={(e) => setValue && setValue("dust_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={dust_workers_exposed || ""}
              onChange={(e) => setValue && setValue("dust_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
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
              type="number"
              {...register(`liquids_workers_exposed`)}
              id={`liquids_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Liquids (Ex. Mercury)</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={liquids_sources || ""}
              onChange={(e) => setValue && setValue("liquids_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={liquids_workers_exposed || ""}
              onChange={(e) => setValue && setValue("liquids_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
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
              type="number"
              {...register(`mist_fumes_vapors_workers_exposed`)}
              id={`mist_fumes_vapors_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Mist/ Fumes/ Vapors (Ex. Mist from paint)</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={mist_fumes_vapors_sources || ""}
              onChange={(e) => setValue && setValue("mist_fumes_vapors_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={mist_fumes_vapors_workers_exposed || ""}
              onChange={(e) => setValue && setValue("mist_fumes_vapors_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
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
              type="number"
              {...register(`gas_workers_exposed`)}
              id={`gas_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Gas (Ex. CO, H2S)</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={gas_sources || ""}
              onChange={(e) => setValue && setValue("gas_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={gas_workers_exposed || ""}
              onChange={(e) => setValue && setValue("gas_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
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
              {...register(`others_chemical_hazards_sources`)}
              id={`others_chemical_hazards_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`others_chemical_hazards_workers_exposed`)}
              id={`others_chemical_hazards_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Others</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={others_chemical_hazards_sources || ""}
              onChange={(e) => setValue && setValue("others_chemical_hazards_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={others_chemical_hazards_workers_exposed || ""}
              onChange={(e) => setValue && setValue("others_chemical_hazards_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChemicalHazards;
