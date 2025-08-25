import AddressEmployeeIssueLogo from '@/svg/AddressEmployeeIssueLogo';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function saveApplicantProfile(data: any) {
  try {
    // Bundle all fields into a single object, including work_experience
    const finalData = {
      firstname: data.firstname,
      middlename: data.middlename,
      lastname: data.lastname,
      email: data.email,
      about: data.about,
      birth_date: data.birthDay ? data.birthDay.toLocaleDateString('en-CA') : undefined,
      age: data.age,
      gender: data.gender,
      religion: data.religion,
      nationality: data.nationality,
      civil_status: data.civilStatus,
      address: data.address,
      mobile: data.mobile,
      landline: data.landLineNo,
      contact_person_name: data.contactPersonName,
      contact_person_address: data.contactPersonAddress,
      contact_person_mobile: data.contactPersonContactNo,
      contact_person_relationship: data.contactPersonRelationship,
      contact_person_age: data.contactPersonAge,
      education: data.education,
      college: data.college,
      expected_salary: data.expected_salary,
      skills: data.skills,
      educational_attainment: data.educationalAttainment,
      work_experience: data.exp || data.experiences || [],
    };
    const formData = new FormData();
    formData.append('profile_form', JSON.stringify(finalData));
    if (data.profilePicture && data.profilePicture.length !== 0) {
      formData.append('photo', data.profilePicture[0]);
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
