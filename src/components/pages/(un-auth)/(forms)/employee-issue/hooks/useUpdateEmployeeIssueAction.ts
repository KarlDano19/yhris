import { useMutation } from '@tanstack/react-query';

// Define types for different action parameters
type ResponseActionParams = {
  employee_issue_id: string;
  action_type: 'response';
  data: {
    response: string;
  };
};

type DecisionActionParams = {
  employee_issue_id: string;
  action_type: 'decision';
  employee_signature: File;
};

type ActionParams = ResponseActionParams | DecisionActionParams;

async function updateEmployeeIssueAction(params: ActionParams) {
  try {
    const { employee_issue_id } = params;
    
    let config: RequestInit;
    
    if (params.action_type === 'response') {
      // Handle response submission
      config = {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(params.data),
      };
    } else {
      // Handle decision acknowledgment with signature
      const formData = new FormData();
      formData.append('employee_signature', params.employee_signature);
      
      config = {
        method: 'PATCH',
        body: formData,
      };
    }
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/employee-issue-actions/${employee_issue_id}/`,
      config
    );
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || errorData.message || 'Action failed');
    }
    
    return res.json();
  } catch (err: any) {
    if (err.message) {
      throw err.message;
    }
    throw 'An error occurred during the action';
  }
}

function useUpdateEmployeeIssueAction() {
  const query = useMutation<any, Error, ActionParams>((params) => updateEmployeeIssueAction(params));
  return query;
}

export default useUpdateEmployeeIssueAction;
