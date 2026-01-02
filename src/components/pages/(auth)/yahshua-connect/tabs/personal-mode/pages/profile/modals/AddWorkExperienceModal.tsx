'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../../../components/Modal';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface WorkExperience {
  id?: number;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface AddWorkExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: WorkExperience) => void;
  initialData?: WorkExperience | null;
}

const AddWorkExperienceModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}: AddWorkExperienceModalProps) => {
  const [formData, setFormData] = useState<WorkExperience>({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof WorkExperience, value: string | boolean) => {
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
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all pr-10"
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* End Date */}
          {!formData.current && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all pr-10"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Current Work Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="current-work"
              checked={formData.current}
              onChange={(e) => handleChange('current', e.target.checked)}
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

