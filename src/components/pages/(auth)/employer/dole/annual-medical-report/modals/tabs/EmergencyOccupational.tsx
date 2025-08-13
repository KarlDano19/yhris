"use client";

import { useState, useEffect, useRef } from "react";

function EmergencyOccupational({
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
  const [isOtherCheckedA, setIsOtherCheckedA] = useState(false);
  const [isOtherCheckedD, setIsOtherCheckedD] = useState(false);
  const otherCheckboxARef = useRef<HTMLInputElement>(null);
  const otherCheckboxDRef = useRef<HTMLInputElement>(null);

  // Helper to check if a checkbox group is filled
  const isChecked = (val: any) => Array.isArray(val) ? val.length > 0 : !!val;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const a = watch("provided_treatment_room_medical_clinic");
    const aOther = watch("provided_treatment_room_medical_clinic_other_specification");
    const bPhysicianHours = watch("occupational_health_physician_hours_per_day");
    const bPhysicianShift = watch("occupational_health_physician_shift");
    const bDentistHours = watch("occupational_health_dentist_hours_per_day");
    const bDentistShift = watch("occupational_health_dentist_shift");
    const bPractitionerHours = watch("occupational_health_practitioner_hours_per_day");
    const bPractitionerShift = watch("occupational_health_practitioner_shift");
    const bNurseHours = watch("occupational_health_nurse_hours_per_day");
    const bNurseShift = watch("occupational_health_nurse_shift");
    const c = watch("schedule_of_attendance_of_full_time_first_aider");
    const d = watch("occupational_health_personnel_training");
    const dOther = watch("occupational_health_personnel_training_other_specification");

    let hasError = false;
    
    // Clear all errors first
    clearErrors();
    
    // a. validation
    if (!isChecked(a)) {
      setError("provided_treatment_room_medical_clinic", {
        type: "manual",
        message: "Please select at least one option."
      });
      hasError = true;
    } else if (Array.isArray(a) && a.includes("Other") && !aOther) {
      setError("provided_treatment_room_medical_clinic_other_specification", {
        type: "manual",
        message: "Please specify 'Other'."
      });
      hasError = true;
    }

    const hoursFields = [bPhysicianHours, bDentistHours, bPractitionerHours, bNurseHours];
    const shiftFields = [bPhysicianShift, bDentistShift, bPractitionerShift, bNurseShift];

    const hasHours = hoursFields.some(val => val !== undefined && val !== null && val !== "");
    const hasShift = shiftFields.some(val => val !== undefined && val !== null && val !== "");

    if (!hasHours || !hasShift) {
      setError("occupational_health_services_group", {
        type: "manual",
        message: "Input at least one 'hours per day' value and one 'shift' value."
      });
      hasError = true;
    }

    // c. validation
    if (!isChecked(c)) {
      setError("schedule_of_attendance_of_full_time_first_aider", {
        type: "manual",
        message: "Please select at least one option."
      });
      hasError = true;
    }
    
    // d. validation
    if (!isChecked(d)) {
      setError("occupational_health_personnel_training", {
        type: "manual",
        message: "Please select at least one option."
      });
      hasError = true;
    } else if (Array.isArray(d) && d.includes("Other") && !dOther) {
      setError("occupational_health_personnel_training_other_specification", {
        type: "manual",
        message: "Please specify 'Other'."
      });
      hasError = true;
    }
    
    if (hasError) return;
    setSelectedTab(4);
  };

  // Clear errors on change
  const providedTreatmentRoom = watch("provided_treatment_room_medical_clinic");
  const providedTreatmentRoomOther = watch("provided_treatment_room_medical_clinic_other_specification");
  const physicianHours = watch("occupational_health_physician_hours_per_day");
  const dentistHours = watch("occupational_health_dentist_hours_per_day");
  const practitionerHours = watch("occupational_health_practitioner_hours_per_day");
  const nurseHours = watch("occupational_health_nurse_hours_per_day");
  const physicianShift = watch("occupational_health_physician_shift");
  const dentistShift = watch("occupational_health_dentist_shift");
  const practitionerShift = watch("occupational_health_practitioner_shift");
  const nurseShift = watch("occupational_health_nurse_shift");
  const scheduleAttendance = watch("schedule_of_attendance_of_full_time_first_aider");
  const personnelTraining = watch("occupational_health_personnel_training");
  const personnelTrainingOther = watch("occupational_health_personnel_training_other_specification");

  // Sync local state with form data
  useEffect(() => {
    if (Array.isArray(providedTreatmentRoom) && providedTreatmentRoom.includes("Other")) {
      setIsOtherCheckedA(true);
      // Manually set the checkbox checked state
      if (otherCheckboxARef.current) {
        otherCheckboxARef.current.checked = true;
      }
    } else if (providedTreatmentRoomOther) {
      setIsOtherCheckedA(true);
      if (otherCheckboxARef.current) {
        otherCheckboxARef.current.checked = true;
      }
    } else {
      setIsOtherCheckedA(false);
      if (otherCheckboxARef.current) {
        otherCheckboxARef.current.checked = false;
      }
    }
  }, [providedTreatmentRoom, providedTreatmentRoomOther]);

  useEffect(() => {
    if (Array.isArray(personnelTraining) && personnelTraining.includes("Other")) {
      setIsOtherCheckedD(true);
      // Manually set the checkbox checked state
      if (otherCheckboxDRef.current) {
        otherCheckboxDRef.current.checked = true;
      }
    } else if (personnelTrainingOther) {
      setIsOtherCheckedD(true);
      if (otherCheckboxDRef.current) {
        otherCheckboxDRef.current.checked = true;
      }
    } else {
      setIsOtherCheckedD(false);
      if (otherCheckboxDRef.current) {
        otherCheckboxDRef.current.checked = false;
      }
    }
  }, [personnelTraining, personnelTrainingOther]);

  useEffect(() => {
    if (isChecked(providedTreatmentRoom)) {
      clearErrors("provided_treatment_room_medical_clinic");
    }
  }, [providedTreatmentRoom, clearErrors]);
  useEffect(() => {
    if (providedTreatmentRoomOther) {
      clearErrors("provided_treatment_room_medical_clinic_other_specification");
    }
  }, [providedTreatmentRoomOther, clearErrors]);
  useEffect(() => {
    const hoursFields = [physicianHours, dentistHours, practitionerHours, nurseHours];
    if (hoursFields.some(val => val !== undefined && val !== null && val !== "")) {
      clearErrors("occupational_health_services_group");
    }
  }, [physicianHours, dentistHours, practitionerHours, nurseHours, clearErrors]);
  useEffect(() => {
    const shiftFields = [physicianShift, dentistShift, practitionerShift, nurseShift];
    if (shiftFields.some(val => val !== undefined && val !== null && val !== "")) {
      clearErrors("occupational_health_services_group");
    }
  }, [physicianShift, dentistShift, practitionerShift, nurseShift, clearErrors]);
  useEffect(() => {
    if (isChecked(scheduleAttendance)) {
      clearErrors("schedule_of_attendance_of_full_time_first_aider");
    }
  }, [scheduleAttendance, clearErrors]);
  useEffect(() => {
    if (isChecked(personnelTraining)) {
      clearErrors("occupational_health_personnel_training");
    }
  }, [personnelTraining, clearErrors]);
  useEffect(() => {
    if (personnelTrainingOther) {
      clearErrors("occupational_health_personnel_training_other_specification");
    }
  }, [personnelTrainingOther, clearErrors]);

  return (
    <form onSubmit={onSubmit}>
      <div className="gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label
            htmlFor="provided_treatment_room_medical_clinic"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            a. The employer provides a treatment room/medical clinic in the
            workplace with medicines and facilities:
            <span className="text-red-600">*</span>
          </label>
          {errors.provided_treatment_room_medical_clinic && (
            <p className="text-xs text-red-600 mt-1">
              {errors.provided_treatment_room_medical_clinic.message || "Please select at least one option."}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pl-0 md:pl-6">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("provided_treatment_room_medical_clinic")}
                id="provided_treatment_room_medical_clinic"
                value="yes"
              />
              <label
                htmlFor="provided_treatment_room_medical_clinic"
                className="ml-1"
              >
                yes
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("provided_treatment_room_medical_clinic")}
                id="provided_treatment_room_medical_clinic"
                value="no"
              />
              <label
                htmlFor="provided_treatment_room_medical_clinic"
                className="ml-2"
              >
                no
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("provided_treatment_room_medical_clinic")}
                id="provided_treatment_room_medical_clinic_other"
                value="Other"
                ref={otherCheckboxARef}
                onChange={(e) => {
                  setIsOtherCheckedA(e.target.checked);
                  // If unchecking and there's text, clear the text field
                  if (!e.target.checked && providedTreatmentRoomOther) {
                    // This will be handled by the form reset or manual clearing
                  }
                }}
              />
              <label
                htmlFor="provided_treatment_room_medical_clinic_other"
                className="ml-2"
              >
                others, please specify
                <span className="text-gray-500"></span>
              </label>
            </div>
            {isOtherCheckedA && (
              <div className="relative mt-2 flex items-center gap-2 col-span-3">
                <input
                  type="text"
                  {...register(
                    "provided_treatment_room_medical_clinic_other_specification",
                    {
                      required: isOtherCheckedA,
                    }
                  )}
                  placeholder="Please specify"
                  className="border-b p-2 border-gray-300"
                />
                {errors.provided_treatment_room_medical_clinic_other_specification && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.provided_treatment_room_medical_clinic_other_specification.message || "Please specify 'Other'."}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div className="pr-0 md:pr-8">
          <label
            htmlFor="organized_provided_as_a_service"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            b. Occupational health services as described above, is
            organized/provided as a Service:
            <span className="text-red-600">*</span>
          </label>
          {errors.occupational_health_services_group && (
            <p className="text-xs text-red-600 mt-1">
              {errors.occupational_health_services_group.message || "Input at least one 'hours per day' value and one 'shift' value."}
            </p>
          )}
          
          {/* Desktop layout - hidden on mobile */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-4">
              <div>{""}</div>
              <div>{""}</div>
              <div>
                <h1 className="text-sm font-medium pl-14">Shift</h1>
              </div>
            </div>
            {/* Keep existing grid layout for desktop */}
            <div className="grid grid-cols-3 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Occupational health physician
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(`occupational_health_physician_hours_per_day`)}
                    id={`occupational_health_physician_hours_per_day`}
                    className="rounded-md w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                  <h1 className="text-sm font-medium ml-4">Hrs/day</h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`occupational_health_physician_shift`)}
                    id={`occupational_health_physician_shift`}
                    className="rounded-md w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Occupational health dentist
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(`occupational_health_dentist_hours_per_day`)}
                    id={`occupational_health_dentist_hours_per_day`}
                    className="rounded-md w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                  <h1 className="text-sm font-medium ml-4">Hrs/day</h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`occupational_health_dentist_shift`)}
                    id={`occupational_health_dentist_shift`}
                    className="rounded-md w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Occupational health practitioner
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(
                      `occupational_health_practitioner_hours_per_day`
                    )}
                    id={`occupational_health_practitioner_hours_per_day`}
                    className="rounded-md w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                  <h1 className="text-sm font-medium ml-4">Hrs/day</h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`occupational_health_practitioner_shift`)}
                    id={`occupational_health_practitioner_shift`}
                    className="rounded-md w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 pb-6">
              <div className="flex justify-start items-center pl-6">
                <div className="grid-item">
                  <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
                    Occupational health nurse
                  </h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2 flex flex-row items-center">
                  <input
                    type="number"
                    {...register(`occupational_health_nurse_hours_per_day`)}
                    id={`occupational_health_nurse_hours_per_day`}
                    className="rounded-md w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                  <h1 className="text-sm font-medium ml-4">Hrs/day</h1>
                </div>
              </div>
              <div className="grid-item">
                <div className="mt-2">
                  <input
                    type="number"
                    {...register(`occupational_health_nurse_shift`)}
                    id={`occupational_health_nurse_shift`}
                    className="rounded-md w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile layout - hidden on desktop */}
          <div className="md:hidden mt-4">
            <div className="mb-6">
              <h1 className="font-medium mb-2">Occupational health physician</h1>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Hours/day</label>
                  <input
                    type="number"
                    value={physicianHours || ""}
                    onChange={(e) => setValue("occupational_health_physician_hours_per_day", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Shift</label>
                  <input
                    type="number"
                    value={physicianShift || ""}
                    onChange={(e) => setValue("occupational_health_physician_shift", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h1 className="font-medium mb-2">Occupational health dentist</h1>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Hours/day</label>
                  <input
                    type="number"
                    value={dentistHours || ""}
                    onChange={(e) => setValue("occupational_health_dentist_hours_per_day", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Shift</label>
                  <input
                    type="number"
                    value={dentistShift || ""}
                    onChange={(e) => setValue("occupational_health_dentist_shift", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h1 className="font-medium mb-2">Occupational health practitioner</h1>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Hours/day</label>
                  <input
                    type="number"
                    value={practitionerHours || ""}
                    onChange={(e) => setValue("occupational_health_practitioner_hours_per_day", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Shift</label>
                  <input
                    type="number"
                    value={practitionerShift || ""}
                    onChange={(e) => setValue("occupational_health_practitioner_shift", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h1 className="font-medium mb-2">Occupational health nurse</h1>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Hours/day</label>
                  <input
                    type="number"
                    value={nurseHours || ""}
                    onChange={(e) => setValue("occupational_health_nurse_hours_per_day", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Shift</label>
                  <input
                    type="number"
                    value={nurseShift || ""}
                    onChange={(e) => setValue("occupational_health_nurse_shift", e.target.value)}
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label
            htmlFor="schedule_of_attendance_of_full_time_first_aider"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            c. Schedule of attendance of full time first aider:
            <span className="text-red-600">*</span>
          </label>
          {errors.schedule_of_attendance_of_full_time_first_aider && (
            <p className="text-xs text-red-600 mt-1">
              {errors.schedule_of_attendance_of_full_time_first_aider.message || "Please select at least one option."}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pl-0 md:pl-6">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("schedule_of_attendance_of_full_time_first_aider")}
                id="schedule_of_attendance_of_full_time_first_aider"
                value="1st shift"
              />
              <label
                htmlFor="schedule_of_attendance_of_full_time_first_aider"
                className="ml-1"
              >
                1st shift
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("schedule_of_attendance_of_full_time_first_aider")}
                id="schedule_of_attendance_of_full_time_first_aider"
                value="2nd shift"
              />
              <label
                htmlFor="schedule_of_attendance_of_full_time_first_aider"
                className="ml-2"
              >
                2nd shift
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("schedule_of_attendance_of_full_time_first_aider")}
                id="schedule_of_attendance_of_full_time_first_aider"
                value="3rd shift"
              />
              <label
                htmlFor="schedule_of_attendance_of_full_time_first_aider"
                className="ml-2"
              >
                3rd shift
                <span className="text-gray-500"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="gap-6 mt-4 px-4 md:pl-6 mb-6">
        <div>
          <label
            htmlFor="occupational_health_personnel_training"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            d. The following occupational health personnel of the establishment
            have undergone training in occupational health and safety/first aid:
            <span className="text-red-600">*</span>
          </label>
          {errors.occupational_health_personnel_training && (
            <p className="text-xs text-red-600 mt-1">
              {errors.occupational_health_personnel_training.message || "Please select at least one option."}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pl-0 md:pl-6">
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("occupational_health_personnel_training")}
                id="occupational_health_personnel_training"
                value="occupational health physician"
              />
              <label
                htmlFor="occupational_health_personnel_training"
                className="ml-1"
              >
                occupational health physician
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("occupational_health_personnel_training")}
                id="occupational_health_personnel_training"
                value="occupational health dentist"
              />
              <label
                htmlFor="occupational_health_personnel_training"
                className="ml-2"
              >
                occupational health dentist
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("occupational_health_personnel_training")}
                id="occupational_health_personnel_training"
                value="occupational health nurse"
              />
              <label
                htmlFor="occupational_health_personnel_training"
                className="ml-1"
              >
                occupational health nurse
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                {...register("occupational_health_personnel_training")}
                id="occupational_health_personnel_training"
                value="first aider"
              />
              <label
                htmlFor="occupational_health_personnel_training"
                className="ml-2"
              >
                first aider
                <span className="text-gray-500"></span>
              </label>
            </div>
            <div className="relative mt-2 flex items-center gap-1">
              <input
                type="checkbox"
                {...register("occupational_health_personnel_training")}
                id="occupational_health_personnel_training_other"
                value="Other"
                ref={otherCheckboxDRef}
                onChange={(e) => {
                  setIsOtherCheckedD(e.target.checked);
                  // If unchecking and there's text, clear the text field
                  if (!e.target.checked && personnelTrainingOther) {
                    // This will be handled by the form reset or manual clearing
                  }
                }}
              />
              <label
                htmlFor="occupational_health_personnel_training_other"
                className="ml-2"
              >
                others, please specify
                <span className="text-gray-500"></span>
              </label>
            </div>
            {isOtherCheckedD && (
              <div className="relative mt-2 flex items-center gap-2 col-span-3">
                <input
                  type="text"
                  {...register(
                    "occupational_health_personnel_training_other_specification",
                    {
                      required: isOtherCheckedD,
                    }
                  )}
                  placeholder="Please specify"
                  className="border-b p-2 border-gray-300"
                />
                {errors.occupational_health_personnel_training_other_specification && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.occupational_health_personnel_training_other_specification.message || "Please specify 'Other'."}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <hr />
      <div className="py-4 px-4 flex justify-between">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(2)}
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

export default EmergencyOccupational;
