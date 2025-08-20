import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface EmailData {
  applicant: number;
  to_email: string;
  cc_email?: string;
  bcc_email?: string;
  subject: string;
  body: string;
  scheduled_date?: string | null;
}

async function addEmail(data: EmailData) {
  try {
    const token = getCookie('token');

    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicants/talent-email/`, config);
    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }
    return res.json();
  } catch (err: any) {
    if (err && typeof err === 'object' && 'message' in err) {
      throw err.message;
    }
    throw 'An error occurred while sending the email';
  }
}

function useAddEmail() {
  const query = useMutation((data: EmailData) => addEmail(data));

  return query;
}

export default useAddEmail;
