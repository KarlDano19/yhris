import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export interface BulkDepartmentSyncData {
  department_ids?: number[];
}

export interface BulkDepartmentSyncResponse {
  message: string;
  total_sent: number;
  payroll_response: {
    message: string;
    created: number;
    updated: number;
    error_count: number;
    total_processed: number;
  };
  summary: {
    created: number;
    updated: number;
    errors: number;
    total_processed: number;
  };
}

async function bulkSyncDepartmentsToPayroll(syncData: BulkDepartmentSyncData): Promise<BulkDepartmentSyncResponse> {
  try {
    console.log("bulkSyncDepartmentsToPayroll", syncData);
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(syncData),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/departments/bulk-sync-to-payroll/`, config);
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

function useSyncDepartment() {
  const query = useMutation((syncData: BulkDepartmentSyncData) => bulkSyncDepartmentsToPayroll(syncData));

  return query;
}

export default useSyncDepartment;