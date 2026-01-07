import { useState, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import toast from 'react-hot-toast';

import Modal from '../../../components/Modal';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';

import DropDownArrow from '@/svg/DropDownArrow';

import nationalities from '@/utils/nationalities';
import regions from '@/utils/location';

import { T_BasicInfo } from '@/types/personal-mode';

interface BasicInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  basicInfo: T_BasicInfo;
  onSave: (data: T_BasicInfo) => void;
}

const BasicInformationModal = ({ isOpen, onClose, basicInfo, onSave }: BasicInformationModalProps) => {
  const { register, handleSubmit, control, setValue, reset, watch } = useForm<T_BasicInfo>({
    defaultValues: basicInfo,
  });

  // Watch form values for autocomplete inputs
  const nationalityValue = watch('nationality');
  const locationValue = watch('location');
  
  // Nationality autocomplete state
  const [nationalityInput, setNationalityInput] = useState<string>(basicInfo.nationality || '');
  const [filteredNationalities, setFilteredNationalities] = useState(nationalities);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [selectedNationalityIndex, setSelectedNationalityIndex] = useState(-1);

  // City address autocomplete state
  const [cityInput, setCityInput] = useState<string>(basicInfo.location || '');
  const [filteredCities, setFilteredCities] = useState(regions);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCityIndex, setSelectedCityIndex] = useState(-1);
  const [isCityFocused, setIsCityFocused] = useState(false);

  // Profile picture state
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(basicInfo.photoUrl || null);

  // Update form data when basicInfo changes
  useEffect(() => {
    if (isOpen) {
      reset({
        ...basicInfo,
        contactPersonAge: basicInfo.contactPersonAge || undefined,
      });
      setNationalityInput(basicInfo.nationality || '');
      setCityInput(basicInfo.location || '');
      setProfileImagePreview(basicInfo.photoUrl || null);
    }
  }, [basicInfo, isOpen, reset]);

  // Sync nationalityInput with form value
  useEffect(() => {
    setNationalityInput(nationalityValue || '');
  }, [nationalityValue]);

  // Sync cityInput with form value
  useEffect(() => {
    setCityInput(locationValue || '');
  }, [locationValue]);

  const onSubmit = (data: T_BasicInfo) => {
    onSave(data);
  };

  // Handle expected salary input - only allow numbers
  const handleExpectedSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    setValue('expectedSalary', value ? parseInt(value, 10) : null);
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
    setTimeout(() => {
      setShowNationalityDropdown(false);
      setSelectedNationalityIndex(-1);
    }, 200);
  };

  // City address autocomplete handlers
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    setValue('location', value);
    
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
        setValue('location', selectedCity.label);
        setShowCityDropdown(false);
        setSelectedCityIndex(-1);
      } else {
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
    setValue('location', city.label);
    setShowCityDropdown(false);
    setSelectedCityIndex(-1);
  };

  const handleCityBlur = () => {
    setTimeout(() => {
      setShowCityDropdown(false);
      setSelectedCityIndex(-1);
      setIsCityFocused(false);
    }, 200);
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE) {
      toast.custom(() => <CustomToast message="Maximum file size is 5MB." type='error' />, { duration: 4000 });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.custom(() => <CustomToast message="Please upload an image file." type='error' />, { duration: 4000 });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImagePreview(reader.result as string);
      setValue('photo', file);
    };
    reader.readAsDataURL(file);
  };

  const footerContent = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2.5 border-2 border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="basic-info-form"
        className="px-6 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      size="5xl"
      footerContent={footerContent}
    >
      <form id="basic-info-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          {/* Profile Picture and About Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Profile Picture */}
            <div>
              <h6 className="block text-sm font-semibold text-gray-900 mb-3">Profile Picture</h6>
              <div className="flex items-start gap-4">
                <div className="overflow-hidden h-[155px] w-[143px] flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
                  <Image
                    src={profileImagePreview || '/assets/no-user.png'}
                    width={143}
                    height={155}
                    priority={true}
                    alt="profile-picture"
                    className="rounded object-cover max-w-[143px] h-[155px]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo (2x2 photo is recommended)
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleProfilePictureChange}
                    className="rounded-md w-full bg-white border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue text-sm leading-4"
                  />
                  <p className="text-xs text-gray-600 mt-3">Maximum file size: 5 MB</p>
                </div>
              </div>
            </div>

            {/* About you */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                About you
              </label>
              <textarea
                rows={6}
                {...register('about')}
                placeholder="Tell us about you..."
                className="block w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all sm:text-sm sm:leading-6 resize-y"
              />
              <p className="text-xs text-gray-600 mt-3">Maximum words: 500</p>
            </div>
          </div>

          {/* Row 1: First Name, Middle Name, Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('firstname', { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                {...register('middlename')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('lastname', { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 2: Birthday, Gender, Religion */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Birthday */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birthday
              </label>
              <div className="relative">
                <Controller
                  control={control}
                  name="birthday"
                  render={({ field }) => (
                    <CustomDatePicker
                      id="birthday-datepicker"
                      placeholder="mm/dd/yyyy"
                      className="block w-full rounded-lg py-3 px-4 text-gray-900 shadow-sm border border-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                      selected={field.value}
                      pickerOnChange={(date: any) => field.onChange(date)}
                      inputOnChange={(value: any) => field.onChange(value ? new Date(value) : null)}
                    />
                  )}
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('gender', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all appearance-none"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <DropDownArrow />
                </div>
              </div>
            </div>

            {/* Religion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Religion<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('religion', { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 3: Nationality, Civil Status, City Address */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Controller
                  control={control}
                  name="nationality"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        value={nationalityInput}
                        onChange={handleNationalityInputChange}
                        onKeyDown={handleNationalityKeyDown}
                        onBlur={handleNationalityBlur}
                        onFocus={() => setShowNationalityDropdown(true)}
                        placeholder="Search for your nationality..."
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <DropDownArrow />
                      </div>
                      
                      {/* Nationality autocomplete dropdown */}
                      {showNationalityDropdown && filteredNationalities.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredNationalities.slice(0, 10).map((nationality, index) => (
                            <div
                              key={index}
                              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                index === selectedNationalityIndex ? 'bg-gray-100' : ''
                              }`}
                              onMouseDown={(e) => {
                                e.preventDefault(); // Prevent input blur
                                handleNationalitySelect(nationality);
                              }}
                            >
                              <div className="font-medium">{nationality}</div>
                            </div>
                          ))}
                          {filteredNationalities.length > 10 && (
                            <div className="px-3 py-2 text-sm text-gray-500 border-t">
                              Showing first 10 results. Type more to narrow down.
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Civil Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Civil Status<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('civilStatus', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all appearance-none"
                >
                  <option value="">Select civil status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <DropDownArrow />
                </div>
              </div>
            </div>

            {/* City Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City Address
              </label>
              <div className="relative">
                <Controller
                  control={control}
                  name="location"
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        value={cityInput}
                        onChange={handleCityInputChange}
                        onKeyDown={handleCityKeyDown}
                        onBlur={handleCityBlur}
                        onFocus={() => {
                          setShowCityDropdown(true);
                          setIsCityFocused(true);
                        }}
                        placeholder="Search for your city..."
                        className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all ${
                          !isCityFocused && cityInput.length > 20 ? 'text-ellipsis overflow-hidden whitespace-nowrap' : ''
                        }`}
                        style={{
                          textOverflow: !isCityFocused && cityInput.length > 20 ? 'ellipsis' : 'clip',
                        }}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <DropDownArrow />
                      </div>
                      
                      {/* City autocomplete dropdown */}
                      {showCityDropdown && filteredCities.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredCities.slice(0, 10).map((city, index) => (
                            <div
                              key={index}
                              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                index === selectedCityIndex ? 'bg-gray-100' : ''
                              }`}
                              onMouseDown={(e) => {
                                e.preventDefault(); // Prevent input blur
                                handleCitySelect(city);
                              }}
                            >
                              <div className="font-medium">{city.label}</div>
                            </div>
                          ))}
                          {filteredCities.length > 10 && (
                            <div className="px-3 py-2 text-sm text-gray-500 border-t">
                              Showing first 10 results. Type more to narrow down.
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Row 4: Expected Salary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Expected Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Salary (PHP)
              </label>
              <Controller
                control={control}
                name="expectedSalary"
                render={({ field }) => (
                  <input
                    type="text"
                    value={field.value?.toString() || ''}
                    onChange={handleExpectedSalaryChange}
                    placeholder="Enter expected salary"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default BasicInformationModal;
