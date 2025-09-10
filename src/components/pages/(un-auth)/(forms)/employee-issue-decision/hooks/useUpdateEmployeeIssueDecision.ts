import { useMutation } from '@tanstack/react-query';

// Define a more specific type for the signature upload parameters
type SignatureUploadParams = {
  employee_issue_id: string;
  employee_signature: File;
};

async function updateEmployeeIssueDecision(params: SignatureUploadParams) {
  try {
    const { employee_issue_id, employee_signature } = params;
    
    const formData = new FormData();
    formData.append('employee_signature', employee_signature);
    
    const config = {
      method: 'PATCH',
      body: formData,
    };
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/employee-issue-decisions/${employee_issue_id}/`,
      config
    );
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Signature upload failed');
    }
    
    return res.json();
  } catch (err: any) {
    throw err.message || 'An error occurred during signature upload';
  }
}

function useUpdateEmployeeIssueDecision() {
  const query = useMutation<any, Error, SignatureUploadParams>((params) => updateEmployeeIssueDecision(params));
  return query;
}

export default useUpdateEmployeeIssueDecision;
