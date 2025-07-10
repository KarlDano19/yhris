import React from "react";

interface HeartProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const Heart: React.FC<HeartProps> = ({ register, setValue, watch }) => {
  // Get values for mobile inputs
  const hypertension_male = watch ? watch("hypertension_male") : "";
  const hypertension_female = watch ? watch("hypertension_female") : "";
  const hypertension_total = watch ? watch("hypertension_total") : "";
  const hypotension_male = watch ? watch("hypotension_male") : "";
  const hypotension_female = watch ? watch("hypotension_female") : "";
  const hypotension_total = watch ? watch("hypotension_total") : "";
  const angina_pectoria_male = watch ? watch("angina_pectoria_male") : "";
  const angina_pectoria_female = watch ? watch("angina_pectoria_female") : "";
  const angina_pectoria_total = watch ? watch("angina_pectoria_total") : "";
  const myocardial_infarction_male = watch ? watch("myocardial_infarction_male") : "";
  const myocardial_infarction_female = watch ? watch("myocardial_infarction_female") : "";
  const myocardial_infarction_total = watch ? watch("myocardial_infarction_total") : "";
  const vascular_disturbance_male = watch ? watch("vascular_disturbance_male") : "";
  const vascular_disturbance_female = watch ? watch("vascular_disturbance_female") : "";
  const vascular_disturbance_total = watch ? watch("vascular_disturbance_total") : "";
  const others_heart_male = watch ? watch("others_heart_male") : "";
  const others_heart_female = watch ? watch("others_heart_female") : "";
  const others_heart_total = watch ? watch("others_heart_total") : "";

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
      <div className="grid-cols-4 gap-6 pb-6 hidden md:grid">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Hypertension
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="number"
              {...register(`hypertension_male`)}
              id={`hypertension_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`hypertension_female`)}
              id={`hypertension_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`hypertension_total`)}
              id={`hypertension_total`}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Hypertension</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={hypertension_male || ""}
              onChange={(e) => setValue && setValue("hypertension_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={hypertension_female || ""}
              onChange={(e) => setValue && setValue("hypertension_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={hypertension_total || ""}
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
              Hypotension
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="number"
              {...register(`hypotension_male`)}
              id={`hypotension_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`hypotension_female`)}
              id={`hypotension_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`hypotension_total`)}
              id={`hypotension_total`}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Hypotension</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={hypotension_male || ""}
              onChange={(e) => setValue && setValue("hypotension_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={hypotension_female || ""}
              onChange={(e) => setValue && setValue("hypotension_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={hypotension_total || ""}
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
              Angina Pectoria
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="number"
              {...register(`angina_pectoria_male`)}
              id={`angina_pectoria_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`angina_pectoria_female`)}
              id={`angina_pectoria_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`angina_pectoria_total`)}
              id={`angina_pectoria_total`}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Angina Pectoria</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={angina_pectoria_male || ""}
              onChange={(e) => setValue && setValue("angina_pectoria_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={angina_pectoria_female || ""}
              onChange={(e) => setValue && setValue("angina_pectoria_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={angina_pectoria_total || ""}
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
              Myocardial Infarction
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="number"
              {...register(`myocardial_infarction_male`)}
              id={`myocardial_infarction_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`myocardial_infarction_female`)}
              id={`myocardial_infarction_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`myocardial_infarction_total`)}
              id={`myocardial_infarction_total`}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Myocardial Infarction</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={myocardial_infarction_male || ""}
              onChange={(e) => setValue && setValue("myocardial_infarction_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={myocardial_infarction_female || ""}
              onChange={(e) => setValue && setValue("myocardial_infarction_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={myocardial_infarction_total || ""}
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
              Vascular Disturbance
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="number"
              {...register(`vascular_disturbance_male`)}
              id={`vascular_disturbance_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`vascular_disturbance_female`)}
              id={`vascular_disturbance_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`vascular_disturbance_total`)}
              id={`vascular_disturbance_total`}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Vascular Disturbance</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={vascular_disturbance_male || ""}
              onChange={(e) => setValue && setValue("vascular_disturbance_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={vascular_disturbance_female || ""}
              onChange={(e) => setValue && setValue("vascular_disturbance_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={vascular_disturbance_total || ""}
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
              {...register(`others_heart_male`)}
              id={`others_heart_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`others_heart_female`)}
              id={`others_heart_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`others_heart_total`)}
              id={`others_heart_total`}
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
              value={others_heart_male || ""}
              onChange={(e) => setValue && setValue("others_heart_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={others_heart_female || ""}
              onChange={(e) => setValue && setValue("others_heart_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={others_heart_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Heart;
