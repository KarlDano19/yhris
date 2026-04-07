import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_BusinessJobApplication } from '@/types/business-mode';

interface ApplicationFilters {
  currentPage: number;
  pageSize: number;
  batchNumber?: number;
  status?: string;
  viewType?: 'current_batch' | 'previous_batches';
}

interface ApplicationsResponse {
  records: T_BusinessJobApplication[];
  total_records: number;
  total_pages: number;
  starting: number;
  ending: number;
}

async function fetchBusinessJobApplications(
  jobId: number,
  filters: ApplicationFilters
): Promise<ApplicationsResponse> {
  const token = getCookie('token');

  // Build query parameters
  const params: Record<string, string> = {
    current_page: String(filters.currentPage),
    page_size: String(filters.pageSize),
  };

  if (filters.batchNumber !== undefined) {
    params.batch_number = String(filters.batchNumber);
  }

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.viewType) {
    params.view_type = filters.viewType;
  }

  const searchParams = new URLSearchParams(params);

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/${jobId}/applications/?${searchParams}`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch business job applications.');
  }

  const data = await res.json();
  return data.data || data;
}

export function useGetBusinessJobApplications(
  jobId: number | null,
  filters: ApplicationFilters,
  enabled: boolean = true
) {
  return useQuery<ApplicationsResponse, Error>(
    [
      'businessJobApplicationsCache',
      jobId,
      filters.currentPage,
      filters.pageSize,
      filters.batchNumber,
      filters.status,
      filters.viewType,
    ],
    () => fetchBusinessJobApplications(jobId!, filters),
    {
      enabled: enabled && !!jobId,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
}
