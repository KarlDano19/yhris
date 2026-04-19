import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Transform work experience to API format
const transformWorkExperience = (workExp: any[]) => {
  if (!workExp || !Array.isArray(workExp)) return [];

  return workExp.map((exp: any) => {
    // Helper to convert Date or string to ISO format
    const formatDate = (date: any): string | null => {
      if (!date) return null;
      if (date instanceof Date) {
        if (isNaN(date.getTime())) return null;
        return date.toISOString();
      }
      if (typeof date === 'string' && date.trim()) {
        try {
          const parsed = new Date(date);
          if (!isNaN(parsed.getTime())) {
            return parsed.toISOString();
          }
        } catch {
          return null;
        }
      }
      return null;
    };

    // Check if dateTo/endDate is empty - if so, they are currently employed
    const endDateValue = exp.dateTo || exp.endDate;
    const hasNoEndDate = !endDateValue || (endDateValue instanceof Date && isNaN(endDateValue.getTime()));
    const isCurrentlyEmployed = exp.current || exp.currentlyEmployed || hasNoEndDate;

    return {
      position: exp.position || exp.title || '',
      companyOrg: exp.companyOrg || exp.company || '',
      dateFrom: formatDate(exp.dateFrom || exp.startDate),
      dateTo: isCurrentlyEmployed ? null : formatDate(endDateValue),
      currentlyEmployed: isCurrentlyEmployed,
      responsibilities: exp.responsibilities || exp.description || '',
    };
  });
};

async function saveApplicantProfile(data: any) {
  try {
    // Extract nested basicInfo and education objects
    const basicInfo = data.basicInfo || {};
    const education = data.education || {};

    // Bundle all fields into a single object, mapping nested structure to API fields
    const finalData = {
      firstname: basicInfo.firstname || data.firstname,
      middlename: basicInfo.middlename || data.middlename,
      lastname: basicInfo.lastname || data.lastname,
      email: basicInfo.email || data.email,
      description: basicInfo.about || data.about,
      birth_date: basicInfo.birthday ? basicInfo.birthday.toLocaleDateString('en-CA') : (data.birthDay ? data.birthDay.toLocaleDateString('en-CA') : undefined),
      age: basicInfo.age || data.age,
      gender: basicInfo.gender || data.gender,
      religion: basicInfo.religion || data.religion,
      nationality: basicInfo.nationality || data.nationality,
      civil_status: basicInfo.civilStatus || data.civilStatus,
      address: basicInfo.address || data.address,
      mobile: basicInfo.phone || data.mobile,
      landline: basicInfo.landline || data.landLineNo,
      contact_person_name: basicInfo.contactPersonName || data.contactPersonName,
      contact_person_address: basicInfo.contactPersonAddress || data.contactPersonAddress,
      contact_person_mobile: basicInfo.contactPersonMobile || data.contactPersonContactNo,
      contact_person_relationship: basicInfo.contactPersonRelationship || data.contactPersonRelationship,
      contact_person_age: basicInfo.contactPersonAge || data.contactPersonAge,
      education: education.degree || (typeof data.education === 'string' ? data.education : ''),
      college: education.school || data.college,
      educational_attainment: education.educationalAttainment || data.educationalAttainment,
      education_start_date: education.startYear ? `${education.startYear}-01-01` : (data.education_start_date ? `${data.education_start_date}-01-01` : undefined),
      education_end_date: education.endYear ? `${education.endYear}-01-01` : (data.education_end_date ? `${data.education_end_date}-01-01` : undefined),
      expected_salary: basicInfo.expectedSalary || data.expected_salary,
      skills: data.skills,
      certifications: data.certifications,
      portfolio: data.portfolio,
      employment_documents: data.employmentDocuments,
      work_experience: transformWorkExperience(data.exp || data.workExperience || data.experiences || []),
    };

    const formData = new FormData();
    formData.append('profile_form', JSON.stringify(finalData));

    // Handle profile picture upload - check both new nested structure and old flat structure
    const profilePicture = basicInfo.photo || data.profilePicture;
    if (profilePicture) {
      if (profilePicture instanceof File) {
        formData.append('photo', profilePicture);
      } else if (Array.isArray(profilePicture) && profilePicture.length > 0) {
        formData.append('photo', profilePicture[0]);
      }
    }

    // Employment document file uploads
    if (data.employmentDocuments && Array.isArray(data.employmentDocuments)) {
      data.employmentDocuments.forEach((doc: any) => {
        if (doc.file && doc.file instanceof File) {
          // Map document IDs to API field names
          const fieldMap: Record<string, string> = {
            'medical-certificate': 'medical_certificate',
            'certificate-of-employment': 'certificate_of_employment',
            'birth-certificate': 'birth_certificate',
            'diploma': 'diploma',
            'transcript-of-records': 'transcript_of_records',
            'nbi-police-clearance': 'nbi_police_clearance',
          };
          const fieldName = fieldMap[doc.id];
          if (fieldName) {
            formData.append(fieldName, doc.file);
          }
        }
      });
    }

    // Certification proof file uploads
    if (data.certifications && Array.isArray(data.certifications)) {
      data.certifications.forEach((cert: any, index: number) => {
        if (cert.proofFile && cert.proofFile instanceof File) {
          formData.append(`certification_proof_${index}`, cert.proofFile);
        }
      });
    }

    // Portfolio image file uploads
    if (data.portfolio && Array.isArray(data.portfolio)) {
      data.portfolio.forEach((project: any, index: number) => {
        if (project.imageFile && project.imageFile instanceof File) {
          formData.append(`portfolio_image_${index}`, project.imageFile);
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
  const queryClient = useQueryClient();
  const mutation = useMutation((data: any) => saveApplicantProfile(data), {
    onSuccess: () => {
      // Invalidate and refetch applicant profile after successful save
      queryClient.invalidateQueries(['applicantProfileCache']);
    },
  });
  return mutation;
}

export default useSaveApplicantProfile;
