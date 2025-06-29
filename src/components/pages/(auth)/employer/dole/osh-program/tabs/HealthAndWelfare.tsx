"use client";

import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";

import { MinusIcon, XCircleIcon, EyeIcon } from "@heroicons/react/24/solid";

import CustomDatePicker from "@/components/CustomDatePicker";
import FilePreviewModal from "../modals/FilePreviewModal";

import ClipIcon from "@/svg/ClipIcon";

export default function HealthAndWelfare({
  control,
  register,
  validationMessage,
  watch,
  setValue,
  missingFields = []
}: {
  control: any;
  register: any;
  validationMessage?: string;
  watch: any;
  setValue: any;
  missingFields?: string[];
}) {
  // State for file preview modal
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState('');
  const [currentFileName, setCurrentFileName] = useState('');

  // Function to open file preview
  const openFilePreview = (fileUrl: string, fileName: string = '') => {
    if (!fileUrl) return;
    
    // Add a timestamp query parameter to prevent caching
    const timestamp = new Date().getTime();
    setCurrentFileUrl(`${fileUrl}?t=${timestamp}`);
    setCurrentFileName(fileName);
    setIsFileModalOpen(true);
  };

  const {
    fields: safetyOfficerFields,
    append: safetyOfficerAppend,
    remove: safetyOfficerRemove,
  } = useFieldArray({
    control,
    name: "safety_officers",
  });

  const {
    fields: healthPersonnelFields,
    append: healthPersonnelAppend,
    remove: healthPersonnelRemove,
  } = useFieldArray({
    control,
    name: "health_personnel",
  });

  const {
    fields: healthTrainingFields,
    append: healthTrainingAppend,
    remove: healthTrainingRemove,
  } = useFieldArray({
    control,
    name: "health_training",
  });

  const {
    fields: riskAssessmentFields,
    append: riskAssessmentAppend,
    remove: riskAssessmentRemove,
  } = useFieldArray({
    control,
    name: "risk_assessment",
  });

  const {
    fields: reportedIncidentsFields,
    append: reportedIncidentsAppend,
    remove: reportedIncidentsRemove,
  } = useFieldArray({
    control,
    name: "reported_incidents",
  });

  const {
    fields: safetyMeetingFields,
    append: safetyMeetingAppend,
    remove: safetyMeetingRemove,
  } = useFieldArray({
    control,
    name: "safety_meeting",
  });

  // Helper function to check if a field is missing
  const isMissingField = (fieldName: string) => {
    return missingFields.includes(fieldName);
  };

  return (
    <>
      <form>
        <div className="px-4 pt-4 pb-6">
          <div className={`${validationMessage ? '' : 'hidden'} rounded-md bg-red-50 p-4 mb-3`}>
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
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Medical Surveillance
            </label>
            <h1 className="text-sm text-gray-500">
              The company will require all employees to undergo a baseline or
              initial medical health examination prior to assigning to a
              potentially hazardous activity.  The examination will include but
              not limited to the following: 
            </h1>
          </div>
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              a. Routine
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="relative mt-2 pl-4 flex gap-2">
              <Controller
                control={control}
                name="routine_medical_surveillance"
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="cbc"
                    value="CBC"
                    checked={Array.isArray(field.value) && field.value.includes("CBC")}
                    onChange={(e) => {
                      const currentValue = Array.isArray(field.value) ? field.value : [];
                      if (e.target.checked) {
                        field.onChange([...currentValue, e.target.value]);
                      } else {
                        field.onChange(currentValue.filter(item => item !== e.target.value));
                      }
                    }}
                  />
                )}
              />
              <label htmlFor="cbc" className="ml-2 mt-1">
                CBC
              </label>
            </div>
            <div className="relative mt-2 pl-4 flex gap-2">
              <Controller
                control={control}
                name="routine_medical_surveillance"
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="chest_xray"
                    value="Chest X-ray"
                    checked={Array.isArray(field.value) && field.value.includes("Chest X-ray")}
                    onChange={(e) => {
                      const currentValue = Array.isArray(field.value) ? field.value : [];
                      if (e.target.checked) {
                        field.onChange([...currentValue, e.target.value]);
                      } else {
                        field.onChange(currentValue.filter(item => item !== e.target.value));
                      }
                    }}
                  />
                )}
              />
              <label htmlFor="chest_xray" className="ml-2 mt-1">
                Chest X-ray
              </label>
            </div>
            <div className="relative mt-2 pl-4 flex gap-2">
              <Controller
                control={control}
                name="routine_medical_surveillance"
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="urinalysis"
                    value="Urinalysis"
                    checked={Array.isArray(field.value) && field.value.includes("Urinalysis")}
                    onChange={(e) => {
                      const currentValue = Array.isArray(field.value) ? field.value : [];
                      if (e.target.checked) {
                        field.onChange([...currentValue, e.target.value]);
                      } else {
                        field.onChange(currentValue.filter(item => item !== e.target.value));
                      }
                    }}
                  />
                )}
              />
              <label htmlFor="urinalysis" className="ml-2 mt-1">
                Urinalysis
              </label>
            </div>
            <div className="relative mt-2 pl-4 flex gap-2">
              <Controller
                control={control}
                name="routine_medical_surveillance"
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="stool_examination"
                    value="Stool Examination"
                    checked={Array.isArray(field.value) && field.value.includes("Stool Examination")}
                    onChange={(e) => {
                      const currentValue = Array.isArray(field.value) ? field.value : [];
                      if (e.target.checked) {
                        field.onChange([...currentValue, e.target.value]);
                      } else {
                        field.onChange(currentValue.filter(item => item !== e.target.value));
                      }
                    }}
                  />
                )}
              />
              <label htmlFor="stool_examination" className="ml-2 mt-1">
                Stool Examination
              </label>
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              b. Special
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="relative mt-2 pl-4 flex gap-2">
              <input
                type="checkbox"
                {...register("special_medical_surveillance")}
                id="blood_chemistry"
                value="Blood Chemistry"
                checked={Array.isArray(watch("special_medical_surveillance")) && watch("special_medical_surveillance").includes("Blood Chemistry")}
              />
              <label htmlFor="blood_chemistry" className="ml-2 mt-1">
                Blood Chemistry
              </label>
            </div>
            <div className="relative mt-2 pl-4 flex gap-2">
              <input
                type="checkbox"
                {...register("special_medical_surveillance")}
                id="ecg"
                value="ECG"
                checked={Array.isArray(watch("special_medical_surveillance")) && watch("special_medical_surveillance").includes("ECG")}
              />
              <label htmlFor="ecg" className="ml-2 mt-1">
                ECG
              </label>
            </div>
            <div className="relative mt-2 pl-4 flex gap-2 items-center">
              <Controller
                control={control}
                name="special_medical_surveillance"
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="others"
                    value="Others"
                    checked={Array.isArray(field.value) && field.value.some((item: string) => item === "Others" || (item && item.startsWith("Others:")))}
                    onChange={(e) => {
                      const currentValue = Array.isArray(field.value) ? 
                        field.value.filter((item: string) => !(item && item.startsWith("Others"))) : [];
                      
                      if (e.target.checked) {
                        field.onChange([...currentValue, "Others"]);
                      } else {
                        field.onChange(currentValue);
                        setValue("special_medical_surveillance_other", "");
                      }
                    }}
                  />
                )}
              />
              <label htmlFor="others" className="ml-2 mt-1 whitespace-nowrap">
                Others, please specify
              </label>
              {Array.isArray(watch("special_medical_surveillance")) && 
                watch("special_medical_surveillance").some((item: string) => item === "Others" || (item && item.startsWith("Others:"))) && (
                <input
                  type="text"
                  id="special_medical_surveillance_other"
                  placeholder="Please specify"
                  className="rounded-md ml-2 w-full md:w-60 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  value={(() => {
                    const values = watch("special_medical_surveillance") || [];
                    const othersValue = values.find((item: string) => item && item.startsWith("Others:"));
                    return othersValue ? othersValue.replace("Others: ", "") : "";
                  })()}
                  onChange={(e) => {
                    const otherValue = e.target.value;
                    setValue("special_medical_surveillance_other", otherValue);
                    
                    // Update the special_medical_surveillance array
                    const currentValues = Array.isArray(watch("special_medical_surveillance")) ? 
                      watch("special_medical_surveillance").filter((item: string) => !(item && item.startsWith("Others"))) : [];
                    
                    if (otherValue.trim()) {
                      setValue("special_medical_surveillance", [...currentValues, `Others: ${otherValue}`]);
                    } else {
                      setValue("special_medical_surveillance", [...currentValues, "Others"]);
                    }
                  }}
                />
              )}
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              c. Schedule of annual medical examination
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="relative mt-2 pl-4 flex gap-2">
              <input
                type="checkbox"
                {...register("schedule_of_annual_medical_examination")}
                id="q1"
                value="Q1"
                checked={Array.isArray(watch("schedule_of_annual_medical_examination")) && watch("schedule_of_annual_medical_examination").includes("Q1")}
              />
              <label htmlFor="q1" className="ml-2 mt-1">
                Q1
              </label>
            </div>
            <div className="relative mt-2 pl-4 flex gap-2">
              <input
                type="checkbox"
                {...register("schedule_of_annual_medical_examination")}
                id="q2"
                value="Q2"
                checked={Array.isArray(watch("schedule_of_annual_medical_examination")) && watch("schedule_of_annual_medical_examination").includes("Q2")}
              />
              <label htmlFor="q2" className="ml-2 mt-1">
                Q2
              </label>
            </div>
            <div className="relative mt-2 pl-4 flex gap-2">
              <input
                type="checkbox"
                {...register("schedule_of_annual_medical_examination")}
                id="q3"
                value="Q3"
                checked={Array.isArray(watch("schedule_of_annual_medical_examination")) && watch("schedule_of_annual_medical_examination").includes("Q3")}
              />
              <label htmlFor="q3" className="ml-2 mt-1">
                Q3
              </label>
            </div>
            <div className="relative mt-2 pl-4 flex gap-2">
              <input
                type="checkbox"
                {...register("schedule_of_annual_medical_examination")}
                id="q4"
                value="Q4"
                checked={Array.isArray(watch("schedule_of_annual_medical_examination")) && watch("schedule_of_annual_medical_examination").includes("Q4")}
              />
              <label htmlFor="q4" className="ml-2 mt-1">
                Q4
              </label>
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              d. Is random drug testing conducted?
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="relative mt-2 pl-4 flex gap-2">
              <Controller
                control={control}
                name="random_drug_testing"
                defaultValue={null}
                render={({ field }) => (
                  <>
                    <input
                      type="radio"
                      id="drug_test_yes"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                    />
                    <label htmlFor="drug_test_yes" className="ml-2 mt-1">
                      Yes
                    </label>
                  </>
                )}
              />
            </div>
            <div className="relative mt-2 pl-4 flex gap-2">
              <Controller
                control={control}
                name="random_drug_testing"
                defaultValue={null}
                render={({ field }) => (
                  <>
                    <input
                      type="radio"
                      id="drug_test_no"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                    />
                    <label htmlFor="drug_test_no" className="ml-2 mt-1">
                      No
                    </label>
                  </>
                )}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              First-Aid, Health Care Medicines and Equipment Facilities
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                No. of treatment rooms/first aid rooms in the company
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="number"
                  min="0"
                  defaultValue={0}
                  {...register("no_of_treatment_rooms_first_aid_rooms")}
                  id="no_of_treatment_rooms_first_aid_rooms"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('no_of_treatment_rooms_first_aid_rooms') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                No. of clinics in the workplace
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="number"
                  min="0"
                  {...register("no_of_clinics_in_the_workplace")}
                  id="no_of_clinics_in_the_workplace"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('no_of_clinics_in_the_workplace') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Hospitals you&apos;re affiliated with
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("hospitals_youre_affiliated_with")}
                  id="hospitals_youre_affiliated_with"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('hospitals_youre_affiliated_with') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Health Programs for the promotion, prevention and control
            </label>
            <h1 className="text-sm text-gray-500">
              This refers to : Drug-free Workplace in compliance to RA 9165, Human
              Immunodeficiency Syndrome (HIV/AIDS) in compliance to (RA 8504)  RA
              11166, Tuberculosis in compliance to EO 187-03, Hepatitis B in
              compliance to DOLE Advisory No. 05 Series of 2010, Mental Health in
              compliance to RA 11036.
            </h1>
          </div>
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Composition and Duties of Safety and Health Committee
            </label>
            <h1 className="text-sm text-gray-500">
              The SHC of the company is responsible to plan, develop and implement
              OSH policies and programs, monitor and evaluate OSH programs and
              investigate all aspect of the work pertaining to the safety and
              health of all the workers. SHC   shall be composed of the following
              in compliance with the law
            </h1>
          </div>
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              A) For establishments with less than ten workers and low risk
              establishments with ten (10) to fifty (50) workers. A SO1 shall
              establish an OSH committee composed of the following:
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Chairperson
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("chairperson_less_than_ten")}
                  id="chairperson_less_than_ten"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('chairperson_less_than_ten') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Secretary
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("secretary_less_than_ten")}
                  id="secretary_less_than_ten"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('secretary_less_than_ten') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Member
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("member_less_than_ten")}
                  id="member_less_than_ten"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('member_less_than_ten') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              B) For medium to high risk establishments with ten (10) to fifty
              (50) workers and low to high risk establishments with fifty-one (51)
              workers and above. The OSH committee of the covered workplace shall
              be composed of the following:
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ex-Officio Chairperson
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("chairperson_medium_to_high")}
                  id="chairperson_medium_to_high"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('chairperson_medium_to_high') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Secretary
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("secretary_medium_to_high")}
                  id="secretary_medium_to_high"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('secretary_medium_to_high') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
          </div>
          <div className="gap-4 sm:gap-6 mt-4">
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ex-Officio Members
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <input
                  type="text"
                  {...register("ex_officio_members")}
                  id="ex_officio_members"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('ex_officio_members') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
                <input
                  type="text"
                  {...register("ex_officio_members_2")}
                  id="ex_officio_members_2"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('ex_officio_members_2') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
                <input
                  type="text"
                  {...register("ex_officio_members_3")}
                  id="ex_officio_members_3"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('ex_officio_members_3') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
          </div>
          <div className="gap-4 sm:gap-6 mt-4">
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Members
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <input
                  type="text"
                  {...register("members")}
                  id="members"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('members') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
                <input
                  type="text"
                  {...register("members_2")}
                  id="members_2"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('members_2') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              C) Joint Coordinating Committee:  For two (2) or more establishments
              housed under one building or complex including malls.
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ex-Officio Chairperson
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("chairperson_joint_coordinating")}
                  id="chairperson_joint_coordinating"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('chairperson_joint_coordinating') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Secretary
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("secretary_joint_coordinating")}
                  id="secretary_joint_coordinating"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('secretary_joint_coordinating') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
          </div>
          <div className="gap-4 sm:gap-6 mt-4">
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Members
                <span className="text-red-600">*</span>
                <h1 className="text-sm text-gray-500">
                  Name of 2 safety officers from the building selected to the
                  Joint OSH Committee
                </h1>
              </label>
              <div className="relative mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <input
                  type="text"
                  {...register("ex_officio_members_1")}
                  id="ex_officio_members_1"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('ex_officio_members_1') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
                <input
                  type="text"
                  {...register("ex_officio_members_2")}
                  id="ex_officio_members_2"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('ex_officio_members_2') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
          </div>
          <div className="gap-4 sm:gap-6 mt-4">
            <div>
              <h1 className="text-sm text-gray-500">
                Name of two (2) workers&apos; representatives one from which must be
                from a union if organized from any establishments under the
                building
              </h1>
              <div className="relative mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <input
                  type="text"
                  {...register("ex_officio_members_3")}
                  id="ex_officio_members_3"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('ex_officio_members_3') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
                <input
                  type="text"
                  {...register("ex_officio_members_4")}
                  id="ex_officio_members_4"
                  className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('ex_officio_members_4') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-sm text-gray-500">
              (All members of the HSC shall perform their duties and
              responsibilities by the OSH law and its implementing guidelines.) 
            </h1>
            <h1 className="text-sm text-gray-500 mt-4">
              Safety and Health Committee Minutes/Reports submitted to DOLE (pls
              attach latest OSH committee minutes/report)
            </h1>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <div className="relative mt-2 pl-4 flex gap-2">
              <Controller
                control={control}
                name="duties_and_responsibilities"
                defaultValue={null}
                render={({ field }) => (
                  <>
                    <input
                      type="radio"
                      id="duties_yes"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                    />
                    <label htmlFor="duties_yes" className="ml-2 mt-1">
                      Yes
                    </label>
                  </>
                )}
              />
            </div>
            <div className="relative mt-2 pl-4 flex gap-2">
              <Controller
                control={control}
                name="duties_and_responsibilities"
                defaultValue={null}
                render={({ field }) => (
                  <>
                    <input
                      type="radio"
                      id="duties_no"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                    />
                    <label htmlFor="duties_no" className="ml-2 mt-1">
                      No
                    </label>
                  </>
                )}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              OSH Personnel and Facilities
            </label>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4">
            <div className="sm:col-span-4 mt-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Safety Officer
              </label>
              <h1 className="text-sm text-gray-500 mt-2">
                Safety Officer(s): (attach certificate of training/s prescribed by
                DOLE)
              </h1>
              <div className="mt-4 w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 text-center">
                  <thead className="bg-[#D8E6FB] rounded-lg border-2 border-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="px-2 sm:px-3 py-3.5 text-xs sm:text-sm font-semibold text-gray-900"
                      >
                        Name of Safety Officer
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-3 py-3.5 text-xs sm:text-sm font-semibold text-gray-900"
                      >
                        Training(s) and its No. of Hrs
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-3 py-3.5 text-xs sm:text-sm font-semibold text-gray-900"
                      >
                        Certificate
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-3 py-3.5 text-xs sm:text-sm font-semibold text-gray-900"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {safetyOfficerFields.map((item, index) => (
                      <tr
                        key={item.id}
                        className="cursor-pointer border-b border-gray-200"
                      >
                        <td className="whitespace-nowrap px-2 sm:px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <input
                            type="text"
                            {...register(`safety_officers.${index}.name`)}
                            id={`safety_officers.${index}.name`}
                            className="rounded-md w-full border-0 px-2 sm:px-3 py-1.5 text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-2 sm:px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <input
                            type="text"
                            {...register(`safety_officers.${index}.training_and_hours`)}
                            id={`safety_officers.${index}.training_and_hours`}
                            className="rounded-md w-full border-0 px-2 sm:px-3 py-1.5 text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-2 sm:px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <div className="flex items-center justify-center gap-2">
                            <input
                              id={`certificate_${item.id || index}`}
                              type="file"
                              className="hidden rounded-md w-full border-0 px-2 sm:px-3 py-1.5 text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm sm:leading-6"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  // Create a new file with a unique name to prevent browser caching
                                  const uniqueFileName = `${Date.now()}_${file.name}`;
                                  const uniqueFile = new File([file], uniqueFileName, { type: file.type });
                                  setValue(`safety_officers.${index}.certificate`, uniqueFile);
                                }
                              }}
                            />
                            <label
                              htmlFor={`certificate_${item.id || index}`}
                              className="cursor-pointer"
                            >
                              <ClipIcon hasFile={!!watch(`safety_officers.${index}.certificate`)} />
                            </label>
                            
                            {!!watch(`safety_officers.${index}.certificate`) && typeof watch(`safety_officers.${index}.certificate`) === 'string' && (
                              <EyeIcon 
                                className="h-4 w-4 sm:h-5 sm:w-5 text-savoy-blue cursor-pointer"
                                onClick={() => openFilePreview(watch(`safety_officers.${index}.certificate`))}
                              />
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-2 sm:px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <div className="flex justify-center items-center">
                            <button
                              type="button"
                              className="flex justify-center items-center rounded-md bg-red-600 p-1.5 sm:p-2 text-white"
                              onClick={() => safetyOfficerRemove(index)}
                            >
                              <MinusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-start mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    safetyOfficerAppend({ 
                      id: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                      name: '',
                      training_and_hours: '',
                      certificate: null
                    });
                  }}
                  className="bg-savoy-blue text-white px-3 sm:px-4 py-2 rounded-md text-sm"
                >
                  Add new line
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1  gap-6 mt-4">
            <div className="sm:col-span-4 mt-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Emergency Occupational Health Personnel and Facilities
                <h1 className="text-sm text-gray-500 mt-2">
                  List of competent emergency health personnel within the worksite
                  duly complemented by adequate medical supplies, equipment and
                  facilities based on the total number of workers.
                </h1>
              </label>
              <div className="mt-4 w-full overflow-auto">
                <table className="min-w-full divide-y divide-gray-300 text-center">
                  <thead className="bg-[#D8E6FB] rounded-lg border-2 border-gray-200 text-cente">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Shift/Area/Unit/Department
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Total No. of Workers/Areas
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Health Personnel
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Facilities
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Attachment
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {healthPersonnelFields.map((item, index) => (
                      <tr
                        key={item.id}
                        className="cursor-pointer border-b border-gray-200"
                      >
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <input
                            type="text"
                            {...register(`health_personnel.${index}.shift_area_department`)}
                            id={`health_personnel.${index}.shift_area_department`}
                            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <input
                            type="number"
                            min="0"
                            defaultValue={0}
                            {...register(
                              `health_personnel.${index}.total_workers`, 
                              { valueAsNumber: true }
                            )}
                            id={`health_personnel.${index}.total_workers`}
                            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <input
                            type="text"
                            {...register(`health_personnel.${index}.health_personnel_name`)}
                            id={`health_personnel.${index}.health_personnel_name`}
                            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <input
                            type="text"
                            {...register(`health_personnel.${index}.facilities`)}
                            id={`health_personnel.${index}.facilities`}
                            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <div className="flex items-center justify-center gap-2">
                            <input
                              id={`attachment_${item.id || index}`}
                              type="file"
                              className="hidden rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  // Create a new file with a unique name to prevent browser caching
                                  const uniqueFileName = `${Date.now()}_${file.name}`;
                                  const uniqueFile = new File([file], uniqueFileName, { type: file.type });
                                  setValue(`health_personnel.${index}.attachment`, uniqueFile);
                                }
                              }}
                            />
                            <label
                              htmlFor={`attachment_${item.id || index}`}
                              className="cursor-pointer"
                            >
                              <ClipIcon hasFile={!!watch(`health_personnel.${index}.attachment`)} />
                            </label>
                            
                            {!!watch(`health_personnel.${index}.attachment`) && typeof watch(`health_personnel.${index}.attachment`) === 'string' && (
                              <EyeIcon 
                                className="h-5 w-5 text-savoy-blue cursor-pointer"
                                onClick={() => openFilePreview(watch(`health_personnel.${index}.attachment`))}
                              />
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <div className="flex justify-center items-center">
                            <button
                              type="button"
                              className="flex justify-center items-center rounded-md bg-red-600 p-2 text-white"
                              onClick={() => healthPersonnelRemove(index)}
                            >
                              <MinusIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-start mt-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    healthPersonnelAppend({
                      id: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                      shift_area_department: '',
                      total_workers: 0,
                      health_personnel_name: '',
                      facilities: '',
                      attachment: null
                    });
                  }}
                  className="bg-savoy-blue text-white px-4 py-2 rounded-md"
                >
                  Add new line
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="sm:col-span-4 mt-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Safety and Health Promotion, training and education provided to
                workers
              </label>
              <div className="mt-4 w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 text-center">
                  <thead className="bg-[#D8E6FB] rounded-lg border-2 border-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Name of OSH  Training/Orientation
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        No. of Employees in Attendance
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {healthTrainingFields.map((item, index) => (
                      <tr
                        key={item.id}
                        className="cursor-pointer border-b border-gray-200"
                      >
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <input
                            type="text"
                            {...register(
                              `health_training.${index}.name_of_osh_training`
                            )}
                            id={`health_training.${index}.name_of_osh_training`}
                            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <input
                            type="number"
                            min="0"
                            defaultValue={0}
                            {...register(
                              `health_training.${index}.no_of_employees_in_attendance`
                            )}
                            id={`health_training.${index}.no_of_employees_in_attendance`}
                            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <div className="relative mt-2">
                            <Controller
                              control={control}
                              name={`health_training.${index}.date`}
                              render={({ field }) => (
                                <CustomDatePicker
                                  id={`health_training.${index}.date`}
                                  placeholder={"mm/dd/yyyy"}
                                  className={
                                    "block w-full py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                                  }
                                  selected={
                                    field.value ? new Date(field.value) : null
                                  }
                                  pickerOnChange={(date: any) =>
                                    field.onChange(date)
                                  }
                                  inputOnChange={(value: any) =>
                                    field.onChange(value)
                                  }
                                />
                              )}
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <div className="flex justify-center items-center">
                            <button
                              type="button"
                              className="flex justify-center items-center rounded-md bg-red-600 p-2 text-white"
                              onClick={() => healthTrainingRemove(index)}
                            >
                              <MinusIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-start mt-4">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent any default action
                    healthTrainingAppend({ id: healthTrainingAppend.length }); // Add new line
                  }}
                  className="bg-savoy-blue text-white px-4 py-2 rounded-md"
                >
                  Add new line
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full md:w-2/3">
            <table className="min-w-full divide-y divide-gray-300 text-center">
              <thead className="bg-[#D8E6FB] rounded-lg border-2 border-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                  >
                    Conduct of Risk Assessment
                    <h1 className="text-sm text-gray-500 mt-2">
                      May include WEM
                    </h1>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                  >
                    Date
                  </th>
                  <th>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {riskAssessmentFields.map((item, index) => (
                  <tr
                    key={item.id}
                    className="cursor-pointer border-b border-gray-200"
                  >
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <input
                        type="text"
                        {...register(
                          `risk_assessment.${index}.conduct_of_risk_assessment`
                        )}
                        id={`risk_assessment.${index}.conduct_of_risk_assessment`}
                        placeholder="Enter OSH Training/Orientation"
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="relative mt-2">
                        <Controller
                          control={control}
                          name={`risk_assessment.${index}.date`}
                          render={({ field }) => (
                            <CustomDatePicker
                              id={`risk_assessment.${index}.date`}
                              placeholder={"mm/dd/yyyy"}
                              className={
                                "block w-full py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                              }
                              selected={
                                field.value ? new Date(field.value) : null
                              }
                              pickerOnChange={(date: any) => field.onChange(date)}
                              inputOnChange={(value: any) =>
                                field.onChange(value)
                              }
                            />
                          )}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                      <div className="flex justify-center items-center">
                        <button
                          type="button"
                          className="flex justify-center items-center rounded-md bg-red-600 p-2 text-white"
                          onClick={() => riskAssessmentRemove(index)}
                        >
                          <MinusIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-start mt-4">
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent any default action
                riskAssessmentAppend({ id: riskAssessmentAppend.length }); // Add new line
              }}
              className="bg-savoy-blue text-white px-4 py-2 rounded-md"
            >
              Add new line
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="sm:col-span-4 mt-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                 Conduct of Tool Box Meetings/ Safety Meetings (if applicable)
              </label>
              <div className="mt-4 w-full md:w-2/3">
                <table className="min-w-full divide-y divide-gray-300 text-center">
                  <thead className="bg-[#D8E6FB] rounded-lg border-2 border-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Conduct of Risk Assessment
                        <h1 className="text-sm text-gray-500 mt-2">
                          May include WEM
                        </h1>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {safetyMeetingFields.map((item, index) => (
                      <tr
                        key={item.id}
                        className="cursor-pointer border-b border-gray-200"
                      >
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <input
                            type="text"
                            {...register(
                              `safety_meeting.${index}.conduct_of_risk_assessment`
                            )}
                            id={`safety_meeting.${index}.conduct_of_risk_assessment`}
                            placeholder="Enter OSH Training/Orientation"
                            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <div className="relative mt-2">
                            <Controller
                              control={control}
                              name={`safety_meeting.${index}.date`}
                              render={({ field }) => (
                                <CustomDatePicker
                                  id={`safety_meeting.${index}.date`}
                                  placeholder={"mm/dd/yyyy"}
                                  className={
                                    "block w-full py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                                  }
                                  selected={
                                    field.value ? new Date(field.value) : null
                                  }
                                  pickerOnChange={(date: any) =>
                                    field.onChange(date)
                                  }
                                  inputOnChange={(value: any) =>
                                    field.onChange(value)
                                  }
                                />
                              )}
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <div className="flex justify-center items-center">
                            <button
                              type="button"
                              className="flex justify-center items-center rounded-md bg-red-600 p-2 text-white"
                              onClick={() => safetyMeetingRemove(index)}
                            >
                              <MinusIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-start mt-4">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent any default action
                    safetyMeetingAppend({ id: safetyMeetingAppend.length }); // Add new line
                  }}
                  className="bg-savoy-blue text-white px-4 py-2 rounded-md"
                >
                  Add new line
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="sm:col-span-4 mt-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Accident/Incident/Injury investigation recording and reporting
                <h1 className="text-sm text-gray-500 mt-2">
                  Any dangerous occurrence, major accident resulting to death or
                  permanent total disability, shall be reported by the company to
                  the DOLE Regional Office within twenty-four (24) hours from
                  occurrence using the prescribed form (Work Accident / Incident
                  Notification).
                </h1>
                <h1 className="text-sm text-gray-500 mt-2">
                  After the conduct of investigation, the company shall prepare
                  and submit work accident report using the prescribed form
                  (WAIR). Moreover, other work accidents resulting to disabling
                  injuries such as Permanent Partial Disability and Temporary
                  Total Disability shall be reported to the DOLE Regional Office
                  within 30 days after the date of occurrence of accident using
                  the DOLE prescribed form (WAIR).
                </h1>
                <h1 className="text-sm text-gray-500 mt-2">
                  All near misses shall be recorded and reported. A system for
                  notification and reporting of work accidents including near
                  misses within the company shall be developed and reviewed by the
                  OSH Committee as necessary.
                </h1>
                <h1 className="text-sm text-gray-500 mt-2">
                  Kindly submit reports on the following: Work Accident /Injury
                  Report (WAIR), Annual Exposure Data Report (AEDR), Annual
                  Medical Report (AMR)
                </h1>
              </label>
              <div className="mt-4 w-full md:w-2/3">
                <table className="min-w-full divide-y divide-gray-300 text-center">
                  <thead className="bg-[#D8E6FB] rounded-lg border-2 border-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Report Submitted
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportedIncidentsFields.map((item, index) => (
                      <tr
                        key={item.id}
                        className="cursor-pointer border-b border-gray-200"
                      >
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <input
                            type="text"
                            {...register(
                              `reported_incidents.${index}.report_submitted`
                            )}
                            id={`reported_incidents.${index}.report_submitted`}
                            placeholder="select"
                            className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <div className="relative mt-2">
                            <Controller
                              control={control}
                              name={`reported_incidents.${index}.date`}
                              render={({ field }) => (
                                <CustomDatePicker
                                  id={`reported_incidents.${index}.date`}
                                  placeholder={"mm/dd/yyyy"}
                                  className={
                                    "block w-full py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                                  }
                                  selected={
                                    field.value ? new Date(field.value) : null
                                  }
                                  pickerOnChange={(date: any) =>
                                    field.onChange(date)
                                  }
                                  inputOnChange={(value: any) =>
                                    field.onChange(value)
                                  }
                                />
                              )}
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                          <div className="flex justify-center items-center">
                            <button
                              type="button"
                              className="flex justify-center items-center rounded-md bg-red-600 p-2 text-white"
                              onClick={() => reportedIncidentsRemove(index)}
                            >
                              <MinusIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-start mt-4">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent any default action
                    reportedIncidentsAppend({
                      id: reportedIncidentsAppend.length,
                    }); // Add new line
                  }}
                  className="bg-savoy-blue text-white px-4 py-2 rounded-md"
                >
                  Add new line
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        fileUrl={currentFileUrl}
        fileName={currentFileName}
        title="Attachment Preview"
      />
    </>
  );
}
