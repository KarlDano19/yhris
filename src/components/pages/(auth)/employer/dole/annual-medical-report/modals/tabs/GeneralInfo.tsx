"use client";

import { useEffect } from "react";

import { useFieldArray } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import useGetEmployeeItems from "@/components/hooks/useGetEmployeeItems";

import { XCircleIcon } from "@heroicons/react/24/solid";

interface CachedProfileData {
  name: string;
  type_of_industry: string;
  city: string;
}

function GeneralInfo({
  control,
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
}) {
  const queryClient = useQueryClient();

  const onSubmit = handleSubmit(() => {
    setSelectedTab(2);
  });

  const { data: employeeData } = useGetEmployeeItems();
  const cachedProfile = queryClient
    .getQueryCache()
    .find(["employerProfileCache"]) as {
    state: { data: CachedProfileData } | undefined;
  };
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "employees",
  });

  useEffect(() => {
    if (employeeData) {
      setValue("total_number_of_employees", employeeData.length);
    }
    if (cachedProfile?.state?.data) {
      setValue("company_name", cachedProfile.state.data.name || "");
      setValue(
        "type_of_industry",
        cachedProfile.state.data.type_of_industry || ""
      );
      setValue("address", cachedProfile.state.data.city || "");
    }
  }, [employeeData, cachedProfile, setValue]);

  return (
    <form onSubmit={onSubmit}>
      <div className="px-4 pt-4 pb-6">
        <div className={`hidden rounded-md bg-red-50 p-4 mb-3`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                You cannot proceed due to incomplete fields. Please review.
              </h3>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4 pb-6">
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name of Establishment
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("company_name", { required: true })}
                id="company_name"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="name_of_owner_manager"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name of Owner/Manager
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("name_of_owner_manager", { required: true })}
                id="name_of_owner_manager"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Address
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("address", { required: true })}
                id="address"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="type_of_industry"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Type of Industry
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("type_of_industry", { required: true })}
                id="type_of_industry"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="total_number_of_employees"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Total Number of Employees
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("total_number_of_employees", { required: true })}
                id="total_number_of_employees"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="number_of_shift"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Number of Shift
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("number_of_shifts", { required: true })}
                id="number_of_shifts"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="gap-6 mt-4">
          <div className="mt-4">
            <label className=" font-semibold">
              Number Distribution of Employees as to nature/workplace, sex and
              workshift:
            </label>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 pt-6">
          <div>{""}</div>
          <div>
            <h1 className="text-sm font-medium pl-14">Office</h1>
          </div>
          <div>
            <h1 className="text-sm font-medium pl-14"> </h1>
          </div>
          <div>
            <h1 className="text-sm font-medium pl-14">Production/ Shop</h1>
          </div>
          <div>
            <h1 className="text-sm font-medium pl-14"> </h1>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 pt-6">
          <div>{""}</div>
          <div>
            <h1 className="text-sm font-medium pl-14">{""}</h1>
          </div>
          <div>
            <h1 className="text-sm font-medium pl-14">Shift 1</h1>
          </div>
          <div>
            <h1 className="text-sm font-medium pl-14">Shift 2</h1>
          </div>
          <div>
            <h1 className="text-sm font-medium pl-14">Shift 3</h1>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-6 pb-6">
          <div className="flex justify-start items-center pl-6">
            <div className="grid-item">
              <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                Male
              </h1>
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
              <input
                type="number"
                {...register(`male_office_workers`)}
                id={`male_office_workers`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="number"
                {...register(`male_shop_workers_shift_1`)}
                id={`number_of_workers_who_underwent_medical_examination_x_rays_pre_placement`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="number"
                {...register(`male_shop_workers_shift_2`)}
                id={`male_shop_workers_shift_2`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="number"
                {...register(`male_shop_workers_shift_3`)}
                id={`male_shop_workers_shift_3`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-6 pb-6">
          <div className="flex justify-start items-center pl-6">
            <div className="grid-item">
              <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                Female
              </h1>
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
              <input
                type="number"
                {...register(`female_office_workers`)}
                id={`female_office_workers`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="number"
                {...register(`female_shop_workers_shift_1`)}
                id={`female_shop_workers_shift_1`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="number"
                {...register(`female_shop_workers_shift_2`)}
                id={`female_shop_workers_shift_2`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="number"
                {...register(`female_shop_workers_shift_3`)}
                id={`female_shop_workers_shift_3`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-6 pb-6">
          <div className="flex justify-start items-center pl-6">
            <div className="grid-item">
              <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                Total
              </h1>
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2 flex flex-row items-center">
              <input
                type="number"
                {...register(`total_office_male_workers`)}
                id={`total_office_male_workers`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="number"
                {...register(`total_shop_male_workers_shift_1`)}
                id={`total_shop_male_workers_shift_1`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="number"
                {...register(`total_shop_male_workers_shift_2`)}
                id={`total_shop_male_workers_shift_2`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="number"
                {...register(`total_shop_male_workers_shift_3`)}
                id={`total_shop_male_workers_shift_3`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <hr />
      </div>
      <hr />
      <div className="py-4 px-4 text-right">
        <button
          type="submit"
          className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default GeneralInfo;
