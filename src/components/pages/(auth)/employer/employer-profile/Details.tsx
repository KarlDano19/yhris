'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import { getRegions, getProvinces, getMunicipalities, getBarangays } from '@/utils/philippines';

import SelectChevronDown from '@/svg/SelectChevronDown';

const Details = ({
  register,
  handleSubmit,
  setValue,
  watch,
  setProgressBar,
  errors,
  clearErrors,
  trigger,
}: {
  register: any;
  handleSubmit: any;
  setValue: any;
  watch: any;
  setProgressBar: any;
  errors: any;
  clearErrors: any;
  trigger: any;
}) => {
  // State for autocomplete dropdowns
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false);
  const [showBarangayDropdown, setShowBarangayDropdown] = useState(false);
  
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(-1);
  const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(-1);
  const [selectedMunicipalityIndex, setSelectedMunicipalityIndex] = useState(-1);
  const [selectedBarangayIndex, setSelectedBarangayIndex] = useState(-1);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [selectedIndustryIndex, setSelectedIndustryIndex] = useState(-1);
  
  const regions = getRegions();
  
  // Industry options for autocomplete with examples as placeholders
  const industryOptions = [
    { value: 'Manufacturing of:', display: 'Manufacturing of: (e.g., Textiles, Electronics)' },
    { value: 'Service/s:', display: 'Service/s: (e.g., IT, BPO, Healthcare)' },
    { value: 'Others:', display: 'Others: (e.g., Real Estate, Agriculture)' }
  ];
  
  // Get the selected values from form to determine available options
  const selectedRegionCode = (() => {
    const regionName = watch('region');
    if (!regionName) return '';
    const region = regions.find(r => r.name === regionName);
    return region?.code || '';
  })();
  
  const selectedProvince = watch('province') || '';
  const selectedMunicipality = watch('city') || '';
  
  const provinces = getProvinces(selectedRegionCode);
  const municipalities = getMunicipalities(selectedRegionCode, selectedProvince);
  const barangays = getBarangays(selectedRegionCode, selectedProvince, selectedMunicipality);
  
  // Filter functions for autocomplete
  const filteredRegions = regions.filter(region => 
    region.name.toLowerCase().includes(watch('region')?.toLowerCase() || '')
  );
  
  const filteredProvinces = provinces.filter((province: string) => 
    province.toLowerCase().includes(watch('province')?.toLowerCase() || '')
  );
  
  const filteredMunicipalities = municipalities.filter((municipality: string) => 
    municipality.toLowerCase().includes(watch('city')?.toLowerCase() || '')
  );
  
  const filteredBarangays = barangays.filter((barangay: string) => 
    barangay.toLowerCase().includes(watch('locality')?.toLowerCase() || '')
  );
  
  // Filter industry options for autocomplete
  const filteredIndustries = industryOptions.filter((industry) => 
    industry.display.toLowerCase().includes(watch('typeOfIndustry')?.toLowerCase() || '')
  );
  
  // Watch form values to clear validation errors when options are selected
  const watchedRegion = watch('region');
  const watchedProvince = watch('province');
  const watchedMunicipality = watch('city');
  const watchedBarangay = watch('locality');
  const watchedCountry = watch('country');
  const watchedCompanyName = watch('companyName');
  const watchedMobileNumber = watch('mobileNumber');
  const watchedStreet = watch('street');
  const watchedZipCode = watch('zipCode');
  const watchedTypeOfIndustry = watch('typeOfIndustry');
  
  // Clear errors when watched values change
  useEffect(() => {
    if (watchedRegion) clearErrors('region');
  }, [watchedRegion, clearErrors]);
  
  useEffect(() => {
    if (watchedProvince) clearErrors('province');
  }, [watchedProvince, clearErrors]);
  
  useEffect(() => {
    if (watchedMunicipality) clearErrors('city');
  }, [watchedMunicipality, clearErrors]);
  
  useEffect(() => {
    if (watchedBarangay) clearErrors('locality');
  }, [watchedBarangay, clearErrors]);
  
  useEffect(() => {
    if (watchedCountry) clearErrors('country');
  }, [watchedCountry, clearErrors]);
  
  useEffect(() => {
    if (watchedCompanyName) clearErrors('companyName');
  }, [watchedCompanyName, clearErrors]);
  
  useEffect(() => {
    if (watchedMobileNumber) clearErrors('mobileNumber');
  }, [watchedMobileNumber, clearErrors]);
  
  useEffect(() => {
    if (watchedStreet) clearErrors('street');
  }, [watchedStreet, clearErrors]);
  
  useEffect(() => {
    if (watchedZipCode) clearErrors('zipCode');
  }, [watchedZipCode, clearErrors]);
  
  useEffect(() => {
    if (watchedTypeOfIndustry && watchedTypeOfIndustry.trim() !== '' && watchedTypeOfIndustry !== 'Select Industry Type') {
      // Check if it's a valid industry type (either has prefix or is custom)
      const prefixes = ['Manufacturing of:', 'Service/s:', 'Others:'];
      const hasPrefix = prefixes.some(prefix => watchedTypeOfIndustry.startsWith(prefix));
      const isCustom = !hasPrefix && watchedTypeOfIndustry.trim() !== '';
      
      if (hasPrefix || isCustom) {
        clearErrors('typeOfIndustry');
      }
    }
  }, [watchedTypeOfIndustry, clearErrors]);
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manually trigger React Hook Form validation for all fields
    await trigger();
    
    // Check if there are any validation errors other than address fields and zip code
    const nonAddressErrors = Object.keys(errors).filter(key => 
      !['region', 'province', 'city', 'locality', 'zipCode'].includes(key)
    );
    
    if (nonAddressErrors.length > 0) {
      // If there are other validation errors, don't show toast - let the form errors show
      return;
    }
    
    // Check if all other required fields are filled
    const formValues = watch();
    const requiredFields = ['companyName', 'mobileNumber', 'street', 'typeOfIndustry'];
    const missingRequiredFields = requiredFields.filter(field => !formValues[field] || formValues[field].trim() === '');
    
    if (missingRequiredFields.length > 0) {
      // If other required fields are missing, don't show toast - let the form errors show
      return;
    }
    
    // If all other required fields are filled and only address fields are missing, check address field order
    if (!selectedRegionCode) {
      toast.custom(() => <CustomToast message={'Please select a region first'} type='error' />, {
        duration: 3000,
      });
      return;
    }
    
    if (!selectedProvince) {
      toast.custom(() => <CustomToast message={'Please select a province first'} type='error' />, {
        duration: 3000,
      });
      return;
    }
    
    if (!selectedMunicipality) {
      toast.custom(() => <CustomToast message={'Please select a city/municipality first'} type='error' />, {
        duration: 3000,
      });
      return;
    }
    
    if (!formValues.locality) {
      toast.custom(() => <CustomToast message={'Please select a barangay first'} type='error' />, {
        duration: 3000,
      });
      return;
    }
    
    setProgressBar(1);
  };

  const uploadImgOnChange = ({ target }: { target: any }) => {
    const file = target.files[0];
    if (!file) return;
    if (file.size <= 5000000) {
      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(target.files[0]);
        reader.onload = () => {
          setValue('companyLogo', file);
          setValue('imagePath', reader.result);
        };
      }
    } else {
      toast.custom(() => <CustomToast message={'Maximum file size is 5mb.'} type='error' />, {
        duration: 2000,
      });
    }
  };

  // Keyboard navigation handlers
  const handleRegionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedRegionIndex(prev => 
        prev < filteredRegions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedRegionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedRegionIndex >= 0) {
      e.preventDefault();
      const selectedRegion = filteredRegions[selectedRegionIndex];
      if (selectedRegion) {
        setValue('region', selectedRegion.name);
        setShowRegionDropdown(false);
        clearErrors('region');
      }
    } else if (e.key === 'Escape') {
      setShowRegionDropdown(false);
    }
  };

  const handleProvinceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedProvinceIndex(prev => 
        prev < filteredProvinces.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedProvinceIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedProvinceIndex >= 0) {
      e.preventDefault();
      const selectedProvince = filteredProvinces[selectedProvinceIndex];
      if (selectedProvince) {
        setValue('province', selectedProvince);
        setShowProvinceDropdown(false);
        clearErrors('province');
      }
    } else if (e.key === 'Escape') {
      setShowProvinceDropdown(false);
    }
  };

  const handleMunicipalityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedMunicipalityIndex(prev => 
        prev < filteredMunicipalities.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedMunicipalityIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedMunicipalityIndex >= 0) {
      e.preventDefault();
      const selectedMunicipality = filteredMunicipalities[selectedMunicipalityIndex];
      if (selectedMunicipality) {
        setValue('municipality', selectedMunicipality);
        setShowMunicipalityDropdown(false);
        clearErrors('municipality');
      }
    } else if (e.key === 'Escape') {
      setShowMunicipalityDropdown(false);
    }
  };

  const handleBarangayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedBarangayIndex(prev => 
        prev < filteredBarangays.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedBarangayIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedBarangayIndex >= 0) {
      e.preventDefault();
      const selectedBarangay = filteredBarangays[selectedBarangayIndex];
      if (selectedBarangay) {
        setValue('barangay', selectedBarangay);
        setShowBarangayDropdown(false);
        clearErrors('barangay');
      }
    } else if (e.key === 'Escape') {
      setShowBarangayDropdown(false);
    }
  };

  const handleIndustryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndustryIndex(prev => 
        prev < filteredIndustries.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndustryIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndustryIndex >= 0) {
      e.preventDefault();
      const selectedIndustry = filteredIndustries[selectedIndustryIndex];
      if (selectedIndustry) {
        setValue('typeOfIndustry', selectedIndustry.value);
        setShowIndustryDropdown(false);
        clearErrors('typeOfIndustry');
      }
    } else if (e.key === 'Escape') {
      setShowIndustryDropdown(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Company Information Section - Mobile: Stacked, Desktop: Original 3-column layout */}
      <div className='flex flex-col lg:flex-row my-6 lg:my-10 gap-6'>
        {/* Company Logo - Mobile: Centered, Desktop: Left column */}
        <div className='flex justify-center lg:justify-start lg:basis-44 lg:mr-10'>
          <Image
            src={watch('imagePath') || '/assets/no-user.png'}
            width={143}
            height={164}
            priority={true}
            alt='employer-logo'
            className='rounded object-cover max-w-[143px] h-[164px]'
          />
        </div>
        
        {/* Company Name & Logo Upload - Mobile: Stacked, Desktop: Middle column */}
        <div className='lg:basis-1/3 lg:mr-10 space-y-6'>
          <div>
            <label htmlFor='companyName' className='block mb-2 text-sm font-medium text-gray-900'>
              Company Name<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='companyName'
              {...register('companyName', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
            {errors.companyName && (
              <p className='mt-1 text-sm text-red-600'>{errors.companyName.message || 'Company name is required'}</p>
            )}
          </div>
          
          <div>
            <label htmlFor='companyLogo' className='block mb-2 text-sm font-medium text-gray-900'>
              Company Logo
            </label>
            <input
              type='file'
              id='companyLogo'
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              onChange={uploadImgOnChange}
              accept='image/png, image/jpeg, image/jpg'
            />
          </div>
        </div>
        
        {/* Company Description - Mobile: Stacked, Desktop: Right column */}
        <div className='lg:basis-2/3'>
          <label
            htmlFor='companyDescription'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            About the Company
          </label>
          <textarea
            id='companyDescription'
            {...register('companyDescription', { required: false })}
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 h-32 lg:h-5/6'
            placeholder='Tell us about your company...'
          />
          <label className='text-sm text-gray-500 mt-2 lg:mt-5 ml-2'>Maximum words: 500</label>
        </div>
      </div>
      {/* Industry and Work Setup Section - Mobile: Stacked, Desktop: Original 3-column layout */}
      <div className='flex flex-col lg:flex-row my-6 lg:my-10 gap-6'>
        <div className='lg:basis-1/3 lg:mr-10'>
          <label htmlFor='typeOfIndustry' className='block mb-2 text-sm font-medium text-gray-900'>
            Type of Industry<span className='text-red-500'>*</span>
          </label>
          <div className='relative mt-2'>
            <input
              type='text'
              id='typeOfIndustry'
              {...register('typeOfIndustry', { required: true })}
              value={watch('typeOfIndustry') || ''}
              onChange={(e) => {
                setValue('typeOfIndustry', e.target.value);
                setShowIndustryDropdown(true);
                setSelectedIndustryIndex(-1);
              }}
              onKeyDown={handleIndustryKeyDown}
              onFocus={() => setShowIndustryDropdown(true)}
              onBlur={() => setTimeout(() => setShowIndustryDropdown(false), 200)}
              placeholder='Type to search industry...'
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
              <SelectChevronDown />
            </div>
            
            {/* Industry autocomplete dropdown */}
            {showIndustryDropdown && filteredIndustries.length > 0 && (
              <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                {filteredIndustries.map((industry, index) => (
                  <div
                    key={industry.value}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      index === selectedIndustryIndex ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => {
                      setValue('typeOfIndustry', industry.value);
                      setShowIndustryDropdown(false);
                      clearErrors('typeOfIndustry');
                    }}
                  >
                    {industry.display}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.typeOfIndustry && (
            <p className='mt-1 text-sm text-red-600'>{errors.typeOfIndustry.message || 'Type of industry is required'}</p>
          )}
        </div>
        <div className='lg:basis-1/3 lg:mr-10'>
          <label htmlFor='workSetUp' className='block mb-2 text-sm font-medium text-gray-900'>
            Work Set-up
          </label>
          <input
            type='text'
            id='workSetUp'
            {...register('workSetUp', { required: false })}
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
          />
        </div>
        <div className='lg:basis-1/3'></div>
      </div>
      {/* Contact Details Section - Mobile: Stacked, Desktop: Original 3-column layout */}
      <div className='my-6 lg:my-10'>
        <label className='text-lg font-semibold text-gray-900'>
          Contact Details
        </label>
        <div className='flex flex-col lg:flex-row mt-4 gap-6'>
          <div className='lg:basis-1/3 lg:mr-10'>
            <label htmlFor='mobileNumber' className='block mb-2 text-sm font-medium text-gray-900'>
              Mobile No.<span className='text-red-500'>*</span>
            </label>
            <input
              type='tel'
              id='mobileNumber'
              {...register('mobileNumber', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              pattern='[0-9]{11}'
              inputMode='numeric'
            />
            {errors.mobileNumber && (
              <p className='mt-1 text-sm text-red-600'>{errors.mobileNumber.message || 'Mobile number is required'}</p>
            )}
          </div>
          <div className='lg:basis-1/3 lg:mr-10'>
            <label htmlFor='landlineNumber' className='block mb-2 text-sm font-medium text-gray-900'>
              Landline No.
            </label>
            <input
              type='tel'
              id='landlineNumber'
              {...register('landlineNumber', { required: false })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              pattern='[0-9]'
              inputMode='numeric'
            />
          </div>
          <div className='lg:basis-1/3'></div>
        </div>
      </div>
      {/* Address Section */}
      <div className='my-6 lg:my-10'>
        <label className='text-lg font-semibold text-gray-900'>
          Address
        </label>
        
        {/* Region, Province, City Row - Mobile: Stacked, Desktop: Original 3-column layout */}
        <div className='flex flex-col lg:flex-row mt-4 mb-6 gap-6'>
          <div className='lg:basis-1/3 lg:mr-10'>
            <label htmlFor='region' className='block mb-2 text-sm font-medium text-gray-900'>
              Region<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <input
                type='text'
                id='region'
                {...register('region', { required: true })}
                value={watch('region') || ''}
                onChange={(e) => {
                  setValue('region', e.target.value);
                  setShowRegionDropdown(true);
                  setSelectedRegionIndex(-1);
                }}
                onKeyDown={handleRegionKeyDown}
                onFocus={() => setShowRegionDropdown(true)}
                onBlur={() => setTimeout(() => setShowRegionDropdown(false), 200)}
                placeholder='Type to search region...'
                className={`${watch('region') ? 'bg-gray-50' : 'bg-white'} border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
              />
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
              
              {/* Region autocomplete dropdown */}
              {showRegionDropdown && filteredRegions.length > 0 && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  {filteredRegions.slice(0, 10).map((region, index) => (
                    <div
                      key={region.code}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        index === selectedRegionIndex ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => {
                        setValue('region', region.name);
                        setShowRegionDropdown(false);
                        clearErrors('region');
                      }}
                    >
                      {region.name}
                    </div>
                  ))}
                  {filteredRegions.length > 10 && (
                    <div className='px-3 py-2 text-sm text-gray-500 border-t'>
                      Showing first 10 results. Type more to narrow down.
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.region && (
              <p className='mt-1 text-sm text-red-600'>{errors.region.message || 'Region is required'}</p>
            )}
          </div>
          <div className='lg:basis-1/3 lg:mr-10'>
            <label htmlFor='province' className='block mb-2 text-sm font-medium text-gray-900'>
              Province<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <input
                type='text'
                id='province'
                {...register('province', { required: true })}
                value={watch('province') || ''}
                onChange={(e) => {
                  setValue('province', e.target.value);
                  setShowProvinceDropdown(true);
                  setSelectedProvinceIndex(-1);
                }}
                onKeyDown={handleProvinceKeyDown}
                onFocus={() => setShowProvinceDropdown(true)}
                onBlur={() => setTimeout(() => setShowProvinceDropdown(false), 200)}
                placeholder='Type to search province...'
                disabled={!selectedRegionCode}
                className={`${watch('province') ? 'bg-gray-50' : 'bg-white'} border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${!selectedRegionCode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
              
              {/* Province autocomplete dropdown */}
              {showProvinceDropdown && filteredProvinces.length > 0 && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  {filteredProvinces.slice(0, 10).map((province, index) => (
                    <div
                      key={province}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        index === selectedProvinceIndex ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => {
                        setValue('province', province);
                        setShowProvinceDropdown(false);
                        clearErrors('province');
                      }}
                    >
                      {province}
                    </div>
                  ))}
                  {filteredProvinces.length > 10 && (
                    <div className='px-3 py-2 text-sm text-gray-500 border-t'>
                      Showing first 10 results. Type more to narrow down.
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.province && (
              <p className='mt-1 text-sm text-red-600'>{errors.province.message || 'Province is required'}</p>
            )}
          </div>
          <div className='lg:basis-1/3'>
            <label htmlFor='municipality' className='block mb-2 text-sm font-medium text-gray-900'>
              City/Municipality<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <input
                type='text'
                id='city'
                {...register('city', { required: true })}
                value={watch('city') || ''}
                onChange={(e) => {
                  setValue('city', e.target.value);
                  setShowMunicipalityDropdown(true);
                  setSelectedMunicipalityIndex(-1);
                }}
                onKeyDown={handleMunicipalityKeyDown}
                onFocus={() => setShowMunicipalityDropdown(true)}
                onBlur={() => setTimeout(() => setShowMunicipalityDropdown(false), 200)}
                placeholder='Type to search city/municipality...'
                disabled={!selectedProvince}
                className={`${watch('city') ? 'bg-gray-50' : 'bg-white'} border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${!selectedProvince ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
              
              {/* Municipality autocomplete dropdown */}
              {showMunicipalityDropdown && filteredMunicipalities.length > 0 && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  {filteredMunicipalities.slice(0, 10).map((municipality, index) => (
                    <div
                      key={municipality}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        index === selectedMunicipalityIndex ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => {
                        setValue('city', municipality);
                        setShowMunicipalityDropdown(false);
                        clearErrors('city');
                      }}
                    >
                      {municipality}
                    </div>
                  ))}
                  {filteredMunicipalities.length > 10 && (
                    <div className='px-3 py-2 text-sm text-gray-500 border-t'>
                      Showing first 10 results. Type more to narrow down.
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.city && (
              <p className='mt-1 text-sm text-red-600'>{errors.city.message || 'City/Municipality is required'}</p>
            )}
          </div>
        </div>
        {/* Barangay, Building, Street Row - Mobile: Stacked, Desktop: Original 3-column layout */}
        <div className='flex flex-col lg:flex-row mb-6 gap-6'>
          <div className='lg:basis-1/3 lg:mr-10'>
            <label htmlFor='barangay' className='block mb-2 text-sm font-medium text-gray-900'>
              Town/Brgy<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <input
                type='text'
                id='locality'
                {...register('locality', { required: true })}
                value={watch('locality') || ''}
                onChange={(e) => {
                  setValue('locality', e.target.value);
                  setShowBarangayDropdown(true);
                  setSelectedBarangayIndex(-1);
                }}
                onKeyDown={handleBarangayKeyDown}
                onFocus={() => setShowBarangayDropdown(true)}
                onBlur={() => setTimeout(() => setShowBarangayDropdown(false), 200)}
                placeholder='Type to search barangay...'
                disabled={!selectedMunicipality}
                className={`${watch('locality') ? 'bg-gray-50' : 'bg-white'} border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${!selectedMunicipality ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
              
              {/* Barangay autocomplete dropdown */}
              {showBarangayDropdown && filteredBarangays.length > 0 && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  {filteredBarangays.slice(0, 10).map((barangay: string, index: number) => (
                    <div
                      key={barangay}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        index === selectedBarangayIndex ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => {
                        setValue('locality', barangay);
                        setShowBarangayDropdown(false);
                        clearErrors('locality');
                      }}
                    >
                      {barangay}
                    </div>
                  ))}
                  {filteredBarangays.length > 10 && (
                    <div className='px-3 py-2 text-sm text-gray-500 border-t'>
                      Showing first 10 results. Type more to narrow down.
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.locality && (
              <p className='mt-1 text-sm text-red-600'>{errors.locality.message || 'Barangay is required'}</p>
            )}
          </div>
          <div className='lg:basis-1/3 lg:mr-10'>
            <label htmlFor='building' className='block mb-2 text-sm font-medium text-gray-900'>
              House No./Bldg./Apartment/Suite, etc.
            </label>
            <input
              type='text'
              id='building'
              {...register('building', { required: false })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
          </div>
          <div className='lg:basis-1/3'>
            <label htmlFor='street' className='block mb-2 text-sm font-medium text-gray-900'>
              Street<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='street'
              {...register('street', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
            {errors.street && (
              <p className='mt-1 text-sm text-red-600'>{errors.street.message || 'Street is required'}</p>
            )}
          </div>
        </div>
        {/* Country and Zip Code Row - Mobile: Stacked, Desktop: Original 3-column layout */}
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='lg:basis-1/3 lg:mr-10'>
            <label htmlFor='country' className='block mb-2 text-sm font-medium text-gray-900'>
              Country<span className='text-red-500'>*</span>
            </label>
            <div className='relative mt-2'>
              <input
                type='text'
                id='country'
                {...register('country', { required: true })}
                value={watch('country') || 'Philippines'}
                onChange={(e) => {
                  setValue('country', e.target.value);
                }}
                placeholder='Country'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                readOnly
              />
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
            </div>
            {errors.country && (
              <p className='mt-1 text-sm text-red-600'>{errors.country.message || 'Country is required'}</p>
            )}
          </div>
          <div className='lg:basis-1/3 lg:mr-10'>
            <label htmlFor='zipCode' className='block mb-2 text-sm font-medium text-gray-900'>
              Zip Code<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='zipCode'
              {...register('zipCode', { required: true })}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
            {errors.zipCode && (
              <p className='mt-1 text-sm text-red-600'>{errors.zipCode.message || 'Zip code is required'}</p>
            )}
          </div>
          <div className='lg:basis-1/3'></div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className='flex justify-center lg:justify-end mt-8'>
        <button
          type='submit'
          className='w-full lg:w-52 uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default Details;
