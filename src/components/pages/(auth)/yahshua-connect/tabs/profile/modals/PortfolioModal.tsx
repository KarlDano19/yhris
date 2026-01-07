import { useState, useEffect } from 'react';

import Modal from '../../../components/Modal';

import { PlusIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import ViewDocumentModal from './ViewDocumentModal';

import { T_Portfolio } from '@/types/personal-mode';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: T_Portfolio[];
  onEdit: (id: number, project: T_Portfolio) => void;
  onAdd: () => void;
  onSave: (data: T_Portfolio[]) => void;
  onUpdateLocal: (data: T_Portfolio[]) => void;
}

const PortfolioModal = ({ isOpen, onClose, portfolio, onEdit, onAdd, onSave, onUpdateLocal }: PortfolioModalProps) => {
  const [localPortfolio, setLocalPortfolio] = useState<T_Portfolio[]>(portfolio);
  const [viewingDocument, setViewingDocument] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    setLocalPortfolio(portfolio);
  }, [portfolio, isOpen]);

  const handleDelete = (id: number) => {
    const updated = localPortfolio.filter((project) => project.id !== id);
    setLocalPortfolio(updated);
    onUpdateLocal(updated);
  };

  const handleSave = () => {
    onSave(localPortfolio);
    onClose();
  };

  const handleEdit = (id: number) => {
    const project = localPortfolio.find((p) => p.id === id);
    if (project) {
      onEdit(id, project);
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
      title="Edit Portfolio"
      size="2xl"
      footerContent={footerContent}
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        {localPortfolio.map((project) => (
          <div
            key={project.id}
            className="relative p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
          >
            {project.image || project.imageUrl ? (
              <div className="mb-3 cursor-pointer" onClick={() => setViewingDocument({ name: project.name, url: project.imageUrl || project.image! })}>
                <img
                  src={project.imageUrl || project.image}
                  alt={project.name}
                  className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity"
                />
              </div>
            ) : (
              <div className="text-4xl mb-3 text-center text-gray-300">📷</div>
            )}
            <h4 className="font-semibold text-gray-900 mb-2">{project.name}</h4>
            {project.description && (
              <p className="text-sm text-gray-500 mb-3">{project.description}</p>
            )}
            <div className="flex items-center justify-between">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-savoy-blue hover:underline"
                >
                  View Project
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => project.id && handleEdit(project.id)}
                  className="cursor-pointer"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => project.id && handleDelete(project.id)}
                  className="cursor-pointer"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
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

      {viewingDocument && (
        <ViewDocumentModal
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          documentName={viewingDocument.name}
          fileUrl={viewingDocument.url}
        />
      )}
    </Modal>
  );
};

export default PortfolioModal;
