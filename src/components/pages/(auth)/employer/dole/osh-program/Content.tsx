"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";

import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

import LoadingSpinner from "@/components/LoadingSpinner";
import CustomToast from "@/components/CustomToast";
import VersionHistoryModal from "./modals/VersionHistoryModal";
import VersionHistoryDetailsModal from "./modals/VersionHistoryDetailsModal";
import ChangesDetailsModal from "./modals/ChangesDetailsModal";
import UnsavedChangesModal from "./modals/UnsavedChangesModal";
import useFileforge from "./hooks/useFileforge";
import useGetOshProgramDetails from "./hooks/useGetOshProgramDetails";
import useUpdateOshProgramDetails from "./hooks/useUpdateOshProgramDetails";
import useGetOshProgramVersionHistory from "./hooks/useGetOshProgramVersionHistory";
import CompanyProfile from "./tabs/CompanyProfile";
import ProgramAndPolicy from "./tabs/ProgramAndPolicy";
import RiskManagement from "./tabs/RiskManagement";
import SafetyMeasures from "./tabs/SafetyMeasures";
import ComplianceAndCost from "./tabs/ComplianceAndCost";
import HealthAndWelfare from "./tabs/HealthAndWelfare";

import { getRelevantPagesFromChanges } from "./content-functions/pageRelevance";
import { 
  validateCurrentTabFields, 
  hasUnsavedChanges, 
  autoClearValidation, 
  validateFormSubmission 
} from "./content-functions/formValidation";
import { initializeFormValues } from "./content-functions/formInitialization";
import { processFormData } from "./content-functions/formProcessing";
import { printOshProgram } from "./PrintData";

import PrintIcon from "@/svg/PrintIcon";
import HistoryIcon from "@/svg/HistoryIcon";
import SelectChevronDown from "@/svg/SelectChevronDown";

import { 
  T_OshProgram, 
  OSH_PROGRAM_TAB_NUMBER as TabNumber, 
  OSH_PROGRAM_TABS
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
  
  // Changes Details Modal States
  const [isChangesDetailsModalOpen, setIsChangesDetailsModalOpen] = useState(false);
  const [selectedVersionChanges, setSelectedVersionChanges] = useState<{ versionNumber: string; changes: string; versionId?: number } | null>(null);
  
  // Track navigation source for auto-scroll
  const [isNavigatingFromChanges, setIsNavigatingFromChanges] = useState(false);
  
  const queryClient = useQueryClient();
  const router = useRouter();
  
  // Get cached profile data for auto-filling company information
  const cachedProfile = queryClient
    .getQueryCache()
    .find(["employerProfileCache"]) as {
    state: { data: { name: string; mobile_number: string; building: string; street: string; locality: string; city: string; country: string; zip_code: string } } | undefined;
  };
  
  // Only fetch once on initial mount, then rely on manual refetch
  const { data: oshProgramDetails, refetch, isLoading } = useGetOshProgramDetails(true);
  const { mutateAsync: updateOshProgramDetails } = useUpdateOshProgramDetails();
  
  // ============================================================================
  // HOOKS AND DATA FETCHING
  // ============================================================================
  
  // Get version history for limit checking
  const { data: versionHistoryData, refetch: refetchVersionHistory } = useGetOshProgramVersionHistory({
    pageSize: 1,
    currentPage: 1
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

  // ============================================================================
  // EFFECTS AND LIFECYCLE
  // ============================================================================
  
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
  
  // Clear validation when component mounts and when form data is loaded
  useEffect(() => {
    if (oshProgramDetails) {
      // Clear any existing validation messages
      setValidationMessage("");
      setMissingFields([]);
    }
  }, [oshProgramDetails, selectedTab]);

  // Auto-clear validation when user starts filling required fields
  useEffect(() => {
    autoClearValidation(watch, validationMessage, missingFields, setValidationMessage, setMissingFields);
  }, [validationMessage, missingFields, watch]);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-600';
  };

  // Shared tab names mapping
  const tabNames = {
    1: 'Company Profile',
    2: 'OSH Program and Policy',
    3: 'Risk Management',
    4: 'Health and Welfare Program',
    5: 'Safety Measures',
    6: 'Compliance and Cost'
  };

  const getCurrentTabName = (): string => {
    return tabNames[selectedTab] || 'current tab';
  };

  const getTargetTabName = (): string => {
    if (pendingNavigation && pendingNavigation.startsWith('tab-')) {
      const targetTab = parseInt(pendingNavigation.replace('tab-', '')) as TabNumber;
      return tabNames[targetTab] || 'target tab';
    }
    
    return '';
  };

  // Function to validate required fields for the current tab
  const validateCurrentTabFieldsCallback = useCallback(() => {
    validateCurrentTabFields(watch, selectedTab, setMissingFields, setValidationMessage);
  }, [watch, selectedTab]);

  // ============================================================================
  // CONSTANTS AND CONFIGURATION
  // ============================================================================

  const statusOptions = [
    { value: 'on-schedule', label: 'On Schedule', color: 'bg-purple-100 text-purple-700' },
    { value: 'for-submission', label: 'For Submission', color: 'bg-blue-100 text-blue-700' },
    { value: 'for-review', label: 'For Review', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-700' },
  ];

  // ============================================================================
  // STATUS AND PRINT HANDLERS
  // ============================================================================

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

  // ============================================================================
  // VERSION HISTORY MODAL HANDLERS
  // ============================================================================
  
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
    setIsNavigatingFromChanges(false); // Reset flag when navigating directly from eye icon
    setIsVersionHistoryModalOpen(false);
    setIsVersionHistoryDetailsModalOpen(true);
  };

  const handleCloseVersionDetails = () => {
    setIsVersionHistoryDetailsModalOpen(false);
    setIsNavigatingFromChanges(false); // Reset flag when closing
  };

  const handleBackToVersionHistory = () => {
    setIsVersionHistoryDetailsModalOpen(false);
    setIsNavigatingFromChanges(false); // Reset flag when going back
    setIsVersionHistoryModalOpen(true);
  };

  // ============================================================================
  // CHANGES DETAILS MODAL HANDLERS
  // ============================================================================
  
  const handleViewChanges = (versionNumber: string, changes: string, versionId?: number) => {
    setSelectedVersionChanges({ versionNumber, changes, versionId });
    setIsChangesDetailsModalOpen(true);
  };

  const handleCloseChangesDetails = () => {
    setIsChangesDetailsModalOpen(false);
    setIsVersionHistoryModalOpen(true);
  };

  const handleViewDetailsFromChanges = () => {
    if (selectedVersionChanges?.versionId) {
      setSelectedVersionId(selectedVersionChanges.versionId);
      setIsNavigatingFromChanges(true); // Set flag when navigating from changes modal
      setIsChangesDetailsModalOpen(false);
      setIsVersionHistoryDetailsModalOpen(true);
    }
  };

  // ============================================================================
  // FORM SUBMISSION FUNCTIONS
  // ============================================================================

  // Submit the processed data to the server (API layer)
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

  // Form validation and processing handler (Form layer)
  const onSubmit = handleSubmit(async (data: ExtendedOshProgram) => {
    // Validate required fields
    if (!validateFormSubmission(data, selectedTab, setMissingFields, setValidationMessage)) {
      // Throw an error to prevent submission and show error toast
      throw new Error("Please fill out all required fields marked with *");
    }

    // Process form data
    const processedData = processFormData(data, selectedTab, oshProgramDetails, watch);

    // Submit data to server
    await submitDataToServer(processedData);
  });
  
  // Main submit handler (UI layer) - handles user interactions and state management
  const submitCurrentTab = async () => {
    // Prevent multiple submissions
    if (isSaving) return;
    
    // Check if there are actual changes before submitting
    if (!hasUnsavedChangesCallback()) {
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

  // ============================================================================
  // CHANGE DETECTION AND NAVIGATION
  // ============================================================================

  // Check if there are unsaved changes in the current tab
  const hasUnsavedChangesCallback = useCallback((): boolean => {
    return hasUnsavedChanges(watch, selectedTab, oshProgramDetails);
  }, [watch, selectedTab, oshProgramDetails]);

  // ============================================================================
  // BROWSER NAVIGATION HANDLING
  // ============================================================================

  // Handle browser back button and beforeunload events
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChangesCallback()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChangesCallback()) {
        e.preventDefault();
        // Show browser's default warning by triggering beforeunload
        const beforeUnloadEvent = new Event('beforeunload');
        window.dispatchEvent(beforeUnloadEvent);
        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.href);
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Push initial state to enable popstate detection
    window.history.pushState(null, '', window.location.href);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChangesCallback]);

  // Handle navigation with unsaved changes check
  const handleNavigation = (url: string) => {
    if (hasUnsavedChangesCallback()) {
      setPendingNavigation(url);
      setShowUnsavedChangesModal(true);
    } else {
      router.push(url);
    }
  };

  // ============================================================================
  // UNSAVED CHANGES MODAL HANDLERS
  // ============================================================================

  // Handle save changes from modal
  const handleSaveChanges = async () => {
    setIsSavingChanges(true);
    try {
      await submitCurrentTab();
      setShowUnsavedChangesModal(false);
      if (pendingNavigation) {
        handlePendingNavigation();
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
      handlePendingNavigation();
    }
  };

  // Handle pending navigation after save/discard
  const handlePendingNavigation = () => {
    if (!pendingNavigation) return;

    if (pendingNavigation.startsWith('tab-')) {
      // Handle tab navigation
      const tabIndex = parseInt(pendingNavigation.replace('tab-', '')) as TabNumber;
      performTabChange(tabIndex);
    } else {
      // Handle route navigation
      router.push(pendingNavigation);
    }
    
    // Clear pending navigation
    setPendingNavigation(null);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowUnsavedChangesModal(false);
    setPendingNavigation(null);
  };

  // ============================================================================
  // SUBMISSION HANDLERS
  // ============================================================================

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
    initializeFormValues(
      oshProgramDetails,
      setValue,
      cachedProfile,
      setSafetySignageUrl,
      setSafetySignageAttachmentExist
    );
    
    // Auto-validate required fields after form initialization
    if (oshProgramDetails) {
      setTimeout(() => {
        validateCurrentTabFieldsCallback();
      }, 200);
    }
  }, [oshProgramDetails, setValue, cachedProfile, validateCurrentTabFieldsCallback]);

  // ============================================================================
  // TAB AND UI HANDLERS
  // ============================================================================

  // Function to handle tab changes
  const handleTabChange = (tabIndex: TabNumber) => {
    // Check if there are unsaved changes in the current tab
    if (hasUnsavedChangesCallback()) {
      // Store the target tab for navigation after saving/discarding
      setPendingNavigation(`tab-${tabIndex}`);
      setShowUnsavedChangesModal(true);
      return;
    }

    // If no unsaved changes, proceed with tab change
    performTabChange(tabIndex);
  };

  // Function to actually perform the tab change
  const performTabChange = (tabIndex: TabNumber) => {
    // Clear any validation errors
    clearErrors();
    // Clear validation message and missing fields
    setValidationMessage("");
    setMissingFields([]);

    // Set the new tab
    setSelectedTab(tabIndex);
    
    // Check if the new tab has required fields
    const requiredFields = OSH_PROGRAM_TABS.REQUIRED_FIELDS[tabIndex] || [];
    
    // Only validate if there are required fields for this tab
    if (requiredFields.length > 0) {
      // Auto-validate required fields for the new tab after a short delay
      setTimeout(() => {
        validateCurrentTabFieldsCallback();
      }, 100);
    }
    // If no required fields, validation is already cleared above
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
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
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
            <LoadingSpinner size="2xl" color="yellow" />
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
        isNavigatingToTab={pendingNavigation?.startsWith('tab-') || false}
        targetTab={getTargetTabName()}
      />
      )}

      {/* Version History Modal */}
      {isVersionHistoryModalOpen && (
        <VersionHistoryModal
          isOpen={isVersionHistoryModalOpen}
          onClose={handleCloseVersionHistory}
          onViewDetails={handleViewVersionDetails}
          onViewChanges={handleViewChanges}
        />
      )}

      {/* Version History Details Modal */}
      {isVersionHistoryDetailsModalOpen && (
        <VersionHistoryDetailsModal
          isOpen={isVersionHistoryDetailsModalOpen}
          onClose={handleCloseVersionDetails}
          onBack={handleBackToVersionHistory}
          versionId={selectedVersionId || undefined}
          scrollToPage={isNavigatingFromChanges && selectedVersionChanges?.changes ? getRelevantPagesFromChanges(selectedVersionChanges.changes)[0] : undefined}
          relevantPages={isNavigatingFromChanges && selectedVersionChanges?.changes ? getRelevantPagesFromChanges(selectedVersionChanges.changes) : []}
        />
      )}

              {/* Changes Details Modal */}
        {isChangesDetailsModalOpen && (
          <ChangesDetailsModal
            isOpen={isChangesDetailsModalOpen}
            onClose={handleCloseChangesDetails}
            onViewDetails={selectedVersionChanges?.versionId ? handleViewDetailsFromChanges : undefined}
            versionNumber={selectedVersionChanges?.versionNumber || ''}
            changes={selectedVersionChanges?.changes || ''}
          />
        )}
    </>
  );
}

export default Content;
