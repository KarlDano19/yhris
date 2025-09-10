import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Define a more specific type for the upload function parameters
type UploadParams = {
  employee_issue_id: number;
  nte_attachment?: File;
  decision_attachment?: File;
  // Additional fields for NTE document generation
  company_name?: string;
  date_issued?: string;
  prepared_by?: string;
  reviewed_by?: string;
  logo_file?: File;
  signature_file?: File;
};

async function uploadEmployeeIssueAttachments(params: UploadParams) {
  try {
    const token = getCookie('token');
    const { 
      employee_issue_id, 
      nte_attachment, 
      decision_attachment,
      company_name,
      date_issued,
      prepared_by,
      reviewed_by,
      logo_file,
      signature_file
    } = params;

    const formData = new FormData();
    formData.append('nte_attachment', nte_attachment || '');
    formData.append('decision_attachment', decision_attachment || '');
    
    // Add additional fields if provided
    if (company_name) formData.append('company_name', company_name);
    if (date_issued) formData.append('date_issued', date_issued);
    if (prepared_by) formData.append('prepared_by', prepared_by);
    if (reviewed_by) formData.append('reviewed_by', reviewed_by);
    if (logo_file) formData.append('logo_file', logo_file);
    if (signature_file) formData.append('signature_file', signature_file);

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
