'use client';

import { useMemo, useState, useEffect } from 'react';
import { FunnelIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

import type { Talent } from '@/types/business-mode';
import useSearchTalent from './hooks/useSearchTalent';
import FilterRequestsModal from '../../components/FilterRequestsModal';
import useBusinessModeFilters from '../../../../hooks/useBusinessModeFilters';
import TalentDetailsModal from './modals/TalentDetailsModal';
import ChatMessagesModal from '@/components/common/chat/ChatMessagesModal';
import BookNowModal from './modals/BookNowModal';
import LoadingSpinner from '@/components/LoadingSpinner';

const Content = () => {
  const {
    data: talentData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalRecords
  } = useSearchTalent();
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isBookNowModalOpen, setIsBookNowModalOpen] = useState(false);
  const [openedFromDetails, setOpenedFromDetails] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Transform API data to match frontend Talent type
  const talentList = useMemo(() => {
    if (!talentData?.records) return [];

    return talentData.records.map(talent => {
      return {
        id: talent.id,
        name: talent.name || `${talent.firstname} ${talent.lastname}`,
        title: talent.education || talent.description || 'Professional',
        rating: talent.average_rating || 0,
        reviews: talent.reviews_count || 0,
        jobsDone: talent.jobs_done_count || 0,
        location: talent.address || 'Location not specified',
        skills: talent.skills || [],
        languages: ['English', 'Filipino'], // Default languages, API doesn't provide this field
        availability: talent.available_for_bookings ? 'Available Now' : undefined,
        education: talent.education,
        about: talent.description,
        // Pass additional fields for modals
        email: talent.email,
        mobile: talent.mobile,
        photo: talent.photo,
        portfolio_url: talent.portfolio_url,
        description: talent.description,
        setup_preference: talent.setup_preference,
        expected_salary: talent.expected_salary,
      } as Talent;
    });
  }, [talentData]);

  // Derive available skills from the talent list (unique, sorted)
  const availableSkills = useMemo(() => {
    const all = talentList.flatMap((t) => t.skills || []);
    const unique = Array.from(new Set(all.filter(Boolean)));
    return unique.sort((a, b) => a.localeCompare(b));
  }, [talentList]);

  const handleSelectTalent = (talent: Talent) => {
    setSelectedTalent(talent);
    setIsDetailsOpen(true);
  };

  const { filters, applyFromModal } = useBusinessModeFilters();

  const handleApplyFilters = (payload: {
    location?: string;
    category?: string;
    skills?: string[];
    urgentOnly?: boolean;
  }) => {
    applyFromModal(payload);
    setIsFilterModalOpen(false);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down more than 300px
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="space-y-6">
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-50 bg-savoy-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUpIcon className="h-5 w-5" strokeWidth={2.5} />
        </button>
      )}

      {isLoading ? (
        <LoadingSpinner size="lg" showText text="Loading talents..." className="py-12" />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Search Talent</h2>
              <p className="text-sm text-gray-600">
                Showing {talentList.length} of {totalRecords || 0} {totalRecords === 1 ? 'professional' : 'professionals'}
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

          {talentList.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">No talents found. Try adjusting your search filters.</div>
            </div>
          ) : (
            <>
            <div className="space-y-4">
              {talentList.map((talent: Talent) => (
              <div
                key={talent.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {talent.photo ? (
                        <img
                          src={talent.photo}
                          alt={talent.name}
                          className="h-14 w-14 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center text-lg font-semibold">
                          {talent.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
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
                    <p className="text-sm text-gray-600">Expected Salary</p>
                    <p className="text-base font-semibold text-green-700">
                      {talent.expected_salary
                        ? `₱${talent.expected_salary.toLocaleString()}/month`
                        : 'Not specified'
                      }
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

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleSelectTalent(talent)}
                    className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTalent(talent);
                      setOpenedFromDetails(false);
                      setIsChatModalOpen(true);
                    }}
                    className="flex-1 px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
                  >
                    Message
                  </button>
                  
                  {/* Hide for now */}
                  {/* <button
                    onClick={() => {
                      setSelectedTalent(talent);
                      setOpenedFromDetails(false);
                      setIsBookNowModalOpen(true);
                    }}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Book Now
                  </button> */}
                </div>
              </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More Talent'}
                </button>
              </div>
            )}
            </>
          )}
        </div>
      )}

      {/* Page-specific Modals */}
      <FilterRequestsModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialUrgentOnly={!!filters?.is_urgent}
        showSkills={true}
        availableSkills={availableSkills}
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
        <ChatMessagesModal
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
          recipientId={selectedTalent.id}
          recipientName={selectedTalent.name}
          recipientInitials={selectedTalent.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()}
          recipientPhoto={selectedTalent.photo || null}
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

