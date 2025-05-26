import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function getOshProgramDetails() {
    try {
        const token = getCookie("token");
        const config = {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
                Accept: "multipart/form-data, application/json",
            },
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/`, config);
        if (!res.ok) {
            throw res.json();
        }
        const data = await res.json();

        // Process file fields to ensure they're properly handled
        const fileFields = [
            'safety_signage',
            'adequate_supply_of_drinking_water_file',
            'adequate_sanitary_and_washing_facilities_file',
            'suitable_living_accommodation_file',
            'separate_sanitary_washing_and_sleeping_facilities_file',
            'lactation_station_file',
            'ramps_railings_and_like_file',
            'other_workers_welfare_facilities_file'
        ];

        // Convert file data if present
        fileFields.forEach(field => {
            if (data[field] && typeof data[field] === 'string') {
                try {
                    // If it's a base64 string or URL, keep it as is
                    // Otherwise, it might need to be converted to a File object
                    if (!data[field].startsWith('data:') && !data[field].startsWith('http')) {
                        data[field] = null;
                    }
                } catch (e) {
                    console.warn(`Error processing file field ${field}:`, e);
                    data[field] = null;
                }
            }
        });

        return data;
    } catch (err: any) {
        let errStringify = await err;
        if (Object.hasOwn(errStringify, "response")) {
            throw errStringify.response.data.message;
        }
        throw errStringify.message;
    }
}

function useGetOshProgramDetails() {
    const query = useQuery({
        queryKey: ["oshProgramDetails"],
        queryFn: () => getOshProgramDetails(),
    });
    return query;
}

export default useGetOshProgramDetails;
