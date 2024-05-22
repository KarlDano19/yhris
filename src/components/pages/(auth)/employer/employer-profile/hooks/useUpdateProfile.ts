import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_EmployerProfile } from '@/types/globals';

async function updateProfile(profile: T_EmployerProfile) {
  try {
    const token = getCookie('token');
    const data = new FormData();
    data.append('name', profile.companyName);
    data.append('description', profile.companyDescription);
    data.append('type_of_industry', profile.typeOfIndustry);
    data.append('work_set_up', profile.workSetUp);
    data.append('email', profile.email);
    data.append('mobile_number', profile.mobileNumber);
    data.append('landline_number', profile.landlineNumber);
    data.append('building', profile.building);
    data.append('street', profile.street);
    data.append('locality', profile.locality);
    data.append('city', profile.city);
    data.append('zip_code', profile.zipCode);
    data.append('country', profile.country);
    data.append('language', profile.language);
    data.append('currency', profile.currency);
    if (profile.companyLogo) {
      data.append('logo_file', profile.companyLogo);
    }
    const config = {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: data,
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

function useupdateProfile() {
  const query = useMutation((profile: T_EmployerProfile) => updateProfile(profile));
  return query;
}

export default useupdateProfile;
