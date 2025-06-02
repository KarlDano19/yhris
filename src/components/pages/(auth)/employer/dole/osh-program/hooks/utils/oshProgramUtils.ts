import { 
  OSH_PROGRAM_FIELD_MAPPINGS, 
  OSH_PROGRAM_ALL_BOOLEAN_FIELDS, 
  OSH_PROGRAM_FILE_FIELDS,
  OSH_PROGRAM_DATE_FIELDS,
  OSH_PROGRAM_JSON_FIELDS,
  T_OshProgram 
} from "@/types/osh-program";

export type OshProgramData = Partial<T_OshProgram> & { 
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

// Helper function to apply field mappings (fix case sensitivity issues)
export function applyFieldMappings(data: OshProgramData) {
  for (const [capitalizedKey, lowercaseKey] of Object.entries(OSH_PROGRAM_FIELD_MAPPINGS)) {
    if (capitalizedKey in data && !(lowercaseKey in data)) {
      data[lowercaseKey] = data[capitalizedKey];
      delete data[capitalizedKey];
    }
  }
}

// Helper function to format date fields
export function formatDateFields(data: OshProgramData) {
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
export function handleBooleanFields(data: OshProgramData) {
  for (const field of OSH_PROGRAM_ALL_BOOLEAN_FIELDS) {
    if (!(field in data)) continue;
    
    const value = data[field];
    
    if (value === null || value === '') {
      data[field] = null;
      continue;
    }
    
    if (typeof value === 'string') {
      const strValue = value.toLowerCase();
      if (strValue === 'true') {
        data[field] = true as any;
      } else if (strValue === 'false') {
        data[field] = false as any;
      } else {
        data[field] = null;
      }
      continue;
    }
    
    if (typeof value === 'boolean') {
      continue;
    }
    
    data[field] = null;
  }
}

// Helper function to populate FormData with all field types
export function populateFormData(formData: FormData, data: OshProgramData) {
  for (const key in data) {
    if (isFile(data[key])) {
      addFileToFormData(formData, key, data[key], data);
      continue;
    }
    
    if (data[key] && data[key] instanceof FileList && data[key].length > 0) {
      addFileToFormData(formData, key, data[key][0], data);
      continue;
    }
    
    if (OSH_PROGRAM_FILE_FIELDS.includes(key)) {
      handleFileField(formData, key, data[key], data);
      continue;
    }
    
    if (key.startsWith('previous_')) continue;
    
    if (OSH_PROGRAM_JSON_FIELDS.includes(key) && data[key]) {
      addJsonToFormData(formData, key, data[key]);
      continue;
    }
    
    if (OSH_PROGRAM_ALL_BOOLEAN_FIELDS.includes(key)) {
      formData.append(key, data[key] === null ? 'null' : String(data[key]));
      continue;
    }
    
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, String(data[key]));
    }
  }
}

// Helper function for adding a file to FormData
function addFileToFormData(formData: FormData, key: string, file: File, data: OshProgramData) {
  formData.append(key, file);
  
  const previousKey = `previous_${key}`;
  if (data[previousKey]) {
    formData.append(previousKey, String(data[previousKey]));
  }
}

// Helper function for handling file fields
function handleFileField(formData: FormData, key: string, value: any, data: OshProgramData) {
  if (!value || value === 'null' || value === 'undefined') return;
  
  if (isFile(value)) {
    addFileToFormData(formData, key, value, data);
    return;
  }
  
  if (typeof value === 'string' && value.startsWith('data:')) {
    handleBase64File(formData, key, value, data);
    return;
  }
  
  if (typeof value === 'string' && value.trim() !== '') {
    formData.append(key, value);
  }
}

// Helper function for handling base64 encoded files
async function handleBase64File(formData: FormData, key: string, value: string, data: OshProgramData) {
  try {
    const response = await fetch(value);
    const blob = await response.blob();
    formData.append(key, blob, `${key}.png`);
    
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

// Helper function to process API responses
export async function handleErrorResponse(response: Response) {
  try {
    const errorData = await response.json();
    throw new Error(
      errorData.message || 
      errorData.error || 
      errorData.detail || 
      'An error occurred while updating OSH Program'
    );
  } catch (e) {
    throw new Error(response.statusText || 'An error occurred while updating OSH Program');
  }
} 