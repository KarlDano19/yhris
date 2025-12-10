import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export interface BulkPositionSyncData {
  position_ids?: number[];
}

export interface BulkPositionSyncResponse {
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

async function bulkSyncPositionsToPayroll(syncData: BulkPositionSyncData): Promise<BulkPositionSyncResponse> {
  try {
    console.log("bulkSyncPositionsToPayroll", syncData);
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(syncData),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/positions/bulk-sync-to-payroll/`, config);
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

function useSyncPosition() {
  const query = useMutation((syncData: BulkPositionSyncData) => bulkSyncPositionsToPayroll(syncData));

  return query;
}

export default useSyncPosition;