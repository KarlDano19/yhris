import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_EmployerProfile } from '@/types/globals';

async function saveProfile(profile: T_EmployerProfile) {
  try {
    const token = getCookie('token');
    const formData = new FormData();
    formData.append('name', profile.companyName);
    formData.append('description', profile.companyDescription);
    formData.append('type_of_industry', profile.typeOfIndustry);
    formData.append('work_set_up', profile.workSetUp);
    formData.append('email', profile.email);
    formData.append('mobile_number', profile.mobileNumber);
    formData.append('landline_number', profile.landlineNumber);
    formData.append('region', profile.region);
    formData.append('province', profile.province);
    formData.append('city', profile.city);
    formData.append('locality', profile.locality);
    formData.append('building', profile.building);
    formData.append('street', profile.street);
    formData.append('country', profile.country);
    formData.append('zip_code', profile.zipCode);
    formData.append('language', profile.language);
    formData.append('currency', profile.currency);
    if (profile.timezone) {
      formData.append('timezone', profile.timezone);
    }
    if (profile.timeFormat) {
      formData.append('time_format', profile.timeFormat);
    }
    if (profile.companyLogo) {
      formData.append('logo', profile.companyLogo);
    }
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/employers/profiles/`,
      config
    );
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.formData.message;
    }
    throw errStringify.message;
  }
}

function useSavedProfile() {
  const query = useMutation((profile: T_EmployerProfile) =>
    saveProfile(profile)
  );
  return query;
}

export default useSavedProfile;
