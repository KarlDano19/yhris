import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export interface TourProgressData {
  is_header_tour_done:   boolean;
  is_sync_tour_done:     boolean;
  is_manage_tour_done:   boolean;
  is_settings_tour_done: boolean;
}

async function getTourProgress(): Promise<TourProgressData> {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-progress/`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return {
      is_header_tour_done:   false,
      is_sync_tour_done:     false,
      is_manage_tour_done:   false,
      is_settings_tour_done: false,
    };
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message;
  }
}

function useGetTourProgress() {
  return useQuery(['tourProgressCache'], () => getTourProgress(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
}

export default useGetTourProgress;
