import React from "react";

interface PhysicalHazardsProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const PhysicalHazards: React.FC<PhysicalHazardsProps> = ({ register, setValue, watch }) => {
  // Watch values for all fields
  const noise_sources = watch ? watch("noise_sources") : "";
  const noise_workers_exposed = watch ? watch("noise_workers_exposed") : "";
  const temperature_humidity_sources = watch ? watch("temperature_humidity_sources") : "";
  const temperature_humidity_workers_exposed = watch ? watch("temperature_humidity_workers_exposed") : "";
  const pressure_sources = watch ? watch("pressure_sources") : "";
  const pressure_workers_exposed = watch ? watch("pressure_workers_exposed") : "";
  const illumination_sources = watch ? watch("illumination_sources") : "";
  const illumination_workers_exposed = watch ? watch("illumination_workers_exposed") : "";
  const radiation_ultraviolet_microwave_sources = watch ? watch("radiation_ultraviolet_microwave_sources") : "";
  const radiation_ultraviolet_microwave_workers_exposed = watch ? watch("radiation_ultraviolet_microwave_workers_exposed") : "";
  const vibration_sources = watch ? watch("vibration_sources") : "";
  const vibration_workers_exposed = watch ? watch("vibration_workers_exposed") : "";
  const others_physical_hazards_sources = watch ? watch("others_physical_hazards_sources") : "";
  const others_physical_hazards_workers_exposed = watch ? watch("others_physical_hazards_workers_exposed") : "";

  return (
    <>
      {/* Desktop layout - hidden on mobile: Noise */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Noise
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="text"
              {...register(`noise_sources`)}
              id={`noise_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`noise_workers_exposed`)}
              id={`noise_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Noise */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Noise</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={noise_sources || ""}
              onChange={(e) => setValue && setValue("noise_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={noise_workers_exposed || ""}
              onChange={(e) => setValue && setValue("noise_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Temperature/ Humidity */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Temperature/ Humidity
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="text"
              {...register(`temperature_humidity_sources`)}
              id={`temperature_humidity_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`temperature_humidity_workers_exposed`)}
              id={`temperature_humidity_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Temperature/ Humidity */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Temperature/ Humidity</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={temperature_humidity_sources || ""}
              onChange={(e) => setValue && setValue("temperature_humidity_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={temperature_humidity_workers_exposed || ""}
              onChange={(e) => setValue && setValue("temperature_humidity_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Pressure */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Pressure
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="text"
              {...register(`pressure_sources`)}
              id={`pressure_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`pressure_workers_exposed`)}
              id={`pressure_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Pressure */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Pressure</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={pressure_sources || ""}
              onChange={(e) => setValue && setValue("pressure_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={pressure_workers_exposed || ""}
              onChange={(e) => setValue && setValue("pressure_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Illumination */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Illumination
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="text"
              {...register(`illumination_sources`)}
              id={`illumination_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`illumination_workers_exposed`)}
              id={`illumination_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Illumination */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Illumination</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={illumination_sources || ""}
              onChange={(e) => setValue && setValue("illumination_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={illumination_workers_exposed || ""}
              onChange={(e) => setValue && setValue("illumination_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Radiation Ultraviolet/ Microwave */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Radiation Ultraviolet/ Microwave
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="text"
              {...register(`radiation_ultraviolet_microwave_sources`)}
              id={`radiation_ultraviolet_microwave_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`radiation_ultraviolet_microwave_workers_exposed`)}
              id={`radiation_ultraviolet_microwave_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Radiation Ultraviolet/ Microwave */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Radiation Ultraviolet/ Microwave</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={radiation_ultraviolet_microwave_sources || ""}
              onChange={(e) => setValue && setValue("radiation_ultraviolet_microwave_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={radiation_ultraviolet_microwave_workers_exposed || ""}
              onChange={(e) => setValue && setValue("radiation_ultraviolet_microwave_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Vibration */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Vibration
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="text"
              {...register(`vibration_sources`)}
              id={`vibration_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`vibration_workers_exposed`)}
              id={`vibration_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Vibration */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Vibration</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={vibration_sources || ""}
              onChange={(e) => setValue && setValue("vibration_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={vibration_workers_exposed || ""}
              onChange={(e) => setValue && setValue("vibration_workers_exposed", e.target.value)}
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
              {...register(`others_physical_hazards_sources`)}
              id={`others_physical_hazards_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`others_physical_hazards_workers_exposed`)}
              id={`others_physical_hazards_workers_exposed`}
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
              value={others_physical_hazards_sources || ""}
              onChange={(e) => setValue && setValue("others_physical_hazards_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={others_physical_hazards_workers_exposed || ""}
              onChange={(e) => setValue && setValue("others_physical_hazards_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PhysicalHazards;
