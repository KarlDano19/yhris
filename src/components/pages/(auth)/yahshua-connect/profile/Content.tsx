'use client';

import { useState, useEffect } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useGetApplicantProfile from '../hooks/useGetApplicantProfile';
import useUpdateApplicantProfile from './hooks/useUpdateApplicantProfile';
import BasicInformationModal from './modals/BasicInformationModal';
import ContactInformationModal from './modals/ContactInformationModal';
import WorkExperienceModal from './modals/WorkExperienceModal';
import EducationModal from './modals/EducationModal';
import SkillsAndCertificationModal from './modals/SkillsAndCertificationModal';
import PortfolioModal from './modals/PortfolioModal';
import EmploymentDocumentsModal from './modals/EmploymentDocumentsModal';
import AddWorkExperienceModal from './modals/AddWorkExperienceModal';
import AddCertificationModal from './modals/AddCertificationModal';
import AddProjectModal from './modals/AddProjectModal';
import LoadingSpinner from '@/components/LoadingSpinner';

import { ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

import { T_BasicInfo, T_WorkExperience, T_Education, T_Certification, T_Portfolio, T_EmploymentDocument } from '@/types/personal-mode';

const Content = () => {
  const [isBasicInfoModalOpen, setIsBasicInfoModalOpen] = useState(false);
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState(false);
  const [isWorkExperienceModalOpen, setIsWorkExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isSkillsCertModalOpen, setIsSkillsCertModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isEmploymentDocumentsModalOpen, setIsEmploymentDocumentsModalOpen] = useState(false);
  const [isAddWorkExperienceModalOpen, setIsAddWorkExperienceModalOpen] = useState(false);
  const [isAddCertificationModalOpen, setIsAddCertificationModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [editingWorkExperience, setEditingWorkExperience] = useState<T_WorkExperience | null>(null);
  const [localWorkExperience, setLocalWorkExperience] = useState<T_WorkExperience[]>([]);
  const [editingCertification, setEditingCertification] = useState<T_Certification | null>(null);
  const [editingProject, setEditingProject] = useState<T_Portfolio | null>(null);
  const [localSkills, setLocalSkills] = useState<string[]>([]);
  const [localCertifications, setLocalCertifications] = useState<T_Certification[]>([]);
  const [localPortfolio, setLocalPortfolio] = useState<T_Portfolio[]>([]);

  // Profile state
  const [basicInfo, setBasicInfo] = useState<T_BasicInfo>({
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    phone: '',
    landline: '',
    address: '',
    latitude: null,
    longitude: null,
    birthday: null,
    gender: '',
    religion: '',
    nationality: '',
    civilStatus: '',
    expectedSalary: null,
    contactPersonName: '',
    contactPersonAddress: '',
    contactPersonMobile: '',
    contactPersonRelationship: '',
    contactPersonAge: null,
    photo: null,
    photoUrl: null,
    about: '',
  });
  const [workExperience, setWorkExperience] = useState<T_WorkExperience[]>([]);
  const [education, setEducation] = useState<T_Education | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<T_Certification[]>([]);
  const [portfolio, setPortfolio] = useState<T_Portfolio[]>([]);
  const [employmentDocuments, setEmploymentDocuments] = useState<T_EmploymentDocument[]>([]);

  // Fetch applicant profile data
  const { data: applicantDetails, isLoading } = useGetApplicantProfile();
  const profileData = applicantDetails?.data || applicantDetails;

  // Update profile mutation
  const { mutate: updateProfile, isLoading: isUpdatingProfile } = useUpdateApplicantProfile();

  // Populate form data when profile data is loaded (similar to reference pattern)
  useEffect(() => {
    if (profileData) {
      // Set basic info
      setBasicInfo({
        firstname: profileData.firstname || '',
        middlename: profileData.middlename || '',
        lastname: profileData.lastname || '',
        email: profileData.email || '',
        phone: profileData.mobile || '',
        landline: profileData.landline || '',
        address: profileData.address || '',
        latitude: profileData.latitude || null,
        longitude: profileData.longitude || null,
        birthday: profileData.birth_date ? new Date(profileData.birth_date) : null,
        gender: profileData.gender || '',
        religion: profileData.religion || '',
        nationality: profileData.nationality || '',
        civilStatus: profileData.civil_status || '',
        expectedSalary: profileData.expected_salary || null,
        contactPersonName: profileData.contact_person_name || '',
        contactPersonAddress: profileData.contact_person_address || '',
        contactPersonMobile: profileData.contact_person_mobile || '',
        contactPersonRelationship: profileData.contact_person_relationship || '',
        contactPersonAge: profileData.contact_person_age || null,
        photo: null,
        photoUrl: profileData.photo || null,
        about: profileData.description || '',
      });

      // Transform and set work experience
      const formatMonthYear = (dateString: string | null) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          const month = date.toLocaleDateString('en-US', { month: 'short' });
          const year = date.getFullYear();
          return `${month} ${year}`;
        } catch {
          return '';
        }
      };

      const transformedWorkExperience = (profileData.work_experience || []).map((exp: any, index: number) => ({
        id: index + 1,
        title: exp.position || '',
        company: exp.companyOrg || '',
        startDate: formatMonthYear(exp.dateFrom),
        endDate: formatMonthYear(exp.dateTo),
        current: exp.currentlyEmployed || false,
        description: exp.responsibilities ? exp.responsibilities.replace(/<[^>]*>/g, '') : '',
      }));
      setWorkExperience(transformedWorkExperience);
      setLocalWorkExperience(transformedWorkExperience);

      // Transform and set education (single object, not array)
      const transformedEducation = (profileData.education || profileData.college) ? {
        educationalAttainment: profileData.educational_attainment || undefined,
        degree: profileData.education || '',
        school: profileData.college || '',
        startYear: profileData.education_start_date ? new Date(profileData.education_start_date).getFullYear().toString() : '',
        endYear: profileData.education_end_date ? new Date(profileData.education_end_date).getFullYear().toString() : '',
      } : null;
      setEducation(transformedEducation);

      // Set skills
      setSkills(profileData.skills || []);
      setLocalSkills(profileData.skills || []);

      // Transform and set certifications
      const transformedCertifications = (profileData.certifications || []).map((cert: any, index: number) => ({
        id: index + 1,
        name: cert.name || '',
        issuer: cert.issuer || '',
        issuedDate: cert.issuedDate || undefined,
        expiresDate: cert.expiresDate || undefined,
        idNumber: cert.idNumber || undefined,
        verified: cert.verified || false,
        proofUrl: cert.proofUrl || undefined,
      }));
      setCertifications(transformedCertifications);
      setLocalCertifications(transformedCertifications);

      // Transform and set portfolio
      const transformedPortfolio = (profileData.portfolio || []).map((item: any, index: number) => ({
        id: item.id || index + 1,
        name: item.name || '',
        description: item.description || undefined,
        link: item.link || '',
        image: item.image || undefined,
        imageUrl: item.image || undefined,
      }));
      setPortfolio(transformedPortfolio);
      setLocalPortfolio(transformedPortfolio);

      // Set employment documents
      const transformedEmploymentDocuments = [
        {
          id: 'medical-certificate',
          name: 'Medical Certificate',
          required: true,
          uploaded: !!profileData.medical_certificate,
          fileUrl: profileData.medical_certificate || undefined,
        },
        {
          id: 'certificate-of-employment',
          name: 'Certificate of Employment',
          required: true,
          uploaded: !!profileData.certificate_of_employment,
          fileUrl: profileData.certificate_of_employment || undefined,
        },
        {
          id: 'birth-certificate',
          name: 'Birth Certificate',
          required: true,
          uploaded: !!profileData.birth_certificate,
          fileUrl: profileData.birth_certificate || undefined,
        },
        {
          id: 'diploma',
          name: 'Diploma',
          required: true,
          uploaded: !!profileData.diploma,
          fileUrl: profileData.diploma || undefined,
        },
        {
          id: 'transcript-of-records',
          name: 'Transcript of Records (TOR)',
          required: true,
          uploaded: !!profileData.transcript_of_records,
          fileUrl: profileData.transcript_of_records || undefined,
        },
        {
          id: 'nbi-police-clearance',
          name: 'NBI/Police Clearance',
          required: true,
          uploaded: !!profileData.nbi_police_clearance,
          fileUrl: profileData.nbi_police_clearance || undefined,
        },
      ];
      setEmploymentDocuments(transformedEmploymentDocuments);
    }
  }, [profileData]);

  // Helper function to parse Date object or date string to ISO format (YYYY-MM-DD)
  const parseDateToISO = (date: Date | string | null): string => {
    if (!date) return '';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return '';
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  // Helper function to parse month/year string (e.g., "Jan 2022") to ISO format
  const parseMonthYearToISO = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}-01`;
    } catch {
      return '';
    }
  };


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return starValue <= rating ? (
        <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="h-5 w-5 text-gray-300" />
      );
    });
  };

  // Calculate section completion percentages
  const calculateBasicInfoCompletion = () => {
    const requiredFields = ['gender', 'religion', 'nationality', 'civilStatus'];
    const filledCount = requiredFields.filter(field => {
      const value = basicInfo[field as keyof T_BasicInfo];
      return value !== null && value !== undefined && value !== '';
    }).length;
    return Math.round((filledCount / requiredFields.length) * 100);
  };

  const calculateEducationCompletion = () => {
    if (!education) return 0;
    const requiredFields = ['educationalAttainment', 'degree', 'school', 'startYear', 'endYear'];
    const filledCount = requiredFields.filter(field => {
      const value = education[field as keyof T_Education];
      return value !== null && value !== undefined && value !== '';
    }).length;
    return Math.round((filledCount / requiredFields.length) * 100);
  };

  const calculateContactsCompletion = () => {
    const requiredFields = [
      'phone',
      'contactPersonName',
      'contactPersonAddress',
      'contactPersonAge',
      'contactPersonMobile',
      'contactPersonRelationship',
    ];
    const filledCount = requiredFields.filter(field => {
      const value = basicInfo[field as keyof T_BasicInfo];
      return value !== null && value !== undefined && value !== '';
    }).length;
    return Math.round((filledCount / requiredFields.length) * 100);
  };

  const calculateEmploymentDocumentsCompletion = () => {
    const uploadedCount = employmentDocuments.filter(doc => doc.uploaded).length;
    const totalDocuments = employmentDocuments.length;
    if (totalDocuments === 0) return 100;
    return Math.round((uploadedCount / totalDocuments) * 100);
  };

  // Render completion badge
  const renderCompletionBadge = (percentage: number) => {
    if (percentage === 100) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Complete
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        {percentage}% Complete
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading ? (
        <LoadingSpinner size="lg" showText text="Loading profile..." className="py-12" />
      ) : (
        /* Profile Sections */
        <div className="space-y-4">
        {/* Profile */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => setIsBasicInfoModalOpen(true)}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-800">Profile</span>
              {renderCompletionBadge(calculateBasicInfoCompletion())}
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => setIsEducationModalOpen(true)}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-800">Education</span>
              {renderCompletionBadge(calculateEducationCompletion())}
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>

        {/* Contacts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => setIsContactInfoModalOpen(true)}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-800">Contacts</span>
              {renderCompletionBadge(calculateContactsCompletion())}
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>

        {/* Employment Documents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => setIsEmploymentDocumentsModalOpen(true)}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-800">Employment Documents</span>
              {renderCompletionBadge(calculateEmploymentDocumentsCompletion())}
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>

        {/* Work Experience */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => {
              // Initialize local state when opening modal
              setLocalWorkExperience(workExperience);
              setIsWorkExperienceModalOpen(true);
            }}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <span className="text-lg font-semibold text-gray-800">Work Experience</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>

        {/* Skills & Certifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => {
              // Initialize local state when opening modal
              setLocalSkills(skills);
              setLocalCertifications(certifications);
              setIsSkillsCertModalOpen(true);
            }}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <span className="text-lg font-semibold text-gray-800">Skills & Certifications</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>

        {/* Portfolio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => {
              // Initialize local state when opening modal
              setLocalPortfolio(portfolio);
              setIsPortfolioModalOpen(true);
            }}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <span className="text-lg font-semibold text-gray-800">Portfolio</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>
        </div>
      )}

      {/* Profile Section Modals */}
      {isBasicInfoModalOpen && (
        <BasicInformationModal
          isOpen={isBasicInfoModalOpen}
          onClose={() => setIsBasicInfoModalOpen(false)}
          basicInfo={basicInfo}
          onSave={(data) => {
            const updateData: any = {
              firstname: data.firstname,
              middlename: data.middlename,
              lastname: data.lastname,
              address: data.address,
              latitude: data.latitude || null,
              longitude: data.longitude || null,
              birth_date: parseDateToISO(data.birthday),
              gender: data.gender,
              religion: data.religion,
              nationality: data.nationality,
              civil_status: data.civilStatus,
              expected_salary: data.expectedSalary || null,
              description: data.about || '',
            };

            // Handle photo upload
            if (data.photo) {
              updateData.photo = [data.photo];
            }

            updateProfile(updateData,
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Profile updated successfully' type='success' />, { duration: 4000 });
                  setIsBasicInfoModalOpen(false);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update profile'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
        />
      )}

      {isContactInfoModalOpen && (
        <ContactInformationModal
          isOpen={isContactInfoModalOpen}
          onClose={() => setIsContactInfoModalOpen(false)}
          basicInfo={basicInfo}
          onSave={(data) => {
            const updateData: any = {
              email: data.email,
              mobile: data.phone,
              landline: data.landline || '',
              contact_person_name: data.contactPersonName || '',
              contact_person_address: data.contactPersonAddress || '',
              contact_person_mobile: data.contactPersonMobile || '',
              contact_person_relationship: data.contactPersonRelationship || '',
              contact_person_age: data.contactPersonAge || null,
            };

            updateProfile(updateData,
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Contact information updated successfully' type='success' />, { duration: 4000 });
                  setIsContactInfoModalOpen(false);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update contact information'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
        />
      )}

      {isEmploymentDocumentsModalOpen && (
        <EmploymentDocumentsModal
          isOpen={isEmploymentDocumentsModalOpen}
          onClose={() => setIsEmploymentDocumentsModalOpen(false)}
          documents={employmentDocuments}
          onSave={(files) => {
            updateProfile(
              files,
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Employment documents updated successfully' type='success' />, { duration: 4000 });
                  setIsEmploymentDocumentsModalOpen(false);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update employment documents'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
        />
      )}

      {isWorkExperienceModalOpen && (
        <WorkExperienceModal
          isOpen={isWorkExperienceModalOpen}
          onClose={() => {
            setIsWorkExperienceModalOpen(false);
            // Reset local state when closing
            setLocalWorkExperience([]);
          }}
          workExperience={localWorkExperience.length > 0 ? localWorkExperience : workExperience}
          onEdit={(id, experience) => {
            setEditingWorkExperience(experience);
            setIsWorkExperienceModalOpen(false);
            setIsAddWorkExperienceModalOpen(true);
          }}
          onAdd={() => {
            setEditingWorkExperience(null);
            setIsWorkExperienceModalOpen(false);
            setIsAddWorkExperienceModalOpen(true);
          }}
          onSave={(data) => {
            // Transform to backend format
            const workExperienceBackend = data.map((exp: any) => {
              const parseDate = (dateStr: string) => {
                if (!dateStr) return null;
                try {
                  // Handle "Jan 2022" format
                  const date = new Date(dateStr);
                  return date.toISOString();
                } catch {
                  return null;
                }
              };
              return {
                position: exp.title,
                companyOrg: exp.company,
                dateFrom: parseDate(exp.startDate),
                dateTo: exp.current ? null : parseDate(exp.endDate),
                currentlyEmployed: exp.current,
                responsibilities: exp.description,
              };
            });

            updateProfile(
              {
                work_experience: workExperienceBackend,
              },
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Work experience updated successfully' type='success' />, { duration: 4000 });
                  setIsWorkExperienceModalOpen(false);
                  // Sync the local state with the saved state
                  setWorkExperience(data);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update work experience'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
          onUpdateLocal={(data) => {
            setLocalWorkExperience(data);
          }}
        />
      )}

      {isAddWorkExperienceModalOpen && (
        <AddWorkExperienceModal
          isOpen={isAddWorkExperienceModalOpen}
          onClose={() => {
            setIsAddWorkExperienceModalOpen(false);
            setEditingWorkExperience(null);
            setIsWorkExperienceModalOpen(true);
          }}
          initialData={editingWorkExperience}
          onSave={(data) => {
            // This is now a no-op since we're using onAddToLocal/onUpdateLocal
          }}
          onAddToLocal={(data) => {
            // Use a function to get the current state
            setLocalWorkExperience((current) => {
              const base = current.length > 0 ? current : workExperience;
              const newId = Math.max(...base.map((exp: any) => exp.id || 0), 0) + 1;
              return [...base, { ...data, id: newId }];
            });
          }}
          onUpdateLocal={(data) => {
            // Use a function to get the current state
            if (editingWorkExperience && editingWorkExperience.id) {
              setLocalWorkExperience((current) => {
                const base = current.length > 0 ? current : workExperience;
                return base.map((exp: any) =>
                  exp.id === editingWorkExperience.id ? { ...data, id: editingWorkExperience.id } : exp
                );
              });
            }
          }}
        />
      )}

      {isEducationModalOpen && (
        <EducationModal
          isOpen={isEducationModalOpen}
          onClose={() => setIsEducationModalOpen(false)}
          education={education}
          onSave={(data) => {
            // Transform to backend format
            const parseYearToDate = (year: string) => {
              if (!year) return null;
              try {
                return `${year}-01-01`;
              } catch {
                return null;
              }
            };

            updateProfile(
              {
                education: data.degree,
                college: data.school,
                education_start_date: parseYearToDate(data.startYear),
                education_end_date: parseYearToDate(data.endYear),
                educational_attainment: data.educationalAttainment || '',
              },
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Education updated successfully' type='success' />, { duration: 4000 });
                  setIsEducationModalOpen(false);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update education'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
        />
      )}

      {isSkillsCertModalOpen && (
        <SkillsAndCertificationModal
          isOpen={isSkillsCertModalOpen}
          onClose={() => {
            setIsSkillsCertModalOpen(false);
            // Reset local state when closing
            setLocalSkills([]);
            setLocalCertifications([]);
          }}
          skills={localSkills.length > 0 ? localSkills : skills}
          certifications={localCertifications.length > 0 ? localCertifications : certifications}
          onAddCertification={() => {
            setEditingCertification(null);
            setIsSkillsCertModalOpen(false);
            setIsAddCertificationModalOpen(true);
          }}
          onEditCertification={(certification) => {
            setEditingCertification(certification);
            setIsSkillsCertModalOpen(false);
            setIsAddCertificationModalOpen(true);
          }}
          onSave={(skillsData, certificationsData) => {
            // Extract proof files from certifications
            const certificationProofFiles: { [key: string]: File } = {};
            const certificationsBackend = certificationsData.map((cert: any, index: number) => {
              const { id, proofFile, ...certData } = cert;
              
              // If there's a proof file, add it to the files object
              if (proofFile instanceof File) {
                certificationProofFiles[`certification_proof_${index}`] = proofFile;
                // Remove proofFile from certData as it can't be serialized to JSON
                // The proofUrl will be set by the backend after file upload
              } else if (cert.proofUrl) {
                // Keep existing proofUrl if no new file is uploaded
                certData.proofUrl = cert.proofUrl;
              }
              
              return certData;
            });

            updateProfile(
              {
                skills: skillsData,
                certifications: certificationsBackend,
                certificationProofFiles: certificationProofFiles,
              },
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Skills and certifications updated successfully' type='success' />, { duration: 4000 });
                  setIsSkillsCertModalOpen(false);
                  // Sync the local state with the saved state
                  setSkills(skillsData);
                  setCertifications(certificationsData);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update skills and certifications'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
          onUpdateLocal={(skillsData, certificationsData) => {
            setLocalSkills(skillsData);
            setLocalCertifications(certificationsData);
          }}
        />
      )}

      {isAddCertificationModalOpen && (
        <AddCertificationModal
          isOpen={isAddCertificationModalOpen}
          onClose={() => {
            setIsAddCertificationModalOpen(false);
            setEditingCertification(null);
            setIsSkillsCertModalOpen(true);
          }}
          initialData={editingCertification}
          onSave={(data) => {
            // This is now a no-op since we're using onAddToLocal/onUpdateLocal
          }}
          onAddToLocal={(data) => {
            // Use a function to get the current state
            setLocalCertifications((current) => {
              const base = current.length > 0 ? current : (localCertifications.length > 0 ? localCertifications : certifications);
              const newId = Math.max(...base.map((cert: any) => cert.id || 0), 0) + 1;
              return [...base, { ...data, id: newId }];
            });
          }}
          onUpdateLocal={(data) => {
            // Use a function to get the current state
            if (editingCertification && editingCertification.id) {
              setLocalCertifications((current) => {
                const base = current.length > 0 ? current : (localCertifications.length > 0 ? localCertifications : certifications);
                return base.map((cert: any) =>
                  cert.id === editingCertification.id ? { ...data, id: editingCertification.id } : cert
                );
              });
            }
          }}
        />
      )}

      {isPortfolioModalOpen && (
        <PortfolioModal
          isOpen={isPortfolioModalOpen}
          onClose={() => {
            setIsPortfolioModalOpen(false);
            // Reset local state when closing
            setLocalPortfolio([]);
          }}
          portfolio={localPortfolio.length > 0 ? localPortfolio : portfolio}
          onEdit={(id, project) => {
            setEditingProject(project);
            setIsPortfolioModalOpen(false);
            setIsAddProjectModalOpen(true);
          }}
          onAdd={() => {
            setEditingProject(null);
            setIsPortfolioModalOpen(false);
            setIsAddProjectModalOpen(true);
          }}
          onSave={(data) => {
            // Extract image files from portfolio
            const portfolioImageFiles: { [key: string]: File } = {};
            const portfolioBackend = data.map((item: any, index: number) => {
              const { id, image, imageFile, ...itemData } = item;
              
              // If there's an image file, add it to the files object
              if (imageFile instanceof File) {
                portfolioImageFiles[`portfolio_image_${index}`] = imageFile;
                // Remove imageFile from itemData as it can't be serialized to JSON
                // The imageUrl will be set by the backend after file upload
              } else if (item.imageUrl || item.image) {
                // Keep existing image URL if no new file is uploaded
                itemData.image = item.imageUrl || item.image;
              }
              
              return itemData;
            });

            updateProfile(
              {
                portfolio: portfolioBackend,
                portfolioImageFiles: portfolioImageFiles,
              },
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Portfolio updated successfully' type='success' />, { duration: 4000 });
                  setIsPortfolioModalOpen(false);
                  // Sync the local state with the saved state
                  setPortfolio(data);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update portfolio'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
          onUpdateLocal={(data) => {
            setLocalPortfolio(data);
          }}
        />
      )}

      {isAddProjectModalOpen && (
        <AddProjectModal
          isOpen={isAddProjectModalOpen}
          onClose={() => {
            setIsAddProjectModalOpen(false);
            setEditingProject(null);
            setIsPortfolioModalOpen(true);
          }}
          initialData={editingProject}
          onSave={(data) => {
            // This is now a no-op since we're using onAddToLocal/onUpdateLocal
          }}
          onAddToLocal={(data) => {
            // Use a function to get the current state
            setLocalPortfolio((current) => {
              const base = current.length > 0 ? current : (localPortfolio.length > 0 ? localPortfolio : portfolio);
              const newId = Math.max(...base.map((project: any) => project.id || 0), 0) + 1;
              return [...base, { ...data, id: newId }];
            });
          }}
          onUpdateLocal={(data) => {
            // Use a function to get the current state
            if (editingProject && editingProject.id) {
              setLocalPortfolio((current) => {
                const base = current.length > 0 ? current : (localPortfolio.length > 0 ? localPortfolio : portfolio);
                return base.map((project: any) =>
                  project.id === editingProject.id ? { ...data, id: editingProject.id } : project
                );
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default Content;
