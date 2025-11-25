import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Type definitions
type SyncStatus = {
  integration_health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    error_rate_percentage: number;
    total_operations_week: number;
  };
  statistics: {
    total_companies_integrated: number;
    total_users_mapped: number;
    recent_sso_logins: number;
    recent_sync_operations: number;
  };
  recommendations: string[];
};

type SyncLog = {
  id: number;
  operation_type: string;
  yp_user_id: number | null;
  yp_company_id: number | null;
  hris_user_id: number | null;
  hris_employer_id: number | null;
  status: 'success' | 'error' | 'warning';
  message: string;
  error_details: any;
  created_at: string;
};

async function fetchSyncStatus(): Promise<SyncStatus> {
  const token = getCookie('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const config = {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/yp-sync/status/`, 
    config
  );

  if (!res.ok) {
    throw new Error('Failed to fetch sync status');
  }

  return await res.json();
}

async function fetchSyncLogs(limit: number = 50): Promise<{ logs: SyncLog[] }> {
  const token = getCookie('token');
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const config = {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/yp-sync/logs/?limit=${limit}&company_only=true`, 
    config
  );

  if (!res.ok) {
    throw new Error('Failed to fetch sync logs');
  }

  return await res.json();
}

// Hook for sync status
function useSyncStatus() {
  return useQuery<SyncStatus>({
    queryKey: ['ypSyncStatus'],
    queryFn: fetchSyncStatus,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
  });
}

// Hook for sync logs
function useSyncLogs(limit: number = 50) {
  return useQuery<{ logs: SyncLog[] }>({
    queryKey: ['ypSyncLogs', limit],
    queryFn: () => fetchSyncLogs(limit),
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 2,
  });
}

export {
  useSyncStatus,
  useSyncLogs,
  type SyncStatus,
  type SyncLog,
};