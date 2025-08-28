import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteEmailMonitoring(monitoringId: number) {
  try {
    const token = getCookie('token');

    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/talent-email-monitoring/${monitoringId}/`,
      config
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    return res.json();
  } catch (err: any) {
    if (err && typeof err === 'object' && 'message' in err) {
      throw err.message;
    }
    throw 'An error occurred while deleting the email monitoring record';
  }
}

function useDeleteEmailMonitoring() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (monitoringId: number) => deleteEmailMonitoring(monitoringId),
    onSuccess: () => {
      // Invalidate and refetch email monitoring queries
      queryClient.invalidateQueries({ queryKey: ['email-monitoring'] });
    },
  });

  return mutation;
}

export default useDeleteEmailMonitoring;
