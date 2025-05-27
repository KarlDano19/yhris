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

// Add these type definitions before tabFields
type TabNumber = 1 | 2 | 3 | 4 | 5 | 6;

// Helper type to get fields for a specific tab
type TabFields = {
  [K in TabNumber]: Array<keyof T_OshProgram>;
};

// Keep the original ExtendedOshProgram type
type ExtendedOshProgram = Partial<T_OshProgram> & {
  id?: string;
  [key: string]: any;
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

// Add required fields mapping
const requiredFieldsByTab: TabFields = {
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

// Update tabFields declaration with explicit field lists
const tabFields: TabFields = {
  1: ['company_name', 'date_established', 'complete_address', 'phone_number', 'fax_number', 
      'website_url', 'company_owner', 'number_of_male_employees', 'number_of_female_employees', 
      'total_number_of_employees', 'business_description', 'manufacturing_description', 
      'bank_and_financial_institution_description', 'service_description', 'security_agency_description', 
      'agri_fishing_description', 'maintenance_description', 'wholesale_retail_description', 
      'construction_description', 'utilities_description', 'others_description', 'product_description', 
      'services_description'] as Array<keyof T_OshProgram>,
  2: ['basic_components', 'company_commitment', 'date', 'name_of_owner', 'signature'] as Array<keyof T_OshProgram>,
  3: ['emergency_and_disaster_preparedness'] as Array<keyof T_OshProgram>,
  4: ['routine_medical_surveillance', 'special_medical_surveillance', 'schedule_of_annual_medical_examination',
      'random_drug_testing', 'no_of_treatment_rooms_first_aid_rooms', 'no_of_clinics_in_the_workplace',
      'hospitals_youre_affiliated_with', 'chairperson_less_than_ten', 'secretary_less_than_ten',
      'member_less_than_ten', 'chairperson_medium_to_high', 'secretary_medium_to_high',
      'ex_officio_members', 'ex_officio_members_1', 'ex_officio_members_2', 'members',
      'members_2', 'chairperson_joint_coordinating', 'secretary_joint_coordinating',
      'ex_officio_members_3', 'ex_officio_members_4', 'duties_and_responsibilities',
      'safety_officer', 'health_personnel', 'health_training', 'risk_assessment',
      'safety_meeting', 'reported_incidents'] as Array<keyof T_OshProgram>,
  5: ['ppe', 'ppe_description', 'safety_signage', 'adequate_supply_of_drinking_water',
      'adequate_supply_of_drinking_water_remarks', 'adequate_sanitary_and_washing_facilities',
      'adequate_sanitary_and_washing_facilities_remarks', 'suitable_living_accommodation',
      'suitable_living_accommodation_remarks', 'separate_sanitary_washing_and_sleeping_facilities',
      'separate_sanitary_washing_and_sleeping_facilities_remarks', 'lactation_station',
      'lactation_station_remarks', 'ramps_railings_and_like', 'ramps_railings_and_like_remarks',
      'other_workers_welfare_facilities', 'other_workers_welfare_facilities_remarks',
      'written_emergency_and_disaster_program', 'drills', 'written_pollution_control_program',
      'polution_control_officer', 'waste_management_system_message',
      'prohibited_acts_and_penalties_message'] as Array<keyof T_OshProgram>,
  6: ['cost_osh_program', 'ppe_cost', 'osh_training_cost', 'safety_signages_cost',
      'machine_guards_cost', 'medical_examinations_cost', 'medical_supplies_cost',
      'others_name', 'others_cost', 'annex_a_message', 'name_of_owner_manager',
      'employees_representative', 'date_filled'] as Array<keyof T_OshProgram>
};

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const { register, handleSubmit, setValue, control, watch, formState: { errors }, clearErrors, reset } = useForm<ExtendedOshProgram>();
  const [selectedTab, setSelectedTab] = useState<TabNumber>(1);
  const [validationMessage, setValidationMessage] = useState("");
  const [safetySignageUrl, setSafetySignageUrl] = useState<string>("");
  const [safetySignageAttachmentExist, setSafetySignageAttachmentExist] = useState(false);

  const { data: oshProgramDetails, refetch } = useGetOshProgramDetails();
  const { mutate: updateOshProgramDetails } = useUpdateOshProgramDetails();

  const onSubmit = handleSubmit((data: ExtendedOshProgram) => {
    // Validate required fields for current tab
    const requiredFields = requiredFieldsByTab[selectedTab] || [];
    const missingFields = requiredFields.filter((field: keyof T_OshProgram) => !data[field]);

    // Special handling for signature in tab 2
    if (selectedTab === 2 && !data.signature) {
      setValidationMessage("Please provide a signature");
      return;
    }

    if (missingFields.length > 0) {
      setValidationMessage(`Please fill out all required fields marked with * (Missing: ${missingFields.join(', ')})`);
      return;
    }

    // Get the fields for the current tab
    const currentTabFields = tabFields[selectedTab];
    
    // Create a new object with only the fields from the current tab
    const processedData: ExtendedOshProgram = {};
    
    // Add the ID if it exists
    if (oshProgramDetails?.id) {
      processedData.id = oshProgramDetails.id;
    }

    // Only process fields from the current tab
    currentTabFields.forEach((field: keyof T_OshProgram) => {
      if (data[field] !== undefined) {
        processedData[field] = data[field];
      }
    });

    // Special handling for boolean fields in tabs 4 and 5
    if (selectedTab === 4) {
      // Handle boolean fields for Health and Welfare tab
      if ('duties_and_responsibilities' in processedData) {
        const value = processedData.duties_and_responsibilities as boolean | string | null | undefined;
        if (value === true || value === 'true') processedData.duties_and_responsibilities = true;
        else if (value === false || value === 'false') processedData.duties_and_responsibilities = false;
      }
      if ('random_drug_testing' in processedData) {
        const value = processedData.random_drug_testing as boolean | string | null | undefined;
        if (value === true || value === 'true') processedData.random_drug_testing = true;
        else if (value === false || value === 'false') processedData.random_drug_testing = false;
      }
    }

    if (selectedTab === 5) {
      // Handle boolean fields for Safety Measures tab
      const booleanFields = [
        'adequate_supply_of_drinking_water',
        'adequate_sanitary_and_washing_facilities',
        'suitable_living_accommodation',
        'separate_sanitary_washing_and_sleeping_facilities',
        'lactation_station',
        'ramps_railings_and_like',
        'other_workers_welfare_facilities',
        'written_emergency_and_disaster_program',
        'written_pollution_control_program'
      ];

      booleanFields.forEach(field => {
        if (field in processedData) {
          // Preserve null values, only convert explicit true/false
          const value = processedData[field] as boolean | string | null | undefined;
          if (value === true || value === 'true') processedData[field] = true;
          else if (value === false || value === 'false') processedData[field] = false;
          // Leave null/undefined values as is
        }
      });
    }

    // Handle array fields if they exist in the current tab
    const arrayFields = [
      'routine_medical_surveillance',
      'special_medical_surveillance',
      'schedule_of_annual_medical_examination',
      'business_description'
    ];

    arrayFields.forEach(field => {
      if (field in processedData) {
        if (Array.isArray(processedData[field])) {
          processedData[field] = processedData[field];
        } else if (typeof processedData[field] === 'string') {
          try {
            processedData[field] = JSON.parse(processedData[field]);
          } catch (e) {
            processedData[field] = [processedData[field]];
          }
        }
      }
    });

    // Handle JSON fields if they exist in the current tab
    const jsonFields = [
      'drills',
      'emergency_and_disaster_preparedness',
      'health_personnel',
      'health_training',
      'ppe',
      'reported_incidents',
      'risk_assessment',
      'safety_meeting',
      'safety_officer'
    ];

    jsonFields.forEach(field => {
      if (field in processedData) {
        if (typeof processedData[field] === 'object') {
          processedData[field] = JSON.stringify(processedData[field]);
        } else if (typeof processedData[field] === 'string') {
          try {
            JSON.parse(processedData[field]); // Validate it's valid JSON
          } catch (e) {
            processedData[field] = JSON.stringify({}); // Default to empty object if invalid
          }
        }
      }
    });

    // Handle file fields if they exist in the current tab
    if (selectedTab === 2 && processedData.signature instanceof File) {
      // Keep the File object as is for FormData
    } else if (selectedTab === 5 && processedData.safety_signage instanceof File) {
      // Keep the File object as is for FormData
    }

    setValidationMessage("");
    const callbackReq = {
      onSuccess: () => {
        // Reset file upload states after successful save
        if (selectedTab === 2) {
          const currentSignature = watch("signature");
          if (currentSignature) {
            if (typeof currentSignature === 'string') {
              setValue("signature", currentSignature);
              setValue("previous_signature", currentSignature);
            } else if (currentSignature instanceof File) {
              // If it's a File, we need to wait for the backend to process it
              // The backend will return the URL in the next data fetch
              setValue("signature", currentSignature);
            }
          }
        } else if (selectedTab === 5) {
          const currentSignage = watch("safety_signage");
          if (currentSignage) {
            if (typeof currentSignage === 'string') {
              setValue("safety_signage", currentSignage);
              setValue("previous_safety_signage", currentSignage);
              setSafetySignageUrl(currentSignage);
              setSafetySignageAttachmentExist(true);
            } else if (currentSignage instanceof File) {
              // If it's a File, we need to wait for the backend to process it
              // The backend will return the URL in the next data fetch
              setValue("safety_signage", currentSignage);
              setSafetySignageAttachmentExist(true);
              setSafetySignageUrl("");
            }
          } else {
            setSafetySignageAttachmentExist(false);
            setSafetySignageUrl("");
          }
        }
        
        // Refresh data from backend to ensure frontend state is in sync
        refetch().then(() => {
          toast.custom(() => <CustomToast message="Successfully updated OSH Program Details" type="success" />);
        }).catch(() => {
          // Still show success message even if refetch fails
          toast.custom(() => <CustomToast message="Successfully updated OSH Program Details" type="success" />);
        });
      },
      onError: (error: any) => {
        toast.custom(() => <CustomToast message={error.message || "Failed to update OSH Program Details"} type="error" />);
      }
    }
    updateOshProgramDetails(processedData, callbackReq);
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
  const handleTabChange = (tabIndex: TabNumber) => {
    // Clear any validation errors
    clearErrors();
    // Clear validation message
    setValidationMessage("");

    // Get current form values
    const currentValues = watch();

    // Reset form data for the current tab before switching
    if (oshProgramDetails) {
      // Define fields that should be preserved from current form values
      const preservedFields = [
        'routine_medical_surveillance',
        'schedule_of_annual_medical_examination',
        'special_medical_surveillance',
        'emergency_and_disaster_preparedness',
        'safety_officer',
        'health_personnel',
        'health_training',
        'risk_assessment',
        'reported_incidents',
        'safety_meeting'
      ];

      // Reset all form fields to their last saved values from oshProgramDetails
      const fieldsToReset = Object.keys(oshProgramDetails).reduce((acc: any, key) => {
        // For preserved fields, keep current values if they exist
        if (preservedFields.includes(key) && currentValues[key]) {
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
          <div onClick={() => handleTabChange(1 as TabNumber)} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 1 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Company Profile
            </h1>
          </div>
          <div onClick={() => handleTabChange(2 as TabNumber)} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 2 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              OSH Program and Policy
            </h1>
          </div>
          <div onClick={() => handleTabChange(3 as TabNumber)} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 3 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Risk Management
            </h1>
          </div>
          <div onClick={() => handleTabChange(4 as TabNumber)} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 4 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Health and Welfare Program
            </h1>
          </div>
          <div onClick={() => handleTabChange(5 as TabNumber)} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 5 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Safety Measures
            </h1>
          </div>
          <div onClick={() => handleTabChange(6 as TabNumber)} className="cursor-pointer">
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
