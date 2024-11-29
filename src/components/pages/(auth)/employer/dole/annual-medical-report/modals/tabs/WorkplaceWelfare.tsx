"use client";

function WorkplaceWelfare({
  register,
  handleSubmit,
  setSelectedTab,
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
}) {
  const onSubmit = handleSubmit(() => {
    setSelectedTab(8);
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="gap-6 mt-4 pl-6 mb-6">
        <div>
          <label
            htmlFor="purpose_of_wem_request"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            a. Keeping of Medical Records of Workers:
            <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("keeping_of_medical_records_of_workers")}
                id="keeping_of_medical_records_of_workers"
                value="done"
              />
              <label
                htmlFor="keeping_of_medical_records_of_workers"
                className="ml-1"
              >
                Done
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("keeping_of_medical_records_of_workers")}
                id="keeping_of_medical_records_of_workers"
                value="not_done"
              />
              <label
                htmlFor="keeping_of_medical_records_of_workers"
                className="ml-2"
              >
                Not Done
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div>{""}</div>
            <div>{""}</div>
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 pl-6 mb-6">
        <div>
          <label
            htmlFor="purpose_of_wem_request"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            b. Health Education and Counselling by Health and Safety Personnel:
            (You may check one or more)
            <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register(
                  "health_education_and_counselling_by_health_and_safety_personnel"
                )}
                id="health_education_and_counselling_by_health_and_safety_personnel"
                value="done_individually"
              />
              <label
                htmlFor="health_education_and_counselling_by_health_and_safety_personnel"
                className="ml-1"
              >
                done individually as each worker comes to the clinic for
                consultation.
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register(
                  "health_education_and_counselling_by_health_and_safety_personnel"
                )}
                id="health_education_and_counselling_by_health_and_safety_personnel"
                value="done "
              />
              <label
                htmlFor="health_education_and_counselling_by_health_and_safety_personnel"
                className="ml-2"
              >
                done in organized group discussions/seminars.
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register(
                  "health_education_and_counselling_by_health_and_safety_personnel"
                )}
                id="health_education_and_counselling_by_health_and_safety_personnel"
                value="done_visual_displays"
              />
              <label
                htmlFor="health_education_and_counselling_by_health_and_safety_personnel"
                className="ml-1"
              >
                done with the use of visual displays and/or promotional
                materials, leaflets, etc.
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 pl-6 mb-6">
        <div>
          <label
            htmlFor="purpose_of_wem_request"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            c. Other Health Programs:
            <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2 pt-2">
            <div>Kind of Program</div>
            <div>
              <h1 className="text-sm font-medium pl-14">Seminars</h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                Use of Visual Aid/ Materials
              </h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">Counseling</h1>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div>Nutrition Program</div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("nutrition_program")}
                  id="nutrition_program"
                  value="seminars"
                />
              </h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("nutrition_program")}
                  id="nutrition_program"
                  value="use_of_visual_aid_materials"
                />
              </h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("nutrition_program")}
                  id="nutrition_program"
                  value="counseling"
                />
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div>Maternal and Child Care Program</div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("maternal_and_child_care_program")}
                  id="maternal_and_child_care_program"
                  value="seminars"
                />
              </h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("maternal_and_child_care_program")}
                  id="maternal_and_child_care_program"
                  value="use_of_visual_aid_materials"
                />
              </h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("maternal_and_child_care_program")}
                  id="maternal_and_child_care_program"
                  value="counseling"
                />
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div>Family Planning Program</div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("family_planning_program")}
                  id="family_planning_program"
                  value="seminars"
                />
              </h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("family_planning_program")}
                  id="family_planning_program"
                  value="use_of_visual_aid_materials"
                />
              </h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("family_planning_program")}
                  id="family_planning_program"
                  value="counseling"
                />
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div>Mental Health Program</div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("mental_health_program")}
                  id="mental_health_program"
                  value="seminars"
                />
              </h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("mental_health_program")}
                  id="mental_health_program"
                  value="use_of_visual_aid_materials"
                />
              </h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("mental_health_program")}
                  id="mental_health_program"
                  value="counseling"
                />
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div>Personal Health Maintenance</div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("personal_health_maintenance")}
                  id="personal_health_maintenance"
                  value="seminars"
                />
              </h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("personal_health_maintenance")}
                  id="personal_health_maintenance"
                  value="use_of_visual_aid_materials"
                />
              </h1>
            </div>
            <div>
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("personal_health_maintenance")}
                  id="personal_health_maintenance"
                  value="counseling"
                />
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 pl-6 mb-6">
        <div>
          <label
            htmlFor="purpose_of_wem_request"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Physical Fitness Program
            <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div>Sports Activities</div>
            <div className="relative mt-2 flex items-center gap-1">
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("sports_activities")}
                  id="sports_activities"
                  value="no"
                />
                <label htmlFor="sports_activities" className="ml-1">
                  No
                </label>
              </h1>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("sports_activities")}
                  id="sports_activities"
                  value="yes"
                />
                <label htmlFor="sports_activities" className="ml-1">
                  Yes
                </label>
              </h1>
            </div>
            <div>{""}</div>
            <div>{""}</div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div>Others (Please specify):</div>
            <div className="relative mt-2 flex items-center gap-1">
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("others")}
                  id="others"
                  value="no"
                />
                <label htmlFor="others" className="ml-1">
                  No
                </label>
              </h1>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <h1 className="text-sm font-medium pl-14">
                <input
                  type="checkbox"
                  {...register("others")}
                  id="others"
                  value="yes"
                />
                <label htmlFor="others" className="ml-1">
                  Yes
                </label>
              </h1>
            </div>
            <div>{""}</div>
            <div>{""}</div>
          </div>
        </div>
      </div>
      <hr />
      <div className="py-4 px-4 flex justify-between">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(6)}
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

export default WorkplaceWelfare;
