import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteVersionsResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteOshProgramVersions = async (versionIds: number[]): Promise<BulkDeleteVersionsResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/version-history/bulk-delete/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ version_ids: versionIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete versions');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteOshProgramVersions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteOshProgramVersions,
    onSuccess: () => {
      // Invalidate and refetch version history
      queryClient.invalidateQueries({ queryKey: ['oshProgramVersionHistory'] });
    },
  });
}
