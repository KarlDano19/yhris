import React from "react";

interface ImmunizationProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const Immunization: React.FC<ImmunizationProps> = ({ register, setValue, watch }) => {
  // Watch values for all fields
  const tetanus_toxoid_injection_male = watch ? watch("tetanus_toxoid_injection_male") : "";
  const tetanus_toxoid_injection_female = watch ? watch("tetanus_toxoid_injection_female") : "";
  const tetanus_toxoid_injection_total = watch ? watch("tetanus_toxoid_injection_total") : "";

  const tetanus_antitoxin_injection_male = watch ? watch("tetanus_antitoxin_injection_male") : "";
  const tetanus_antitoxin_injection_female = watch ? watch("tetanus_antitoxin_injection_female") : "";
  const tetanus_antitoxin_injection_total = watch ? watch("tetanus_antitoxin_injection_total") : "";

  const tetanus_globulin_injection_male = watch ? watch("tetanus_globulin_injection_male") : "";
  const tetanus_globulin_injection_female = watch ? watch("tetanus_globulin_injection_female") : "";
  const tetanus_globulin_injection_total = watch ? watch("tetanus_globulin_injection_total") : "";

  const hepatitis_b_vaccination_male = watch ? watch("hepatitis_b_vaccination_male") : "";
  const hepatitis_b_vaccination_female = watch ? watch("hepatitis_b_vaccination_female") : "";
  const hepatitis_b_vaccination_total = watch ? watch("hepatitis_b_vaccination_total") : "";

  const rabies_vaccination_male = watch ? watch("rabies_vaccination_male") : "";
  const rabies_vaccination_female = watch ? watch("rabies_vaccination_female") : "";
  const rabies_vaccination_total = watch ? watch("rabies_vaccination_total") : "";

  const others_immunization_male = watch ? watch("others_immunization_male") : "";
  const others_immunization_female = watch ? watch("others_immunization_female") : "";
  const others_immunization_total = watch ? watch("others_immunization_total") : "";

  return (
    <>
      {/* Desktop header - hidden on mobile */}
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
      <div className="hidden md:grid grid-cols-4 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Tetanus Toxoid Injection
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="number"
              {...register(`tetanus_toxoid_injection_male`)}
              id={`tetanus_toxoid_injection_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`tetanus_toxoid_injection_female`)}
              id={`tetanus_toxoid_injection_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`tetanus_toxoid_injection_total`)}
              id={`tetanus_toxoid_injection_total`}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Tetanus Toxoid Injection</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={tetanus_toxoid_injection_male || ""}
              onChange={(e) => setValue && setValue("tetanus_toxoid_injection_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={tetanus_toxoid_injection_female || ""}
              onChange={(e) => setValue && setValue("tetanus_toxoid_injection_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={tetanus_toxoid_injection_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid grid-cols-4 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
              Tetanus Antitoxin Injection
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="number"
              {...register(`tetanus_antitoxin_injection_male`)}
              id={`tetanus_antitoxin_injection_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`tetanus_antitoxin_injection_female`)}
              id={`tetanus_antitoxin_injection_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`tetanus_antitoxin_injection_total`)}
              id={`tetanus_antitoxin_injection_total`}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Tetanus Antitoxin Injection</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={tetanus_antitoxin_injection_male || ""}
              onChange={(e) => setValue && setValue("tetanus_antitoxin_injection_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={tetanus_antitoxin_injection_female || ""}
              onChange={(e) => setValue && setValue("tetanus_antitoxin_injection_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={tetanus_antitoxin_injection_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid grid-cols-4 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
              Tetanus Globulin Injection
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="number"
              {...register(`tetanus_globulin_injection_male`)}
              id={`tetanus_globulin_injection_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`tetanus_globulin_injection_female`)}
              id={`tetanus_globulin_injection_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`tetanus_globulin_injection_total`)}
              id={`tetanus_globulin_injection_total`}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Tetanus Globulin Injection</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={tetanus_globulin_injection_male || ""}
              onChange={(e) => setValue && setValue("tetanus_globulin_injection_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={tetanus_globulin_injection_female || ""}
              onChange={(e) => setValue && setValue("tetanus_globulin_injection_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={tetanus_globulin_injection_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid grid-cols-4 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Hepatitis B Vaccination
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="number"
              {...register(`hepatitis_b_vaccination_male`)}
              id={`hepatitis_b_vaccination_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`hepatitis_b_vaccination_female`)}
              id={`hepatitis_b_vaccination_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`hepatitis_b_vaccination_total`)}
              id={`hepatitis_b_vaccination_total`}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Hepatitis B Vaccination</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={hepatitis_b_vaccination_male || ""}
              onChange={(e) => setValue && setValue("hepatitis_b_vaccination_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={hepatitis_b_vaccination_female || ""}
              onChange={(e) => setValue && setValue("hepatitis_b_vaccination_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={hepatitis_b_vaccination_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid grid-cols-4 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Rabies Vaccination
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="number"
              {...register(`rabies_vaccination_male`)}
              id={`rabies_vaccination_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`rabies_vaccination_female`)}
              id={`rabies_vaccination_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`rabies_vaccination_total`)}
              id={`rabies_vaccination_total`}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Rabies Vaccination</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Male</label>
            <input
              type="number"
              value={rabies_vaccination_male || ""}
              onChange={(e) => setValue && setValue("rabies_vaccination_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={rabies_vaccination_female || ""}
              onChange={(e) => setValue && setValue("rabies_vaccination_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={rabies_vaccination_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile */}
      <div className="hidden md:grid grid-cols-4 gap-6 pb-6">
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
              {...register(`others_immunization_male`)}
              id={`others_immunization_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`others_immunization_female`)}
              id={`others_immunization_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`others_immunization_total`)}
              id={`others_immunization_total`}
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
              value={others_immunization_male || ""}
              onChange={(e) => setValue && setValue("others_immunization_male", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Female</label>
            <input
              type="number"
              value={others_immunization_female || ""}
              onChange={(e) => setValue && setValue("others_immunization_female", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
            <input
              type="number"
              value={others_immunization_total || ""}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Immunization;
