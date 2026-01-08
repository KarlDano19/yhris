'use client';

import { useMemo, useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

import useSearchTalentData, { type Talent } from '../../hooks/useSearchTalentData';
import FilterRequestsModal from '../hire/modals/FilterRequestsModal';
import TalentDetailsModal from './modals/TalentDetailsModal';
import JobChatModal from '../find-work/modals/JobChatModal';
import BookNowModal from './modals/BookNowModal';

const Content = () => {
  const { talents } = useSearchTalentData();
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isBookNowModalOpen, setIsBookNowModalOpen] = useState(false);
  const [openedFromDetails, setOpenedFromDetails] = useState(false);

  const talentList = useMemo(() => talents, [talents]);

  const handleSelectTalent = (talent: Talent) => {
    setSelectedTalent(talent);
    setIsDetailsOpen(true);
  };

  const handleApplyFilters = (filters: {
    location: string;
    skills: string[];
    urgentOnly: boolean;
  }) => {
    // TODO: Implement filter logic
    console.log('Applied filters:', filters);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Search Talent</h2>
              <p className="text-sm text-gray-600">
                {talentList.length} {talentList.length === 1 ? 'professional' : 'professionals'} found
              </p>
            </div>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </button>
          </div>

          <div className="space-y-4">
            {talentList.map((talent: Talent) => (
              <div
                key={talent.id}
                onClick={() => handleSelectTalent(talent)}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center text-lg font-semibold">
                        {talent.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 flex items-center justify-center">
                        <span className="text-xs text-white">★</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{talent.name}</h3>
                        <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">{talent.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold text-gray-900">{talent.rating.toFixed(1)}</span>
                        <span className="text-gray-500">({talent.reviews} reviews)</span>
                        <span className="mx-2 h-1 w-1 rounded-full bg-gray-300" />
                        <span className="text-gray-600">{talent.jobsDone} jobs done</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{talent.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="text-base font-semibold text-green-700">
                      ₱{talent.hourlyMin.toLocaleString()} - ₱{talent.hourlyMax.toLocaleString()}/hr
                    </p>
                    {talent.availability && (
                      <div className="mt-2">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                          {talent.availability}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {talent.skills.slice(0, 4).map((skill: string) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                      {skill}
                    </span>
                  ))}
                  {talent.skills.length > 4 && (
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                      +{talent.skills.length - 4}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setSelectedTalent(talent);
                      setOpenedFromDetails(false);
                      setIsChatModalOpen(true);
                    }}
                    className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
                  >
                    Message
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTalent(talent);
                      setOpenedFromDetails(false);
                      setIsBookNowModalOpen(true);
                    }}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Page-specific Modals */}
      <FilterRequestsModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Talent Details Modal */}
      {selectedTalent && (
        <TalentDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedTalent(null);
            setOpenedFromDetails(false);
          }}
          talent={selectedTalent}
          onMessage={() => {
            setIsDetailsOpen(false);
            setOpenedFromDetails(true);
            setIsChatModalOpen(true);
          }}
          onBookNow={() => {
            setIsDetailsOpen(false);
            setOpenedFromDetails(true);
            setIsBookNowModalOpen(true);
          }}
        />
      )}

      {/* Chat Modal */}
      {selectedTalent && (
        <JobChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            if (openedFromDetails) {
              setIsDetailsOpen(true);
              setOpenedFromDetails(false);
            } else {
              setSelectedTalent(null);
            }
          }}
          clientName={selectedTalent.name}
          clientInitials={selectedTalent.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()}
          jobTitle={selectedTalent.title}
        />
      )}

      {/* Book Now Modal */}
      {selectedTalent && (
        <BookNowModal
          isOpen={isBookNowModalOpen}
          onClose={() => {
            setIsBookNowModalOpen(false);
            if (openedFromDetails) {
              setIsDetailsOpen(true);
              setOpenedFromDetails(false);
            } else {
              setSelectedTalent(null);
            }
          }}
          talent={selectedTalent}
          onConfirm={(bookingData) => {
            // TODO: Handle booking submission
            console.log('Booking data:', bookingData);
            setIsBookNowModalOpen(false);
            if (openedFromDetails) {
              setIsDetailsOpen(true);
              setOpenedFromDetails(false);
            } else {
              setSelectedTalent(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default Content;

