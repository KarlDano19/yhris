import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateChecklist201Requirement(checklist_201_requirement_id: number, data: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
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

function useUpdateChecklist201Requirement() {
  const query = useMutation((props: any) => updateChecklist201Requirement(props.checklist_201_requirement_id, props.data));
  return query;
}

export default useUpdateChecklist201Requirement;
