import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface GenerateSeparationLetterData {
  separation_id: number;
  letter_type: 'Acceptance' | 'Separation';
  message: string;
  approved_by?: string;
}

async function generateSeparationLetter(data: GenerateSeparationLetterData) {
  try {
    const token = getCookie('token');
    
    const payload = {
      letter_type: data.letter_type,
      message: data.message,
      approved_by: data.approved_by,
    };

    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/separation/${data.separation_id}/generate-letter/`,
      config
    );

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

function useGenerateSeparationLetter() {
  const query = useMutation((data: GenerateSeparationLetterData) => generateSeparationLetter(data));
  return query;
}

export default useGenerateSeparationLetter;