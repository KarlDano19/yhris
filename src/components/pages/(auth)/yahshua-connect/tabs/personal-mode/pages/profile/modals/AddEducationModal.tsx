import { useState, useEffect } from 'react';

import Modal from '../../../../../components/Modal';

import DropDownArrow from '@/svg/DropDownArrow';

import colleges from '@/utils/colleges';
import degrees from '@/utils/degrees';
import educationalAttainment from '@/utils/educational-attainment';

import { T_Education } from '@/types/personal-mode';

interface AddEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: T_Education) => void;
  initialData?: T_Education | null;
}

const AddEducationModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}: AddEducationModalProps) => {
  const [formData, setFormData] = useState<T_Education>({
    educationalAttainment: '',
    degree: '',
    school: '',
    startYear: '',
    endYear: '',
  });

  // Degree autocomplete state
  const [degreeInput, setDegreeInput] = useState('');
  const [filteredDegrees, setFilteredDegrees] = useState(degrees);
  const [showDegreeDropdown, setShowDegreeDropdown] = useState(false);
  const [selectedDegreeIndex, setSelectedDegreeIndex] = useState(-1);
  const [isCustomDegree, setIsCustomDegree] = useState(false);
  const [isDegreeFocused, setIsDegreeFocused] = useState(false);

  // College autocomplete state
  const [collegeInput, setCollegeInput] = useState('');
  const [filteredColleges, setFilteredColleges] = useState(colleges);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [selectedCollegeIndex, setSelectedCollegeIndex] = useState(-1);
  const [isCustomCollege, setIsCustomCollege] = useState(false);
  const [isCollegeFocused, setIsCollegeFocused] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setDegreeInput(initialData.degree || '');
      setCollegeInput(initialData.school || '');
      
      // Check if degree is in our degrees list
      if (initialData.degree) {
        const isInList = degrees.some(degree => 
          degree.degreeTitle.toLowerCase() === initialData.degree.toLowerCase()
        );
        setIsCustomDegree(!isInList);
      }
      
      // Check if college is in our colleges list
      if (initialData.school) {
        const isInList = colleges.some(college => 
          college.institutionName.toLowerCase() === initialData.school.toLowerCase()
        );
        setIsCustomCollege(!isInList);
      }
    } else {
      setFormData({
        educationalAttainment: '',
        degree: '',
        school: '',
        startYear: '',
        endYear: '',
      });
      setDegreeInput('');
      setCollegeInput('');
      setIsCustomDegree(false);
      setIsCustomCollege(false);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof T_Education, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Degree autocomplete handlers
  const handleDegreeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDegreeInput(value);
    handleChange('degree', value);
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
        handleChange('degree', selectedDegree.degreeTitle);
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
    handleChange('degree', degree.degreeTitle);
    setShowDegreeDropdown(false);
    setSelectedDegreeIndex(-1);
    setIsCustomDegree(false);
  };

  const handleDegreeBlur = () => {
    setTimeout(() => {
      setShowDegreeDropdown(false);
      setSelectedDegreeIndex(-1);
      setIsDegreeFocused(false);
    }, 200);
  };

  // College autocomplete handlers
  const handleCollegeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCollegeInput(value);
    handleChange('school', value);
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
        handleChange('school', selectedCollege.institutionName);
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
    handleChange('school', college.institutionName);
    setShowCollegeDropdown(false);
    setSelectedCollegeIndex(-1);
    setIsCustomCollege(false);
  };

  const handleCollegeBlur = () => {
    setTimeout(() => {
      setShowCollegeDropdown(false);
      setSelectedCollegeIndex(-1);
      setIsCollegeFocused(false);
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
        form="education-form"
        className="px-6 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
      >
        Save
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Education' : 'Add Education'}
      size="2xl"
      footerContent={footerContent}
    >
      <form id="education-form" onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* Educational Attainment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Educational Attainment <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.educationalAttainment || ''}
                onChange={(e) => handleChange('educationalAttainment', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all appearance-none pr-10"
                required
              >
                <option value="">Select your educational attainment</option>
                {educationalAttainment.map((attainment, index) => (
                  <option key={index} value={attainment}>
                    {attainment}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <DropDownArrow />
              </div>
            </div>
          </div>

          {/* Course/Degree */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course/Degree
            </label>
            <div className="relative">
              <input
                type="text"
                value={degreeInput}
                onChange={handleDegreeInputChange}
                onKeyDown={handleDegreeKeyDown}
                onBlur={handleDegreeBlur}
                onFocus={() => {
                  setShowDegreeDropdown(true);
                  setIsDegreeFocused(true);
                }}
                placeholder="Search for your degree or type custom..."
                className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all ${
                  !isDegreeFocused && degreeInput.length > 20 ? 'text-ellipsis overflow-hidden whitespace-nowrap' : ''
                }`}
                style={{
                  textOverflow: !isDegreeFocused && degreeInput.length > 20 ? 'ellipsis' : 'clip',
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <DropDownArrow />
              </div>
              
              {/* Degree autocomplete dropdown */}
              {showDegreeDropdown && filteredDegrees.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredDegrees.slice(0, 10).map((degree, index) => (
                    <div
                      key={index}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        index === selectedDegreeIndex ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleDegreeSelect(degree)}
                    >
                      <div className="font-medium">{degree.degreeTitle}</div>
                      <div className="text-sm text-gray-500">
                        {degree.degreeReference} • {degree.degreeLevel}
                      </div>
                    </div>
                  ))}
                  {filteredDegrees.length > 10 && (
                    <div className="px-3 py-2 text-sm text-gray-500 border-t">
                      Showing first 10 results. Type more to narrow down.
                    </div>
                  )}
                </div>
              )}
              
              {/* Custom degree indicator */}
              {isCustomDegree && degreeInput.trim() !== '' && (
                <div className="mt-1 text-xs text-blue-600">
                  ✓ Custom degree entered
                </div>
              )}
            </div>
          </div>

          {/* School / Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School / Institution <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={collegeInput}
                onChange={handleCollegeInputChange}
                onKeyDown={handleCollegeKeyDown}
                onBlur={handleCollegeBlur}
                onFocus={() => {
                  setShowCollegeDropdown(true);
                  setIsCollegeFocused(true);
                }}
                placeholder="Search for your school or type custom..."
                className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all ${
                  !isCollegeFocused && collegeInput.length > 20 ? 'text-ellipsis overflow-hidden whitespace-nowrap' : ''
                }`}
                style={{
                  textOverflow: !isCollegeFocused && collegeInput.length > 20 ? 'ellipsis' : 'clip',
                }}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <DropDownArrow />
              </div>
              
              {/* College autocomplete dropdown */}
              {showCollegeDropdown && filteredColleges.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredColleges.slice(0, 10).map((college, index) => (
                    <div
                      key={index}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        index === selectedCollegeIndex ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleCollegeSelect(college)}
                    >
                      <div className="font-medium">{college.institutionName}</div>
                      <div className="text-sm text-gray-500">
                        {college.municipality}, {college.province}
                      </div>
                    </div>
                  ))}
                  {filteredColleges.length > 10 && (
                    <div className="px-3 py-2 text-sm text-gray-500 border-t">
                      Showing first 10 results. Type more to narrow down.
                    </div>
                  )}
                </div>
              )}
              
              {/* Custom college indicator */}
              {isCustomCollege && collegeInput.trim() !== '' && (
                <div className="mt-1 text-xs text-blue-600">
                  ✓ Custom school entered
                </div>
              )}
            </div>
          </div>

          {/* Start Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Year
            </label>
            <input
              type="text"
              value={formData.startYear}
              onChange={(e) => handleChange('startYear', e.target.value)}
              placeholder="e.g., 2016"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* End Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Year
            </label>
            <input
              type="text"
              value={formData.endYear}
              onChange={(e) => handleChange('endYear', e.target.value)}
              placeholder="e.g., 2020"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddEducationModal;

