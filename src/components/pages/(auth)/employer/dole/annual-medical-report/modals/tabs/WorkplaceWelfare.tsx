"use client";

import { useState, useEffect, useMemo } from "react";

function WorkplaceWelfare({
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
  
  // Extract watched values with useMemo
  const keepingMedicalRecords = useMemo(() => watch("keeping_of_medical_records_of_workers"), [watch]);
  const healthEducation = useMemo(() => watch("health_education_and_counselling_by_health_and_safety_personnel"), [watch]);
  const sportsActivities = useMemo(() => watch("sports_activities"), [watch]);

  // Helper to check if a checkbox group is filled
  const isChecked = (val: any) => Array.isArray(val) ? val.length > 0 : !!val;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear all errors first
    clearErrors();
    
    let hasError = false;
    
    // Section a
    const a = watch("keeping_of_medical_records_of_workers");
    if (!isChecked(a)) {
      setError("keeping_of_medical_records_of_workers", {
        type: "manual",
        message: "Please select at least one option."
      });
      hasError = true;
    }
    
    // Section b
    const b = watch("health_education_and_counselling_by_health_and_safety_personnel");
    if (!isChecked(b)) {
      setError("health_education_and_counselling_by_health_and_safety_personnel", {
        type: "manual",
        message: "Please select at least one option."
      });
      hasError = true;
    }
    
    // Physical Fitness Program
    const sports = watch("sports_activities");
    if (!isChecked(sports)) {
      setError("sports_activities", {
        type: "manual",
        message: "Please select at least one option."
      });
      hasError = true;
    }
    
    if (hasError) return;
    setSelectedTab(8);
  };

  // Clear errors on change
  useEffect(() => {
    if (isChecked(keepingMedicalRecords)) {
      clearErrors("keeping_of_medical_records_of_workers");
    }
  }, [keepingMedicalRecords, clearErrors]);
  
  useEffect(() => {
    if (isChecked(healthEducation)) {
      clearErrors("health_education_and_counselling_by_health_and_safety_personnel");
    }
  }, [healthEducation, clearErrors]);
  
  useEffect(() => {
    if (isChecked(sportsActivities)) {
      clearErrors("sports_activities");
    }
  }, [sportsActivities, clearErrors]);

  return (
    <form onSubmit={onSubmit}>
      <div className="gap-4 md:gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            a. Keeping of Medical Records of Workers:
            <span className="text-red-600">*</span>
          </label>
          {errors.keeping_of_medical_records_of_workers && (
            <p className="text-xs text-red-600 mt-1">
              {errors.keeping_of_medical_records_of_workers.message || "Please select at least one option."}
            </p>
          )}
          <div className="flex flex-col md:grid md:grid-cols-4 md:gap-2">
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="radio"
                {...register("keeping_of_medical_records_of_workers")}
                id="keeping_of_medical_records_of_workers_done"
                value="done"
              />
              <label htmlFor="keeping_of_medical_records_of_workers_done" className="ml-1 text-sm">
                Done
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="radio"
                {...register("keeping_of_medical_records_of_workers")}
                id="keeping_of_medical_records_of_workers_not_done"
                value="not_done"
              />
              <label htmlFor="keeping_of_medical_records_of_workers_not_done" className="ml-2 text-sm">
                Not Done
              </label>
            </div>
            <div className="hidden md:block">{""}</div>
            <div className="hidden md:block">{""}</div>
          </div>
        </div>
      </div>
      <div className="gap-4 md:gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            b. Health Education and Counselling by Health and Safety Personnel:
            <span className="text-red-600">*</span>
            <span className="block text-xs text-gray-500">(You may check one or more)</span>
          </label>
          {errors.health_education_and_counselling_by_health_and_safety_personnel && (
            <p className="text-xs text-red-600 mt-1">
              {errors.health_education_and_counselling_by_health_and_safety_personnel.message || "Please select at least one option."}
            </p>
          )}
          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-2">
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("health_education_and_counselling_by_health_and_safety_personnel")}
                id="health_education_and_counselling_by_health_and_safety_personnel_1"
                value="done_individually"
              />
              <label htmlFor="health_education_and_counselling_by_health_and_safety_personnel_1" className="ml-1 text-sm">
                done individually as each worker comes to the clinic for consultation.
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("health_education_and_counselling_by_health_and_safety_personnel")}
                id="health_education_and_counselling_by_health_and_safety_personnel_2"
                value="done "
              />
              <label htmlFor="health_education_and_counselling_by_health_and_safety_personnel_2" className="ml-2 text-sm">
                done in organized group discussions/seminars.
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("health_education_and_counselling_by_health_and_safety_personnel")}
                id="health_education_and_counselling_by_health_and_safety_personnel_3"
                value="done_visual_displays"
              />
              <label htmlFor="health_education_and_counselling_by_health_and_safety_personnel_3" className="ml-1 text-sm">
                done with the use of visual displays and/or promotional materials, leaflets, etc.
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-4 md:gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            c. Other Health Programs:
          </label>
          {/* Desktop layout start */}
          <div className="hidden md:grid md:grid-cols-4 md:gap-2">
            <div className="text-sm font-medium">Kind of Program</div>
            <div className="text-center">
              <h1 className="text-sm font-medium">Seminars</h1>
            </div>
            <div className="text-center">
              <h1 className="text-sm font-medium">Use of Visual Aid/ Materials</h1>
            </div>
            <div className="text-center">
              <h1 className="text-sm font-medium">Counseling</h1>
            </div>
          </div>
          {/* Desktop layout end */}

          {/* Desktop layout start */}
          <div className="hidden md:grid md:grid-cols-4 md:gap-2 mt-4">
            <div className="flex text-sm items-center">- Nutrition Program</div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("nutrition_program")} value="seminars" />
            </div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("nutrition_program")} value="use_of_visual_aid_materials" />
            </div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("nutrition_program")} value="counseling" />
            </div>
            <div className="flex text-sm items-center">- Maternal and Child Care Program</div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("maternal_and_child_care_program")} value="seminars" />
            </div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("maternal_and_child_care_program")} value="use_of_visual_aid_materials" />
            </div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("maternal_and_child_care_program")} value="counseling" />
            </div>
            <div className="flex text-sm items-center">- Family Planning Program</div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("family_planning_program")} value="seminars" />
            </div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("family_planning_program")} value="use_of_visual_aid_materials" />
            </div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("family_planning_program")} value="counseling" />
            </div>
            <div className="flex text-sm items-center">- Mental Health Program</div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("mental_health_program")} value="seminars" />
            </div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("mental_health_program")} value="use_of_visual_aid_materials" />
            </div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("mental_health_program")} value="counseling" />
            </div>
            <div className="flex text-sm items-center">- Personal Health Maintenance</div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("personal_health_maintenance")} value="seminars" />
            </div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("personal_health_maintenance")} value="use_of_visual_aid_materials" />
            </div>
            <div className="flex justify-center items-center">
              <input type="checkbox" {...register("personal_health_maintenance")} value="counseling" />
            </div>
          </div>
          {/* Desktop layout end */}

          {/* Mobile layout start */}
          <div className="flex flex-col gap-4 md:hidden mt-2">
            {/* Nutrition Program */}
            <div>
              <div className="font-medium text-xs mb-1">Nutrition Program</div>
              <div className="flex gap-3">
                {(() => {
                  const nutrition = watch("nutrition_program");
                  const arr = Array.isArray(nutrition) ? nutrition : [];
                  return (
                    <>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("seminars")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("nutrition_program", [...prev, "seminars"]);
                            } else {
                              setValue("nutrition_program", prev.filter((v: string) => v !== "seminars"));
                            }
                          }}
                        /> Seminars
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("use_of_visual_aid_materials")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("nutrition_program", [...prev, "use_of_visual_aid_materials"]);
                            } else {
                              setValue("nutrition_program", prev.filter((v: string) => v !== "use_of_visual_aid_materials"));
                            }
                          }}
                        /> Visual Aid/Materials
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("counseling")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("nutrition_program", [...prev, "counseling"]);
                            } else {
                              setValue("nutrition_program", prev.filter((v: string) => v !== "counseling"));
                            }
                          }}
                        /> Counseling
                      </label>
                    </>
                  );
                })()}
              </div>
            </div>
            {/* Maternal and Child Care Program */}
            <div>
              <div className="font-medium text-xs mb-1">Maternal and Child Care Program</div>
              <div className="flex gap-3">
                {(() => {
                  const maternal = watch("maternal_and_child_care_program");
                  const arr = Array.isArray(maternal) ? maternal : [];
                  return (
                    <>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("seminars")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("maternal_and_child_care_program", [...prev, "seminars"]);
                            } else {
                              setValue("maternal_and_child_care_program", prev.filter((v: string) => v !== "seminars"));
                            }
                          }}
                        /> Seminars
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("use_of_visual_aid_materials")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("maternal_and_child_care_program", [...prev, "use_of_visual_aid_materials"]);
                            } else {
                              setValue("maternal_and_child_care_program", prev.filter((v: string) => v !== "use_of_visual_aid_materials"));
                            }
                          }}
                        /> Visual Aid/Materials
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("counseling")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("maternal_and_child_care_program", [...prev, "counseling"]);
                            } else {
                              setValue("maternal_and_child_care_program", prev.filter((v: string) => v !== "counseling"));
                            }
                          }}
                        /> Counseling
                      </label>
                    </>
                  );
                })()}
              </div>
            </div>
            {/* Family Planning Program */}
            <div>
              <div className="font-medium text-xs mb-1">Family Planning Program</div>
              <div className="flex gap-3">
                {(() => {
                  const family = watch("family_planning_program");
                  const arr = Array.isArray(family) ? family : [];
                  return (
                    <>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("seminars")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("family_planning_program", [...prev, "seminars"]);
                            } else {
                              setValue("family_planning_program", prev.filter((v: string) => v !== "seminars"));
                            }
                          }}
                        /> Seminars
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("use_of_visual_aid_materials")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("family_planning_program", [...prev, "use_of_visual_aid_materials"]);
                            } else {
                              setValue("family_planning_program", prev.filter((v: string) => v !== "use_of_visual_aid_materials"));
                            }
                          }}
                        /> Visual Aid/Materials
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("counseling")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("family_planning_program", [...prev, "counseling"]);
                            } else {
                              setValue("family_planning_program", prev.filter((v: string) => v !== "counseling"));
                            }
                          }}
                        /> Counseling
                      </label>
                    </>
                  );
                })()}
              </div>
            </div>
            {/* Mental Health Program */}
            <div>
              <div className="font-medium text-xs mb-1">Mental Health Program</div>
              <div className="flex gap-3">
                {(() => {
                  const mental = watch("mental_health_program");
                  const arr = Array.isArray(mental) ? mental : [];
                  return (
                    <>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("seminars")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("mental_health_program", [...prev, "seminars"]);
                            } else {
                              setValue("mental_health_program", prev.filter((v: string) => v !== "seminars"));
                            }
                          }}
                        /> Seminars
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("use_of_visual_aid_materials")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("mental_health_program", [...prev, "use_of_visual_aid_materials"]);
                            } else {
                              setValue("mental_health_program", prev.filter((v: string) => v !== "use_of_visual_aid_materials"));
                            }
                          }}
                        /> Visual Aid/Materials
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("counseling")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("mental_health_program", [...prev, "counseling"]);
                            } else {
                              setValue("mental_health_program", prev.filter((v: string) => v !== "counseling"));
                            }
                          }}
                        /> Counseling
                      </label>
                    </>
                  );
                })()}
              </div>
            </div>
            {/* Personal Health Maintenance */}
            <div>
              <div className="font-medium text-xs mb-1">Personal Health Maintenance</div>
              <div className="flex gap-3">
                {(() => {
                  const personal = watch("personal_health_maintenance");
                  const arr = Array.isArray(personal) ? personal : [];
                  return (
                    <>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("seminars")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("personal_health_maintenance", [...prev, "seminars"]);
                            } else {
                              setValue("personal_health_maintenance", prev.filter((v: string) => v !== "seminars"));
                            }
                          }}
                        /> Seminars
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("use_of_visual_aid_materials")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("personal_health_maintenance", [...prev, "use_of_visual_aid_materials"]);
                            } else {
                              setValue("personal_health_maintenance", prev.filter((v: string) => v !== "use_of_visual_aid_materials"));
                            }
                          }}
                        /> Visual Aid/Materials
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={arr.includes("counseling")}
                          onChange={e => {
                            const prev = arr;
                            if (e.target.checked) {
                              setValue("personal_health_maintenance", [...prev, "counseling"]);
                            } else {
                              setValue("personal_health_maintenance", prev.filter((v: string) => v !== "counseling"));
                            }
                          }}
                        /> Counseling
                      </label>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
          {/* Mobile layout end */}
        </div>
      </div>
      <div className="gap-4 md:gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            Physical Fitness Program
          </label>
          <div className="flex flex-col md:grid md:grid-cols-4 md:gap-2 mt-2">
            <div className="mb-2 md:mb-0 text-sm">
              Sports Activities<span className="text-red-600">*</span>
            </div>
            <div className="relative flex items-center gap-2">
              <input
                type="radio"
                {...register("sports_activities")}
                id="sports_activities_yes"
                value="yes"
              />
              <label htmlFor="sports_activities_yes" className="ml-1 text-sm">
                Yes
              </label>
            </div>
            <div className="relative flex items-center gap-2">
              <input
                type="radio"
                {...register("sports_activities")}
                id="sports_activities_no"
                value="no"
              />
              <label htmlFor="sports_activities_no" className="ml-1 text-sm">
                No
              </label>
            </div>
            <div className="hidden md:block">{""}</div>
            <div className="hidden md:block">{""}</div>
          </div>
          {errors.sports_activities && (
            <p className="text-xs text-red-600">
              {errors.sports_activities.message || "Please select at least one option."}
            </p>
          )}
          <div className="flex flex-col md:grid md:grid-cols-4 md:gap-2 mt-2">
            <div className="col-span-1 flex items-center mb-2 md:mb-0">
              <label htmlFor="physical_fitness_program_others" className="text-sm font-medium">Others (Please specify):</label>
            </div>
            <div className="col-span-3">
              <input
                type="text"
                {...register("physical_fitness_program_others")}
                id="physical_fitness_program_others"
                maxLength={100}
                className="ml-2 border-b p-2 border-gray-300 w-56"
                placeholder="Specify sport here"
              />
            </div>
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
