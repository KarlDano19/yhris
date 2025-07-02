import React from "react";

interface RespiratoryProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const Respiratory: React.FC<RespiratoryProps> = ({ register, setValue, watch }) => {
  // Get values for mobile inputs
  const bronchitis_male = watch ? watch("bronchitis_male") : "";
  const bronchitis_female = watch ? watch("bronchitis_female") : "";
  const bronchitis_total = watch ? watch("bronchitis_total") : "";
  const bronchial_asthma_male = watch ? watch("bronchial_asthma_male") : "";
  const bronchial_asthma_female = watch ? watch("bronchial_asthma_female") : "";
  const bronchial_asthma_total = watch ? watch("bronchial_asthma_total") : "";
  const pneumonia_male = watch ? watch("pneumonia_male") : "";
  const pneumonia_female = watch ? watch("pneumonia_female") : "";
  const pneumonia_total = watch ? watch("pneumonia_total") : "";
  const tuberculosis_male = watch ? watch("tuberculosis_male") : "";
  const tuberculosis_female = watch ? watch("tuberculosis_female") : "";
  const tuberculosis_total = watch ? watch("tuberculosis_total") : "";
  const pneumoconiosis_male = watch ? watch("pneumoconiosis_male") : "";
  const pneumoconiosis_female = watch ? watch("pneumoconiosis_female") : "";
  const pneumoconiosis_total = watch ? watch("pneumoconiosis_total") : "";
  const others_respiratory_male = watch ? watch("others_respiratory_male") : "";
  const others_respiratory_female = watch ? watch("others_respiratory_female") : "";
  const others_respiratory_total = watch ? watch("others_respiratory_total") : "";

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
                Bronchitis
            </h1>
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
            <input
                type="number"
                {...register(`bronchitis_male`)}
                id={`bronchitis_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`bronchitis_female`)}
                id={`bronchitis_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`bronchitis_total`)}
                id={`bronchitis_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Bronchitis</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={bronchitis_male || ""}
                        onChange={(e) => setValue && setValue("bronchitis_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={bronchitis_female || ""}
                        onChange={(e) => setValue && setValue("bronchitis_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={bronchitis_total || ""}
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
                Bronchial Asthma
            </h1>
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
            <input
                type="number"
                {...register(`bronchial_asthma_male`)}
                id={`bronchial_asthma_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`bronchial_asthma_female`)}
                id={`bronchial_asthma_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`bronchial_asthma_total`)}
                id={`bronchial_asthma_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Bronchial Asthma</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={bronchial_asthma_male || ""}
                        onChange={(e) => setValue && setValue("bronchial_asthma_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={bronchial_asthma_female || ""}
                        onChange={(e) => setValue && setValue("bronchial_asthma_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={bronchial_asthma_total || ""}
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
                Pneumonia
            </h1>
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
            <input
                type="number"
                {...register(`pneumonia_male`)}
                id={`pneumonia_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`pneumonia_female`)}
                id={`pneumonia_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`pneumonia_total`)}
                id={`pneumonia_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Pneumonia</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={pneumonia_male || ""}
                        onChange={(e) => setValue && setValue("pneumonia_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={pneumonia_female || ""}
                        onChange={(e) => setValue && setValue("pneumonia_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={pneumonia_total || ""}
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
                Tuberculosis
            </h1>
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
            <input
                type="number"
                {...register(`tuberculosis_male`)}
                id={`tuberculosis_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`tuberculosis_female`)}
                id={`tuberculosis_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`tuberculosis_total`)}
                id={`tuberculosis_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Tuberculosis</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={tuberculosis_male || ""}
                        onChange={(e) => setValue && setValue("tuberculosis_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={tuberculosis_female || ""}
                        onChange={(e) => setValue && setValue("tuberculosis_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={tuberculosis_total || ""}
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
                Pneumoconiosis
            </h1>
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
            <input
                type="number"
                {...register(`pneumoconiosis_male`)}
                id={`pneumoconiosis_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`pneumoconiosis_female`)}
                id={`pneumoconiosis_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`pneumoconiosis_total`)}
                id={`pneumoconiosis_total`}
                readOnly
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        </div>
        {/* Mobile layout - hidden on desktop */}
        <div className="pl-7 block md:hidden mb-6">
            <h2 className="font-medium mb-2 text-sm">Pneumoconiosis</h2>
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Male</label>
                    <input
                        type="number"
                        value={pneumoconiosis_male || ""}
                        onChange={(e) => setValue && setValue("pneumoconiosis_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={pneumoconiosis_female || ""}
                        onChange={(e) => setValue && setValue("pneumoconiosis_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={pneumoconiosis_total || ""}
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
                {...register(`others_respiratory_male`)}
                id={`others_respiratory_male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`others_respiratory_female`)}
                id={`others_respiratory_female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
            </div>
        </div>
        <div className="grid-item">
            <div className="mt-2">
            <input
                type="number"
                {...register(`others_respiratory_total`)}
                id={`others_respiratory_total`}
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
                        value={others_respiratory_male || ""}
                        onChange={(e) => setValue && setValue("others_respiratory_male", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Female</label>
                    <input
                        type="number"
                        value={others_respiratory_female || ""}
                        onChange={(e) => setValue && setValue("others_respiratory_female", e.target.value)}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Total Number of Cases</label>
                    <input
                        type="number"
                        value={others_respiratory_total || ""}
                        readOnly
                        className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
                    />
                </div>
            </div>
        </div>
    </>
  );
};

export default Respiratory;
