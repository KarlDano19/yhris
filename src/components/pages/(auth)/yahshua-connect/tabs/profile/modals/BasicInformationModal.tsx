import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import toast from 'react-hot-toast';

import Modal from '../../../components/Modal';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import LocationPermissionModal from '../../../modals/LocationPermissionModal';

import DropDownArrow from '@/svg/DropDownArrow';
import { MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';

import nationalities from '@/utils/nationalities';

import { T_BasicInfo } from '@/types/personal-mode';

// Dynamically import the map component to avoid SSR issues (read-only display)
const LocationDisplayMap = dynamic<{ latitude: number; longitude: number; address: string }>(
  () => import('@/components/LocationDisplayMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading map...</span>
      </div>
    )
  }
);

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
  const addressValue = watch('address');
  const latitudeValue = watch('latitude');
  const longitudeValue = watch('longitude');

  // Nationality autocomplete state
  const [nationalityInput, setNationalityInput] = useState<string>(basicInfo.nationality || '');
  const [filteredNationalities, setFilteredNationalities] = useState(nationalities);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [selectedNationalityIndex, setSelectedNationalityIndex] = useState(-1);

  // Profile picture state
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(basicInfo.photoUrl || null);

  // Location permission modal state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Update form data when basicInfo changes
  useEffect(() => {
    if (isOpen) {
      reset({
        ...basicInfo,
        contactPersonAge: basicInfo.contactPersonAge || undefined,
      });
      setNationalityInput(basicInfo.nationality || '');
      setProfileImagePreview(basicInfo.photoUrl || null);
    }
  }, [basicInfo, isOpen, reset]);

  // Sync nationalityInput with form value
  useEffect(() => {
    setNationalityInput(nationalityValue || '');
  }, [nationalityValue]);

  // Handle location obtained from permission modal
  const handleLocationObtained = async (latitude: number, longitude: number) => {
    // Round latitude and longitude to 6 decimal places to match backend validation
    const roundedLatitude = Math.round(latitude * 1000000) / 1000000;
    const roundedLongitude = Math.round(longitude * 1000000) / 1000000;
    
    // Use reverse geocoding to get address from coordinates
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${roundedLatitude}&lon=${roundedLongitude}`
      );
      const data = await response.json();
      const address = data.display_name || `${roundedLatitude}, ${roundedLongitude}`;

      setValue('address', address);
      setValue('latitude', roundedLatitude);
      setValue('longitude', roundedLongitude);

      toast.custom(() => <CustomToast message="Location updated. Click 'Save Changes' to apply." type='success' />, { duration: 3000 });
    } catch (error) {
      // If reverse geocoding fails, just use coordinates
      setValue('address', `${roundedLatitude}, ${roundedLongitude}`);
      setValue('latitude', roundedLatitude);
      setValue('longitude', roundedLongitude);

      toast.custom(() => <CustomToast message="Location updated. Click 'Save Changes' to apply." type='success' />, { duration: 3000 });
    }
  };

  // Handle delete location
  const handleDeleteLocation = () => {
    setValue('address', '');
    setValue('latitude', null as any);
    setValue('longitude', null as any);
    toast.custom(() => <CustomToast message="Location removed. Click 'Save Changes' to apply." type='success' />, { duration: 3000 });
  };

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

          {/* Location Display (Read-only) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Location
              </label>
              <div className="flex items-center gap-2">
                {latitudeValue && longitudeValue && (
                  <button
                    type="button"
                    onClick={handleDeleteLocation}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete Location
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-savoy-blue text-white rounded-lg hover:bg-savoy-blue/90 transition-colors"
                >
                  <MapPinIcon className="w-4 h-4" />
                  Update Location
                </button>
              </div>
            </div>

            {/* Display current location address */}
            {addressValue && latitudeValue && longitudeValue && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">{addressValue}</p>
              </div>
            )}

            {/* Read-only map display */}
            {latitudeValue && longitudeValue ? (
              <LocationDisplayMap
                latitude={latitudeValue}
                longitude={longitudeValue}
                address={addressValue || ''}
              />
            ) : (
              <div className="h-[300px] bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <MapPinIcon className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 mb-3">No location set</p>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="px-4 py-2 bg-savoy-blue text-white rounded-lg hover:bg-savoy-blue/90 transition-colors text-sm"
                >
                  Set Your Location
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationObtained={handleLocationObtained}
      />
    </Modal>
  );
};

export default BasicInformationModal;
