import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SwapOrgStructureData {
  swap_with_id: number;
}

interface SwapOrgStructureResponse {
  message: string;
}

async function swapOrgStructure(orgStructureId: number, data: SwapOrgStructureData): Promise<SwapOrgStructureResponse> {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org-structures/${orgStructureId}/swap/`, config);
      if (!res.ok) {
        const errorData = await res.json();
        throw errorData;
      }
      return res.json();
    }
    throw new Error('No authentication token found');
  } catch (err: any) {
    if (typeof err === 'object' && err !== null) {
      throw err;
    }
    throw new Error(err.message || 'Failed to swap organizational structure positions');
  }
}

function useSwapOrgStructure() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(
    ({ orgStructureId, data }: { orgStructureId: number; data: SwapOrgStructureData }) => 
      swapOrgStructure(orgStructureId, data),
    {
      onSuccess: () => {
        // Invalidate and refetch org structure data
        queryClient.invalidateQueries(['orgStructureItemsCache']);
      },
      onError: (error) => {
        console.error('Error swapping organizational structure positions:', error);
      },
    }
  );

  return mutation;
}

export default useSwapOrgStructure;
