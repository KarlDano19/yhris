import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Define a more specific type for the upload function parameters
type UploadParams = {
  employee_issue_id: number;
  nte_attachment?: File;
  decision_attachment?: File;
};

async function uploadEmployeeIssueAttachments(params: UploadParams) {
  try {
    const token = getCookie('token');
    const { employee_issue_id, nte_attachment, decision_attachment } = params;

    const formData = new FormData();
    formData.append('nte_attachment', nte_attachment || '');
    formData.append('decision_attachment', decision_attachment || '');

    const config = {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/employee-issues/attachments/${employee_issue_id}/`,
      config
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Upload failed');
    }
    return res.json();
  } catch (err: any) {
    throw err.message || 'An error occurred during upload';
  }
}

function useUploadEmployeeIssueAttachments() {
  const query = useMutation<any, Error, UploadParams>((params) => uploadEmployeeIssueAttachments(params));
  return query;
}

export default useUploadEmployeeIssueAttachments;
