

import { 
  StarIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Modal from '../../../../../components/Modal';

interface ApplicantProfileData {
  id: number;
  name: string;
  initials: string;
  rating: number;
  reviewsCount: number;
  appliedDate: string;
  applicationMessage: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  skills: string[];
  workExperience: {
    position: string;
    company: string;
    period: string;
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  certifications: {
    name: string;
    verified: boolean;
  }[];
  resume: {
    filename: string;
    type: string;
  };
  reviews: {
    reviewerName: string;
    reviewerInitials: string;
    quote: string;
    date: string;
    rating: number;
  }[];
}

interface ApplicantProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  applicant: ApplicantProfileData;
  onBack: () => void;
  onMessage: (applicantId: number) => void;
  onHire: (applicantId: number) => void;
}

const ApplicantProfileModal = ({
  isOpen,
  onClose,
  jobTitle,
  applicant,
  onBack,
  onMessage,
  onHire,
}: ApplicantProfileModalProps) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) {
        return <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />;
      } else if (i === fullStars && hasHalfStar) {
        return <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />;
      } else {
        return <StarIcon key={i} className="h-4 w-4 text-gray-300" />;
      }
    });
  };

  const handleDownloadResume = () => {
    // TODO: Implement resume download
    console.log('Download resume for applicant:', applicant.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Applicants for '${jobTitle}'`}
      size="4xl"
      headerContent={
        <button
          onClick={onBack}
          className="text-sm text-savoy-blue hover:text-savoy-blue/80 font-medium mr-3"
        >
          &lt; Back to all applicants
        </button>
      }
    >
      <div className="max-h-[80vh] overflow-y-auto -mx-5 px-5">
                  {/* Applicant Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-savoy-blue flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {applicant.initials}
                      </div>

                      {/* Name and Rating */}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{applicant.name}</h2>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(applicant.rating)}
                          <span className="text-sm font-semibold text-gray-700">
                            {applicant.rating} ({applicant.reviewsCount} reviews)
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Applied: {applicant.appliedDate}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => onMessage(applicant.id)}
                        className="px-4 py-2 border border-savoy-blue text-savoy-blue bg-white rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors flex items-center gap-2"
                      >
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        Message
                      </button>
                      <button
                        onClick={() => onHire(applicant.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Hire
                      </button>
                    </div>
                  </div>

                  {/* Application Message */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-2">Application Message</h3>
                    <p className="text-sm text-gray-700">{applicant.applicationMessage}</p>
                  </div>

                  {/* Basic Information */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Basic Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{applicant.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{applicant.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{applicant.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{applicant.dateOfBirth}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Work Experience</h3>
                    <div className="space-y-3">
                      {applicant.workExperience.map((exp, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{exp.position}</p>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                            <p className="text-sm text-gray-500">{exp.period}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Education</h3>
                    <div className="space-y-3">
                      {applicant.education.map((edu, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <AcademicCapIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{edu.degree}</p>
                            <p className="text-sm text-gray-600">{edu.school}</p>
                            <p className="text-sm text-gray-500">{edu.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Certifications</h3>
                    <div className="space-y-3">
                      {applicant.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-700">{cert.name}</span>
                          </div>
                          {cert.verified && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              <CheckCircleIcon className="h-4 w-4" />
                              Verified
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resume */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Resume</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DocumentTextIcon className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{applicant.resume.filename}</p>
                          <p className="text-xs text-gray-500">{applicant.resume.type}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleDownloadResume}
                        className="px-4 py-2 border border-savoy-blue text-savoy-blue bg-white rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors flex items-center gap-2"
                      >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                        Download
                      </button>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Reviews ({applicant.reviews.length})</h3>
                    <div className="space-y-4">
                      {applicant.reviews.map((review, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {review.reviewerInitials}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900">{review.reviewerName}</span>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{review.quote}</p>
                            <p className="text-xs text-gray-500">{review.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
      </div>
    </Modal>
  );
};

export default ApplicantProfileModal;



