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
      work_experience: data.exp,
      setup_preference: (data.setupPreference || '').join(),
    };
    
    // Add screening question answers if they exist
    if (data.screeningAnswers) {
      finalData['screening_answers'] = data.screeningAnswers;
    }
    
    const formData = new FormData();
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

export default function useSubmitApplication() {
  return useMutation({
    mutationFn: submitApplication,
  });
}
