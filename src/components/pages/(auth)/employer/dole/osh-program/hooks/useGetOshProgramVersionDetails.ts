import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

import { T_OshProgram } from "@/types/osh-program";

interface VersionDetailData extends Omit<T_OshProgram, 'id'> {
    id: number;
    version_number: number;
    version_number_formatted: string;
    version_name: string | null;
    changes_summary: string | null;
    created_by: number;
    created_by_name: string;
    created_at: string;
    status: string;
}

async function getOshProgramVersionDetails(versionId: number): Promise<VersionDetailData> {
    try {
        const token = getCookie("token");
        const config = {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
            },
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/version-history/${versionId}/`, config);
        if (!res.ok) {
            throw res.json();
        }
        const data = await res.json();
        return data;
    } catch (err: any) {
        let errStringify = await err;
        if (Object.hasOwn(errStringify, "response")) {
            throw errStringify.response.data.message;
        }
        throw errStringify.message;
    }
}

function useGetOshProgramVersionDetails(versionId: number, enabled: boolean = true) {
    const query = useQuery({
        queryKey: ["oshProgramVersionDetails", versionId],
        queryFn: () => getOshProgramVersionDetails(versionId),
        enabled: enabled && versionId > 0,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
    
    return query;
}

export default useGetOshProgramVersionDetails; 