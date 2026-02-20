import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateDirective(directive: { id: number; payload: any }) {
  try {
    const token = getCookie('token');
    const data = new FormData();
    const payload = directive.payload || {};
    // Append simple fields
    if (payload.title !== undefined) data.append('title', payload.title);
    if (payload.body !== undefined) data.append('body', payload.body);
    if (payload.name !== undefined) data.append('name', payload.name);
    if (payload.position !== undefined) data.append('position', payload.position);
    if (payload.to !== undefined) data.append('to', JSON.stringify(payload.to));
    if (payload.directive_type !== undefined) data.append('directive_type', payload.directive_type);

    // custom_policy_fields if present
    if (payload.custom_policy_fields !== undefined) {
      data.append('custom_policy_fields', JSON.stringify(payload.custom_policy_fields));
    }

    const config = {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: data,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directive.id}/`, config);
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

function useUpdateDirective() {
  const mutation = useMutation((data: { id: number; payload: any }) => updateDirective(data));
  return mutation;
}

export default useUpdateDirective;

