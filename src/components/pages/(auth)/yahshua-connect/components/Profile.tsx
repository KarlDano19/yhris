'use client';

import { useState } from 'react';
import { 
  PencilIcon, 
  CheckIcon, 
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { useProfileData, type EmploymentDocument, type WorkExperience, type Education, type Certification, type PortfolioItem } from '../hooks/useProfileData';

interface BasicInformation {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

interface ProfileProps {
  mode?: 'personal' | 'business';
  basicInfo?: BasicInformation;
  onSave?: (data: BasicInformation) => void;
}

const Profile = ({ 
  mode = 'personal',
  basicInfo = {
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+63 912 345 6789',
    location: 'Cagayan de Oro, Philippines',
  },
  onSave
}: ProfileProps) => {
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [basicInfoData, setBasicInfoData] = useState<BasicInformation>(basicInfo);

  // Get data from hook
  const { documents: initialDocuments, workExperience: initialWorkExperience, education: initialEducation, skills: initialSkills, certifications: initialCertifications, portfolio: initialPortfolio } = useProfileData();

  // Employment Documents
  const [documents] = useState<EmploymentDocument[]>(initialDocuments);

  // Work Experience
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(initialWorkExperience);
  const [isAddingWorkExperience, setIsAddingWorkExperience] = useState(false);
  const [editingWorkExpId, setEditingWorkExpId] = useState<number | null>(null);

  // Education
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<number | null>(null);

  // Skills & Certifications
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [isAddingCertification, setIsAddingCertification] = useState(false);

  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);

  const handleBasicInfoEdit = () => {
    setIsEditingBasicInfo(true);
  };

  const handleBasicInfoSave = () => {
    if (onSave) {
      onSave(basicInfoData);
    }
    setIsEditingBasicInfo(false);
  };

  const handleBasicInfoChange = (field: keyof BasicInformation, value: string) => {
    setBasicInfoData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadDocument = (documentId: number) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf';
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (file.type !== 'application/pdf') {
          alert('Please upload a PDF file');
          return;
        }
        
        if (file.size > maxSize) {
          alert('File size must be less than 5MB');
          return;
        }
        
        // TODO: Implement document upload to backend
        console.log('Upload document:', documentId, file);
        alert(`Document "${file.name}" will be uploaded (implementation pending)`);
      }
    };
    fileInput.click();
  };

  const handleDeleteWorkExperience = (id: number) => {
    setWorkExperience(prev => prev.filter(exp => exp.id !== id));
  };

  const handleDeleteEducation = (id: number) => {
    setEducation(prev => prev.filter(edu => edu.id !== id));
  };

  const handleDeleteCertification = (id: number) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
  };

  const handleDeletePortfolio = (id: number) => {
    setPortfolio(prev => prev.filter(item => item.id !== id));
  };

  const getPortfolioIcon = (icon: 'cart' | 'building') => {
    if (icon === 'cart') {
      return (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
          <button
            onClick={isEditingBasicInfo ? handleBasicInfoSave : handleBasicInfoEdit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isEditingBasicInfo ? 'Save changes' : 'Edit basic information'}
          >
            {isEditingBasicInfo ? (
              <CheckIcon className="h-5 w-5 text-green-600" />
            ) : (
              <PencilIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditingBasicInfo ? (
                <input
                  type="text"
                  value={basicInfoData.fullName}
                  onChange={(e) => handleBasicInfoChange('fullName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                />
              ) : (
                <p className="text-sm text-gray-900">{basicInfoData.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              {isEditingBasicInfo ? (
                <input
                  type="tel"
                  value={basicInfoData.phone}
                  onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                />
              ) : (
                <p className="text-sm text-gray-900">{basicInfoData.phone}</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {isEditingBasicInfo ? (
                <input
                  type="email"
                  value={basicInfoData.email}
                  onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                />
              ) : (
                <p className="text-sm text-gray-900">{basicInfoData.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              {isEditingBasicInfo ? (
                <input
                  type="text"
                  value={basicInfoData.location}
                  onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
                />
              ) : (
                <p className="text-sm text-gray-900">{basicInfoData.location}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Employment Documents Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Employment Documents</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <PencilIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">Upload documents required for employment verification</p>
        
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">Required</p>
                </div>
              </div>
              <button
                onClick={() => handleUploadDocument(doc.id)}
                className="px-4 py-2 bg-savoy-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Work Experience Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Work Experience</h2>
          <button
            onClick={() => setIsAddingWorkExperience(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          {workExperience.map((exp) => (
            <div key={exp.id} className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{exp.position}</p>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.period}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingWorkExpId(exp.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <PencilIcon className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteWorkExperience(exp.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Education</h2>
          <button
            onClick={() => setIsAddingEducation(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
              <AcademicCapIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{edu.degree}</p>
                <p className="text-sm text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-500">{edu.period}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingEducationId(edu.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <PencilIcon className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteEducation(edu.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Certifications Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Skills & Certifications</h2>
          <button
            onClick={() => setIsEditingSkills(!isEditingSkills)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <PencilIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Skills</label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200"
              >
                {skill}
                {isEditingSkills && (
                  <button
                    onClick={() => setSkills(prev => prev.filter((_, i) => i !== index))}
                    className="ml-2 text-blue-700 hover:text-blue-900"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
            {isEditingSkills && (
              <button className="px-3 py-1.5 border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-full hover:border-savoy-blue hover:text-savoy-blue">
                + Add Skill
              </button>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">Certifications</label>
            <button
              onClick={() => setIsAddingCertification(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <PlusIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                    <p className="text-xs text-gray-500">{cert.issuer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {cert.verified && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      <CheckCircleIcon className="h-4 w-4" />
                      Verified
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteCertification(cert.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Portfolio</h2>
          <button
            onClick={() => setIsAddingPortfolio(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {portfolio.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                {getPortfolioIcon(item.icon)}
                <button
                  onClick={() => handleDeletePortfolio(item.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4 text-red-600" />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{item.type}</p>
              <a
                href={item.url}
                className="text-sm text-savoy-blue hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
