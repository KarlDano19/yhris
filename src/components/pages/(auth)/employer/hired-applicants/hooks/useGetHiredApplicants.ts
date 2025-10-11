import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getHiredApplicants(filters: any) {
  try {
    let newFilters = { ...filters };
    // Use standard pagination with job assignment filtering
    newFilters.view_type = 'hired-applicants';
    if (filters.currentPage) newFilters.current_page = filters.currentPage;
    if (filters.pageSize) newFilters.page_size = filters.pageSize;
    if (filters.is_active) newFilters.is_active = filters.is_active;
    const searchParams = new URLSearchParams(newFilters);
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/?${searchParams}`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return [];
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetHiredApplicants(filters: any) {
  const query = useQuery(['hiredApplicantJobCache', filters], () => getHiredApplicants(filters), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetHiredApplicants;
