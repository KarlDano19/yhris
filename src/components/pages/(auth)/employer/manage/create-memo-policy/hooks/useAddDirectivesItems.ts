import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_Directive } from '@/types/globals';

async function addDirective(directive: T_Directive) {
  try {
    const token = getCookie('token');
    const data = new FormData();
    data.append('directive_type', directive.type);
    data.append('title', directive.title);
    data.append('to', JSON.stringify(directive.email));
    // for (const [index, file] of directive.file.entries()) {
    //   data.append(`file${index}`, file);
    // }
    if (directive.type === 'memo') {
      data.append('is_responded', directive.withResponse ? 'yes' : 'no');
      data.append('body', directive.body);
      data.append('name', directive.name);
      data.append('position', directive.position);
      if (directive.signature.length) {
        const signatureBlob = await fetch(`${directive.signature}`).then((res) => res.blob());
        data.append('signature', signatureBlob, 'signature.jpg');
      }
      if (directive.qrCode) {
        data.append('qr_code', directive.qrCode);
      }
    } else {
      data.append('is_responded', directive.withResponse ? 'yes' : 'no');
      data.append('purpose', directive.purpose);
      data.append('policy', directive.policy);
      data.append('procedure', directive.procedure);
      data.append('eligibility', directive.eligibility);
      data.append('application', directive.application);
      data.append('coverage', directive.coverage);
      data.append('termination', directive.termination);
    }
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: data,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/directives/`, config);
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

function useAddDirectivesItems() {
  const query = useMutation((directive: T_Directive) => addDirective(directive));

  return query;
}

export default useAddDirectivesItems;
