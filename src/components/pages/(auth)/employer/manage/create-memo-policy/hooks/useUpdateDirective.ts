import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { DirectiveData } from '@/types/directives';

async function updateDirective(directive: DirectiveData) {
  try {
    const token = getCookie('token');
    const formData = new FormData();

    if (directive.title !== undefined) formData.append('title', directive.title);
    formData.append('to', JSON.stringify(directive.to));
    formData.append('directive_type', directive.directive_type || '');

    if (directive.attachments) {
      if (Array.isArray(directive.attachments)) {
        directive.attachments.forEach((item) => {
          if (item instanceof File) formData.append('attachments', item);
        });
      } else if (directive.attachments instanceof File) {
        formData.append('attachments', directive.attachments);
      }
    }

    if (directive.directive_type === 'memo') {
      if (directive.body !== undefined) formData.append('body', directive.body);
      if (directive.name !== undefined) formData.append('name', directive.name);
      if (directive.position !== undefined) formData.append('position', directive.position);
      if (directive.signature) {
        if (typeof directive.signature === 'string' && directive.signature.length) {
          const signatureBlob = await fetch(directive.signature).then((res) => res.blob());
          formData.append('signature', signatureBlob, 'signature.jpg');
        } else if (directive.signature instanceof FileList && directive.signature.length > 0) {
          formData.append('signature', directive.signature[0]);
        } else if (directive.signature instanceof File) {
          formData.append('signature', directive.signature);
        }
      }
      if (directive.qr_code instanceof File) {
        formData.append('qr_code', directive.qr_code);
      }
    } else {
      if (directive.eligibility !== undefined) formData.append('eligibility', directive.eligibility);
      if (directive.application !== undefined) formData.append('application', directive.application);
      if (directive.coverage !== undefined) formData.append('coverage', directive.coverage);
      if (directive.termination !== undefined) formData.append('termination', directive.termination);
      if (directive.custom_policy_fields !== undefined) {
        formData.append('custom_policy_fields', JSON.stringify(directive.custom_policy_fields));
      }
    }

    const config = {
      method: 'PATCH',
      headers: { Authorization: `Token ${token}` },
      body: formData,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directive.id}/`, config);
    if (!res.ok) throw res.json();
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) throw errStringify.response.data.message;
    throw errStringify.message;
  }
}

function useUpdateDirective() {
  const mutation = useMutation((data: DirectiveData) => updateDirective(data));
  return mutation;
}

export default useUpdateDirective;
