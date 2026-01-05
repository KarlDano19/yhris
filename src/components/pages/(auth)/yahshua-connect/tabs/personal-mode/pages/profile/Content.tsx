'use client';

import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

import useGetApplicantProfile from '../../../../hooks/useGetApplicantProfile';
import useUpdateApplicantProfile from '../../../../hooks/useUpdateApplicantProfile';
import { formatDateToLocal } from '@/helpers/date';
import CustomToast from '@/components/CustomToast';

import BasicInformationModal from './modals/BasicInformationModal';
import WorkExperienceModal from './modals/WorkExperienceModal';
import EducationModal from './modals/EducationModal';
import SkillsAndCertificationModal from './modals/SkillsAndCertificationModal';
import PortfolioModal from './modals/PortfolioModal';
import EmploymentDocumentsModal from './modals/EmploymentDocumentsModal';
import AddWorkExperienceModal from './modals/AddWorkExperienceModal';
import AddEducationModal from './modals/AddEducationModal';
import AddCertificationModal from './modals/AddCertificationModal';
import AddProjectModal from './modals/AddProjectModal';

import { ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Content = () => {
  const [isBasicInfoModalOpen, setIsBasicInfoModalOpen] = useState(false);
  const [isWorkExperienceModalOpen, setIsWorkExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isSkillsCertModalOpen, setIsSkillsCertModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isEmploymentDocumentsModalOpen, setIsEmploymentDocumentsModalOpen] = useState(false);
  const [isAddWorkExperienceModalOpen, setIsAddWorkExperienceModalOpen] = useState(false);
  const [isAddEducationModalOpen, setIsAddEducationModalOpen] = useState(false);
  const [isAddCertificationModalOpen, setIsAddCertificationModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [editingWorkExperience, setEditingWorkExperience] = useState<any>(null);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [editingCertification, setEditingCertification] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);

  // Fetch applicant profile data
  const { data: applicantDetails, isLoading } = useGetApplicantProfile();
  const profileData = applicantDetails?.data || applicantDetails;

  // Update profile mutation
  const { mutate: updateProfile, isLoading: isUpdatingProfile } = useUpdateApplicantProfile();

  // Transform API data to match modal interfaces
  const userProfile = useMemo(() => {
    if (!profileData) {
      return {
        basicInfo: {
          name: '',
          email: '',
          phone: '',
          location: '',
          birthday: '',
        },
        workExperience: [],
        education: [],
        skills: [],
        certifications: [],
        portfolio: [],
        employmentDocuments: [],
      };
    }

    // Transform basic info
    const fullName = `${profileData.firstname || ''} ${profileData.middlename || ''} ${profileData.lastname || ''}`.trim();
    const basicInfo = {
      name: fullName,
      email: profileData.email || '',
      phone: profileData.mobile || '',
      location: profileData.address || '',
      birthday: profileData.birth_date ? formatDateToLocal(profileData.birth_date) : '',
    };

    // Transform work experience
    const workExperience = (profileData.work_experience || []).map((exp: any, index: number) => {
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
      
      return {
        id: index + 1,
        title: exp.position || '',
        company: exp.companyOrg || '',
        startDate: formatMonthYear(exp.dateFrom),
        endDate: formatMonthYear(exp.dateTo),
        current: exp.currentlyEmployed || false,
        description: exp.responsibilities ? exp.responsibilities.replace(/<[^>]*>/g, '') : '',
      };
    });

    // Transform education (API has single object, convert to array for modal)
    const education = profileData.education || profileData.college ? [{
      id: 1,
      degree: profileData.education || '',
      school: profileData.college || '',
      startYear: profileData.education_start_date ? new Date(profileData.education_start_date).getFullYear().toString() : '',
      endYear: profileData.education_end_date ? new Date(profileData.education_end_date).getFullYear().toString() : '',
      note: profileData.educational_attainment || undefined,
    }] : [];

    // Skills and certifications (already in correct format)
    const skills = profileData.skills || [];
    const certifications = (profileData.certifications || []).map((cert: any, index: number) => ({
      id: index + 1,
      ...cert,
    }));

    // Portfolio (already in correct format, but add id if missing)
    const portfolio = (profileData.portfolio || []).map((item: any, index: number) => ({
      id: item.id || index + 1,
      ...item,
    }));

    // Employment documents (map file URLs from API)
    const employmentDocuments = [
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

    return {
      basicInfo,
      workExperience,
      education,
      skills,
      certifications,
      portfolio,
      employmentDocuments,
    };
  }, [profileData]);

  // Helper function to parse date string (e.g., "January 15, 1995") to ISO format (YYYY-MM-DD)
  const parseDateToISO = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
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

  // Helper function to split full name into firstname, middlename, lastname
  const splitName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return { firstname: parts[0], middlename: '', lastname: '' };
    } else if (parts.length === 2) {
      return { firstname: parts[0], middlename: '', lastname: parts[1] };
    } else {
      const lastname = parts[parts.length - 1];
      const firstname = parts[0];
      const middlename = parts.slice(1, -1).join(' ');
      return { firstname, middlename, lastname };
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

  return (
    <div className="space-y-6">
      {/* Profile Sections */}
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => setIsBasicInfoModalOpen(true)}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <span className="text-lg font-semibold text-gray-800">Basic Information</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>

        {/* Employment Documents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => setIsEmploymentDocumentsModalOpen(true)}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <span className="text-lg font-semibold text-gray-800">Employment Documents</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>

        {/* Work Experience */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => setIsWorkExperienceModalOpen(true)}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <span className="text-lg font-semibold text-gray-800">Work Experience</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => setIsEducationModalOpen(true)}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <span className="text-lg font-semibold text-gray-800">Education</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>

        {/* Skills & Certifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => setIsSkillsCertModalOpen(true)}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <span className="text-lg font-semibold text-gray-800">Skills & Certifications</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>

        {/* Portfolio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <button
            onClick={() => setIsPortfolioModalOpen(true)}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-3 transition-colors group"
          >
            <span className="text-lg font-semibold text-gray-800">Portfolio</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-savoy-blue" />
          </button>
        </div>
      </div>

      {/* Profile Section Modals */}
      {isBasicInfoModalOpen && (
        <BasicInformationModal
          isOpen={isBasicInfoModalOpen}
          onClose={() => setIsBasicInfoModalOpen(false)}
          basicInfo={userProfile.basicInfo}
          onSave={(data) => {
            const nameParts = splitName(data.name);
            updateProfile(
              {
                ...nameParts,
                email: data.email,
                mobile: data.phone,
                address: data.location,
                birth_date: parseDateToISO(data.birthday),
              },
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Basic information updated successfully' type='success' />, { duration: 4000 });
                  setIsBasicInfoModalOpen(false);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update basic information'} type='error' />, { duration: 4000 });
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
          documents={userProfile.employmentDocuments}
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
          onClose={() => setIsWorkExperienceModalOpen(false)}
          workExperience={userProfile.workExperience}
          onEdit={(id) => {
            const exp = userProfile.workExperience.find((e: any) => e.id === id);
            setEditingWorkExperience(exp);
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
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update work experience'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
        />
      )}

      {isAddWorkExperienceModalOpen && (
        <AddWorkExperienceModal
          isOpen={isAddWorkExperienceModalOpen}
          onClose={() => {
            setIsAddWorkExperienceModalOpen(false);
            setEditingWorkExperience(null);
          }}
          initialData={editingWorkExperience}
          onSave={(data) => {
            // Get current work experience array
            const currentWorkExperience = [...userProfile.workExperience];
            let updatedWorkExperience;
            
            if (editingWorkExperience) {
              // Update existing item
              updatedWorkExperience = currentWorkExperience.map((exp: any) =>
                exp.id === editingWorkExperience.id ? data : exp
              );
            } else {
              // Add new item
              const newId = Math.max(...currentWorkExperience.map((exp: any) => exp.id || 0), 0) + 1;
              updatedWorkExperience = [...currentWorkExperience, { ...data, id: newId }];
            }

            // Transform to backend format
            const workExperienceBackend = updatedWorkExperience.map((exp: any) => {
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
              { work_experience: workExperienceBackend },
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Work experience updated successfully' type='success' />, { duration: 4000 });
                  setIsAddWorkExperienceModalOpen(false);
                  setEditingWorkExperience(null);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update work experience'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
        />
      )}

      {isEducationModalOpen && (
        <EducationModal
          isOpen={isEducationModalOpen}
          onClose={() => setIsEducationModalOpen(false)}
          education={userProfile.education}
          onEdit={(id) => {
            const edu = userProfile.education.find((e: any) => e.id === id);
            setEditingEducation(edu);
            setIsEducationModalOpen(false);
            setIsAddEducationModalOpen(true);
          }}
          onAdd={() => {
            setEditingEducation(null);
            setIsEducationModalOpen(false);
            setIsAddEducationModalOpen(true);
          }}
          onSave={(data) => {
            // Take first item from array (backend only stores single education)
            const edu = data && data.length > 0 ? data[0] : null;
            if (!edu) {
              // Clear education if array is empty
              updateProfile(
                {
                  education: '',
                  college: '',
                  education_start_date: null,
                  education_end_date: null,
                  educational_attainment: '',
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
              return;
            }

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
                education: edu.degree,
                college: edu.school,
                education_start_date: parseYearToDate(edu.startYear),
                education_end_date: parseYearToDate(edu.endYear),
                educational_attainment: edu.note || '',
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

      {isAddEducationModalOpen && (
        <AddEducationModal
          isOpen={isAddEducationModalOpen}
          onClose={() => {
            setIsAddEducationModalOpen(false);
            setEditingEducation(null);
          }}
          initialData={editingEducation}
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
                educational_attainment: data.note || '',
              },
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Education updated successfully' type='success' />, { duration: 4000 });
                  setIsAddEducationModalOpen(false);
                  setEditingEducation(null);
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
          onClose={() => setIsSkillsCertModalOpen(false)}
          skills={userProfile.skills}
          certifications={userProfile.certifications}
          onAddCertification={() => {
            setEditingCertification(null);
            setIsSkillsCertModalOpen(false);
            setIsAddCertificationModalOpen(true);
          }}
          onSave={(skills, certifications) => {
            // Remove id fields from certifications for backend
            const certificationsBackend = certifications.map((cert: any) => {
              const { id, ...certData } = cert;
              return certData;
            });

            updateProfile(
              {
                skills,
                certifications: certificationsBackend,
              },
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Skills and certifications updated successfully' type='success' />, { duration: 4000 });
                  setIsSkillsCertModalOpen(false);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update skills and certifications'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
        />
      )}

      {isAddCertificationModalOpen && (
        <AddCertificationModal
          isOpen={isAddCertificationModalOpen}
          onClose={() => {
            setIsAddCertificationModalOpen(false);
            setEditingCertification(null);
          }}
          initialData={editingCertification}
          onSave={(data) => {
            // Get current certifications array
            const currentCertifications = [...userProfile.certifications];
            let updatedCertifications;

            if (editingCertification) {
              // Update existing certification
              updatedCertifications = currentCertifications.map((cert: any) =>
                cert.id === editingCertification.id ? { ...data, id: cert.id } : cert
              );
            } else {
              // Add new certification
              const newId = Math.max(...currentCertifications.map((cert: any) => cert.id || 0), 0) + 1;
              updatedCertifications = [...currentCertifications, { ...data, id: newId }];
            }

            // Remove id fields for backend
            const certificationsBackend = updatedCertifications.map((cert: any) => {
              const { id, ...certData } = cert;
              return certData;
            });

            updateProfile(
              {
                certifications: certificationsBackend,
              },
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Certification updated successfully' type='success' />, { duration: 4000 });
                  setIsAddCertificationModalOpen(false);
                  setEditingCertification(null);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update certification'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
        />
      )}

      {isPortfolioModalOpen && (
        <PortfolioModal
          isOpen={isPortfolioModalOpen}
          onClose={() => setIsPortfolioModalOpen(false)}
          portfolio={userProfile.portfolio}
          onEdit={(id) => {
            const project = userProfile.portfolio.find((p: any) => p.id === id);
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
            // Remove id and image fields for backend
            const portfolioBackend = data.map((item: any) => {
              const { id, image, ...itemData } = item;
              return itemData;
            });

            updateProfile(
              {
                portfolio: portfolioBackend,
              },
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Portfolio updated successfully' type='success' />, { duration: 4000 });
                  setIsPortfolioModalOpen(false);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update portfolio'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
        />
      )}

      {isAddProjectModalOpen && (
        <AddProjectModal
          isOpen={isAddProjectModalOpen}
          onClose={() => {
            setIsAddProjectModalOpen(false);
            setEditingProject(null);
          }}
          initialData={editingProject}
          onSave={(data) => {
            // Get current portfolio array
            const currentPortfolio = [...userProfile.portfolio];
            let updatedPortfolio;

            if (editingProject) {
              // Update existing project
              updatedPortfolio = currentPortfolio.map((project: any) =>
                project.id === editingProject.id ? { ...data, id: project.id } : project
              );
            } else {
              // Add new project
              const newId = Math.max(...currentPortfolio.map((project: any) => project.id || 0), 0) + 1;
              updatedPortfolio = [...currentPortfolio, { ...data, id: newId }];
            }

            // Remove id and image fields for backend
            const portfolioBackend = updatedPortfolio.map((item: any) => {
              const { id, image, ...itemData } = item;
              return itemData;
            });

            updateProfile(
              {
                portfolio: portfolioBackend,
              },
              {
                onSuccess: () => {
                  toast.custom(() => <CustomToast message='Project updated successfully' type='success' />, { duration: 4000 });
                  setIsAddProjectModalOpen(false);
                  setEditingProject(null);
                },
                onError: (error: any) => {
                  toast.custom(() => <CustomToast message={error?.message || 'Failed to update project'} type='error' />, { duration: 4000 });
                },
              }
            );
          }}
        />
      )}
    </div>
  );
};

export default Content;
