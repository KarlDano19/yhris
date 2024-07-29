import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ExportAgreement } from '@/types/globals';

async function updateAgreeExport(data: T_ExportAgreement) {
    try {
      const token = getCookie('token');
      const formData = new FormData();
      formData.append('is_export_agreed', String(data.is_export_agree));
      const config = {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employers/profiles/`, config);
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
  
function useUpdateEmployerAgreeExport() {
    const query = useMutation((data: T_ExportAgreement) => updateAgreeExport(data));
    return query;
}

export default useUpdateEmployerAgreeExport;