import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type ManualReceiveParams = {
  id: number;
  emailType: 'nte' | 'decision';
  receiptType: string;
  receiptRemarks?: string;
  receiptOtherReason?: string;
  file?: File;
  dateReceived: Date;
};

async function manualReceiveEmployeeIssue({
  id,
  emailType,
  receiptType,
  receiptRemarks,
  receiptOtherReason,
  file,
  dateReceived,
}: ManualReceiveParams) {
  const token = getCookie('token');

  // The signed copy (or proof of service) goes to `nte_received_attachment` or `decision_received_attachment`
  const formData = new FormData();
  formData.append('type_of_action', 'received');
  formData.append('type_of_email', emailType);
  formData.append('date_received', dateReceived.toISOString());
  formData.append('receipt_type', receiptType);
  if (receiptRemarks) formData.append('receipt_remarks', receiptRemarks);
  if (receiptOtherReason) formData.append('receipt_other_reason', receiptOtherReason);
  if (file) formData.append(`${emailType}_received_attachment`, file);

  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-issues/${id}/`, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to mark as received.');
  }

  return res.json();
}

function useManualReceiveEmployeeIssue() {
  return useMutation<any, Error, ManualReceiveParams>((params) => manualReceiveEmployeeIssue(params));
}

export default useManualReceiveEmployeeIssue;
