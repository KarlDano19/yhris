import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export interface BulkLocationSyncData {
  location_ids?: number[];
}

export interface BulkLocationSyncResponse {
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

async function bulkSyncLocationsToPayroll(syncData: BulkLocationSyncData): Promise<BulkLocationSyncResponse> {
  try {
    console.log("bulkSyncLocationsToPayroll", syncData);
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(syncData),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/bulk-sync-to-payroll/`, config);
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

function useSyncLocation() {
  const query = useMutation((syncData: BulkLocationSyncData) => bulkSyncLocationsToPayroll(syncData));

  return query;
}

export default useSyncLocation;