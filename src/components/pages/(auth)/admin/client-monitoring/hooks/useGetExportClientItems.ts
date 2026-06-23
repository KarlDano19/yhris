import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_ExportFormat = 'csv' | 'pdf';

async function getExportClientItems(format: T_ExportFormat) {
  try {
    const params = new URLSearchParams({ export: 'true', file_format: format });
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers/?${params.toString()}`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return null;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetExportClientItems(format: T_ExportFormat) {
  return useQuery(
    ['exportClientItemsCache', format],
    () => getExportClientItems(format),
    {
      enabled: false,
      keepPreviousData: false,
    }
  );
}

export default useGetExportClientItems;
