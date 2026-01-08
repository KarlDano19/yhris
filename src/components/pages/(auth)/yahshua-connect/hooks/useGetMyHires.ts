import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export interface MyHireRecord {
  // Application details
  application_id: number;
  application_status: string;
  application_work_status: 'not_started' | 'started' | 'completed';
  application_started_at: string | null;
  application_completed_at: string | null;
  
  // Payment information
  application_payment_status: 'pending' | 'paid' | 'cancelled';
  application_payment_amount: number | null;
  application_paid_at: string | null;
  application_payment_proof: string | null;
  application_proof_of_completion: string | null;
  application_created_at: string;
  application_updated_at: string;
  
  // Hired applicant (worker) information
  hired_applicant_id: number | null;
  hired_applicant_name: string | null;
  hired_applicant_email: string | null;
  hired_applicant_mobile: string | null;
  hired_applicant_rating: number | null;
  hired_applicant_reviews_count: number | null;
  hired_applicant_jobs_done_count: number | null;
  hired_applicant_photo: string | null;
  
  // Job posting details
  id: number;
  job_title: string;
  category: string | null;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  budget_type: 'fixed_rate' | 'hourly_rate';
  min_amount: number | null;
  max_amount: number | null;
  hourly_rate: number | null;
  date: string | null;
  time_from: string | null;
  time_to: string | null;
  status: string;
  is_urgent: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MyHiresResponse {
  records: MyHireRecord[];
  total: number;
  page_size: number;
  current_page: number;
  total_pages: number;
  starting: number;
  ending: number;
}

export interface MyHiresFilters {
  work_status?: 'not_started' | 'started' | 'completed';
  payment_status?: 'pending' | 'paid' | 'cancelled';
  job_status?: 'active' | 'in_progress' | 'completed' | 'cancelled';
  page_size?: number;
  current_page?: number;
}

async function getMyHires(filters: MyHiresFilters = {}): Promise<MyHiresResponse> {
  try {
    const token = getCookie('token');
    
    if (!token) {
      return {
        records: [],
        total: 0,
        page_size: 20,
        current_page: 1,
        total_pages: 0,
        starting: 0,
        ending: 0,
      };
    }
    
    // Build query params
    const searchParams = new URLSearchParams();
    if (filters.work_status) searchParams.append('work_status', filters.work_status);
    if (filters.payment_status) searchParams.append('payment_status', filters.payment_status);
    if (filters.job_status) searchParams.append('job_status', filters.job_status);
    if (filters.page_size) searchParams.append('page_size', filters.page_size.toString());
    if (filters.current_page) searchParams.append('current_page', filters.current_page.toString());
    
    const queryString = searchParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/my-hires/${queryString ? `?${queryString}` : ''}`;
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    
    const res = await fetch(url, config);
    
    if (!res.ok) {
      throw res.json();
    }
    
    const response = await res.json();
    return response.data || response;
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.detail;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message;
  }
}

function useGetMyHires(filters: MyHiresFilters = {}) {
  const query = useQuery(
    ['myHiresCache', filters],
    () => getMyHires(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  
  return query;
}

export default useGetMyHires;
