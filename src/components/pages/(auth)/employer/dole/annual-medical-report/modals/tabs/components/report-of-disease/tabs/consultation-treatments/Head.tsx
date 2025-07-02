import React from "react";

interface HeadProps {
  register: any;
}

const Head: React.FC<HeadProps> = ({ register }) => {
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
              Tension headache
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="number"
              {...register(`tension_headache_male`)}
              id={`tension_headache_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`tension_headache_female`)}
              id={`tension_headache_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`tension_headache_total`)}
              id={`tension_headache_total`}
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
              {...register(`others_head_male`)}
              id={`others_head_male`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`others_head_female`)}
              id={`others_head_female`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`others_head_total`)}
              id={`others_head_total`}
              readOnly
              className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Head;
