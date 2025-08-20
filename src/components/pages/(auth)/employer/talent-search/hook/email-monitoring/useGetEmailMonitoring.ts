import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface EmailMonitoringFilters {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
  page_size?: number;
  current_page?: number;
}

async function getEmailMonitoring(filters: EmailMonitoringFilters = {}) {
  try {
    const token = getCookie('token');
    
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/talent-email-monitoring/?${queryParams.toString()}`;
    const res = await fetch(url, config);
    
    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }
    
    return res.json();
  } catch (err: any) {
    if (err && typeof err === 'object' && 'message' in err) {
      throw err.message;
    }
    throw 'An error occurred while fetching email monitoring records';
  }
}

function useGetEmailMonitoring(filters: EmailMonitoringFilters = {}) {
  const query = useQuery({
    queryKey: ['email-monitoring', filters],
    queryFn: () => getEmailMonitoring(filters),
    enabled: true,
  });

  return query;
}

export default useGetEmailMonitoring;
