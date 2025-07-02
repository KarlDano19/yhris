import React from "react";

interface DiseaseDueToVibrationProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const DiseaseDueToVibration: React.FC<DiseaseDueToVibrationProps> = ({ register, setValue, watch }) => {
  // Get values for mobile inputs
  const deafness_noise_induced_male = watch ? watch("deafness_noise_induced_male") : "";
  const deafness_noise_induced_female = watch ? watch("deafness_noise_induced_female") : "";
  const deafness_noise_induced_total = watch ? watch("deafness_noise_induced_total") : "";
  const white_fingers_disease_male = watch ? watch("white_fingers_disease_male") : "";
  const white_fingers_disease_female = watch ? watch("white_fingers_disease_female") : "";
  const white_fingers_disease_total = watch ? watch("white_fingers_disease_total") : "";
  const musculo_skeletal_disturbances_male = watch ? watch("musculo_skeletal_disturbances_male") : "";
  const musculo_skeletal_disturbances_female = watch ? watch("musculo_skeletal_disturbances_female") : "";
  const musculo_skeletal_disturbances_total = watch ? watch("musculo_skeletal_disturbances_total") : "";
  const fatigue_male = watch ? watch("fatigue_male") : "";
  const fatigue_female = watch ? watch("fatigue_female") : "";
  const fatigue_total = watch ? watch("fatigue_total") : "";

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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Deafness (noise induced)</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={deafness_noise_induced_male || ""}
            onChange={(e) => setValue && setValue("deafness_noise_induced_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={deafness_noise_induced_female || ""}
            onChange={(e) => setValue && setValue("deafness_noise_induced_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={deafness_noise_induced_total || ""}
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">White fingers disease</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={white_fingers_disease_male || ""}
            onChange={(e) => setValue && setValue("white_fingers_disease_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={white_fingers_disease_female || ""}
            onChange={(e) => setValue && setValue("white_fingers_disease_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={white_fingers_disease_total || ""}
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Musculo-skeletal disturbances</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={musculo_skeletal_disturbances_male || ""}
            onChange={(e) => setValue && setValue("musculo_skeletal_disturbances_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={musculo_skeletal_disturbances_female || ""}
            onChange={(e) => setValue && setValue("musculo_skeletal_disturbances_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={musculo_skeletal_disturbances_total || ""}
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
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Fatigue</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={fatigue_male || ""}
            onChange={(e) => setValue && setValue("fatigue_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={fatigue_female || ""}
            onChange={(e) => setValue && setValue("fatigue_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={fatigue_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
  </>
  );
};

export default DiseaseDueToVibration;
