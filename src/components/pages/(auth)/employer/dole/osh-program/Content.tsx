"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

import CustomToast from "@/components/CustomToast";
import VersionHistoryModal from "./modals/VersionHistoryModal";
import VersionHistoryDetailsModal from "./modals/VersionHistoryDetailsModal";
import UnsavedChangesModal from "./modals/UnsavedChangesModal";
import useGetOshProgramDetails from "./hooks/useGetOshProgramDetails";
import useUpdateOshProgramDetails from "./hooks/useUpdateOshProgramDetails";
import useGetOshProgramVersionHistory from "./hooks/useGetOshProgramVersionHistory";
import useFileforge from "./hooks/useFileforge";
import CompanyProfile from "./tabs/CompanyProfile";
import ProgramAndPolicy from "./tabs/ProgramAndPolicy";
import RiskManagement from "./tabs/RiskManagement";
import SafetyMeasures from "./tabs/SafetyMeasures";
import ComplianceAndCost from "./tabs/ComplianceAndCost";
import HealthAndWelfare from "./tabs/HealthAndWelfare";

import PrintIcon from "@/svg/PrintIcon";
import HistoryIcon from "@/svg/HistoryIcon";
import SelectChevronDown from "@/svg/SelectChevronDown";

// Import shared print utility
import { printOshProgram } from "./PrintData";

import { 
  T_OshProgram, 
  OSH_PROGRAM_TAB_NUMBER as TabNumber, 
  OSH_PROGRAM_TABS,
  OSH_PROGRAM_FIELDS,
  getFacilityFields
} from "@/types/osh-program";

// Define ExtendedOshProgram type within the file
type ExtendedOshProgram = Partial<T_OshProgram> & {
  id?: string;
  [key: string]: any;
};

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const { register, handleSubmit, setValue, control, watch, formState: { errors }, clearErrors } = useForm<ExtendedOshProgram>();
  const [selectedTab, setSelectedTab] = useState<TabNumber>(1);
  const [validationMessage, setValidationMessage] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [safetySignageUrl, setSafetySignageUrl] = useState<string>("");
  const [safetySignageAttachmentExist, setSafetySignageAttachmentExist] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Version History Modal States
  const [isVersionHistoryModalOpen, setIsVersionHistoryModalOpen] = useState(false);
  const [isVersionHistoryDetailsModalOpen, setIsVersionHistoryDetailsModalOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  
  // Get cached profile data for auto-filling company information
  const cachedProfile = queryClient
    .getQueryCache()
    .find(["employerProfileCache"]) as {
    state: { data: { name: string; mobile_number: string; building: string; street: string; locality: string; city: string; country: string; zip_code: string } } | undefined;
  };
  
  // Only fetch once on initial mount, then rely on manual refetch
  const { data: oshProgramDetails, refetch, isLoading } = useGetOshProgramDetails(true);
  const { mutateAsync: updateOshProgramDetails } = useUpdateOshProgramDetails();
  
  // Auto-fill company information from cached profile data when available
  useEffect(() => {
    if (cachedProfile?.state?.data && setValue && selectedTab === 1) {
      // Force override the company name with cached profile data
      if (cachedProfile.state.data.name) {
        setValue("company_name", cachedProfile.state.data.name, { shouldDirty: false });
      }
      
      // Auto-fill phone number with mobile number from cached profile
      if (cachedProfile.state.data.mobile_number) {
        setValue("phone_number", cachedProfile.state.data.mobile_number, { shouldDirty: false });
      }
      
      // Auto-fill complete address by combining address fields from cached profile
      if (cachedProfile.state.data.building || cachedProfile.state.data.street || cachedProfile.state.data.locality || cachedProfile.state.data.city || cachedProfile.state.data.country || cachedProfile.state.data.zip_code) {
        const addressParts = [
          cachedProfile.state.data.building,
          cachedProfile.state.data.street,
          cachedProfile.state.data.locality,
          cachedProfile.state.data.city,
          cachedProfile.state.data.country,
          cachedProfile.state.data.zip_code
        ].filter(Boolean); // Remove empty/undefined values
        
        const combinedAddress = addressParts.join(', ');
        setValue("complete_address", combinedAddress, { shouldDirty: false });
      }
    }
  }, [cachedProfile?.state?.data, setValue, selectedTab, oshProgramDetails]);

  // Handle scroll detection for sticky header border
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get version history for limit checking
  const { data: versionHistoryData, refetch: refetchVersionHistory } = useGetOshProgramVersionHistory({
    page_size: 1,
    current_page: 1
  });

  // Fileforge hook for PDF generation
  const { generatePDFLocally, isGenerating } = useFileforge({
    onSuccess: () => {
      toast.custom(() => <CustomToast message='PDF generated successfully.' type='success' />, { duration: 3000 });
    },
    onError: (error) => {
      toast.custom(() => <CustomToast message={`Failed to generate PDF: ${error.message}`} type='error' />, { duration: 5000 });
    },
  });

  const statusOptions = [
    { value: 'on-schedule', label: 'On Schedule', color: 'bg-purple-100 text-purple-700' },
    { value: 'for-submission', label: 'For Submission', color: 'bg-blue-100 text-blue-700' },
    { value: 'for-review', label: 'For Review', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-700' },
  ];

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateOshProgramDetails({
        ...oshProgramDetails,
        status: newStatus
      });
      
      toast.custom(() => <CustomToast message='Status updated successfully.' type='success' />, { duration: 3000 });
      // Invalidate cache to trigger refetch - no need for explicit refetch
      await queryClient.invalidateQueries({ queryKey: ['oshProgramDetails'] });
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error || 'Failed to update status.'} type='error' />, { duration: 5000 });
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-600';
  };



  // Version History Modal Handlers
  const handleOpenVersionHistory = () => {
    setIsVersionHistoryModalOpen(true);
  };

  const handleCloseVersionHistory = () => {
    setIsVersionHistoryModalOpen(false);
    // Refetch version history to ensure count is updated
    refetchVersionHistory();
  };

  const handleViewVersionDetails = (versionId: number) => {
    setSelectedVersionId(versionId);
    setIsVersionHistoryModalOpen(false);
    setIsVersionHistoryDetailsModalOpen(true);
  };

  const handleCloseVersionDetails = () => {
    setIsVersionHistoryDetailsModalOpen(false);
  };

  const handleBackToVersionHistory = () => {
    setIsVersionHistoryDetailsModalOpen(false);
    setIsVersionHistoryModalOpen(true);
  };

  // Print function to generate PDF of the latest OSH program version
  const handlePrint = async () => {
    if (!oshProgramDetails) return;
    
    try {
      await printOshProgram({
        data: oshProgramDetails,
        filename: "osh-program-latest-version.pdf",
        generatePDFLocally
      });
    } catch (error) {
      console.error('Print error:', error);
    }
  };

  const onSubmit = handleSubmit(async (data: ExtendedOshProgram) => {
    // Validate required fields
    const requiredFields = OSH_PROGRAM_TABS.REQUIRED_FIELDS[selectedTab] || [];
    const missingFields = requiredFields.filter((field: keyof T_OshProgram) => !data[field]);

    if (missingFields.length > 0) {
      // Store missing fields for UI highlighting
      setMissingFields(missingFields as string[]);
      setValidationMessage(`Please fill out all required fields marked with *`);
      return;
    }

    // Clear missing fields if validation passes
    setMissingFields([]);
    setValidationMessage("");

    // Process form data
    const processedData = processFormData(data);

    // Submit data to server
    await submitDataToServer(processedData);
  });
  
  // Process the form data for the current tab
  const processFormData = (data: ExtendedOshProgram): ExtendedOshProgram => {
    // Get the fields for the current tab
    const currentTabFields = OSH_PROGRAM_TABS.FIELDS[selectedTab];
    
    // Create a new object with only the fields from the current tab
    const processedData: ExtendedOshProgram = {};
    
    // Add the ID if it exists
    if (oshProgramDetails?.id) {
      processedData.id = oshProgramDetails.id;
    }

    // Only process fields from the current tab
    currentTabFields.forEach((field: keyof T_OshProgram) => {
      // Skip boolean fields if they're not in the current tab
      if (OSH_PROGRAM_FIELDS.BOOLEAN_FIELDS.includes(field as string) && ![4, 5].includes(selectedTab)) {
        return;
      }
      
      if (data[field] !== undefined) {
        processedData[field] = data[field];
      }
    });

    // Process file attachments based on tab
    processAttachments(data, processedData);

    // Process boolean fields based on tab
    processBooleanFields(processedData);

    // Handle JSON fields if they exist in the current tab
    processJsonFields(processedData);

    // Handle file fields
    if (selectedTab === 2) {
      processSignatureField(data, processedData);
    }

    // Handle safety officers and health personnel arrays
    if (selectedTab === 4) {
      processPersonnelData(processedData);
    }

    return processedData;
  };

  // Process attachments based on the current tab
  const processAttachments = (data: ExtendedOshProgram, processedData: ExtendedOshProgram): void => {
    // Special handling for file attachments in Tab 4
    if (selectedTab === 4) {
      // Explicitly include file attachments for safety officer and health personnel
      if (data.safety_officer_attachment !== undefined) {
        processedData.safety_officer_attachment = data.safety_officer_attachment;
      }
      
      if (data.health_personnel_attachment !== undefined) {
        processedData.health_personnel_attachment = data.health_personnel_attachment;
      }
    }

    // Special handling for file attachments in Tab 5 (Safety Measures)
    if (selectedTab === 5) {
      // Include all the facility attachment fields
      getFacilityFields().forEach(field => {
        if (data[field] !== undefined) {
          processedData[field] = data[field];
        }
      });
    }
  };

  // Process boolean fields based on the current tab
  const processBooleanFields = (processedData: ExtendedOshProgram): void => {
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
      OSH_PROGRAM_FIELDS.SAFETY_MEASURES_BOOLEAN_FIELDS.forEach(field => {
        if (field in processedData) {
          // Preserve null values, only convert explicit true/false
          const value = processedData[field] as boolean | string | null | undefined;
          if (value === true || value === 'true') processedData[field] = true;
          else if (value === false || value === 'false') processedData[field] = false;
          // Leave null/undefined values as is
        }
      });
    }
  };

  // Process JSON fields
  const processJsonFields = (processedData: ExtendedOshProgram): void => {
    OSH_PROGRAM_FIELDS.JSON_FIELDS.forEach(field => {
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
  };

  // Process signature field for tab 2
  const processSignatureField = (data: ExtendedOshProgram, processedData: ExtendedOshProgram): void => {
    const currentSignature = watch("signature");
    const signatureSource = watch("signature_source");
    
    if (currentSignature instanceof File) {
      // Keep the File object as is for FormData
      processedData.signature = currentSignature;
      processedData.signature_source = signatureSource;
    } else if (typeof currentSignature === 'string') {
      processedData.signature = currentSignature;
      processedData.signature_source = signatureSource;
    }
  };

  // Process safety officers and health personnel data
  const processPersonnelData = (processedData: ExtendedOshProgram): void => {
    // Process safety officers
    if (processedData.safety_officers && Array.isArray(processedData.safety_officers)) {
      // Filter out empty entries
      processedData.safety_officers = processedData.safety_officers.filter(officer => 
        officer && (officer.name || officer.training_and_hours || officer.certificate)
      );
    }
    
    // Process health personnel
    if (processedData.health_personnel && Array.isArray(processedData.health_personnel)) {
      // Filter out empty entries
      processedData.health_personnel = processedData.health_personnel.filter(personnel => 
        personnel && (
          personnel.shift_area_department || 
          personnel.health_personnel_name || 
          personnel.facilities || 
          personnel.attachment
        )
      );
    }
  };

  // Submit the processed data to the server
  const submitDataToServer = async (processedData: ExtendedOshProgram): Promise<void> => {
    setValidationMessage("");
    
    try {
      await updateOshProgramDetails(processedData);
      handleSuccessfulSubmission();
    } catch (error: any) {
      // Don't show success toast if there's an error
      throw error; // Re-throw the error to be handled by the calling function
    }
  };

  // Check if there are unsaved changes in the current tab
  const hasUnsavedChanges = (): boolean => {
    const formValues = watch();
    const originalData = oshProgramDetails;
    
    if (!originalData) return false;
    
    // Get fields for the current tab only
    const currentTabFields = OSH_PROGRAM_TABS.FIELDS[selectedTab] || [];
    
    // Compare form values with original data for current tab only
    for (const field of currentTabFields) {
      const formValue = formValues[field];
      const originalValue = originalData[field];
      
      // Handle different data types
      if (formValue !== originalValue) {
        // For arrays, do deep comparison
        if (Array.isArray(formValue) && Array.isArray(originalValue)) {
          if (JSON.stringify(formValue) !== JSON.stringify(originalValue)) {
            return true;
          }
        }
        // For objects, do deep comparison
        else if (typeof formValue === 'object' && typeof originalValue === 'object' && formValue !== null && originalValue !== null) {
          if (JSON.stringify(formValue) !== JSON.stringify(originalValue)) {
            return true;
          }
        }
        // For primitive values, direct comparison
        else if (formValue !== originalValue) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Handle navigation with unsaved changes check
  const handleNavigation = (url: string) => {
    if (hasUnsavedChanges()) {
      setPendingNavigation(url);
      setShowUnsavedChangesModal(true);
    } else {
      window.location.href = url;
    }
  };

  // Handle save changes from modal
  const handleSaveChanges = async () => {
    setIsSavingChanges(true);
    try {
      await submitCurrentTab();
      setShowUnsavedChangesModal(false);
      if (pendingNavigation) {
        window.location.href = pendingNavigation;
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSavingChanges(false);
    }
  };

  // Handle discard changes from modal
  const handleDiscardChanges = () => {
    setShowUnsavedChangesModal(false);
    if (pendingNavigation) {
      window.location.href = pendingNavigation;
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowUnsavedChangesModal(false);
    setPendingNavigation(null);
  };

  // Get current tab name
  const getCurrentTabName = (): string => {
    const tabNames = {
      1: 'Company Profile',
      2: 'OSH Program and Policy',
      3: 'Risk Management',
      4: 'Health and Welfare Program',
      5: 'Safety Measures',
      6: 'Compliance and Cost'
    };
    return tabNames[selectedTab] || 'current tab';
  };

  // Handle successful submission
  const handleSuccessfulSubmission = (): void => {
    // Refresh data from backend to ensure frontend state is in sync
    refetch().then(() => {
      // Success toast will be shown after 3-second timeout in submitCurrentTab
    }).catch(() => {
      // Still continue even if refetch fails
    });
    
    // Invalidate version history cache to update version count
    queryClient.invalidateQueries({ queryKey: ['oshProgramVersionHistory'] });
  };

  useEffect(() => {
    if (oshProgramDetails) {
      // Tab 1: Company Profile
      // Only set company_name from backend if no cached profile data is available
      if (!cachedProfile?.state?.data?.name) {
        setValue("company_name", oshProgramDetails.company_name);
      }
      setValue("date_established", oshProgramDetails.date_established);
      // Only set complete_address from backend if no cached profile data is available
      if (!cachedProfile?.state?.data?.building && !cachedProfile?.state?.data?.street && !cachedProfile?.state?.data?.locality && !cachedProfile?.state?.data?.city && !cachedProfile?.state?.data?.country && !cachedProfile?.state?.data?.zip_code) {
        setValue("complete_address", oshProgramDetails.complete_address);
      }
      // Only set phone_number from backend if no cached profile data is available
      if (!cachedProfile?.state?.data?.mobile_number) {
        setValue("phone_number", oshProgramDetails.phone_number);
      }
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
      setValue("signature_source", oshProgramDetails.signature_source);

      // Tab 3: Risk Management
      setValue("emergency_and_disaster_preparedness", oshProgramDetails.emergency_and_disaster_preparedness);

      // Tab 4: Health and Welfare Program
        // Medical Surveillance Section
        setValue("routine_medical_surveillance", oshProgramDetails.routine_medical_surveillance);
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
        setValue("safety_officers", oshProgramDetails.safety_officers || []);
        
        // Emergency Occupational Health Personnel and Facilities
        setValue("health_personnel", oshProgramDetails.health_personnel || []);

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
        setValue("adequate_supply_of_drinking_water_attachment", oshProgramDetails.adequate_supply_of_drinking_water_attachment);

        setValue("adequate_sanitary_and_washing_facilities", oshProgramDetails.adequate_sanitary_and_washing_facilities);
        setValue("adequate_sanitary_and_washing_facilities_remarks", oshProgramDetails.adequate_sanitary_and_washing_facilities_remarks);
        setValue("adequate_sanitary_and_washing_facilities_attachment", oshProgramDetails.adequate_sanitary_and_washing_facilities_attachment);
        
        setValue("suitable_living_accommodation", oshProgramDetails.suitable_living_accommodation);
        setValue("suitable_living_accommodation_remarks", oshProgramDetails.suitable_living_accommodation_remarks);
        setValue("suitable_living_accommodation_attachment", oshProgramDetails.suitable_living_accommodation_attachment);
        
        setValue("separate_sanitary_washing_and_sleeping_facilities", oshProgramDetails.separate_sanitary_washing_and_sleeping_facilities);
        setValue("separate_sanitary_washing_and_sleeping_facilities_remarks", oshProgramDetails.separate_sanitary_washing_and_sleeping_facilities_remarks);
        setValue("separate_sanitary_washing_and_sleeping_facilities_attachment", oshProgramDetails.separate_sanitary_washing_and_sleeping_facilities_attachment);
        
        setValue("lactation_station", oshProgramDetails.lactation_station);
        setValue("lactation_station_remarks", oshProgramDetails.lactation_station_remarks);
        setValue("lactation_station_attachment", oshProgramDetails.lactation_station_attachment);
        
        setValue("ramps_railings_and_like", oshProgramDetails.ramps_railings_and_like);
        setValue("ramps_railings_and_like_remarks", oshProgramDetails.ramps_railings_and_like_remarks);
        setValue("ramps_railings_and_like_attachment", oshProgramDetails.ramps_railings_and_like_attachment);
        
        setValue("other_workers_welfare_facilities", oshProgramDetails.other_workers_welfare_facilities);
        setValue("other_workers_welfare_facilities_remarks", oshProgramDetails.other_workers_welfare_facilities_remarks);
        setValue("other_workers_welfare_facilities_attachment", oshProgramDetails.other_workers_welfare_facilities_attachment);
        
        // Emergency and Disaster Preparedness Section
        setValue("written_emergency_and_disaster_program", oshProgramDetails.written_emergency_and_disaster_program);
        setValue("drills", oshProgramDetails.drills);
        
        // Solid Waste Management System Section
        setValue("written_pollution_control_program", oshProgramDetails.written_pollution_control_program);
        setValue("polution_control_officer", oshProgramDetails.polution_control_officer);
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

      // Handle boolean fields - preserve null values
      OSH_PROGRAM_FIELDS.BOOLEAN_FIELDS.forEach(field => {
        // Only set the value if it exists in oshProgramDetails
        if (field in oshProgramDetails) {
          setValue(field, oshProgramDetails[field]);
        } else {
          setValue(field, null);
        }
      });
    }
  }, [oshProgramDetails, setValue]);

  // Function to handle tab changes
  const handleTabChange = (tabIndex: TabNumber) => {
    // Clear any validation errors
    clearErrors();
    // Clear validation message and missing fields
    setValidationMessage("");
    setMissingFields([]);

    // Set the new tab
    setSelectedTab(tabIndex);
  };

  // Custom submit handler
  const submitCurrentTab = async () => {
    // Prevent multiple submissions
    if (isSaving) return;
    
    // Check if there are actual changes before submitting
    if (!hasUnsavedChanges()) {
      toast.custom(() => <CustomToast message="No changes detected. Nothing to save." type="info" />);
      return;
    }
    
    // First clear any existing validation messages
    setValidationMessage("");
    setMissingFields([]);

    // Set loading state
    setIsSaving(true);

    try {
      // Start the form submission
      await onSubmit();
      
      // Only show success toast if no error occurred
      toast.custom(() => <CustomToast message="Successfully updated OSH Program Details." type="success" />);
      
    } catch (error: any) {
      // Show error toast
      toast.custom(() => <CustomToast message={error.message || "Failed to update OSH Program Details"} type="error" />);
    } finally {
      // Reset loading state
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex p-4">
          <button 
            onClick={() => handleNavigation('/dole')} 
            className="flex-none flex gap-3 items-center hover:bg-gray-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <h4>DOLE</h4>
          </button>
        </div>

        <div className={`px-2 md:px-8 lg:px-4 sticky top-0 bg-white z-30 py-2 ${isScrolled ? 'border-b border-gray-200' : ''}`}>
          <h2 className="text-xl font-bold text-indigo-dye">OSH Program</h2>
          <div className="flex-1 flex justify-end space-x-4">
            <div className='relative inline-block'> 
              <select
                value={oshProgramDetails?.status || 'on-schedule'}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={!hasActiveSubscription}
                className={`px-4 py-3 rounded-lg text-sm font-bold ${getStatusColor(oshProgramDetails?.status || 'on-schedule')} border-0 focus:ring-0 disabled:opacity-50 appearance-none pr-8`}
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    style={{
                      backgroundColor: 'white',
                      color: '#111827'
                    }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                <SelectChevronDown />
              </div>
            </div>
            <button
              onClick={handlePrint}
              disabled={!hasActiveSubscription || isGenerating || !oshProgramDetails}
              title={isGenerating ? "Generating PDF..." : "Print Latest Version"}
              className="relative"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              ) : ( 
                <PrintIcon/>
              )}
            </button>
            <div className="relative flex items-center">
              <button
                onClick={handleOpenVersionHistory}
                disabled={!hasActiveSubscription}
                title="View Version History"
                className="relative"
              >
                <HistoryIcon className="w-10 h-10"/>
                {versionHistoryData?.version_info && (
                  <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center min-w-[16px]">
                    {versionHistoryData.version_info.current_count > 50 ? '50+' : versionHistoryData.version_info.current_count}
                  </div>
                )}
              </button>
            </div>
            <button
              className="bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50 flex items-center gap-2"
              onClick={submitCurrentTab}
              disabled={!hasActiveSubscription || isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                'Save'
              )}
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
            
        {/* Version Limit Warning */}
        {versionHistoryData?.version_info && (
          <>
            {!versionHistoryData.version_info.can_create_new && (
              <div className="mt-2 px-2 md:px-8 lg:px-4">
                <div className="rounded-md bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Version Limit Reached
                      </h3>
                      <div className="mt-1 text-sm text-red-700">
                        <p>
                          You&apos;ve reached the maximum limit of {versionHistoryData.version_info.max_limit} versions. 
                          Please delete some older versions before creating new ones.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {versionHistoryData.version_info.remaining_slots <= 5 && versionHistoryData.version_info.remaining_slots > 0 && (
              <div className="mt-2 px-2 md:px-8 lg:px-4">
                <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Approaching Version Limit
                      </h3>
                      <div className="mt-1 text-sm text-yellow-700">
                        <p>
                          You have {versionHistoryData.version_info.remaining_slots} version slots remaining. 
                          Consider deleting old versions to free up space.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
            
        <div className="mt-8">
          {/* Desktop tabs */}
          <div className="hidden md:flex flex-row justify-between space-x-2">
            <div onClick={() => handleTabChange(1 as TabNumber)} className="cursor-pointer">
              <h1 className={`text-lg font-bold pb-2 text-center cursor-pointer transition-all duration-200 hover:text-savoy-blue ${selectedTab === 1 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
                Company Profile
              </h1>
            </div>
            <div onClick={() => handleTabChange(2 as TabNumber)} className="cursor-pointer">
              <h1 className={`text-lg font-bold pb-2 text-center cursor-pointer transition-all duration-200 hover:text-savoy-blue ${selectedTab === 2 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
                OSH Program and Policy
              </h1>
            </div>
            <div onClick={() => handleTabChange(3 as TabNumber)} className="cursor-pointer">
              <h1 className={`text-lg font-bold pb-2 text-center cursor-pointer transition-all duration-200 hover:text-savoy-blue ${selectedTab === 3 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
                Risk Management
              </h1>
            </div>
            <div onClick={() => handleTabChange(4 as TabNumber)} className="cursor-pointer">
              <h1 className={`text-lg font-bold pb-2 text-center cursor-pointer transition-all duration-200 hover:text-savoy-blue ${selectedTab === 4 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
                Health and Welfare Program
              </h1>
            </div>
            <div onClick={() => handleTabChange(5 as TabNumber)} className="cursor-pointer">
              <h1 className={`text-lg font-bold pb-2 text-center cursor-pointer transition-all duration-200 hover:text-savoy-blue ${selectedTab === 5 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
                Safety Measures
              </h1>
            </div>
            <div onClick={() => handleTabChange(6 as TabNumber)} className="cursor-pointer">
              <h1 className={`text-lg font-bold pb-2 text-center cursor-pointer transition-all duration-200 hover:text-savoy-blue ${selectedTab === 6 ? "text-savoy-blue border-b-4 border-savoy-blue" : "text-gray-500"}`}>
                Compliance and Cost
              </h1>
            </div>
          </div>

          {/* Mobile tabs - horizontal scrollable */}
          <div className="md:hidden overflow-x-auto">
            <div className="flex space-x-4 min-w-max px-4">
              <div onClick={() => handleTabChange(1 as TabNumber)} className="cursor-pointer flex-shrink-0">
                <h1 className={`text-sm font-bold pb-2 text-center whitespace-nowrap ${selectedTab === 1 ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}>
                  Company Profile
                </h1>
              </div>
              <div onClick={() => handleTabChange(2 as TabNumber)} className="cursor-pointer flex-shrink-0">
                <h1 className={`text-sm font-bold pb-2 text-center whitespace-nowrap ${selectedTab === 2 ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}>
                  OSH Program
                </h1>
              </div>
              <div onClick={() => handleTabChange(3 as TabNumber)} className="cursor-pointer flex-shrink-0">
                <h1 className={`text-sm font-bold pb-2 text-center whitespace-nowrap ${selectedTab === 3 ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}>
                  Risk Management
                </h1>
              </div>
              <div onClick={() => handleTabChange(4 as TabNumber)} className="cursor-pointer flex-shrink-0">
                <h1 className={`text-sm font-bold pb-2 text-center whitespace-nowrap ${selectedTab === 4 ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}>
                  Health & Welfare
                </h1>
              </div>
              <div onClick={() => handleTabChange(5 as TabNumber)} className="cursor-pointer flex-shrink-0">
                <h1 className={`text-sm font-bold pb-2 text-center whitespace-nowrap ${selectedTab === 5 ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}>
                  Safety Measures
                </h1>
              </div>
              <div onClick={() => handleTabChange(6 as TabNumber)} className="cursor-pointer flex-shrink-0">
                <h1 className={`text-sm font-bold pb-2 text-center whitespace-nowrap ${selectedTab === 6 ? "text-savoy-blue border-b-2 border-savoy-blue" : "text-gray-500"}`}>
                  Compliance
                </h1>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className='flex justify-center items-center min-h-[400px]'>
            <div role='status' className='text-center'>
              <svg
                aria-hidden='true'
                className='inline w-20 h-20 text-gray-200 animate-spin fill-yellow-400'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {selectedTab === 1 && (
              <CompanyProfile
                control={control}
                register={register}
                errors={errors}
                validationMessage={validationMessage}
                watch={watch}
                setValue={setValue}
                missingFields={missingFields}
                cachedProfile={cachedProfile?.state?.data}
              />
            )}
            {selectedTab === 2 && (
              <ProgramAndPolicy
                control={control}
                register={register}
                setValue={setValue}
                watch={watch}
                validationMessage={validationMessage}
                missingFields={missingFields}
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
                missingFields={missingFields}
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
                missingFields={missingFields}
              />
            )}
          </>
        )}
      </div>

      {/* Unsaved Changes Modal */}
      {showUnsavedChangesModal && (
      <UnsavedChangesModal
        isOpen={showUnsavedChangesModal}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
        onDiscard={handleDiscardChanges}
        isLoading={isSavingChanges}
        currentTab={getCurrentTabName()}
      />
      )}

      {/* Version History Modal */}
      {isVersionHistoryModalOpen && (
        <VersionHistoryModal
          isOpen={isVersionHistoryModalOpen}
          onClose={handleCloseVersionHistory}
          onViewDetails={handleViewVersionDetails}
        />
      )}

      {/* Version History Details Modal */}
      {isVersionHistoryDetailsModalOpen && (
        <VersionHistoryDetailsModal
          isOpen={isVersionHistoryDetailsModalOpen}
          onClose={handleCloseVersionDetails}
          onBack={handleBackToVersionHistory}
          versionId={selectedVersionId || undefined}
        />
      )}
    </>
  );
}

export default Content;
