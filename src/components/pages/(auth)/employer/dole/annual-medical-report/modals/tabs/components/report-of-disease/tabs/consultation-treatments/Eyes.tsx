import React from "react";

interface EyesProps {
  register: any;
}

const Eyes: React.FC<EyesProps> = ({ register }) => {
  return (
    <>
        <div className="grid grid-cols-4 gap-4">
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
            <div className="grid grid-cols-4 gap-6 pb-6">
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
            <div className="grid grid-cols-4 gap-6 pb-6">
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
            <div className="grid grid-cols-4 gap-6 pb-6">
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
            <div className="grid grid-cols-4 gap-6 pb-6">
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
    </>
  );
};

export default Eyes;
