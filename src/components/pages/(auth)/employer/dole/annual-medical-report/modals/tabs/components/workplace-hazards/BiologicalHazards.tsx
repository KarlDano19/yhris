import React from "react";

interface BiologicalHazardsProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const BiologicalHazards: React.FC<BiologicalHazardsProps> = ({ register, setValue, watch }) => {
  // Watch values for all fields
  const viral_sources = watch ? watch("viral_sources") : "";
  const viral_workers_exposed = watch ? watch("viral_workers_exposed") : "";
  const bacterial_sources = watch ? watch("bacterial_sources") : "";
  const bacterial_workers_exposed = watch ? watch("bacterial_workers_exposed") : "";
  const fungal_sources = watch ? watch("fungal_sources") : "";
  const fungal_workers_exposed = watch ? watch("fungal_workers_exposed") : "";
  const parasitic_sources = watch ? watch("parasitic_sources") : "";
  const parasitic_workers_exposed = watch ? watch("parasitic_workers_exposed") : "";
  const others_sources = watch ? watch("others_sources") : "";
  const others_workers_exposed = watch ? watch("others_workers_exposed") : "";

  return (
    <>
      {/* Desktop layout - hidden on mobile: Viral */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Viral
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="text"
              {...register(`viral_sources`)}
              id={`viral_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`viral_workers_exposed`)}
              id={`viral_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Viral */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Viral</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={viral_sources || ""}
              onChange={(e) => setValue && setValue("viral_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={viral_workers_exposed || ""}
              onChange={(e) => setValue && setValue("viral_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Bacterial */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Bacterial
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="text"
              {...register(`bacterial_sources`)}
              id={`bacterial_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`bacterial_workers_exposed`)}
              id={`bacterial_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Bacterial */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Bacterial</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={bacterial_sources || ""}
              onChange={(e) => setValue && setValue("bacterial_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={bacterial_workers_exposed || ""}
              onChange={(e) => setValue && setValue("bacterial_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Fungal */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Fungal
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="text"
              {...register(`fungal_sources`)}
              id={`fungal_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`fungal_workers_exposed`)}
              id={`fungal_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Fungal */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Fungal</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={fungal_sources || ""}
              onChange={(e) => setValue && setValue("fungal_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={fungal_workers_exposed || ""}
              onChange={(e) => setValue && setValue("fungal_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Parasitic */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Parasitic
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="text"
              {...register(`parasitic_sources`)}
              id={`parasitic_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`parasitic_workers_exposed`)}
              id={`parasitic_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Parasitic */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Parasitic</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={parasitic_sources || ""}
              onChange={(e) => setValue && setValue("parasitic_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={parasitic_workers_exposed || ""}
              onChange={(e) => setValue && setValue("parasitic_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Others */}
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
              {...register(`others_sources`)}
              id={`others_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`others_workers_exposed`)}
              id={`others_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Others */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Others</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={others_sources || ""}
              onChange={(e) => setValue && setValue("others_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={others_workers_exposed || ""}
              onChange={(e) => setValue && setValue("others_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BiologicalHazards;
