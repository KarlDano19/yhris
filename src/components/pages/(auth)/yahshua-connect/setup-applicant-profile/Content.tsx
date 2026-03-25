'use client';

import { useState, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import SuccessPopAlert from '@/components/SuccessPopAlert';
import useGetApplicantProfile from '@/components/hooks/useGetApplicantProfile';
import ProfileTab from './tabs/profile/Tab';
import ContactsTab from './tabs/contacts/Tab';
import WorkExperienceTab from './tabs/work-experience/Tab';
import DocumentsTab from './tabs/documents/Tab';
import PortfolioTab from './tabs/portfolio/Tab';
import useSaveApplicantProfile from './hooks/useSaveApplicantProfile';

import classNames from '@/helpers/classNames';
import updateSession from '@/helpers/updateSession';

import { T_BasicInfo, T_WorkExperience, T_Education, T_Certification, T_Portfolio, T_EmploymentDocument } from '@/types/personal-mode';

const Content = () => {
  const searchParams = useSearchParams();
  const [openSuccessAlert, setSuccessAlert] = useState(false);
  const [currentTab, setCurrentTab] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, setValue, watch, handleSubmit, control, getValues } = useForm({
    defaultValues: {
      basicInfo: {
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
      } as T_BasicInfo,
      education: {
        educationalAttainment: '',
        degree: '',
        school: '',
        startYear: '',
        endYear: '',
      } as T_Education,
      skills: [] as string[],
      certifications: [] as T_Certification[],
      workExperience: [] as T_WorkExperience[],
      employmentDocuments: [] as T_EmploymentDocument[],
      portfolio: [] as T_Portfolio[]
    }
  });
  const {
    data: applicantProfileData, 
    isLoading: isApplicantProfileLoading
  } = useGetApplicantProfile();
  const { mutate, isLoading } = useSaveApplicantProfile();

  useEffect(() => {
    if (applicantProfileData) {
      // Basic Info
      setValue('basicInfo.firstname', applicantProfileData.firstname || '');
      setValue('basicInfo.middlename', applicantProfileData.middlename || '');
      setValue('basicInfo.lastname', applicantProfileData.lastname || '');
      setValue('basicInfo.email', applicantProfileData.email || '');
      setValue('basicInfo.phone', applicantProfileData.mobile || '');
      setValue('basicInfo.landline', applicantProfileData.landline || '');
      setValue('basicInfo.address', applicantProfileData.address || '');
      setValue('basicInfo.gender', applicantProfileData.gender || '');
      setValue('basicInfo.religion', applicantProfileData.religion || '');
      setValue('basicInfo.nationality', applicantProfileData.nationality || '');
      setValue('basicInfo.civilStatus', applicantProfileData.civilStatus || applicantProfileData.civil_status || '');
      setValue('basicInfo.expectedSalary', applicantProfileData.expected_salary || null);
      setValue('basicInfo.about', applicantProfileData.about || applicantProfileData.description || '');
      setValue('basicInfo.photoUrl', applicantProfileData.photo || applicantProfileData.imagePath || applicantProfileData.image_path || null);

      // Contact Person
      setValue('basicInfo.contactPersonName', applicantProfileData.contactPersonName || applicantProfileData.contact_person_name || '');
      setValue('basicInfo.contactPersonAddress', applicantProfileData.contactPersonAddress || applicantProfileData.contact_person_address || '');
      setValue('basicInfo.contactPersonMobile', applicantProfileData.contactPersonContactNo || applicantProfileData.contact_person_mobile || '');
      setValue('basicInfo.contactPersonRelationship', applicantProfileData.contactPersonRelationship || applicantProfileData.contact_person_relationship || '');
      setValue('basicInfo.contactPersonAge', applicantProfileData.contactPersonAge || applicantProfileData.contact_person_age || null);

      // Handle birth_date conversion
      if (applicantProfileData.birth_date) {
        const birthDate = new Date(applicantProfileData.birth_date);
        if (!isNaN(birthDate.getTime())) {
          setValue('basicInfo.birthday', birthDate);
        } else {
          setValue('basicInfo.birthday', null);
        }
      } else {
        setValue('basicInfo.birthday', null);
      }

      // Education
      setValue('education.educationalAttainment', applicantProfileData.educationalAttainment || applicantProfileData.educational_attainment || '');
      setValue('education.degree', applicantProfileData.education || '');
      setValue('education.school', applicantProfileData.college || '');
      const startDate = applicantProfileData.education_start_date;
      const endDate = applicantProfileData.education_end_date;
      setValue('education.startYear', startDate ? startDate.split('-')[0] : '');
      setValue('education.endYear', endDate ? endDate.split('-')[0] : '');

      // Skills & Certifications
      setValue('skills', applicantProfileData.skills || []);
      setValue('certifications', applicantProfileData.certifications || []);

      // Work Experience - keep original field names for WorkExperienceTab
      const workExp = applicantProfileData.experiences || applicantProfileData.work_experience || [];
      if (workExp.length > 0) {
        const transformedWorkExp = workExp.map((exp: any) => {
          // Convert date strings to Date objects for CustomDatePicker
          const dateFromStr = exp.dateFrom || exp.date_from || '';
          const dateToStr = exp.dateTo || exp.date_to || '';

          let dateFrom = null;
          let dateTo = null;

          if (dateFromStr) {
            const parsedFrom = new Date(dateFromStr);
            if (!isNaN(parsedFrom.getTime())) {
              dateFrom = parsedFrom;
            }
          }

          if (dateToStr) {
            const parsedTo = new Date(dateToStr);
            if (!isNaN(parsedTo.getTime())) {
              dateTo = parsedTo;
            }
          }

          return {
            position: exp.position || '',
            companyOrg: exp.companyOrg || exp.company_org || '',
            dateFrom: dateFrom,
            dateTo: dateTo,
            current: exp.current || exp.currentlyEmployed || !dateToStr,
            responsibilities: exp.responsibilities || '',
          };
        });
        setValue('workExperience', transformedWorkExp);
      }

      // Documents Tab
      const documentMapping = [
        { id: 'medical-certificate', name: 'Medical Certificate', field: 'medical_certificate' },
        { id: 'certificate-of-employment', name: 'Certificate of Employment', field: 'certificate_of_employment' },
        { id: 'birth-certificate', name: 'Birth Certificate', field: 'birth_certificate' },
        { id: 'diploma', name: 'Diploma', field: 'diploma' },
        { id: 'transcript-of-records', name: 'Transcript of Records', field: 'transcript_of_records' },
        { id: 'nbi-police-clearance', name: 'NBI/Police Clearance', field: 'nbi_police_clearance' },
      ];
      const mappedDocuments = documentMapping.map((doc) => {
        const url = (applicantProfileData as any)[doc.field];
        return {
          id: doc.id,
          name: doc.name,
          required: true,
          uploaded: !!url,
          fileUrl: url || undefined,
        };
      });
      setValue('employmentDocuments', mappedDocuments);

      // Portfolio - map image field to imageUrl for PortfolioTab
      // Prioritize server URL (image) over stale blob URLs (imageUrl)
      const portfolioData = applicantProfileData.portfolio || [];
      if (portfolioData.length > 0) {
        const transformedPortfolio = portfolioData.map((item: any) => {
          // Get the server image URL (not blob URLs which become invalid)
          const serverImageUrl = item.image || item.image_url || null;
          // Only use imageUrl if it's not a blob URL and server URL is not available
          const existingImageUrl = item.imageUrl && !item.imageUrl.startsWith('blob:') ? item.imageUrl : null;

          return {
            id: item.id,
            name: item.name || item.title || '',
            description: item.description || '',
            link: item.link || item.url || '',
            imageFile: null,
            imageUrl: serverImageUrl || existingImageUrl || null,
          };
        });
        setValue('portfolio', transformedPortfolio);
      } else {
        setValue('portfolio', []);
      }
    }
  }, [applicantProfileData]);

  const onSubmit = handleSubmit((data) => {
    setIsSubmitting(true);
    const callbackReq = {
      onSuccess: async (data: any) => {
        try {
          await updateSession({ hasProfile: true });
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
          // Restore redirect after successful save
          setTimeout(() => {
            const redirectTo = searchParams.get('redirect') || '/personal-mode';
            location.href = redirectTo;
          }, 2000);
        } finally {
          setIsSubmitting(false);
        }
      },
      onError: (err: any) => {
        setIsSubmitting(false);
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    mutate(data, callbackReq);
  });

  return (
    <div className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-8`}>
      <>
        <h3 className='text-2xl text-indigo-dye font-semibold'>Tell us more about you!</h3>
        <div className='md:mx-5'>
          {/* Tab header section */}
          <div className='mt-5'>
            <div className='sm:hidden'>
              <h5 className='text-savoy-blue text-center text-lg font-semibold'>
                {currentTab === 1 ? 'Profile' :
                 currentTab === 2 ? 'Contacts' :
                 currentTab === 3 ? 'Experience' :
                 currentTab === 4 ? 'Documents' : 'Portfolio'}
              </h5>
            </div>
            <div className='hidden sm:block'>
              <div className='md:w-[82%] lg:w-[90%] mx-auto translate-y-[10px]'>
                <div className='w-full bg-gray-200 rounded-full h-1'>
                  <div
                    className={classNames(
                      currentTab === 2 ? 'w-[25%]' :
                      currentTab === 3 ? 'w-[50%]' :
                      currentTab === 4 ? 'w-[75%]' :
                      currentTab === 5 ? 'w-[100%]' : 'w-0',
                      'bg-blue-600 h-1 rounded-full transition-all duration-300'
                    )}
                  ></div>
                </div>
              </div>
              <div className='border-t-4 border-gray-300 mx-24 w-auto mb-3 translate-y-[23px] hidden'></div>
              <nav className='-mb-px flex relative justify-between w-[90%] mx-auto' aria-label='Tabs'>
                <li
                  className={`text-center text-sm font-semibold list-none flex flex-col items-center text-savoy-blue`}
                >
                  <div className='bg-white px-2'>
                    <div
                      className={`h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center border-savoy-blue`}
                    >
                      <div className={`h-2 w-2 rounded-full bg-savoy-blue`}></div>
                    </div>
                  </div>
                  Profile
                </li>
                <li
                  className={`
                    ${
                      currentTab >= 2 ? 'text-savoy-blue' : 'text-gray-500'
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                >
                  <div className='bg-white px-2'>
                    <div
                      className={`${
                        currentTab >= 2 ? 'border-savoy-blue' : 'border-gray-300'
                      } h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`${currentTab >= 2 ? 'bg-savoy-blue' : 'bg-gray-300'} h-2 w-2 rounded-full`}
                      ></div>
                    </div>
                  </div>
                  Contacts
                </li>
                <li
                  className={`
                    ${
                      currentTab >= 3 ? 'text-savoy-blue' : 'text-gray-500'
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                >
                  <div className='bg-white px-2'>
                    <div
                      className={`${
                        currentTab >= 3 ? 'border-savoy-blue' : 'border-gray-300'
                      } h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`${currentTab >= 3 ? 'bg-savoy-blue' : 'bg-gray-300'} h-2 w-2 rounded-full`}
                      ></div>
                    </div>
                  </div>
                  Experience
                </li>
                <li
                  className={`
                    ${
                      currentTab >= 4 ? 'text-savoy-blue' : 'text-gray-500'
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                >
                  <div className='bg-white px-2'>
                    <div
                      className={`${
                        currentTab >= 4 ? 'border-savoy-blue' : 'border-gray-300'
                      } h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`${currentTab >= 4 ? 'bg-savoy-blue' : 'bg-gray-300'} h-2 w-2 rounded-full`}
                      ></div>
                    </div>
                  </div>
                  Documents
                </li>
                <li
                  className={`
                    ${
                      currentTab >= 5 ? 'text-savoy-blue' : 'text-gray-500'
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                >
                  <div className='bg-white px-2'>
                    <div
                      className={`${
                        currentTab >= 5 ? 'border-savoy-blue' : 'border-gray-300'
                      } h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`${currentTab >= 5 ? 'bg-savoy-blue' : 'bg-gray-300'} h-2 w-2 rounded-full`}
                      ></div>
                    </div>
                  </div>
                  Portfolio
                </li>
              </nav>
            </div>
          </div>
          <div>
            {currentTab === 1 && (
              <ProfileTab
                {...{
                  register,
                  watch,
                  setValue,
                  handleSubmit,
                  setCurrentTab,
                  control,
                  Controller,
                  formState: { errors: {} },
                }}
              />
            )}
            {currentTab === 2 && (
              <ContactsTab
                {...{
                  register,
                  watch,
                  setValue,
                  handleSubmit,
                  setCurrentTab,
                }}
              />
            )}
            {currentTab === 3 && (
              <WorkExperienceTab
                {...{
                  register,
                  watch,
                  setValue,
                  getValues,
                  handleSubmit,
                  setCurrentTab,
                  control,
                  isLoading,
                  submitToSave: onSubmit,
                }}
              />
            )}
            {currentTab === 4 && (
              <DocumentsTab
                {...{
                  watch,
                  setValue,
                  setCurrentTab,
                }}
              />
            )}
            {currentTab === 5 && (
              <PortfolioTab
                {...{
                  control,
                  watch,
                  setValue,
                  setCurrentTab,
                  handleSubmit,
                  isLoading: isLoading || isSubmitting,
                  submitToSave: onSubmit,
                }}
              />
            )}
          </div>
        </div>
      </>
      <SuccessPopAlert
        message='Successfully uploaded document.'
        open={openSuccessAlert}
        onClose={() => setSuccessAlert(false)}
      />
    </div>
  );
};

export default Content;
