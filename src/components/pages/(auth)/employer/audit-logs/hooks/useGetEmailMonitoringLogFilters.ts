import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getEmailMonitoringLogFilters() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (!token) return { modules: [], users: [] };

    // Use the audit-logs endpoint to retrieve filter options scoped to EmailMonitoring
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/audit-logs/?view_type=filters&module=EmailMonitoring`,
      config
    );
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    const errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetEmailMonitoringLogFilters(options?: { enabled?: boolean }) {
  const query = useQuery(['emailMonitoringLogsFilterOptions'], getEmailMonitoringLogFilters, {
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
  return query;
}

export default useGetEmailMonitoringLogFilters;

