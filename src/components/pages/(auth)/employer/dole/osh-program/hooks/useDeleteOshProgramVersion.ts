import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DeleteVersionResponse {
  message: string;
}

const deleteOshProgramVersion = async (versionId: number): Promise<DeleteVersionResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/version-history/${versionId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete version');
  }

  const data = await response.json();
  return data;
};

export default function useDeleteOshProgramVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOshProgramVersion,
    onSuccess: () => {
      // Invalidate and refetch version history
      queryClient.invalidateQueries({ queryKey: ['oshProgramVersionHistory'] });
    },
  });
} 