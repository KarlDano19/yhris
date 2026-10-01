import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteChecklist201Requirement(checklist_201_requirement_id: number | null) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checklist-201-requirements/${checklist_201_requirement_id}/`, config);
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

function useDeleteChecklist201Requirement() {
  const query = useMutation((checklist_201_requirement_id: number | null) => deleteChecklist201Requirement(checklist_201_requirement_id));
  return query;
}

export default useDeleteChecklist201Requirement;
