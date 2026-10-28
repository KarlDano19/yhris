import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function createChecklist201Requirement(requirement: any) {
  try {
    const token = getCookie('token');

    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(requirement),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checklist-201-requirements/`, config);
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

function useCreateChecklist201Requirement() {
  const query = useMutation((requirement: any) => createChecklist201Requirement(requirement));

  return query;
}

export default useCreateChecklist201Requirement;
