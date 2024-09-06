import AddressEmployeeIssueLogo from '@/svg/AddressEmployeeIssueLogo';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function saveApplicantProfile(data: any) {
  try {
    const formData = new FormData();
    formData.append('firstname', data.firstname);
    formData.append('lastname', data.lastname);
    formData.append('gender', data.gender);
    formData.append('religion', data.religion);
    formData.append('nationality', data.nationality);
    formData.append('civil_status', data.civilStatus);
    formData.append('address', data.address);
    formData.append('mobile', data.mobile);
    formData.append('contact_person_name', data.contactPersonName);
    formData.append('contact_person_address', data.contactPersonAddress);
    formData.append('contact_person_mobile', data.contactPersonContactNo);
    formData.append('contact_person_relationship', data.contactPersonRelationship);
    if (data.profilePicture.length !== 0) {
      formData.append('photo', data.profilePicture[0]);
    }
    if (data.about) {
      formData.append('about', data.about);
    }
    if (data.middlename) {
      formData.append('middlename', data.middlename);
    }
    if (data.birthday) {
      formData.append('birth_date', data.birthday);
    }
    if (data.landLineNo) {
      formData.append('landline', data.landLineNo);
    }
    const token = getCookie('token');
    const config = {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicants/profiles/`, config);
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

function useSaveApplicantProfile() {
  const query = useMutation((data: any) => saveApplicantProfile(data));
  return query;
}

export default useSaveApplicantProfile;
