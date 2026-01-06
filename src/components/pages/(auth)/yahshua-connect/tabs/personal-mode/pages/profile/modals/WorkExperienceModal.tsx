import { useState, useEffect } from 'react';

import Modal from '../../../../../components/Modal';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import { T_WorkExperience } from '@/types/personal-mode';

interface WorkExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workExperience: T_WorkExperience[];
  onEdit: (id: number, experience: T_WorkExperience) => void;
  onAdd: () => void;
  onSave: (data: T_WorkExperience[]) => void;
  onUpdateLocal: (data: T_WorkExperience[]) => void;
}

const WorkExperienceModal = ({
  isOpen,
  onClose,
  workExperience,
  onEdit,
  onAdd,
  onSave,
  onUpdateLocal,
}: WorkExperienceModalProps) => {
  const [localWorkExperience, setLocalWorkExperience] = useState<T_WorkExperience[]>(workExperience);

  useEffect(() => {
    setLocalWorkExperience(workExperience);
  }, [workExperience, isOpen]);

  const handleDelete = (id: number) => {
    const updated = localWorkExperience.filter((exp) => exp.id !== id);
    setLocalWorkExperience(updated);
    onUpdateLocal(updated);
  };

  const handleSave = () => {
    onSave(localWorkExperience);
    onClose();
  };

  const handleEdit = (id: number) => {
    const exp = localWorkExperience.find((e) => e.id === id);
    if (exp) {
      onEdit(id, exp);
    }
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
      title="Edit Work Experience"
      size="2xl"
      footerContent={footerContent}
    >
      <div className="space-y-4 mb-6">
        {localWorkExperience.map((exp) => (
          <div
            key={exp.id}
            className="flex items-start justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{exp.title}</h4>
              <p className="text-sm text-gray-600 mb-1">
                {exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </p>
              {exp.description && (
                <p className="text-sm text-gray-500">{exp.description}</p>
              )}
            </div>
            <div className="ml-4 flex gap-2">
              <button
                onClick={() => exp.id && handleEdit(exp.id)}
                className="p-2 text-gray-400 hover:text-savoy-blue hover:bg-savoy-blue/10 rounded-lg transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => exp.id && handleDelete(exp.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Experience Button */}
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-savoy-blue hover:text-savoy-blue hover:bg-savoy-blue/5 transition-colors"
      >
        <PlusIcon className="h-5 w-5" />
        <span className="font-medium">Add Experience</span>
      </button>
    </Modal>
  );
};

export default WorkExperienceModal;
