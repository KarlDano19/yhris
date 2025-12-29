'use client';

import Modal from '../../../../../components/Modal';
import { PlusIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface Portfolio {
  id: number;
  title: string;
  image: string;
  type: string;
  link: string;
  description?: string;
}

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio[];
  onEdit: (id: number) => void;
  onAdd: () => void;
  onSave: (data: Portfolio[]) => void;
}

const PortfolioModal = ({ isOpen, onClose, portfolio, onEdit, onAdd, onSave }: PortfolioModalProps) => {
  const handleSave = () => {
    onSave(portfolio);
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
      title="Edit Portfolio"
      size="2xl"
      footerContent={footerContent}
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        {portfolio.map((project) => (
          <div
            key={project.id}
            className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onEdit(project.id)}
          >
            <div className="text-4xl mb-3 text-center">{project.image}</div>
            <h4 className="font-semibold text-gray-900 mb-1">{project.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{project.type}</p>
            {project.description && (
              <p className="text-sm text-gray-500 mb-3">{project.description}</p>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm text-savoy-blue hover:underline"
              >
                View Project
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Add Project Button */}
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-savoy-blue hover:text-savoy-blue hover:bg-savoy-blue/5 transition-colors"
      >
        <PlusIcon className="h-5 w-5" />
        <span className="font-medium">Add Project</span>
      </button>
    </Modal>
  );
};

export default PortfolioModal;
