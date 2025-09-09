import { useMutation } from '@tanstack/react-query';

async function updateEmployeeIssueResponse(employee_issue_id: string, data: any) {
  try {
    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
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

function useUpdateEmployeeIssueResponse() {
  const query = useMutation((props: any) => updateEmployeeIssueResponse(props.employee_issue_id, props.data));
  return query;
}

export default useUpdateEmployeeIssueResponse;
