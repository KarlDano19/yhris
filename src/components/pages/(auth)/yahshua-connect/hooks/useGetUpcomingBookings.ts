import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export interface UpcomingBooking {
  // Application details
  application_id: number;
  application_status: string;
  application_work_status: 'not_started' | 'started' | 'completed';
  application_started_at: string | null;
  application_completed_at: string | null;
  application_payment_status: 'pending' | 'paid' | 'cancelled';
  application_payment_amount: number | null;
  application_created_at: string;
  application_updated_at: string;

  // Job posting details
  id: number;
  job_title: string;
  category: string | null;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  budget_type: 'fixed_rate' | 'hourly_rate';
  min_amount: number | null;
  max_amount: number | null;
  hourly_rate: number | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  date: string | null;
  time_from: string | null;
  time_to: string | null;
  status: string;
  is_urgent: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Client (job poster) information
  client_id: number | null;
  client_name: string | null;
  client_email: string | null;
  client_mobile: string | null;
  client_rating: number | null;
  client_reviews_count: number | null;
  client_photo: string | null;

  // Distance info (if location provided)
  distance_km: number | null;
}

async function getUpcomingBookings(): Promise<UpcomingBooking[]> {
  try {
    const token = getCookie('token');

    if (!token) {
      return [];
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/upcoming-bookings/`;

    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const res = await fetch(url, config);

    if (!res.ok) {
      throw res.json();
    }

    const response = await res.json();
    return response.data || response;
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.detail;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message;
  }
}

function useGetUpcomingBookings() {
  const query = useQuery(
    ['upcomingBookingsCache'],
    () => getUpcomingBookings(),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetUpcomingBookings;
