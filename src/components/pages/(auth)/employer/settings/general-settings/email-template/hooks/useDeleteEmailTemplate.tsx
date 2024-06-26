import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteEmailTemplate(email_template_id: number | null) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email-templates/${email_template_id}/`, config);
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

function useDeleteEmailTemplate() {
  const query = useMutation((email_template_id: number | null) => deleteEmailTemplate(email_template_id));
  return query;
}

export default useDeleteEmailTemplate;
