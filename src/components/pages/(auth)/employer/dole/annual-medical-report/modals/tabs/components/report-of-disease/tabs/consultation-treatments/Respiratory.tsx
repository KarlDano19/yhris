import React from "react";

interface RespiratoryProps {
  register: any;
}

const Respiratory: React.FC<RespiratoryProps> = ({ register }) => {
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
        <div className="grid grid-cols-4 gap-6 pb-6">
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
        <div className="grid grid-cols-4 gap-6 pb-6">
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
        <div className="grid grid-cols-4 gap-6 pb-6">
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
        <div className="grid grid-cols-4 gap-6 pb-6">
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
    </>
  );
};

export default Respiratory;
