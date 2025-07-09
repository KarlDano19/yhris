"use client";

import { useState, useEffect, useMemo } from "react";

function OccupationalHealthService({
  register,
  handleSubmit,
  setSelectedTab,
  watch,
  errors,
  setError,
  clearErrors,
  setValue,
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  watch: any;
  errors: any;
  setError: any;
  clearErrors: any;
  setValue: any;
}) {

  // Watch all the values
  const workers_pre_placement_physical_exam = watch("workers_pre_placement_physical_exam");
  const workers_pre_placement_x_rays = watch("workers_pre_placement_x_rays");
  const workers_pre_placement_urinalysis = watch("workers_pre_placement_urinalysis");
  const workers_periodic_physical_exam = watch("workers_periodic_physical_exam");
  const workers_periodic_x_rays = watch("workers_periodic_x_rays");
  const workers_periodic_urinalysis = watch("workers_periodic_urinalysis");
  const workers_return_to_work_physical_exam = watch("workers_return_to_work_physical_exam");
  const workers_return_to_work_x_rays = watch("workers_return_to_work_x_rays");
  const workers_return_to_work_urinalysis = watch("workers_return_to_work_urinalysis");
  const workers_transfer_physical_exam = watch("workers_transfer_physical_exam");
  const workers_transfer_x_rays = watch("workers_transfer_x_rays");
  const workers_transfer_urinalysis = watch("workers_transfer_urinalysis");
  const workers_special_physical_exam = watch("workers_special_physical_exam");
  const workers_special_x_rays = watch("workers_special_x_rays");
  const workers_special_urinalysis = watch("workers_special_urinalysis");
  const workers_separation_physical_exam = watch("workers_separation_physical_exam");
  const workers_separation_x_rays = watch("workers_separation_x_rays");
  const workers_separation_urinalysis = watch("workers_separation_urinalysis");
  const total_workers_examination_stool_exam_pre_placement = watch("total_workers_examination_stool_exam_pre_placement");
  const total_workers_examination_blood_test_pre_placement = watch("total_workers_examination_blood_test_pre_placement");
  const total_workers_examination_ecg_pre_placement = watch("total_workers_examination_ecg_pre_placement");
  const total_workers_examination_others_pre_placement = watch("total_workers_examination_others_pre_placement");
  const total_workers_examination_stool_exam_periodic = watch("total_workers_examination_stool_exam_periodic");
  const total_workers_examination_blood_test_periodic = watch("total_workers_examination_blood_test_periodic");
  const total_workers_examination_ecg_periodic = watch("total_workers_examination_ecg_periodic");
  const total_workers_examination_others_periodic = watch("total_workers_examination_others_periodic");
  const total_workers_examination_stool_exam_return_to_work = watch("total_workers_examination_stool_exam_return_to_work");
  const total_workers_examination_blood_test_return_to_work = watch("total_workers_examination_blood_test_return_to_work");
  const total_workers_examination_ecg_return_to_work = watch("total_workers_examination_ecg_return_to_work");
  const total_workers_examination_others_return_to_work = watch("total_workers_examination_others_return_to_work");
  const total_workers_examination_stool_exam_transfer = watch("total_workers_examination_stool_exam_transfer");
  const total_workers_examination_blood_test_transfer = watch("total_workers_examination_blood_test_transfer");
  const total_workers_examination_ecg_transfer = watch("total_workers_examination_ecg_transfer");
  const total_workers_examination_others_transfer = watch("total_workers_examination_others_transfer");
  const total_workers_examination_stool_exam_special = watch("total_workers_examination_stool_exam_special");
  const total_workers_examination_blood_test_special = watch("total_workers_examination_blood_test_special");
  const total_workers_examination_ecg_special = watch("total_workers_examination_ecg_special");
  const total_workers_examination_others_special = watch("total_workers_examination_others_special");
  const total_workers_examination_stool_exam_separation = watch("total_workers_examination_stool_exam_separation");
  const total_workers_examination_blood_test_separation = watch("total_workers_examination_blood_test_separation");
  const total_workers_examination_ecg_separation = watch("total_workers_examination_ecg_separation");
  const total_workers_examination_others_separation = watch("total_workers_examination_others_separation");

  // Helper to check if a checkbox group is filled
  const isChecked = (val: any) => Array.isArray(val) ? val.length > 0 : !!val;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear all errors first
    clearErrors();
    
    if (!isChecked(watch("sanitation_system_appraisal"))) {
      setError("sanitation_system_appraisal", {
        type: "manual",
        message: "Please select at least one option."
      });
      return;
    }
    setSelectedTab(5);
  };

  // Clear errors on change
  const sanitationSystemAppraisal = watch("sanitation_system_appraisal");
  
  useEffect(() => {
    if (isChecked(sanitationSystemAppraisal)) {
      clearErrors("sanitation_system_appraisal");
    }
  }, [sanitationSystemAppraisal, clearErrors]);

  return (
    <form onSubmit={onSubmit}>
      <div className="gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label
            htmlFor="sanitation_system_appraisal"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            a. The occupational health personnel of this establishment conducts
            regular appraisal of the sanitation system in the workplace:
            <span className="text-red-600">*</span>
          </label>
          {errors.sanitation_system_appraisal && (
            <p className="text-xs text-red-600 mt-1">
              {errors.sanitation_system_appraisal.message || "Please select at least one option."}
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-0 md:pl-6">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("sanitation_system_appraisal")}
                id="sanitation_system_appraisal"
                value="yes"
              />
              <label htmlFor="sanitation_system_appraisal" className="ml-1 text-sm md:text-base">
                yes
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("sanitation_system_appraisal")}
                id="sanitation_system_appraisal"
                value="no"
              />
              <label htmlFor="sanitation_system_appraisal" className="ml-2 text-sm md:text-base">
                no
                <span className="text-gray-500"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div className="pr-0 md:pr-8">
          <label
            htmlFor="number_of_workers_who_underwent_medical_examination"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            b. Number of workers who underwent the following medical
            examination:
          </label>
            {/* Desktop header - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-4">
              <div>{""}</div>
              <div>
                <h1 className="text-sm font-medium text-center">Physical Exam</h1>
              </div>
              <div>
                <h1 className="text-sm font-medium text-center">X-rays</h1>
              </div>
              <div>
                <h1 className="text-sm font-medium text-center">Urinalysis</h1>
              </div>
            </div>
            
            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Pre-placement
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(`workers_pre_placement_physical_exam`)}
                    id={`workers_pre_placement_physical_exam`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_pre_placement_x_rays`)}
                    id={`workers_pre_placement_x_rays`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_pre_placement_urinalysis`)}
                    id={`workers_pre_placement_urinalysis`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Pre-placement</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Physical Exam</label>
                  <input
                    type="number"
                    value={workers_pre_placement_physical_exam || ""}
                    onChange={(e) => setValue("workers_pre_placement_physical_exam", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">X-rays</label>
                  <input
                    type="number"
                    value={workers_pre_placement_x_rays || ""}
                    onChange={(e) => setValue("workers_pre_placement_x_rays", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Urinalysis</label>
                  <input
                    type="number"
                    value={workers_pre_placement_urinalysis || ""}
                    onChange={(e) => setValue("workers_pre_placement_urinalysis", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Periodic
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(`workers_periodic_physical_exam`)}
                    id={`workers_periodic_physical_exam`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_periodic_x_rays`)}
                    id={`workers_periodic_x_rays`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_periodic_urinalysis`)}
                    id={`workers_periodic_urinalysis`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Periodic</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Physical Exam</label>
                  <input
                    type="number"
                    value={workers_periodic_physical_exam || ""}
                    onChange={(e) => setValue("workers_periodic_physical_exam", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">X-rays</label>
                  <input
                    type="number"
                    value={workers_periodic_x_rays || ""}
                    onChange={(e) => setValue("workers_periodic_x_rays", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Urinalysis</label>
                  <input
                    type="number"
                    value={workers_periodic_urinalysis || ""}
                    onChange={(e) => setValue("workers_periodic_urinalysis", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Return-to-work
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(`workers_return_to_work_physical_exam`)}
                    id={`workers_return_to_work_physical_exam`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_return_to_work_x_rays`)}
                    id={`workers_return_to_work_x_rays`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_return_to_work_urinalysis`)}
                    id={`workers_return_to_work_urinalysis`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Return-to-work</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Physical Exam</label>
                  <input
                    type="number"
                    value={workers_return_to_work_physical_exam || ""}
                    onChange={(e) => setValue("workers_return_to_work_physical_exam", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">X-rays</label>
                  <input
                    type="number"
                    value={workers_return_to_work_x_rays || ""}
                    onChange={(e) => setValue("workers_return_to_work_x_rays", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Urinalysis</label>
                  <input
                    type="number"
                    value={workers_return_to_work_urinalysis || ""}
                    onChange={(e) => setValue("workers_return_to_work_urinalysis", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Transfer
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(`workers_transfer_physical_exam`)}
                    id={`workers_transfer_physical_exam`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_transfer_x_rays`)}
                    id={`workers_transfer_x_rays`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_transfer_urinalysis`)}
                    id={`workers_transfer_urinalysis`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Transfer</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Physical Exam</label>
                  <input
                    type="number"
                    value={workers_transfer_physical_exam || ""}
                    onChange={(e) => setValue("workers_transfer_physical_exam", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">X-rays</label>
                  <input
                    type="number"
                    value={workers_transfer_x_rays || ""}
                    onChange={(e) => setValue("workers_transfer_x_rays", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Urinalysis</label>
                  <input
                    type="number"
                    value={workers_transfer_urinalysis || ""}
                    onChange={(e) => setValue("workers_transfer_urinalysis", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Special
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(`workers_special_physical_exam`)}
                    id={`workers_special_physical_exam`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_special_x_rays`)}
                    id={`workers_special_x_rays`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_special_urinalysis`)}
                    id={`workers_special_urinalysis`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Special</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Physical Exam</label>
                  <input
                    type="number"
                    value={workers_special_physical_exam || ""}
                    onChange={(e) => setValue("workers_special_physical_exam", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">X-rays</label>
                  <input
                    type="number"
                    value={workers_special_x_rays || ""}
                    onChange={(e) => setValue("workers_special_x_rays", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Urinalysis</label>
                  <input
                    type="number"
                    value={workers_special_urinalysis || ""}
                    onChange={(e) => setValue("workers_special_urinalysis", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Separation
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(`workers_separation_physical_exam`)}
                    id={`workers_separation_physical_exam`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_separation_x_rays`)}
                    id={`workers_separation_x_rays`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`workers_separation_urinalysis`)}
                    id={`workers_separation_urinalysis`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Separation</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Physical Exam</label>
                  <input
                    type="number"
                    value={workers_separation_physical_exam || ""}
                    onChange={(e) => setValue("workers_separation_physical_exam", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">X-rays</label>
                  <input
                    type="number"
                    value={workers_separation_x_rays || ""}
                    onChange={(e) => setValue("workers_separation_x_rays", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Urinalysis</label>
                  <input
                    type="number"
                    value={workers_separation_urinalysis || ""}
                    onChange={(e) => setValue("workers_separation_urinalysis", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop header - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-4">
              <div>{""}</div>
              <div>
                <h1 className="text-sm font-medium pl-10">Stool Exam</h1>
              </div>
              <div>
                <h1 className="text-sm font-medium pl-10">Blood Test</h1>
              </div>
              <div>
                <h1 className="text-sm font-medium pl-14">ECG</h1>
              </div>
              <div>
                <h1 className="text-sm font-medium pl-10">Others</h1>
              </div>
            </div>
            
            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Pre-placement
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_stool_exam_pre_placement`
                    )}
                    id={`total_workers_examination_stool_exam_pre_placement`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_blood_test_pre_placement`
                    )}
                    id={`total_workers_examination_blood_test_pre_placement`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_ecg_pre_placement`
                    )}
                    id={`total_workers_examination_ecg_pre_placement`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_others_pre_placement`
                    )}
                    id={`total_workers_examination_others_pre_placement`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Pre-placement (Additional)</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Stool Exam</label>
                  <input
                    type="number"
                    value={total_workers_examination_stool_exam_pre_placement || ""}
                    onChange={(e) => setValue("total_workers_examination_stool_exam_pre_placement", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Blood Test</label>
                  <input
                    type="number"
                    value={total_workers_examination_blood_test_pre_placement || ""}
                    onChange={(e) => setValue("total_workers_examination_blood_test_pre_placement", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">ECG</label>
                  <input
                    type="number"
                    value={total_workers_examination_ecg_pre_placement || ""}
                    onChange={(e) => setValue("total_workers_examination_ecg_pre_placement", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Others</label>
                  <input
                    type="number"
                    value={total_workers_examination_others_pre_placement || ""}
                    onChange={(e) => setValue("total_workers_examination_others_pre_placement", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Periodic
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_stool_exam_periodic`
                    )}
                    id={`total_workers_examination_stool_exam_periodic`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_blood_test_periodic`
                    )}
                    id={`total_workers_examination_blood_test_periodic`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_ecg_periodic`
                    )}
                    id={`total_workers_examination_ecg_periodic`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_others_periodic`
                    )}
                    id={`total_workers_examination_others_periodic`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Periodic (Additional)</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Stool Exam</label>
                  <input
                    type="number"
                    value={total_workers_examination_stool_exam_periodic || ""}
                    onChange={(e) => setValue("total_workers_examination_stool_exam_periodic", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Blood Test</label>
                  <input
                    type="number"
                    value={total_workers_examination_blood_test_periodic || ""}
                    onChange={(e) => setValue("total_workers_examination_blood_test_periodic", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">ECG</label>
                  <input
                    type="number"
                    value={total_workers_examination_ecg_periodic || ""}
                    onChange={(e) => setValue("total_workers_examination_ecg_periodic", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Others</label>
                  <input
                    type="number"
                    value={total_workers_examination_others_periodic || ""}
                    onChange={(e) => setValue("total_workers_examination_others_periodic", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Return-to-work
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_stool_exam_return_to_work`
                    )}
                    id={`total_workers_examination_stool_exam_return_to_work`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_blood_test_return_to_work`
                    )}
                    id={`total_workers_examination_blood_test_return_to_work`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_ecg_return_to_work`
                    )}
                    id={`total_workers_examination_ecg_return_to_work`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_others_return_to_work`
                    )}
                    id={`total_workers_examination_others_return_to_work`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Return-to-work (Additional)</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Stool Exam</label>
                  <input
                    type="number"
                    value={total_workers_examination_stool_exam_return_to_work || ""}
                    onChange={(e) => setValue("total_workers_examination_stool_exam_return_to_work", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Blood Test</label>
                  <input
                    type="number"
                    value={total_workers_examination_blood_test_return_to_work || ""}
                    onChange={(e) => setValue("total_workers_examination_blood_test_return_to_work", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">ECG</label>
                  <input
                    type="number"
                    value={total_workers_examination_ecg_return_to_work || ""}
                    onChange={(e) => setValue("total_workers_examination_ecg_return_to_work", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Others</label>
                  <input
                    type="number"
                    value={total_workers_examination_others_return_to_work || ""}
                    onChange={(e) => setValue("total_workers_examination_others_return_to_work", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Transfer
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_stool_exam_transfer`
                    )}
                    id={`total_workers_examination_stool_exam_transfer`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_blood_test_transfer`
                    )}
                    id={`total_workers_examination_blood_test_transfer`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_ecg_transfer`
                    )}
                    id={`total_workers_examination_ecg_transfer`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_others_transfer`
                    )}
                    id={`total_workers_examination_others_transfer`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Transfer (Additional)</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Stool Exam</label>
                  <input
                    type="number"
                    value={total_workers_examination_stool_exam_transfer || ""}
                    onChange={(e) => setValue("total_workers_examination_stool_exam_transfer", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Blood Test</label>
                  <input
                    type="number"
                    value={total_workers_examination_blood_test_transfer || ""}
                    onChange={(e) => setValue("total_workers_examination_blood_test_transfer", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">ECG</label>
                  <input
                    type="number"
                    value={total_workers_examination_ecg_transfer || ""}
                    onChange={(e) => setValue("total_workers_examination_ecg_transfer", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Others</label>
                  <input
                    type="number"
                    value={total_workers_examination_others_transfer || ""}
                    onChange={(e) => setValue("total_workers_examination_others_transfer", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Special
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_stool_exam_special`
                    )}
                    id={`total_workers_examination_stool_exam_special`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_blood_test_special`
                    )}
                    id={`total_workers_examination_blood_test_special`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_ecg_special`
                    )}
                    id={`total_workers_examination_ecg_special`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_others_special`
                    )}
                    id={`total_workers_examination_others_special`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Special (Additional)</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Stool Exam</label>
                  <input
                    type="number"
                    value={total_workers_examination_stool_exam_special || ""}
                    onChange={(e) => setValue("total_workers_examination_stool_exam_special", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Blood Test</label>
                  <input
                    type="number"
                    value={total_workers_examination_blood_test_special || ""}
                    onChange={(e) => setValue("total_workers_examination_blood_test_special", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">ECG</label>
                  <input
                    type="number"
                    value={total_workers_examination_ecg_special || ""}
                    onChange={(e) => setValue("total_workers_examination_ecg_special", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Others</label>
                  <input
                    type="number"
                    value={total_workers_examination_others_special || ""}
                    onChange={(e) => setValue("total_workers_examination_others_special", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop layout - hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-5 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Separation
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_stool_exam_separation`
                    )}
                    id={`total_workers_examination_stool_exam_separation`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_blood_test_separation`
                    )}
                    id={`total_workers_examination_blood_test_separation`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_ecg_separation`
                    )}
                    id={`total_workers_examination_ecg_separation`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(
                      `total_workers_examination_others_separation`
                    )}
                    id={`total_workers_examination_others_separation`}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile layout - hidden on desktop */}
            <div className="block md:hidden mb-6">
              <h2 className="font-medium mb-2 text-sm">Separation (Additional)</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Stool Exam</label>
                  <input
                    type="number"
                    value={total_workers_examination_stool_exam_separation || ""}
                    onChange={(e) => setValue("total_workers_examination_stool_exam_separation", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Blood Test</label>
                  <input
                    type="number"
                    value={total_workers_examination_blood_test_separation || ""}
                    onChange={(e) => setValue("total_workers_examination_blood_test_separation", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">ECG</label>
                  <input
                    type="number"
                    value={total_workers_examination_ecg_separation || ""}
                    onChange={(e) => setValue("total_workers_examination_ecg_separation", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Others</label>
                  <input
                    type="number"
                    value={total_workers_examination_others_separation || ""}
                    onChange={(e) => setValue("total_workers_examination_others_separation", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
        </div>
      </div>
      <hr />
      <div className="py-4 px-4 flex justify-between">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(3)}
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
}

export default OccupationalHealthService;
