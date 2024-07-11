import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addJobPost(jobPost: any) {
  try {
    const token = getCookie('token');
    const formData = new FormData();
    formData.append('country', jobPost.country);
    formData.append('language', jobPost.language);
    formData.append('job_title', jobPost.jobTitle);
    formData.append('advertise_to', jobPost.placeAdvertise);
    formData.append('job_type', jobPost.jobType.join());
    formData.append('job_schedule', jobPost.schedule.join());
    formData.append('required_slot', jobPost.hireCount.toString());
    formData.append('date_required', new Date(jobPost.hireDate).toISOString());
    formData.append('job_description', jobPost.jobDescription);
    formData.append('qualifications', jobPost.qualifications);
    formData.append('poster_type', jobPost.postAs);
    formData.append('shared_to', jobPost.postIn.join());
    formData.append('og_url', `${window.location.protocol}//${window.location.host}/jobs/`);
    formData.append('og_type', 'article');
    formData.append('og_title', jobPost.jobTitle);
    formData.append('og_description', `We are urgently seeking a talented ${jobPost.jobTitle}. Don't miss this opportunity, click here to apply now!`);
    formData.append('og_image_width', '300');
    formData.append('og_image_height', '300');

    if (jobPost.jobDescriptionFile.length) {
      formData.append('uploaded_job_description', jobPost.jobDescriptionFile);
    }
    if (jobPost.postAs == 'upload' && jobPost.postAsUpload) {
      formData.append('uploaded_custom_poster', jobPost.postAsUpload);
    }

    if (jobPost.salary && jobPost.rate) {
      formData.append('salary_range_type', jobPost.salary.salaryType);
      formData.append('rate', jobPost.rate);
      if (jobPost.salary.salaryType == 'Range') {
        let salaryRangeMin = jobPost.salary.salaryRangeMin;
        let salaryRangeMax = jobPost.salary.salaryRangeMax;
        formData.append('minimum_amount', salaryRangeMin);
        formData.append('maximum_amount', salaryRangeMax);
      } else {
        let salaryValue = jobPost.salary.salaryValue;
        formData.append('exact_amount', salaryValue);
      }
    } else {
      formData.append('salary_range_type', '');
      formData.append('rate', '');
      formData.append('minimum_amount', '');
      formData.append('exact_amount', '');
    }
    if (jobPost.benefits) {
      formData.append('offered_benefits', jobPost.benefits.join());
    } else {
      formData.append('offered_benefits', '');
    }

    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/`, config);
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

function useAddJobPostItems() {
  const query = useMutation((jobPost: any) => addJobPost(jobPost));

  return query;
}

export default useAddJobPostItems;
