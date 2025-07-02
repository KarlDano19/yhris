import React from "react";

interface EyesProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const Eyes: React.FC<EyesProps> = ({ register, setValue, watch }) => {
  // Get values for mobile inputs
  const cataract_male = watch ? watch("cataract_male") : "";
  const cataract_female = watch ? watch("cataract_female") : "";
  const cataract_total = watch ? watch("cataract_total") : "";
  
  const error_of_refraction_male = watch ? watch("error_of_refraction_male") : "";
  const error_of_refraction_female = watch ? watch("error_of_refraction_female") : "";
  const error_of_refraction_total = watch ? watch("error_of_refraction_total") : "";
  
  const bacterial_viral_conjunctivities_male = watch ? watch("bacterial_viral_conjunctivities_male") : "";
  const bacterial_viral_conjunctivities_female = watch ? watch("bacterial_viral_conjunctivities_female") : "";
  const bacterial_viral_conjunctivities_total = watch ? watch("bacterial_viral_conjunctivities_total") : "";
  
  const others_eyes_male = watch ? watch("others_eyes_male") : "";
  const others_eyes_female = watch ? watch("others_eyes_female") : "";
  const others_eyes_total = watch ? watch("others_eyes_total") : "";

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
                    cataract
                </h1>
                </div>
            </div>
            <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                <input
                    type="number"
                    {...register(`cataract_male`)}
                    id={`cataract_male`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <div className="grid-item">
                <div className="mt-2">
                <input
                    type="number"
                    {...register(`cataract_female`)}
                    id={`cataract_female`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <div className="grid-item">
                <div className="mt-2">
                <input
                    type="number"
                    {...register(`cataract_total`)}
                    id={`cataract_total`}
                    readOnly
                    className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
        </div>
        
        {/* Mobile layout - hidden on desktop */}
        <div className="block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Cataract</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={cataract_male || ""}
                        onChange={(e) => setValue && setValue("cataract_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={cataract_female || ""}
                        onChange={(e) => setValue && setValue("cataract_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={cataract_total || ""}
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
                    error of refraction
                </h1>
                </div>
            </div>
            <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                <input
                    type="number"
                    {...register(`error_of_refraction_male`)}
                    id={`error_of_refraction_male`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <div className="grid-item">
                <div className="mt-2">
                <input
                    type="number"
                    {...register(`error_of_refraction_female`)}
                    id={`error_of_refraction_female`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <div className="grid-item">
                <div className="mt-2">
                <input
                    type="number"
                    {...register(`error_of_refraction_total`)}
                    id={`error_of_refraction_total`}
                    readOnly
                    className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
        </div>
        
        {/* Mobile layout - hidden on desktop */}
        <div className="block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Error of refraction</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={error_of_refraction_male || ""}
                        onChange={(e) => setValue && setValue("error_of_refraction_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={error_of_refraction_female || ""}
                        onChange={(e) => setValue && setValue("error_of_refraction_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={error_of_refraction_total || ""}
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
                <h1 className="block text-sm font-medium items-start leading-6 text-gray-900">
                    bacterial/viral conjunctivities
                </h1>
                </div>
            </div>
            <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                <input
                    type="number"
                    {...register(`bacterial_viral_conjunctivities_male`)}
                    id={`bacterial_viral_conjunctivities_male`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <div className="grid-item">
                <div className="mt-2">
                <input
                    type="number"
                    {...register(`bacterial_viral_conjunctivities_female`)}
                    id={`bacterial_viral_conjunctivities_female`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <div className="grid-item">
                <div className="mt-2">
                <input
                    type="number"
                    {...register(`bacterial_viral_conjunctivities_total`)}
                    id={`bacterial_viral_conjunctivities_total`}
                    readOnly
                    className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
        </div>
        
        {/* Mobile layout - hidden on desktop */}
        <div className="block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Bacterial/viral conjunctivities</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={bacterial_viral_conjunctivities_male || ""}
                        onChange={(e) => setValue && setValue("bacterial_viral_conjunctivities_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={bacterial_viral_conjunctivities_female || ""}
                        onChange={(e) => setValue && setValue("bacterial_viral_conjunctivities_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={bacterial_viral_conjunctivities_total || ""}
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
                    {...register(`others_eyes_male`)}
                    id={`others_eyes_male`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <div className="grid-item">
                <div className="mt-2">
                <input
                    type="number"
                    {...register(`others_eyes_female`)}
                    id={`others_eyes_female`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            <div className="grid-item">
                <div className="mt-2">
                <input
                    type="number"
                    {...register(`others_eyes_total`)}
                    id={`others_eyes_total`}
                    readOnly
                    className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
        </div>
        
        {/* Mobile layout - hidden on desktop */}
        <div className="block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Others</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={others_eyes_male || ""}
                        onChange={(e) => setValue && setValue("others_eyes_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={others_eyes_female || ""}
                        onChange={(e) => setValue && setValue("others_eyes_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={others_eyes_total || ""}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
                    />
                </div>
            </div>
        </div>
    </>
  );
};

export default Eyes;
