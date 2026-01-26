import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type SyncType = 'active' | 'inactive' | 'all';

interface SyncEmployeeStatusFromYPParams {
  syncType?: SyncType;
}

async function syncEmployeeStatusFromYP(params: SyncEmployeeStatusFromYPParams = {}) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    // Build URL with query parameter
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-status/sync-third-party-integration/`;
    if (params.syncType) {
      url += `?type=${params.syncType}`;
    }

    const res = await fetch(url, config);
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

function useSyncEmployeeStatusFromYP() {
  const query = useMutation((params: SyncEmployeeStatusFromYPParams) => syncEmployeeStatusFromYP(params));
  return query;
}

export default useSyncEmployeeStatusFromYP;
