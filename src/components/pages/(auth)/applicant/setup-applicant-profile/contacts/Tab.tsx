"use client";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const Tab = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const {register} = useFormContext()
  return (
    <>
      
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 md:gap-x-12">
          <div className="grid-item mt-4 md:mt-0">
            <label
              htmlFor="email"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="email"
                {...register("email")}
                id="email"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4 md:mt-0">
            <label
              htmlFor="mobile-num"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Mobile No. <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="tel"
                {...register("mobileNo")}
                id="mobile-num"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4 md:mt-0">
            <label
              htmlFor="landline-num"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Landline No.
            </label>
            <div className="mt-2">
              <input
                type="tel"
                {...register("landLineNo")}
                id="landline-num"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <h6 className="text-indigo-dye md:col-span-3 text-sm font-semibold mt-6 mb-3">
            Contact Person
          </h6>
          <div className="grid-item md:col-span-1">
            <label
              htmlFor="name"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("contactPerson")}
                id="name"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4 md:mt-0 md:col-span-2">
            <label
              htmlFor="address"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("address")}
                id="address"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4">
            <label
              htmlFor="age"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Age <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="number"
                {...register("contactPersonAge")}
                id="age"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4">
            <label
              htmlFor="contact-person-mobile"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Mobile No. <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="tel"
                {...register("contactPersonContactNo")}
                id="contact-person-mobile"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4">
            <label
              htmlFor="relationship"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Relationship <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("relationship")}
                id="relationship"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
    </>
  );
};

export default Tab;
