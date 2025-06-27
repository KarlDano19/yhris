import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function availTrialPeriod(plan_id: any) {
  try {
    const payloads = {
      plan_id: plan_id,
    };
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payloads),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/trial/`, config);
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

function useAvailTrialPeriod() {
  const query = useMutation((plan_id: any) => availTrialPeriod(plan_id));
  return query;
}

export default useAvailTrialPeriod;
