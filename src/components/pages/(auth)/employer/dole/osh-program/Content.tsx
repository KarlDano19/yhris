"use client";

import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { T_OshProgram } from "@/types/globals";

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

// Extend the base type with additional fields and make all fields optional for form handling
type ExtendedOshProgram = Partial<T_OshProgram> & {
  [key: string]: any;
  id?: string;
  business_description?: string | string[];
  emergency_and_disaster_preparedness?: string | Array<{
    task: string;
    hazard_identified: string;
    risk_description: string;
    priority: string;
    control_measures: string;
  }>;
  signature?: File | string;
  safety_signage?: File | string;
};

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const { register, handleSubmit, setValue, control, watch, formState: { errors }, clearErrors, reset } = useForm<ExtendedOshProgram>();
  const [selectedTab, setSelectedTab] = useState(1);
  const [validationMessage, setValidationMessage] = useState("");
  const [safetySignageUrl, setSafetySignageUrl] = useState<string>("");
  const [safetySignageAttachmentExist, setSafetySignageAttachmentExist] = useState(false);

  const { data: oshProgramDetails } = useGetOshProgramDetails();
  const { mutate: updateOshProgramDetails } = useUpdateOshProgramDetails();

  const onSubmit = handleSubmit((data: ExtendedOshProgram) => {
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
      'total_number_of_employees',
      'medical_examinations_cost',
      'medical_supplies_cost',
      'osh_training_cost',
      'ppe_cost',
      'safety_signages_cost',
      'machine_guards_cost',
      'others_cost'
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
            // Try to parse if it's a JSON string
            const parsed = JSON.parse(processedData.business_description);
            processedData.business_description = Array.isArray(parsed) ? parsed : [processedData.business_description];
          } catch (e) {
            // If parsing fails, it's a regular string
            processedData.business_description = processedData.business_description;
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
        processedData.emergency_and_disaster_preparedness = validatedData;
      } else {
        processedData.emergency_and_disaster_preparedness = [];
      }
    } else {
      processedData.emergency_and_disaster_preparedness = [];
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
        // If it's already an array, use it as is
        if (Array.isArray(processedData[field])) {
          processedData[field] = JSON.stringify(processedData[field]);
        }
        // If it's a string, try to parse it as JSON
        else if (typeof processedData[field] === 'string') {
          try {
            const parsed = JSON.parse(processedData[field]);
            processedData[field] = JSON.stringify(Array.isArray(parsed) ? parsed : [processedData[field]]);
          } catch (e) {
            // If parsing fails, wrap the string in an array
            processedData[field] = JSON.stringify([processedData[field]]);
          }
        }
        // For any other type, wrap in array
        else {
          processedData[field] = JSON.stringify([processedData[field]]);
        }
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
    updateOshProgramDetails({ ...processedData, id: oshProgramDetails?.id } as ExtendedOshProgram, callbackReq);
  });

  useEffect(() => {
    if (oshProgramDetails) {
      // Tab 1: Company Profile
      setValue("company_name", oshProgramDetails.company_name);
      setValue("date_established", oshProgramDetails.date_established);
      setValue("complete_address", oshProgramDetails.complete_address);
      setValue("phone_number", oshProgramDetails.phone_number);
      setValue("fax_number", oshProgramDetails.fax_number);
      setValue("website_url", oshProgramDetails.website_url);
      setValue("company_owner", oshProgramDetails.company_owner);
      setValue("number_of_male_employees", oshProgramDetails.number_of_male_employees);
      setValue("number_of_female_employees", oshProgramDetails.number_of_female_employees);
      setValue("total_number_of_employees", oshProgramDetails.total_number_of_employees);
      setValue("business_description", oshProgramDetails.business_description);
      setValue("manufacturing_description", oshProgramDetails.manufacturing_description);
      setValue("bank_and_financial_institution_description", oshProgramDetails.bank_and_financial_institution_description);
      setValue("service_description", oshProgramDetails.service_description);
      setValue("security_agency_description", oshProgramDetails.security_agency_description);
      setValue("agri_fishing_description", oshProgramDetails.agri_fishing_description);
      setValue("maintenance_description", oshProgramDetails.maintenance_description);
      setValue("wholesale_retail_description", oshProgramDetails.wholesale_retail_description);
      setValue("construction_description", oshProgramDetails.construction_description);
      setValue("utilities_description", oshProgramDetails.utilities_description);
      setValue("others_description", oshProgramDetails.others_description);
      setValue("product_description", oshProgramDetails.product_description);
      setValue("services_description", oshProgramDetails.services_description);

      // Tab 2: OSH Program and Policy
      setValue("basic_components", oshProgramDetails.basic_components);
      setValue("company_commitment", oshProgramDetails.company_commitment);
      setValue("date", oshProgramDetails.date);
      setValue("name_of_owner", oshProgramDetails.name_of_owner);
      setValue("signature", oshProgramDetails.signature);

      // Tab 3: Risk Management
      setValue("emergency_and_disaster_preparedness", oshProgramDetails.emergency_and_disaster_preparedness);

      // Tab 4: Health and Welfare Program
        // Medical Surveillance Section
        if (oshProgramDetails.routine_medical_surveillance) {
          try {
            const parsedValue = typeof oshProgramDetails.routine_medical_surveillance === 'string' 
              ? JSON.parse(oshProgramDetails.routine_medical_surveillance)
              : oshProgramDetails.routine_medical_surveillance;
            setValue("routine_medical_surveillance", parsedValue);
          } catch (e) {
            setValue("routine_medical_surveillance", []);
          }
        }
        setValue("special_medical_surveillance", oshProgramDetails.special_medical_surveillance);
        setValue("schedule_of_annual_medical_examination", oshProgramDetails.schedule_of_annual_medical_examination);
        setValue("random_drug_testing", oshProgramDetails.random_drug_testing);

        // First-Aid, Health Care Medicines and Equipment Facilities
        setValue("no_of_treatment_rooms_first_aid_rooms", oshProgramDetails.no_of_treatment_rooms_first_aid_rooms);
        setValue("no_of_clinics_in_the_workplace", oshProgramDetails.no_of_clinics_in_the_workplace);
        setValue("hospitals_youre_affiliated_with", oshProgramDetails.hospitals_youre_affiliated_with);

        // Committee Members
          // A. For establishments with less than ten workers
          setValue("chairperson_less_than_ten", oshProgramDetails.chairperson_less_than_ten);
          setValue("secretary_less_than_ten", oshProgramDetails.secretary_less_than_ten);
          setValue("member_less_than_ten", oshProgramDetails.member_less_than_ten);

          // B. For medium to high risk establishments
          setValue("chairperson_medium_to_high", oshProgramDetails.chairperson_medium_to_high);
          setValue("secretary_medium_to_high", oshProgramDetails.secretary_medium_to_high);
          setValue("ex_officio_members", oshProgramDetails.ex_officio_members);
          setValue("ex_officio_members_1", oshProgramDetails.ex_officio_members_1);
          setValue("ex_officio_members_2", oshProgramDetails.ex_officio_members_2);
          setValue("members", oshProgramDetails.members);
          setValue("members_2", oshProgramDetails.members_2);

          // C. Joint Coordinating Committee
          setValue("chairperson_joint_coordinating", oshProgramDetails.chairperson_joint_coordinating);
          setValue("secretary_joint_coordinating", oshProgramDetails.secretary_joint_coordinating);
          setValue("ex_officio_members_3", oshProgramDetails.ex_officio_members_3);
          setValue("ex_officio_members_4", oshProgramDetails.ex_officio_members_4);

        // Safety and Health Committee Minutes/Reports
        setValue("duties_and_responsibilities", oshProgramDetails.duties_and_responsibilities);

        // OSH Personnel and Facilities - Safety Officer
        setValue("safety_officer", oshProgramDetails.safety_officer);

        // Emergency Occupational Health Personnel and Facilities
        setValue("health_personnel", oshProgramDetails.health_personnel);

        // Safety and Health Promotion, training and education
        setValue("health_training", oshProgramDetails.health_training);

        // Risk Assessment Table
        setValue("risk_assessment", oshProgramDetails.risk_assessment);

        // Tool Box Meetings/Safety Meetings
        setValue("safety_meeting", oshProgramDetails.safety_meeting);

        // Accident/Incident/Injury Reports
        setValue("reported_incidents", oshProgramDetails.reported_incidents);

      // Tab 5: Safety Measures
        // Provision and use of PPE Section
        setValue("ppe", oshProgramDetails.ppe);
        setValue("ppe_description", oshProgramDetails.ppe_description);
        
        // Safety Signage Section
        setValue("safety_signage", oshProgramDetails.safety_signage);
        
        // Dust Control and Management Section - Facilities Table
        setValue("adequate_supply_of_drinking_water", oshProgramDetails.adequate_supply_of_drinking_water);
        setValue("adequate_supply_of_drinking_water_remarks", oshProgramDetails.adequate_supply_of_drinking_water_remarks);
        setValue("adequate_sanitary_and_washing_facilities", oshProgramDetails.adequate_sanitary_and_washing_facilities);
        setValue("adequate_sanitary_and_washing_facilities_remarks", oshProgramDetails.adequate_sanitary_and_washing_facilities_remarks);
        setValue("suitable_living_accommodation", oshProgramDetails.suitable_living_accommodation);
        setValue("suitable_living_accommodation_remarks", oshProgramDetails.suitable_living_accommodation_remarks);
        setValue("separate_sanitary_washing_and_sleeping_facilities", oshProgramDetails.separate_sanitary_washing_and_sleeping_facilities);
        setValue("separate_sanitary_washing_and_sleeping_facilities_remarks", oshProgramDetails.separate_sanitary_washing_and_sleeping_facilities_remarks);
        setValue("lactation_station", oshProgramDetails.lactation_station);
        setValue("lactation_station_remarks", oshProgramDetails.lactation_station_remarks);
        setValue("ramps_railings_and_like", oshProgramDetails.ramps_railings_and_like);
        setValue("ramps_railings_and_like_remarks", oshProgramDetails.ramps_railings_and_like_remarks);
        setValue("other_workers_welfare_facilities", oshProgramDetails.other_workers_welfare_facilities);
        setValue("other_workers_welfare_facilities_remarks", oshProgramDetails.other_workers_welfare_facilities_remarks);
        
        // Emergency and Disaster Preparedness Section
        setValue("written_emergency_and_disaster_program", oshProgramDetails.written_emergency_and_disaster_program);
        setValue("drills", oshProgramDetails.drills);
        
        // Solid Waste Management System Section
        setValue("written_pollution_control_program", oshProgramDetails.written_pollution_control_program);
        setValue("waste_management_system_message", oshProgramDetails.waste_management_system_message);
        
        // Prohibited Acts and Penalties Section
        setValue("prohibited_acts_and_penalties_message", oshProgramDetails.prohibited_acts_and_penalties_message);

      // Tab 6: Compliance and Cost
        // Cost of implementing company OSH program
        setValue("cost_osh_program", oshProgramDetails.cost_osh_program);
        
        // Annual estimated amount for OSH program implementation
        setValue("ppe_cost", oshProgramDetails.ppe_cost);
        setValue("osh_training_cost", oshProgramDetails.osh_training_cost);
        setValue("safety_signages_cost", oshProgramDetails.safety_signages_cost);
        setValue("machine_guards_cost", oshProgramDetails.machine_guards_cost);
        setValue("medical_examinations_cost", oshProgramDetails.medical_examinations_cost);
        setValue("medical_supplies_cost", oshProgramDetails.medical_supplies_cost);
        setValue("others_name", oshProgramDetails.others_name);
        setValue("others_cost", oshProgramDetails.others_cost);
        
        // ANNEX A Section
        setValue("annex_a_message", oshProgramDetails.annex_a_message);
        
        // Signature Section
        setValue("name_of_owner_manager", oshProgramDetails.name_of_owner_manager);
        setValue("employees_representative", oshProgramDetails.employees_representative);
        setValue("date_filled", oshProgramDetails.date_filled);

      // Set file fields
      if (oshProgramDetails.safety_signage) {
        if (typeof oshProgramDetails.safety_signage === 'string') {
          setSafetySignageUrl(oshProgramDetails.safety_signage);
        }
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
            setValue={setValue}
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
