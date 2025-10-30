import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface MoveOrgStructureData {
  new_parent_id?: number | null;
  new_order?: number;
}

interface MoveOrgStructureResponse {
  message: string;
}

async function moveOrgStructure(orgStructureId: number, data: MoveOrgStructureData): Promise<MoveOrgStructureResponse> {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org-structures/${orgStructureId}/move/`, config);
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
    throw new Error(err.message || 'Failed to move organizational structure position');
  }
}

function useMoveOrgStructure() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(
    ({ orgStructureId, data }: { orgStructureId: number; data: MoveOrgStructureData }) => 
      moveOrgStructure(orgStructureId, data),
    {
      onSuccess: () => {
        // Invalidate and refetch org structure data
        queryClient.invalidateQueries(['orgStructureItemsCache']);
      },
      onError: (error) => {
        console.error('Error moving organizational structure position:', error);
      },
    }
  );

  return mutation;
}

export default useMoveOrgStructure;
