import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export type QuickAccessCounter = {
  count: number;
  label: string;
};

async function fetchCount(url: string): Promise<number> {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) return 0;
  return res.json();
}

async function getQuickAccessCounters(): Promise<Record<string, QuickAccessCounter>> {
  const [jobHistory, employeeIssues, directives, employees] = await Promise.allSettled([
    fetchCount('/api/jobs/?view_type=job-posting-history&pageSize=1&currentPage=1'),
    fetchCount('/api/employee-issues/?status=pending&pageSize=1&currentPage=1'),
    fetchCount('/api/directives/?pageSize=1&currentPage=1'),
    fetchCount('/api/employees/?view_type=count'),
  ]);

  const resolve = (result: PromiseSettledResult<any>) =>
    result.status === 'fulfilled' ? result.value : null;

  const jobData = resolve(jobHistory);
  const issueData = resolve(employeeIssues);
  const directiveData = resolve(directives);
  const employeeData = resolve(employees);

  const counters: Record<string, QuickAccessCounter> = {};

  if (jobData?.total != null) {
    counters['post-job-history'] = { count: jobData.total, label: 'active' };
  }
  if (issueData?.total != null) {
    counters['manage-address-issue'] = { count: issueData.total, label: 'pending' };
  }
  if (directiveData?.total != null) {
    counters['manage-memo-policy'] = { count: directiveData.total, label: 'total' };
  }
  if (employeeData?.count != null) {
    counters['manage-employees'] = { count: employeeData.count, label: 'employees' };
  }

  return counters;
}

function useGetQuickAccessCounters() {
  return useQuery(['quickAccessCountersCache'], () => getQuickAccessCounters(), {
    refetchOnWindowFocus: false,
    staleTime: 60_000, // reuse cached counts for 1 minute
  });
}

export default useGetQuickAccessCounters;
