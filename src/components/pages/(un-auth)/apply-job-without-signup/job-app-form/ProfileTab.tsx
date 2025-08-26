import React, { useState, useCallback, useEffect, useRef } from 'react';

import Image from 'next/image';

import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DropDownArrow from '@/svg/DropDownArrow';
import regions from '@/utils/location';
import colleges from '@/utils/colleges';
import nationalities from '@/utils/nationalities';
import degrees from '@/utils/degrees';
import educationalAttainment from '@/utils/educational-attainment';
import countryCode from '@/utils/country-code';
import SelectChevronDown from "@/svg/SelectChevronDown";

interface ProfileTabProps {
  register: UseFormRegister<any>;
  handleSubmit: any;
  firstSubmit: any;
  setCurrentTab: any;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const ProfileTab = ({ register, handleSubmit, firstSubmit, setCurrentTab, setValue, watch }: ProfileTabProps) => {
  const [profilePhotoList, setProfilePhotoList] = useState<FileList | null>(null);
  const [educationInput, setEducationInput] = useState('');
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

  // Country code and mobile number states
  const [selectedCountryCode, setSelectedCountryCode] = useState('PH'); // Default to Philippines
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  // Get form data from the form context (watch all values)
  const formData = watch();

  // Initialize skills tags only once when formData.skills is available
  useEffect(() => {
    if (!isSkillsInitialized.current && formData && formData.skills) {
      let skillsArray = [];
      if (Array.isArray(formData.skills)) {
        skillsArray = formData.skills;
      } else if (typeof formData.skills === 'string') {
        skillsArray = formData.skills
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      }
      setTagsSkill(skillsArray);
      setValue('skills', skillsArray);
      isSkillsInitialized.current = true;
    }
  }, [formData, setValue]);

  // Initialize college input with current value
  useEffect(() => {
    if (formData && formData.college) {
      setCollegeInput(formData.college);
      // Check if the current value is in our colleges list
      const isInList = colleges.some(
        (college) => college.institutionName.toLowerCase() === formData.college.toLowerCase()
      );
      setIsCustomCollege(!isInList);
    }
  }, [formData]);

  // Initialize city input with current value
  useEffect(() => {
    if (formData && formData.address) {
      setCityInput(formData.address);
    }
  }, [formData]);

  // Initialize mobile number with current value
  useEffect(() => {
    if (formData && formData.mobileNo) {
      // Extract country code and mobile number from the full number
      const fullNumber = formData.mobileNo;
      // Find the country code that matches the beginning of the number
      for (const [countryKey, code] of Object.entries(countryCode)) {
        if (fullNumber.startsWith(code)) {
          setSelectedCountryCode(countryKey);
          setMobileNumber(fullNumber.substring(code.length));
          break;
        }
      }
    }
  }, [formData]);

  // Initialize nationality input with current value
  useEffect(() => {
    if (formData && formData.nationality) {
      setNationalityInput(formData.nationality);
    }
  }, [formData]);

  // Initialize degree input with current value
  useEffect(() => {
    if (formData && formData.education) {
      setDegreeInput(formData.education);
      // Check if the current value is in our degrees list
      const isInList = degrees.some((degree) => degree.degreeTitle.toLowerCase() === formData.education.toLowerCase());
      setIsCustomDegree(!isInList);
    }
  }, [formData]);

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

  // Handle education input
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEducationInput(e.target.value);
    // Store as JSON string in the form
    setValue('education', e.target.value);
  };

  // Handle expected salary input
  const handleExpectedSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    setValue('expected_salary', value ? parseInt(value) : null);
  };

  // Get display value for expected salary
  const getExpectedSalaryDisplayValue = () => {
    if (formData.expected_salary) {
      return formData.expected_salary.toString();
    }
    return '';
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
      const filtered = colleges.filter((college) =>
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
      setSelectedCollegeIndex((prev) => (prev < filteredColleges.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCollegeIndex((prev) => (prev > 0 ? prev - 1 : -1));
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
      const filtered = regions.filter((region) => region.label.toLowerCase().includes(value.toLowerCase()));
      setFilteredCities(filtered);
      setShowCityDropdown(true);
      setSelectedCityIndex(-1);
    }
  };

  const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCityIndex((prev) => (prev < filteredCities.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCityIndex((prev) => (prev > 0 ? prev - 1 : -1));
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
      const filtered = nationalities.filter((nationality) => nationality.toLowerCase().includes(value.toLowerCase()));
      setFilteredNationalities(filtered);
      setShowNationalityDropdown(true);
      setSelectedNationalityIndex(-1);
    }
  };

  const handleNationalityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedNationalityIndex((prev) => (prev < filteredNationalities.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedNationalityIndex((prev) => (prev > 0 ? prev - 1 : -1));
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
      const filtered = degrees.filter(
        (degree) =>
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
      setSelectedDegreeIndex((prev) => (prev < filteredDegrees.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedDegreeIndex((prev) => (prev > 0 ? prev - 1 : -1));
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

  // Country code handlers
  const handleCountryCodeSelect = (countryKey: string) => {
    setSelectedCountryCode(countryKey);
    setShowCountryDropdown(false);
    // Update the form value with country code + mobile number
    const fullMobileNumber = `${countryCode[countryKey as keyof typeof countryCode]}${mobileNumber}`;
    setValue('mobileNo', fullMobileNumber);
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 11) {
      setMobileNumber(value);
      // Update the form value with country code + mobile number
      const fullMobileNumber = `${countryCode[selectedCountryCode as keyof typeof countryCode]}${value}`;
      setValue('mobileNo', fullMobileNumber);
    }
  };

  const handleCountryDropdownBlur = () => {
    setTimeout(() => {
      setShowCountryDropdown(false);
    }, 200);
  };

  const [selectedGender, setSelectedGender] = useState<string>("");
  const compressImage = useCallback(
    (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = document.createElement('img');
          img.src = event.target?.result as string;
          img.onload = () => {
            const elem = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            elem.width = width;
            elem.height = height;
            const ctx = elem.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const dataUrl = elem.toDataURL('image/jpeg', quality);
              resolve(dataUrl);
            } else {
              reject(new Error('Failed to get canvas context'));
            }
          };
          img.onerror = () => reject(new Error('Image loading error'));
        };
        reader.onerror = () => reject(new Error('File reading error'));
      });
    },
    []
  );

  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);

    if (!mimeMatch) {
      throw new Error('Invalid data URL: MIME type not found');
    }

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const dataURLtoFileList = (dataUrl: string, filename: string): FileList => {
    const file = dataURLtoFile(dataUrl, filename);
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  };

  const renderUploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      try {
        const compressedImage = await compressImage(event.target.files[0], 1920, 1080, 0.7);
        const fileList = dataURLtoFileList(compressedImage, event.target.files[0].name);
        setProfilePhotoList(fileList);
      } catch (error) {
        console.error('Error compressing image:', error);
        toast.custom(() => <CustomToast message='Error processing image' type='error' />, {
          duration: 7000,
        });
      }
    }
  };

  const profileSubmit = handleSubmit((data: any) => {
    const formData = {
      ...data,
      profilePicture: profilePhotoList ? profilePhotoList : [],
    };
    firstSubmit(formData);
  });

  return (
    <form onSubmit={profileSubmit}>
      <h5 className='text-xl font-semibold'>Profile</h5>
      <div className='grid lg:grid-cols-7 gap-x-8 mt-7'>
        <div className='lg:col-span-1'>
          <div className='overflow-hidden h-[155px] w-36 md:w-auto md:max-w-[150px] mx-auto md:mx-0 md:cols-span-1 lg:col-span-3 flex items-center justify-center'>
            <Image
              src={profilePhotoList ? URL.createObjectURL(profilePhotoList[0]) : '/assets/no-user.png'}
              width={143}
              height={155}
              priority={true}
              alt='profile-logo'
              className='rounded object-cover max-w-[143px] h-[155px]'
            />
          </div>
        </div>
        <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5'>
          <div className='grid-item'>
            <label htmlFor='first-name' className='text-sm font-medium leading-6 text-gray-900'>
              First Name<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('firstName', { required: true })}
                id='first-name'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='middle-name' className='text-sm font-medium leading-6 text-gray-900'>
              Middle Name
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('middleName')}
                id='middle-name'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='last-name' className='text-sm font-medium leading-6 text-gray-900'>
              Last Name<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('lastName', { required: true })}
                id='last-name'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='email' className='text-sm font-medium leading-6 text-gray-900'>
              Email Address<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='email'
                {...register('email', { required: true })}
                id='email'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className="grid-item">
            <label
              htmlFor="gender"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Gender<span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
              <select
                {...register("gender", { 
                  required: true,
                  onChange: (e) => {
                    setSelectedGender(e.target.value);
                  }
                })}
                id="gender"
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none bg-white"
              >
                <option value="">Select gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SelectChevronDown />
              </div>
            </div>
          </div>
          <div className="grid-item">
            <label
              htmlFor="age"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Age
            </label>
            <div className="mt-2">
              <input
                type="number"
                {...register("age", { min: 0, max: 120 })}
                id="age"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
              />
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='mobile-no' className='text-sm font-medium leading-6 text-gray-900'>
              Mobile No.<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2 flex'>
              {/* Country Code Dropdown */}
              <div className='relative flex-shrink-0'>
                <button
                  type='button'
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  onBlur={handleCountryDropdownBlur}
                  className='flex items-center justify-between w-20 h-9 px-3 py-1.5 text-sm text-gray-900 bg-white border border-r-0 border-gray-300 rounded-l-md focus:ring-2 focus:ring-inset focus:ring-black focus:outline-none'
                >
                  <span className='text-xs'>{countryCode[selectedCountryCode as keyof typeof countryCode]}</span>
                  <DropDownArrow />
                </button>
                
                {/* Country Code Dropdown */}
                {showCountryDropdown && (
                  <div className='absolute z-20 w-28 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                    {Object.entries(countryCode).map(([countryKey, code]) => (
                      <div
                        key={countryKey}
                        className='px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm'
                        onClick={() => handleCountryCodeSelect(countryKey)}
                      >
                        <div className='flex justify-between items-center'>
                          <span className='font-medium'>{countryKey}</span>
                          <span className='text-gray-500'>{code}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Mobile Number Input */}
              <input
                type='tel'
                value={mobileNumber}
                onChange={handleMobileNumberChange}
                id='mobile-no'
                placeholder='Enter mobile number'
                maxLength={11}
                className='flex-1 rounded-r-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='grid-item'>
            <label htmlFor='address' className='text-sm font-medium leading-6 text-gray-900'>
              City Address
              <span className='text-red-500'>*</span>
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
                placeholder='Provide your current city address'
                className={`rounded-md w-full border-0 px-3 pr-8 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 ${
                  !isCityFocused && cityInput.length > 20 ? 'text-ellipsis overflow-hidden whitespace-nowrap' : ''
                }`}
                style={{
                  textOverflow: !isCityFocused && cityInput.length > 20 ? 'ellipsis' : 'clip',
                }}
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
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 mt-11'>
        <div className='grid-item'>
          <label htmlFor='educational-attainment' className='block text-sm font-medium leading-6 text-gray-900'>
            Educational Attainment<span className='text-red-500'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='educational-attainment'
              {...register('educationalAttainment', { required: true })}
              className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
              tabIndex={13}
            >
              <option value=''>Select your educational attainment</option>
              {educationalAttainment.map((attainment, index) => (
                <option key={index} value={attainment}>
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
          <label htmlFor='education' className='text-sm font-medium leading-6 text-gray-900'>
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
              <div className='mt-1 text-xs text-blue-600'>✓ Custom degree entered</div>
            )}
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='college' className='text-sm font-medium leading-6 text-gray-900'>
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
              <div className='mt-1 text-xs text-blue-600'>✓ Custom school entered</div>
            )}
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
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 mt-11'>
        <div className='grid-item'>
          <h6 className='block text-sm font-medium leading-6 text-gray-900'>Photo (2x2 photo is recommended)</h6>
          <div className='mt-2'>
            <input
              type='file'
              {...register('profilePicture', {
                onChange: (e: any) => {
                  const file = e.target.files[0];
                  if (file && file.size > 5 * 1024 * 1024) {
                    toast.custom(() => <CustomToast message='Photo size should not exceed 5 MB' type='error' />, {
                      duration: 7000,
                    });
                    e.target.value = null;
                  } else {
                    renderUploadPhoto(e);
                  }
                },
              })}
              id='profile-picture'
              className='rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4 focus:ring-black'
              accept='image/png, image/jpeg, image/jpg'
            />
            <h6 className='text-xs mt-3'>Maximum file size: 5 MB</h6>
          </div>
        </div>
        <div className='grid-item'>
          <h6 className='block text-sm font-medium leading-6 text-gray-900'>Curriculum Vitae/Resume (Optional)</h6>
          <div className='mt-2'>
            <input
              type='file'
              {...register('resume', {
                onChange: (e: any) => {
                  const file = e.target.files[0];
                  if (file && file.size > 5 * 1024 * 1024) {
                    toast.custom(
                      () => <CustomToast message='Curriculum Vitae/Resume size should not exceed 5 MB' type='error' />,
                      {
                        duration: 7000,
                      }
                    );
                    e.target.value = null;
                  }
                },
              })}
              id='resume'
              className='rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm leading-4'
              accept='application/pdf'
            />
            <h6 className='text-xs mt-3'>Maximum file size: 5 MB</h6>
          </div>
        </div>
        <div className='grid-item'>
          <label htmlFor='portfolio' className='text-sm font-medium leading-6 text-gray-900'>
            Portfolio (Optional)
          </label>
          <div className='mt-2'>
            <input
              type='text'
              {...register('portfolio')}
              id='portfolio'
              className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
            />
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <button
          type='submit'
          className='w-full md:w-auto mt-10 md:mt-12 mb-7 rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          NEXT
        </button>
      </div>
    </form>
  );
};

export default ProfileTab;
