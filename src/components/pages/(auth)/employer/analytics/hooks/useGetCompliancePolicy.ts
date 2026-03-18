import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_CompliancePolicy } from '@/types/analytics';

async function getCompliancePolicy(): Promise<T_CompliancePolicy> {
  const token = getCookie('token');
  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/compliance-policy/`,
      config
    );
    if (!res.ok) throw res.json();
    const json = await res.json();
    return json;
  }
  return { overall_compliance_rate: 0, overdue_count: 0, policies_due_count: 0, dole_compliance_table: [] };
}

function useGetCompliancePolicy() {
  return useQuery(
    ['analyticsCompliancePolicy'],
    () => getCompliancePolicy(),
    { 
      keepPreviousData: true, 
      refetchOnWindowFocus: false 
    }
  );
}

export default useGetCompliancePolicy;
