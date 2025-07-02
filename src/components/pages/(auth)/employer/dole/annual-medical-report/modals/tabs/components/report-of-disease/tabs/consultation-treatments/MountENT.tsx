import React from "react";

interface MountENTProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const MountENT: React.FC<MountENTProps> = ({ register, setValue, watch }) => {
  // Get values for mobile inputs
  const gingivitis_male = watch ? watch("gingivitis_male") : "";
  const gingivitis_female = watch ? watch("gingivitis_female") : "";
  const gingivitis_total = watch ? watch("gingivitis_total") : "";
  const herpes_labiales_nasalis_male = watch ? watch("herpes_labiales_nasalis_male") : "";
  const herpes_labiales_nasalis_female = watch ? watch("herpes_labiales_nasalis_female") : "";
  const herpes_labiales_nasalis_total = watch ? watch("herpes_labiales_nasalis_total") : "";
  const otitis_media_externa_male = watch ? watch("otitis_media_externa_male") : "";
  const otitis_media_externa_female = watch ? watch("otitis_media_externa_female") : "";
  const otitis_media_externa_total = watch ? watch("otitis_media_externa_total") : "";
  const deafness_male = watch ? watch("deafness_male") : "";
  const deafness_female = watch ? watch("deafness_female") : "";
  const deafness_total = watch ? watch("deafness_total") : "";
  const meniere_s_syndrome_vertigo_male = watch ? watch("meniere_s_syndrome_vertigo_male") : "";
  const meniere_s_syndrome_vertigo_female = watch ? watch("meniere_s_syndrome_vertigo_female") : "";
  const meniere_s_syndrome_vertigo_total = watch ? watch("meniere_s_syndrome_vertigo_total") : "";
  const rhinitis_colds_male = watch ? watch("rhinitis_colds_male") : "";
  const rhinitis_colds_female = watch ? watch("rhinitis_colds_female") : "";
  const rhinitis_colds_total = watch ? watch("rhinitis_colds_total") : "";
  const nasal_polyps_male = watch ? watch("nasal_polyps_male") : "";
  const nasal_polyps_female = watch ? watch("nasal_polyps_female") : "";
  const nasal_polyps_total = watch ? watch("nasal_polyps_total") : "";
  const sinusitis_male = watch ? watch("sinusitis_male") : "";
  const sinusitis_female = watch ? watch("sinusitis_female") : "";
  const sinusitis_total = watch ? watch("sinusitis_total") : "";
  const tonsillapharyngitis_male = watch ? watch("tonsillapharyngitis_male") : "";
  const tonsillapharyngitis_female = watch ? watch("tonsillapharyngitis_female") : "";
  const tonsillapharyngitis_total = watch ? watch("tonsillapharyngitis_total") : "";
  const laryngitis_male = watch ? watch("laryngitis_male") : "";
  const laryngitis_female = watch ? watch("laryngitis_female") : "";
  const laryngitis_total = watch ? watch("laryngitis_total") : "";
  const others_ent_male = watch ? watch("others_ent_male") : "";
  const others_ent_female = watch ? watch("others_ent_female") : "";
  const others_ent_total = watch ? watch("others_ent_total") : "";

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
                Gingivitis
                </h1>
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
                <input
                type="number"
                {...register(`gingivitis_male`)}
                id={`gingivitis_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`gingivitis_female`)}
                id={`gingivitis_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`gingivitis_total`)}
                id={`gingivitis_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Gingivitis</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={gingivitis_male || ""}
                        onChange={(e) => setValue && setValue("gingivitis_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={gingivitis_female || ""}
                        onChange={(e) => setValue && setValue("gingivitis_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={gingivitis_total || ""}
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
                Herpes labiales/ nasalis
                </h1>
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
                <input
                type="number"
                {...register(`herpes_labiales_nasalis_male`)}
                id={`herpes_labiales_nasalis_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`herpes_labiales_nasalis_female`)}
                id={`herpes_labiales_nasalis_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`herpes_labiales_nasalis_total`)}
                id={`herpes_labiales_nasalis_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Herpes labiales/ nasalis</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={herpes_labiales_nasalis_male || ""}
                        onChange={(e) => setValue && setValue("herpes_labiales_nasalis_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={herpes_labiales_nasalis_female || ""}
                        onChange={(e) => setValue && setValue("herpes_labiales_nasalis_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={herpes_labiales_nasalis_total || ""}
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
                Otitis media/ Externa
                </h1>
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
                <input
                type="number"
                {...register(`otitis_media_externa_male`)}
                id={`otitis_media_externa_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`otitis_media_externa_female`)}
                id={`otitis_media_externa_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`otitis_media_externa_total`)}
                id={`otitis_media_externa_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Otitis media/ Externa</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={otitis_media_externa_male || ""}
                        onChange={(e) => setValue && setValue("otitis_media_externa_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={otitis_media_externa_female || ""}
                        onChange={(e) => setValue && setValue("otitis_media_externa_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={otitis_media_externa_total || ""}
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
                Deafness
                </h1>
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
                <input
                type="number"
                {...register(`deafness_male`)}
                id={`deafness_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`deafness_female`)}
                id={`deafness_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`deafness_total`)}
                id={`deafness_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Deafness</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={deafness_male || ""}
                        onChange={(e) => setValue && setValue("deafness_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={deafness_female || ""}
                        onChange={(e) => setValue && setValue("deafness_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={deafness_total || ""}
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
                Meniere&apos;s syndrome/ Vertigo
                </h1>
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
                <input
                type="number"
                {...register(`meniere_s_syndrome_vertigo_male`)}
                id={`meniere_s_syndrome_vertigo_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`meniere_s_syndrome_vertigo_female`)}
                id={`meniere_s_syndrome_vertigo_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`meniere_s_syndrome_vertigo_total`)}
                id={`meniere_s_syndrome_vertigo_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Meniere&apos;s syndrome/ Vertigo</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={meniere_s_syndrome_vertigo_male || ""}
                        onChange={(e) => setValue && setValue("meniere_s_syndrome_vertigo_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={meniere_s_syndrome_vertigo_female || ""}
                        onChange={(e) => setValue && setValue("meniere_s_syndrome_vertigo_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={meniere_s_syndrome_vertigo_total || ""}
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
                Rhinitis/ Colds
                </h1>
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
                <input
                type="number"
                {...register(`rhinitis_colds_male`)}
                id={`rhinitis_colds_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`rhinitis_colds_female`)}
                id={`rhinitis_colds_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`rhinitis_colds_total`)}
                id={`rhinitis_colds_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Rhinitis/ Colds</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={rhinitis_colds_male || ""}
                        onChange={(e) => setValue && setValue("rhinitis_colds_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={rhinitis_colds_female || ""}
                        onChange={(e) => setValue && setValue("rhinitis_colds_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={rhinitis_colds_total || ""}
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
                Nasal polyps
                </h1>
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
                <input
                type="number"
                {...register(`nasal_polyps_male`)}
                id={`nasal_polyps_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`nasal_polyps_female`)}
                id={`nasal_polyps_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`nasal_polyps_total`)}
                id={`nasal_polyps_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Nasal polyps</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={nasal_polyps_male || ""}
                        onChange={(e) => setValue && setValue("nasal_polyps_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={nasal_polyps_female || ""}
                        onChange={(e) => setValue && setValue("nasal_polyps_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={nasal_polyps_total || ""}
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
                Sinusitis
                </h1>
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
                <input
                type="number"
                {...register(`sinusitis_male`)}
                id={`sinusitis_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`sinusitis_female`)}
                id={`sinusitis_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`sinusitis_total`)}
                id={`sinusitis_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Sinusitis</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={sinusitis_male || ""}
                        onChange={(e) => setValue && setValue("sinusitis_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={sinusitis_female || ""}
                        onChange={(e) => setValue && setValue("sinusitis_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={sinusitis_total || ""}
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
                Tonsillapharyngitis
                </h1>
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
                <input
                type="number"
                {...register(`tonsillapharyngitis_male`)}
                id={`tonsillapharyngitis_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`tonsillapharyngitis_female`)}
                id={`tonsillapharyngitis_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`tonsillapharyngitis_total`)}
                id={`tonsillapharyngitis_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Tonsillapharyngitis</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={tonsillapharyngitis_male || ""}
                        onChange={(e) => setValue && setValue("tonsillapharyngitis_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={tonsillapharyngitis_female || ""}
                        onChange={(e) => setValue && setValue("tonsillapharyngitis_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={tonsillapharyngitis_total || ""}
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
                Laryngitis
                </h1>
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
                <input
                type="number"
                {...register(`laryngitis_male`)}
                id={`laryngitis_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`laryngitis_female`)}
                id={`laryngitis_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`laryngitis_total`)}
                id={`laryngitis_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Laryngitis</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={laryngitis_male || ""}
                        onChange={(e) => setValue && setValue("laryngitis_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={laryngitis_female || ""}
                        onChange={(e) => setValue && setValue("laryngitis_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={laryngitis_total || ""}
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
                {...register(`others_ent_male`)}
                id={`others_ent_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`others_ent_female`)}
                id={`others_ent_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
            </div>
            </div>
            <div className="grid-item">
            <div className="mt-2">
                <input
                type="number"
                {...register(`others_ent_total`)}
                id={`others_ent_total`}
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
                        value={others_ent_male || ""}
                        onChange={(e) => setValue && setValue("others_ent_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={others_ent_female || ""}
                        onChange={(e) => setValue && setValue("others_ent_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={others_ent_total || ""}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
                    />
                </div>
            </div>
        </div>
    </>
  );
};

export default MountENT;
