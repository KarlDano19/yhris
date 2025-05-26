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
        // This fixes the issue where the backend expects "company_name" but might receive "Company_name"
        if ('Company_name' in cleanData && !('company_name' in cleanData)) {
            cleanData.company_name = cleanData.Company_name;
            delete cleanData.Company_name;
        }

        // Handle date formatting
        const dateFields = ['date_established', 'date'];
        for (const field of dateFields) {
            if (cleanData[field]) {
                const dateObj = new Date(cleanData[field]);
                if (!isNaN(dateObj.getTime())) {
                    cleanData[field] = dateObj.toISOString().split('T')[0];
                }
            }
        }

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

        const response = await fetch(
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

