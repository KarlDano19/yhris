import { useQuery } from '@tanstack/react-query';

async function getEmployeeIssueResponseDetails(employee_issue_id: string | null) {
  try {
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/employee-issue-responses/${employee_issue_id}/`,
      config
    );
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetEmployeeIssueResponseDetails(employee_issue_id: string | null) {
  const query = useQuery(
    ['employeeIssueResponseDetailsPublicCache'],
    () => getEmployeeIssueResponseDetails(employee_issue_id),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetEmployeeIssueResponseDetails;
