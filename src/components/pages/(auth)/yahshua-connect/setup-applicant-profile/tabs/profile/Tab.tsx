import React, { useState, useEffect, useRef } from 'react';

import Image from 'next/image';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import SkillsAndCertificationModal from '../../modals/SkillsAndCertificationModal';
import EducationModal from '../../modals/EducationModal';

import DropDownArrow from '@/svg/DropDownArrow';

import nationalities from '@/utils/nationalities';

import { T_Certification, T_Education } from '@/types/personal-mode';

function ProfileTab({
  register,
  watch,
  setValue,
  handleSubmit,
  setCurrentTab,
  control,
  Controller,
  formState,
}: {
  register: any;
  watch: any;
  setValue: any;
  handleSubmit: any;
  setCurrentTab: any;
  control: any;
  Controller: any;
  formState: any;
}) {
  const { errors } = formState || { errors: {} };

  // Skills and Certifications modal state
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [localSkills, setLocalSkills] = useState<string[]>([]);
  const [localCertifications, setLocalCertifications] = useState<T_Certification[]>([]);

  // Education modal state
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [localEducation, setLocalEducation] = useState<T_Education>({
    educationalAttainment: '',
    degree: '',
    school: '',
    startYear: '',
    endYear: '',
  });

  // Nationality autocomplete state
  const [nationalityInput, setNationalityInput] = useState('');
  const [filteredNationalities, setFilteredNationalities] = useState(nationalities);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [selectedNationalityIndex, setSelectedNationalityIndex] = useState(-1);
  const nationalityInputRef = useRef<HTMLInputElement>(null);

  // Get applicantProfileData from the form context (watch all values)
  const applicantProfileData = watch();

  // Initialize skills and certifications from form data only once
  useEffect(() => {
    if (applicantProfileData) {
      if (Array.isArray(applicantProfileData.skills) && localSkills.length === 0) {
        setLocalSkills(applicantProfileData.skills);
      }
      if (Array.isArray(applicantProfileData.certifications) && localCertifications.length === 0) {
        setLocalCertifications(applicantProfileData.certifications);
      }
    }
  }, [applicantProfileData, localSkills.length, localCertifications.length]);

  // Watch specific education fields for initialization
  const educationDegree = watch('education.degree');
  const educationSchool = watch('education.school');
  const educationAttainment = watch('education.educationalAttainment');
  const educationStartYear = watch('education.startYear');
  const educationEndYear = watch('education.endYear');

  // Sync localEducation with form data when form values change
  useEffect(() => {
    const hasFormEducationData = educationAttainment || educationDegree || educationSchool || educationStartYear || educationEndYear;

    if (hasFormEducationData) {
      setLocalEducation({
        educationalAttainment: educationAttainment || '',
        degree: educationDegree || '',
        school: educationSchool || '',
        startYear: educationStartYear || '',
        endYear: educationEndYear || '',
      });
    }
  }, [educationDegree, educationSchool, educationAttainment, educationStartYear, educationEndYear]);

  // Initialize nationality input with current value
  useEffect(() => {
    if (applicantProfileData?.basicInfo?.nationality) {
      setNationalityInput(applicantProfileData.basicInfo.nationality);
    }
  }, [applicantProfileData?.basicInfo?.nationality]);

  // Skills and Certifications modal handlers
  const handleSkillsAndCertificationsSave = (skills: string[], certifications: T_Certification[]) => {
    setLocalSkills(skills);
    setLocalCertifications(certifications);
    setValue('skills', skills);
    setValue('certifications', certifications);
  };

  // Education modal handlers
  const handleEducationSave = (data: T_Education) => {
    setLocalEducation(data);
    setValue('education.educationalAttainment', data.educationalAttainment);
    setValue('education.degree', data.degree);
    setValue('education.school', data.school);
    setValue('education.startYear', data.startYear);
    setValue('education.endYear', data.endYear);
  };

  const uploadImgOnChange = ({ target }: { target: any }) => {
    const file = target.files[0];
    if (!file) return;
    if (file.size <= 5000000) {
      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(target.files[0]);
        reader.onload = () => {
          setValue('basicInfo.photoUrl', reader.result);
        };
      }
    } else {
      toast.custom(() => <CustomToast message={'Maximum file size is 5mb.'} type='error' />, {
        duration: 2000,
      });
    }
  };

  // Nationality autocomplete handlers
  const handleNationalityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNationalityInput(value);
    setValue('basicInfo.nationality', value);

    if (value.trim() === '') {
      setFilteredNationalities(nationalities);
      setShowNationalityDropdown(false);
    } else {
      const filtered = nationalities.filter(nationality =>
        nationality.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredNationalities(filtered);
      setShowNationalityDropdown(true);
      setSelectedNationalityIndex(-1);
    }
  };

  const handleNationalityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedNationalityIndex(prev =>
        prev < filteredNationalities.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedNationalityIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedNationalityIndex >= 0 && filteredNationalities[selectedNationalityIndex]) {
        const selectedNationality = filteredNationalities[selectedNationalityIndex];
        setNationalityInput(selectedNationality);
        setValue('basicInfo.nationality', selectedNationality);
        setShowNationalityDropdown(false);
        setSelectedNationalityIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowNationalityDropdown(false);
      setSelectedNationalityIndex(-1);
    }
  };

  const handleNationalitySelect = (nationality: string) => {
    setNationalityInput(nationality);
    setValue('basicInfo.nationality', nationality);
    setShowNationalityDropdown(false);
    setSelectedNationalityIndex(-1);
  };

  const handleNationalityBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      setShowNationalityDropdown(false);
      setSelectedNationalityIndex(-1);
    }, 200);
  };

  const onSubmit = handleSubmit((data: any) => {
    // Additional validation for custom autocomplete fields
    if (!nationalityInput || nationalityInput.trim() === '') {
      nationalityInputRef.current?.focus();
      return;
    }

    setCurrentTab(2);
  });

  return (
    <>
    <form onSubmit={onSubmit}>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 mt-10 md:gap-x-10 lg:gap-x-14'>
        <div className='col-1 md:col-span-2 lg:col-span-4 flex'>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 lg:gap-x-5 md:w-full lg:w-auto'>
            <div className='overflow-hidden h-[155px] md:w-auto mx-auto md:mx-0 md:cols-span-1 lg:col-span-3 flex items-center justify-center'>
              <Image
                src={watch('basicInfo.photoUrl') || '/assets/no-user.png'}
                width={143}
                height={155}
                priority={true}
                alt='profile-logo'
                className='rounded object-cover max-w-[143px] h-[155px]'
              />
            </div>
            <div className='md:col-span-2 lg:col-span-5 mt-5 md:mt-0'>
              <div className='grid-item'>
                <h6 className='block text-sm font-medium leading-6 text-gray-900'>Photo (2x2 photo is recommended)</h6>
                <div className='mt-2'>
                  <input
                    type='file'
                    {...register('profilePicture')}
                    id='profile-picture'
                    className='rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4'
                    onChange={uploadImgOnChange}
                    accept='image/png, image/jpeg, image/jpg'
                    tabIndex={1}
                  />
                  <h6 className='text-xs text-indigo-dye mt-3'>Maximum file size: 5 MB</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-2 md:col-span-2 lg:col-span-5 grid-item mt-5 md:mt-3 lg:mt-0'>
          <label htmlFor='about-you' className='block text-sm font-medium leading-6 text-gray-900'>
            About you
          </label>
          <div className='mt-2'>
            <textarea
              rows={4}
              {...register('basicInfo.about')}
              id='about-you'
              className='block w-full rounded-md border-0 p-[13.5px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
              defaultValue={''}
              placeholder='Tell us about you...'
              tabIndex={2}
            />
            <h6 className='text-xs text-indigo-dye mt-3'>Maximum words: 500</h6>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:gap-x-11 gap-y-5'>
        <div className='grid-item'>
          <label htmlFor='firstname' className='block text-sm font-medium leading-6 text-gray-900'>
            First Name<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('basicInfo.firstname', { required: true })}
              id='firstname'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={3}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='middlename' className='block text-sm font-medium leading-6 text-gray-900'>
            Middle Name
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('basicInfo.middlename')}
              id='middlename'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={4}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='lastname' className='block text-sm font-medium leading-6 text-gray-900'>
            Last Name<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('basicInfo.lastname', { required: true })}
              id='lastname'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={5}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='bday' className='block text-sm font-medium leading-6 text-gray-900'>
            Birthday
          </label>
          <div className='relative mt-2'>
            <Controller
              control={control}
              name='basicInfo.birthday'
              render={({ field }: { field: any }) => (
                <CustomDatePicker
                  id='create-separation-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none'
                  }
                  selected={field.value || null}
                  pickerOnChange={(date: any) => field.onChange(date)}
                  inputOnChange={(value: any) => {
                    if (value instanceof Date && !isNaN(value.getTime())) {
                      field.onChange(value);
                    } else {
                      field.onChange(null);
                    }
                  }}
                  tabIndex={6}
                />
              )}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='gender' className='block text-sm font-medium leading-6 text-gray-900'>
            Gender<span className='text-red-500'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='gender'
              {...register('basicInfo.gender', { required: true })}
              className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              defaultValue='Male'
              tabIndex={8}
            >
              <option value={'Male'}>Male</option>
              <option value={'Female'}>Female</option>
            </select>
            <div className='absolute right-3 top-[14px]'>
              <DropDownArrow />
            </div>
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='religion' className='block text-sm font-medium leading-6 text-gray-900'>
            Religion<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('basicInfo.religion', { required: true })}
              id='religion'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={9}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='nationality' className='block text-sm font-medium leading-6 text-gray-900'>
            Nationality<span className='text-red-500'>*</span>
          </label>
          <div className='relative mt-2'>
            <input
              ref={nationalityInputRef}
              type='text'
              id='nationality'
              value={nationalityInput}
              onChange={handleNationalityInputChange}
              onKeyDown={handleNationalityKeyDown}
              onBlur={handleNationalityBlur}
              onFocus={() => setShowNationalityDropdown(true)}
              placeholder='Search for your nationality...'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={10}
            />
            <div className='absolute right-3 top-[14px]'>
              <DropDownArrow />
            </div>
            
            {/* Nationality autocomplete dropdown */}
            {showNationalityDropdown && filteredNationalities.length > 0 && (
              <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                {filteredNationalities.slice(0, 10).map((nationality, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      index === selectedNationalityIndex ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleNationalitySelect(nationality)}
                  >
                    <div className='font-medium'>{nationality}</div>
                  </div>
                ))}
                {filteredNationalities.length > 10 && (
                  <div className='px-3 py-2 text-sm text-gray-500 border-t'>
                    Showing first 10 results. Type more to narrow down.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='civil-status' className='block text-sm font-medium leading-6 text-gray-900'>
            Civil Status<span className='text-red-500'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='civil-status'
              {...register('basicInfo.civilStatus', { required: true })}
              className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              defaultValue='Single'
              tabIndex={11}
            >
              <option value={'Single'}>Single</option>
              <option value={'Married'}>Married</option>
              <option value={'Divorced'}>Divorced</option>
              <option value={'Widowed'}>Widowed</option>
            </select>
            <div className='absolute right-3 top-[14px]'>
              <DropDownArrow />
            </div>
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='education' className='text-sm font-medium leading-6 text-gray-900'>
            Education
          </label>
          <div className='mt-2'>
            <button
              type='button'
              onClick={() => setIsEducationModalOpen(true)}
              className='w-full rounded-md bg-savoy-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors'
              tabIndex={13}
            >
              {localEducation.educationalAttainment || localEducation.degree || localEducation.school
                ? 'Manage Education Details'
                : 'Add Education Details'}
            </button>
          </div>
          {(localEducation.educationalAttainment || localEducation.degree || localEducation.school) && (
            <div className='mt-2 text-xs text-gray-600'>
              Click to view and edit your education details
            </div>
          )}
        </div>
        <div className='grid-item'>
          <label htmlFor='expected_salary' className='block text-sm font-medium leading-6 text-gray-900'>
            Expected Salary (PHP)
          </label>
          <div className='mt-2'>
            <input
              type='text'
              value={watch('basicInfo.expectedSalary') || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setValue('basicInfo.expectedSalary', value ? parseInt(value) : null);
              }}
              id='expected_salary'
              placeholder='Enter expected salary'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={14}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='skills' className='text-sm font-medium leading-6 text-gray-900'>
            Skills & Certifications
          </label>
          <div className='mt-2'>
            <button
              type='button'
              onClick={() => setIsSkillsModalOpen(true)}
              className='w-full rounded-md bg-savoy-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors'
              tabIndex={15}
            >
              {localSkills.length > 0 || localCertifications.length > 0
                ? 'Manage Skills & Certifications'
                : 'Add Skills & Certifications'}
            </button>
          </div>
          {(localSkills.length > 0 || localCertifications.length > 0) && (
            <div className='mt-2 text-xs text-gray-600'>
              Click to view and edit your skills and certifications
            </div>
          )}
        </div>
      </div>
      <div className='flex justify-end py-10'>
        <button
          type='submit'
          className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          tabIndex={16}
        >
          Next
        </button>
      </div>
    </form>

    <EducationModal
      isOpen={isEducationModalOpen}
      onClose={() => setIsEducationModalOpen(false)}
      education={localEducation}
      onSave={handleEducationSave}
    />

    <SkillsAndCertificationModal
      isOpen={isSkillsModalOpen}
      onClose={() => setIsSkillsModalOpen(false)}
      skills={localSkills}
      certifications={localCertifications}
      onSave={handleSkillsAndCertificationsSave}
    />
    </>
  );
}

export default ProfileTab;
