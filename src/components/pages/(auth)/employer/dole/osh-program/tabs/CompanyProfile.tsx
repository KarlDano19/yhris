"use client";
import { useEffect, useRef } from "react";

import { Controller } from "react-hook-form";

import CustomDatePicker from "@/components/CustomDatePicker";

import { XCircleIcon } from "@heroicons/react/24/solid";

export default function CompanyProfile({
  control,
  register,
  validationMessage,
  watch,
  setValue,
  missingFields = [],
  cachedProfile
}: {
  control: any;
  register: any;
  errors?: any;
  validationMessage?: string;
  watch?: any;
  setValue?: any;
  missingFields?: string[];
  cachedProfile?: { name: string; mobile_number: string; building: string; street: string; locality: string; city: string; country: string; zip_code: string };
}) {
  // Initialize ref to track first render
  const initializedRef = useRef(false);
  
  // Only watch business_description when this component is mounted
  const businessDescriptions = watch ? watch("business_description") || [] : [];
  
  // Watch male and female employee counts to calculate total
  const maleEmployees = watch ? watch("number_of_male_employees") || 0 : 0;
  const femaleEmployees = watch ? watch("number_of_female_employees") || 0 : 0;
  
  // Watch description fields to auto-check checkboxes
  const manufacturingDescription = watch ? watch("manufacturing_description") : "";
  const bankDescription = watch ? watch("bank_and_financial_institution_description") : "";
  const serviceDescription = watch ? watch("service_description") : "";
  const securityDescription = watch ? watch("security_agency_description") : "";
  const agriDescription = watch ? watch("agri_fishing_description") : "";
  const maintenanceDescription = watch ? watch("maintenance_description") : "";
  const wholesaleDescription = watch ? watch("wholesale_retail_description") : "";
  const constructionDescription = watch ? watch("construction_description") : "";
  const utilitiesDescription = watch ? watch("utilities_description") : "";
  const othersDescription = watch ? watch("others_description") : "";
  
  // Ensure business_description is an array
  useEffect(() => {
    if (!setValue || !businessDescriptions) return;
    
    // Skip if already an array to prevent infinite loops
    if (Array.isArray(businessDescriptions)) return;
    
    // Only process if businessDescriptions is not an array
    if (typeof businessDescriptions === 'string') {
      try {
        // Try to parse if it's a JSON string
        const parsed = JSON.parse(businessDescriptions);
        if (Array.isArray(parsed)) {
          setValue("business_description", parsed, { shouldDirty: false });
        } else {
          // If parsed but not an array, convert to array with single item
          setValue("business_description", [businessDescriptions], { shouldDirty: false });
        }
      } catch (e) {
        // If parsing fails, treat as a single string value
        setValue("business_description", [businessDescriptions], { shouldDirty: false });
      }
    } else if (businessDescriptions !== null && businessDescriptions !== undefined) {
      // For any other type, convert to array with string representation
      setValue("business_description", [String(businessDescriptions)], { shouldDirty: false });
    } else {
      // If null or undefined, set to empty array
      setValue("business_description", [], { shouldDirty: false });
    }
  }, [businessDescriptions, setValue]);
  
  // Calculate and update total employees whenever male or female counts change
  useEffect(() => {
    if (setValue) {
      const total = Number(maleEmployees) + Number(femaleEmployees);
      setValue("total_number_of_employees", total);
    }
  }, [maleEmployees, femaleEmployees, setValue]);

  // Auto-fill company information from cached profile data (fallback)
  useEffect(() => {
    if (cachedProfile && setValue && initializedRef.current) {
      // Auto-fill company name if empty
      if (cachedProfile.name) {
        const currentCompanyName = watch ? watch("company_name") : "";
        if (!currentCompanyName || currentCompanyName.trim() === "") {
          setValue("company_name", cachedProfile.name, { shouldDirty: false });
        }
      }
      
      // Auto-fill phone number if empty
      if (cachedProfile.mobile_number) {
        const currentPhoneNumber = watch ? watch("phone_number") : "";
        if (!currentPhoneNumber || currentPhoneNumber.trim() === "") {
          setValue("phone_number", cachedProfile.mobile_number, { shouldDirty: false });
        }
      }
      
      // Auto-fill complete address if empty
      if (cachedProfile.building || cachedProfile.street || cachedProfile.locality || cachedProfile.city || cachedProfile.country || cachedProfile.zip_code) {
        const currentAddress = watch ? watch("complete_address") : "";
        if (!currentAddress || currentAddress.trim() === "") {
          const addressParts = [
            cachedProfile.building,
            cachedProfile.street,
            cachedProfile.locality,
            cachedProfile.city,
            cachedProfile.country,
            cachedProfile.zip_code
          ].filter(Boolean);
          
          const combinedAddress = addressParts.join(', ');
          setValue("complete_address", combinedAddress, { shouldDirty: false });
        }
      }
    }
  }, [cachedProfile, setValue, watch]);

  // Function to handle checkbox changes for business_description
  const handleBusinessDescriptionChange = (value: string, checked: boolean) => {
    if (!setValue || !watch) return;
    
    // Get current array
    const currentDesc = watch("business_description") || [];
    const currentArray = Array.isArray(currentDesc) ? currentDesc : 
                         (typeof currentDesc === 'string' ? [currentDesc] : []);
    
    if (checked) {
      // Add value if it doesn't exist already
      if (!currentArray.includes(value)) {
        setValue("business_description", [...currentArray, value], { shouldDirty: true });
      }
    } else {
      // Remove value if checked is false
      setValue(
        "business_description", 
        currentArray.filter((item: string) => item !== value), 
        { shouldDirty: true }
      );
    }
  };

  // Helper function to check if a value is in the business_description array
  const isInBusinessDescription = (value: string) => {
    if (!businessDescriptions) return false;
    
    if (Array.isArray(businessDescriptions)) {
      return businessDescriptions.includes(value);
    } else if (typeof businessDescriptions === 'string') {
      try {
        const parsed = JSON.parse(businessDescriptions);
        if (Array.isArray(parsed)) {
          return parsed.includes(value);
        }
      } catch (e) {
        // If parsing fails, check if the string itself equals the value
        return businessDescriptions === value;
      }
    }
    return false;
  };

  // Auto-check business description checkboxes when descriptions are filled
  useEffect(() => {
    if (!setValue || !watch || !initializedRef.current) {
      // Set the flag to true after first render to allow future updates
      initializedRef.current = true;
      return;
    }
    
    const updateBusinessDescription = (description: string, value: string) => {
      if (description && description.trim() !== "") {
        // Get current value to check if we need to update
        const currentDesc = watch("business_description") || [];
        const currentArray = Array.isArray(currentDesc) ? currentDesc : 
                            (typeof currentDesc === 'string' ? [currentDesc] : []);
        
        // Only update if this value isn't already in the array
        if (!currentArray.includes(value)) {
          setValue("business_description", [...currentArray, value], { shouldDirty: false });
        }
      }
    };

    updateBusinessDescription(manufacturingDescription, "Manufacturing");
    updateBusinessDescription(bankDescription, "Bank and Financial Institution");
    updateBusinessDescription(serviceDescription, "Service");
    updateBusinessDescription(securityDescription, "Security Agency");
    updateBusinessDescription(agriDescription, "Agri/ Fishing");
    updateBusinessDescription(maintenanceDescription, "Maintenance");
    updateBusinessDescription(wholesaleDescription, "Wholesale/ Retail");
    updateBusinessDescription(constructionDescription, "Construction");
    updateBusinessDescription(utilitiesDescription, "Utilities");
    updateBusinessDescription(othersDescription, "Others (Please specify)");
    
  }, [
    manufacturingDescription,
    bankDescription,
    serviceDescription,
    securityDescription,
    agriDescription,
    maintenanceDescription,
    wholesaleDescription,
    constructionDescription,
    utilitiesDescription,
    othersDescription,
    setValue,
    watch
  ]);

  // Helper function to check if a field is missing
  const isMissingField = (fieldName: string) => {
    return missingFields.includes(fieldName);
  };

  return (
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mt-4">
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Company Name
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("company_name")}
                id="company_name"
                readOnly
                className={`cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                  ${isMissingField('company_name') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date Established
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <Controller
                control={control}
                name="date_established"
                render={({ field }: { field: any }) => {
                  // Parse as local date (not UTC)
                  const selectedDate = field.value ? new Date(field.value + 'T00:00:00') : null;
                  return (
                    <CustomDatePicker
                      id="date-established-datepicker"
                      placeholder={"mm/dd/yyyy"}
                      className={
                        `block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset 
                        ${isMissingField('date_established') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none`
                      }
                      selected={selectedDate}
                      pickerOnChange={(date: any) => {
                        // Format date in local time
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          field.onChange(`${year}-${month}-${day}`);
                        } else {
                          field.onChange(null);
                        }
                      }}
                      inputOnChange={(date: any) => {
                        // Handle Date object from manual input
                        if (date && date instanceof Date && !isNaN(date.getTime())) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          field.onChange(`${year}-${month}-${day}`);
                        } else {
                          field.onChange(null);
                        }
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="complete_address"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Complete Address
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("complete_address")}
                id="complete_address"
                readOnly
                className={`cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                  ${isMissingField('complete_address') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Phone Number
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("phone_number")}
                id="phone_number"
                readOnly
                className={`cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mt-4">
          <div>
            <label
              htmlFor="fax_number"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Fax Number
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("fax_number")}
                id="fax_number"
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="website_url"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Website URL/ Email Address
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("website_url")}
                id="website_url"
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('website_url') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="company_owner"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Company Owner/ Manager
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("company_owner")}
                id="company_owner"
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mt-4">
          <div>
            <label
              htmlFor="number_of_male_employees"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              No. of Male Employees
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("number_of_male_employees")}
                id="number_of_male_employees"
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('number_of_male_employees') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="number_of_female_employees"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              No. of Female Employees
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("number_of_female_employees")}
                id="number_of_female_employees"
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('number_of_female_employees') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="total_number_of_employees"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Total No. of Employees
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("total_number_of_employees")}
                id="total_number_of_employees"
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 bg-gray-100`}
                disabled
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Business Description</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 mt-4">
          <div className="relative mt-2 pl-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <input
                type="checkbox"
                {...register("business_description")}
                id="manufacturing"
                value="Manufacturing"
                checked={isInBusinessDescription("Manufacturing")}
                onChange={(e) => handleBusinessDescriptionChange("Manufacturing", e.target.checked)}
              />
              <label htmlFor="manufacturing" className="ml-2 mt-1">
                Manufacturing
              </label>
            </div>
            <input
              type="text"
              {...register("manufacturing_description")}
              id="manufacturing_description"
              className={`rounded-md w-full sm:w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
            />
          </div>
          <div className="relative mt-2 pl-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <input
                type="checkbox"
                {...register("business_description")}
                id="bank_and_financial_institution"
                value="Bank and Financial Institution"
                checked={isInBusinessDescription("Bank and Financial Institution")}
                onChange={(e) => handleBusinessDescriptionChange("Bank and Financial Institution", e.target.checked)}
              />
              <label
                htmlFor="bank_and_financial_institution"
                className="ml-2 mt-1"
              >
                Bank and Financial Institution
              </label>
            </div>
            <input
              type="text"
              {...register("bank_and_financial_institution_description")}
              id="bank_and_financial_institution_description"
              className={`rounded-md w-full sm:w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
            />
          </div>
          <div className="relative mt-2 pl-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <input
                type="checkbox"
                {...register("business_description")}
                id="service"
                value="Service"
                checked={isInBusinessDescription("Service")}
                onChange={(e) => handleBusinessDescriptionChange("Service", e.target.checked)}
              />
              <label htmlFor="service" className="ml-2 mt-1">
                Service
              </label>
            </div>
            <input
              type="text"
              {...register("service_description")}
              id="service_description"
              className={`rounded-md w-full sm:w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-ins ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
            />
          </div>
          <div className="relative mt-2 pl-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <input
                type="checkbox"
                {...register("business_description")}
                id="security_agency"
                value="Security Agency"
                checked={isInBusinessDescription("Security Agency")}
                onChange={(e) => handleBusinessDescriptionChange("Security Agency", e.target.checked)}
              />
              <label htmlFor="security_agency" className="ml-2 mt-1">
                Security Agency
              </label>
            </div>
            <input
              type="text"
              {...register("security_agency_description")}
              id="security_agency_description"
              className={`rounded-md w-full sm:w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
            />
          </div>
          <div className="relative mt-2 pl-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <input
                type="checkbox"
                {...register("business_description")}
                id="agri_fishing"
                value="Agri/ Fishing"
                checked={isInBusinessDescription("Agri/ Fishing")}
                onChange={(e) => handleBusinessDescriptionChange("Agri/ Fishing", e.target.checked)}
              />
              <label htmlFor="agri_fishing" className="ml-2 mt-1">
                Agri/ Fishing
              </label>
            </div>
            <input
              type="text"
              {...register("agri_fishing_description")}
              id="agri_fishing_description"
              className={`rounded-md w-full sm:w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
            />
          </div>
          <div className="relative mt-2 pl-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <input
                type="checkbox"
                {...register("business_description")}
                id="maintenance"
                value="Maintenance"
                checked={isInBusinessDescription("Maintenance")}
                onChange={(e) => handleBusinessDescriptionChange("Maintenance", e.target.checked)}
              />
              <label htmlFor="maintenance" className="ml-2 mt-1">
                Maintenance
              </label>
            </div>
            <input
              type="text"
              {...register("maintenance_description")}
              id="maintenance_description"
              className={`rounded-md w-full sm:w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset $ ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
            />
          </div>
          <div className="relative mt-2 pl-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <input
                type="checkbox"
                {...register("business_description")}
                id="wholesale_retail"
                value="Wholesale/ Retail"
                checked={isInBusinessDescription("Wholesale/ Retail")}
                onChange={(e) => handleBusinessDescriptionChange("Wholesale/ Retail", e.target.checked)}
              />
              <label htmlFor="wholesale_retail" className="ml-2 mt-1">
                Wholesale/ Retail
              </label>
            </div>
            <input
              type="text"
              {...register("wholesale_retail_description")}
              id="wholesale_retail_description"
              className={`rounded-md w-full sm:w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
            />
          </div>
          <div className="relative mt-2 pl-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <input
                type="checkbox"
                {...register("business_description")}
                id="construction"
                value="Construction"
                checked={isInBusinessDescription("Construction")}
                onChange={(e) => handleBusinessDescriptionChange("Construction", e.target.checked)}
              />
              <label htmlFor="construction" className="ml-2 mt-1">
                Construction
              </label>
            </div>
            <input
              type="text"
              {...register("construction_description")}
              id="construction_description"
              className={`rounded-md w-full sm:w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
            />
          </div>
          <div className="relative mt-2 pl-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <input
                type="checkbox"
                {...register("business_description")}
                id="utilities"
                value="Utilities"
                checked={isInBusinessDescription("Utilities")}
                onChange={(e) => handleBusinessDescriptionChange("Utilities", e.target.checked)}
              />
              <label htmlFor="utilities" className="ml-2 mt-1">
                Utilities
              </label>
            </div>
            <input
              type="text"
              {...register("utilities_description")}
              id="utilities_description"
              className={`rounded-md w-full sm:w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
            />
          </div>
          <div className="relative mt-2 pl-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <input
                type="checkbox"
                {...register("business_description")}
                id="others"
                value="Others (Please specify)"
                checked={isInBusinessDescription("Others (Please specify)")}
                onChange={(e) => handleBusinessDescriptionChange("Others (Please specify)", e.target.checked)}
              />
              <label htmlFor="others" className="ml-2 mt-1">
                Others (Please specify)
              </label>
            </div>
            <input
              type="text"
              {...register("others_description")}
              id="others_description"
              className={`rounded-md w-full sm:w-1/2 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-in ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-10">
          <div>
            <label
              htmlFor="product_description"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Product Description
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <textarea
                {...register("product_description")}
                id="product_description"
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('product_description') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="services_description"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Services Description
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <textarea
                {...register("services_description")}
                id="services_description"
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('services_description') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex justify-end">
        <button
          type="submit"
          className="w-full rounded-md bg-savoy-blue px-14 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div> */}
    </form>
  );
}
