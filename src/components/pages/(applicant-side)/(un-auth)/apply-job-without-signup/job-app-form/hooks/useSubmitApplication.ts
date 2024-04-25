import { useMutation } from '@tanstack/react-query';

async function submitApplication(data: any) {
  try {
    const finalData = {
      "firstname": data.firstName,
      "middlename": data.middleName,
      "lastname": data.lastName,
      "email": data.email,
      "mobile": data.mobileNo,
      "address": data.address,
      "nationality": data.nationality,
      "gender": data.gender,
      "religion": data.religion,
      "portfolio_url": data.portfolio,
      "work_experience": data.exp,
      "setup_preference": (data.setupPreference || '').join()
    }
    const formData = new FormData();
    formData.append('applicant_form', JSON.stringify(finalData));
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/submit-application/`,
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

function useSubmitApplication() {
  const query = useMutation((data: any) => submitApplication(data));
  return query;
}

export default useSubmitApplication;
