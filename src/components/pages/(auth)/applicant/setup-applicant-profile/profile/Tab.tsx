"use client";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { useForm, useFormContext } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { UserIcon } from "@heroicons/react/24/solid";
import DateCalendar from "@/svg/DateCalendar";
import DropDownArrow from "@/svg/DropDownArrow";


function ProfileTab({
  register, 
  handleSubmit,
  setValue,
  setCurrentTab
}: {
  register:any, 
  handleSubmit:any, 
  setCurrentTab :any,
  setValue:any,
}) {
  const onSubmit = handleSubmit(() => {
    setCurrentTab(2);
  });
  const queryClient = useQueryClient();
  const cachedApplicantProfile = queryClient.getQueryCache().find(['applicantProfileCache']);
  const cachedApplicantData: any = cachedApplicantProfile?.state?.data;
  const dateInputRef = useRef(null);

  const defaultValues = {
    firstname: cachedApplicantData?.firstname || '',
    middlename: cachedApplicantData?.middlename || '',
    lastname: cachedApplicantData?.lastname || '',
  };

  useEffect(() => {
    setValue('firstname', cachedApplicantData?.firstname || '');
    setValue('middlename', cachedApplicantData?.middlename || '');
    setValue('lastname', cachedApplicantData?.lastname || '');
  }, [cachedApplicantData, setValue]); 


  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 mt-10 md:gap-x-10 lg:gap-x-14">
        <div className="col-1 md:col-span-2 lg:col-span-4 flex">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 lg:gap-x-5 md:w-full lg:w-auto">
            <div className="overflow-hidden h-[155px] w-36 md:w-auto md:max-w-[150px] mx-auto md:mx-0 md:cols-span-1 lg:col-span-3 bg-gray-300 rounded-md flex items-center justify-center">
              <Image
                className="hidden"
                src=""
                width={0}
                height={0}
                alt="Profile image"
              />
              <UserIcon className="h-4/5 w-4/5 text-white" />
            </div>
            <div className="md:col-span-2 lg:col-span-5 mt-5 md:mt-0">
              <div className="grid-item mt-5">
                <h6 className="block text-sm font-medium leading-6 text-gray-900">
                  Profile Picture <span className="text-red-500">*</span>
                </h6>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register("profilePicture")}
                    id="profile-picture"
                    className="rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4"
                  />
                  <h6 className="text-xs text-indigo-dye mt-3">
                    Maximum file size: 5 MB
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-2 md:col-span-2 lg:col-span-5 grid-item mt-5 md:mt-3 lg:mt-0">
          <label
            htmlFor="about-you"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            About you
          </label>
          <div className="mt-2">
            <textarea
              rows={4}
              {...register("about")}
              id="about-you"
              className="block w-full rounded-md border-0 p-[13.5px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
              defaultValue={""}
              placeholder="Tell us about you..."
            />
            <h6 className="text-xs text-indigo-dye mt-3">
              Maximum words: 500
            </h6>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:gap-x-11 gap-y-5">
      <div className="grid-item">
          <label
            htmlFor="firstname"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("firstname")}
              id="firstname"
              defaultValue={defaultValues.firstname}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="middlename"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Middle Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("middlename")}
              id="middlename"
              defaultValue={defaultValues.middlename}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="lastname"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("lastname")}
              id="lastname"
              defaultValue={defaultValues.lastname}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="bday"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Birthday <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2">
            <input
              type="date"
              {...register("birthDay")}
              id="bday"
              className="appearance-none block w-full rounded-md py-[5.1px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              ref={dateInputRef}
              // @ts-expect-error
              onClick={() => dateInputRef.current.showPicker()}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <DateCalendar />
            </div>
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="age"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Age <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="number"
              {...register("age")}
              id="age"
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="gender"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2">
            <select
              id="gender"
              {...register("gender")}
              className="rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              defaultValue="Male"
            >
              <option value={"Male"}>Male</option>
              <option value={"Female"}>Female</option>
            </select>
            <div className="absolute right-3 top-[14px]">
              <DropDownArrow />
            </div>
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="religion"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Religion <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("religion")}
              id="religion"
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="nationality"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Nationality <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("nationality")}
              id="nationality"
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="civil-status"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Civil Status <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2">
            <select
              id="civil-status"
              {...register("civilStatus")}
              className="rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              defaultValue="Single"
            >
              <option value={"Single"}>Single</option>
              <option value={"Married"}>Married</option>
              <option value={"Divorced"}>Divorced</option>
              <option value={"Widowed"}>Widowed</option>
            </select>
            <div className="absolute right-3 top-[14px]">
              <DropDownArrow />
            </div>
          </div>
        </div>
      </div>
      <h6 className="text-indigo-dye text-sm font-semibold mt-6">Address</h6>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:gap-x-11 gap-y-5">
        <div className="grid-item">
          <label
            htmlFor="house-no"
            className="block whitespace-nowrap truncate text-sm font-medium leading-6 text-gray-900"
          >
            House No./Bldg./Apartment/Suite, etc.{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("houseNo")}
              id="house-no"
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="street"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Street <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("street")}
              id="street"
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="town"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Town/Brgy. <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("town")}
              id="town"
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="city"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            City <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              {...register("city")}
              id="city"
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="zip"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Zip Code <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="number"
              {...register("zipCode")}
              id="zip"
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <label
            htmlFor="country"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2">
            <select
              id="country"
              {...register("country")}
              className="rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              defaultValue="Philippines"
            >
              <option value={"Philippines"}>Philippines</option>
              <option value={"Singapore"}>Singapore</option>
            </select>
            <div className="absolute right-3 top-[14px]">
              <DropDownArrow />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between py-4 px-4">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setCurrentTab(1)}
        >
          Back
        </button>
        <button
          type="submit"
          className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default ProfileTab;
