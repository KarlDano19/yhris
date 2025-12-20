'use client';

import Modal from '../../../components/Modal';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Education {
  id: number;
  degree: string;
  school: string;
  startYear: string;
  endYear: string;
  note?: string;
}

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education: Education[];
  onEdit: (id: number) => void;
  onAdd: () => void;
  onSave: (data: Education[]) => void;
}

const EducationModal = ({ isOpen, onClose, education, onEdit, onAdd, onSave }: EducationModalProps) => {
  const handleSave = () => {
    onSave(education);
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
        {education.map((edu) => (
          <div
            key={edu.id}
            className="flex items-start justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{edu.degree}</h4>
              <p className="text-sm text-gray-600 mb-1">
                {edu.school} • {edu.startYear} - {edu.endYear}
              </p>
              {edu.note && <p className="text-sm text-gray-500">{edu.note}</p>}
            </div>
            <button
              onClick={() => onEdit(edu.id)}
              className="ml-4 p-2 text-gray-400 hover:text-savoy-blue hover:bg-savoy-blue/10 rounded-lg transition-colors"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
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
