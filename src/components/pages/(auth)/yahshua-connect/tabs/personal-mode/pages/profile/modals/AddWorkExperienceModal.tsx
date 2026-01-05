import { useState, useEffect } from 'react';

import Modal from '../../../../../components/Modal';
import CustomDatePicker from '@/components/CustomDatePicker';

import { T_WorkExperience } from '@/types/personal-mode';

// Helper function to parse date string to Date object
const parseDateString = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  try {
    // Try parsing as ISO date first
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
    // Try parsing "MMM YYYY" format (e.g., "Jan 2022")
    const parts = dateStr.trim().split(' ');
    if (parts.length === 2) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.indexOf(parts[0]);
      if (monthIndex !== -1) {
        return new Date(parseInt(parts[1]), monthIndex, 1);
      }
    }
    return null;
  } catch {
    return null;
  }
};

// Helper function to format Date to "MMM YYYY" string
const formatDateToString = (date: Date | null): string => {
  if (!date) return '';
  try {
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  } catch {
    return '';
  }
};

interface AddWorkExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: T_WorkExperience) => void;
  initialData?: T_WorkExperience | null;
}

const AddWorkExperienceModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}: AddWorkExperienceModalProps) => {
  const [formData, setFormData] = useState<T_WorkExperience>({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  // Date objects for the date pickers
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setStartDate(parseDateString(initialData.startDate));
      setEndDate(parseDateString(initialData.endDate));
    } else {
      setFormData({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      });
      setStartDate(null);
      setEndDate(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert Date objects back to string format before saving
    const dataToSave = {
      ...formData,
      startDate: formatDateToString(startDate),
      endDate: formatDateToString(endDate),
    };
    onSave(dataToSave);
    onClose();
  };

  const handleChange = (field: keyof T_WorkExperience, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        form="work-experience-form"
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
      title={initialData ? 'Edit Work Experience' : 'Add Work Experience'}
      size="2xl"
      footerContent={footerContent}
    >
      <form id="work-experience-form" onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., UX Designer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="e.g., Google"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <CustomDatePicker
                id="work-experience-start-date"
                placeholder="mm/dd/yyyy"
                className="block w-full rounded-lg py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all sm:text-sm sm:leading-6"
                selected={startDate}
                pickerOnChange={(date: Date | null) => {
                  setStartDate(date);
                }}
                inputOnChange={(value: any) => {
                  if (value instanceof Date) {
                    setStartDate(value);
                  }
                }}
              />
            </div>
          </div>

          {/* End Date */}
          {!formData.current && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <CustomDatePicker
                  id="work-experience-end-date"
                  placeholder="mm/dd/yyyy"
                  className="block w-full rounded-lg py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all sm:text-sm sm:leading-6"
                  selected={endDate}
                  minDate={startDate || undefined}
                  pickerOnChange={(date: Date | null) => {
                    setEndDate(date);
                  }}
                  inputOnChange={(value: any) => {
                    if (value instanceof Date) {
                      setEndDate(value);
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Current Work Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="current-work"
              checked={formData.current}
              onChange={(e) => {
                handleChange('current', e.target.checked);
                if (e.target.checked) {
                  setEndDate(null);
                }
              }}
              className="w-4 h-4 text-savoy-blue border-gray-300 rounded focus:ring-savoy-blue"
            />
            <label htmlFor="current-work" className="text-sm text-gray-700">
              I currently work here
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your responsibilities..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddWorkExperienceModal;

