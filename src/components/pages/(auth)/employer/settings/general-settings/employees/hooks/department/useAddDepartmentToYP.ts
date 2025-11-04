import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addDepartmentToYP(departmentData: { id: string; data: any }) {
  const token = getCookie('token');
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(departmentData.data),
  };
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/departments/sync-create/`, config);
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to add department to YP');
  }
  
  return res.json();
}

function useAddDepartmentToYP() {
  const query = useMutation({
    mutationFn: (departmentData: { id: string; data: any }) => addDepartmentToYP(departmentData)
  });

  return query;
}

export default useAddDepartmentToYP;
