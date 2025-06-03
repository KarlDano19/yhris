import { 
  OSH_PROGRAM_FIELDS,
  T_OshProgram 
} from "@/types/osh-program";

export type OshProgramData = Partial<T_OshProgram> & { 
  id?: string;
  [key: string]: any;
};

// Helper function to apply field mappings (fix case sensitivity issues)
export function applyFieldMappings(data: OshProgramData): void {
  for (const [key, value] of Object.entries(OSH_PROGRAM_FIELDS.FIELD_MAPPINGS)) {
    if (key in data) {
      data[value as string] = data[key];
      delete data[key];
    }
  }
}

// Helper function to format date fields
export function formatDateFields(data: OshProgramData): void {
  OSH_PROGRAM_FIELDS.DATE_FIELDS.forEach(field => {
    if (field in data && data[field]) {
      if (data[field] instanceof Date) {
        data[field] = data[field].toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }
    }
  });
}

// Helper function to handle boolean fields
export function handleBooleanFields(data: OshProgramData): void {
  OSH_PROGRAM_FIELDS.BOOLEAN_FIELDS.forEach(field => {
    if (field in data) {
      // Convert string 'true'/'false' to boolean
      if (data[field] === 'true') data[field] = true;
      else if (data[field] === 'false') data[field] = false;
    }
  });
}

// Helper function to populate FormData with all field types
export function populateFormData(formData: FormData, data: OshProgramData): void {
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;

    // Handle files directly
    if (value instanceof File) {
      formData.append(key, value);
      continue;
    }

    // Handle arrays of objects (safety_officers and health_personnel)
    if (Array.isArray(value) && key === 'safety_officers') {
      // Add each safety officer with a unique ID
      formData.append('safety_officers', JSON.stringify(
        value.map(officer => ({
          id: officer.id || `new_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          name: officer.name,
          training_and_hours: officer.training_and_hours
        }))
      ));
      
      // Append certificate files with array indices and IDs
      value.forEach((officer, index) => {
        if (officer.certificate instanceof File) {
          // Use the officer's ID or index as identifier for file field name
          const fileKey = `certificate_${officer.id || index}`;
          formData.append(fileKey, officer.certificate);
        }
      });
      continue;
    }

    if (Array.isArray(value) && key === 'health_personnel') {
      // Add each health personnel with a unique ID
      formData.append('health_personnel', JSON.stringify(
        value.map(personnel => ({
          id: personnel.id || `new_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          shift_area_department: personnel.shift_area_department,
          total_workers: personnel.total_workers,
          health_personnel_name: personnel.health_personnel_name,
          facilities: personnel.facilities
        }))
      ));
      
      // Append attachment files with array indices and IDs
      value.forEach((personnel, index) => {
        if (personnel.attachment instanceof File) {
          // Use the personnel's ID or index as identifier for file field name
          const fileKey = `attachment_${personnel.id || index}`;
          formData.append(fileKey, personnel.attachment);
        }
      });
      continue;
    }

    // Handle other JSON fields
    if (OSH_PROGRAM_FIELDS.JSON_FIELDS.includes(key) && value !== null) {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
      continue;
    }

    // Handle regular fields
    formData.append(key, value.toString());
  }
}

// Handle error response
export async function handleErrorResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const errorData = await response.json();
    throw new Error(errorData.detail || errorData.message || "Error updating OSH Program");
  } else {
    const errorText = await response.text();
    throw new Error(errorText || "Error updating OSH Program");
  }
}