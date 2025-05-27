import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { T_OshProgram } from "@/types/globals";

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

        console.log("Original data for update:", cleanData);

        // Check for case sensitivity issues with various fields
        const fieldMappings = {
            'Company_name': 'company_name',
            'Business_description': 'business_description',
            'Date_established': 'date_established',
            'Complete_address': 'complete_address',
            'Website_url': 'website_url',
            'Number_of_male_employees': 'number_of_male_employees',
            'Number_of_female_employees': 'number_of_female_employees',
            'Total_number_of_employees': 'total_number_of_employees',
            'Date': 'date',
            'Name_of_owner': 'name_of_owner',
            'Signature': 'signature',
            'Date_policy': 'date_policy'
        };

        // Apply case sensitivity fixes
        for (const [capitalizedKey, lowercaseKey] of Object.entries(fieldMappings)) {
            if (capitalizedKey in cleanData && !(lowercaseKey in cleanData)) {
                console.log(`Fixed case sensitivity for field: ${capitalizedKey} → ${lowercaseKey}`);
                cleanData[lowercaseKey] = cleanData[capitalizedKey];
                delete cleanData[capitalizedKey];
            }
        }

        // Handle date formatting
        const dateFields = ['date_established', 'date', 'date_policy'];
        for (const field of dateFields) {
            if (cleanData[field]) {
                const dateObj = new Date(cleanData[field]);
                if (!isNaN(dateObj.getTime())) {
                    cleanData[field] = dateObj.toISOString().split('T')[0];
                }
            }
        }

        // Handle all boolean fields
        const booleanFields = [
            'duties_and_responsibilities',
            'random_drug_testing',
            'adequate_sanitary_and_washing_facilities',
            'adequate_supply_of_drinking_water',
            'suitable_living_accommodation',
            'separate_sanitary_washing_and_sleeping_facilities',
            'lactation_station',
            'ramps_railings_and_like',
            'other_workers_welfare_facilities',
            'written_emergency_and_disaster_program',
            'written_pollution_control_program'
        ];
        
        for (const field of booleanFields) {
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
        
        // Add all fields to FormData
        for (const key in cleanData) {
            if (isFile(cleanData[key])) {
                // Add files directly
                console.log(`Adding file for field: ${key}`);
                formData.append(key, cleanData[key]);
                
                // Add previous file information if available
                const previousKey = `previous_${key}`;
                if (cleanData[previousKey]) {
                    console.log(`Adding previous file info for: ${key}`);
                    formData.append(previousKey, cleanData[previousKey]);
                }
            } else if (key === 'signature' || key === 'safety_signage') {
                // Only append signature/safety_signage if it exists and is not null/undefined
                if (cleanData[key] && cleanData[key] !== 'null' && cleanData[key] !== 'undefined') {
                    if (isFile(cleanData[key])) {
                        formData.append(key, cleanData[key]);
                        
                        // Add previous file information
                        const previousKey = `previous_${key}`;
                        if (cleanData[previousKey]) {
                            formData.append(previousKey, cleanData[previousKey]);
                        }
                    } else if (typeof cleanData[key] === 'string' && cleanData[key].startsWith('data:')) {
                        // Handle base64 data URL
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
                            console.error(`Error converting ${key} data URL to blob:`, error);
                            formData.append(key, cleanData[key]);
                        }
                    } else if (typeof cleanData[key] === 'string') {
                        // If it's a regular string (like a file path), only append if it's not empty
                        if (cleanData[key].trim() !== '') {
                            formData.append(key, cleanData[key]);
                        }
                    }
                }
            } else if (key.startsWith('previous_')) {
                // Skip previous file fields as they're handled with their corresponding file fields
                continue;
            } else if (key === 'business_description' && cleanData[key] !== undefined) {
                // Handle business_description array field
                console.log(`Processing business_description: ${typeof cleanData[key]}`, cleanData[key]);
                
                // Always convert to array first
                let arrayValue;
                
                if (Array.isArray(cleanData[key])) {
                    arrayValue = cleanData[key];
                } else if (typeof cleanData[key] === 'string') {
                    try {
                        // Try to parse if it's a JSON string
                        const parsed = JSON.parse(cleanData[key]);
                        arrayValue = Array.isArray(parsed) ? parsed : [cleanData[key]];
                    } catch (e) {
                        // If not JSON, use as string
                        arrayValue = [cleanData[key]];
                    }
                } else if (cleanData[key] === null) {
                    arrayValue = [];
                } else {
                    // For any other type
                    arrayValue = [String(cleanData[key])];
                }
                
                // Send the array directly, not as a JSON string
                // The backend will handle the conversion
                console.log(`Sending business_description as array:`, arrayValue);
                
                // Add each item individually if it's an array
                if (Array.isArray(arrayValue)) {
                    arrayValue.forEach((item, index) => {
                        formData.append(`business_description[${index}]`, item);
                    });
                } else {
                    // Fallback just in case
                    formData.append('business_description', JSON.stringify(arrayValue));
                }
            } else if (['routine_medical_surveillance', 'schedule_of_annual_medical_examination', 'special_medical_surveillance'].includes(key) && cleanData[key]) {
                // Handle array fields
                console.log(`Processing array field ${key}: ${typeof cleanData[key]}`, cleanData[key]);
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
            } else if (['drills', 'emergency_and_disaster_preparedness', 'health_personnel', 'health_training', 'ppe', 'reported_incidents', 'risk_assessment', 'safety_meeting', 'safety_officer'].includes(key) && cleanData[key]) {
                // Handle JSON fields
                console.log(`Processing JSON field ${key}: ${typeof cleanData[key]}`);
                if (typeof cleanData[key] === 'object') {
                    formData.append(key, JSON.stringify(cleanData[key]));
                } else if (typeof cleanData[key] === 'string') {
                    try {
                        const jsonValue = JSON.parse(cleanData[key]);
                        formData.append(key, JSON.stringify(jsonValue));
                    } catch (e) {
                        console.warn(`Error parsing JSON for field ${key}:`, e);
                        formData.append(key, JSON.stringify({}));
                    }
                } else {
                    formData.append(key, JSON.stringify({}));
                }
            } else if (booleanFields.includes(key)) {
                // For boolean fields, explicitly append the value even if it's null
                formData.append(key, cleanData[key] === null ? 'null' : String(cleanData[key]));
            } else if (cleanData[key] !== undefined && cleanData[key] !== null) {
                // Add other primitive values
                formData.append(key, cleanData[key]);
            }
        }
        
        // Log the form data entries for debugging
        const formDataEntries: Record<string, any> = {};
        formData.forEach((value, key) => {
            formDataEntries[key] = value;
        });
        console.log("Form data entries to be sent:", formDataEntries);
        
        console.log("Sending request to update OSH program...");
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

        if (response.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
        }

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
                console.error("Server error response:", errorData);
                
                // Check specifically for business_description issues
                if (errorData.business_description) {
                    console.error("Business description error:", errorData.business_description);
                }
                
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

        try {
            const data = await response.json();
            console.log("Update successful:", data);
            return data;
        } catch (e) {
            // If we can't parse the response but the status was ok,
            // we still consider it a success
            console.log("Update successful but no JSON response");
            return { message: "OSH Program updated successfully" };
        }
    } catch (error: any) {
        console.error("Error updating OSH Program:", error);
        throw error;
    }
}

function useUpdateOshProgramDetails() {
    return useMutation({
        mutationFn: updateOshProgramDetails,
        onError: (error: any) => {
            console.error("Mutation error:", error);
        },
    });
}

export default useUpdateOshProgramDetails;

