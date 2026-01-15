'use client';

import Image from 'next/image';
import { BuildingOfficeIcon, BoltIcon, UserGroupIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from '@/helpers/classNames';
import LoginRequiredModal from './modals/LoginRequiredModal';
import JobFilter from './components/JobFilter';

// Company Jobs Components
import JobCard from './components/tabs/company-jobs/JobCard';
import JobDetails from './components/tabs/company-jobs/JobDetails';

// Gig Opportunities Components
import GigCard from './components/tabs/gig-opportunities/GigCard';
import GigDetails from './components/tabs/gig-opportunities/GigDetails';
import { type GigOpportunity } from './hooks/GigOpportunity';

// Hire Talent Components
import TalentCard from './components/tabs/hire-talent/TalentCard';
import TalentDetails from './components/tabs/hire-talent/TalentDetails';
import { type Talent } from './hooks/HireTalentDummy';

import jobIllustration from '@/assets/find-job-illustration.svg';

type TabType = 'company-jobs' | 'gig-opportunities' | 'hire-talent';

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  
  // Company Jobs Props
  hasJob: boolean;
  isJobView: boolean;
  isJobModalOpen: boolean;
  selectedJobId: any;
  filteredJobs: any[];
  displayCount: number;
  isGetJobsLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  openJobDetails: (jobId: any) => void;
  closeJobDetails: () => void;
  handleLoadMoreJobs: () => void;
  
  // Gig Opportunities Props
  hasGig: boolean;
  isGigView: boolean;
  isGigModalOpen: boolean;
  selectedGigId: number | null;
  filteredGigs: GigOpportunity[];
  displayCountGig: number;
  selectedGig: GigOpportunity | undefined;
  openGigDetails: (gigId: number) => void;
  closeGigDetails: () => void;
  handleLoadMoreGigs: () => void;
  handleSendProposal: () => void;
  isLoginModalOpenGig: boolean;
  setIsLoginModalOpenGig: (open: boolean) => void;
  
  // Hire Talent Props
  hasTalent: boolean;
  isTalentView: boolean;
  isTalentModalOpen: boolean;
  selectedTalentId: number | null;
  filteredTalents: Talent[];
  displayCountTalent: number;
  selectedTalent: Talent | undefined;
  openTalentDetails: (talentId: number) => void;
  closeTalentDetails: () => void;
  handleLoadMoreTalents: () => void;
  handleBookNow: () => void;
  isLoginModalOpenTalent: boolean;
  setIsLoginModalOpenTalent: (open: boolean) => void;
  loginModalAction: 'book' | 'message';
  
  // Filter Props
  filteredCount: number;
  filters: any;
  onFiltersChange: (filters: any) => void;
  onApplyFilters: (filters: any) => void;
}

const Tabs = ({
  activeTab,
  onTabChange,
  // Company Jobs
  hasJob,
  isJobView,
  isJobModalOpen,
  selectedJobId,
  filteredJobs,
  displayCount,
  isGetJobsLoading,
  hasNextPage,
  isFetchingNextPage,
  openJobDetails,
  closeJobDetails,
  handleLoadMoreJobs,
  // Gig Opportunities
  hasGig,
  isGigView,
  isGigModalOpen,
  selectedGigId,
  filteredGigs,
  displayCountGig,
  selectedGig,
  openGigDetails,
  closeGigDetails,
  handleLoadMoreGigs,
  handleSendProposal,
  isLoginModalOpenGig,
  setIsLoginModalOpenGig,
  // Hire Talent
  hasTalent,
  isTalentView,
  isTalentModalOpen,
  selectedTalentId,
  filteredTalents,
  displayCountTalent,
  selectedTalent,
  openTalentDetails,
  closeTalentDetails,
  handleLoadMoreTalents,
  handleBookNow,
  isLoginModalOpenTalent,
  setIsLoginModalOpenTalent,
  loginModalAction,
  // Filter Props
  filteredCount,
  filters,
  onFiltersChange,
  onApplyFilters,
}: TabsProps) => {
  const tabs = [
    {
      id: 'company-jobs' as TabType,
      label: 'Company Jobs',
      icon: BuildingOfficeIcon,
      description: 'Traditional employment opportunities',
      bgColor: 'bg-gray-200',
      textColor: 'text-black-700',
    },
    {
      id: 'gig-opportunities' as TabType,
      label: 'Gig Opportunities',
      icon: BoltIcon,
      description: 'Project-based work from individuals — Posted by individuals through YAHSHUA Connect',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      id: 'hire-talent' as TabType,
      label: 'Hire Talent',
      icon: UserGroupIcon,
      description: 'Find professionals for your needs — Professionals available for booking',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  // Render empty state
  const renderEmptyState = () => (
    <div className='w-auto h-[220px] md:w-[600px] md:h-[400px] relative block mx-auto mt-8'>
      <Image src={jobIllustration} fill alt='Find job illustration' />
    </div>
  );

  return (
    <>
      {/* Tab Navigation */}
      <div className="max-w-7xl px-4 sm:px-6 mx-auto">
        <div className="px-4 lg:px-5">
          <div className="flex space-x-6 md:space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={classNames(
                    'flex items-center gap-2 pb-3 border-b-2 transition-colors',
                    isActive
                      ? 'border-green-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                  type="button"
                >
                  <Icon
                    className={classNames(
                      'h-5 w-5',
                      isActive ? 'text-gray-900' : 'text-gray-500'
                    )}
                  />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Tab Description */}
          {activeTabData && (
            <div className={classNames("mt-3 px-3 py-2 rounded-md", activeTabData.bgColor)}>
              <p className={classNames("text-sm", activeTabData.textColor)}>
                {activeTabData.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Job Filter Component - Below Tab Description */}
      {hasJob && (
        <div className="mt-4">
          <JobFilter 
            activeTab={activeTab} 
            filteredCount={filteredCount}
            filters={filters}
            onFiltersChange={onFiltersChange}
            onApplyFilters={onApplyFilters}
          />
          <div className='border-t border-gray-300 mt-4'></div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'company-jobs' && (
        <>
          {!hasJob ? (
            renderEmptyState()
          ) : (
            <div className='mt-4'>
              <div className='max-w-7xl px-4 sm:px-6 mx-auto'>
                <div className='px-4 lg:px-5'>
                  <div className='lg:flex lg:items-start lg:relative'>
                    <style dangerouslySetInnerHTML={{__html: `
                      .job-list-container::-webkit-scrollbar {
                        display: none;
                      }
                      .job-list-container {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                      }
                    `}} />
                    <div
                      className={classNames(
                        'job-list-container lg:border-r lg:border-gray-300 lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto transition-all duration-300 ease-in-out',
                        isJobView ? 'lg:w-[36%]' : 'lg:w-full'
                      )}
                    >
                      <div className='lg:pl-5 lg:pr-10 py-8 lg:py-10 grid md:grid-cols-2 lg:grid-cols-1 md:gap-x-4 lg:gap-x-4 gap-y-6'>
                        {!isGetJobsLoading
                          ? filteredJobs.slice(0, displayCount).map((job: any) => (
                              <JobCard
                                key={job.id}
                                job={job}
                                isSelected={selectedJobId === job.id}
                                isJobView={isJobView}
                                isJobModalOpen={isJobModalOpen}
                                onJobClick={openJobDetails}
                                onCloseDetails={closeJobDetails}
                              />
                            ))
                          : 'Loading jobs...'}
                        {/* Load More Button */}
                        {(displayCount < filteredJobs.length || hasNextPage) && (
                          <div className="flex justify-center py-6">
                            <button
                              onClick={handleLoadMoreJobs}
                              disabled={isFetchingNextPage}
                              className="rounded-md bg-savoy-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isFetchingNextPage ? (
                                <span className="flex items-center">
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Loading...
                                </span>
                              ) : (
                                'Load More Jobs'
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={classNames(
                        'lg:pl-10 lg:pr-5 py-10 lg:w-[64%] lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto lg:absolute lg:right-0 lg:top-0 lg:h-full transition-transform duration-300 ease-in-out z-10',
                        isJobView
                          ? 'lg:translate-x-0'
                          : 'lg:translate-x-full'
                      )}
                      style={{
                        visibility: isJobView ? 'visible' : 'hidden',
                      }}
                    >
                      <div className='card border border-savoy-blue rounded-md'>
                        <div className='flex justify-end px-3 mt-2'>
                          <button onClick={closeJobDetails}>
                            <XMarkIcon className='h-5 w-5 text-indigo-dye' />
                          </button>
                        </div>
                        <JobDetails jobId={selectedJobId} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {activeTab === 'gig-opportunities' && (
        <>
          {!hasGig ? (
            renderEmptyState()
          ) : (
            <div className='mt-4'>
              <div className='max-w-7xl px-4 sm:px-6 mx-auto'>
                <div className='px-4 lg:px-5'>
                  <div className='lg:flex lg:items-start lg:relative'>
                    <style dangerouslySetInnerHTML={{__html: `
                      .gig-list-container::-webkit-scrollbar {
                        display: none;
                      }
                      .gig-list-container {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                      }
                    `}} />
                    <div
                      className={classNames(
                        'gig-list-container lg:border-r lg:border-gray-300 lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto transition-all duration-300 ease-in-out',
                        isGigView ? 'lg:w-[36%]' : 'lg:w-full'
                      )}
                    >
                      <div className='lg:pl-5 lg:pr-10 py-8 lg:py-10 grid md:grid-cols-2 lg:grid-cols-1 md:gap-x-4 lg:gap-x-4 gap-y-6'>
                        {filteredGigs.slice(0, displayCountGig).map((gig: GigOpportunity) => (
                          <GigCard
                            key={gig.id}
                            gig={gig}
                            isSelected={selectedGigId === gig.id}
                            isGigView={isGigView}
                            isGigModalOpen={isGigModalOpen}
                            onGigClick={openGigDetails}
                            onCloseDetails={closeGigDetails}
                            onSendProposal={handleSendProposal}
                          />
                        ))}
                        {/* Load More Button */}
                        {displayCountGig < filteredGigs.length && (
                          <div className="flex justify-center py-6">
                            <button
                              onClick={handleLoadMoreGigs}
                              className="rounded-md bg-savoy-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              Load More Gigs
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={classNames(
                        'lg:pl-10 lg:pr-5 py-10 lg:w-[64%] lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto lg:absolute lg:right-0 lg:top-0 lg:h-full transition-transform duration-300 ease-in-out z-10',
                        isGigView
                          ? 'lg:translate-x-0'
                          : 'lg:translate-x-full'
                      )}
                      style={{
                        visibility: isGigView ? 'visible' : 'hidden',
                      }}
                    >
                      <div className='card border border-savoy-blue rounded-md'>
                        <div className='flex justify-end px-3 mt-2'>
                          <button onClick={closeGigDetails}>
                            <XMarkIcon className='h-5 w-5 text-indigo-dye' />
                          </button>
                        </div>
                        {selectedGig && (
                          <GigDetails
                            gig={selectedGig}
                            onClose={closeGigDetails}
                            onSendProposal={handleSendProposal}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Login Required Modal */}
          <LoginRequiredModal
            isOpen={isLoginModalOpenGig}
            onClose={() => setIsLoginModalOpenGig(false)}
            action="proposal"
            tab="gig-opportunities"
          />
        </>
      )}
      {activeTab === 'hire-talent' && (
        <>
          {!hasTalent ? (
            renderEmptyState()
          ) : (
            <div className='mt-4'>
              <div className='max-w-7xl px-4 sm:px-6 mx-auto'>
                <div className='px-4 lg:px-5'>
                  <div className='lg:flex lg:items-start lg:relative'>
                    <style dangerouslySetInnerHTML={{__html: `
                      .talent-list-container::-webkit-scrollbar {
                        display: none;
                      }
                      .talent-list-container {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                      }
                    `}} />
                    <div
                      className={classNames(
                        'talent-list-container lg:border-r lg:border-gray-300 lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto transition-all duration-300 ease-in-out',
                        isTalentView ? 'lg:w-[36%]' : 'lg:w-full'
                      )}
                    >
                      <div className='lg:pl-5 lg:pr-10 py-8 lg:py-10 grid md:grid-cols-2 lg:grid-cols-1 md:gap-x-4 lg:gap-x-4 gap-y-6'>
                        {filteredTalents.slice(0, displayCountTalent).map((talent: Talent) => (
                          <TalentCard
                            key={talent.id}
                            talent={talent}
                            isSelected={selectedTalentId === talent.id}
                            isTalentView={isTalentView}
                            isTalentModalOpen={isTalentModalOpen}
                            onTalentClick={openTalentDetails}
                            onCloseDetails={closeTalentDetails}
                            onBookNow={handleBookNow}
                          />
                        ))}
                        {/* Load More Button */}
                        {displayCountTalent < filteredTalents.length && (
                          <div className="flex justify-center py-6">
                            <button
                              onClick={handleLoadMoreTalents}
                              className="rounded-md bg-savoy-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              Load More Talents
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={classNames(
                        'lg:pl-10 lg:pr-5 py-10 lg:w-[64%] lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto lg:absolute lg:right-0 lg:top-0 lg:h-full transition-transform duration-300 ease-in-out z-10',
                        isTalentView
                          ? 'lg:translate-x-0'
                          : 'lg:translate-x-full'
                      )}
                      style={{
                        visibility: isTalentView ? 'visible' : 'hidden',
                      }}
                    >
                      <div className='card border border-green-500 rounded-md'>
                        <div className='flex justify-end px-3 mt-2'>
                          <button onClick={closeTalentDetails}>
                            <XMarkIcon className='h-5 w-5 text-indigo-dye' />
                          </button>
                        </div>
                        {selectedTalent && (
                          <TalentDetails
                            talent={selectedTalent}
                            onClose={closeTalentDetails}
                            onBookNow={handleBookNow}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Login Required Modal */}
          <LoginRequiredModal
            isOpen={isLoginModalOpenTalent}
            onClose={() => setIsLoginModalOpenTalent(false)}
            action={loginModalAction}
            tab="hire-talent"
          />
        </>
      )}
    </>
  );
};

export default Tabs;
