"use client";

import { useEffect } from "react";

import useGetEmployeeCount from "@/components/hooks/useGetEmployeeCount";

import { XCircleIcon } from "@heroicons/react/24/solid";

function GeneralInfo({
  control,
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
  watch,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
  watch: any;
}) {
  const onSubmit = handleSubmit(() => {
    setSelectedTab(2);
  });

  const { data: employeeCount } = useGetEmployeeCount();

  useEffect(() => {
    if (employeeCount !== undefined) {
      setValue("total_number_of_employees", employeeCount);
    }
  }, [employeeCount, setValue]);

  // Auto-calculate totals
  const male_office_workers = watch('male_office_workers');
  const female_office_workers = watch('female_office_workers');
  const male_shop_workers_shift_1 = watch('male_shop_workers_shift_1');
  const female_shop_workers_shift_1 = watch('female_shop_workers_shift_1');
  const male_shop_workers_shift_2 = watch('male_shop_workers_shift_2');
  const female_shop_workers_shift_2 = watch('female_shop_workers_shift_2');
  const male_shop_workers_shift_3 = watch('male_shop_workers_shift_3');
  const female_shop_workers_shift_3 = watch('female_shop_workers_shift_3');

  useEffect(() => {
    const male = Number(male_office_workers) || 0;
    const female = Number(female_office_workers) || 0;
    setValue('total_office_workers', male + female);

    const maleShift1 = Number(male_shop_workers_shift_1) || 0;
    const femaleShift1 = Number(female_shop_workers_shift_1) || 0;
    setValue('total_shop_workers_shift_1', maleShift1 + femaleShift1);

    const maleShift2 = Number(male_shop_workers_shift_2) || 0;
    const femaleShift2 = Number(female_shop_workers_shift_2) || 0;
    setValue('total_shop_workers_shift_2', maleShift2 + femaleShift2);

    const maleShift3 = Number(male_shop_workers_shift_3) || 0;
    const femaleShift3 = Number(female_shop_workers_shift_3) || 0;
    setValue('total_shop_workers_shift_3', maleShift3 + femaleShift3);

  }, [male_office_workers,
      female_office_workers,
      male_shop_workers_shift_1,
      female_shop_workers_shift_1,
      male_shop_workers_shift_2,
      female_shop_workers_shift_2,
      male_shop_workers_shift_3,
      female_shop_workers_shift_3,
      setValue]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 pb-6">
          <div>
            <label
              htmlFor="name_of_establishment"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name of Establishment
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                readOnly
                {...register("name_of_establishment", { required: true })}
                id="name_of_establishment"
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                readOnly
                {...register("address", { required: true })}
                id="address"
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                readOnly
                {...register("type_of_industry", { required: true })}
                id="type_of_industry"
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                readOnly
                {...register("total_number_of_employees", { required: true })}
                id="total_number_of_employees"
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
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
                min={0}
                {...register("number_of_shifts", { required: true })}
                id="number_of_shifts"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="gap-6 mt-4">
          <div className="mt-4">
            <label className="font-semibold">
              Number Distribution of Employees as to nature/workplace, sex and
              workshift:
            </label>
          </div>
        </div>

        {/* Desktop layout - unchanged */}
        <div className="hidden md:block">
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
                  min={0}
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
                  min={0}
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
                  min={0}
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
                  min={0}
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
                  min={0}
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
                  min={0}
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
                  min={0}
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
                  min={0}
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
                  min={0}
                  {...register(`total_office_workers`)}
                  id={`total_office_workers`}
                  readOnly
                  value={watch('total_office_workers') || 0}
                  className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid-item">
              <div className="mt-2">
                <input
                  type="number"
                  min={0}
                  {...register(`total_shop_workers_shift_1`)}
                  id={`total_shop_workers_shift_1`}
                  readOnly
                  value={watch('total_shop_workers_shift_1') || 0}
                  className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid-item">
              <div className="mt-2">
                <input
                  type="number"
                  min={0}
                  {...register(`total_shop_workers_shift_2`)}
                  id={`total_shop_workers_shift_2`}
                  readOnly
                  value={watch('total_shop_workers_shift_2') || 0}
                  className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid-item">
              <div className="mt-2">
                <input
                  type="number"
                  min={0}
                  {...register(`total_shop_workers_shift_3`)}
                  id={`total_shop_workers_shift_3`}
                  readOnly
                  value={watch('total_shop_workers_shift_3') || 0}
                  className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout - completely different structure */}
        <div className="md:hidden mt-6">
          {/* Header row with Male, Female, Total */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-sm font-medium">Workplace</div>
            <div className="text-sm font-medium text-center">Male</div>
            <div className="text-sm font-medium text-center">Female</div>
            <div className="text-sm font-medium text-center">Total</div>
          </div>

          {/* Office row */}
          <div className="grid grid-cols-4 gap-2 mb-4 items-center">
            <div className="text-sm font-medium">Office</div>
            <div>
              <input
                type="number"
                min={0}
                value={male_office_workers || ""}
                onChange={(e) => setValue("male_office_workers", e.target.value)}
                className="rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                min={0}
                value={female_office_workers || ""}
                onChange={(e) => setValue("female_office_workers", e.target.value)}
                className="rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                min={0}
                readOnly
                value={watch('total_office_workers') || 0}
                className="cursor-not-allowed rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
              />
            </div>
          </div>

          {/* Production/Shop header */}
          <div className="text-sm font-medium mb-2 mt-4">Production/Shop</div>

          {/* Shift 1 row */}
          <div className="grid grid-cols-4 gap-2 mb-4 items-center">
            <div className="text-sm font-medium">Shift 1</div>
            <div>
              <input
                type="number"
                min={0}
                value={male_shop_workers_shift_1 || ""}
                onChange={(e) => setValue("male_shop_workers_shift_1", e.target.value)}
                className="rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                min={0}
                value={female_shop_workers_shift_1 || ""}
                onChange={(e) => setValue("female_shop_workers_shift_1", e.target.value)}
                className="rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                min={0}
                readOnly
                value={watch('total_shop_workers_shift_1') || 0}
                className="cursor-not-allowed rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
              />
            </div>
          </div>

          {/* Shift 2 row */}
          <div className="grid grid-cols-4 gap-2 mb-4 items-center">
            <div className="text-sm font-medium">Shift 2</div>
            <div>
              <input
                type="number"
                min={0}
                value={male_shop_workers_shift_2 || ""}
                onChange={(e) => setValue("male_shop_workers_shift_2", e.target.value)}
                className="rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                min={0}
                value={female_shop_workers_shift_2 || ""}
                onChange={(e) => setValue("female_shop_workers_shift_2", e.target.value)}
                className="rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                min={0}
                readOnly
                value={watch('total_shop_workers_shift_2') || 0}
                className="cursor-not-allowed rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
              />
            </div>
          </div>

          {/* Shift 3 row */}
          <div className="grid grid-cols-4 gap-2 mb-4 items-center">
            <div className="text-sm font-medium">Shift 3</div>
            <div>
              <input
                type="number"
                min={0}
                value={male_shop_workers_shift_3 || ""}
                onChange={(e) => setValue("male_shop_workers_shift_3", e.target.value)}
                className="rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                min={0}
                value={female_shop_workers_shift_3 || ""}
                onChange={(e) => setValue("female_shop_workers_shift_3", e.target.value)}
                className="rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                min={0}
                readOnly
                value={watch('total_shop_workers_shift_3') || 0}
                className="cursor-not-allowed rounded-md w-full border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black sm:text-sm"
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
