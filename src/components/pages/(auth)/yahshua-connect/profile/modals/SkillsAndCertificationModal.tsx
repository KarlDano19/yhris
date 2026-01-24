import { useState, useEffect } from 'react';

import Modal from '../../components/Modal';

import { XMarkIcon, PlusIcon, CheckIcon, DocumentIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import ViewDocumentModal from './ViewDocumentModal';

import { T_Certification } from '@/types/personal-mode';

interface SkillsAndCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: string[];
  certifications: T_Certification[];
  onSave: (skills: string[], certifications: T_Certification[]) => void;
  onAddCertification: () => void;
  onEditCertification: (certification: T_Certification) => void;
  onUpdateLocal: (skills: string[], certifications: T_Certification[]) => void;
}

const SkillsAndCertificationModal = ({
  isOpen,
  onClose,
  skills: initialSkills,
  certifications: initialCertifications,
  onSave,
  onAddCertification,
  onEditCertification,
  onUpdateLocal,
}: SkillsAndCertificationModalProps) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'certifications'>('skills');
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [certifications, setCertifications] = useState<T_Certification[]>(initialCertifications);
  const [newSkill, setNewSkill] = useState('');
  const [viewingDocument, setViewingDocument] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    setSkills(initialSkills);
    setCertifications(initialCertifications);
  }, [initialSkills, initialCertifications, isOpen]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      setNewSkill('');
      onUpdateLocal(updated, certifications);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updated);
    onUpdateLocal(updated, certifications);
  };

  const handleEditCertification = (id: number) => {
    const certification = certifications.find((cert) => cert.id === id);
    if (certification) {
      onEditCertification(certification);
    }
  };

  const handleDeleteCertification = (id: number) => {
    const updated = certifications.filter((cert) => cert.id !== id);
    setCertifications(updated);
    onUpdateLocal(skills, updated);
  };

  const handleSave = () => {
    onSave(skills, certifications);
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
      title="Edit Skills & Certifications"
      size="2xl"
      footerContent={footerContent}
    >
      {/* Tabs */}
      <div className="flex gap-2 border-gray-200 -mt-2 -mx-5 mb-5 px-5 pb-1">
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors rounded-lg ${
            activeTab === 'skills'
              ? 'bg-savoy-blue text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Skills
        </button>
        <button
          onClick={() => setActiveTab('certifications')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors rounded-lg ${
            activeTab === 'certifications'
              ? 'bg-savoy-blue text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Certifications
        </button>
      </div>

      {activeTab === 'skills' ? (
        <div className="space-y-4">
          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-savoy-blue rounded-lg text-sm font-medium"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Skill Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e: any) => {
                // Add on Enter
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
                // Treat Tab as add when there's input (isMulti behavior)
                if (e.key === 'Tab') {
                  if (newSkill.trim()) {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }
              }}
              placeholder="Add a skill..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
            />
            <button
              onClick={handleAddSkill}
              className="px-6 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Certifications List */}
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    {cert.verified && (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{cert.issuer}</p>
                  {cert.issuedDate && (
                    <p className="text-sm text-gray-500">
                      Issued: {cert.issuedDate}
                      {cert.expiresDate && ` • Expires: ${cert.expiresDate}`}
                    </p>
                  )}
                  {cert.idNumber && (
                    <p className="text-sm text-gray-500">ID: {cert.idNumber}</p>
                  )}
                  {cert.proofUrl && (
                    <button
                      type="button"
                      onClick={() => setViewingDocument({ name: cert.name, url: cert.proofUrl! })}
                      className="inline-flex items-center gap-1 text-sm text-savoy-blue hover:text-savoy-blue/80 mt-2"
                    >
                      <DocumentIcon className="h-4 w-4" />
                      <span>View Certificate Proof</span>
                      <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => cert.id && handleEditCertification(cert.id)}
                    className="cursor-pointer"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => cert.id && handleDeleteCertification(cert.id)}
                    className="cursor-pointer"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Certification Button */}
          <button
            onClick={onAddCertification}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-savoy-blue hover:text-savoy-blue hover:bg-savoy-blue/5 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-medium">Add Certification</span>
          </button>
        </div>
      )}

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

export default SkillsAndCertificationModal;
