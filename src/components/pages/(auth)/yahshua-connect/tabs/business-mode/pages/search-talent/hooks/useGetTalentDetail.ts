import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Interface matching the backend ApplicantRetrieveProfileSerializer exactly
export interface TalentDetail {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  name: string; // Combined: "firstname lastname"
  email: string;
  mobile: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  landline: string | null;
  birth_date: string | null;
  nationality: string | null;
  gender: string | null;
  age: number | null;
  religion: string | null;
  civil_status: string | null;
  contact_person_name: string | null;
  contact_person_address: string | null;
  contact_person_mobile: string | null;
  contact_person_relationship: string | null;
  contact_person_age: number | null;
  portfolio_url: string | null;
  photo: string | null; // Full URL with MEDIA_URL prefix
  cv: string | null; // Full URL with MEDIA_URL prefix
  work_experience: any[]; // Always array, never null
  screening_answers: any[]; // Always array, never null
  setup_preference: string | null;
  certifications: any[]; // Always array, never null
  portfolio: any[]; // Always array, never null
  medical_certificate: string | null; // Full URL with MEDIA_URL prefix
  certificate_of_employment: string | null; // Full URL with MEDIA_URL prefix
  birth_certificate: string | null; // Full URL with MEDIA_URL prefix
  diploma: string | null; // Full URL with MEDIA_URL prefix
  transcript_of_records: string | null; // Full URL with MEDIA_URL prefix
  nbi_police_clearance: string | null; // Full URL with MEDIA_URL prefix
  skills: string[]; // Always array, never null
  education: string | null;
  college: string | null;
  education_start_date: string | null;
  education_end_date: string | null;
  expected_salary: number | null;
  educational_attainment: string | null;
  description: string | null;
  is_active: boolean;
  available_for_bookings: boolean;
  average_rating: number;
  reviews_count: number;
  jobs_done_count: number;
  profile_completion_percentage: number;
}

async function getTalentDetail(applicantId: number): Promise<TalentDetail> {
  try {
    const token = getCookie('token');
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/${applicantId}/`,
      config
    );

    if (!res.ok) {
      throw await res.json();
    }

    const response = await res.json();
    return response.data || response;
  } catch (error: any) {
    if (error?.detail) {
      throw error.detail;
    }
    throw error.message || 'Failed to fetch talent details';
  }
}

export function useGetTalentDetail(applicantId: number | null, enabled: boolean = true) {
  const query = useQuery(
    ['talentDetailCache', applicantId],
    () => getTalentDetail(applicantId!),
    {
      enabled: enabled && applicantId !== null,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );
  return query;
}

export default useGetTalentDetail;
