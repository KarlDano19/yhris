import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateApplicantProfile(data: any) {
  try {
    // Bundle all fields into a single object
    const finalData: any = {};

    // Basic Information
    if (data.firstname !== undefined) finalData.firstname = data.firstname;
    if (data.middlename !== undefined) finalData.middlename = data.middlename;
    if (data.lastname !== undefined) finalData.lastname = data.lastname;
    // Email is not editable, so we don't include it in the update
    if (data.mobile !== undefined) finalData.mobile = data.mobile;
    if (data.address !== undefined) finalData.address = data.address;
    if (data.landline !== undefined) finalData.landline = data.landline;
    if (data.birth_date !== undefined) finalData.birth_date = data.birth_date;
    if (data.nationality !== undefined) finalData.nationality = data.nationality;
    if (data.gender !== undefined) finalData.gender = data.gender;
    if (data.age !== undefined) finalData.age = data.age;
    if (data.religion !== undefined) finalData.religion = data.religion;
    if (data.civil_status !== undefined) finalData.civil_status = data.civil_status;

    // Contact Person Information
    if (data.contact_person_name !== undefined) finalData.contact_person_name = data.contact_person_name;
    if (data.contact_person_address !== undefined) finalData.contact_person_address = data.contact_person_address;
    if (data.contact_person_mobile !== undefined) finalData.contact_person_mobile = data.contact_person_mobile;
    if (data.contact_person_relationship !== undefined) finalData.contact_person_relationship = data.contact_person_relationship;
    if (data.contact_person_age !== undefined) finalData.contact_person_age = data.contact_person_age;

    // Education Information
    if (data.education !== undefined) finalData.education = data.education;
    if (data.college !== undefined) finalData.college = data.college;
    if (data.educational_attainment !== undefined) finalData.educational_attainment = data.educational_attainment;
    if (data.education_start_date !== undefined) finalData.education_start_date = data.education_start_date;
    if (data.education_end_date !== undefined) finalData.education_end_date = data.education_end_date;

    // Employment Information
    if (data.work_experience !== undefined) finalData.work_experience = data.work_experience;
    if (data.portfolio !== undefined) finalData.portfolio = data.portfolio;
    if (data.portfolio_url !== undefined) finalData.portfolio_url = data.portfolio_url;
    if (data.certifications !== undefined) finalData.certifications = data.certifications;
    if (data.skills !== undefined) finalData.skills = data.skills;
    if (data.employment_documents !== undefined) finalData.employment_documents = data.employment_documents;

    // Salary Information
    if (data.expected_salary !== undefined) finalData.expected_salary = data.expected_salary;

    // About/Description
    if (data.description !== undefined) finalData.description = data.description;

    const formData = new FormData();
    formData.append('profile_form', JSON.stringify(finalData));

    if (data.photo && data.photo.length !== 0) {
      formData.append('photo', data.photo[0]);
    }

    // Employment document file uploads
    if (data.medical_certificate) {
      formData.append('medical_certificate', data.medical_certificate);
    }
    if (data.certificate_of_employment) {
      formData.append('certificate_of_employment', data.certificate_of_employment);
    }
    if (data.birth_certificate) {
      formData.append('birth_certificate', data.birth_certificate);
    }
    if (data.diploma) {
      formData.append('diploma', data.diploma);
    }
    if (data.transcript_of_records) {
      formData.append('transcript_of_records', data.transcript_of_records);
    }
    if (data.nbi_police_clearance) {
      formData.append('nbi_police_clearance', data.nbi_police_clearance);
    }

    // Certification proof file uploads
    if (data.certificationProofFiles) {
      Object.keys(data.certificationProofFiles).forEach((key) => {
        const file = data.certificationProofFiles[key];
        if (file instanceof File) {
          formData.append(key, file);
        }
      });
    }

    // Portfolio image file uploads
    if (data.portfolioImageFiles) {
      Object.keys(data.portfolioImageFiles).forEach((key) => {
        const file = data.portfolioImageFiles[key];
        if (file instanceof File) {
          formData.append(key, file);
        }
      });
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
      throw await res.json();
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

function useUpdateApplicantProfile() {
  const queryClient = useQueryClient();
  const mutation = useMutation((data: any) => updateApplicantProfile(data), {
    onSuccess: () => {
      // Invalidate and refetch applicant profile after successful update
      queryClient.invalidateQueries(['applicantProfileCache']);
    },
  });
  return mutation;
}

export default useUpdateApplicantProfile;

