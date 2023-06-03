import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_Benefit } from '@/types/globals';

async function addBenefit(benefit: T_Benefit) {
  try {
    const token = getCookie('token');
    const data = {
        title: benefit.title,
        to: benefit.email,
        purpose: benefit.purpose,
        benefits: benefit.benefits,
        coverage: benefit.coverage,
        eligibility: benefit.eligibility,
        cc: benefit.cc,
        bcc: benefit.bcc,
    };
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.hostName}/api/benefits/`, config);
    if (res.ok) {
      return res.json();
    }
    throw res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useAddBenefitItems() {
  const query = useMutation((benefit: T_Benefit) =>
  addBenefit(benefit)
  );

  return query;
}

export default useAddBenefitItems;
