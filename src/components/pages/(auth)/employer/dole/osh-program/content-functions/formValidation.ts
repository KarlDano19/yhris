import { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { T_OshProgram, OSH_PROGRAM_TABS, OSH_PROGRAM_TAB_NUMBER } from '@/types/osh-program';

// Extended type for form data
type ExtendedOshProgram = Partial<T_OshProgram> & {
  id?: string;
  [key: string]: any;
};

// Function to validate required fields for the current tab
export const validateCurrentTabFields = (
  watch: UseFormWatch<ExtendedOshProgram>,
  selectedTab: number,
  setMissingFields: (fields: string[]) => void,
  setValidationMessage: (message: string) => void
): void => {
  const formValues = watch();
  const requiredFields = OSH_PROGRAM_TABS.REQUIRED_FIELDS[selectedTab as OSH_PROGRAM_TAB_NUMBER] || [];
  
  // Only validate if there are required fields for this tab
  if (requiredFields.length > 0) {
    const missingFields = requiredFields.filter((field: keyof T_OshProgram) => {
      const value = formValues[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      // Store missing fields for UI highlighting
      setMissingFields(missingFields as string[]);
      setValidationMessage(`Please fill out all required fields marked with *`);
    } else {
      // Clear validation if all required fields are filled
      setMissingFields([]);
      setValidationMessage("");
    }
  } else {
    // Clear validation for tabs with no required fields (Risk Management, Safety Measures)
    setMissingFields([]);
    setValidationMessage("");
  }
};

// Check if there are unsaved changes in the current tab
export const hasUnsavedChanges = (
  watch: UseFormWatch<ExtendedOshProgram>,
  selectedTab: number,
  originalData: T_OshProgram | undefined
): boolean => {
  const formValues = watch();
  
  if (!originalData) return false;
  
  // Get fields for the current tab only
  const currentTabFields = OSH_PROGRAM_TABS.FIELDS[selectedTab as OSH_PROGRAM_TAB_NUMBER] || [];
  
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

// Auto-clear validation when user starts filling required fields
export const autoClearValidation = (
  watch: UseFormWatch<ExtendedOshProgram>,
  validationMessage: string,
  missingFields: string[],
  setValidationMessage: (message: string) => void,
  setMissingFields: (fields: string[]) => void
): void => {
  if (validationMessage && missingFields.length > 0) {
    const formValues = watch();
    const stillMissing = missingFields.filter(field => {
      const value = formValues[field];
      return value === undefined || value === null || value === '';
    });

    if (stillMissing.length === 0) {
      setValidationMessage("");
      setMissingFields([]);
    } else if (stillMissing.length < missingFields.length) {
      setMissingFields(stillMissing);
    }
  }
};

// Validate form submission data
export const validateFormSubmission = (
  data: ExtendedOshProgram,
  selectedTab: number,
  setMissingFields: (fields: string[]) => void,
  setValidationMessage: (message: string) => void
): boolean => {
  const requiredFields = OSH_PROGRAM_TABS.REQUIRED_FIELDS[selectedTab as OSH_PROGRAM_TAB_NUMBER] || [];
  
  // Only validate if there are required fields for this tab
  if (requiredFields.length > 0) {
    const missingFields = requiredFields.filter((field: keyof T_OshProgram) => !data[field]);

    if (missingFields.length > 0) {
      // Store missing fields for UI highlighting
      setMissingFields(missingFields as string[]);
      setValidationMessage(`Please fill out all required fields marked with *`);
      return false;
    }
  }

  // Clear missing fields if validation passes
  setMissingFields([]);
  setValidationMessage("");
  return true;
};
