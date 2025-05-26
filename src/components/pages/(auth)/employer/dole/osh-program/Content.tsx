"use client";

import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";

import CustomToast from "@/components/CustomToast";
import CompanyProfile from "./tabs/CompanyProfile";
import ProgramAndPolicy from "./tabs/ProgramAndPolicy";
import RiskManagement from "./tabs/RiskManagement";
import SafetyMeasures from "./tabs/SafetyMeasures";
import ComplianceAndCost from "./tabs/ComplianceAndCost";
import HealthAndWelfare from "./tabs/HealthAndWelfare";
import useGetOshProgramDetails from "./hooks/useGetOshProgramDetails";
import useUpdateOshProgramDetails from "./hooks/useUpdateOshProgramDetails";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import HistoryIcon from "@/svg/HistoryIcon";
import DownloadBorderIcon from "@/svg/DownloadBorderIcon";

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const { register, handleSubmit, setValue, control, watch, formState: { errors }, clearErrors, reset } = useForm();
  const [selectedTab, setSelectedTab] = useState(1);
  const [validationMessage, setValidationMessage] = useState("");
  const [safetySignageUrl, setSafetySignageUrl] = useState<string>("");
  const [safetySignageAttachmentExist, setSafetySignageAttachmentExist] = useState(false);

  const { data: oshProgramDetails } = useGetOshProgramDetails();
  const { mutate: updateOshProgramDetails } = useUpdateOshProgramDetails();

  const onSubmit = handleSubmit((data) => {
    // Define required fields for each tab
    const requiredFieldsByTab: { [key: number]: string[] } = {
      1: ['company_name', 'date_established', 'complete_address', 'website_url', 'number_of_male_employees', 'number_of_female_employees'],
      2: ['date', 'name_of_owner'],
      3: ['emergency_and_disaster_preparedness'],
      4: ['no_of_treatment_rooms_first_aid_rooms', 'no_of_clinics_in_the_workplace', 'hospitals_youre_affiliated_with', 
          'chairperson_less_than_ten', 'secretary_less_than_ten', 'member_less_than_ten', 
          'chairperson_medium_to_high', 'secretary_medium_to_high', 'ex_officio_members', 
          'members', 'chairperson_joint_coordinating', 'secretary_joint_coordinating', 'ex_officio_members_1'],
      5: [],
      6: ['others_name', 'name_of_owner_manager', 'employees_representative', 'date_filled']
    };
    
    // Only validate the current tab's fields
    const requiredFields = requiredFieldsByTab[selectedTab] || [];
    const missingFields = requiredFields.filter((field: string) => !data[field]);
    
    // Special handling for signature in tab 2
    if (selectedTab === 2 && !data.signature) {
      setValidationMessage("Please provide a signature");
      return;
    }
    
    if (missingFields.length > 0) {
      setValidationMessage(`Please fill out all required fields marked with * (Missing: ${missingFields.join(', ')})`);
      return;
    }
    
    // Create a new object with processed data
    const processedData = { ...data };

    // Only include the signature field if we're in tab 2 or if it already exists
    if (selectedTab !== 2) {
      delete processedData.signature;
    }

    // Handle file uploads (signature and safety_signage)
    if (processedData.safety_signage instanceof File) {
      // Keep the File object as is for FormData
      console.log('Safety signage is a File object');
    } else if (typeof processedData.safety_signage === 'string' && !processedData.safety_signage.startsWith('data:')) {
      // If it's a string but not a data URL, and we're not in safety measures tab, remove it
      if (selectedTab !== 5) {
        delete processedData.safety_signage;
      }
    }
    
    // Define all boolean fields
    const booleanFields = [
      'duties_and_responsibilities',
      'random_drug_testing',
      'adequate_sanitary_and_washing_facilities',
      'adequate_supply_of_drinking_water',
      'suitable_living_accommodation',
      'separate_sanitary_washing_and_sleeping_facilities',
      'lactation_station',
      'ramps_railings_and_like',
      'other_workers_welfare_facilities'
    ];
    
    // Process all boolean fields in a unified way
    booleanFields.forEach(field => {
      if (processedData[field] === "true" || processedData[field] === true) {
        processedData[field] = true;
      } else if (processedData[field] === "false" || processedData[field] === false) {
        processedData[field] = false;
      } else if (processedData[field] === undefined || processedData[field] === null) {
        // Only set default if field is undefined or null
        // This preserves values from other tabs
        if (oshProgramDetails && oshProgramDetails[field] !== undefined) {
          // Keep the existing value from oshProgramDetails if it exists
          processedData[field] = oshProgramDetails[field];
        } else {
          // Default to null if we don't have an existing value
          processedData[field] = null;
        }
      }
    });
    
    // Ensure numeric fields are properly converted to numbers
    const numericFields = [
      'no_of_treatment_rooms_first_aid_rooms',
      'no_of_clinics_in_the_workplace',
      'number_of_male_employees',
      'number_of_female_employees',
      'total_number_of_employees'
    ];
    
    numericFields.forEach(field => {
      if (processedData[field] !== undefined && processedData[field] !== null && processedData[field] !== '') {
        processedData[field] = Number(processedData[field]);
      }
    });

    // Handle business_description properly for multipart/form-data
    if (processedData.business_description !== undefined) {
      // Ensure it's an array
      if (!Array.isArray(processedData.business_description)) {
        // If it's a string, try to parse it if it's JSON
        if (typeof processedData.business_description === 'string') {
          try {
            // Try to parse if it's already a JSON string
            const parsed = JSON.parse(processedData.business_description);
            if (Array.isArray(parsed)) {
              processedData.business_description = parsed;
            } else {
              processedData.business_description = [processedData.business_description];
            }
          } catch (e) {
            // If parsing fails, it's a regular string
            processedData.business_description = [processedData.business_description];
          }
        } else if (processedData.business_description === null) {
          // If null, set to empty array
          processedData.business_description = [];
        } else {
          // For any other non-array type, wrap in array
          processedData.business_description = [String(processedData.business_description)];
        }
      }
      
      // NOTE: Do not convert to JSON string here - let the hook handle that
      // to ensure consistent handling
      
      // Ensure business_description field name is lowercase
      if ('Business_description' in processedData) {
        processedData.business_description = processedData.Business_description;
        delete processedData.Business_description;
      }
    } else if (oshProgramDetails && oshProgramDetails.business_description) {
      // When business_description is not provided but exists in the backend, use the existing value
      if (typeof oshProgramDetails.business_description === 'string') {
        try {
          processedData.business_description = JSON.parse(oshProgramDetails.business_description);
        } catch (e) {
          // If parsing fails, use as is
          processedData.business_description = oshProgramDetails.business_description;
        }
      } else {
        processedData.business_description = oshProgramDetails.business_description;
      }
    }

    // Handle emergency_and_disaster_preparedness separately since it has a specific structure
    if (processedData.emergency_and_disaster_preparedness) {
      // Ensure it's an array of objects with the required structure
      if (Array.isArray(processedData.emergency_and_disaster_preparedness)) {
        const validatedData = processedData.emergency_and_disaster_preparedness
          .map(item => ({
            task: String(item.task || ''),
            hazard_identified: String(item.hazard_identified || ''),
            risk_description: String(item.risk_description || ''),
            priority: String(item.priority || ''),
            control_measures: String(item.control_measures || '')
          }))
          .filter(item => 
            item.task || 
            item.hazard_identified || 
            item.risk_description || 
            item.priority || 
            item.control_measures
          ); // Filter out empty entries
        processedData.emergency_and_disaster_preparedness = JSON.stringify(validatedData);
      } else {
        processedData.emergency_and_disaster_preparedness = JSON.stringify([]);
      }
    } else {
      processedData.emergency_and_disaster_preparedness = JSON.stringify([]);
    }

    // Handle array fields 
    const arrayFields = [
      'routine_medical_surveillance',
      'schedule_of_annual_medical_examination',
      'special_medical_surveillance',
      'safety_officer',
      'health_personnel',
      'health_training',
      'risk_assessment',
      'reported_incidents',
      'safety_meeting'
    ];

    arrayFields.forEach(field => {
      if (processedData[field]) {
        // Ensure the field is always an array
        let fieldValue = processedData[field];
        
        // If it's a string, try to parse it as JSON
        if (typeof fieldValue === 'string') {
          try {
            fieldValue = JSON.parse(fieldValue);
          } catch (e) {
            // If parsing fails, split by comma
            fieldValue = fieldValue.split(',').map((item: string) => item.trim());
          }
        }
        
        // If it's not an array yet, make it one
        if (!Array.isArray(fieldValue)) {
          fieldValue = [fieldValue];
        }
        
        // Filter out any null, undefined, or empty string values
        fieldValue = fieldValue.filter((item: any) => item !== null && item !== undefined && item !== '');
        
        // Convert to JSON string for storage
        processedData[field] = JSON.stringify(fieldValue);
      } else {
        // Initialize as empty array if no value
        processedData[field] = JSON.stringify([]);
      }
    });

    // Handle JSON fields
    const jsonFields = [
      'drills',
      'health_personnel',
      'health_training',
      'ppe',
      'reported_incidents',
      'risk_assessment',
      'safety_meeting',
      'safety_officer'
    ];

    jsonFields.forEach(field => {
      if (processedData[field]) {
        if (typeof processedData[field] === 'string') {
          try {
            const parsed = JSON.parse(processedData[field]);
            processedData[field] = JSON.stringify(parsed);
          } catch (e) {
            processedData[field] = JSON.stringify({ data: processedData[field] });
          }
        } else {
          processedData[field] = JSON.stringify(processedData[field]);
        }
      } else {
        processedData[field] = JSON.stringify({});
      }
    });
    
    setValidationMessage("");
    const callbackReq = {
      onSuccess: () => {
        toast.custom(() => <CustomToast message="Successfully updated OSH Program Details" type="success" />);
      },
      onError: (error: any) => {
        toast.custom(() => <CustomToast message={error.message || "Failed to update OSH Program Details"} type="error" />);
      }
    }
    updateOshProgramDetails({ ...processedData, id: oshProgramDetails?.id }, callbackReq);
  });

  useEffect(() => {
    if (oshProgramDetails) {
      // Process array fields before setting them
      const arrayFields = [
        'routine_medical_surveillance',
        'schedule_of_annual_medical_examination',
        'special_medical_surveillance',
        'safety_officer',
        'health_personnel',
        'health_training',
        'risk_assessment',
        'reported_incidents',
        'safety_meeting'
      ];

      // Process each array field
      arrayFields.forEach(field => {
        let fieldValue = oshProgramDetails[field];
        if (fieldValue) {
          try {
            // If it's a string, try to parse it
            if (typeof fieldValue === 'string') {
              fieldValue = JSON.parse(fieldValue);
            }
            // Ensure it's an array
            if (!Array.isArray(fieldValue)) {
              fieldValue = [fieldValue];
            }
            // Filter out any null, undefined, or empty values
            fieldValue = fieldValue.filter((item: any) => item !== null && item !== undefined && item !== '');
            
            // For checkbox fields, ensure we keep the raw values
            if (['routine_medical_surveillance', 'special_medical_surveillance', 'schedule_of_annual_medical_examination'].includes(field)) {
              fieldValue = fieldValue.map((item: any) => 
                typeof item === 'object' ? item.value || item.toString() : item.toString()
              );
            }
          } catch (e) {
            // If parsing fails, convert to array
            fieldValue = typeof fieldValue === 'string' ? fieldValue.split(',').map((item: string) => item.trim()) : [];
          }
          setValue(field, fieldValue);
        } else {
          // Initialize empty array if no value
          setValue(field, []);
        }
      });

      // Set other fields
      Object.keys(oshProgramDetails).forEach(key => {
        if (!arrayFields.includes(key)) {
          setValue(key, oshProgramDetails[key]);
        }
      });

      // Set safety signage state if it exists
      if (oshProgramDetails.safety_signage) {
        setSafetySignageUrl(oshProgramDetails.safety_signage);
        setSafetySignageAttachmentExist(true);
      }
    }
  }, [oshProgramDetails, setValue]);

  // Function to handle tab changes
  const handleTabChange = (tabIndex: number) => {
    // Clear any validation errors
    clearErrors();
    // Clear validation message
    setValidationMessage("");

    // Get current form values
    const currentValues = watch();

    // Reset form data for the current tab before switching
    if (oshProgramDetails) {
      // Define array fields that should be preserved
      const arrayFields = [
        'routine_medical_surveillance',
        'schedule_of_annual_medical_examination',
        'special_medical_surveillance',
        'safety_officer',
        'health_personnel',
        'health_training',
        'risk_assessment',
        'reported_incidents',
        'safety_meeting'
      ];

      // Reset all form fields to their last saved values from oshProgramDetails
      const fieldsToReset = Object.keys(oshProgramDetails).reduce((acc: any, key) => {
        // For array fields, keep current values if they exist
        if (arrayFields.includes(key) && currentValues[key]) {
          acc[key] = currentValues[key];
        } else {
          acc[key] = oshProgramDetails[key];
        }
        return acc;
      }, {});
      
      reset(fieldsToReset);
    }

    // Set the new tab
    setSelectedTab(tabIndex);
  };

  // Custom submit handler
  const submitCurrentTab = () => {
    // First clear any existing validation messages
    setValidationMessage("");
    
    // Trigger form validation and submission just for the current tab
    onSubmit();
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex p-4">
          <Link href="/dole" className="flex-none flex gap-3 items-center hover:bg-gray-200">
            <ArrowLeftIcon className="h-5 w-5" />
            <h4>DOLE</h4>
          </Link>
        </div>
        <div className="px-2 md:px-8 lg:px-4">
          <h2 className="text-xl font-bold text-indigo-dye">OSH Program</h2>
          <div className="flex-1 flex justify-end space-x-4">
            <DownloadBorderIcon/>
            <HistoryIcon/>
            <button
              className="bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50"
              onClick={submitCurrentTab}
              disabled={!hasActiveSubscription}
            >
              Save
            </button>
          </div>
        </div>
        
        {/* Validation message */}
        {validationMessage && (
          <div className="mt-2 px-2 md:px-8 lg:px-4">
            <div className="rounded-md bg-red-50 p-2">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {validationMessage}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex flex-row justify-between space-x-2">
          <div onClick={() => handleTabChange(1)} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 1 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Company Profile
            </h1>
          </div>
          <div onClick={() => handleTabChange(2)} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 2 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              OSH Program and Policy
            </h1>
          </div>
          <div onClick={() => handleTabChange(3)} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 3 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Risk Management
            </h1>
          </div>
          <div onClick={() => handleTabChange(4)} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 4 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Health and Welfare Program
            </h1>
          </div>
          <div onClick={() => handleTabChange(5)} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 5 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Safety Measures
            </h1>
          </div>
          <div onClick={() => handleTabChange(6)} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 6 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Compliance and Cost
            </h1>
          </div>
        </div>
        {selectedTab === 1 && (
          <CompanyProfile
            control={control}
            register={register}
            errors={errors}
            validationMessage={validationMessage}
            watch={watch}
            setValue={setValue}
          />
        )}
        {selectedTab === 2 && (
          <ProgramAndPolicy
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
            validationMessage={validationMessage}
          />
        )}
        {selectedTab === 3 && (
          <RiskManagement
            control={control}
            register={register}
            validationMessage={validationMessage}
          />
        )}
        {selectedTab === 4 && (
          <HealthAndWelfare
            control={control}
            register={register}
            validationMessage={validationMessage}
            watch={watch}
          />
        )}
        {selectedTab === 5 && (
          <SafetyMeasures
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
            validationMessage={validationMessage}
            safetySignageUrl={safetySignageUrl}
            setSafetySignageUrl={setSafetySignageUrl}
            safetySignageAttachmentExist={safetySignageAttachmentExist}
            setSafetySignageAttachmentExist={setSafetySignageAttachmentExist}
          />
        )}
        {selectedTab === 6 && (
          <ComplianceAndCost
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
            onSubmit={onSubmit}
            validationMessage={validationMessage}
          />
        )}
      </div>
    </>
  );
}

export default Content;
