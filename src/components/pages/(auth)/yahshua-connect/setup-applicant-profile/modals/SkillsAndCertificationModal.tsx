import { useState, useEffect } from 'react';

import { XMarkIcon, PlusIcon, CheckIcon, DocumentIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import AddCertificationModal from './AddCertificationModal';
import ViewDocumentModal from './ViewDocumentModal';

import { T_Certification } from '@/types/personal-mode';

interface SkillsAndCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: string[];
  certifications: T_Certification[];
  onSave: (skills: string[], certifications: T_Certification[]) => void;
}

const SkillsAndCertificationModal = ({
  isOpen,
  onClose,
  skills: initialSkills,
  certifications: initialCertifications,
  onSave,
}: SkillsAndCertificationModalProps) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'certifications'>('skills');
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [certifications, setCertifications] = useState<T_Certification[]>(initialCertifications);
  const [newSkill, setNewSkill] = useState('');
  const [isAddCertModalOpen, setIsAddCertModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<T_Certification | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSkills(initialSkills);
      setCertifications(initialCertifications);
    }
  }, [initialSkills, initialCertifications, isOpen]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleOpenAddCertModal = () => {
    setEditingCertification(null);
    setIsAddCertModalOpen(true);
  };

  const handleOpenEditCertModal = (certification: T_Certification) => {
    setEditingCertification(certification);
    setIsAddCertModalOpen(true);
  };

  const handleCertificationSave = (certification: T_Certification) => {
    if (editingCertification) {
      // Update existing certification
      setCertifications(
        certifications.map((cert) =>
          cert.id === certification.id ? certification : cert
        )
      );
    } else {
      // Add new certification
      setCertifications([...certifications, certification]);
    }
  };

  const handleDeleteCertification = (id: number) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
  };

  const handleSave = () => {
    onSave(skills, certifications);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Edit Skills & Certifications</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 px-5 pt-5">
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors rounded-t-lg ${
                activeTab === 'skills'
                  ? 'bg-savoy-blue text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Skills
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('certifications')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors rounded-t-lg ${
                activeTab === 'certifications'
                  ? 'bg-savoy-blue text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Certifications
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            {activeTab === 'skills' ? (
              <div className="space-y-4">
                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 min-h-[60px]">
                  {skills.length === 0 ? (
                    <p className="text-gray-400 text-sm">No skills added yet. Add your first skill below.</p>
                  ) : (
                    skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-savoy-blue rounded-lg text-sm font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Skill Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleSkillInputKeyDown}
                    placeholder="Add a skill (press Enter or Tab to add)..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
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
                {certifications.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No certifications added yet. Click below to add your first certification.</p>
                ) : (
                  certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
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
                            type="button"
                            onClick={() => handleOpenEditCertModal(cert)}
                            className="cursor-pointer"
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            onClick={() => cert.id && handleDeleteCertification(cert.id)}
                            className="cursor-pointer"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Add Certification Button */}
                <button
                  type="button"
                  onClick={handleOpenAddCertModal}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-savoy-blue hover:text-savoy-blue hover:bg-savoy-blue/5 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="font-medium">Add Certification</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
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
        </div>
      </div>

      {/* Add Certification Modal */}
      <AddCertificationModal
        isOpen={isAddCertModalOpen}
        onClose={() => setIsAddCertModalOpen(false)}
        initialData={editingCertification}
        onSave={handleCertificationSave}
      />

      {/* View Document Modal */}
      {viewingDocument && (
        <ViewDocumentModal
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          documentName={viewingDocument.name}
          fileUrl={viewingDocument.url}
        />
      )}
    </div>
  );
};

export default SkillsAndCertificationModal;
