import { T_EmployerProfile } from '@/types/globals';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie } from 'cookies-next';

async function saveProfile(profile: T_EmployerProfile) {
  try {
    const token = getCookie('token');
    const data = new FormData();
    data.append('name', profile.companyName);
    data.append('description', profile.companyDescription);
    data.append('type_of_industry', profile.typeOfIndustry);
    data.append('no_of_employees', profile.noOfEmployees);
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
      data.append('img', profile.companyLogo);
    }
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': `Token ${token}`,
      },
    };
    const res = await axios.post(
      `${process.env.hostName}/api/employer-profile/`,
      data,
      config
    );
    return res.data;
  } catch (err: any) {
    if (Object.hasOwn(err, 'response')) {
      throw err.response.data.message;
    }
    throw err.message;
  }
}

function useSavedProfile() {
  const query = useMutation((profile: T_EmployerProfile) =>
    saveProfile(profile)
  );
  return query;
}

export default useSavedProfile;
