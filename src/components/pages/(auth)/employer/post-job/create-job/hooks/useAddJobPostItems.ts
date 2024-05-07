import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addJobPost(jobPost: any) {
  try {
    const token = getCookie('token');
    const data = new FormData();
    data.append('country', jobPost.country);
    data.append('language', jobPost.language);
    data.append('job_title', jobPost.jobTitle);
    data.append('advertise_to', jobPost.placeAdvertise);
    data.append('job_type', jobPost.jobType.join());
    data.append('job_schedule', jobPost.schedule.join());
    data.append('required_slot', jobPost.hireCount.toString());
    data.append('date_required', new Date(jobPost.hireDate).toISOString());
    data.append('job_description', jobPost.jobDescription);
    data.append('qualifications', jobPost.qualifications);
    data.append('poster_type', jobPost.postAs);
    data.append('shared_to', jobPost.postIn.join());
    data.append('og_url', `${window.location.protocol}//${window.location.host}/jobs/`);
    data.append('og_type', 'article');
    data.append('og_title', jobPost.jobTitle);
    data.append('og_description', 'This is just a test');
    data.append('og_image_width', '300');
    data.append('og_image_height', '300');

    if (jobPost.jobDescriptionFile.length) {
      data.append('uploaded_job_description', jobPost.jobDescriptionFile);
    }
    if (jobPost.postAs == 'upload' && jobPost.postAsUpload) {
      data.append('uploaded_custom_poster', jobPost.postAsUpload);
    }

    if (jobPost.salary && jobPost.rate) {
      data.append('salary_range_type', jobPost.salary.salaryType);
      data.append('rate', jobPost.rate);
      if (jobPost.salary.salaryType == 'Range') {
        let salaryRangeMin = jobPost.salary.salaryRangeMin;
        let salaryRangeMax = jobPost.salary.salaryRangeMax;
        data.append('minimum_amount', salaryRangeMin);
        data.append('maximum_amount', salaryRangeMax);
      } else {
        let salaryValue = jobPost.salary.salaryValue;
        data.append('exact_amount', salaryValue);
      }
    } else {
      data.append('salary_range_type', '');
      data.append('rate', '');
      data.append('minimum_amount', '');
      data.append('exact_amount', '');
    }
    if (jobPost.benefits) {
      data.append('offered_benefits', jobPost.benefits.join());
    } else {
      data.append('offered_benefits', '');
    }

    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: data,
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
