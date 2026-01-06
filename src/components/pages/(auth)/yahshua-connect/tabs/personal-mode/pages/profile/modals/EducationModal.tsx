import { useState, useEffect } from 'react';

import Modal from '../../../../../components/Modal';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';


import { T_Education } from '@/types/personal-mode';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education: T_Education[];
  onEdit: (id: number) => void;
  onAdd: () => void;
  onSave: (data: T_Education[]) => void;
}

const EducationModal = ({ isOpen, onClose, education, onEdit, onAdd, onSave }: EducationModalProps) => {
  const [localEducation, setLocalEducation] = useState<T_Education[]>(education);

  useEffect(() => {
    setLocalEducation(education);
  }, [education, isOpen]);

  const handleDelete = (id: number) => {
    setLocalEducation(localEducation.filter((edu) => edu.id !== id));
  };

  const handleSave = () => {
    onSave(localEducation);
    onClose();
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
        type="button"
        onClick={handleSave}
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
      title="Edit Education"
      size="2xl"
      footerContent={footerContent}
    >
      <div className="space-y-4 mb-6">
        {localEducation.map((edu) => (
          <div
            key={edu.id}
            className="flex items-start justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              {edu.educationalAttainment && (
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  {edu.educationalAttainment}
                </p>
              )}
              <h4 className="font-semibold text-gray-900 mb-1">{edu.degree || 'No degree specified'}</h4>
              <p className="text-sm text-gray-600 mb-1">
                {edu.school} • {edu.startYear} - {edu.endYear}
              </p>
            </div>
            <div className="ml-4 flex gap-2">
              <button
                onClick={() => edu.id && onEdit(edu.id)}
                className="p-2 text-gray-400 hover:text-savoy-blue hover:bg-savoy-blue/10 rounded-lg transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => edu.id && handleDelete(edu.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Education Button */}
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-savoy-blue hover:text-savoy-blue hover:bg-savoy-blue/5 transition-colors"
      >
        <PlusIcon className="h-5 w-5" />
        <span className="font-medium">Add Education</span>
      </button>
    </Modal>
  );
};

export default EducationModal;
