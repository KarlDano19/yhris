

import { useState, useEffect } from 'react';
import Modal from '../../../../../components/Modal';
import { XMarkIcon, PencilIcon, PlusIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Certification {
  id: number;
  name: string;
  issuer: string;
  verified: boolean;
  issuedDate?: string;
  expiresDate?: string;
  idNumber?: string;
}

interface SkillsAndCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: string[];
  certifications: Certification[];
  onSave: (skills: string[], certifications: Certification[]) => void;
  onAddCertification: () => void;
}

const SkillsAndCertificationModal = ({
  isOpen,
  onClose,
  skills: initialSkills,
  certifications: initialCertifications,
  onSave,
  onAddCertification,
}: SkillsAndCertificationModalProps) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'certifications'>('skills');
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    setSkills(initialSkills);
    setCertifications(initialCertifications);
  }, [initialSkills, initialCertifications, isOpen]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleEditCertification = (id: number) => {
    // This would typically open another modal or form
    console.log('Edit certification', id);
  };

  const handleDeleteCertification = (id: number) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
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
      <div className="flex border-b border-gray-200 -mt-5 -mx-5 mb-5">
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'skills'
              ? 'bg-savoy-blue text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Skills
        </button>
        <button
          onClick={() => setActiveTab('certifications')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
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
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
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
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => handleEditCertification(cert.id)}
                    className="p-2 text-gray-400 hover:text-savoy-blue hover:bg-savoy-blue/10 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCertification(cert.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
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
    </Modal>
  );
};

export default SkillsAndCertificationModal;
