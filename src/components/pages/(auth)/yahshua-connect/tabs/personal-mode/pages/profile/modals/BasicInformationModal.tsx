import { useState, useEffect } from 'react';

import Modal from '../../../../../components/Modal';
import CustomDatePicker from '@/components/CustomDatePicker';

import DropDownArrow from '@/svg/DropDownArrow';

import nationalities from '@/utils/nationalities';

import { T_BasicInfo } from '@/types/personal-mode';

interface BasicInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  basicInfo: T_BasicInfo;
  onSave: (data: T_BasicInfo) => void;
}

const BasicInformationModal = ({ isOpen, onClose, basicInfo, onSave }: BasicInformationModalProps) => {
  const [formData, setFormData] = useState<T_BasicInfo>(basicInfo);
  
  // Nationality autocomplete state
  const [nationalityInput, setNationalityInput] = useState<string>(basicInfo.nationality || '');
  const [filteredNationalities, setFilteredNationalities] = useState(nationalities);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [selectedNationalityIndex, setSelectedNationalityIndex] = useState(-1);

  // Update form data when basicInfo changes
  useEffect(() => {
    setFormData(basicInfo);
    setNationalityInput(basicInfo.nationality || '');
  }, [basicInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof T_BasicInfo, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Nationality autocomplete handlers
  const handleNationalityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNationalityInput(value);
    handleChange('nationality', value);
    
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
        handleChange('nationality', selectedNationality);
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
    handleChange('nationality', nationality);
    setShowNationalityDropdown(false);
    setSelectedNationalityIndex(-1);
  };

  const handleNationalityBlur = () => {
    setTimeout(() => {
      setShowNationalityDropdown(false);
      setSelectedNationalityIndex(-1);
    }, 200);
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
      title="Edit Basic Information"
      size="2xl"
      footerContent={footerContent}
    >
      <form id="basic-info-form" onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstname}
              onChange={(e) => handleChange('firstname', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Middle Name
            </label>
            <input
              type="text"
              value={formData.middlename}
              onChange={(e) => handleChange('middlename', e.target.value)}
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
              value={formData.lastname}
              onChange={(e) => handleChange('lastname', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City Address
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birthday
            </label>
            <div className="relative">
              <CustomDatePicker
                id="birthday-datepicker"
                placeholder="mm/dd/yyyy"
                className="block w-full rounded-lg py-3 px-4 text-gray-900 shadow-sm border border-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                selected={formData.birthday}
                pickerOnChange={(date: any) => handleChange('birthday', date)}
                inputOnChange={(value: any) => handleChange('birthday', value ? new Date(value) : null)}
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
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all appearance-none"
                required
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
              value={formData.religion}
              onChange={(e) => handleChange('religion', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={nationalityInput}
                onChange={handleNationalityInputChange}
                onKeyDown={handleNationalityKeyDown}
                onBlur={handleNationalityBlur}
                onFocus={() => setShowNationalityDropdown(true)}
                placeholder="Search for your nationality..."
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                required
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
                      onClick={() => handleNationalitySelect(nationality)}
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
            </div>
          </div>

          {/* Civil Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Civil Status<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.civilStatus}
                onChange={(e) => handleChange('civilStatus', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all appearance-none"
                required
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
        </div>
      </form>
    </Modal>
  );
};

export default BasicInformationModal;
