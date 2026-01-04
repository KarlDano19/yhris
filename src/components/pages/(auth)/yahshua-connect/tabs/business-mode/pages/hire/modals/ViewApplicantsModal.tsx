'use client';

import { useState } from 'react';
import Modal from '../../../../../components/Modal';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { Applicant } from '../../../hooks/useHireData';

interface ViewApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  applicants: Applicant[];
  onViewProfile?: (applicantId: number) => void;
  onHire?: (applicantId: number) => void;
}

const ViewApplicantsModal = ({
  isOpen,
  onClose,
  jobTitle,
  applicants,
  onViewProfile,
  onHire,
}: ViewApplicantsModalProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return starValue <= rating ? (
        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarIconOutline key={i} className="h-4 w-4 text-gray-300" />
      );
    });
  };

  const handleViewProfile = (applicantId: number) => {
    if (onViewProfile) {
      onViewProfile(applicantId);
    }
  };

  const handleHire = (applicantId: number) => {
    if (onHire) {
      onHire(applicantId);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Applicants for '${jobTitle}'`}
      size="2xl"
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {applicants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No applicants yet.
          </div>
        ) : (
          applicants.map((applicant) => (
            <div
              key={applicant.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {applicant.initials}
                  </div>

                  {/* Applicant Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {applicant.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        {renderStars(applicant.rating)}
                        <span className="text-sm text-gray-600 ml-1">
                          {applicant.rating} ({applicant.reviewsCount} reviews)
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {applicant.description}
                    </p>

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {applicant.services.slice(0, 4).map((service: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                      {applicant.services.length > 4 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          +{applicant.services.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Applied Date */}
                <div className="text-sm text-gray-500">
                  {applicant.appliedDate}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleViewProfile(applicant.id)}
                  className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue bg-white rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
                >
                  View Full Profile
                </button>
                <button
                  onClick={() => handleHire(applicant.id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Hire
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default ViewApplicantsModal;

