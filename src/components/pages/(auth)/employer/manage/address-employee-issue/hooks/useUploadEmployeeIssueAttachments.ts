import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Define a more specific type for the upload function parameters
type UploadParams = {
  employee_issue_id: number;
  nte_attachment?: File;
  decision_attachment?: File;
  // Additional fields for NTE document generation
  nte_logo?: File;
  border_color?: string;
  company_name?: string;
  date_issued?: string;
  brief_background?: string;
  prepared_by?: string;
  reviewed_by?: string;
  hr_signature?: File;
};

async function uploadEmployeeIssueAttachments(params: UploadParams) {
  try {
    const token = getCookie('token');
    const { 
      employee_issue_id, 
      nte_attachment, 
      decision_attachment,
      nte_logo,
      border_color,
      company_name,
      date_issued,
      brief_background,
      prepared_by,
      reviewed_by,
      hr_signature,
    } = params;

    const formData = new FormData();
    formData.append('nte_attachment', nte_attachment || '');
    formData.append('decision_attachment', decision_attachment || '');
    
    // Handle Proceed Updated Employee Issue Form Fields
    if (nte_logo) formData.append('nte_logo', nte_logo);
    if (border_color) formData.append('border_color', border_color);
    if (company_name) formData.append('company_name', company_name);
    if (date_issued) formData.append('date_issued', date_issued);
    if (brief_background) formData.append('brief_background', brief_background);
    if (prepared_by) formData.append('prepared_by', prepared_by);
    if (reviewed_by) formData.append('reviewed_by', reviewed_by);
    if (hr_signature) formData.append('hr_signature', hr_signature);

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
