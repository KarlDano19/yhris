"use client";

function OccupationalHealthService({
  register,
  handleSubmit,
  setSelectedTab,
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
}) {
  const onSubmit = handleSubmit(() => {
    setSelectedTab(5);
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="gap-6 mt-4 pl-6 mb-6">
        <div>
          <label
            htmlFor="sanitation_system_appraisal"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            a. The occupational health personnel of this establishment conducts
            regular appraisal of the sanitation system in the workplace:
            <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2 pl-6">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("sanitation_system_appraisal", { required: true })}
                id="sanitation_system_appraisal"
                value="yes"
              />
              <label htmlFor="sanitation_system_appraisal" className="ml-1">
                yes
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("sanitation_system_appraisal", { required: true })}
                id="sanitation_system_appraisal"
                value="no"
              />
              <label htmlFor="sanitation_system_appraisal" className="ml-2">
                no
                <span className="text-gray-500"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 pl-6 mb-6">
        <div className="pr-8">
          <label
            htmlFor="number_of_workers_who_underwent_medical_examination"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            b. Number of workers who underwent the following medical
            examination:
            <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-5 gap-4">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
          <div className="grid grid-cols-5 gap-4">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
          <div className="grid grid-cols-5 gap-6 pb-6">
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
