'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';

import DropDownArrow from '@/svg/DropDownArrow';
import { XMarkIcon } from '@heroicons/react/24/outline';
import regions from '@/utils/regions';
import colleges from '@/utils/colleges';
import nationalities from '@/utils/nationalities';
import degrees from '@/utils/degrees';
import educationalAttainment from '@/utils/educational-attainment';
import countryCode from '@/utils/country-code';

const Tab = ({
  register,
  watch,
  setValue,
  control,
  Controller,
  onSubmit,
  isLoading,
}: {
  register: any;
  watch: any;
  setValue: any;
  control: any;
  Controller: any;
  onSubmit: any;
  isLoading: any;
}) => {
  const [skillsInput, setSkillsInput] = useState('');
  const [tagsSkill, setTagsSkill] = useState<string[]>([]);
  const isSkillsInitialized = useRef(false);
  
  // College autocomplete state
  const [collegeInput, setCollegeInput] = useState('');
  const [filteredColleges, setFilteredColleges] = useState(colleges);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [selectedCollegeIndex, setSelectedCollegeIndex] = useState(-1);
  const [isCustomCollege, setIsCustomCollege] = useState(false);
  
  // City address autocomplete state
  const [cityInput, setCityInput] = useState('');
  const [filteredCities, setFilteredCities] = useState(regions);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCityIndex, setSelectedCityIndex] = useState(-1);
  
  // Nationality autocomplete state
  const [nationalityInput, setNationalityInput] = useState('');
  const [filteredNationalities, setFilteredNationalities] = useState(nationalities);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [selectedNationalityIndex, setSelectedNationalityIndex] = useState(-1);
  
  // Degree autocomplete state
  const [degreeInput, setDegreeInput] = useState('');
  const [filteredDegrees, setFilteredDegrees] = useState(degrees);
  const [showDegreeDropdown, setShowDegreeDropdown] = useState(false);
  const [selectedDegreeIndex, setSelectedDegreeIndex] = useState(-1);
  const [isCustomDegree, setIsCustomDegree] = useState(false);

  // Focus states for ellipsis functionality
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [isDegreeFocused, setIsDegreeFocused] = useState(false);
  const [isCollegeFocused, setIsCollegeFocused] = useState(false);

  // Get applicantProfileData from the form context (watch all values)
  const applicantProfileData = watch();

  // Initialize skills tags only once when applicantProfileData.skills is available
  useEffect(() => {
    if (!isSkillsInitialized.current && applicantProfileData && applicantProfileData.skills) {
      let skillsArray = [];
      if (Array.isArray(applicantProfileData.skills)) {
        skillsArray = applicantProfileData.skills;
      } else if (typeof applicantProfileData.skills === 'string') {
        skillsArray = applicantProfileData.skills
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      }
      setTagsSkill(skillsArray);
      setValue('skills', skillsArray);
      isSkillsInitialized.current = true;
    }
  }, [applicantProfileData, setValue]);

  // Initialize college input with current value
  useEffect(() => {
    if (applicantProfileData && applicantProfileData.college) {
      setCollegeInput(applicantProfileData.college);
      // Check if the current value is in our colleges list
      const isInList = colleges.some(college => 
        college.institutionName.toLowerCase() === applicantProfileData.college.toLowerCase()
      );
      setIsCustomCollege(!isInList);
    }
  }, [applicantProfileData]);

  // Initialize city input with current value
  useEffect(() => {
    if (applicantProfileData && applicantProfileData.address) {
      setCityInput(applicantProfileData.address);
    }
  }, [applicantProfileData]);

  // Initialize nationality input with current value
  useEffect(() => {
    if (applicantProfileData && applicantProfileData.nationality) {
      setNationalityInput(applicantProfileData.nationality);
    }
  }, [applicantProfileData]);

  // Initialize degree input with current value
  useEffect(() => {
    if (applicantProfileData && applicantProfileData.education) {
      setDegreeInput(applicantProfileData.education);
      // Check if the current value is in our degrees list
      const isInList = degrees.some(degree => 
        degree.degreeTitle.toLowerCase() === applicantProfileData.education.toLowerCase()
      );
      setIsCustomDegree(!isInList);
    }
  }, [applicantProfileData]);

  // Handle skills input key down
  const handleKeyDownSkill = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Tab' || event.key === ',') {
      event.preventDefault();
      const newTag = skillsInput.trim();
      if (newTag !== '' && !tagsSkill.some((tag) => tag.toLowerCase() === newTag.toLowerCase())) {
        const newTags = [...tagsSkill, newTag];
        setTagsSkill(newTags);
        setValue('skills', newTags);
        setSkillsInput('');
      }
    }
  };

  const handleRemoveTagSkill = (tag: string) => {
    const newTags = tagsSkill.filter((t) => t !== tag);
    setTagsSkill(newTags);
    setValue('skills', newTags);
  };

  // Handle expected salary input
  const handleExpectedSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    setValue('expected_salary', value ? parseInt(value) : null);
  };

  // Get display value for expected salary
  const getExpectedSalaryDisplayValue = () => {
    if (applicantProfileData.expected_salary) {
      return applicantProfileData.expected_salary.toString();
    }
    return '';
  };

  const uploadImgOnChange = ({ target }: { target: any }) => {
    const file = target.files[0];
    if (!file) return;
    if (file.size <= 5000000) {
      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(target.files[0]);
        reader.onload = () => {
          setValue('imagePath', reader.result);
        };
      }
    } else {
      toast.custom(() => <CustomToast message={'Maximum file size is 5mb.'} type='error' />, {
        duration: 2000,
      });
    }
  };

  // College autocomplete handlers
  const handleCollegeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCollegeInput(value);
    setValue('college', value);
    setIsCustomCollege(true);
    
    if (value.trim() === '') {
      setFilteredColleges(colleges);
      setShowCollegeDropdown(false);
      setIsCustomCollege(false);
    } else {
      const filtered = colleges.filter(college =>
        college.institutionName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredColleges(filtered);
      setShowCollegeDropdown(true);
      setSelectedCollegeIndex(-1);
    }
  };

  const handleCollegeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCollegeIndex(prev => 
        prev < filteredColleges.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCollegeIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedCollegeIndex >= 0 && filteredColleges[selectedCollegeIndex]) {
        const selectedCollege = filteredColleges[selectedCollegeIndex];
        setCollegeInput(selectedCollege.institutionName);
        setValue('college', selectedCollege.institutionName);
        setShowCollegeDropdown(false);
        setSelectedCollegeIndex(-1);
        setIsCustomCollege(false);
      }
    } else if (e.key === 'Escape') {
      setShowCollegeDropdown(false);
      setSelectedCollegeIndex(-1);
    }
  };

  const handleCollegeSelect = (college: any) => {
    setCollegeInput(college.institutionName);
    setValue('college', college.institutionName);
    setShowCollegeDropdown(false);
    setSelectedCollegeIndex(-1);
    setIsCustomCollege(false);
  };

  const handleCollegeBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      setShowCollegeDropdown(false);
      setSelectedCollegeIndex(-1);
      setIsCollegeFocused(false);
    }, 200);
  };

  // City address autocomplete handlers
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    setValue('address', value);
    
    if (value.trim() === '') {
      setFilteredCities(regions);
      setShowCityDropdown(false);
    } else {
      const filtered = regions.filter(region =>
        region.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCityDropdown(true);
      setSelectedCityIndex(-1);
    }
  };

  const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCityIndex(prev => 
        prev < filteredCities.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCityIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedCityIndex >= 0 && filteredCities[selectedCityIndex]) {
        const selectedCity = filteredCities[selectedCityIndex];
        setCityInput(selectedCity.label);
        setValue('address', selectedCity.value);
        setShowCityDropdown(false);
        setSelectedCityIndex(-1);
      } else {
        // Allow custom input when Enter is pressed without selection
        setShowCityDropdown(false);
        setSelectedCityIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowCityDropdown(false);
      setSelectedCityIndex(-1);
    }
  };

  const handleCitySelect = (city: any) => {
    setCityInput(city.label);
    setValue('address', city.value);
    setShowCityDropdown(false);
    setSelectedCityIndex(-1);
  };

  const handleCityBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      setShowCityDropdown(false);
      setSelectedCityIndex(-1);
      setIsCityFocused(false);
    }, 200);
  };

  // Nationality autocomplete handlers
  const handleNationalityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNationalityInput(value);
    setValue('nationality', value);
    
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
        setValue('nationality', selectedNationality);
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
    setValue('nationality', nationality);
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

  // Degree autocomplete handlers
  const handleDegreeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDegreeInput(value);
    setValue('education', value);
    setIsCustomDegree(true);
    
    if (value.trim() === '') {
      setFilteredDegrees(degrees);
      setShowDegreeDropdown(false);
      setIsCustomDegree(false);
    } else {
      const filtered = degrees.filter(degree =>
        degree.degreeTitle.toLowerCase().includes(value.toLowerCase()) ||
        degree.degreeReference.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDegrees(filtered);
      setShowDegreeDropdown(true);
      setSelectedDegreeIndex(-1);
    }
  };

  const handleDegreeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedDegreeIndex(prev => 
        prev < filteredDegrees.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedDegreeIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedDegreeIndex >= 0 && filteredDegrees[selectedDegreeIndex]) {
        const selectedDegree = filteredDegrees[selectedDegreeIndex];
        setDegreeInput(selectedDegree.degreeTitle);
        setValue('education', selectedDegree.degreeTitle);
        setShowDegreeDropdown(false);
        setSelectedDegreeIndex(-1);
        setIsCustomDegree(false);
      }
    } else if (e.key === 'Escape') {
      setShowDegreeDropdown(false);
      setSelectedDegreeIndex(-1);
    }
  };

  const handleDegreeSelect = (degree: any) => {
    setDegreeInput(degree.degreeTitle);
    setValue('education', degree.degreeTitle);
    setShowDegreeDropdown(false);
    setSelectedDegreeIndex(-1);
    setIsCustomDegree(false);
  };

  const handleDegreeBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      setShowDegreeDropdown(false);
      setSelectedDegreeIndex(-1);
      setIsDegreeFocused(false);
    }, 200);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 mt-10 md:gap-x-10 lg:gap-x-14'>
          <div className='col-1 md:col-span-2 lg:col-span-4 flex'>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 lg:gap-x-5 md:w-full lg:w-auto'>
              <div className='overflow-hidden h-[155px] md:w-auto mx-auto md:mx-0 md:cols-span-1 lg:col-span-3 flex items-center justify-center'>
                <Image
                  src={watch('imagePath') || '/assets/no-user.png'}
                  width={143}
                  height={155}
                  priority={true}
                  alt='profile-logo'
                  className='rounded object-cover max-w-[143px] h-[155px]'
                />
              </div>
              <div className='md:col-span-2 lg:col-span-5 mt-5 md:mt-0'>
                <div className='grid-item'>
                  <h6 className='block text-sm font-medium leading-6 text-gray-900'>Profile Picture</h6>
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
                {...register('about')}
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
                {...register('firstname', { required: true })}
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
                {...register('middlename')}
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
                {...register('lastname', { required: true })}
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
                name='birthDay'
                render={({ field }: { field: any }) => (
                  <CustomDatePicker
                    id='create-separation-datepicker'
                    placeholder={'mm/dd/yyyy'}
                    className={
                      'block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none'
                    }
                    selected={field.value}
                    pickerOnChange={(date: any) => field.onChange(date)}
                    inputOnChange={(value: any) => field.onChange(value)}
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
                {...register('gender', { required: true })}
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
                {...register('religion', { required: true })}
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
                type='text'
                id='nationality'
                value={nationalityInput}
                onChange={handleNationalityInputChange}
                onKeyDown={handleNationalityKeyDown}
                onBlur={handleNationalityBlur}
                onFocus={() => setShowNationalityDropdown(true)}
                placeholder='Search for your nationality...'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={12}
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
                {...register('civilStatus', { required: true })}
                className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                defaultValue='Single'
                tabIndex={13}
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
            <label htmlFor='address' className='block text-sm font-medium leading-6 text-gray-900'>
              City Address
            </label>
            <div className='relative mt-2'>
              <input
                type='text'
                id='address'
                value={cityInput}
                onChange={handleCityInputChange}
                onKeyDown={handleCityKeyDown}
                onBlur={handleCityBlur}
                onFocus={() => {
                  setShowCityDropdown(true);
                  setIsCityFocused(true);
                }}
                placeholder='Search for your city...'
                className={`rounded-md w-full border-0 px-3 pr-8 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 ${
                  !isCityFocused && cityInput.length > 20 ? 'text-ellipsis overflow-hidden whitespace-nowrap' : ''
                }`}
                style={{
                  textOverflow: !isCityFocused && cityInput.length > 20 ? 'ellipsis' : 'clip',
                }}
                tabIndex={14}
              />
              <div className='absolute right-3 top-[14px]'>
                <DropDownArrow />
              </div>
              
              {/* City autocomplete dropdown */}
              {showCityDropdown && filteredCities.length > 0 && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  {filteredCities.slice(0, 10).map((city, index) => (
                    <div
                      key={index}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        index === selectedCityIndex ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className='font-medium'>{city.label}</div>
                    </div>
                  ))}
                  {filteredCities.length > 10 && (
                    <div className='px-3 py-2 text-sm text-gray-500 border-t'>
                      Showing first 10 results. Type more to narrow down.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='educational-attainment' className='block text-sm font-medium leading-6 text-gray-900'>
              Educational Attainment<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='educational-attainment'
                {...register('educationalAttainment', { required: true })}
                className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={15}
              >
                <option value=''>Select your educational attainment</option>
                {educationalAttainment.map((attainment, index) => (
                  <option
                    key={index}
                    value={attainment}
                  >
                    {attainment}
                  </option>
                ))}
              </select>
              <div className='absolute right-3 top-[14px]'>
                <DropDownArrow />
              </div>
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='education' className='block text-sm font-medium leading-6 text-gray-900'>
              Course/Degree
            </label>
            <div className='relative mt-2'>
              <input
                type='text'
                id='education'
                value={degreeInput}
                onChange={handleDegreeInputChange}
                onKeyDown={handleDegreeKeyDown}
                onBlur={handleDegreeBlur}
                onFocus={() => {
                  setShowDegreeDropdown(true);
                  setIsDegreeFocused(true);
                }}
                placeholder='Search for your degree or type custom...'
                className={`rounded-md w-full border-0 px-3 py-1.5 pr-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 ${
                  !isDegreeFocused && degreeInput.length > 20 ? 'text-ellipsis overflow-hidden whitespace-nowrap' : ''
                }`}
                style={{
                  textOverflow: !isDegreeFocused && degreeInput.length > 20 ? 'ellipsis' : 'clip',
                }}
                tabIndex={16}
              />
              <div className='absolute right-3 top-[14px]'>
                <DropDownArrow />
              </div>
              
              {/* Degree autocomplete dropdown */}
              {showDegreeDropdown && filteredDegrees.length > 0 && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  {filteredDegrees.slice(0, 10).map((degree, index) => (
                    <div
                      key={index}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        index === selectedDegreeIndex ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleDegreeSelect(degree)}
                    >
                      <div className='font-medium'>{degree.degreeTitle}</div>
                      <div className='text-sm text-gray-500'>
                        {degree.degreeReference} • {degree.degreeLevel}
                      </div>
                    </div>
                  ))}
                  {filteredDegrees.length > 10 && (
                    <div className='px-3 py-2 text-sm text-gray-500 border-t'>
                      Showing first 10 results. Type more to narrow down.
                    </div>
                  )}
                </div>
              )}
              
              {/* Custom degree indicator */}
              {isCustomDegree && degreeInput.trim() !== '' && (
                <div className='mt-1 text-xs text-blue-600'>
                  ✓ Custom degree entered
                </div>
              )}
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='college' className='block text-sm font-medium leading-6 text-gray-900'>
              School
            </label>
            <div className='relative mt-2'>
              <input
                type='text'
                id='college'
                value={collegeInput}
                onChange={handleCollegeInputChange}
                onKeyDown={handleCollegeKeyDown}
                onBlur={handleCollegeBlur}
                onFocus={() => {
                  setShowCollegeDropdown(true);
                  setIsCollegeFocused(true);
                }}
                placeholder='Search for your school or type custom...'
                className={`rounded-md w-full border-0 px-3 pr-8 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 ${
                  !isCollegeFocused && collegeInput.length > 20 ? 'text-ellipsis overflow-hidden whitespace-nowrap' : ''
                }`}
                style={{
                  textOverflow: !isCollegeFocused && collegeInput.length > 20 ? 'ellipsis' : 'clip',
                }}
                tabIndex={17}
              />
              <div className='absolute right-3 top-[14px]'>
                <DropDownArrow />
              </div>
              
              {/* Autocomplete dropdown */}
              {showCollegeDropdown && filteredColleges.length > 0 && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  {filteredColleges.slice(0, 10).map((college, index) => (
                    <div
                      key={index}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        index === selectedCollegeIndex ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleCollegeSelect(college)}
                    >
                      <div className='font-medium'>{college.institutionName}</div>
                      <div className='text-sm text-gray-500'>
                        {college.municipality}, {college.province}
                      </div>
                    </div>
                  ))}
                  {filteredColleges.length > 10 && (
                    <div className='px-3 py-2 text-sm text-gray-500 border-t'>
                      Showing first 10 results. Type more to narrow down.
                    </div>
                  )}
                </div>
              )}
              
              {/* Custom college indicator */}
              {isCustomCollege && collegeInput.trim() !== '' && (
                <div className='mt-1 text-xs text-blue-600'>
                  ✓ Custom school entered
                </div>
              )}
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='expected_salary' className='block text-sm font-medium leading-6 text-gray-900'>
              Expected Salary (PHP)
            </label>
            <div className='mt-2'>
              <input
                type='text'
                value={getExpectedSalaryDisplayValue()}
                onChange={handleExpectedSalaryChange}
                id='expected_salary'
                placeholder='Enter expected salary'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={18}
              />
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='skills' className='text-sm font-medium leading-6 text-gray-900'>
              Skills
            </label>
            <div className='mt-2'>
              <div className='relative flex items-center'>
                <input
                  type='text'
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyDown={handleKeyDownSkill}
                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                  placeholder='Enter skills and press Enter, Tab, or comma to add...'
                  tabIndex={19}
                />
              </div>
            </div>
          </div>
          <div className='grid-item'>
            {/* Skills Tags Display */}
            {tagsSkill.length > 0 && (
              <div className='mt-3 flex flex-wrap gap-2'>
                {tagsSkill.map((tagSkill: string) => (
                  <div
                    key={tagSkill}
                    className='flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'
                  >
                    <span>{tagSkill}</span>
                    <button
                      type='button'
                      onClick={() => handleRemoveTagSkill(tagSkill)}
                      className='text-blue-600 hover:text-blue-800 font-bold text-lg leading-none'
                      title='Remove skill'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* <h6 className='text-indigo-dye text-sm font-semibold mt-6'>Address</h6> */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:gap-x-11 gap-y-5'>
          {/* <div className='grid-item'>
          <label
            htmlFor='house-no'
            className='block whitespace-nowrap truncate text-sm font-medium leading-6 text-gray-900'
          >
            House No./Bldg./Apartment/Suite, etc.
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('houseNo')}
              id='house-no'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={12}
            />
          </div>
        </div> */}
          {/* <div className='grid-item'>
          <label htmlFor='town' className='block text-sm font-medium leading-6 text-gray-900'>
            Town/Brgy.<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('town', { required: true })}
              id='town'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={14}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='city' className='block text-sm font-medium leading-6 text-gray-900'>
            City<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('city', { required: true })}
              id='city'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={15}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='zip' className='block text-sm font-medium leading-6 text-gray-900'>
            Zip Code<span className='text-red-500'>*</span>
          </label>
          <div className='mt-2'>
            <input
              type='number'
              {...register('zipCode', { required: true })}
              id='zip'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={16}
            />
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='country' className='block text-sm font-medium leading-6 text-gray-900'>
            Country<span className='text-red-500'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='country'
              {...register('country', { required: true })}
              className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              defaultValue='Philippines'
              tabIndex={17}
            >
              <option value={'Philippines'}>Philippines</option>
              <option value={'Singapore'}>Singapore</option>
            </select>
            <div className='absolute right-3 top-[14px]'>
              <DropDownArrow />
            </div>
          </div>
        </div> */}
        </div>
        <div className='flex justify-end'>
          <button
            type='submit'
            className='mt-10 md:mt-12 w-full md:w-auto text-center float-right mb-7 rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            {isLoading ? (
              <div
                className='animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2'
                role='status'
                aria-label='loading'
              >
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              'SAVE'
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default Tab;
