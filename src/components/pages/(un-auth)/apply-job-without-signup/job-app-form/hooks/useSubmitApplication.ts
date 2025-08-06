import { useMutation } from '@tanstack/react-query';

async function submitApplication(data: any) {
  try {
    const finalData = {
      firstname: data.firstName,
      middlename: data.middleName,
      lastname: data.lastName,
      email: data.email,
      mobile: data.mobileNo,
      address: data.address,
      nationality: data.nationality,
      gender: data.gender,
      religion: data.religion,
      portfolio_url: data.portfolio,
      work_experience: data.exp || data.experiences || [],
      setup_preference: (data.setupPreference || '').join(),
      expected_salary: data.expected_salary,
      educational_attainment: data.educationalAttainment,
      college: data.college,
      skills: data.skills,
      education: data.education,
    };
    const formData = new FormData();
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
      formData.append('skills', data.skills.join(','));
    }
    if (data.education && Array.isArray(data.education) && data.education.length > 0) {
      formData.append('education', data.education.join(','));
    }
    formData.append('application_form', JSON.stringify(finalData));
    formData.append('job_posting', data.jobPosting);
    if (data.profilePicture.length !== 0) {
      formData.append('photo', data.profilePicture[0]);
    }
    if (data.resume.length !== 0) {
      formData.append('resume', data.resume[0]);
    }
    const config = {
      method: 'POST',
      headers: {},
      body: formData,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/applications/`, config);
    if (!res.ok) {
      const error = res.json();
      (error as any).status = res.status; // Attach the status code to the error
      throw error;
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw `${err.status}: ${errStringify.message}`;
  }
}

function useSubmitApplication() {
  const query = useMutation((data: any) => submitApplication(data));
  return query;
}

export default useSubmitApplication;
