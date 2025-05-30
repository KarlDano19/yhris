import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { 
  OSH_PROGRAM_FIELD_MAPPINGS, 
  OSH_PROGRAM_ALL_BOOLEAN_FIELDS, 
  OSH_PROGRAM_FILE_FIELDS,
  OSH_PROGRAM_DATE_FIELDS,
  T_OshProgram 
} from "@/types/osh-program";

type OshProgramData = Partial<T_OshProgram> & { id?: string } & {
  [key: string]: any;  // Add index signature for dynamic access
};

function isFile(value: any): value is File {
  return value instanceof File;
}

async function updateOshProgramDetails(data: OshProgramData) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Authentication token not found");
        }

        const cleanData = { ...data };

        // Apply case sensitivity fixes
        for (const [capitalizedKey, lowercaseKey] of Object.entries(OSH_PROGRAM_FIELD_MAPPINGS)) {
            if (capitalizedKey in cleanData && !(lowercaseKey in cleanData)) {
                cleanData[lowercaseKey] = cleanData[capitalizedKey];
                delete cleanData[capitalizedKey];
            }
        }

        // Handle date formatting
        for (const field of OSH_PROGRAM_DATE_FIELDS) {
            if (cleanData[field]) {
                const dateObj = new Date(cleanData[field]);
                if (!isNaN(dateObj.getTime())) {
                    cleanData[field] = dateObj.toISOString().split('T')[0];
                }
            }
        }

        // Handle all boolean fields
        for (const field of OSH_PROGRAM_ALL_BOOLEAN_FIELDS) {
            // If the field is not in the data at all, don't include it in the update
            if (!(field in cleanData)) {
                continue;
            }
            
            // If the field is in the data but is null/empty string, keep it as null
            if (cleanData[field] === null || cleanData[field] === '') {
                cleanData[field] = null;
            } else if (typeof cleanData[field] === 'string') {
                // Only convert explicit 'true' or 'false' strings
                const value = cleanData[field].toLowerCase();
                if (value === 'true') {
                    cleanData[field] = true;
                } else if (value === 'false') {
                    cleanData[field] = false;
                } else {
                    // If it's any other string value, treat it as null
                    cleanData[field] = null;
                }
            } else if (typeof cleanData[field] === 'boolean') {
                // Keep boolean values as is
                cleanData[field] = cleanData[field];
            } else {
                // For any other type of value, set to null
                cleanData[field] = null;
            }
        }

        // Use FormData for all requests since we have file uploads in the forms
        const formData = new FormData();
        
        console.log('Preparing form data for submission:', cleanData);
        
        // Add all fields to FormData
        for (const key in cleanData) {
            if (isFile(cleanData[key])) {
                // Add files directly
                console.log(`Adding file directly: ${key}`, cleanData[key]);
                formData.append(key, cleanData[key]);
                
                // Add previous file information if available
                const previousKey = `previous_${key}`;
                if (cleanData[previousKey]) {
                    formData.append(previousKey, cleanData[previousKey]);
                }
            } else if (cleanData[key] && cleanData[key] instanceof FileList) {
                // Handle FileList objects (from file inputs)
                console.log(`Processing FileList for ${key}:`, cleanData[key]);
                if (cleanData[key].length > 0) {
                    console.log(`Adding file from FileList: ${key}`, cleanData[key][0]);
                    formData.append(key, cleanData[key][0]);
                    
                    // Add previous file information if available
                    const previousKey = `previous_${key}`;
                    if (cleanData[previousKey]) {
                        formData.append(previousKey, cleanData[previousKey]);
                    }
                }
            } else if (OSH_PROGRAM_FILE_FIELDS.includes(key)) {
                // Only append file fields if they exist and are not null/undefined
                console.log(`Processing file field: ${key}`, cleanData[key]);
                if (cleanData[key] && cleanData[key] !== 'null' && cleanData[key] !== 'undefined') {
                    if (isFile(cleanData[key])) {
                        console.log(`Adding file for ${key}:`, cleanData[key]);
                        formData.append(key, cleanData[key]);
                        
                        // Add previous file information
                        const previousKey = `previous_${key}`;
                        if (cleanData[previousKey]) {
                            formData.append(previousKey, cleanData[previousKey]);
                        }
                    } else if (typeof cleanData[key] === 'string' && cleanData[key].startsWith('data:')) {
                        // Handle base64 data URL
                        console.log(`Processing base64 data for ${key}`);
                        try {
                            const response = await fetch(cleanData[key]);
                            const blob = await response.blob();
                            formData.append(key, blob, `${key}.png`);
                            
                            // Add previous file information
                            const previousKey = `previous_${key}`;
                            if (cleanData[previousKey]) {
                                formData.append(previousKey, cleanData[previousKey]);
                            }
                        } catch (error) {
                            console.error(`Error processing base64 data for ${key}:`, error);
                            formData.append(key, cleanData[key]);
                        }
                    } else if (typeof cleanData[key] === 'string') {
                        // If it's a regular string (like a file path), only append if it's not empty
                        if (cleanData[key].trim() !== '') {
                            console.log(`Adding string file path for ${key}:`, cleanData[key]);
                            formData.append(key, cleanData[key]);
                        }
                    }
                }
            } else if (key.startsWith('previous_')) {
                // Skip previous file fields as they're handled with their corresponding file fields
                continue;
            } else if (['drills', 'emergency_and_disaster_preparedness', 'health_personnel', 'health_training', 'ppe', 'reported_incidents', 'risk_assessment', 'safety_meeting', 'safety_officer', 'business_description'].includes(key) && cleanData[key]) {
                // Handle JSON fields
                if (typeof cleanData[key] === 'object') {
                    formData.append(key, JSON.stringify(cleanData[key]));
                } else if (typeof cleanData[key] === 'string') {
                    try {
                        const jsonValue = JSON.parse(cleanData[key]);
                        formData.append(key, JSON.stringify(jsonValue));
                    } catch (e) {
                        formData.append(key, JSON.stringify({}));
                    }
                } else {
                    formData.append(key, JSON.stringify({}));
                }
            } else if (['routine_medical_surveillance', 'schedule_of_annual_medical_examination', 'special_medical_surveillance'].includes(key) && cleanData[key]) {
                // Handle array fields
                let fieldValue = cleanData[key];
                try {
                    // If it's already a string, try to parse it
                    if (typeof fieldValue === 'string') {
                        fieldValue = JSON.parse(fieldValue);
                    }
                    // Ensure it's an array
                    if (!Array.isArray(fieldValue)) {
                        fieldValue = [fieldValue];
                    }
                    // Convert back to JSON string for submission
                    formData.append(key, JSON.stringify(fieldValue));
                } catch (e) {
                    // If parsing fails, treat as comma-separated string
                    const arrayValue = typeof fieldValue === 'string' 
                        ? fieldValue.split(',').map(item => item.trim())
                        : [fieldValue];
                    formData.append(key, JSON.stringify(arrayValue));
                }
            } else if (OSH_PROGRAM_ALL_BOOLEAN_FIELDS.includes(key)) {
                // For boolean fields, explicitly append the value even if it's null
                formData.append(key, cleanData[key] === null ? 'null' : String(cleanData[key]));
            } else if (cleanData[key] !== undefined && cleanData[key] !== null) {
                // Add other primitive values
                formData.append(key, cleanData[key]);
            }
        }
        
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/`,
            {
                method: "PATCH",
                headers: {
                    "Authorization": `Token ${token}`
                    // Don't set Content-Type header when using FormData
                },
                body: formData,
            }
        );

        console.log('Server response status:', response.status);

        if (response.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
        }

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
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

        try {
            const data = await response.json();
            console.log('Server success response:', data);
            return data;
        } catch (e) {
            // If we can't parse the response but the status was ok,
            // we still consider it a success
            console.log('Response received but not parsed as JSON');
            return { message: "OSH Program updated successfully" };
        }
    } catch (error: any) {
        throw error;
    }
}

function useUpdateOshProgramDetails() {
    return useMutation({
        mutationFn: updateOshProgramDetails
    });
}

export default useUpdateOshProgramDetails;

