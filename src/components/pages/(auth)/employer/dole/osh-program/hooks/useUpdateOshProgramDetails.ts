import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { 
  OSH_PROGRAM_FIELD_MAPPINGS, 
  OSH_PROGRAM_ALL_BOOLEAN_FIELDS, 
  OSH_PROGRAM_FILE_FIELDS,
  OSH_PROGRAM_DATE_FIELDS,
  T_OshProgram 
} from "@/types/osh-program";

type OshProgramData = Partial<T_OshProgram> & { 
  id?: string;
  [key: string]: any;
};

// Utility functions
function isFile(value: any): value is File {
  return value instanceof File;
}

function ensureString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

async function updateOshProgramDetails(data: OshProgramData) {
  try {
    // Get authentication token
    const token = getCookie("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Create a clean copy of the data
    const cleanData = { ...data };
    
    // Preprocess data
    applyFieldMappings(cleanData);
    formatDateFields(cleanData);
    handleBooleanFields(cleanData);

    // Create and populate FormData
    const formData = new FormData();
    console.log('Preparing form data for submission:', cleanData);
    populateFormData(formData, cleanData);

    // Send request and handle response
    const response = await fetchOshProgram(token as string, formData);
    return processResponse(response);
  } catch (error: any) {
    throw error;
  }
}

// Helper function to apply field mappings (fix case sensitivity issues)
function applyFieldMappings(data: OshProgramData) {
  for (const [capitalizedKey, lowercaseKey] of Object.entries(OSH_PROGRAM_FIELD_MAPPINGS)) {
    if (capitalizedKey in data && !(lowercaseKey in data)) {
      data[lowercaseKey] = data[capitalizedKey];
      delete data[capitalizedKey];
    }
  }
}

// Helper function to format date fields
function formatDateFields(data: OshProgramData) {
  for (const field of OSH_PROGRAM_DATE_FIELDS) {
    if (data[field]) {
      const dateObj = new Date(data[field]);
      if (!isNaN(dateObj.getTime())) {
        data[field] = dateObj.toISOString().split('T')[0];
      }
    }
  }
}

// Helper function to handle boolean fields
function handleBooleanFields(data: OshProgramData) {
  for (const field of OSH_PROGRAM_ALL_BOOLEAN_FIELDS) {
    // Skip if field is not in data
    if (!(field in data)) continue;
    
    const value = data[field];
    
    // Handle null or empty string values
    if (value === null || value === '') {
      data[field] = null;
      continue;
    }
    
    // Handle string values
    if (typeof value === 'string') {
      const strValue = value.toLowerCase();
      // Use type assertion to avoid type error
      if (strValue === 'true') {
        data[field] = true as any;
      } else if (strValue === 'false') {
        data[field] = false as any;
      } else {
        data[field] = null;
      }
      continue;
    }
    
    // If it's already a boolean, keep it
    if (typeof value === 'boolean') {
      continue;
    }
    
    // For any other type, set to null
    data[field] = null;
  }
}

// Helper function to populate FormData with all field types
function populateFormData(formData: FormData, data: OshProgramData) {
  for (const key in data) {
    // Handle file objects directly
    if (isFile(data[key])) {
      addFileToFormData(formData, key, data[key], data);
      continue;
    }
    
    // Handle FileList objects (from file inputs)
    if (data[key] && data[key] instanceof FileList && data[key].length > 0) {
      console.log(`Processing FileList for ${key}:`, data[key]);
      addFileToFormData(formData, key, data[key][0], data);
      continue;
    }
    
    // Handle file fields (strings that might be file paths)
    if (OSH_PROGRAM_FILE_FIELDS.includes(key)) {
      handleFileField(formData, key, data[key], data);
      continue;
    }
    
    // Skip previous file fields - they're handled with their corresponding file
    if (key.startsWith('previous_')) continue;
    
    // Handle JSON fields
    const jsonFields = ['drills', 'emergency_and_disaster_preparedness', 'health_personnel', 
                        'health_training', 'ppe', 'reported_incidents', 'risk_assessment', 
                        'safety_meeting', 'safety_officer', 'business_description'];
    if (jsonFields.includes(key) && data[key]) {
      addJsonToFormData(formData, key, data[key]);
      continue;
    }
    
    // Handle array fields
    const arrayFields = ['routine_medical_surveillance', 'schedule_of_annual_medical_examination', 
                         'special_medical_surveillance'];
    if (arrayFields.includes(key) && data[key]) {
      addArrayToFormData(formData, key, data[key]);
      continue;
    }
    
    // Handle boolean fields
    if (OSH_PROGRAM_ALL_BOOLEAN_FIELDS.includes(key)) {
      formData.append(key, data[key] === null ? 'null' : String(data[key]));
      continue;
    }
    
    // Add other primitive values
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, String(data[key]));
    }
  }
}

// Helper function for adding a file to FormData
function addFileToFormData(formData: FormData, key: string, file: File, data: OshProgramData) {
  console.log(`Adding file for ${key}:`, file);
  formData.append(key, file);
  
  // Add previous file information if available
  const previousKey = `previous_${key}`;
  if (data[previousKey]) {
    formData.append(previousKey, String(data[previousKey]));
  }
}

// Helper function for handling file fields
function handleFileField(formData: FormData, key: string, value: any, data: OshProgramData) {
  console.log(`Processing file field: ${key}`, value);
  
  // Skip if no value or null/undefined strings
  if (!value || value === 'null' || value === 'undefined') return;
  
  // Handle File objects
  if (isFile(value)) {
    addFileToFormData(formData, key, value, data);
    return;
  }
  
  // Handle base64 data URLs
  if (typeof value === 'string' && value.startsWith('data:')) {
    handleBase64File(formData, key, value, data);
    return;
  }
  
  // Handle string file paths
  if (typeof value === 'string' && value.trim() !== '') {
    console.log(`Adding string file path for ${key}:`, value);
    formData.append(key, value);
  }
}

// Helper function for handling base64 encoded files
async function handleBase64File(formData: FormData, key: string, value: string, data: OshProgramData) {
  console.log(`Processing base64 data for ${key}`);
  try {
    const response = await fetch(value);
    const blob = await response.blob();
    formData.append(key, blob, `${key}.png`);
    
    // Add previous file information
    const previousKey = `previous_${key}`;
    if (data[previousKey]) {
      formData.append(previousKey, String(data[previousKey]));
    }
  } catch (error) {
    console.error(`Error processing base64 data for ${key}:`, error);
    formData.append(key, value);
  }
}

// Helper function for adding JSON data to FormData
function addJsonToFormData(formData: FormData, key: string, value: any) {
  if (typeof value === 'object') {
    formData.append(key, JSON.stringify(value));
  } else if (typeof value === 'string') {
    try {
      const jsonValue = JSON.parse(value);
      formData.append(key, JSON.stringify(jsonValue));
    } catch (e) {
      formData.append(key, JSON.stringify({}));
    }
  } else {
    formData.append(key, JSON.stringify({}));
  }
}

// Helper function for adding array data to FormData
function addArrayToFormData(formData: FormData, key: string, value: any) {
  let fieldValue = value;
  try {
    // Parse string to JSON if needed
    if (typeof fieldValue === 'string') {
      fieldValue = JSON.parse(fieldValue);
    }
    
    // Ensure it's an array
    if (!Array.isArray(fieldValue)) {
      fieldValue = [fieldValue];
    }
    
    // Convert to JSON string
    formData.append(key, JSON.stringify(fieldValue));
  } catch (e) {
    // Fallback for parsing errors
    const arrayValue = typeof fieldValue === 'string' 
      ? fieldValue.split(',').map(item => item.trim())
      : [fieldValue];
    formData.append(key, JSON.stringify(arrayValue));
  }
}

// Helper function to send the API request
async function fetchOshProgram(token: string, formData: FormData) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/`,
    {
      method: "PATCH",
      headers: {
        "Authorization": `Token ${token}`
      },
      body: formData,
    }
  );
  
  console.log('Server response status:', response.status);
  return response;
}

// Helper function to process the API response
async function processResponse(response: Response) {
  if (response.status === 401) {
    throw new Error("Authentication failed. Please log in again.");
  }

  if (!response.ok) {
    return handleErrorResponse(response);
  }

  try {
    const data = await response.json();
    console.log('Server success response:', data);
    return data;
  } catch (e) {
    // If we can't parse but status was ok, still consider success
    console.log('Response received but not parsed as JSON');
    return { message: "OSH Program updated successfully" };
  }
}

// Helper function to handle error responses
async function handleErrorResponse(response: Response) {
  try {
    const errorData = await response.json();
    console.error('Server error response:', errorData);
    throw new Error(
      errorData.message || 
      errorData.error || 
      errorData.detail || 
      'An error occurred while updating OSH Program'
    );
  } catch (e) {
    console.error('Error parsing server error response:', e);
    throw new Error(response.statusText || 'An error occurred while updating OSH Program');
  }
}

// Hook for using the mutation
function useUpdateOshProgramDetails() {
  return useMutation({
    mutationFn: updateOshProgramDetails
  });
}

export default useUpdateOshProgramDetails;

