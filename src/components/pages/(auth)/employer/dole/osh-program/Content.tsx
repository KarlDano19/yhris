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
  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm();
  const [selectedTab, setSelectedTab] = useState(1);
  const [validationMessage, setValidationMessage] = useState("");

  const { data: oshProgramDetails } = useGetOshProgramDetails();
  const { mutate: updateOshProgramDetails } = useUpdateOshProgramDetails();

  const onSubmit = handleSubmit((data) => {
    // Define required fields for each tab
    const requiredFieldsByTab: { [key: number]: string[] } = {
      1: ['company_name', 'date_established', 'complete_address', 'website_url', 'number_of_male_employees', 'number_of_female_employees'],
      2: ['date_policy', 'name_of_owner', 'signature'], 
      3: ['emergency_and_disaster_preparedness'],
      4: ['no_of_treatment_rooms_first_aid_rooms', 'no_of_clinics_in_the_workplace', 'hospitals_youre_affiliated_with', 
          'chairperson_less_than_ten', 'secretary_less_than_ten', 'member_less_than_ten', 
          'chairperson_medium_to_high', 'secretary_medium_to_high', 'ex_officio_members', 
          'members', 'chairperson_joint_coordinating', 'secretary_joint_coordinating', 'ex_officio_members_1'],
      5: [],
      6: ['others_name', 'name_of_owner_manager', 'employees_representative', 'date_filled']
    };
    
    // Validate based on the current selected tab
    const requiredFields = requiredFieldsByTab[selectedTab] || [];
    const missingFields = requiredFields.filter((field: string) => !data[field]);
    
    if (missingFields.length > 0) {
      setValidationMessage("Please fill out all required fields marked with *");
      return;
    }
    
    // Create a new object with processed data
    const processedData = { ...data };
    
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
          // Default to false only if we don't have an existing value
          processedData[field] = false;
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
    // Clear validation message when changing tabs
    setValidationMessage("");
  }, [selectedTab]);

  useEffect(() => {
    if (oshProgramDetails) {
      setValue("adequate_sanitary_and_washing_facilities", oshProgramDetails.adequate_sanitary_and_washing_facilities);
      setValue("adequate_sanitary_and_washing_facilities_remarks", oshProgramDetails.adequate_sanitary_and_washing_facilities_remarks);
      setValue("adequate_supply_of_drinking_water", oshProgramDetails.adequate_supply_of_drinking_water);
      setValue("adequate_supply_of_drinking_water_remarks", oshProgramDetails.adequate_supply_of_drinking_water_remarks);
      setValue("agri_fishing_description", oshProgramDetails.agri_fishing_description);
      setValue("annex_a_message", oshProgramDetails.annex_a_message);
      setValue("bank_and_financial_institution_description", oshProgramDetails.bank_and_financial_institution_description);
      setValue("basic_components", oshProgramDetails.basic_components);
      setValue("business_description", oshProgramDetails.business_description);
      setValue("chairperson_joint_coordinating", oshProgramDetails.chairperson_joint_coordinating);
      setValue("chairperson_less_than_ten", oshProgramDetails.chairperson_less_than_ten);
      setValue("chairperson_medium_to_high", oshProgramDetails.chairperson_medium_to_high);
      setValue("company_commitment", oshProgramDetails.company_commitment);
      setValue("company_name", oshProgramDetails.company_name);
      setValue("company_owner", oshProgramDetails.company_owner);
      setValue("complete_address", oshProgramDetails.complete_address);
      setValue("construction_description", oshProgramDetails.construction_description);
      setValue("date", oshProgramDetails.date);
      setValue("date_established", oshProgramDetails.date_established);
      setValue("date_filled", oshProgramDetails.date_filled);
      setValue("drills", oshProgramDetails.drills);
      setValue("duties_and_responsibilities", oshProgramDetails.duties_and_responsibilities);
      setValue("emergency_and_disaster_preparedness", oshProgramDetails.emergency_and_disaster_preparedness);
      setValue("employees_representative", oshProgramDetails.employees_representative);
      setValue("ex_officio_members", oshProgramDetails.ex_officio_members);
      setValue("fax_number", oshProgramDetails.fax_number);
      setValue("health_personnel", oshProgramDetails.health_personnel);
      setValue("health_training", oshProgramDetails.health_training);
      setValue("hospitals_youre_affiliated_with", oshProgramDetails.hospitals_youre_affiliated_with);
      setValue("lactation_station", oshProgramDetails.lactation_station);
      setValue("lactation_station_remarks", oshProgramDetails.lactation_station_remarks);
      setValue("machine_guards_cost", oshProgramDetails.machine_guards_cost);
      setValue("machine_guards_description", oshProgramDetails.machine_guards_description);
      setValue("maintenance_description", oshProgramDetails.maintenance_description);
      setValue("manufacturing_description", oshProgramDetails.manufacturing_description);
      setValue("medical_examinations_cost", oshProgramDetails.medical_examinations_cost);
      setValue("medical_supplies_cost", oshProgramDetails.medical_supplies_cost);
      setValue("member_less_than_ten", oshProgramDetails.member_less_than_ten);
      setValue("members", oshProgramDetails.members);
      setValue("name_of_owner", oshProgramDetails.name_of_owner);
      setValue("name_of_owner_manager", oshProgramDetails.name_of_owner_manager);
      setValue("no_of_clinics_in_the_workplace", oshProgramDetails.no_of_clinics_in_the_workplace);
      setValue("no_of_treatment_rooms_first_aid_rooms", oshProgramDetails.no_of_treatment_rooms_first_aid_rooms);
      setValue("number_of_female_employees", oshProgramDetails.number_of_female_employees);
      setValue("number_of_male_employees", oshProgramDetails.number_of_male_employees);
      setValue("osh_training_cost", oshProgramDetails.osh_training_cost);
      setValue("other_workers_welfare_facilities", oshProgramDetails.other_workers_welfare_facilities);
      setValue("other_workers_welfare_facilities_remarks", oshProgramDetails.other_workers_welfare_facilities_remarks);
      setValue("others_cost", oshProgramDetails.others_cost);
      setValue("others_description", oshProgramDetails.others_description);
      setValue("others_name", oshProgramDetails.others_name);
      setValue("phone_number", oshProgramDetails.phone_number);
      setValue("polution_control_officer", oshProgramDetails.polution_control_officer);
      setValue("ppe", oshProgramDetails.ppe);
      setValue("ppe_cost", oshProgramDetails.ppe_cost);
      setValue("ppe_description", oshProgramDetails.ppe_description);
      setValue("product_description", oshProgramDetails.product_description);
      setValue("prohibited_acts_and_penalties_message", oshProgramDetails.prohibited_acts_and_penalties_message);
      setValue("ramps_railings_and_like", oshProgramDetails.ramps_railings_and_like);
      setValue("ramps_railings_and_like_remarks", oshProgramDetails.ramps_railings_and_like_remarks);
      setValue("random_drug_testing", oshProgramDetails.random_drug_testing);
      setValue("reported_incidents", oshProgramDetails.reported_incidents);
      setValue("risk_assessment", oshProgramDetails.risk_assessment);
      setValue("routine_medical_surveillance", oshProgramDetails.routine_medical_surveillance);
      setValue("safety_meeting", oshProgramDetails.safety_meeting);
      setValue("safety_officer", oshProgramDetails.safety_officer);
      setValue("safety_signages_cost", oshProgramDetails.safety_signages_cost);
      setValue("safety_signature", oshProgramDetails.safety_signature);
      setValue("schedule_of_annual_medical_examination", oshProgramDetails.schedule_of_annual_medical_examination);
      setValue("secretary_joint_coordinating", oshProgramDetails.secretary_joint_coordinating);
      setValue("secretary_less_than_ten", oshProgramDetails.secretary_less_than_ten);
      setValue("secretary_medium_to_high", oshProgramDetails.secretary_medium_to_high);
      setValue("security_agency_description", oshProgramDetails.security_agency_description);
      setValue("separate_sanitary_washing_and_sleeping_facilities", oshProgramDetails.separate_sanitary_washing_and_sleeping_facilities);
      setValue("separate_sanitary_washing_and_sleeping_facilities_remarks", oshProgramDetails.separate_sanitary_washing_and_sleeping_facilities_remarks);
      setValue("service_description", oshProgramDetails.service_description);
      setValue("services_description", oshProgramDetails.services_description);
      setValue("signature", oshProgramDetails.signature);
      setValue("special_medical_surveillance", oshProgramDetails.special_medical_surveillance);
      setValue("suitable_living_accommodation", oshProgramDetails.suitable_living_accommodation);
      setValue("suitable_living_accommodation_remarks", oshProgramDetails.suitable_living_accommodation_remarks);
      setValue("total_number_of_employees", oshProgramDetails.total_number_of_employees);
      setValue("utilities_description", oshProgramDetails.utilities_description);
      setValue("waste_management_system_message", oshProgramDetails.waste_management_system_message);
      setValue("website_url", oshProgramDetails.website_url);
      setValue("wholesale_retail_description", oshProgramDetails.wholesale_retail_description);
      setValue("written_emergency_and_disaster_program", oshProgramDetails.written_emergency_and_disaster_program);
      setValue("written_pollution_control_program", oshProgramDetails.written_pollution_control_program);
    }
  }, [oshProgramDetails, setValue]);

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
              onClick={onSubmit}
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
          <div onClick={() => {
            setSelectedTab(1);
            setValidationMessage("");
          }} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 1 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Company Profile
            </h1>
          </div>
          <div onClick={() => {
            setSelectedTab(2);
            setValidationMessage("");
          }} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 2 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              OSH Program and Policy
            </h1>
          </div>
          <div onClick={() => {
            setSelectedTab(3);
            setValidationMessage("");
          }} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 3 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Risk Management
            </h1>
          </div>
          <div onClick={() => {
            setSelectedTab(4);
            setValidationMessage("");
          }} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 4 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Health and Welfare Program
            </h1>
          </div>
          <div onClick={() => {
            setSelectedTab(5);
            setValidationMessage("");
          }} className="cursor-pointer">
            <h1 className={`text-lg font-bold pb-2 text-center ${selectedTab === 5 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
              Safety Measures
            </h1>
          </div>
          <div onClick={() => {
            setSelectedTab(6);
            setValidationMessage("");
          }} className="cursor-pointer">
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
          />
        )}
        {selectedTab === 5 && (
          <SafetyMeasures
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
            validationMessage={validationMessage}
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
