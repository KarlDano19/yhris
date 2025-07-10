import React from "react";

interface InfectionProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const Infection: React.FC<InfectionProps> = ({ register, setValue, watch }) => {
  // Get values for mobile inputs
  const influenza_male = watch ? watch("influenza_male") : "";
  const influenza_female = watch ? watch("influenza_female") : "";
  const influenza_total = watch ? watch("influenza_total") : "";
  const typhoid_fever_male = watch ? watch("typhoid_fever_male") : "";
  const typhoid_fever_female = watch ? watch("typhoid_fever_female") : "";
  const typhoid_fever_total = watch ? watch("typhoid_fever_total") : "";
  const cholera_male = watch ? watch("cholera_male") : "";
  const cholera_female = watch ? watch("cholera_female") : "";
  const cholera_total = watch ? watch("cholera_total") : "";
  const measles_male = watch ? watch("measles_male") : "";
  const measles_female = watch ? watch("measles_female") : "";
  const measles_total = watch ? watch("measles_total") : "";
  const tetanus_male = watch ? watch("tetanus_male") : "";
  const tetanus_female = watch ? watch("tetanus_female") : "";
  const tetanus_total = watch ? watch("tetanus_total") : "";
  const malaria_male = watch ? watch("malaria_male") : "";
  const malaria_female = watch ? watch("malaria_female") : "";
  const malaria_total = watch ? watch("malaria_total") : "";
  const schistosomiasis_male = watch ? watch("schistosomiasis_male") : "";
  const schistosomiasis_female = watch ? watch("schistosomiasis_female") : "";
  const schistosomiasis_total = watch ? watch("schistosomiasis_total") : "";
  const herpes_zoster_male = watch ? watch("herpes_zoster_male") : "";
  const herpes_zoster_female = watch ? watch("herpes_zoster_female") : "";
  const herpes_zoster_total = watch ? watch("herpes_zoster_total") : "";
  const chicken_pox_male = watch ? watch("chicken_pox_male") : "";
  const chicken_pox_female = watch ? watch("chicken_pox_female") : "";
  const chicken_pox_total = watch ? watch("chicken_pox_total") : "";
  const german_measles_male = watch ? watch("german_measles_male") : "";
  const german_measles_female = watch ? watch("german_measles_female") : "";
  const german_measles_total = watch ? watch("german_measles_total") : "";
  const rabies_male = watch ? watch("rabies_male") : "";
  const rabies_female = watch ? watch("rabies_female") : "";
  const rabies_total = watch ? watch("rabies_total") : "";
  const others_infectious_male = watch ? watch("others_infectious_male") : "";
  const others_infectious_female = watch ? watch("others_infectious_female") : "";
  const others_infectious_total = watch ? watch("others_infectious_total") : "";

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
            Influenza
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`influenza_male`)}
            id={`influenza_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`influenza_female`)}
            id={`influenza_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`influenza_total`)}
            id={`influenza_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Influenza</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={influenza_male || ""}
            onChange={(e) => setValue && setValue("influenza_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={influenza_female || ""}
            onChange={(e) => setValue && setValue("influenza_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={influenza_total || ""}
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
            Typhoid/ Paratyphoid Fever
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`typhoid_fever_male`)}
            id={`typhoid_fever_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`typhoid_fever_female`)}
            id={`typhoid_fever_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`typhoid_fever_total`)}
            id={`typhoid_fever_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Typhoid/ Paratyphoid Fever</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={typhoid_fever_male || ""}
            onChange={(e) => setValue && setValue("typhoid_fever_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={typhoid_fever_female || ""}
            onChange={(e) => setValue && setValue("typhoid_fever_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={typhoid_fever_total || ""}
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
            Cholera
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`cholera_male`)}
            id={`cholera_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`cholera_female`)}
            id={`cholera_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`cholera_total`)}
            id={`cholera_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Cholera</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={cholera_male || ""}
            onChange={(e) => setValue && setValue("cholera_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={cholera_female || ""}
            onChange={(e) => setValue && setValue("cholera_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={cholera_total || ""}
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
            Measles
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`measles_male`)}
            id={`measles_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`measles_female`)}
            id={`measles_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`measles_total`)}
            id={`measles_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Measles</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={measles_male || ""}
            onChange={(e) => setValue && setValue("measles_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={measles_female || ""}
            onChange={(e) => setValue && setValue("measles_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={measles_total || ""}
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
            Tetanus
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`tetanus_male`)}
            id={`tetanus_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`tetanus_female`)}
            id={`tetanus_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`tetanus_total`)}
            id={`tetanus_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Tetanus</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={tetanus_male || ""}
            onChange={(e) => setValue && setValue("tetanus_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={tetanus_female || ""}
            onChange={(e) => setValue && setValue("tetanus_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={tetanus_total || ""}
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
            Malaria
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`malaria_male`)}
            id={`malaria_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`malaria_female`)}
            id={`malaria_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`malaria_total`)}
            id={`malaria_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Malaria</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={malaria_male || ""}
            onChange={(e) => setValue && setValue("malaria_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={malaria_female || ""}
            onChange={(e) => setValue && setValue("malaria_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={malaria_total || ""}
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
            Schistosomiasis
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`schistosomiasis_male`)}
            id={`schistosomiasis_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`schistosomiasis_female`)}
            id={`schistosomiasis_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`schistosomiasis_total`)}
            id={`schistosomiasis_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Schistosomiasis</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={schistosomiasis_male || ""}
            onChange={(e) => setValue && setValue("schistosomiasis_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={schistosomiasis_female || ""}
            onChange={(e) => setValue && setValue("schistosomiasis_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={schistosomiasis_total || ""}
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
            Herpes Zoster
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`herpes_zoster_male`)}
            id={`herpes_zoster_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`herpes_zoster_female`)}
            id={`herpes_zoster_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`herpes_zoster_total`)}
            id={`herpes_zoster_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Herpes Zoster</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={herpes_zoster_male || ""}
            onChange={(e) => setValue && setValue("herpes_zoster_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={herpes_zoster_female || ""}
            onChange={(e) => setValue && setValue("herpes_zoster_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={herpes_zoster_total || ""}
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
            Chicken Pox
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`chicken_pox_male`)}
            id={`chicken_pox_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`chicken_pox_female`)}
            id={`chicken_pox_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`chicken_pox_total`)}
            id={`chicken_pox_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Chicken Pox</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={chicken_pox_male || ""}
            onChange={(e) => setValue && setValue("chicken_pox_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={chicken_pox_female || ""}
            onChange={(e) => setValue && setValue("chicken_pox_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={chicken_pox_total || ""}
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
            German Measles
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`german_measles_male`)}
            id={`german_measles_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`german_measles_female`)}
            id={`german_measles_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`german_measles_total`)}
            id={`german_measles_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">German Measles</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={german_measles_male || ""}
            onChange={(e) => setValue && setValue("german_measles_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={german_measles_female || ""}
            onChange={(e) => setValue && setValue("german_measles_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={german_measles_total || ""}
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
            Rabies
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`rabies_male`)}
            id={`rabies_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`rabies_female`)}
            id={`rabies_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`rabies_total`)}
            id={`rabies_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Rabies</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={rabies_male || ""}
            onChange={(e) => setValue && setValue("rabies_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={rabies_female || ""}
            onChange={(e) => setValue && setValue("rabies_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={rabies_total || ""}
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
            {...register(`others_infectious_male`)}
            id={`others_infectious_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`others_infectious_female`)}
            id={`others_infectious_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`others_infectious_total`)}
            id={`others_infectious_total`}
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
            value={others_infectious_male || ""}
            onChange={(e) => setValue && setValue("others_infectious_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={others_infectious_female || ""}
            onChange={(e) => setValue && setValue("others_infectious_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={others_infectious_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
  </>
  );
};

export default Infection;
