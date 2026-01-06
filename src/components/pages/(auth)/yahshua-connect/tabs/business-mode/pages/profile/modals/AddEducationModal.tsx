'use client';

import { useState, useEffect } from 'react';
import Modal from '../../../../../components/Modal';

interface Education {
  id?: number;
  degree: string;
  school: string;
  startYear: string;
  endYear: string;
  note?: string;
}

interface AddEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Education) => void;
  initialData?: Education | null;
}

const AddEducationModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}: AddEducationModalProps) => {
  const [formData, setFormData] = useState<Education>({
    degree: '',
    school: '',
    startYear: '',
    endYear: '',
    note: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        degree: '',
        school: '',
        startYear: '',
        endYear: '',
        note: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof Education, value: string) => {
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
          {/* Degree / Certificate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Degree / Certificate <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => handleChange('degree', e.target.value)}
              placeholder="e.g., BS Computer Science"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* School / Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School / Institution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => handleChange('school', e.target.value)}
              placeholder="e.g., Xavier University"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              required
            />
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

          {/* Description (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.note || ''}
              onChange={(e) => handleChange('note', e.target.value)}
              placeholder="Notable achievements..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddEducationModal;

