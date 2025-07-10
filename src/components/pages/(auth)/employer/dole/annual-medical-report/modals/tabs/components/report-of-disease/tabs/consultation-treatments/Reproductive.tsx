import React from "react";

interface ReproductiveProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const Reproductive: React.FC<ReproductiveProps> = ({ register, setValue, watch }) => {
  // Get values for mobile inputs
  const dysmenorrhea_male = watch ? watch("dysmenorrhea_male") : "";
  const dysmenorrhea_female = watch ? watch("dysmenorrhea_female") : "";
  const dysmenorrhea_total = watch ? watch("dysmenorrhea_total") : "";
  const infection_cervicitis_vaginitis_male = watch ? watch("infection_cervicitis_vaginitis_male") : "";
  const infection_cervicitis_vaginitis_female = watch ? watch("infection_cervicitis_vaginitis_female") : "";
  const infection_cervicitis_vaginitis_total = watch ? watch("infection_cervicitis_vaginitis_total") : "";
  const abortion_spontaneous_threatened_male = watch ? watch("abortion_spontaneous_threatened_male") : "";
  const abortion_spontaneous_threatened_female = watch ? watch("abortion_spontaneous_threatened_female") : "";
  const abortion_spontaneous_threatened_total = watch ? watch("abortion_spontaneous_threatened_total") : "";
  const hyperemesis_gravidarum_male = watch ? watch("hyperemesis_gravidarum_male") : "";
  const hyperemesis_gravidarum_female = watch ? watch("hyperemesis_gravidarum_female") : "";
  const hyperemesis_gravidarum_total = watch ? watch("hyperemesis_gravidarum_total") : "";
  const uterine_tumors_male = watch ? watch("uterine_tumors_male") : "";
  const uterine_tumors_female = watch ? watch("uterine_tumors_female") : "";
  const uterine_tumors_total = watch ? watch("uterine_tumors_total") : "";
  const cervical_polyp_cancer_male = watch ? watch("cervical_polyp_cancer_male") : "";
  const cervical_polyp_cancer_female = watch ? watch("cervical_polyp_cancer_female") : "";
  const cervical_polyp_cancer_total = watch ? watch("cervical_polyp_cancer_total") : "";
  const ovarian_cyst_tumors_male = watch ? watch("ovarian_cyst_tumors_male") : "";
  const ovarian_cyst_tumors_female = watch ? watch("ovarian_cyst_tumors_female") : "";
  const ovarian_cyst_tumors_total = watch ? watch("ovarian_cyst_tumors_total") : "";
  const sexually_transmitted_diseases_male = watch ? watch("sexually_transmitted_diseases_male") : "";
  const sexually_transmitted_diseases_female = watch ? watch("sexually_transmitted_diseases_female") : "";
  const sexually_transmitted_diseases_total = watch ? watch("sexually_transmitted_diseases_total") : "";
  const hermia_inguinal_femoral_male = watch ? watch("hermia_inguinal_femoral_male") : "";
  const hermia_inguinal_femoral_female = watch ? watch("hermia_inguinal_femoral_female") : "";
  const hermia_inguinal_femoral_total = watch ? watch("hermia_inguinal_femoral_total") : "";
  const others_reproductive_male = watch ? watch("others_reproductive_male") : "";
  const others_reproductive_female = watch ? watch("others_reproductive_female") : "";
  const others_reproductive_total = watch ? watch("others_reproductive_total") : "";

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
            Dysmenorrhea
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`dysmenorrhea_male`)}
            id={`dysmenorrhea_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`dysmenorrhea_female`)}
            id={`dysmenorrhea_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`dysmenorrhea_total`)}
            id={`dysmenorrhea_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Dysmenorrhea</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={dysmenorrhea_male || ""}
            onChange={(e) => setValue && setValue("dysmenorrhea_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={dysmenorrhea_female || ""}
            onChange={(e) => setValue && setValue("dysmenorrhea_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={dysmenorrhea_total || ""}
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
            Infection (Cervicitis/ Vaginitis)
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`infection_cervicitis_vaginitis_male`)}
            id={`infection_cervicitis_vaginitis_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`infection_cervicitis_vaginitis_female`)}
            id={`infection_cervicitis_vaginitis_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`infection_cervicitis_vaginitis_total`)}
            id={`infection_cervicitis_vaginitis_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Infection (Cervicitis/ Vaginitis)</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={infection_cervicitis_vaginitis_male || ""}
            onChange={(e) => setValue && setValue("infection_cervicitis_vaginitis_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={infection_cervicitis_vaginitis_female || ""}
            onChange={(e) => setValue && setValue("infection_cervicitis_vaginitis_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={infection_cervicitis_vaginitis_total || ""}
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
            Abortion (Spontaneous/ Threatened)
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`abortion_spontaneous_threatened_male`)}
            id={`abortion_spontaneous_threatened_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`abortion_spontaneous_threatened_female`)}
            id={`abortion_spontaneous_threatened_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`abortion_spontaneous_threatened_total`)}
            id={`abortion_spontaneous_threatened_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Abortion (Spontaneous/ Threatened)</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={abortion_spontaneous_threatened_male || ""}
            onChange={(e) => setValue && setValue("abortion_spontaneous_threatened_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={abortion_spontaneous_threatened_female || ""}
            onChange={(e) => setValue && setValue("abortion_spontaneous_threatened_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={abortion_spontaneous_threatened_total || ""}
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
            Hyperemesis Gravidarum
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`hyperemesis_gravidarum_male`)}
            id={`hyperemesis_gravidarum_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`hyperemesis_gravidarum_female`)}
            id={`hyperemesis_gravidarum_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`hyperemesis_gravidarum_total`)}
            id={`hyperemesis_gravidarum_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Hyperemesis Gravidarum</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={hyperemesis_gravidarum_male || ""}
            onChange={(e) => setValue && setValue("hyperemesis_gravidarum_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={hyperemesis_gravidarum_female || ""}
            onChange={(e) => setValue && setValue("hyperemesis_gravidarum_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={hyperemesis_gravidarum_total || ""}
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
            Uterine Tumors
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`uterine_tumors_male`)}
            id={`uterine_tumors_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`uterine_tumors_female`)}
            id={`uterine_tumors_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`uterine_tumors_total`)}
            id={`uterine_tumors_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Uterine Tumors</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={uterine_tumors_male || ""}
            onChange={(e) => setValue && setValue("uterine_tumors_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={uterine_tumors_female || ""}
            onChange={(e) => setValue && setValue("uterine_tumors_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={uterine_tumors_total || ""}
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
            Cervical Polyp/ Cancer
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`cervical_polyp_cancer_male`)}
            id={`cervical_polyp_cancer_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`cervical_polyp_cancer_female`)}
            id={`cervical_polyp_cancer_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`cervical_polyp_cancer_total`)}
            id={`cervical_polyp_cancer_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Cervical Polyp/ Cancer</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={cervical_polyp_cancer_male || ""}
            onChange={(e) => setValue && setValue("cervical_polyp_cancer_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={cervical_polyp_cancer_female || ""}
            onChange={(e) => setValue && setValue("cervical_polyp_cancer_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={cervical_polyp_cancer_total || ""}
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
            Ovarian Cyst/ Tumors
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`ovarian_cyst_tumors_male`)}
            id={`ovarian_cyst_tumors_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`ovarian_cyst_tumors_female`)}
            id={`ovarian_cyst_tumors_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`ovarian_cyst_tumors_total`)}
            id={`ovarian_cyst_tumors_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Ovarian Cyst/ Tumors</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={ovarian_cyst_tumors_male || ""}
            onChange={(e) => setValue && setValue("ovarian_cyst_tumors_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={ovarian_cyst_tumors_female || ""}
            onChange={(e) => setValue && setValue("ovarian_cyst_tumors_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={ovarian_cyst_tumors_total || ""}
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
            Sexually Transmitted Diseases
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`sexually_transmitted_diseases_male`)}
            id={`sexually_transmitted_diseases_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`sexually_transmitted_diseases_female`)}
            id={`sexually_transmitted_diseases_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`sexually_transmitted_diseases_total`)}
            id={`sexually_transmitted_diseases_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Sexually Transmitted Diseases</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={sexually_transmitted_diseases_male || ""}
            onChange={(e) => setValue && setValue("sexually_transmitted_diseases_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={sexually_transmitted_diseases_female || ""}
            onChange={(e) => setValue && setValue("sexually_transmitted_diseases_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={sexually_transmitted_diseases_total || ""}
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
            Hernia (Inguinal / Femoral)
          </h1>
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex flex-row items-center">
          <input
            type="number"
            {...register(`hermia_inguinal_femoral_male`)}
            id={`hermia_inguinal_femoral_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`hermia_inguinal_femoral_female`)}
            id={`hermia_inguinal_femoral_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`hermia_inguinal_femoral_total`)}
            id={`hermia_inguinal_femoral_total`}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
    {/* Mobile layout - hidden on desktop */}
    <div className="pl-7 block md:hidden mb-6">
      <h2 className="font-medium mb-2 text-sm">Hernia (Inguinal / Femoral)</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Male</label>
          <input
            type="number"
            value={hermia_inguinal_femoral_male || ""}
            onChange={(e) => setValue && setValue("hermia_inguinal_femoral_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={hermia_inguinal_femoral_female || ""}
            onChange={(e) => setValue && setValue("hermia_inguinal_femoral_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={hermia_inguinal_femoral_total || ""}
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
            {...register(`others_reproductive_male`)}
            id={`others_reproductive_male`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`others_reproductive_female`)}
            id={`others_reproductive_female`}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2">
          <input
            type="number"
            {...register(`others_reproductive_total`)}
            id={`others_reproductive_total`}
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
            value={others_reproductive_male || ""}
            onChange={(e) => setValue && setValue("others_reproductive_male", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Female</label>
          <input
            type="number"
            value={others_reproductive_female || ""}
            onChange={(e) => setValue && setValue("others_reproductive_female", e.target.value)}
            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
          <input
            type="number"
            value={others_reproductive_total || ""}
            readOnly
            className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
          />
        </div>
      </div>
    </div>
  </>
  );
};

export default Reproductive;
