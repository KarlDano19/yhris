import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function updateOshProgramDetails(data: any) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Authentication token not found");
        }

        const cleanData = { ...data };

        // Check for case sensitivity issues with company_name field
        if ('Company_name' in cleanData && !('company_name' in cleanData)) {
            cleanData.company_name = cleanData.Company_name;
            delete cleanData.Company_name;
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
            'other_workers_welfare_facilities'
        ];
        
        for (const field of booleanFields) {
            if (cleanData[field] !== undefined) {
                // Convert string values to boolean
                if (typeof cleanData[field] === 'string') {
                    const value = cleanData[field].toLowerCase();
                    cleanData[field] = value === 'true' || value === 'yes';
                } else {
                    // Ensure it's a proper boolean
                    cleanData[field] = Boolean(cleanData[field]);
                }
            }
        }

        // Check if we have file uploads
        const hasFileUploads = cleanData.signature instanceof File || 
                              cleanData.safety_signature instanceof File;

        let response;
        
        if (hasFileUploads) {
            // Use FormData for file uploads
            const formData = new FormData();
            
            // Add all fields to FormData
            for (const key in cleanData) {
                if (cleanData[key] instanceof File) {
                    // Add files directly
                    formData.append(key, cleanData[key]);
                } else if (key === 'business_description' && cleanData[key]) {
                    // Handle business_description array field
                    if (Array.isArray(cleanData[key])) {
                        formData.append(key, JSON.stringify(cleanData[key]));
                    } else {
                        formData.append(key, JSON.stringify([cleanData[key]]));
                    }
                } else if (['routine_medical_surveillance', 'schedule_of_annual_medical_examination', 'special_medical_surveillance'].includes(key) && cleanData[key]) {
                    // Handle array fields
                    if (Array.isArray(cleanData[key])) {
                        formData.append(key, JSON.stringify(cleanData[key]));
                    } else if (typeof cleanData[key] === 'string') {
                        const arrayValue = cleanData[key].split(',').map((item: string) => item.trim());
                        formData.append(key, JSON.stringify(arrayValue));
                    } else {
                        formData.append(key, JSON.stringify([cleanData[key]]));
                    }
                } else if (['drills', 'emergency_and_disaster_preparedness', 'health_personnel', 'health_training', 'ppe', 'reported_incidents', 'risk_assessment', 'safety_meeting', 'safety_officer'].includes(key) && cleanData[key]) {
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
                } else if (cleanData[key] !== undefined && cleanData[key] !== null) {
                    // Add other primitive values
                    formData.append(key, cleanData[key]);
                }
            }
            
            response = await fetch(
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
        } else {
            // Handle business_description array field
            if (cleanData.business_description) {
                if (!Array.isArray(cleanData.business_description)) {
                    cleanData.business_description = [cleanData.business_description];
                }
            }

            // Handle JSON fields
            const jsonFields = [
                'drills',
                'emergency_and_disaster_preparedness',
                'health_personnel',
                'health_training',
                'ppe',
                'reported_incidents',
                'risk_assessment',
                'safety_meeting',
                'safety_officer'
            ];

            for (const field of jsonFields) {
                if (cleanData[field]) {
                    // If it's already an object/array, keep it as is
                    if (typeof cleanData[field] === 'object') {
                        continue;
                    }
                    // If it's a string, try to parse it
                    if (typeof cleanData[field] === 'string') {
                        try {
                            cleanData[field] = JSON.parse(cleanData[field]);
                        } catch (e) {
                            cleanData[field] = {};
                        }
                    }
                }
            }

            // Handle array fields
            const arrayFields = [
                'routine_medical_surveillance',
                'schedule_of_annual_medical_examination',
                'special_medical_surveillance'
            ];

            for (const field of arrayFields) {
                if (cleanData[field]) {
                    if (!Array.isArray(cleanData[field])) {
                        if (typeof cleanData[field] === 'string') {
                            cleanData[field] = cleanData[field].split(',').map((item: string) => item.trim());
                        } else {
                            cleanData[field] = [cleanData[field]];
                        }
                    }
                }
            }

            // Use JSON for non-file data
            response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${token}`
                    },
                    body: JSON.stringify(cleanData),
                }
            );
        }

        if (response.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
        }

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                throw new Error(response.statusText || 'An error occurred while updating OSH Program');
            }
            
            throw new Error(
                errorData.message || 
                errorData.error || 
                errorData.detail || 
                'An error occurred while updating OSH Program'
            );
        }

        try {
            const data = await response.json();
            return data;
        } catch (e) {
            // If we can't parse the response but the status was ok,
            // we still consider it a success
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

