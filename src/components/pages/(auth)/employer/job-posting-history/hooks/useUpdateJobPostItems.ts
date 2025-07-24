import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateJobPost(jobPost: any, job_post_id: string) {
  try {
    const token = getCookie('token');
    const formData = new FormData();
    
    // Basic job details
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
    formData.append('job_remark', jobPost.notesRemarks);
    formData.append('job_url', jobPost.jobUrl);
    formData.append('poster_type', jobPost.postAs);
    
    // Show/hide flags
    formData.append('is_show_roles', jobPost.is_show_roles === true ? 'true' : 'false');
    formData.append('is_show_remarks', jobPost.is_show_remarks === true ? 'true' : 'false');
    formData.append('is_show_salary', jobPost.is_show_salary === true ? 'true' : 'false');
    formData.append('is_show_benefits', jobPost.is_show_benefits === true ? 'true' : 'false');
    
    // Handle both postIn and shared_to properties for platform sharing
    if (jobPost.postIn && Array.isArray(jobPost.postIn)) {
      formData.append('shared_to', jobPost.postIn.join());
    } else if (jobPost.shared_to && Array.isArray(jobPost.shared_to)) {
      formData.append('shared_to', jobPost.shared_to.join());
    } else if (typeof jobPost.shared_to === 'string') {
      formData.append('shared_to', jobPost.shared_to);
    } else {
      formData.append('shared_to', '');
    }
    
    formData.append('og_url', `${window.location.protocol}//${window.location.host}/jobs/`);
    formData.append('og_type', 'article');
    formData.append('og_title', jobPost.jobTitle);
    formData.append('og_description', `We are urgently seeking a talented ${jobPost.jobTitle}. Don't miss this opportunity, click here to apply now!`);
    formData.append('og_image_width', '300');
    formData.append('og_image_height', '300');

    // File uploads
    if (jobPost.jobDescriptionFile?.length) {
      formData.append('uploaded_job_description', jobPost.jobDescriptionFile);
    }
    if (jobPost.postAs == 'upload' && jobPost.postAsUpload) {
      formData.append('uploaded_custom_poster', jobPost.postAsUpload);
    }

    // Salary information
    if (jobPost.salary && jobPost.rate) {
      formData.append('salary_range_type', jobPost.salary.salaryType);
      formData.append('rate', jobPost.rate);
      if (jobPost.salary.salaryType == 'Range') {
        formData.append('minimum_amount', jobPost.salary.salaryRangeMin);
        formData.append('maximum_amount', jobPost.salary.salaryRangeMax);
      } else {
        formData.append('exact_amount', jobPost.salary.salaryValue);
      }
    } else {
      formData.append('salary_range_type', '');
      formData.append('rate', '');
      formData.append('minimum_amount', '');
      formData.append('exact_amount', '');
    }
    
    // Benefits
    if (jobPost.benefits) {
      formData.append('offered_benefits', jobPost.benefits.join());
    } else {
      formData.append('offered_benefits', '');
    }

    // Add screening questions and auto-reject settings
    if (jobPost.screeningQuestions && Array.isArray(jobPost.screeningQuestions) && jobPost.screeningQuestions.length > 0) {
      // Format questions to match backend expectations
      const formattedQuestions = jobPost.screeningQuestions.map((q: any) => ({
        id: q.id, // Preserve the ID
        question: q.question,
        idealAnswer: q.idealAnswer,
        responseType: q.responseType,
        mustHave: q.mustHave,
        // Only include degree if it exists
        ...(q.degree ? { degree: q.degree } : {}),
        // Include presetId if it exists
        ...(q.presetId ? { presetId: q.presetId } : {})
      }));
      
      // Convert to JSON string for backend
      formData.append('screening_questions', JSON.stringify(formattedQuestions));
    } else {
      // Send empty array if no questions
      formData.append('screening_questions', JSON.stringify([]));
    }
    
    // Auto-reject setting
    if (jobPost.autoRejectEnabled !== undefined) {
      formData.append('auto_reject_enabled', jobPost.autoRejectEnabled.toString());
    } else {
      formData.append('auto_reject_enabled', 'true');
    }
    
    const config = {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${job_post_id}/`, config);
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

function useUpdateJobPostItems() {
  const query = useMutation((props: any) => updateJobPost(props.jobPost, props.job_post_id));

  return query;
}

export default useUpdateJobPostItems;
