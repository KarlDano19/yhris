import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SetPrimaryEmployeeData {
  employee_id: number;
}

async function setPrimaryEmployee(orgStructureId: number, data: SetPrimaryEmployeeData) {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org-structures/${orgStructureId}/set-primary-employee/`, config);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to set primary employee');
      }
      return res.json();
    }
    throw new Error('No authentication token found');
  } catch (err: any) {
    throw new Error(err.message || 'Failed to set primary employee');
  }
}

function useSetPrimaryEmployee() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ({ orgStructureId, employeeId }: { orgStructureId: number; employeeId: number }) =>
      setPrimaryEmployee(orgStructureId, { employee_id: employeeId }),
    {
      onSuccess: (data, variables) => {
        // Invalidate and refetch org structure data
        queryClient.invalidateQueries(['orgStructureManageCache']);
        queryClient.invalidateQueries(['employerProfileCache']);
      },
      onError: (error: Error) => {
        // Error handling will be done in the component
        console.error('Failed to set primary employee:', error);
      },
    }
  );

  return mutation;
}

export default useSetPrimaryEmployee;
