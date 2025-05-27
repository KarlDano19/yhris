import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { OSH_PROGRAM_FILE_FIELDS, T_OshProgram } from "@/types/osh-program";

async function getOshProgramDetails(): Promise<T_OshProgram> {
    try {
        const token = getCookie("token");
        const config = {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
            },
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/`, config);
        if (!res.ok) {
            throw res.json();
        }
        const data = await res.json();

        // Convert file data if present
        OSH_PROGRAM_FILE_FIELDS.forEach(field => {
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
