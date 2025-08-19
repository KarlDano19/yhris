import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

interface VersionHistoryParams {
  page_size?: number;
  current_page?: number;
}

interface VersionHistoryResponse {
  records: Array<{
    id: number;
    version_number: number;
    version_number_formatted: string;
    version_name: string | null;
    changes_summary: string | null;
    created_by: number;
    created_by_name: string;
    created_at: string;
    status: string;
  }>;
  total_records: number;
  total_pages: number;
  version_info: {
    current_count: number;
    max_limit: number;
    can_create_new: boolean;
    remaining_slots: number;
  };
}

async function getOshProgramVersionHistory(params: VersionHistoryParams = {}): Promise<VersionHistoryResponse> {
    try {
        const token = getCookie("token");
        const queryParams = new URLSearchParams();
        
        if (params.page_size) queryParams.append('page_size', params.page_size.toString());
        if (params.current_page) queryParams.append('current_page', params.current_page.toString());
        
        const config = {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
            },
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/version-history/?${queryParams.toString()}`, config);
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

function useGetOshProgramVersionHistory(params: VersionHistoryParams = {}) {
    const query = useQuery({
        queryKey: ["oshProgramVersionHistory", params],
        queryFn: () => getOshProgramVersionHistory(params),
        staleTime: 1 * 60 * 1000, // 1 minute - shorter stale time for version count
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
    
    return query;
}

export default useGetOshProgramVersionHistory; 